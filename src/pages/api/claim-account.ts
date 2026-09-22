import type { APIRoute } from 'astro';
import { stripe } from '../../lib/stripe';
import { supabaseAdmin, buscarOCrearUsuario } from '../../lib/supabase-admin';
import { writeSubscriptionRow } from '../../lib/stripe-sync';

/**
 * «La contraseña al pagar» — el camino que no espera ningún correo.
 *
 * Trasplantado de `emilse_rios_membresias` (`src/pages/api/claim-account.ts`)
 * el 22 sep 2026. Stripe devuelve a `/gracias/?session_id=…` y esta ruta recibe
 * ese identificador junto con la contraseña que la compradora acaba de elegir:
 *
 *   1. le pregunta a Stripe si esa sesión de checkout está PAGADA,
 *   2. saca el correo **del propio checkout**, no del formulario,
 *   3. crea o encuentra la cuenta con el mismo criterio que el webhook,
 *   4. espeja la suscripción por si el webhook todavía no ha llegado.
 *
 * Después, el navegador inicia sesión con esa contraseña recién puesta y entra.
 *
 * ⚠️ **Dónde está la autorización, que es lo que hay que entender antes de
 * tocar esto:** en tener un `session_id` de Stripe pagado. Nadie más lo tiene.
 * Y **el correo no viaja desde el navegador** — sale de Stripe—, que es lo que
 * impide quedarse con la cuenta de otra persona escribiendo su dirección. Una
 * versión que preguntara «¿este correo pagó?» sería un secuestro de cuentas con
 * pasos extra.
 *
 * El paso 4 es el que hace que la mudanza a medias funcione: el webhook sigue
 * viviendo en la academia y puede tardar, así que acá se escribe la misma fila
 * —`writeSubscriptionRow` es un UPSERT— para que el aula la deje pasar de
 * inmediato. Si el webhook llega después, pisa con lo mismo.
 */
export const prerender = false;

/** El mismo mínimo que pide la pantalla de la contraseña nueva. */
const CLAVE_MINIMA = 8;

export const POST: APIRoute = async ({ request }) => {
  if (!stripe) return json({ error: 'stripe_not_configured' }, 500);
  const admin = supabaseAdmin();
  if (!admin) return json({ error: 'supabase_not_configured' }, 500);

  let cuerpo: any = {};
  try {
    cuerpo = await request.json();
  } catch {
    /* cuerpo vacío o inválido: cae en los dos `if` de abajo */
  }
  const sessionId = typeof cuerpo?.session_id === 'string' ? cuerpo.session_id.trim() : '';
  const clave = typeof cuerpo?.password === 'string' ? cuerpo.password : '';
  if (!sessionId) return json({ error: 'missing_session' }, 400);
  if (clave.length < CLAVE_MINIMA) return json({ error: 'weak_password' }, 400);

  try {
    const sesion = await stripe.checkout.sessions.retrieve(sessionId);

    /* Tiene que ser una suscripción COMPLETADA y pagada. `no_payment_required`
       cubre los cupones al 100 % y las pruebas; `paid` es el caso normal. */
    const completa = sesion.mode === 'subscription' && sesion.status === 'complete';
    const pagada =
      sesion.payment_status === 'paid' || sesion.payment_status === 'no_payment_required';
    if (!completa || !pagada) return json({ error: 'not_paid' }, 402);

    const email = (sesion.customer_details?.email || sesion.customer_email || '')
      .trim()
      .toLowerCase();
    if (!email) return json({ error: 'no_email' }, 422);

    const { userId } = await buscarOCrearUsuario(admin, email);
    if (!userId) return json({ error: 'account_failed' }, 500);

    const { error: errClave } = await admin.auth.admin.updateUserById(userId, {
      password: clave,
      email_confirm: true,
    });
    if (errClave) {
      console.error('[claim-account] no se pudo fijar la contraseña', errClave.message);
      return json({ error: 'set_password_failed', detail: errClave.message }, 500);
    }

    /* Espeja la suscripción ya mismo. Nada de esto es fatal: si falla, el
       webhook de la academia escribirá la misma fila cuando llegue. */
    if (sesion.subscription) {
      try {
        const sub = await stripe.subscriptions.retrieve(sesion.subscription as string);
        await writeSubscriptionRow(admin, sub, userId);
        await stripe.customers
          .update(sub.customer as string, { metadata: { supabase_user_id: userId } })
          .catch(() => {});
      } catch (e) {
        console.error('[claim-account] no se pudo espejar la suscripción', e);
      }
    }

    /* Se devuelve el correo —el que puso en Stripe— para que el navegador
       inicie sesión con él y con la contraseña recién creada. */
    return json({ ok: true, email });
  } catch (err: any) {
    console.error('[claim-account] error', err?.message || err);
    return json({ error: 'server_error' }, 500);
  }
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
