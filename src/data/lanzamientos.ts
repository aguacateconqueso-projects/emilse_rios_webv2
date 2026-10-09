import type { Lang } from '../i18n/ui';

/**
 * Los lanzamientos de los cursos: cuándo abren las puertas, la preventa y los
 * enlaces de pago de Stripe.
 *
 * **9 de octubre de 2026, pedido de Emi.** «Todo el diapasón» y «Todas las
 * escalas» abren el **viernes 16 de octubre a las 23:59** (hora de Madrid).
 * Hasta ese momento el diapasón se vende en **preventa a 195 €**, con los
 * 240 € tachados; ese día abren las puertas y el precio sube. Las escalas
 * dicen la fecha, sin precio especial.
 *
 * **Todo cambia solo con la hora**, sin que nadie toque nada esa noche:
 *
 *   · Formaciones dice «Abrimos puertas el viernes 16…» en vez de
 *     «Próximamente» (`avisoFicha`).
 *   · La carta pinta la ficha de precio y el botón que tocan en cada momento
 *     (`aplicarLanzamiento` en `src/lib/tienda.ts`).
 *   · El aula enseña la formación cerrada, con la fecha, a quien la compró
 *     antes de tiempo, y la abre a esa hora (`src/components/aula/`).
 *
 * **Los enlaces de pago son los de Stripe** (Payment Links, `buy.stripe.com`),
 * los que hizo Emi. El webhook reconoce cada pago por su enlace —le pregunta a
 * Stripe la dirección del enlace con el que se pagó y la busca acá—, así que
 * **en Stripe no hay que configurar nada** para que pagar dé acceso
 * (`src/lib/compras.ts`). Un enlace que no está acá no da acceso a nada.
 *
 * Un enlace vacío es un enlace que todavía no existe: en su lugar sale el
 * botón «Avísame cuando abra». Así, si los de 240 € no llegan a tiempo, al
 * acabar la preventa la carta no se queda con un botón roto.
 *
 * ⚠️ **Al acabar la preventa, los enlaces de 195 € se desactivan en Stripe.**
 * Un enlace de pago no caduca solo: quien lo tenga guardado podría seguir
 * pagando 195 €, y el webhook le daría acceso igual (es un pago de verdad).
 */

/** Las puertas de octubre de 2026: viernes 16, 23:59, hora de Madrid (CEST). */
export const PUERTAS_OCTUBRE = '2026-10-16T23:59:00+02:00';

export type Precio = Record<Lang, string>;
export type Enlaces = Record<Lang, string>;

export type Lanzamiento = {
  /** Cuándo abren las puertas. ISO con la zona de Madrid. */
  abre: string;
  /** La preventa, hasta `abre`. Sin ella, antes de abrir no se vende. */
  preventa?: { precio: Precio; enlaces: Enlaces };
  /** Desde `abre`: el precio de siempre y su enlace. */
  venta: { precio: Precio; enlaces: Enlaces };
  /**
   * Otras fichas cuyo curso se abre también al comprar esta. El diapasón trae
   * dentro «Todas las escalas» completa: la carta lo promete.
   */
  incluye?: string[];
};

export const lanzamientos: Record<string, Lanzamiento> = {
  'todo-el-diapason': {
    abre: PUERTAS_OCTUBRE,
    preventa: {
      precio: { es: '195 €', en: '€195' },
      enlaces: {
        es: 'https://buy.stripe.com/7sY28r2ERaFrd2Xdfr73G0z',
        en: 'https://buy.stripe.com/00weVdfrD14Rfb54IV73G0A',
      },
    },
    /* Los de 240 € todavía no existen (9 oct 2026): Adrián los pasa. */
    venta: { precio: { es: '240 €', en: '€240' }, enlaces: { es: '', en: '' } },
    incluye: ['todas-las-escalas'],
  },
  'todas-las-escalas': {
    abre: PUERTAS_OCTUBRE,
    /* Sus enlaces de 87 €, cuando existan. Hasta entonces, «Avísame». */
    venta: { precio: { es: '87 €', en: '€87' }, enlaces: { es: '', en: '' } },
  },
};

/** En qué momento está un lanzamiento. */
export type Momento = 'preventa' | 'antes' | 'abierto';

export function momento(l: Lanzamiento, ahora = Date.now()): Momento {
  if (ahora >= Date.parse(l.abre)) return 'abierto';
  return l.preventa ? 'preventa' : 'antes';
}

