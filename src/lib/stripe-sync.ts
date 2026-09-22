import type Stripe from 'stripe';
import type { SupabaseClient } from '@supabase/supabase-js';
import { tierForPrice } from './stripe';

/**
 * Espejar una suscripción de Stripe en la tabla `subscriptions` de Supabase.
 *
 * Trasplantado de `emilse_rios_membresias` (`src/lib/stripe-sync.ts`) el 22 sep
 * 2026. Allí lo comparten el webhook y la verificación bajo demanda,
 * precisamente para que los dos caminos escriban **exactamente la misma fila**;
 * acá lo usa `/api/claim-account`, que es el tercer camino a la misma fila.
 *
 * ⚠️ **Que haya tres caminos no es un problema, y esto es lo que lo hace
 * seguro:** el `upsert` va por `stripe_subscription_id`, así que escribirla dos
 * veces —o tres, o una vez desde cada dominio— deja el mismo resultado. Es lo
 * que permite que el webhook siga viviendo en la academia mientras el checkout
 * ya vive acá: los dos escriben en el mismo Supabase y el que llegue segundo
 * pisa con lo mismo. Si algún día esto deja de ser idempotente, la mudanza a
 * medias deja de ser segura.
 */

/**
 * ¿Este estado de Stripe da acceso al aula? Solo lo que implica pago vigente.
 *
 * ⚠️ **`trialing` dice que sí acá y que no en la base de datos.** La puerta de
 * verdad es `has_active_sub()` de la migración `0001`, que solo acepta
 * `'active'`. Hoy no está roto porque Emi no ofrece pruebas; el día que las
 * ofrezca, esta función escribiría una fila `trialing` que la RLS rechaza —
 * alguien pagaría y no vería nada—. Está apuntado en `progreso.md` y se decide
 * de una vez al pasar a derechos de acceso, cambiando **los dos lados juntos**.
 */
export function subGrantsAccess(status: string | null | undefined): boolean {
  return status === 'active' || status === 'trialing';
}

/** Escribe o actualiza la fila de `subscriptions` para un `userId` ya conocido. */
export async function writeSubscriptionRow(
  admin: SupabaseClient,
  sub: Stripe.Subscription,
  userId: string,
) {
  const customerId = sub.customer as string;
  const item = sub.items.data[0] as any;
  const priceId = item?.price?.id ?? null;
  const tier = tierForPrice(priceId) || ((sub.metadata?.tier as any) ?? null);

  /* El período vive en el item con la API nueva («basil») y en el nivel
     superior con la previa. Se miran los dos para no depender de la versión
     que tenga puesta la cuenta de Stripe. */
  const periodStart = item?.current_period_start ?? (sub as any).current_period_start ?? null;
  const periodEnd = item?.current_period_end ?? (sub as any).current_period_end ?? null;

  const fila = {
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: sub.id,
    status: sub.status,
    tier,
    current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
    current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    cancel_at_period_end: sub.cancel_at_period_end ?? false,
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin
    .from('subscriptions')
    .upsert(fila, { onConflict: 'stripe_subscription_id' });
  if (error) console.error('[stripe-sync] falló el upsert', error);
  return { error };
}
