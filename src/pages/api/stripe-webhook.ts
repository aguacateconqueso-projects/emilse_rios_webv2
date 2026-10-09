import type { APIRoute } from 'astro';
import type Stripe from 'stripe';
import type { SupabaseClient } from '@supabase/supabase-js';
import { stripe, siteOrigin } from '../../lib/stripe';
import { supabaseAdmin, buscarOCrearUsuario } from '../../lib/supabase-admin';
import { writeSubscriptionRow } from '../../lib/stripe-sync';
import { enviarBienvenida } from '../../lib/bienvenida';
import { queCompro, registrarCompra, sesionPagada } from '../../lib/compras';

/**
 * El webhook de Stripe: mantiene la tabla `subscriptions` como espejo de lo
 * que pasa en Stripe —altas, renovaciones, impagos, bajas— y da la bienvenida
 * a quien paga por primera vez.
 *
 * **Vive acá desde el 27 sep 2026.** Hasta ese día vivía en
 * `emilseriosacademy.com/api/stripe-webhook`; se trasplantó tal cual el día de
 * la mudanza (`emilse_rios_membresias`, `src/pages/api/stripe-webhook.ts`).
 * La lógica no cambió; lo que cambió es a dónde manda la bienvenida.
 *
 * ⚠️ **Contesta en las dos direcciones.** El dominio de la academia pasó a
 * este proyecto y redirige todo a `emilserios.com` salvo esta ruta
 * (`astro.config.mjs`), así que Stripe puede seguir llamando a la dirección
 * vieja sin enterarse: le contesta este mismo código. Para eso, en Vercel,
 * `STRIPE_WEBHOOK_SECRET` tiene que ser **el mismo `whsec_` de la academia**.
 * El día que en Stripe se apunte el endpoint a
 * `https://www.emilserios.com/api/stripe-webhook`, Stripe da un secreto nuevo
 * y se cambia acá.
 *
 **Y desde el 9 oct 2026, los cursos.** Un pago único llega como
 * `checkout.session.completed` con `mode: 'payment'`: si se pagó con uno de
 * los enlaces de `src/data/lanzamientos.ts`, abre el curso y manda el correo
 * de la compra (`src/lib/compras.ts`); si no, se ignora, como antes. Los
 * medios de pago que tardan en confirmarse llegan después, como
 * `checkout.session.async_payment_succeeded`.
 *
 * Es idempotente: `writeSubscriptionRow` hace `upsert` por
 * `stripe_subscription_id`, así que el mismo evento dos veces —o este y
 * `/api/claim-account` a la vez— deja la misma fila. Lo de los cursos, igual:
 * ver `compras.ts`.
 */
export const prerender = false;

const secreto = process.env.STRIPE_WEBHOOK_SECRET?.trim();

export const POST: APIRoute = async ({ request }) => {
  if (!stripe || !secreto) return new Response('Stripe no está configurado', { status: 500 });
  const admin = supabaseAdmin();
  if (!admin) return new Response('Falta la service_role de Supabase', { status: 500 });

  const firma = request.headers.get('stripe-signature');
  /* El cuerpo crudo, tal cual llegó: la firma se calcula sobre él. */
  const crudo = await request.text();
  let evento: Stripe.Event;
  try {
    evento = await stripe.webhooks.constructEventAsync(crudo, firma ?? '', secreto);
  } catch (e) {
    return new Response('Firma inválida: ' + (e instanceof Error ? e.message : String(e)), { status: 400 });
  }

  /* La base de los enlaces de la bienvenida. `siteOrigin` manda
     `PUBLIC_SITE_URL`, así que aunque Stripe llame a la dirección de la
     academia, el correo lleva a `www.emilserios.com`. */
  const origen = siteOrigin(request);

  try {
    switch (evento.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const sesion = evento.data.object as Stripe.Checkout.Session;
        /* Un curso (9 oct 2026). Si todavía no está pagado —una
           transferencia—, llegará otra vez como `async_payment_succeeded`. */
        if (sesion.mode === 'payment') {
          if (!sesionPagada(sesion)) break;
          const compra = await queCompro(sesion);
          if (compra) await registrarCompra(admin, sesion, compra, origen);
          else console.log('[stripe-webhook] pago único que no es un curso nuestro', sesion.id);
          break;
        }
        if (evento.type !== 'checkout.session.completed') break;
        if (sesion.mode !== 'subscription' || !sesion.subscription) break;
        const sub = await stripe.subscriptions.retrieve(sesion.subscription as string);
        const email = sesion.customer_details?.email || sesion.customer_email || null;
        await espejar(admin, sub, { email }, origen);
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = evento.data.object as Stripe.Subscription;
        await espejar(admin, sub, { userId: sub.metadata?.supabase_user_id }, origen);
        break;
      }
      case 'invoice.paid':
      case 'invoice.payment_failed': {
        const factura = evento.data.object as Stripe.Invoice;
        const subId = (factura as any).subscription as string | null;
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId);
          await espejar(admin, sub, { userId: sub.metadata?.supabase_user_id }, origen);
        }
        break;
      }
    }
  } catch (e) {
    console.error('[stripe-webhook] error procesando', evento.type, e);
    /* 500 a propósito: Stripe reintenta durante días. */
    return new Response('Error interno', { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

/**
 * Escribe la fila de `subscriptions` de una suscripción de Stripe.
 *
 * Quién es, en este orden: la pista del evento (el `supabase_user_id` que se
 * guarda en el customer), la fila que ya tenga ese customer, y si no, el
 * correo —creando la cuenta si hace falta—. **Solo una cuenta recién creada
 * recibe la bienvenida**: así no se reenvía en cada renovación.
 */
async function espejar(
  admin: SupabaseClient,
  sub: Stripe.Subscription,
  pista: { userId?: string | null; email?: string | null },
  origen: string,
) {
  const customerId = sub.customer as string;

  let userId = pista.userId || null;
  if (!userId) {
    const { data } = await admin
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .limit(1)
      .maybeSingle();
    userId = data?.user_id || null;
  }
  if (!userId) {
    let email = pista.email || null;
    if (!email && stripe) {
      const cliente = await stripe.customers.retrieve(customerId);
      email = cliente && !(cliente as any).deleted ? (cliente as any).email : null;
    }
    const hallado = await buscarOCrearUsuario(admin, email);
    userId = hallado.userId;
    if (userId && stripe) {
      await stripe.customers.update(customerId, { metadata: { supabase_user_id: userId } }).catch(() => {});
    }
    if (hallado.creado && email) {
      const lang = sub.metadata?.lang === 'en' ? 'en' : 'es';
      await enviarBienvenida(email, lang, origen);
    }
  }
  if (!userId) {
    console.error('[stripe-webhook] sin user_id para la suscripción', sub.id);
    return;
  }

  await writeSubscriptionRow(admin, sub, userId);
}