/** ¿Ya abrió? Para el aula: hasta entonces, la formación se ve cerrada. */
export const yaAbrio = (abre: string, ahora = Date.now()): boolean => ahora >= Date.parse(abre);

const MADRID = 'Europe/Madrid';

/**
 * La fecha de las puertas, dicha como la dice Emi: «viernes 16 de octubre a
 * las 23:59» / «Friday, October 16 at 11:59 PM». Siempre en la hora de Madrid.
 */
export function fechaPuertas(abre: string, lang: Lang): string {
  const ms = Date.parse(abre);
  if (lang === 'en') {
    const dia = new Intl.DateTimeFormat('en-US', { timeZone: MADRID, weekday: 'long', month: 'long', day: 'numeric' }).format(ms);
    const hora = new Intl.DateTimeFormat('en-US', { timeZone: MADRID, hour: 'numeric', minute: '2-digit', hour12: true }).format(ms);
    return `${dia} at ${hora}`;
  }
  const semana = new Intl.DateTimeFormat('es-ES', { timeZone: MADRID, weekday: 'long' }).format(ms);
  const dia = new Intl.DateTimeFormat('es-ES', { timeZone: MADRID, day: 'numeric', month: 'long' }).format(ms);
  const hora = new Intl.DateTimeFormat('es-ES', { timeZone: MADRID, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(ms);
  return `${semana} ${dia} a las ${hora}`;
}

/** «hora de España», para quien lee desde otro huso. */
export const HUSO: Record<Lang, string> = { es: 'hora de España', en: 'Spain time' };

/** Lo que dice la ficha de Formaciones en vez de «Próximamente». */
export const avisoFicha = (abre: string, lang: Lang): string =>
  lang === 'en' ? `Doors open ${fechaPuertas(abre, lang)}` : `Abrimos puertas el ${fechaPuertas(abre, lang)}`;

/**
 * Los textos de la ficha de precio. `{fecha}` es `fechaPuertas`, `{huso}` es
 * `HUSO` y `{precio}` el precio de después de abrir.
 */
export const textosLanzamiento: Record<
  Lang,
  { boton: string; preventa: string; preventaRest: string; preventaPie: string; antes: string; cadencia: string }
> = {
  es: {
    boton: 'Acá te unes',
    preventa: 'Precio de preventa hasta el {fecha} ({huso}).',
    preventaRest: 'Ese día abro las puertas y el precio pasa a {precio}.',
    preventaPie:
      'Si entras en preventa, tu acceso al aula se abre el {fecha} ({huso}), cuando abro las puertas. Te llega un correo con el enlace a tu aula en cuanto pagas.',
    antes: 'Abrimos puertas el {fecha} ({huso}).',
    cadencia: 'pago único',
  },
  en: {
    boton: 'Join here',
    preventa: 'Pre-sale price until {fecha} ({huso}).',
    preventaRest: 'That day I open the doors and the price goes up to {precio}.',
    preventaPie:
      'If you join in the pre-sale, your classroom opens on {fecha} ({huso}), when I open the doors. You’ll get an email with the link to your classroom as soon as you pay.',
    antes: 'Doors open {fecha} ({huso}).',
    cadencia: 'one-time payment',
  },
};

export const rellenar = (plantilla: string, l: Lanzamiento, lang: Lang): string =>
  plantilla
    .replaceAll('{fecha}', fechaPuertas(l.abre, lang))
    .replaceAll('{huso}', HUSO[lang])
    .replaceAll('{precio}', l.venta.precio[lang]);

/**
 * El enlace de pago que reconoce el webhook, con su ficha y su idioma. Se
 * comparan sin la `?query` ni la barra final.
 */
export function compraPorEnlace(url: string): { slug: string; lang: Lang } | null {
  const limpio = (u: string) => u.trim().split('?')[0].replace(/\/+$/, '').toLowerCase();
  const buscado = limpio(url);
  if (!buscado) return null;
  for (const [slug, l] of Object.entries(lanzamientos)) {
    for (const enlaces of [l.preventa?.enlaces, l.venta.enlaces]) {
      if (!enlaces) continue;
      for (const lang of ['es', 'en'] as const) {
        if (enlaces[lang] && limpio(enlaces[lang]) === buscado) return { slug, lang };
      }
    }
  }
  return null;
}
