import type { APIRoute } from 'astro';
import { stripe, currentTier, priceForTier, siteOrigin } from '../../lib/stripe';
import { doorsClosed, REOPENS_AT, NEWSLETTER_URL, INVITE_PARAM } from '../../lib/membership';
import { inviteValid } from '../../lib/membership-server';
import { graciasPath } from '../../i18n/aula';
import { routePath } from '../../i18n/ui';

/**
 * El checkout de la membresía. **Desde el 22 sep 2026 vive acá**, no en la
 * academia: es el primer trozo de la unión de las dos casas, y lo que hace que
 * el botón de comprar de `/formaciones/estudiemos-juntos/` deje de salir del
 * sitio a mitad de una compra.
 *
 * Trasplantado de `emilse_rios_membresias` (`src/pages/api/checkout.ts`). Lo
 * único que cambia respecto al original son **las dos direcciones de vuelta**,
 * que ahora son rutas de esta casa: la de agradecimiento y la carta. La sesión
 * de Stripe, el precio, los metadatos y el pase son los mismos, y tienen que
 * seguir siéndolo — el webhook que los lee sigue siendo el de la academia.
 *
 * Es un **GET** a propósito, como allí: así los botones de la carta son un
 * `<a href>` y funcionan sin una línea de JavaScript.
 *
 * El pago es **anónimo**: nadie inicia sesión para comprar. Stripe recoge el
 * correo, y la cuenta se crea después —en `/gracias/`, donde la compradora pone
 * su contraseña, o desde el webhook si nunca pasa por ahí—.
 */
export const prerender = false;

export const GET: APIRoute = async ({ request, redirect }) => {
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') === 'en' ? 'en' : 'es';
  const origen = siteOrigin(request);

  /* El pase deja entrar a UNA persona con las puertas cerradas. Sin código
     válido vale cero y el `if` de abajo se comporta como si no existiera. */
  const invitada = inviteValid(url.searchParams.get(INVITE_PARAM));

  /* Puertas cerradas → no se crea la sesión de Stripe. **Esconder los botones
     de la carta no basta**: esta dirección se pega a mano, se queda en un
     correo viejo y la guarda el navegador. El cierre de verdad es este.

     Va ANTES de mirar a Stripe a propósito: con las puertas cerradas da igual
     cómo esté configurado el cobro, y así la visitante lee la explicación en
     vez de un error. 403 y no 404 — existe, pero está cerrado. */
  if (doorsClosed() && !invitada) return respuestaCerrada(lang, origen);

  if (!stripe) return new Response('Stripe no está configurado.', { status: 500 });

  /* El precio lo decide la fecha, y queda congelado en la suscripción: Stripe
     le seguirá cobrando ese mismo importe a quien entre hoy. */
  const tier = currentTier();
  const price = priceForTier(tier);
  if (!price) return new Response('Falta configurar el precio de Stripe.', { status: 500 });

  let sesion;
  try {
    sesion = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price, quantity: 1 }],
      /* El idioma en el que pagó, para mandarle el correo de bienvenida en ES o
         EN. Lo lee el webhook de la academia, así que **estas tres claves no se
         renombran**: allí se leen por estos nombres. `invited` queda escrito en
         Stripe para que meses después se vea de un vistazo que esa suscripción
         entró por un pase y no por la carta abierta. */
      metadata: { tier, lang, invited: invitada ? 'si' : 'no' },
      subscription_data: { metadata: { tier, lang, invited: invitada ? 'si' : 'no' } },
      locale: lang,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      /* Tras pagar todavía no hay sesión, así que la compradora aterriza en la
         página de agradecimiento. El `{CHECKOUT_SESSION_ID}` lo rellena Stripe,
         y es lo que le permite a `/gracias/` comprobar el pago contra Stripe y
         dejarla poner su contraseña ahí mismo, sin esperar ningún correo. */
      success_url: `${origen}${graciasPath(lang)}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origen}${cartaPath(lang)}`,
    });
  } catch (err: any) {
    /* Sin este `try`, un fallo de Stripe —un Price de otro modo, uno
       archivado, una clave inválida— sale como un 500 pelado de Vercel sin
       pista de la causa. El detalle completo va a los logs de la función y el
       motivo de Stripe (que no lleva secretos) a la pantalla, para poder
       diagnosticar desde el propio navegador. */
    console.error('[checkout] Stripe falló al crear la sesión', {
      tier,
      price,
      message: err?.message,
      type: err?.type,
      code: err?.code,
    });
    const detalle = err?.message || 'error desconocido';
    return new Response(
      `No se pudo conectar con Stripe.\n\nMotivo: ${detalle}\n\n` +
        `Revisa en Vercel que STRIPE_PRICE_STANDARD (tier actual: ${tier}) y ` +
        `STRIPE_SECRET_KEY sean del MISMO modo (los dos test o los dos live) y ` +
        `que el Price exista y esté activo.`,
      { status: 500, headers: { 'content-type': 'text/plain; charset=utf-8' } },
    );
  }

  if (!sesion.url) return new Response('No se pudo crear la sesión de pago.', { status: 500 });
  return redirect(sesion.url, 303);
};

