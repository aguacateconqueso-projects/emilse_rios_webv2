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
 * Lo único que corre en el servidor son las tres rutas de `/api/` —el alta al
 * newsletter y el cobro—, y esas contestan 503 sin hacer nada.
 *
 * Con la cortina subida no toca nada: es un `next()` y nada más.
 */
export const onRequest = defineMiddleware((context, next) => {
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

  return next();
});
