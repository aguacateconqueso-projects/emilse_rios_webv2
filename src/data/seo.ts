import type { Lang } from '../i18n/ui';
import { lanzamientos, momento } from './lanzamientos';

/**
 * Lo que lee Google: títulos, descripciones y datos estructurados.
 *
 * **11 de octubre de 2026, el pedido de SEO de Emi** («Prompt SEO de
 * emilserios.com — versión única», hecho con su Claude). La regla de oro de
 * ese documento: **no se cambia ningún texto visible del cuerpo de las
 * páginas**; esto toca solo `<title>`, la descripción, los `og:` y el JSON-LD.
 * Los textos son los de sus tablas, tal cual.
 *
 * **Mandan sobre lo que tenga el panel** en «Págs. de ventas» (título y
 * descripción de cada carta): lo decidió Adrián el 11 oct 2026. Una carta que
 * no esté acá —una nueva que Emi cree desde el panel— usa los suyos.
 */

export const SITIO = 'https://www.emilserios.com';
export const PERSONA_ID = `${SITIO}/#emilse`;
export const WEBSITE_ID = `${SITIO}/#website`;

/** La imagen al compartir de Inicio, Sobre mí, Formaciones y el newsletter. */
export const OG_IMAGEN = {
  url: `${SITIO}/emilse-rios-contrabajo-og.jpg`,
  ancho: 1200,
  alto: 630,
  alt: {
    es: 'Emilse Rios con su contrabajo en una calle de Madrid',
    en: 'Emilse Rios with her double bass on a street in Madrid',
  } as Record<Lang, string>,
};

export type Meta = { title: string; description: string };

/** Las páginas del sitio que no son cartas. */
export const metaPaginas: Record<Lang, Record<'home' | 'about' | 'products', Meta>> = {
  es: {
    home: {
      title: 'Contrabajo en la Ciudad: el newsletter de Emilse Rios',
      description:
        'Soy Emilse Rios, contrabajista. Cada semana te escribo sobre los errores que estancan tu progreso con el contrabajo y cómo salir de ellos.',
    },
    about: {
      title: '¿Nos conocemos? Emilse Rios, contrabajista y profesora',
      description:
        'Hola, soy Emilse Rios. Si alguna vez te dijeron que el contrabajo no es para ti, tal vez mi historia te ayude un poco.',
    },
    products: {
      title: 'Formaciones de contrabajo online · Emilse Rios',
      description:
        'Formaciones de contrabajo online, membresía especializada en arco alemán, cómo aprender vibrato, conocer la posición de pulgar y más.',
    },
  },
  en: {
    home: {
      title: 'Double Bass in the City: Emilse Rios’s newsletter',
      description:
        'I’m Emilse Rios, a double bassist. Every week I write about the mistakes that stall your progress on the double bass, and how to get past them.',
    },
    about: {
      title: 'Have we met? Emilse Rios, double bassist and teacher',
      description:
        'Hi, I’m Emilse Rios. If anyone ever told you the double bass isn’t for you, maybe my story will help a little.',
    },
    products: {
      title: 'Online double bass programs · Emilse Rios',
      description:
        'Online double bass programs, a membership specialized in German bow, how to learn vibrato, thumb position and more.',
    },
  },
};

/** Cada carta, por el slug de su ficha. */
export const metaFormaciones: Record<string, Record<Lang, Meta>> = {
  'estudiemos-juntos': {
    es: {
      title: 'Estudiemos Juntos: membresía de contrabajo online',
      description:
        'Estudiemos Juntos es mi membresía de ejercicios de contrabajo. El 90% es arco: un ejercicio nuevo cada jueves y un concepto técnico explicado cada mes.',
    },
    en: {
      title: 'Let’s Study Together: online double bass membership',
      description:
        'Let’s Study Together is my double bass exercise membership. 90% is bow work: a new exercise every Thursday and one technical concept explained each month.',
    },
  },
  'todo-el-diapason': {
    es: {
      title: 'Todo el diapasón: curso de contrabajo, de posición 1 al pulgar',
      description:
        'Recorre el diapasón del contrabajo de la primera posición al pulgar, sin miedo, con obras y piano. Incluye «Todas las escalas (sin aburrirte)».',
    },
    en: {
      title: 'Fingerboard: from position 1 to thumb, No fear!',
      description:
        'Cross the whole double bass fingerboard, from first position to thumb, with pieces and piano. Includes “All the scales (without getting bored)”.',
    },
  },
  'todas-las-escalas': {
    es: {
      title: 'Todas las escalas (sin aburrirte) · Escalas de contrabajo',
      description:
        'Odiaba las escalas, hasta que las estudié con piano. Las 24 escalas de contrabajo en dos octavas, con digitaciones en PDF, video y acompañamiento.',
    },
    en: {
      title: 'All the scales (without getting bored) · Double bass scales',
      description:
        'I hated scales until I started playing them with piano. All 24 double bass scales in two octaves, with fingering PDFs, videos and accompaniment.',
    },
  },
  'contrabajo-desde-cero': {
    es: {
      title: 'Contrabajo desde cero: curso para empezar a tocar',
      description:
        'Aprende contrabajo desde cero con una guía clara: haces música en semanas, no en años. Tus primeras escalas y dos obras con acompañamiento de piano.',
    },
    en: {
      title: 'Double bass from scratch: a course to start playing',
      description:
        'Learn double bass from scratch with a clear guide: you make music in weeks, not years. Your first scales and two pieces with piano accompaniment.',
    },
  },
  'tu-vibrato-como-un-cantante': {
    es: {
      title: 'Tu vibrato como un cantante · Vibrato en el contrabajo',
      description:
        'Tu vibrato es la herramienta más poderosa para expresarte con el contrabajo. Aprende a dominarlo y a usarlo como lo haría un cantante.',
    },
    en: {
      title: 'Your vibrato, like a singer · Double bass vibrato',
      description:
        'Your vibrato is the most powerful tool you have to express yourself on the double bass. Learn to master it and use it the way a singer would.',
    },
  },
  'clases-online': {
    es: {
      title: 'Clases de contrabajo online 1:1 con Emilse Rios',
      description:
        'Clases de contrabajo online, una a una, con Emilse Rios. En la primera te llevas tu plan de estudio en PDF, sigamos juntos o no.',
    },
    en: {
      title: '1:1 online double bass lessons with Emilse Rios',
      description:
        'One-to-one online double bass lessons with Emilse Rios. In the first one you leave with your own study plan as a PDF, whether we continue or not.',
    },
  },
};

