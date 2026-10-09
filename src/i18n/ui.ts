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
      'Emilse Ríos en una calle arbolada, abrazada a su contrabajo, lanzando un beso con una pierna en alto',
    'about.description':
      'Le dijeron que el contrabajo no era para ella. Esta es la historia de por qué se equivocaron: veinte años tocando y formando contrabajistas, de El Sistema a Madrid.',

    /* --- La tienda, que está afuera y no pide nada ----------------------
       Se llamó «Productos» hasta el 23 sep 2026; desde entonces, a pedido de
       Emi, «Formaciones». Y desde el 24 sep 2026 su dirección también:
       `/formaciones/` y, desde el 9 oct, `/en/programs/`. Ver `routes`, más
       abajo. */
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
    'products.enrolled': '¿Ya tienes una formación? El aula es por acá',
    /* El remate de cada ficha que lleva a su página (27 sep 2026, Emi). */
    'products.more': 'Leer más',

    /* --- Las entradas del newsletter (9 oct 2026) ------------------------
       `/newsletter/`. El texto de arriba y la segunda posdata son los de Emi
       en la Home (`src/data/home.ts`); la primera posdata es la suya,
       reescrita «de manera natural», como pidió. */
    'nav.newsletter': 'Newsletter',
    'news.title': 'Contrabajo en la Ciudad',
    'news.kicker': 'El newsletter',
    'news.eyebrow': 'Contrabajo en la Ciudad — El newsletter',
    'news.lead':
      'Cada semana envío correos donde explico errores que estancan tu progreso con el contrabajo. Son tan obvios que parecen tontos, pero son tan comunes que tal vez los estés cometiendo a diario — sin saberlo.',
    'news.entries': 'Entradas',
    'news.read': 'Leer la entrada',
    'news.more': 'Más entradas',
    'news.ps1': 'PD: ¿Todavía no estás en mi newsletter? ',
    'news.ps1Link': 'Suscríbete aquí',
    'news.ps1End': '. Entrar es gratis, y salir también.',
    'news.ps2':
      'PD 2: Al suscribirte recibes un correo de bienvenida con un video. Se trata de un ejercicio donde te explico un concepto que va a cambiar tu forma de producir el sonido. El video dura 4:04 y el ejercicio seguro lo conoces — no hay contrabajista que no lo haya practicado. Pero el 90% lo hace mal, JA. Casi nadie sabe de dónde viene realmente ese movimiento, pero en ese 90% no vas a estar tú, tú no, no después de ver el video. Ya me contarás.',

    'footer.email': 'info@emilserios.com',
  },
  en: {
    'site.title': 'Double Bass in the City',
    'site.description':
      "Emilse Ríos's newsletter. Every week, the mistakes that stall your progress on the double bass — and how to get past them.",
    'site.name': 'Emilse Ríos',

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
      'Emilse Ríos on a tree-lined street, hugging her double bass and blowing a kiss, one leg kicked up behind her',
    'about.description':
      'They told her the double bass wasn\'t for her. This is the story of why they were wrong: twenty years playing and training bassists, from El Sistema to Madrid.',

    /* --- La tienda, que está afuera y no pide nada ---------------------- */
    'products.title': 'Programs',
    'products.description':
      "Emilse Ríos's programs and membership. Learn double bass at your own pace, with real guidance.",
    'products.heading': 'You can do it too',
    'products.lead':
      "Every double bass course was born from a story: a teacher who hated scales, a student who, after a year and a half, didn't know a single piece for double bass, a bassist with a goat vibrato. Come in and I'll tell you. Maybe it'll work for you too.",
    'products.close': "You don't need innate talent or a specific age. Just consistency.",
    'products.soon': 'Coming soon',
    'products.closed': 'Closed for now',
    'products.back': 'Back to Programs',
    'products.enrolled': 'Already have a program? The classroom is this way',
    'products.more': 'Read more',

    /* --- Las entradas del newsletter (9 oct 2026) ------------------------ */
    'nav.newsletter': 'Newsletter',
    'news.title': 'Double Bass in the City',
    'news.kicker': 'The newsletter',
    'news.eyebrow': 'Double Bass in the City — The newsletter',
    'news.lead':
      "Every week I send out emails where I break down the mistakes that are stalling your progress on the double bass. They're so obvious they sound silly, but they're so common you might be making them every single day — without knowing it.",
    'news.entries': 'Posts',
    'news.read': 'Read the post',
    'news.more': 'More posts',
    'news.ps1': 'P.S. Not on my newsletter yet? ',
    'news.ps1Link': 'Sign up here',
    'news.ps1End': '. It’s free to get in, and just as free to get out.',
    'news.ps2':
      'P.S. 2: When you sign up you get a welcome email with a video. It’s an exercise where I explain one concept that’s going to change the way you produce sound. The video runs 4:04 and you almost certainly know the exercise — there isn’t a bass player alive who hasn’t practiced it. But 90% do it wrong, HA! Hardly anyone knows where that movement actually comes from. You won’t be in that 90% though. Not you. Not after you watch the video. You’ll have to let me know.',

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
  /* Las entradas del newsletter, desde el 9 oct 2026. */
  newsletter: { es: '/newsletter', en: '/newsletter' },
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
