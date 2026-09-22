import Stripe from 'stripe';

/**
 * El cliente de Stripe — **solo servidor**. Nunca se importa desde una
 * pantalla: `STRIPE_SECRET_KEY` cobra dinero.
 *
 * Trasplantado de `emilse_rios_membresias` (`src/lib/stripe.ts`) el 22 sep
 * 2026, con la mudanza del cobro a esta casa. Se trajo **con los mismos nombres
 * de variable de entorno**, igual que ya se hizo con `membership.ts`: las dos
 * casas leen el mismo dato de Stripe y no hay que traducir nada de un panel al
 * otro.
 *
 * ⚠️ Lo que NO se mudó es el **webhook**. Sigue viviendo en la academia, y es
 * correcto que siga ahí: un webhook no tiene dominio —Stripe llama a la
 * dirección que tenga apuntada— y el suyo escribe en el MISMO Supabase con un
 * UPSERT por `stripe_subscription_id`. Mudarlo obliga a tocar el panel de
 * Stripe y a verificar `emilserios.com` en Resend, que hoy no se puede porque
 * el DKIM está roto. Ver **La unión de las dos casas** en `progreso.md`.
 */
const secret = process.env.STRIPE_SECRET_KEY;

/** Sin `apiVersion` a propósito: la que tenga la cuenta, igual que la academia. */
export const stripe = secret ? new Stripe(secret) : null;

/** Los dos Prices ya creados en Stripe. Los mismos IDs que usa la academia. */
export const PRICE_FOUNDER = process.env.STRIPE_PRICE_FOUNDER || '';
export const PRICE_STANDARD = process.env.STRIPE_PRICE_STANDARD || '';

/**
 * Los dos cubos de precio.
 *
 * ⚠️ **Los nombres son etiquetas heredadas y mienten sobre el importe.** El
 * estándar pasó a 80 $ en julio de 2026 y a 65 € en agosto —cambiando además de
 * moneda— y el valor del enum se conservó para no migrar la columna
 * `price_tier` de la base de datos. **El importe real lo fija el Price de
 * Stripe, no este nombre**: el enum solo mapea Price ID ↔ fila de la BD. Si se
 * renombra acá y no en la migración `0001` de la academia, el webhook empieza a
 * escribir un valor que la columna rechaza.
 */
export type Tier = 'founder_57' | 'standard_77';

/**
 * Fin de la ventana del precio fundador. Su copy salió de la carta —cerró el 23
 * de julio de 2026— pero la fecha se queda configurable, que es lo que le
 * permite a Adrián abrir otra ventana sin tocar código.
 */
const FOUNDER_UNTIL = process.env.STRIPE_FOUNDER_UNTIL || '2025-07-10T23:59:59+02:00';

/** Qué precio toca hoy. Una fecha inválida cae a estándar, que es el caro. */
export function currentTier(now: Date = new Date()): Tier {
  const until = Date.parse(FOUNDER_UNTIL);
  if (Number.isNaN(until)) return 'standard_77';
  return now.getTime() <= until ? 'founder_57' : 'standard_77';
}

export function priceForTier(tier: Tier): string {
  return tier === 'founder_57' ? PRICE_FOUNDER : PRICE_STANDARD;
}

/** De un Price ID de Stripe al enum de la BD. Lo usa el espejo. */
export function tierForPrice(priceId: string | null | undefined): Tier | null {
  if (!priceId) return null;
  if (priceId === PRICE_FOUNDER) return 'founder_57';
  if (priceId === PRICE_STANDARD) return 'standard_77';
  return null;
}

/**
 * El origen público del sitio, para las URLs de vuelta de Stripe.
 *
 * ⚠️ **No se usa `new URL(request.url).origin`**, y esto no es paranoia: en
 * serverless eso resuelve a veces a `http://localhost`, y entonces Stripe
 * devuelve a la compradora a «localhost» después de haberle cobrado. Manda
 * `PUBLIC_SITE_URL`; si falta, el `Host` que reenvía el proxy.
 *
 * **Siempre con `www`.** En Vercel el ápice pelado contesta 308 hacia `www`, y
 * hay terceros que no siguen redirecciones — en la academia eso ya causó un
 * incidente con el webhook, y está anotado en su `.env.example`. Acá vale la
 * misma regla: `https://www.emilserios.com`, no `https://emilserios.com`.
 */
export function siteOrigin(request: Request): string {
  const configurado = process.env.PUBLIC_SITE_URL || import.meta.env.PUBLIC_SITE_URL;
  if (configurado) return String(configurado).replace(/\/+$/, '');
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (host) return `${proto}://${host}`;
  return new URL(request.url).origin;
}