/** El texto alternativo de la foto de la membresía (la ficha de la Tienda). */
export const ALT_MEMBRESIA: Record<Lang, string> = {
  es: 'Emilse Rios, profesora de contrabajo',
  en: 'Emilse Rios, double bass teacher',
};

/* ==========================================================================
   Los datos estructurados (JSON-LD)
   ========================================================================== */

type Nodo = Record<string, unknown>;

/** Emi: la misma persona en todo el sitio, con un único `@id`. */
export function persona(lang: Lang): Nodo {
  return {
    '@type': 'Person',
    '@id': PERSONA_ID,
    name: 'Emilse Rios',
    jobTitle: lang === 'en' ? 'Double bassist and double bass teacher' : 'Contrabajista y profesora de contrabajo',
    description:
      lang === 'en'
        ? 'Emilse Rios, double bassist and teacher recognized for her contribution to the double bass community worldwide, a pioneer in online teaching.'
        : 'Emilse Rios, Contrabajista y docente reconocida por su aporte a la comunidad de contrabajistas del mundo, pionera en la enseñanza online.',
    nationality: { '@type': 'Country', name: 'Venezuela' },
    homeLocation: { '@type': 'Place', name: 'Madrid, España' },
    image: OG_IMAGEN.url,
    url: `${SITIO}/`,
    /* Solo en los datos para Google: en la página no hay enlaces a redes. */
    sameAs: ['https://www.instagram.com/emilserios/', 'https://www.youtube.com/@emilsebass'],
    knowsAbout: ['Contrabajo', 'Técnica de contrabajo', 'Enseñanza de contrabajo'],
  };
}

/** El sitio: solo en el inicio. */
export const sitioWeb: Nodo = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: 'Contrabajo en la Ciudad',
  alternateName: 'Double Bass in the City',
  url: `${SITIO}/`,
  inLanguage: ['es', 'en'],
  publisher: { '@id': PERSONA_ID },
};

const ORGANIZACION: Nodo = { '@type': 'Organization', name: 'Contrabajo en la Ciudad', url: `${SITIO}/` };

/** «240 €» → 240. */
const importe = (precio: string) => Number(precio.replace(/[^\d.,]/g, '').replace(',', '.'));

/** La fecha (en Madrid) de un instante ISO: «2026-10-16». */
const diaMadrid = (iso: string) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(
    Date.parse(iso),
  );

/**
 * Lo que es cada formación para Google: `Course`, `Product` (la membresía) o
 * `Service` (las clases 1:1), con su oferta. **El precio del diapasón cambia
 * solo**: 195 € con `priceValidUntil` hasta que abren las puertas y 240 €
 * desde entonces —sale de `src/data/lanzamientos.ts`, el mismo reloj de la
 * carta—. Los cursos cerrados, sin oferta. `null` si la ficha no está acá.
 */
export function datosFormacion(slug: string, lang: Lang, url: string, ahora = Date.now()): Nodo | null {
  const meta = metaFormaciones[slug]?.[lang];
  if (!meta) return null;
  const base = { '@id': `${url}#formacion`, name: meta.title, description: meta.description, url, inLanguage: lang };

  if (slug === 'estudiemos-juntos') {
    return {
      '@type': 'Product',
      ...base,
      brand: ORGANIZACION,
      offers: {
        '@type': 'Offer',
        price: 65,
        priceCurrency: 'EUR',
        url,
        priceSpecification: { '@type': 'UnitPriceSpecification', price: 65, priceCurrency: 'EUR', unitText: 'MONTH' },
      },
    };
  }

  if (slug === 'clases-online') {
    return {
      '@type': 'Service',
      ...base,
      provider: { '@id': PERSONA_ID },
      brand: ORGANIZACION,
      offers: [
        { '@type': 'Offer', name: lang === 'en' ? 'First lesson' : 'Primera clase', price: 70, priceCurrency: 'EUR', url },
        { '@type': 'Offer', name: lang === 'en' ? 'Following lessons' : 'Clases siguientes', price: 60, priceCurrency: 'EUR', url },
      ],
    };
  }

  const curso: Nodo = { '@type': 'Course', ...base, provider: ORGANIZACION, instructor: { '@id': PERSONA_ID } };
  const l = lanzamientos[slug];
  if (!l) return curso; // Contrabajo desde cero, el vibrato: cerrados, sin oferta.
  const m = momento(l, ahora);
  if (m === 'preventa' && l.preventa) {
    curso.offers = {
      '@type': 'Offer',
      category: 'Paid',
      price: importe(l.preventa.precio.es),
      priceCurrency: 'EUR',
      priceValidUntil: diaMadrid(l.abre),
      availability: 'https://schema.org/PreOrder',
      url,
    };
  } else {
    curso.offers = {
      '@type': 'Offer',
      category: 'Paid',
      price: importe(l.venta.precio.es),
      priceCurrency: 'EUR',
      availability: m === 'abierto' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      url,
    };
  }
  return curso;
}
