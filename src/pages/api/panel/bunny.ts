import type { APIRoute } from 'astro';
import { adminDeLaPeticion } from '../../../lib/supabase-admin';

/**
 * La biblioteca de Bunny Stream de Emi, para el panel.
 *
 * Existe para que Emi **elija los videos de una lista** —con su título y su
 * duración— en vez de ir a Bunny, abrir cada uno, copiar su «Embed» y pegarlo.
 * Un curso son veinticuatro videos contando los dos idiomas; tres cursos, más
 * de setenta. Y de paso trae la duración exacta de cada uno, que a mano nadie
 * escribiría bien.
 *
 *   GET /api/panel/bunny                     las colecciones y los videos
 *   GET /api/panel/bunny?coleccion=<guid>    solo los de una colección
 *   GET /api/panel/bunny?q=<texto>           buscando por título
 *
 * ⚠️ **La clave de Bunny no puede ir al navegador**: con ella se borran videos.
 * Por eso esto es una ruta de servidor y la clave vive en Vercel como
 * `BUNNY_STREAM_API_KEY`, sin `PUBLIC_`. Es la «API Key» de la biblioteca
 * (Bunny → Stream → la biblioteca → API), no la de la cuenta.
 *
 * ⚠️ **Solo para el panel**: empieza por `adminDeLaPeticion()`, que corre en el
 * servidor y lee el rol de la base de datos. Sin sesión de admin, 401.
 *
 * Sin la clave, contesta `{ configurado: false }` y el panel dice que falta y
 * deja pegar el enlace a mano, como siempre.
 */
export const prerender = false;

const API = 'https://video.bunnycdn.com';

const json = (cuerpo: unknown, status = 200) =>
  new Response(JSON.stringify(cuerpo), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

type VideoBunny = {
  guid: string;
  title: string;
  length: number;
  status: number;
  collectionId: string;
  thumbnailFileName?: string;
  dateUploaded?: string;
};

type ColeccionBunny = { guid: string; name: string; videoCount: number };

export const GET: APIRoute = async ({ request, url }) => {
  const admin = await adminDeLaPeticion(request);
  if (!admin) return json({ error: 'no_autorizado' }, 401);

  const clave = process.env.BUNNY_STREAM_API_KEY?.trim();
  const biblioteca = (
    process.env.PUBLIC_BUNNY_LIBRARY ||
    process.env.PUBLIC_BUNNY_LIBRARY_ID ||
    import.meta.env.PUBLIC_BUNNY_LIBRARY ||
    '741634'
  ).trim();
  if (!clave) return json({ configurado: false, biblioteca });

  /* Opcional: el host del CDN de la biblioteca (`vz-xxxx.b-cdn.net`), para
     enseñar la miniatura de cada video. Sin él, la lista va sin fotos. */
  const cdn = process.env.BUNNY_CDN_HOST?.trim().replace(/^https?:\/\//, '').replace(/\/+$/, '');

  const pedir = async (ruta: string) => {
    const r = await fetch(`${API}${ruta}`, {
      headers: { AccessKey: clave, accept: 'application/json' },
    });
    if (!r.ok) throw new Error(`Bunny contestó ${r.status}`);
    return r.json();
  };

  try {
    const q = new URLSearchParams({ itemsPerPage: '1000', orderBy: 'title' });
    const buscar = url.searchParams.get('q')?.trim();
    const coleccion = url.searchParams.get('coleccion')?.trim();
    if (buscar) q.set('search', buscar);
    if (coleccion) q.set('collection', coleccion);

    const [videos, colecciones] = await Promise.all([
      pedir(`/library/${biblioteca}/videos?page=1&${q}`),
      pedir(`/library/${biblioteca}/collections?page=1&itemsPerPage=1000&orderBy=name`),
    ]);

    return json({
      configurado: true,
      biblioteca,
      colecciones: ((colecciones.items ?? []) as ColeccionBunny[]).map((c) => ({
        guid: c.guid,
        nombre: c.name,
        videos: c.videoCount,
      })),
      videos: ((videos.items ?? []) as VideoBunny[])
        /* 4 = terminado de procesar. Los que se están subiendo todavía no se
           pueden reproducir: se enseñan, pero marcados. */
        .map((v) => ({
          guid: v.guid,
          titulo: v.title,
          segundos: Math.round(v.length || 0),
          coleccion: v.collectionId || null,
          listo: v.status === 4,
          miniatura:
            cdn && v.thumbnailFileName ? `https://${cdn}/${v.guid}/${v.thumbnailFileName}` : null,
        })),
    });
  } catch (e) {
    console.error('[bunny]', e);
    return json({ configurado: true, error: (e as Error).message }, 502);
  }
};
