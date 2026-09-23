import { defineMiddleware } from 'astro:middleware';
import { cortinaBajada, RUTA_CORTINA } from './lib/cortina';

/**
 * Con la cortina bajada, nadie ve otra cosa ni puede hacer nada.
 *
 * El sitio es estático: casi todas las páginas se escriben en el build y
 * Vercel las sirve como ficheros, sin pasar por acá cuando alguien las pide.
 * Por eso la cortina se pone **en el build**: este middleware también corre
 * entonces, una vez por página, y a cada una le escribe dentro la cortina en
 * vez de su contenido. La dirección no cambia —`/sobre-mi/` sigue siendo
 * `/sobre-mi/`— pero lo que hay dentro es la firma de Emi.
 *
 * Lo que corre en el servidor son las rutas de `/api/` —el alta al newsletter,
 * el cobro, el panel—, que contestan 503 sin hacer nada, y desde el 23 sep
 * 2026 Formaciones y las páginas de ventas, que reciben la cortina ya hecha
 * (ver abajo).
 *
 * Con la cortina subida no toca nada: es un `next()` y nada más.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  if (!cortinaBajada()) return next();

  const { pathname } = context.url;

  if (context.isPrerendered) {
    const esLaCortina = pathname.replace(/\/$/, '') === RUTA_CORTINA;
    return esLaCortina ? next() : next(RUTA_CORTINA);
  }

  if (pathname.startsWith('/api/')) {
    return new Response(JSON.stringify({ error: 'cortina' }), {
      status: 503,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'retry-after': '3600',
      },
    });
  }

  /*
    Las páginas que se resuelven en el servidor —Formaciones y las páginas de
    ventas, desde el 23 sep 2026, que leen lo que Emi publica desde el panel—
    no pasan por el build, así que la cortina no está escrita dentro. Se sirve
    la que sí lo está: la de la Home de su idioma, que con la cortina bajada
    es la firma de Emi sobre negro. La dirección no cambia, igual que en las
    demás páginas.

    Es un `fetch` a la propia web y no un `next('/cortina')` porque la cortina
    es una página del build, y reescribir una página de servidor hacia una del
    build no es algo sobre lo que convenga apostar en Vercel.
  */
  const home = pathname === '/en' || pathname.startsWith('/en/') ? '/en/' : '/';
  try {
    const tapa = await fetch(new URL(home, context.url));
    return new Response(await tapa.text(), {
      status: 200,
      headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
    });
  } catch {
    return new Response('Estamos trabajando en la web. Volvemos muy pronto.', {
      status: 503,
      headers: { 'content-type': 'text/plain; charset=utf-8', 'retry-after': '3600' },
    });
  }
});
