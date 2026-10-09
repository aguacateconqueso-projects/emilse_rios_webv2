import { createClient } from '@supabase/supabase-js';
import type { Lang } from '../i18n/ui';
import { catalogo, tienePagina, type Product, type Estado } from '../data/aula';
import { cartas, AVISAME, type Carta } from '../data/cartas';
import {
  lanzamientos,
  momento,
  avisoFicha,
  textosLanzamiento,
  rellenar,
  type Lanzamiento,
} from '../data/lanzamientos';

/**
 * La tienda y sus páginas de ventas, del lado de la WEB: lo que leen
 * Formaciones (`/formaciones/`) y cada página de ventas (`/formaciones/<slug>/`).
 *
 * **Desde el 23 sep 2026 las maneja Emi desde su panel** (pestañas Tienda y
 * Págs. de ventas) y viven en Supabase: `products`, `sales_pages` —la
 * versión publicada— y `sales_page_drafts` —el borrador, que la web no ve—.
 * Ver `supabase/migrations/0010_tienda_paginas_mensajes.sql`.
 *
 * **El código sigue siendo la red**, en dos niveles:
 *
 *   · El catálogo: mientras la tabla `products` esté vacía —antes de que Emi
 *     importe el catálogo desde la Tienda—, o si Supabase no contesta, manda
 *     `src/data/aula.ts`. En cuanto hay un producto, manda la base de datos.
 *   · Cada página: la publicada en `sales_pages`; si no hay, la de
 *     `src/data/cartas.ts` con ese slug; si tampoco, no hay página.
 *
 * Así la web no se queda nunca en blanco por un fallo de la base de datos: en
 * el peor caso enseña lo que enseñaba antes.
 *
 * Esto corre en el servidor (las páginas llevan `prerender = false`) y habla
 * con la clave `anon`: la RLS le deja leer solo lo que no es borrador.
 */

export type Ficha = Product & {
  /** Si la ficha lleva a una página de ventas. */
  conPagina: boolean;
  /**
   * Lo que dice la ficha en vez de «Próximamente» —«Abrimos puertas el
   * viernes 16…»—, cuando tiene fecha de apertura (`src/data/lanzamientos.ts`).
   */
  aviso?: Record<Lang, string>;
};

export type Catalogo = { fuente: 'bd' | 'codigo'; fichas: Ficha[] };

const limpiarUrl = (bruta: string | undefined) =>
  bruta?.trim().replace(/\/+$/, '').replace(/\/(rest|auth|storage|realtime)\/v1$/, '');

function cliente() {
  const url = limpiarUrl(process.env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL);
  const anon = (process.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY)?.trim();
  if (!url || !anon) return null;
  return createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
}

const delCodigo = (): Catalogo => ({
  fuente: 'codigo',
  fichas: catalogo.map((p) => conLanzamiento({ ...p, conPagina: tienePagina(p) })),
});

/** Los dos enlaces de un idioma y otro, o ninguno. */
const hayEnlaces = (e: Record<Lang, string> | undefined) => Boolean(e?.es && e?.en);

/**
 * La ficha según su lanzamiento (`src/data/lanzamientos.ts`), con la hora de
 * ahora. **Solo toca las fichas que Emi tiene en «próximamente» o «a la
 * venta»**: si en la Tienda dice borrador o cerrado, manda la Tienda.
 *
 *   · Antes de abrir (con preventa o sin ella): «próximamente», con la fecha
 *     en vez de «Próximamente».
 *   · Abierto y con sus enlaces de pago: «a la venta», con su precio.
 *   · Abierto y sin enlaces todavía: como esté.
 */
export function conLanzamiento(ficha: Ficha, ahora = Date.now()): Ficha {
  const l = lanzamientos[ficha.slug];
  if (!l || (ficha.estado !== 'proximamente' && ficha.estado !== 'venta')) return ficha;
  if (momento(l, ahora) !== 'abierto') {
    return { ...ficha, estado: 'proximamente', aviso: { es: avisoFicha(l.abre, 'es'), en: avisoFicha(l.abre, 'en') } };
  }
  if (!hayEnlaces(l.venta.enlaces)) return ficha;
  const copia = (lang: Lang) => ({
    ...ficha.copia[lang],
    precio: l.venta.precio[lang],
    cadencia: textosLanzamiento[lang].cadencia,
  });
  return { ...ficha, estado: 'venta', copia: { es: copia('es'), en: copia('en') } };
}

