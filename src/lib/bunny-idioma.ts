// El idioma de un video de la biblioteca de Bunny, y sus parejas.
//
// Pedido de Adrián el 24 sep 2026: «los cursos que subirá Emi tienen versión
// EN y ES, tenemos que diferenciarlos para subir los que corresponden en donde
// van». Emi graba cada clase dos veces y sube los dos videos a la misma
// biblioteca (la de los cursos, 754051); cada clase del panel tiene un hueco
// por idioma. Hasta hoy el selector de Bunny los metía todos en el de español,
// y «+ Desde Bunny» hacía una clase por video: veinticuatro clases para un
// curso de doce, la mitad con el video inglés en el hueco español.
//
// Bunny no sabe en qué idioma está un video: lo dice su título, o el nombre de
// su colección. Acá se lee eso y se empareja cada clase con sus dos versiones.
// Lo usa el panel (`src/scripts/panel-cursos.ts`); no toca nada guardado.
//
// Lo que se entiende, del más fiable al menos:
//
//   1. entre corchetes o paréntesis, en cualquier caja: «[EN]», «(es)», «(English)»
//   2. al final, detrás de un separador: «01 Intro - EN», «01_intro_en.mp4»,
//      «01 Intro · English». Con un espacio solo, el código corto tiene que ir
//      en mayúsculas («01 Intro EN»): «¿Qué es» o «Tu vibrato en» no son marcas
//   3. al principio, en mayúsculas: «EN - 01 Intro», «ES_01_intro»
//   4. la palabra entera en cualquier sitio: Español, Spanish, Castellano,
//      English, Inglés
//   5. «ES» / «EN» en mayúsculas en medio del título, si el título no está
//      todo en mayúsculas
//
// Un título sin marca devuelve `null`; el panel mira entonces el nombre de la
// colección, y si tampoco dice nada, lo trata como español (lo de siempre).

export type Idioma = 'es' | 'en';

// Lo que Bunny pone de título si no se cambia: el nombre del fichero.
const EXTENSION = /\.(mp4|mov|m4v|mkv|webm|avi|wmv|mpe?g)$/i;

const CORTO: Record<string, Idioma> = { es: 'es', esp: 'es', spa: 'es', en: 'en', eng: 'en' };
const LARGO: Record<string, Idioma> = {
  espanol: 'es',
  spanish: 'es',
  castellano: 'es',
  english: 'en',
  ingles: 'en',
};

const plano = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

/** Una palabra suelta: ¿es una marca de idioma? `corta` admite «es» / «en». */
function marca(palabra: string, corta: boolean): Idioma | null {
  const p = plano(palabra);
  return LARGO[p] ?? (corta ? (CORTO[p] ?? null) : null);
}

const SEP = String.raw`[\s_\-.|·/:,–—]+`;
const PALABRA = String.raw`\p{L}+`;
const RE_CORCHETES = new RegExp(String.raw`[\[(]\s*(${PALABRA})\s*[\])]`, 'gu');
const RE_FINAL = new RegExp(String.raw`(${SEP})(${PALABRA})$`, 'u');
const RE_INICIO = new RegExp(String.raw`^(${PALABRA})(${SEP})`, 'u');

/** Lo que queda de un título al quitarle un trozo: sin separadores sueltos. */
function limpiar(s: string): string {
  return s
    .replace(/\s{2,}/g, ' ')
    .replace(new RegExp(`^${SEP}|${SEP}$`, 'gu'), '')
    .trim();
}

export type TituloLeido = {
  /** El idioma que dice el título, o `null` si no dice ninguno. */
  idioma: Idioma | null;
  /** El título sin la marca de idioma ni la extensión: el de la clase. */
  base: string;
};

/**
 * «01 Introducción - ES.mp4» → `{ idioma: 'es', base: '01 Introducción' }`.
 * «01 Introduction [EN]»     → `{ idioma: 'en', base: '01 Introduction' }`.
 * «Qué es el vibrato»        → `{ idioma: null, base: 'Qué es el vibrato' }`.
 */
export function leerTitulo(titulo: string | null | undefined): TituloLeido {
  const t = String(titulo ?? '')
    .trim()
    .replace(EXTENSION, '')
    .trim();
  if (!t) return { idioma: null, base: '' };
  const quitar = (desde: number, hasta: number) => limpiar(t.slice(0, desde) + ' ' + t.slice(hasta)) || t;

  // 1. Entre corchetes o paréntesis.
  for (const m of t.matchAll(RE_CORCHETES)) {
    const idioma = marca(m[1], true);
    if (idioma) return { idioma, base: quitar(m.index!, m.index! + m[0].length) };
  }

  // 2. Al final. Con solo espacios delante, el código corto va en mayúsculas.
  const fin = t.match(RE_FINAL);
  if (fin) {
    const [todo, sep, palabra] = fin;
    const soloEspacio = /^\s+$/.test(sep);
    const idioma = marca(palabra, !soloEspacio || palabra === palabra.toUpperCase());
    if (idioma) return { idioma, base: quitar(fin.index!, fin.index! + todo.length) };
  }

  // 3. Al principio, en mayúsculas (o la palabra entera).
  const ini = t.match(RE_INICIO);
  if (ini) {
    const [todo, palabra] = ini;
    const idioma = marca(palabra, palabra === palabra.toUpperCase());
    if (idioma) return { idioma, base: quitar(0, todo.length) };
  }

  // 4 y 5. En medio: la palabra entera, o el código en mayúsculas si el
  // título no grita entero.
  const grita = t === t.toUpperCase();
  for (const m of t.matchAll(new RegExp(PALABRA, 'gu'))) {
    const p = m[0];
    const idioma = marca(p, !grita && p.length <= 3 && p === p.toUpperCase());
    if (idioma) return { idioma, base: quitar(m.index!, m.index! + p.length) };
  }

  return { idioma: null, base: t };
}

