export const languages = ['es', 'en'] as const;
export type Lang = (typeof languages)[number];

export const defaultLang: Lang = 'es';

/**
 * Cadenas de interfaz. Se maqueta con el español, que es el texto más largo;
 * el inglés entra en las mismas cajas sin tocar nada.
 */
export const ui = {
  es: {
    'site.title': 'Contrabajo en la Ciudad',
    'site.description':
      'El newsletter de Emilse Rios. Cada semana, los errores que estancan tu progreso con el contrabajo — y cómo salir de ellos.',
    'site.name': 'Emilse Rios',

    'nav.about': 'Sobre mí',
    'nav.products': 'Formaciones',
    'nav.aula': 'Aula Virtual',
    'nav.enter': 'Ingresar al aula',
    'nav.home': 'Ir al inicio',
    'nav.start': 'Inicio',
    'nav.menu': 'Menú',
    'nav.close': 'Cerrar',
    'nav.skip': 'Saltar al contenido',
    'nav.langLabel': 'Idioma',
    'nav.toEnglish': 'Ver el sitio en inglés',
    'nav.toSpanish': 'Ver el sitio en español',

    'form.label': 'Tu correo electrónico',
    'form.placeholder': 'tu@correo.com',
    'form.cta': 'Acá te suscribes',
    /* El copy de Emi (27 sep 2026): ahora que el alta ocurre acá mismo, sin
       pasar por la página de Klaviyo, esto es lo único que ve quien se
       suscribe. El asunto es el del primer correo de la bienvenida. */
    'form.done':
      'Ya va en camino. Asunto: «El ejercicio que el 90% hace mal». Si no lo ves en tu bandeja, mira en spam o promociones y muévelo a tu bandeja principal. Así no te pierdes ninguno.',
    'form.error': 'Ese correo no parece válido. ¿Lo revisas?',
    'form.failed':
      'No pudimos completar la suscripción. Escríbeme a info@emilserios.com y te apunto yo.',

    'cards.open': 'Leer el correo',
    'cards.close': 'Cerrar',

    'media.portrait': 'Retrato de Emi con el contrabajo — blanco y negro',
    'media.portraitAlt':
      'Emilse Rios, contrabajista, abrazada a su contrabajo en una calle de Madrid',
    'about.description':
      'Le dijeron que el contrabajo no era para ella. Esta es la historia de por qué se equivocaron: veinte años tocando y formando contrabajistas, de El Sistema a Madrid.',

    /* --- La tienda, que está afuera y no pide nada ----------------------
       Se llamó «Productos» hasta el 23 sep 2026; desde entonces, a pedido de
       Emi, «Formaciones». Y desde el 24 sep 2026 su dirección también:
       `/formaciones/` y, desde el 9 oct, `/en/programs/`. Ver `routes`, más
       abajo. */
    'products.title': 'Formaciones',
    'products.description':
      'Los cursos y la membresía de Emilse Rios. Aprende contrabajo a tu ritmo, con acompañamiento de verdad.',
    'products.heading': 'Tú también puedes lograrlo',
    'products.lead':
      'Cada formación de contrabajo nace de una historia: una profesora que odiaba las escalas, un estudiante que después de año y medio no conocía ninguna obra para contrabajo, una contrabajista con vibrato de cabra. Entra y te la cuento. Tal vez te funcione a ti también.',
    'products.close': 'No necesitas un talento innato ni una edad específica. Solo constancia.',
    'products.soon': 'Próximamente',
    'products.closed': 'Cerrado por ahora',
    'products.back': 'Volver a Formaciones',
    'products.enrolled': '¿Ya tienes una formación? El aula es por acá',
    /* El remate de cada ficha que lleva a su página (27 sep 2026, Emi). */
    'products.more': 'Leer más',

    /* --- Los newsletters pasados (11 oct 2026, pedido de SEO de Emi) -----
       `/newsletters/`. El bloque del newsletter de arriba es el de la Home
       (`src/data/home.ts`); las posdatas las escribe Emi en cada entrada. */
    'nl.h1': 'Algunos newsletters pasados',
    'nl.leer': 'Leer más',
    'nl.sigue': 'Sigue leyendo',
    'nl.verMas': 'Ver más',
    'nl.pagina': 'Página',
    'nl.indiceTitle': 'Algunos newsletters pasados · Contrabajo en la Ciudad',
    'nl.indiceDesc':
      'Algunos correos de Contrabajo en la Ciudad, el newsletter de Emilse Rios: técnica, vibrato y estudio del contrabajo, contados con historias.',

    'footer.email': 'info@emilserios.com',
  },
  en: {
    'site.title': 'Double Bass in the City',
    'site.description':
      "Emilse Rios's newsletter. Every week, the mistakes that stall your progress on the double bass — and how to get past them.",
    'site.name': 'Emilse Rios',

    'nav.about': 'About',
    /* «Programs» desde el 9 oct 2026, como la dirección (`/en/programs/`) y
       como dice el inglés de Emi. Hasta ese día, «Courses». */
    'nav.products': 'Programs',
    'nav.aula': 'Virtual Classroom',
    'nav.enter': 'Enter the classroom',
    'nav.home': 'Go to the home page',
    'nav.start': 'Home',
    'nav.menu': 'Menu',
    'nav.close': 'Close',
    'nav.skip': 'Skip to content',
    'nav.langLabel': 'Language',
    'nav.toEnglish': 'View this site in English',
    'nav.toSpanish': 'View this site in Spanish',

    'form.label': 'Your email address',
    'form.placeholder': 'your@email.com',
    'form.cta': 'Sign up here',
    'form.done':
      'It’s on its way. Subject: “The exercise 90% get wrong.” If you don’t see it in your inbox, check spam or promotions and move it to your primary inbox. That way you won’t miss a single one.',
    'form.error': "That email doesn't look valid. Mind checking it?",
    'form.failed':
      "We couldn't complete the subscription. Write to info@emilserios.com and I'll add you myself.",

    'cards.open': 'Read the email',
    'cards.close': 'Close',

    'media.portrait': 'Portrait of Emi with the double bass — black and white',
    'media.portraitAlt':
      'Emilse Rios, double bassist, hugging her double bass on a street in Madrid',
    'about.description':
      'They told her the double bass wasn\'t for her. This is the story of why they were wrong: twenty years playing and training bassists, from El Sistema to Madrid.',

    /* --- La tienda, que está afuera y no pide nada ---------------------- */
    'products.title': 'Programs',
    'products.description':
      "Emilse Rios's programs and membership. Learn double bass at your own pace, with real guidance.",
    'products.heading': 'You can do it too',
    'products.lead':
      "Every double bass course was born from a story: a teacher who hated scales, a student who, after a year and a half, didn't know a single piece for double bass, a bassist with a goat vibrato. Come in and I'll tell you. Maybe it'll work for you too.",
    'products.close': "You don't need innate talent or a specific age. Just consistency.",
    'products.soon': 'Coming soon',
    'products.closed': 'Closed for now',
    'products.back': 'Back to Programs',
    'products.enrolled': 'Already have a program? The classroom is this way',
    'products.more': 'Read more',

    /* --- Los newsletters pasados (11 oct 2026) --------------------------- */
    'nl.h1': 'Some past newsletters',
    'nl.leer': 'Read more',
    'nl.sigue': 'Keep reading',
    'nl.verMas': 'See more',
    'nl.pagina': 'Page',
    'nl.indiceTitle': 'Some past newsletters · Double Bass in the City',
    'nl.indiceDesc':
      'Some emails from Double Bass in the City, Emilse Rios’s newsletter: technique, vibrato and double bass practice, told through stories.',

    'footer.email': 'info@emilserios.com',
  },
} as const;

