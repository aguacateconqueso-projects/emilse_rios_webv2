import type { Lang } from '../i18n/ui';
import { cliente } from './tienda';
import {
  type Newsletter,
  POR_PAGINA,
  newsletterPath,
  masRecientePrimero,
  extractoDe,
  limpiarHtml,
} from '../data/newsletters';
import { ANEXO } from '../data/newsletters-anexo';
import { SITIO, PERSONA_ID, WEBSITE_ID, OG_IMAGEN } from '../data/seo';

/**
 * Los newsletters pasados, para la web. **Solo de servidor**: las páginas de
 * `/newsletters/` llevan `prerender = false` y un minuto de caché en Vercel,
 * como las páginas de ventas —Emi publica desde el panel y al minuto está—.
 * Ver `src/data/newsletters.ts`.
 *
 * Lee la tabla `newsletters` con la clave `anon` (la RLS deja leer lo
 * publicado; los borradores están en otra tabla que solo ve Emi). Si la tabla
 * no existe —la migración 0013 sin pegar— o no hay conexión, las del anexo
 * (`src/data/newsletters-anexo.ts`). Nunca lanza.
 */

const COLUMNAS =
  'id, lang, slug, titulo, cuerpo, firma, pd, pd2, pd3, relacionadas, traduccion, titulo_google, meta, extracto, fecha, slugs_anteriores, published_at, created_at';

export type Fuente = 'bd' | 'codigo';

const normalizar = (f: Record<string, any>): Newsletter => ({
  id: String(f.id),
  lang: f.lang === 'en' ? 'en' : 'es',
  slug: String(f.slug ?? ''),
  titulo: String(f.titulo ?? ''),
  cuerpo: String(f.cuerpo ?? ''),
  firma: String(f.firma ?? ''),
  pd: String(f.pd ?? ''),
  pd2: String(f.pd2 ?? ''),
  pd3: String(f.pd3 ?? ''),
  relacionadas: Array.isArray(f.relacionadas) ? f.relacionadas.map(String) : [],
  traduccion: f.traduccion ? String(f.traduccion) : null,
  titulo_google: String(f.titulo_google ?? ''),
  meta: String(f.meta ?? ''),
  extracto: String(f.extracto ?? ''),
  fecha: String(f.fecha ?? '').slice(0, 10),
  slugs_anteriores: Array.isArray(f.slugs_anteriores) ? f.slugs_anteriores.map(String) : [],
  published_at: f.published_at ?? undefined,
  created_at: f.created_at ?? undefined,
});

/** Todas las publicadas, de los dos idiomas, la más reciente primero. */
export async function leerNewsletters(): Promise<{ fuente: Fuente; todas: Newsletter[] }> {
  const delCodigo = { fuente: 'codigo' as const, todas: [...ANEXO].sort(masRecientePrimero) };
  const sb = cliente();
  if (!sb) return delCodigo;
  try {
    const r = await sb.from('newsletters').select(COLUMNAS);
    if (r.error) {
      if (!/does not exist|schema cache|Could not find the table/i.test(r.error.message)) {
        console.error('[newsletters] no se pudieron leer', r.error.message);
      }
      return delCodigo;
    }
    return { fuente: 'bd', todas: (r.data ?? []).map(normalizar).sort(masRecientePrimero) };
  } catch (e) {
    console.error('[newsletters] Supabase no contestó', e);
    return delCodigo;
  }
}

export const deIdioma = (todas: Newsletter[], lang: Lang) => todas.filter((n) => n.lang === lang);

/** Una página del índice: sus entradas y si hay otra después. `null` si no existe. */
export function pagina(todas: Newsletter[], lang: Lang, n: number) {
  const lista = deIdioma(todas, lang);
  const total = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
  if (!Number.isInteger(n) || n < 1 || n > total) return null;
  return { entradas: lista.slice((n - 1) * POR_PAGINA, n * POR_PAGINA), hayMas: n < total };
}

/**
 * La entrada de una dirección. Si la dirección es una que tuvo antes,
 * `redirigir` con la de ahora (301).
 */
export function buscar(
  todas: Newsletter[],
  lang: Lang,
  slug: string,
): { entrada: Newsletter } | { redirigir: string } | null {
  const lista = deIdioma(todas, lang);
  const entrada = lista.find((n) => n.slug === slug);
  if (entrada) return { entrada };
  const antes = lista.find((n) => n.slugs_anteriores.includes(slug));
  return antes ? { redirigir: newsletterPath(antes) } : null;
}

/**
 * La misma entrada en el otro idioma: la que dice su casilla «Traducción
 * vinculada» o, si la dejó vacía, la que la eligió a ella. Así basta con
 * vincularlas desde una de las dos.
 */
export function gemela(n: Newsletter, todas: Newsletter[]): Newsletter | null {
  const otras = todas.filter((x) => x.lang !== n.lang);
  return (n.traduccion && otras.find((x) => x.id === n.traduccion)) || otras.find((x) => x.traduccion === n.id) || null;
}

/**
 * «Sigue leyendo»: las que eligió Emi (del mismo idioma y publicadas) o, si no
 * eligió ninguna, las más recientes. Entre 2 y 3, si las hay.
 */
export function sigueLeyendo(n: Newsletter, todas: Newsletter[]): Newsletter[] {
  const mismas = deIdioma(todas, n.lang).filter((x) => x.id !== n.id);
  const elegidas = n.relacionadas
    .map((id) => mismas.find((x) => x.id === id))
    .filter((x): x is Newsletter => Boolean(x))
    .slice(0, 3);
  if (!elegidas.length) return mismas.slice(0, 3);
  for (const x of mismas) {
    if (elegidas.length >= 2) break;
    if (!elegidas.includes(x)) elegidas.push(x);
  }
  return elegidas;
}

/** El `<title>` y la descripción de una entrada, con sus reservas. */
export const tituloGoogle = (n: Newsletter) => n.titulo_google.trim() || n.titulo;
export const descripcion = (n: Newsletter) => n.meta.trim() || n.extracto.trim() || extractoDe(n.cuerpo);
export const extracto = (n: Newsletter) => n.extracto.trim() || extractoDe(n.cuerpo);

/** La última vez que cambió: la última publicación, nunca antes de su fecha. */
export function modificada(n: Newsletter): string {
  const pub = n.published_at?.slice(0, 10);
  return pub && pub > n.fecha ? pub : n.fecha;
}

/** La entrada para Google: un `BlogPosting` (punto 5.5). */
export function datosEntrada(n: Newsletter): Record<string, unknown> {
  const url = `${SITIO}${newsletterPath(n)}`;
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#entrada`,
    headline: n.titulo,
    description: descripcion(n),
    datePublished: n.fecha,
    dateModified: modificada(n),
    inLanguage: n.lang,
    url,
    image: OG_IMAGEN.url,
    author: { '@id': PERSONA_ID },
    publisher: { '@id': PERSONA_ID },
    isPartOf: { '@id': WEBSITE_ID },
    mainEntityOfPage: { '@id': `${url}#webpage` },
  };
}

/** El cuerpo y las posdatas, limpios para pintar. */
export const html = {
  cuerpo: (n: Newsletter) => limpiarHtml(n.cuerpo),
  linea: (s: string) => limpiarHtml(s, true),
};

/** La caché de Vercel: la misma que las páginas de ventas. */
export { CACHE_TIENDA as CACHE_NEWSLETTERS } from './tienda';