/** La carta de ventas de la membresía, a donde vuelve quien cancela el pago. */
function cartaPath(lang: 'es' | 'en'): string {
  return `${routePath('products', lang)}estudiemos-juntos/`;
}

/**
 * La pantalla de «puertas cerradas».
 *
 * Es un callejón sin salida —nadie va a pagar hoy— así que al menos deja dos
 * puertas abiertas: volver a la carta y el alta al newsletter, que es como se
 * entera de la reapertura quien llegó tarde.
 *
 * Va escrita a mano y no como página de Astro porque la sirve una ruta de API:
 * es la respuesta del 403, no una dirección a la que se navegue. Lleva la
 * crema de la carta, que es de donde viene quien la ve.
 */
function respuestaCerrada(lang: 'es' | 'en', origen: string): Response {
  const volver = `${origen}${cartaPath(lang)}`;
  const reabre = Date.parse(REOPENS_AT);
  const fecha = Number.isNaN(reabre)
    ? ''
    : new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'es-ES', {
        timeZone: 'Europe/Madrid',
        day: 'numeric',
        month: 'long',
      }).format(new Date(reabre));

  const c =
    lang === 'en'
      ? {
          title: 'The doors are closed',
          p: fecha
            ? `Each week of the month builds on the one before, so nobody comes in halfway through. The doors open on ${fecha}.`
            : 'Each week of the month builds on the one before, so nobody comes in halfway through.',
          news: 'Tell me when they open',
          back: 'Back to the letter',
        }
      : {
          title: 'Las puertas están cerradas',
          p: fecha
            ? `Cada semana del mes se apoya en la anterior, por eso nadie entra a mitad de camino. Las puertas abren el ${fecha}.`
            : 'Cada semana del mes se apoya en la anterior, por eso nadie entra a mitad de camino.',
          news: 'Avísame cuando abran',
          back: 'Volver a la carta',
        };

  const esc = (v: string) =>
    v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(c.title)}</title>
<style>
  body { margin: 0; min-height: 100vh; display: grid; place-items: center;
         background: #faf7f1; color: #17140f; padding: 40px 24px;
         font-family: Georgia, 'Times New Roman', serif; line-height: 1.66; }
  main { max-width: 520px; text-align: center; }
  h1 { font-size: clamp(1.6rem, 5vw, 2.2rem); line-height: 1.15; margin: 0 0 0.6em; font-weight: 600; }
  p { margin: 0 0 1.6em; }
  a.btn { display: inline-flex; align-items: center; gap: 10px; text-decoration: none;
          color: #17140f; border: 1.5px solid currentColor; padding: 16px 34px;
          font-family: system-ui, sans-serif; font-size: 0.86rem; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase; }
  a.back { display: block; margin-top: 22px; color: #6f6a61; font-size: 0.9rem; }
</style></head><body><main>
  <h1>${esc(c.title)}</h1>
  <p>${esc(c.p)}</p>
  <a class="btn" href="${esc(NEWSLETTER_URL)}" target="_blank" rel="noopener">${esc(c.news)} →</a>
  <a class="back" href="${esc(volver)}">${esc(c.back)}</a>
</main></body></html>`;

  return new Response(html, {
    status: 403,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}