/** Devuelve un traductor atado al idioma dado. */
export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/**
 * Las páginas del sitio y su dirección en cada idioma.
 *
 * `products` se llama «Formaciones» / «Programs» desde el 23 sep 2026 (en
 * inglés fue «Courses» hasta el 9 oct 2026), y **su dirección también, desde
 * el 24 sep 2026**: `/formaciones/` y, en inglés, `/en/programs/` desde el 9
 * oct 2026 (pedido de Emi: todo el inglés bajo `/en/programs/`, como ya
 * estaba la membresía). Antes fue `/productos/` y `/en/products/`, y del 24
 * sep al 9 oct `/en/courses/`: esas direcciones siguen pegadas en correos y
 * **las redirige `astro.config.mjs`**, la portada y cada página de ventas,
 * con un 301. Si esta línea vuelve a cambiar,
 * las redirecciones de allá tienen que apuntar a la nueva, y
 * `npm run audit:redirecciones` lo comprueba. La clave `products` es solo el
 * nombre interno, igual que la tabla `products` de la base de datos.
 *
 * Cada idioma tiene su propio slug: en inglés la página es `/en/about/`, no
 * `/en/sobre-mi/`. Al añadir una página, se añade acá y en `src/pages`.
 */
export const routes = {
  home: { es: '/', en: '/' },
  about: { es: '/sobre-mi', en: '/about' },
  products: { es: '/formaciones', en: '/programs' },
  /* Los newsletters pasados (11 oct 2026). Del 9 al 11 oct fue
     `/newsletter/`, en singular: lo redirige `astro.config.mjs`. */
  newsletters: { es: '/newsletters', en: '/newsletters' },
  aula: { es: '/aulavirtual', en: '/classroom' },
} as const satisfies Record<string, Record<Lang, string>>;

