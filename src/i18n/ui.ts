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
    'nav.aula': 'Aula Virtual',
    'nav.aulaSoon': 'Aula Virtual, próximamente',
    'nav.home': 'Ir al inicio',
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
    'cards.region': 'Correos anteriores',

    'media.play': 'Reproducir',
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
    'nav.aula': 'Virtual Classroom',
    'nav.aulaSoon': 'Virtual Classroom, coming soon',
    'nav.home': 'Go to the home page',
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
    'cards.region': 'Past emails',

    'media.play': 'Play',
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

/** Antepone el prefijo de idioma a una ruta interna. `/` en español, `/en/…` en inglés. */
export function localizePath(path: string, lang: Lang): string {
  const clean = `/${path.replace(/^\/+|\/+$/g, '')}`.replace(/\/+$/, '') || '/';
  if (lang === defaultLang) return clean;
  return clean === '/' ? '/en/' : `/en${clean}/`;
}

/** Saca el idioma de una URL. */
export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return (languages as readonly string[]).includes(first) ? (first as Lang) : defaultLang;
}
