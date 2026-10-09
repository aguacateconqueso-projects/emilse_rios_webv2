import type Stripe from 'stripe';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Lang } from '../i18n/ui';
import { stripe } from './stripe';
import { buscarOCrearUsuario } from './supabase-admin';
import {
  hayResend,
  mandarCorreo,
  correoCompra,
  correoCompraSinCurso,
  RESPONDER_A,
  AVISOS_A,
} from './correo';
import { lanzamientos, compraPorEnlace, yaAbrio, fechaPuertas, HUSO } from '../data/lanzamientos';
import { clavePath, escritorioPath } from '../i18n/aula';

/**
 * La compra de un curso: de un pago de Stripe al acceso en el aula. **Solo de
 * servidor.**
 *
 * **9 de octubre de 2026**, con la preventa de «Todo el diapasón». Hasta ese
 * día el webhook solo sabía de la membresía, y un curso se daba a mano en
 * Personas. Ahora, cuando alguien paga con uno de los enlaces de
 * `src/data/lanzamientos.ts`:
 *
 *   1. se sabe qué compró por el enlace con el que pagó (`queCompro`);
 *   2. se encuentra o se crea su cuenta, con el correo del propio pago;
 *   3. se le abre el curso de esa ficha —y el de las que trae dentro— en
 *      `course_access`, con `source = 'stripe'`. **Qué curso abre cada ficha
 *      lo dice la Tienda** (`products.course_id`), no el código;
 *   4. le llega el correo de la compra (`correoCompra`), una sola vez.
 *
 * Lo llaman el webhook (`/api/stripe-webhook`, los cuatro pasos) y
 * `/api/claim-account` (los tres primeros: la contraseña al pagar, desde
 * `/gracias/`). Es idempotente: el acceso es un `upsert` que no pisa nada, y
 * el correo deja una marca en el pago de Stripe.
 *
 * ⚠️ **Si una ficha no tiene curso elegido en la Tienda, no se puede dar el
 * acceso solo.** El pago queda bien, la compradora recibe su correo igual, y
 * a Emi le llega un aviso para darlo a mano (`correoCompraSinCurso`).
 */

export type Compra = { slug: string; lang: Lang };

/** La marca, en el pago de Stripe, de que el correo de la compra ya salió. */
const MARCA = 'correo_compra';

/** ¿Pagada de verdad? `no_payment_required` cubre los cupones al 100 %. */
export const sesionPagada = (s: Stripe.Checkout.Session): boolean =>
  s.status === 'complete' && (s.payment_status === 'paid' || s.payment_status === 'no_payment_required');

/**
 * Qué compró una sesión de checkout de pago único, o `null` si no es un curso
 * de los nuestros. Primero `metadata.producto` (un checkout propio, si algún
 * día lo hay); si no, el enlace de pago con el que se pagó, que se le pregunta
 * a Stripe y se busca en `lanzamientos`.
 */
export async function queCompro(sesion: Stripe.Checkout.Session): Promise<Compra | null> {
  if (sesion.mode !== 'payment') return null;
  const m = sesion.metadata ?? {};
  if (m.producto && lanzamientos[m.producto]) {
    return { slug: m.producto, lang: m.lang === 'en' ? 'en' : 'es' };
  }
  const enlace = sesion.payment_link;
  if (!enlace || !stripe) return null;
  const id = typeof enlace === 'string' ? enlace : enlace.id;
  const pl = await stripe.paymentLinks.retrieve(id);
  return compraPorEnlace(pl.url);
}

/** El correo de la compra, sacado del pago y no de ningún formulario. */
const correoDe = (s: Stripe.Checkout.Session) =>
  (s.customer_details?.email || s.customer_email || '').trim().toLowerCase() || null;

/** Las fichas que abre una compra: la suya y las que trae dentro. */
const fichasDe = (slug: string) => [slug, ...(lanzamientos[slug]?.incluye ?? [])];

/**
 * Abre los cursos de una compra. Devuelve quién es, si la cuenta es nueva y
 * qué fichas no tienen curso elegido en la Tienda. No lanza por una ficha sin
 * curso; sí si la base de datos falla, para que Stripe reintente.
 */
