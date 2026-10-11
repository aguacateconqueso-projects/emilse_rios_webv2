import type { APIRoute } from 'astro';
import { type Lang, routePath, productPath } from '../i18n/ui';
import { leerCatalogo } from '../lib/tienda';
import { leerNewsletters, gemela, modificada } from '../lib/newsletters';
import { indicePath, newsletterPath } from '../data/newsletters';
import { SITIO } from '../data/seo';

/**
 * El `sitemap.xml` (11 oct 2026, pedido de SEO de Emi): todas las páginas
 * públicas, en español y en inglés, cada una con sus dos `hreflang`.
 *
 * **Se arma en el servidor y no en el build** (`@astrojs/sitemap` lo haría en
 * el build): las fichas de Formaciones las maneja Emi desde la Tienda y las
 * entradas del newsletter desde su panel, así que una carta o una entrada
 * nueva entra sola, sin desplegar. Una hora de caché en Vercel.
 *
 * Fuera, a propósito: el aula, el acceso, el panel, el cobro y «gracias»
 * —lo mismo que `public/robots.txt`—.
 */
export const prerender = false;

/**
 * Una página y sus gemelas: la misma en cada idioma que la tenga. Casi todas
 * van de dos en dos; un newsletter pasado sin traducción vinculada va solo.
 */
type Grupo = { es?: string; en?: string; lastmod?: string };

const abs = (ruta: string) => `${SITIO}${ruta}`;
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function url(loc: string, g: Grupo): string {
  const langs = (['es', 'en'] as Lang[]).filter((l) => g[l]);
  const alt = langs.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${esc(abs(g[l]!))}"/>`);
  if (g.es && g.en) alt.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(abs(g.es))}"/>`);
  return [
    '  <url>',
    `    <loc>${esc(abs(loc))}</loc>`,
    ...(g.lastmod ? [`    <lastmod>${g.lastmod}</lastmod>`] : []),
    ...alt,
    '  </url>',
  ].join('\n');
}

/** Las páginas del sitio, cada una con sus gemelas. */
export async function gruposDelSitio(): Promise<Grupo[]> {
  const grupos: Grupo[] = (['home', 'about', 'products'] as const).map((r) => ({
    es: routePath(r, 'es'),
    en: routePath(r, 'en'),
  }));
  const [{ fichas }, { todas }] = await Promise.all([leerCatalogo(), leerNewsletters()]);
  fichas
    .filter((f) => f.conPagina && f.estado !== 'borrador')
    .forEach((f) => grupos.push({ es: productPath(f.slug, 'es'), en: productPath(f.slug, 'en') }));

  /* Los newsletters pasados (punto 5 del pedido de SEO): el índice y cada
     entrada, que entra sola al publicarse, con la fecha de su última
     publicación. Las páginas 2, 3… del índice no: son listas de enlaces, y
     las entradas ya están acá una por una. */
  const masNueva = todas.map(modificada).sort().at(-1);
  grupos.push({ es: indicePath('es'), en: indicePath('en'), lastmod: masNueva });
  const vistas = new Set<string>();
  for (const n of todas) {
    if (vistas.has(n.id)) continue;
    const otra = gemela(n, todas);
    vistas.add(n.id);
    if (otra) vistas.add(otra.id);
    const fechas = [modificada(n), ...(otra ? [modificada(otra)] : [])].sort();
    grupos.push({
      [n.lang]: newsletterPath(n),
      ...(otra ? { [otra.lang]: newsletterPath(otra) } : {}),
      lastmod: fechas.at(-1),
    });
  }
  return grupos;
}

export const GET: APIRoute = async () => {
  const grupos = await gruposDelSitio();
  const cuerpo = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...grupos.flatMap((g) => (['es', 'en'] as Lang[]).filter((l) => g[l]).map((l) => url(g[l]!, g))),
    '</urlset>',
    '',
  ].join('\n');
  return new Response(cuerpo, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
};