/**
 * La carta según su lanzamiento: la ficha de precio y el botón que tocan.
 *
 *   · Preventa: el precio de siempre tachado, el de preventa, hasta cuándo, y
 *     el botón al enlace de preventa.
 *   · Antes de abrir, sin preventa: la fecha bajo el precio y «Avísame».
 *   · Abierto: la carta tal cual, con el botón al enlace de pago; sin enlace
 *     todavía, «Avísame».
 */
function cartaConLanzamiento(l: Lanzamiento, carta: Record<Lang, Carta>, ahora: number): Record<Lang, Carta> {
  const m = momento(l, ahora);
  const una = (lang: Lang): Carta => {
    const c = carta[lang];
    const t = textosLanzamiento[lang];
    if (m === 'preventa' && l.preventa) {
      return {
        ...c,
        price: l.preventa.precio[lang],
        priceOld: l.venta.precio[lang],
        priceNote: rellenar(t.preventa, l, lang),
        priceNoteRest: rellenar(t.preventaRest, l, lang),
        priceFoot: rellenar(t.preventaPie, l, lang),
        boton: { texto: t.boton, href: l.preventa.enlaces[lang] },
      };
    }
    if (m === 'antes') {
      return { ...c, priceNote: rellenar(t.antes, l, lang), priceNoteRest: '', boton: AVISAME[lang] };
    }
    return hayEnlaces(l.venta.enlaces)
      ? { ...c, boton: { texto: t.boton, href: l.venta.enlaces[lang] } }
      : { ...c, boton: AVISAME[lang] };
  };
  return { es: una('es'), en: una('en') };
}

type Fila = {
  slug: string;
  tipo: 'membresia' | 'curso';
  estado: Estado;
  num: string | null;
  nombre_es: string;
  nombre_en: string;
  resumen_es: string | null;
  resumen_en: string | null;
  precio_es: string | null;
  precio_en: string | null;
  cadencia_es: string | null;
  cadencia_en: string | null;
  foto_url: string | null;
  foto_alt_es: string | null;
  foto_alt_en: string | null;
};

export function aFicha(f: Fila, i: number, conPagina: boolean): Ficha {
  const copia = (l: Lang) => {
    const nombre = (l === 'en' ? f.nombre_en || f.nombre_es : f.nombre_es || f.nombre_en) || f.slug;
    return {
      nombre,
      resumen: (l === 'en' ? f.resumen_en || f.resumen_es : f.resumen_es) ?? '',
      precio: (l === 'en' ? f.precio_en || f.precio_es : f.precio_es) ?? '',
      cadencia: (l === 'en' ? f.cadencia_en || f.cadencia_es : f.cadencia_es) ?? '',
      fotoPie: nombre,
      fotoAlt: (l === 'en' ? f.foto_alt_en || f.foto_alt_es : f.foto_alt_es) ?? '',
    };
  };
  return {
    slug: f.slug,
    tipo: f.tipo,
    estado: f.estado,
    num: f.num || String(i + 1).padStart(2, '0'),
    foto: f.foto_url || undefined,
    copia: { es: copia('es'), en: copia('en') },
    conPagina,
  };
}

/** Las fichas de Formaciones, en su orden. Nunca lanza: si algo falla, el código. */
export async function leerCatalogo(): Promise<Catalogo> {
  const sb = cliente();
  if (!sb) return delCodigo();
  try {
    const activa = await sb.rpc('tienda_en_bd');
    if (activa.error || activa.data !== true) return delCodigo();
    const [prods, pags] = await Promise.all([
      sb.from('products').select('*').order('position').order('created_at'),
      sb.from('sales_pages').select('slug'),
    ]);
    if (prods.error) {
      console.error('[tienda] no se pudo leer el catálogo', prods.error.message);
      return delCodigo();
    }
    const conPagina = new Set((pags.data ?? []).map((p) => p.slug));
    return {
      fuente: 'bd',
      fichas: (prods.data as Fila[]).map((f, i) =>
        conLanzamiento(aFicha(f, i, conPagina.has(f.slug) || f.slug in cartas)),
      ),
    };
  } catch (e) {
    console.error('[tienda] Supabase no contestó', e);
    return delCodigo();
  }
}

