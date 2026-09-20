// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import vercel from '@astrojs/vercel';

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

  /**
   * El sitio sigue siendo **estático**: cada página se genera en el build, igual
   * que antes. Lo que añade el adaptador es la posibilidad de que una página o
   * una ruta diga `export const prerender = false` y pase a resolverse en el
   * servidor — y eso es lo que hace falta para el panel de Emi, el webhook de
   * Stripe y todo lo que venga después. Hasta que alguna lo pida, el resultado
   * del build es el mismo de siempre.
   *
   * Es el mismo patrón que ya usa el repo de la membresía, a propósito: cuanto
   * menos se diferencien los dos mientras dure la mudanza, menos sorpresas.
   *
   * Efecto secundario bienvenido: las redirecciones de aquí abajo dejan de ser
   * páginas con `<meta refresh>` y pasan a ser redirecciones de verdad, que es
   * justo lo que su comentario pedía.
   */
  output: 'static',
  adapter: vercel(),

  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: {
      // El español vive en la raíz (/), el inglés en /en.
      prefixDefaultLocale: false,
    },
  },

  /**
   * Las cartas de venta vivían bajo el aula —`/aulavirtual/<slug>/`— hasta que
   * el aula pasó a pedir sesión y la tienda se mudó a `/productos/`. Esas
   * direcciones ya están publicadas y Emi las pega en sus correos, así que no
   * se rompen: Astro genera una página de redirección por cada producto con
   * carta, tomando los caminos del propio catálogo.
   *
   * Desde que el proyecto lleva el adaptador de Vercel, estas redirecciones se
   * resuelven **en el servidor**, que es lo que aquí se pedía cuando eran
   * páginas con `<meta refresh>`.
   *
   * El destino va **sin barra final**, aunque el resto del sitio la lleve:
   * Astro valida el destino contra sus rutas y con la barra falla el build con
   * `InvalidRedirectDestination`. No es un descuido, no hace falta arreglarlo.
   */
  redirects: {
    '/aulavirtual/[producto]': '/productos/[producto]',
    '/en/classroom/[producto]': '/en/products/[producto]',

    /*
     * La membresía va aparte, y escrita a mano, porque su carta no la genera la
     * ruta dinámica: se trasplantó entera desde la academia y tiene página
     * propia —ver `src/pages/productos/estudiemos-juntos.astro`—. Los dos
     * patrones de arriba sacan sus direcciones de los productos que SÍ genera
     * `[producto].astro`, así que sin estas dos líneas la carta perdería sus
     * direcciones viejas, que son las que Emi ya pegó en sus correos.
     */
    '/aulavirtual/estudiemos-juntos': '/productos/estudiemos-juntos',
    '/en/classroom/estudiemos-juntos': '/en/products/estudiemos-juntos',

    /*
     * El escritorio de la alumna se llamaba `/panel/` y dejó de llamarse así el
     * 20 sep 2026: en la academia `/panel/` es la CONSOLA DE EMI, y que las dos
     * pantallas compartieran nombre era una confusión esperando a pasar. La
     * palabra queda reservada para la consola.
     *
     * Estas dos líneas no son opcionales aunque las direcciones viejas fueran
     * de una maqueta con `noindex`: sin ellas, `/aulavirtual/panel` cae en el
     * patrón `[producto]` de aquí arriba y acaba en `/productos/panel`, que no
     * existe. Una ruta estática gana a una dinámica, así que puestas acá
     * mandan ellas.
     */
    '/aulavirtual/panel': '/aulavirtual/escritorio',
    '/en/classroom/panel': '/en/classroom/desk',
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
