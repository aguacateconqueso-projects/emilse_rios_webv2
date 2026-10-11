import type { Lang } from '../i18n/ui';

/**
 * «Algunos newsletters pasados»: los correos de Emi publicados como entradas,
 * en `/newsletters/` y `/en/newsletters/`.
 *
 * **11 de octubre de 2026, el pedido de SEO de Emi** (punto 5 del «Prompt SEO
 * de emilserios.com — versión única»). Reemplaza a las entradas del 9 oct
 * —ficheros Markdown en `src/content/entradas/`, en `/newsletter/`, en
 * singular—: ahora **Emi las publica sola desde el panel** (pestaña
 * «Newsletters pasados»), rellenando casillas, y viven en Supabase (migración
 * `0013_newsletters.sql`). Las direcciones viejas llevan a las nuevas con un
 * 301 (`astro.config.mjs`).
 *
 * Este fichero es lo que comparten la web y el panel: la forma de una entrada
 * y lo que viene escrito de fábrica. Las tres primeras, las del anexo del
 * documento, están en `newsletters-anexo.ts`.
 */

export type Newsletter = {
  id: string;
  /** Define en qué índice aparece. */
  lang: Lang;
  /** El final de su dirección: `/newsletters/<slug>/`. */
  slug: string;
  /** El H1. */
  titulo: string;
  /** El correo, en HTML sencillo: párrafos, negrita, cursiva, listas y enlaces. */
  cuerpo: string;
  /** «Un abrazo,» y debajo «Emilse»: una línea por renglón. */
  firma: string;
  /** Las posdatas, en HTML de una línea (negrita, cursiva, enlaces). Vacía, no sale. */
  pd: string;
  pd2: string;
  pd3: string;
  /** «Sigue leyendo»: 2 o 3 entradas del mismo idioma. Vacío, las más recientes. */
  relacionadas: string[];
  /** La misma entrada en el otro idioma: da los `hreflang` y el conmutador ES/EN. */
  traduccion: string | null;
  /** El `<title>`. Vacío, el título de la entrada. */
  titulo_google: string;
  /** La meta descripción. Vacía, el extracto. */
  meta: string;
  /** Lo que dice el índice debajo del título. */
  extracto: string;
  /** La fecha de publicación que se ve: `2026-10-11`. */
  fecha: string;
  /** Las direcciones que tuvo antes: llevan a la de ahora con un 301. */
  slugs_anteriores: string[];
  /** Cuándo se publicó por última vez (la pone la base de datos). */
  published_at?: string;
  created_at?: string;
};

/** Lo que trae una entrada nueva en cada idioma (punto 5.4). */
export const FIRMA = 'Un abrazo,\nEmilse';

export const POSDATAS: Record<Lang, { pd: string; pd2: string }> = {
  es: {
    pd: '¿Todavía no estás en mi newsletter? Te suscribes <a href="#suscribete">aquí</a>. Suscribirse es gratis, darse de baja también.',
    pd2: 'Cuando te suscribes, te llega un correo de bienvenida con un video. Es un ejercicio donde te explico un concepto que va a cambiar la forma en que produces el sonido. El video dura 4:04 y casi seguro conoces el ejercicio: no hay contrabajista en el mundo que no lo haya practicado. Pero el 90% lo hace mal, ¡JA! Casi nadie sabe de dónde viene realmente ese movimiento. Pero tú no vas a estar en ese 90%. Tú no. No después de ver el video. Ya me contarás.',
  },
  en: {
    pd: 'Not on my newsletter yet? Sign up <a href="#suscribete">here</a>. Signing up is free. So is unsubscribing.',
    pd2: 'When you sign up you get a welcome email with a video. It’s an exercise where I explain one concept that’s going to change the way you produce sound. The video runs 4:04 and you almost certainly know the exercise — there isn’t a bass player alive who hasn’t practiced it. But 90% do it wrong, HA! Hardly anyone knows where that movement actually comes from. You won’t be in that 90% though. Not you. Not after you watch the video. You’ll have to let me know.',
  },
};

/** El rótulo de cada posdata: «PD:», «PD2:»… / «PS:», «PS2:»… */
export const MARCA_PD: Record<Lang, [string, string, string]> = {
  es: ['PD:', 'PD2:', 'PD3:'],
  en: ['PS:', 'PS2:', 'PS3:'],
};

/** El ancla del formulario de abajo: la del «aquí» de la primera posdata. */
export const ANCLA = 'suscribete';

/** Palabras que no pueden ser slug: son las de la paginación del índice. */
export const SLUGS_RESERVADOS = ['pagina', 'page'];

/** Cuántas entradas por página tiene el índice. */
export const POR_PAGINA = 10;

/** Los topes que el panel cuenta: los ideales para Google. */
export const TOPE_TITULO = 60;
export const TOPE_META = 155;
export const TOPE_EXTRACTO = 200;

/** La primera página del índice y las siguientes: `/newsletters/pagina/2/`. */
export function indicePath(lang: Lang, pagina = 1): string {
  const base = lang === 'en' ? '/en/newsletters/' : '/newsletters/';
  if (pagina <= 1) return base;
  return `${base}${lang === 'en' ? 'page' : 'pagina'}/${pagina}/`;
}

