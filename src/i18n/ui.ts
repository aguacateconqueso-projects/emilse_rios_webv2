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
      'El newsletter de Emilse Ríos. Cada semana, los errores que estancan tu progreso con el contrabajo — y cómo salir de ellos.',
    'site.name': 'Emilse Ríos',

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
    'form.done': 'Listo. Revisa tu bandeja de entrada.',
    'form.error': 'Ese correo no parece válido. ¿Lo revisas?',
    'form.failed':
      'No pudimos completar la suscripción. Escríbeme a info@emilserios.com y te apunto yo.',

    'cards.open': 'Leer el correo',
    'cards.close': 'Cerrar',

    'media.portrait': 'Retrato de Emi con el contrabajo — blanco y negro',
    'media.portraitAlt':
      'Emilse Ríos en una calle arbolada, abrazada a su contrabajo, lanzando un beso con una pierna en alto',
    'about.description':
      'Le dijeron que el contrabajo no era para ella. Esta es la historia de por qué se equivocaron: veinte años tocando y formando contrabajistas, de El Sistema a Madrid.',

    /* --- La tienda, que está afuera y no pide nada ----------------------
       Se llamó «Productos» hasta el 23 sep 2026; desde entonces, a pedido de
       Emi, «Formaciones». Y desde el 24 sep 2026 su dirección también:
       `/formaciones/` y `/en/courses/`. Ver `routes`, más abajo. */
    'products.title': 'Formaciones',
    'products.description':
      'Los cursos y la membresía de Emilse Ríos. Aprende contrabajo a tu ritmo, con acompañamiento de verdad.',
    'products.heading': 'Tú también puedes lograrlo',
    'products.lead':
      'Cada formación de contrabajo nace de una historia: una profesora que odiaba las escalas, un estudiante que después de año y medio no conocía ninguna obra para contrabajo, una contrabajista con vibrato de cabra. Entra y te la cuento. Tal vez te funcione a ti también.',
    'products.close': 'No necesitas un talento innato ni una edad específica. Solo constancia.',
    'products.soon': 'Próximamente',
    'products.closed': 'Cerrado por ahora',
    'products.back': 'Volver a Formaciones',
    'products.enrolled': '¿Ya compraste? El aula es por acá',

    'footer.email': 'info@emilserios.com',
  },
  en: {
    'site.title': 'Double Bass in the City',
    'site.description':
      "Emilse Ríos's newsletter. Every week, the mistakes that stall your progress on the double bass — and how to get past them.",
    'site.name': 'Emilse Ríos',

    'nav.about': 'About',
    'nav.products': 'Courses',
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
    'form.done': 'Done. Check your inbox.',
    'form.error': "That email doesn't look valid. Mind checking it?",
    'form.failed':
      "We couldn't complete the subscription. Write to info@emilserios.com and I'll add you myself.",

    'cards.open': 'Read the email',
    'cards.close': 'Close',

    'media.portrait': 'Portrait of Emi with the double bass — black and white',
    'media.portraitAlt':
      'Emilse Ríos on a tree-lined street, hugging her double bass and blowing a kiss, one leg kicked up behind her',
    'about.description':
      'They told her the double bass wasn\'t for her. This is the story of why they were wrong: twenty years playing and training bassists, from El Sistema to Madrid.',

    /* --- La tienda, que está afuera y no pide nada ---------------------- */
    'products.title': 'Courses',
    'products.description':
      "Emilse Ríos's courses and membership. Learn double bass at your own pace, with real guidance.",
    'products.heading': 'You can do it too',
    'products.lead':
      "Every double bass course was born from a story: a teacher who hated scales, a student who, after a year and a half, didn't know a single piece for double bass, a bassist with a goat vibrato. Come in and I'll tell you. Maybe it'll work for you too.",
    'products.close': "You don't need innate talent or a specific age. Just consistency.",
    'products.soon': 'Coming soon',
    'products.closed': 'Closed for now',
    'products.back': 'Back to Courses',
    'products.enrolled': 'Already bought? The classroom is this way',

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
 * `products` se llama «Formaciones» / «Courses» desde el 23 sep 2026, y **su
 * dirección también, desde el 24 sep 2026**: `/formaciones/` y
 * `/en/courses/` (lo pidió Adrián: que «products» no salga en los enlaces).
 * Hasta ese día fue `/productos/` y `/en/products/`, y esas direcciones siguen
 * pegadas en los correos de Emi: **las redirige `astro.config.mjs`**, la
 * portada y cada página de ventas, con un 301. Si esta línea vuelve a cambiar,
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
  products: { es: '/formaciones', en: '/courses' },
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
 * Dirección de la carta de venta de un producto.
 *
 * Cuelga de la tienda, que está afuera y no pide sesión — `/formaciones/` y
 * `/en/courses/` —, no del aula, que desde ahora pide haber pagado. El slug
 * de la sección se traduce, pero **el del producto no**: el slug es la
 * identidad del producto, la misma que llevará su fila en la base de datos y
 * la que aparecerá en el enlace que Emi pegue en un correo. Un producto, un
 * slug, en los dos idiomas.
 */
export function productPath(slug: string, lang: Lang): string {
  return `${routePath('products', lang)}${slug}/`;
}
