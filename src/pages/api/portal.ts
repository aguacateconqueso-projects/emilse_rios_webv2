import type { APIRoute } from 'astro';
import { stripe, siteOrigin } from '../../lib/stripe';
import { supabaseAdmin, usuarioDeLaPeticion } from '../../lib/supabase-admin';
import { membresiaPath } from '../../i18n/aula';

/**
 * El portal de cliente de Stripe: donde la miembro cambia su tarjeta o se da
 * de baja. Pide sesión, porque hay que saber de qué customer se trata.
 *
 * Trasplantado de `emilse_rios_membresias` el 27 sep 2026, con la mudanza. La
 * vuelta del portal ahora es el aula de la membresía de esta casa.
 *
 * POST `{ lang }`, con `Authorization: Bearer <token>` → `{ url }`.
 */
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!stripe) return json({ error: 'stripe_not_configured' }, 500);
  const admin = supabaseAdmin();
  if (!admin) return json({ error: 'supabase_not_configured' }, 500);

  const usuario = await usuarioDeLaPeticion(request);
  if (!usuario) return json({ error: 'no_session' }, 401);

  let cuerpo: any = {};
  try {
    cuerpo = await request.json();
  } catch {
    /* sin cuerpo: español */
  }
  const lang = cuerpo?.lang === 'en' ? 'en' : 'es';

  const { data: sub } = await admin
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', usuario.id)
    .not('stripe_customer_id', 'is', null)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!sub?.stripe_customer_id) return json({ error: 'no_customer' }, 400);

  const sesion = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    locale: lang,
    return_url: `${siteOrigin(request)}${membresiaPath(lang)}`,
  });
  return json({ url: sesion.url });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
