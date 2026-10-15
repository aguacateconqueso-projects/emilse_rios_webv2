/**
 * Las bibliotecas de Bunny Stream de Emi, para el selector del panel. **Solo
 * de servidor**: las claves de Bunny borran videos y no pueden ir al
 * navegador. Lo usa `/api/panel/bunny`.
 *
 * **15 de octubre de 2026.** Hasta ese día el selector leía una sola
 * biblioteca —la 754051, la del primer curso— con su clave
 * (`BUNNY_STREAM_API_KEY`): en Bunny **cada biblioteca tiene la suya**. Emi
 * tiene un curso por biblioteca, así que al crear otro curso «+ Desde Bunny»
 * solo le enseñaba los videos del diapasón. Ahora, con **la clave de la
 * cuenta** (`BUNNY_API_KEY`, Bunny → Account settings → API), se listan todas
 * sus bibliotecas y, de la que elija, se pide su clave a Bunny en el momento:
 *
 *   1. `GET api.bunny.net/videolibrary`        las bibliotecas de la cuenta
 *   2. `GET api.bunny.net/videolibrary/<id>`   la clave de esa biblioteca
 *   3. `GET video.bunnycdn.com/library/<id>/…` sus colecciones y sus videos
 *
 * Es lo mismo que hace el proveedor de Terraform del propio Bunny. **Sin la
 * clave de la cuenta, todo sigue como antes**: la biblioteca de los cursos,
 * con `BUNNY_STREAM_API_KEY`.
 */

const API_CUENTA = 'https://api.bunny.net';
const API_STREAM = 'https://video.bunnycdn.com';

export type Biblioteca = { id: string; nombre: string; videos: number | null };
export type ColeccionPanel = { guid: string; nombre: string; videos: number };
export type VideoPanel = {
  guid: string;
  titulo: string;
  segundos: number;
  coleccion: string | null;
  listo: boolean;
  miniatura: string | null;
};
export type Contenido = {
  colecciones: ColeccionPanel[];
  videos: VideoPanel[];
  /** Si la biblioteca no deja reproducir sus videos en la web, por qué. */
  aviso: string | null;
};

export type Claves = {
  /** La clave de la cuenta: lista todas las bibliotecas. */
  cuenta: string | null;
  /** La clave de la biblioteca de los cursos, la de antes. */
  biblioteca: string | null;
  /** La biblioteca de los cursos (754051). */
  cursos: string;
  /** El host del CDN de la biblioteca de los cursos, para las miniaturas. */
  cdn: string | null;
};

