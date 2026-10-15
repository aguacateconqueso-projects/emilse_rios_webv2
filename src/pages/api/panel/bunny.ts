import type { APIRoute } from 'astro';
import { adminDeLaPeticion } from '../../../lib/supabase-admin';
import { BUNNY_CURSOS_LIBRARY } from '../../../lib/video';
import { clavesBunny, listarBibliotecas, leerBiblioteca, ErrorBunny, type Biblioteca } from '../../../lib/bunny';

/**
 * Las bibliotecas de Bunny Stream de Emi, para el panel.
 *
 * Existe para que Emi **elija los videos de una lista** —con su título y su
 * duración— en vez de ir a Bunny, abrir cada uno, copiar su «Embed» y pegarlo.
 * Un curso son veinticuatro videos contando los dos idiomas; tres cursos, más
 * de setenta. Y de paso trae la duración exacta de cada uno, que a mano nadie
 * escribiría bien.
 *
 *   GET /api/panel/bunny                         las bibliotecas, y las
 *                                                colecciones y los videos de
 *                                                la de los cursos
 *   GET /api/panel/bunny?biblioteca=<id>         los de esa biblioteca
 *   GET /api/panel/bunny?biblioteca=<id>&solo=1  sin volver a listar las
 *                                                bibliotecas (al cambiar)
 *   &coleccion=<guid>, &q=<texto>                filtrar en Bunny
 *
 * **Desde el 15 oct 2026, todas las bibliotecas** —Emi tiene un curso por
 * biblioteca— si en Vercel está la clave de la cuenta, `BUNNY_API_KEY`. Sin
 * ella, como antes: solo la de los cursos, con `BUNNY_STREAM_API_KEY`. Ver
 * `src/lib/bunny.ts`.
 *
 * ⚠️ **Las claves de Bunny no pueden ir al navegador**: con ellas se borran
 * videos (y con la de la cuenta, todo). Viven en Vercel sin `PUBLIC_` y esta
 * ruta no las devuelve nunca: solo nombres, títulos y duraciones.
 *
 * ⚠️ **Solo para el panel**: empieza por `adminDeLaPeticion()`, que corre en el
 * servidor y lee el rol de la base de datos. Sin sesión de admin, 401.
 *
 * Sin ninguna clave, contesta `{ configurado: false }` y el panel dice que
 * falta y deja pegar el enlace a mano, como siempre.
 */
export const prerender = false;

const json = (cuerpo: unknown, status = 200) =>
  new Response(JSON.stringify(cuerpo), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

export const GET: APIRoute = async ({ request, url }) => {
  const admin = await adminDeLaPeticion(request);
  if (!admin) return json({ error: 'no_autorizado' }, 401);

  /* La biblioteca de los CURSOS por defecto: no la de la membresía
     (`PUBLIC_BUNNY_LIBRARY`). Ver `BUNNY_CURSOS_LIBRARY`. */
  const claves = clavesBunny(BUNNY_CURSOS_LIBRARY);
  if (!claves.cuenta && !claves.biblioteca) return json({ configurado: false, biblioteca: claves.cursos });

  const pedida = url.searchParams.get('biblioteca')?.trim() || '';
  if (pedida && !/^\d{1,12}$/.test(pedida)) return json({ error: 'biblioteca_invalida' }, 400);
  const solo = url.searchParams.get('solo') === '1';
  const filtro = {
    q: url.searchParams.get('q')?.trim() || undefined,
    coleccion: url.searchParams.get('coleccion')?.trim() || undefined,
  };

  try {
    let bibliotecas: Biblioteca[] | undefined;
    let elegida = pedida;
    if (!solo || !pedida) {
      bibliotecas = claves.cuenta
        ? await listarBibliotecas(claves.cuenta)
        : [{ id: claves.cursos, nombre: 'Cursos', videos: null }];
      /* La pedida si es de la cuenta; si no, la de los cursos; si no, la primera. */
      if (!bibliotecas.some((b) => b.id === elegida)) {
        elegida = bibliotecas.find((b) => b.id === claves.cursos)?.id ?? bibliotecas[0]?.id ?? '';
      }
    }
    if (!elegida) {
      return json({ configurado: true, cuenta: Boolean(claves.cuenta), bibliotecas: [], biblioteca: null, colecciones: [], videos: [] });
    }
    const contenido = await leerBiblioteca(elegida, claves, filtro);
    return json({
      configurado: true,
      /* Con la clave de la cuenta se ven todas; sin ella, solo la de los cursos. */
      cuenta: Boolean(claves.cuenta),
      ...(bibliotecas ? { bibliotecas } : {}),
      biblioteca: elegida,
      ...contenido,
    });
  } catch (e) {
    console.error('[bunny]', e);
    const status = e instanceof ErrorBunny && e.status === 400 ? 400 : 502;
    return json({ configurado: true, error: (e as Error).message }, status);
  }
};
