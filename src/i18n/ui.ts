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
    'nav.products': 'Productos',
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
      'No pudimos completar la suscripción. Escríbeme a hola@contrabajoenlaciudad.com y te apunto yo.',

    'cards.open': 'Leer el correo',
    'cards.close': 'Cerrar',

    'media.play': 'Reproducir',
    'media.playSoon': 'El video llega pronto',
    'media.portrait': 'Retrato de Emi con el contrabajo — blanco y negro',
    'media.portraitAlt': 'Emilse Ríos con su contrabajo',
    'media.still': 'Fotograma del video',
    'about.description':
      'Le dijeron que el contrabajo no era para ella. Esta es la historia de por qué se equivocaron: veinte años tocando y formando contrabajistas, de El Sistema a Madrid.',

    /* --- La tienda, que está afuera y no pide nada ---------------------- */
    'products.title': 'Productos',
    'products.description':
      'Los cursos y la membresía de Emilse Ríos. Aprende contrabajo a tu ritmo, con acompañamiento de verdad.',
    'products.soon': 'Próximamente',
    'products.see': 'Ver el curso',
    'products.seeMembership': 'Ver la membresía',
    'products.buy': 'Comprar',
    'products.back': 'Volver a Productos',
    'products.leaving':
      'El cobro todavía vive en emilseriosacademy.com. Se muda a esta casa con el cambio de dominio, y quien ya esté dentro no tiene que hacer nada.',
    'products.enrolled': '¿Ya compraste? El aula es por acá',

    /* --- El aula, que está adentro y pide haber pagado ------------------- */
    'aula.title': 'Aula Virtual',
    'aula.description':
      'El aula de Emilse Ríos. Acá entran quienes ya son miembros o compraron un curso.',
    'aula.lead':
      'Acá dentro está lo que ya compraste: el ejercicio de esta semana, el concepto del mes y tus cursos.',
    'aula.locked': 'Esta parte pide iniciar sesión',
    'aula.hint':
      'Si ya eres miembro o compraste un curso, entras con el correo con el que pagaste.',
    'aula.away':
      'El aula todavía vive en emilseriosacademy.com. Se muda a esta casa con el cambio de dominio, y quien ya esté dentro no tiene que hacer nada.',
    'aula.noAccount': '¿Todavía no estudias con Emi?',
    'aula.toProducts': 'Mira lo que hay a la venta',
    'footer.email': 'hola@contrabajoenlaciudad.com',
    'footer.instagram': 'Instagram',
    'footer.youtube': 'YouTube',
  },
  en: {
    'site.title': 'Double Bass in the City',
    'site.description':
      "Emilse Ríos's newsletter. Every week, the mistakes that stall your progress on the double bass — and how to get past them.",
    'site.name': 'Emilse Ríos',

    'nav.about': 'About',
    'nav.products': 'Products',
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
    'form.cta': 'Subscribe here',
    'form.done': 'Done. Check your inbox.',
    'form.error': "That email doesn't look valid. Mind checking it?",
    'form.failed':
      "We couldn't complete the subscription. Write to hola@contrabajoenlaciudad.com and I'll add you myself.",

    'cards.open': 'Read the email',
    'cards.close': 'Close',

    'media.play': 'Play',
    'media.playSoon': 'The video is coming soon',
    'media.portrait': 'Portrait of Emi with the double bass — black and white',
    'media.portraitAlt': 'Emilse Ríos with her double bass',
    'media.still': 'Video still',
    'about.description':
      'They told her the double bass wasn\'t for her. This is the story of why they were wrong: twenty years playing and training bassists, from El Sistema to Madrid.',

    /* --- La tienda, que está afuera y no pide nada ---------------------- */
    'products.title': 'Products',
    'products.description':
      "Emilse Ríos's courses and membership. Learn double bass at your own pace, with real guidance.",
    'products.soon': 'Coming soon',
    'products.see': 'View the course',
    'products.seeMembership': 'View the membership',
    'products.buy': 'Buy',
    'products.back': 'Back to Products',
    'products.leaving':
      'Payment still lives at emilseriosacademy.com. It moves into this house with the domain change, and anyone already inside has nothing to do.',
    'products.enrolled': 'Already bought? The classroom is this way',

    /* --- El aula, que está adentro y pide haber pagado ------------------- */
    'aula.title': 'Virtual Classroom',
    'aula.description':
      "Emilse Ríos's classroom. This is where members and course students come in.",
    'aula.lead':
      "Inside is everything you already bought: this week's exercise, the month's concept and your courses.",
    'aula.locked': 'This part asks you to sign in',
    'aula.hint':
      'If you are already a member or bought a course, you come in with the email you paid with.',
    'aula.away':
      'The classroom still lives at emilseriosacademy.com. It moves into this house with the domain change, and anyone already inside has nothing to do.',
    'aula.noAccount': 'Not studying with Emi yet?',
    'aula.toProducts': "See what's on sale",
    'footer.email': 'hola@contrabajoenlaciudad.com',
    'footer.instagram': 'Instagram',
    'footer.youtube': 'YouTube',
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
 * Cada idioma tiene su propio slug: en inglés la página es `/en/about/`, no
 * `/en/sobre-mi/`. Al añadir una página, se añade acá y en `src/pages`.
 */
export const routes = {
  home: { es: '/', en: '/' },
  about: { es: '/sobre-mi', en: '/about' },
  products: { es: '/productos', en: '/products' },
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
 * Cuelga de la tienda, que está afuera y no pide sesión — `/productos/` y
 * `/en/products/` —, no del aula, que desde ahora pide haber pagado. El slug
 * de la sección se traduce, pero **el del producto no**: el slug es la
 * identidad del producto, la misma que llevará su fila en la base de datos y
 * la que aparecerá en el enlace que Emi pegue en un correo. Un producto, un
 * slug, en los dos idiomas.
 */
export function productPath(slug: string, lang: Lang): string {
  return `${routePath('products', lang)}${slug}/`;
}