const limpiarHost = (h: string | undefined | null) =>
  h?.trim().replace(/^https?:\/\//, '').replace(/\/+$/, '') || null;

export function clavesBunny(cursosPorDefecto: string): Claves {
  return {
    cuenta: (process.env.BUNNY_API_KEY || process.env.BUNNY_ACCOUNT_API_KEY)?.trim() || null,
    biblioteca: process.env.BUNNY_STREAM_API_KEY?.trim() || null,
    cursos: (process.env.PUBLIC_BUNNY_CURSOS_LIBRARY || cursosPorDefecto).trim(),
    cdn: limpiarHost(process.env.BUNNY_CDN_HOST),
  };
}

export class ErrorBunny extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function pedir(url: string, clave: string): Promise<any> {
  const r = await fetch(url, { headers: { AccessKey: clave, accept: 'application/json' } });
  if (!r.ok) throw new ErrorBunny(`Bunny contestó ${r.status}`, r.status);
  return r.json();
}

/** «Nivel 2» antes que «Nivel 10». */
const natural = new Intl.Collator('es', { numeric: true, sensitivity: 'base' }).compare;

/** Las bibliotecas de video de la cuenta, por nombre. */
export async function listarBibliotecas(cuenta: string): Promise<Biblioteca[]> {
  const j = await pedir(`${API_CUENTA}/videolibrary?page=1&perPage=1000`, cuenta);
  const items: any[] = Array.isArray(j) ? j : (j?.Items ?? j?.items ?? []);
  return items
    .filter((l) => l && l.Id != null)
    .map((l) => ({
      id: String(l.Id),
      nombre: String(l.Name || `Biblioteca ${l.Id}`),
      videos: typeof l.VideoCount === 'number' ? l.VideoCount : null,
    }))
    .sort((a, b) => natural(a.nombre, b.nombre));
}

/**
 * Si los videos de una biblioteca no se van a poder ver en el aula: Bunny
 * pide un token para el reproductor, o solo deja reproducir en otros dominios.
 */
export function avisoReproduccion(l: {
  PlayerTokenAuthenticationEnabled?: boolean;
  AllowedReferrers?: string[] | null;
}): string | null {
  if (l.PlayerTokenAuthenticationEnabled) {
    return 'Ojo: esta biblioteca pide un token para reproducir, y en el aula sus videos no se verían. En Bunny → esta biblioteca → Security, apaga «Embed view token authentication».';
  }
  const permitidos = (l.AllowedReferrers ?? []).map((r) => String(r).toLowerCase());
  if (permitidos.length && !permitidos.some((r) => r.includes('emilserios.com'))) {
    return 'Ojo: esta biblioteca solo deja reproducir sus videos en otros dominios, y en el aula no se verían. En Bunny → esta biblioteca → Security → Allowed domains, añade emilserios.com.';
  }
  return null;
}

/** Con qué clave se lee una biblioteca, el host de sus miniaturas y su aviso. */
async function acceso(
  id: string,
  claves: Claves,
): Promise<{ lectura: string; escritura: string; cdn: Promise<string | null>; aviso: string | null }> {
  if (claves.cuenta) {
    const l = await pedir(`${API_CUENTA}/videolibrary/${id}`, claves.cuenta);
    const escritura = String(l?.ApiKey || '');
    const lectura = String(l?.ReadOnlyApiKey || escritura);
    if (!lectura) throw new ErrorBunny('Bunny no dio la clave de esa biblioteca', 502);
    const cuenta = claves.cuenta;
    /* El host del CDN (`vz-….b-cdn.net`) es el de su zona: el del sistema. */
    const cdn = l?.PullZoneId
      ? pedir(`${API_CUENTA}/pullzone/${l.PullZoneId}`, cuenta)
          .then((pz) => {
            const hosts: any[] = pz?.Hostnames ?? [];
            return limpiarHost((hosts.find((h) => h?.IsSystemHostname) ?? hosts[0])?.Value);
          })
          .catch(() => null)
      : Promise.resolve(null);
    return { lectura, escritura: escritura || lectura, cdn, aviso: avisoReproduccion(l ?? {}) };
  }
  if (id === claves.cursos && claves.biblioteca) {
    return { lectura: claves.biblioteca, escritura: claves.biblioteca, cdn: Promise.resolve(claves.cdn), aviso: null };
  }
  throw new ErrorBunny('Para leer otra biblioteca hace falta la clave de la cuenta de Bunny (BUNNY_API_KEY)', 400);
}

type VideoBunny = {
  guid: string;
  title: string;
  length: number;
  status: number;
  collectionId: string;
  thumbnailFileName?: string;
};
type ColeccionBunny = { guid: string; name: string; videoCount: number };

/** Las colecciones y los videos de una biblioteca. */
export async function leerBiblioteca(
  id: string,
  claves: Claves,
  filtro: { q?: string; coleccion?: string } = {},
): Promise<Contenido> {
  const a = await acceso(id, claves);
  const q = new URLSearchParams({ itemsPerPage: '1000', orderBy: 'title' });
  if (filtro.q) q.set('search', filtro.q);
  if (filtro.coleccion) q.set('collection', filtro.coleccion);

  const leer = async (clave: string) =>
    Promise.all([
      pedir(`${API_STREAM}/library/${id}/videos?page=1&${q}`, clave),
      pedir(`${API_STREAM}/library/${id}/collections?page=1&itemsPerPage=1000&orderBy=name`, clave),
    ]);
  /* La de solo lectura basta para mirar; si Bunny no la acepta, la otra. */
  let videos: any;
  let colecciones: any;
  try {
    [videos, colecciones] = await leer(a.lectura);
  } catch (e) {
    if (!(e instanceof ErrorBunny) || (e.status !== 401 && e.status !== 403) || a.escritura === a.lectura) throw e;
    [videos, colecciones] = await leer(a.escritura);
  }
  const cdn = await a.cdn;

  return {
    aviso: a.aviso,
    colecciones: ((colecciones?.items ?? []) as ColeccionBunny[])
      .map((c) => ({ guid: c.guid, nombre: c.name, videos: c.videoCount }))
      .sort((x, y) => natural(x.nombre, y.nombre)),
    videos: ((videos?.items ?? []) as VideoBunny[]).map((v) => ({
      guid: v.guid,
      titulo: v.title,
      segundos: Math.round(v.length || 0),
      coleccion: v.collectionId || null,
      /* 4 = terminado de procesar. Los que se están subiendo todavía no se
         pueden reproducir: se enseñan, pero marcados. */
      listo: v.status === 4,
      miniatura: cdn && v.thumbnailFileName ? `https://${cdn}/${v.guid}/${v.thumbnailFileName}` : null,
    })),
  };
}
