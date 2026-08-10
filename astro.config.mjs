// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

/**
 * Rangos de caracteres de cada subconjunto. Son los mismos que publica Google
 * y coinciden en las cuatro familias.
 *
 * `latin` cubre el español y el inglés enteros. `latin-ext` solo se descarga
 * si aparece un carácter que lo necesite — nombres de alumnas de fuera del
 * ámbito latino, por ejemplo.
 */
const UNICODE = {
  latin: [
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,' +
      ' U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193,' +
      ' U+2212, U+2215, U+FEFF, U+FFFD',
  ],
  'latin-ext': [
    'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304,' +
      ' U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020,' +
      ' U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF',
  ],
};

/** Genera las dos variantes (latin y latin-ext) de un mismo corte. */
function cut(slug, weight, style) {
  return Object.entries(UNICODE).map(([subset, unicodeRange]) => ({
    src: [`./src/assets/fonts/${slug}-${String(weight).replace(/\s+/g, '-')}-${style}-${subset}.woff2`],
    weight: String(weight),
    style,
    unicodeRange,
  }));
}

// https://astro.build/config
export default defineConfig({
  site: 'https://contrabajoenlaciudad.com',

  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: {
      // El español vive en la raíz (/), el inglés en /en.
      prefixDefaultLocale: false,
    },
  },

  build: {
    // Una sola hoja de estilos, sin <style> repartidos por el HTML.
    inlineStylesheets: 'never',
  },

  /**
   * Las tres tipografías del sistema, servidas desde nuestro dominio.
   * La cuarta —Mrs Saint Delafield— existió mientras la firma era texto; hoy
   * la firma es el logo de Emi vectorizado, así que la familia se ha retirado.
   * Los ficheros viven en `src/assets/fonts` y están versionados: el build no
   * depende de la red y nadie le pide nada a Google desde el navegador.
   * Todas son SIL Open Font License — ver `src/assets/fonts/OFL.txt`.
   */
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Instrument Serif',
      cssVariable: '--font-display',
      fallbacks: ['Georgia', 'serif'],
      options: {
        variants: [
          ...cut('instrument-serif', 400, 'normal'),
          ...cut('instrument-serif', 400, 'italic'),
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Newsreader',
      cssVariable: '--font-body',
      fallbacks: ['Georgia', 'serif'],
      options: {
        variants: [
          // Variable: un solo fichero cubre de 400 a 500.
          ...cut('newsreader', '400 500', 'normal'),
          ...cut('newsreader', '400 500', 'italic'),
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-mono',
      fallbacks: ['ui-monospace', 'monospace'],
      options: {
        variants: [...cut('ibm-plex-mono', 400, 'normal'), ...cut('ibm-plex-mono', 500, 'normal')],
      },
    },
  ],
});