/** La dirección de una entrada. */
export const newsletterPath = (n: Pick<Newsletter, 'lang' | 'slug'>): string => `${indicePath(n.lang)}${n.slug}/`;

/** «Cómo ganar fuerza» → «como-ganar-fuerza»: minúsculas, sin acentos, con guiones. */
export const aSlug = (t: string): string =>
  t
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/* ==========================================================================
   El HTML de las entradas
   ==========================================================================
   Lo escribe Emi desde el panel, pero se limpia igual al pintarlo: solo
   pasan párrafos, saltos de línea, negrita, cursiva, listas y enlaces, y los
   enlaces solo a `https://`, `mailto:`, una dirección del sitio o un ancla. Es
   lo mismo que deja el editor del panel, así que en la práctica no quita
   nada; está para que un texto raro no pueda romper la página. */

const PERMITIDAS = new Set(['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a']);
const EQUIVALE: Record<string, string> = { b: 'strong', i: 'em' };
const DE_BLOQUE = new Set(['p', 'ul', 'ol', 'li']);

/** ¿Un enlace que se puede dejar? Devuelve la dirección limpia o `null`. */
export function hrefSeguro(bruto: string | null | undefined): string | null {
  const h = (bruto ?? '').trim();
  if (!h) return null;
  if (/^https?:\/\/[^\s]+$/i.test(h) || /^mailto:[^\s]+$/i.test(h)) return h;
  if (/^\/(?!\/)[^\s]*$/.test(h) || /^#[\w-]+$/.test(h)) return h;
  return null;
}

const ENTIDADES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

/** `&amp;` → `&`, `&#8217;` → `’`. Lo justo para leer un atributo o contar letras. */
export const decodificar = (s: string): string =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === '#') {
      const n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    return ENTIDADES[e.toLowerCase()] ?? m;
  });

const escTexto = (s: string) => s.replace(/&(?!(#x[0-9a-f]+|#\d+|[a-z]+);)/gi, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const escAtributo = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Deja solo el HTML permitido. Con `enLinea`, el de una posdata: sin párrafos
 * ni listas (un párrafo nuevo pasa a ser un salto de línea).
 */
export function limpiarHtml(html: string | null | undefined, enLinea = false): string {
  const s = String(html ?? '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|iframe|object|embed|template|noscript|textarea|select|svg|math|head|title)\b[\s\S]*?<\/\1\s*>/gi, '');
  const out: string[] = [];
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>|([^<]+)|(<)/g;
  for (const m of s.matchAll(re)) {
    if (m[4] !== undefined) {
      out.push(escTexto(m[4]));
      continue;
    }
    if (m[5]) {
      out.push('&lt;');
      continue;
    }
    const cierre = m[1] === '/';
    const nombre = m[2].toLowerCase();
    const tag = EQUIVALE[nombre] ?? nombre;
    if (enLinea && DE_BLOQUE.has(tag)) {
      /* Entre dos párrafos o dos puntos de una lista, un salto de línea. */
      if (!cierre && out.length && (tag === 'p' || tag === 'li')) out.push('<br>');
      continue;
    }
    if (!PERMITIDAS.has(tag)) continue;
    if (tag === 'br') {
      if (!cierre) out.push('<br>');
      continue;
    }
    if (cierre) {
      out.push(`</${tag}>`);
      continue;
    }
    if (tag === 'a') {
      const h = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(m[3]);
      const href = hrefSeguro(decodificar(h?.[1] ?? h?.[2] ?? h?.[3] ?? ''));
      out.push(href ? `<a href="${escAtributo(href)}">` : '<a>');
      continue;
    }
    out.push(`<${tag}>`);
  }
  return out
    .join('')
    .replace(/^(\s|<br>)+|(\s|<br>)+$/g, '');
}

/** El texto de un trozo de HTML, sin etiquetas y en una línea. */
export const textoPlano = (html: string): string =>
  decodificar(
    String(html ?? '')
      .replace(/<(br|\/p|\/li|\/ul|\/ol)\b[^>]*>/gi, ' ')
      .replace(/<[^>]*>/g, ''),
  )
    .replace(/\s+/g, ' ')
    .trim();

/**
 * El extracto que se rellena solo: las primeras 200 letras del cuerpo,
 * cortadas en una palabra entera.
 */
export function extractoDe(cuerpo: string, tope = TOPE_EXTRACTO): string {
  const t = textoPlano(cuerpo);
  if (t.length <= tope) return t;
  const corte = t.slice(0, tope + 1);
  const espacio = corte.lastIndexOf(' ');
  return `${(espacio > tope * 0.6 ? corte.slice(0, espacio) : t.slice(0, tope)).replace(/[\s,;:.—–-]+$/, '')}…`;
}

/** La más reciente primero: por fecha y, el mismo día, la última creada. */
export const masRecientePrimero = (a: Newsletter, b: Newsletter): number =>
  b.fecha.localeCompare(a.fecha) || (b.created_at ?? '').localeCompare(a.created_at ?? '');

/** La fecha como se lee: «11 de octubre de 2026» / «October 11, 2026». */
export function fechaLegible(fecha: string, lang: Lang): string {
  const d = new Date(`${fecha}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return fecha;
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'es-ES', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

/** Hoy en Madrid: `2026-10-11`. La fecha que trae una entrada nueva. */
export const hoyEnMadrid = (ahora = Date.now()): string =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(
    ahora,
  );