/**
 * La página de ventas de un producto, lista para pintar, o `null` (404).
 *
 * El botón lo decide el ESTADO de la ficha, no la página: un curso que no
 * está a la venta —próximamente o cerrado— lleva «Avísame cuando abra»,
 * escriba lo que escriba la página. Así Emi puede redactar la página con el
 * botón de pagar puesto y no se vende nada hasta que en la Tienda diga «a la
 * venta». La membresía tiene sus puertas y no pasa por acá.
 */
export async function leerPagina(
  slug: string,
): Promise<{ ficha: Ficha; carta: Record<Lang, Carta> } | null> {
  const { fuente, fichas } = await leerCatalogo();
  const ficha = fichas.find((f) => f.slug === slug);
  if (!ficha || ficha.estado === 'borrador') return null;

  let carta: Record<Lang, Carta> | undefined;
  if (fuente === 'bd') {
    const sb = cliente();
    const r = await sb?.from('sales_pages').select('carta').eq('slug', slug).maybeSingle();
    if (r?.data?.carta?.es && r.data.carta.en) carta = r.data.carta as Record<Lang, Carta>;
  }
  carta ??= cartas[slug];
  if (!carta) return null;
  return { ficha, carta: botonSegunEstado(ficha, carta) };
}

/**
 * Un curso que no está a la venta lleva «Avísame cuando abra». Uno con
 * lanzamiento (`src/data/lanzamientos.ts`) lleva lo que toque a esta hora:
 * la preventa, la fecha o el pago.
 */
export function botonSegunEstado(
  ficha: Ficha,
  carta: Record<Lang, Carta>,
  ahora = Date.now(),
): Record<Lang, Carta> {
  const l = lanzamientos[ficha.slug];
  if (l && ficha.tipo === 'curso' && ficha.estado !== 'cerrado' && ficha.estado !== 'borrador') {
    return cartaConLanzamiento(l, carta, ahora);
  }
  if (ficha.tipo !== 'curso' || ficha.estado === 'venta') return carta;
  return {
    es: { ...carta.es, boton: AVISAME.es },
    en: { ...carta.en, boton: AVISAME.en },
  };
}

/**
 * La ficha de un producto para la VISTA PREVIA del panel, o `null` si quien
 * la pide no es Emi.
 *
 * Se habla con Supabase **con el token de quien pide**, no con la
 * `service_role`: la RLS decide igual que en el panel. Primero se valida el
 * token, después el rol se lee del perfil propio y, si es admin, la ficha —que
 * puede estar en borrador: la RLS se la deja ver—.
 */
export async function fichaParaVistaPrevia(token: string, slug: string): Promise<Ficha | null> {
  const url = limpiarUrl(process.env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL);
  const anon = (process.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY)?.trim();
  if (!url || !anon || !token || !slug) return null;
  const sb = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: u, error } = await sb.auth.getUser(token);
  if (error || !u.user) return null;
  const { data: perfil } = await sb.from('profiles').select('role').eq('id', u.user.id).maybeSingle();
  if (perfil?.role !== 'admin') return null;
  const { data: fila } = await sb.from('products').select('*').eq('slug', slug).maybeSingle();
  if (fila) return conLanzamiento(aFicha(fila as Fila, 0, true));
  /* Sin fila —el catálogo todavía en el código—: la ficha del código. */
  const delCodigo = catalogo.find((p) => p.slug === slug);
  return delCodigo ? conLanzamiento({ ...delCodigo, conPagina: true }) : null;
}

/**
 * La caché de las páginas de la tienda en Vercel: un minuto fresca y, mientras
 * se rehace, la de antes. Es lo decidido el 19 sep 2026 —«SSR con caché de 60
 * s: Emi guarda y al minuto está en la web»— en vez de reconstruir el sitio
 * entero cada vez.
 */
export const CACHE_TIENDA = 'public, max-age=0, s-maxage=60, stale-while-revalidate=600';