/** Solo el idioma de un texto (el título de un video, el nombre de una colección). */
export const idiomaDe = (texto: string | null | undefined): Idioma | null => leerTitulo(texto).idioma;

/* ==========================================================================
   Las parejas: cada clase, con su video en español y su video en inglés
   ========================================================================== */

export type ConIdioma = { titulo: string; idioma: Idioma | null };

export type Pareja<V> = {
  es: V | null;
  en: V | null;
  /** Cómo se encontró la pareja; `null` si el video va solo. */
  por: 'titulo' | 'numero' | 'orden' | null;
};

/** «01 Introducción» y «1. Introduction» comparten el 1. */
const numero = (base: string): number | null => {
  const m = base.match(/\d+/);
  return m ? Number(m[0]) : null;
};

/** Para comparar títulos: sin tildes, sin caja, sin espacios ni signos. */
const huella = (base: string) => plano(base).replace(/[^a-z0-9]+/g, '');

/**
 * Empareja los videos en español con los de inglés, y devuelve una clase por
 * pareja **en el orden de los de español** (los de inglés que se quedan solos,
 * al final). Un video sin idioma cuenta como español.
 *
 *   1. mismo título sin la marca: «01 Intro ES» con «01 Intro EN»
 *   2. mismo número, si es el único con ese número en cada idioma:
 *      «01 Introducción ES» con «01 Introduction EN»
 *   3. por orden, el primero con el primero, **solo si quedan los mismos de
 *      cada idioma** y ninguna pareja tiene números distintos; si no, cada
 *      uno va solo y el panel lo enseña
 */
export function emparejar<V extends ConIdioma>(videos: V[]): Pareja<V>[] {
  const base = new Map<V, string>(videos.map((v) => [v, leerTitulo(v.titulo).base]));
  const es = videos.filter((v) => v.idioma !== 'en');
  const en = videos.filter((v) => v.idioma === 'en');
  const pareja = new Map<V, { en: V; por: Pareja<V>['por'] }>();
  const libre = new Set(en);

  // 1. Mismo título.
  for (const v of es) {
    const h = huella(base.get(v)!);
    const w = h ? en.find((x) => libre.has(x) && huella(base.get(x)!) === h) : undefined;
    if (w) {
      pareja.set(v, { en: w, por: 'titulo' });
      libre.delete(w);
    }
  }

  // 2. Mismo número, sin ambigüedad.
  const porNumero = (lista: V[]) => {
    const m = new Map<number, V[]>();
    for (const v of lista) {
      const n = numero(base.get(v)!);
      if (n !== null) m.set(n, [...(m.get(n) ?? []), v]);
    }
    return m;
  };
  const esSolos = es.filter((v) => !pareja.has(v));
  const nEs = porNumero(esSolos);
  const nEn = porNumero(en.filter((v) => libre.has(v)));
  for (const [n, lista] of nEs) {
    const otros = nEn.get(n);
    if (lista.length === 1 && otros?.length === 1) {
      pareja.set(lista[0], { en: otros[0], por: 'numero' });
      libre.delete(otros[0]);
    }
  }

  // 3. Por orden, si cuadran: los mismos de cada lado y ninguno con números
  //    distintos («03 …» no va con «05 …»).
  const restoEs = es.filter((v) => !pareja.has(v));
  const restoEn = en.filter((v) => libre.has(v));
  const choca = (a: V, b: V) => {
    const x = numero(base.get(a)!);
    const y = numero(base.get(b)!);
    return x !== null && y !== null && x !== y;
  };
  if (restoEs.length && restoEs.length === restoEn.length && !restoEs.some((v, i) => choca(v, restoEn[i]))) {
    restoEs.forEach((v, i) => {
      pareja.set(v, { en: restoEn[i], por: 'orden' });
      libre.delete(restoEn[i]);
    });
  }

  return [
    ...es.map((v) => {
      const p = pareja.get(v);
      return { es: v, en: p?.en ?? null, por: p?.por ?? null };
    }),
    ...en.filter((v) => libre.has(v)).map((v) => ({ es: null, en: v, por: null })),
  ];
}

/** Orden natural de títulos: «2 …» antes que «10 …», como los ve Emi. */
export const ordenNatural = (a: string, b: string) =>
  a.localeCompare(b, 'es', { numeric: true, sensitivity: 'base' });