export type Route = keyof typeof routes;

/** Dirección de una página en un idioma. El inglés vive bajo `/en`. */
export function routePath(route: Route, lang: Lang): string {
  const slug = routes[route][lang];
  if (lang === defaultLang) return slug === '/' ? '/' : `${slug}/`;
  return slug === '/' ? '/en/' : `/en${slug}/`;
}

/**
 * **El slug en inglés de cada producto** (9 oct 2026, Emi: «los slugs en
 * inglés están en español»). Las cartas en inglés viven en
 * `/en/programs/<slug-en-inglés>/`; en español siguen en
 * `/formaciones/<slug>/`. **El slug de verdad no cambia**: sigue siendo el
 * español, la identidad del producto —su fila en `products` y en
 * `sales_pages`, la carta de `src/data/cartas.ts`, el panel, el cobro—. Esto
 * es solo la dirección que se ve.
 *
 * Un producto que no esté acá —uno nuevo que Emi cree desde el panel— vive en
 * `/en/programs/<su-slug>/`. Darle uno en inglés es añadir su línea acá y sus
 * redirecciones en `astro.config.mjs` (`SLUGS_EN`, que tiene que decir lo
 * mismo); `npm run audit:redirecciones` lo comprueba.
 */
export const slugsIngles: Record<string, string> = {
  'estudiemos-juntos': 'double-bass-membership',
  'todo-el-diapason': 'fingerboard',
  'todas-las-escalas': 'all-the-scales',
  'contrabajo-desde-cero': 'double-bass-from-scratch',
  'tu-vibrato-como-un-cantante': 'vibrato-like-a-singer',
  'clases-online': 'online-lessons',
};

/**
 * Los productos que en español no viven en `/formaciones/<slug>/`.
 *
 * Pedido de Emi el 1 oct 2026, para la membresía:
 * `/formaciones/membresia-contrabajo/` (en inglés,
 * `/en/programs/double-bass-membership/`, que sale de `slugsIngles`). Su
 * dirección de antes, `/formaciones/estudiemos-juntos/`, lleva a la nueva con
 * un 301: la redirige la propia página y, antes, `astro.config.mjs`.
 */
const direccionesEspanol: Record<string, string> = {
  'estudiemos-juntos': '/formaciones/membresia-contrabajo/',
};

/**
 * Dirección de la carta de venta de un producto.
 *
 * Cuelga de la tienda, que está afuera y no pide sesión — `/formaciones/` y
 * `/en/programs/` —, no del aula, que desde ahora pide haber pagado. En
 * español, con su slug —salvo la membresía, `direccionesEspanol`—; en inglés,
 * con su slug en inglés (`slugsIngles`).
 */
export function productPath(slug: string, lang: Lang): string {
  if (lang === 'en') return `${routePath('products', lang)}${slugsIngles[slug] ?? slug}/`;
  return direccionesEspanol[slug] ?? `${routePath('products', lang)}${slug}/`;
}

/**
 * Al revés: el producto que vive en esta dirección, si no es la de su slug, o
 * `null`. La usan las páginas de ventas para saber qué carta pintar. Con
 * barra final o sin ella.
 */
export function productoEnDireccion(pathname: string, lang: Lang): string | null {
  const ruta = pathname.endsWith('/') ? pathname : `${pathname}/`;
  for (const slug of new Set([...Object.keys(slugsIngles), ...Object.keys(direccionesEspanol)])) {
    if (productPath(slug, lang) === ruta && !ruta.endsWith(`/${slug}/`)) return slug;
  }
  return null;
}

/**
 * Lo que tiene que hacer una página de ventas con la dirección que le
 * pidieron: pintar un producto (`slug`), o mandar con un 301 a su dirección
 * de verdad (`redirigir`) —el slug español en `/en/programs/`, o
 * `/formaciones/estudiemos-juntos/`—, conservando la `?query`: las campañas
 * llevan `utm_`.
 */
export function paginaDeVenta(
  url: URL,
  param: string,
  lang: Lang,
): { slug: string } | { redirigir: string } {
  const propio = productoEnDireccion(url.pathname, lang);
  if (propio) return { slug: propio };
  const destino = productPath(param, lang);
  const aqui = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
  if (destino !== aqui) return { redirigir: `${destino}${url.search}` };
  return { slug: param };
}
