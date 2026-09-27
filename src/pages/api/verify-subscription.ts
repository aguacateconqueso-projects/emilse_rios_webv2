import type { APIRoute } from 'astro';
import type Stripe from 'stripe';
import { stripe } from '../../lib/stripe';
import { supabaseAdmin, usuarioDeLaPeticion } from '../../lib/supabase-admin';
import { writeSubscriptionRow, subGrantsAccess } from '../../lib/stripe-sync';

/**
 * La red de seguridad contra «pagué y no entro».
 *
 * El acceso a la membresía depende de que el webhook haya escrito la fila de
 * `subscriptions`. Si el webhook no llegó, falló o tardó, quien YA pagó se
 * quedaría en la puerta. Esto le pregunta a Stripe directamente por el correo
 * de quien tiene la sesión abierta y, si tiene una suscripción vigente, la
 * espeja: la siguiente lectura del aula la deja pasar.
 *
 * Trasplantado de `emilse_rios_membresias` el 27 sep 2026, con la mudanza. Lo
 * llama el aula de la membresía (`Membresia.astro`) cuando alguien con sesión
 * no tiene la membresía al día.
 *
 * POST, con `Authorization: Bearer <token>` → `{ active: boolean }`.
 */
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!stripe) return json({ error: 'stripe_not_configured' }, 500);
  const admin = supabaseAdmin();
  if (!admin) return json({ error: 'supabase_not_configured' }, 500);

  const usuario = await usuarioDeLaPeticion(request);
  if (!usuario) return json({ error: 'no_session' }, 401);
  const email = (usuario.email || '').trim().toLowerCase();
  if (!email) return json({ active: false });

  try {
    /* Puede haber más de un customer con el mismo correo (reintentos de pago):
       se miran todos y vale la primera suscripción que dé acceso. */
    const clientes = await stripe.customers.list({ email, limit: 20 });
    let vigente: Stripe.Subscription | null = null;
    for (const c of clientes.data) {
      const subs = await stripe.subscriptions.list({ customer: c.id, status: 'all', limit: 20 });
      vigente = subs.data.find((s) => subGrantsAccess(s.status)) ?? null;
      if (vigente) break;
    }
    if (!vigente) return json({ active: false });

    await writeSubscriptionRow(admin, vigente, usuario.id);
    await stripe.customers
      .update(vigente.customer as string, { metadata: { supabase_user_id: usuario.id } })
      .catch(() => {});
    return json({ active: true });
  } catch (e) {
    console.error('[verify-subscription] error', e);
    return json({ error: 'server_error' }, 500);
  }
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