export async function darAcceso(
  admin: SupabaseClient,
  sesion: Stripe.Checkout.Session,
  compra: Compra,
): Promise<{
  userId: string | null;
  email: string | null;
  creado: boolean;
  sinCurso: string[];
  /** El nombre de cada ficha en los dos idiomas, como lo dice la Tienda. */
  nombres: Map<string, Record<Lang, string>>;
}> {
  const email = correoDe(sesion);
  const nombres = new Map<string, Record<Lang, string>>();
  const { userId, creado } = await buscarOCrearUsuario(admin, email);
  if (!userId) return { userId: null, email, creado: false, sinCurso: [], nombres };

  const fichas = fichasDe(compra.slug);
  const { data, error } = await admin
    .from('products')
    .select('slug, course_id, nombre_es, nombre_en')
    .in('slug', fichas);
  if (error) throw new Error(`[compras] no se pudo leer la Tienda: ${error.message}`);
  const cursos = new Map((data ?? []).map((f) => [f.slug as string, f.course_id as string | null]));
  (data ?? []).forEach((f) =>
    nombres.set(f.slug, { es: f.nombre_es || f.nombre_en || f.slug, en: f.nombre_en || f.nombre_es || f.slug }),
  );
  const sinCurso = fichas.filter((f) => !cursos.get(f));
  const filas = fichas
    .map((f) => cursos.get(f))
    .filter((c): c is string => Boolean(c))
    .map((course_id) => ({ user_id: userId, course_id, source: 'stripe' }));

  if (filas.length) {
    /* Sin pisar: si ya lo tenía —dado a mano, o este mismo pago dos veces—,
       se queda como estaba. */
    const r = await admin
      .from('course_access')
      .upsert(filas, { onConflict: 'user_id,course_id', ignoreDuplicates: true });
    if (r.error) throw new Error(`[compras] no se pudo dar el acceso: ${r.error.message}`);
  }
  return { userId, email, creado, sinCurso, nombres };
}

/**
 * Lo que hace el webhook con una compra: el acceso y el correo, una vez.
 *
 * La marca de «correo enviado» va en el `PaymentIntent` del pago. Un pago sin
 * `PaymentIntent` —un cupón al 100 %— no tiene dónde marcarla: si Stripe
 * reenviara ese evento, el correo saldría otra vez. Solo pasa en las pruebas.
 */
export async function registrarCompra(
  admin: SupabaseClient,
  sesion: Stripe.Checkout.Session,
  compra: Compra,
  origen: string,
): Promise<void> {
  const acceso = await darAcceso(admin, sesion, compra);
  const { email, creado, sinCurso, nombres } = acceso;
  const nombre = (slug: string, l: Lang) => nombres.get(slug)?.[l] ?? slug;
  if (!email) {
    console.error('[compras] pago sin correo', sesion.id);
    return;
  }
  const base = origen.replace(/\/+$/, '');
  const lang = compra.lang;

  /* A Emi, si alguna ficha no tiene curso: hay que darlo a mano. */
  if (sinCurso.length) {
    console.error('[compras] sin curso en la Tienda:', sinCurso.join(', '), '—', email);
    const aviso = correoCompraSinCurso({
      correo: email,
      formacion: nombre(compra.slug, 'es'),
      fichas: sinCurso,
      panel: `${base}/panel/#personas`,
    });
    const r = await mandarCorreo({ to: AVISOS_A, ...aviso });
    if (r.error) console.error('[compras] no salió el aviso a Emi', r.error.message);
  }

  /* ¿Ya salió el correo de esta compra? */
  const piId = typeof sesion.payment_intent === 'string' ? sesion.payment_intent : sesion.payment_intent?.id;
  let pi: Stripe.PaymentIntent | null = null;
  if (piId && stripe) {
    pi = await stripe.paymentIntents.retrieve(piId);
    if (pi.metadata?.[MARCA]) return;
  }

  const l = lanzamientos[compra.slug];
  const abre = l && !yaAbrio(l.abre) ? fechaPuertas(l.abre, lang) : null;

  let clave: string | null = null;
  if (creado) {
    const { data } = await admin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: { redirectTo: `${base}${clavePath(lang)}` },
    });
    clave = ((data as any)?.properties?.action_link as string | undefined) ?? null;
  }

  let salio = false;
  if (hayResend) {
    const correo = correoCompra(lang, {
      formacion: nombre(compra.slug, lang),
      incluidas: (l?.incluye ?? []).map((s) => nombre(s, lang)),
      abre,
      huso: HUSO[lang],
      clave,
      aula: `${base}${escritorioPath(lang)}`,
    });
    const r = await mandarCorreo({ to: email, ...correo, replyTo: RESPONDER_A });
    salio = !r.error;
    if (r.error) console.error('[compras] no salió el correo de la compra', email, r.error.message);
  }
  /* Sin Resend, al menos el enlace de la contraseña, con el correo estándar
     de Supabase: llega en inglés y sin el copy, pero llega. */
  if (!salio && creado) {
    const { error } = await admin.auth.resetPasswordForEmail(email, { redirectTo: `${base}${clavePath(lang)}` });
    salio = !error;
    if (error) console.error('[compras] tampoco salió el de Supabase', email, error.message);
  }

  if (salio && pi && stripe) {
    await stripe.paymentIntents
      .update(pi.id, { metadata: { [MARCA]: new Date().toISOString() } })
      .catch((e) => console.error('[compras] no se pudo marcar el pago', e?.message || e));
  }
}
