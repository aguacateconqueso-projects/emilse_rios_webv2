// @ts-check
import { readFile, writeFile } from 'node:fs/promises';
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

/**
 * Las redirecciones de `redirects`, con y sin barra final.
 *
 * El adaptador de Vercel convierte cada redirección en una ruta cuya expresión
 * acaba justo después del nombre —`^/aulavirtual/estudiemos-juntos$`— y el
 * destino lo escribe sin barra, porque así lo pide Astro. Resultado, hasta el
 * 23 sep 2026: `/aulavirtual/estudiemos-juntos` redirigía y
 * `/aulavirtual/estudiemos-juntos/` —con barra, que es como el sitio escribe
 * todas sus direcciones y como Emi las copia de la barra del navegador— daba
 * 404. Astro no deja pedir otra cosa desde `redirects`.
 *
 * Así que esto retoca la salida cuando el adaptador ya la escribió: a cada
 * redirección le acepta la barra final en el origen y se la pone al destino,
 * que es la dirección canónica de la página. Corre después del adaptador
 * porque Astro pone el adaptador el primero de la lista de integraciones.
 *
 * Solo toca rutas con `Location` y un `status` 3xx: el resto de
 * `config.json` —los ficheros, las funciones, el 404— queda como estaba.
 * `npm run audit:redirecciones` comprueba el resultado.
 *
 * @returns {import('astro').AstroIntegration}
 */
function redireccionesConBarra() {
  /** @type {URL | undefined} */
  let raiz;
  return {
    name: 'redirecciones-con-barra',
    hooks: {
      'astro:config:done': ({ config }) => {
        raiz = config.root;
      },
      'astro:build:done': async ({ logger }) => {
        if (!raiz) return;
        const fichero = new URL('.vercel/output/config.json', raiz);
        let salida;
        try {
          salida = JSON.parse(await readFile(fichero, 'utf8'));
        } catch {
          logger.warn('No hay .vercel/output/config.json: las redirecciones quedan sin barra final.');
          return;
        }
        let tocadas = 0;
        for (const ruta of salida.routes ?? []) {
          if (ruta.handle === 'filesystem') break;
          const destino = ruta.headers?.Location;
          if (!destino || !(ruta.status >= 300 && ruta.status < 400)) continue;
          if (typeof ruta.src === 'string' && ruta.src.endsWith('$') && !ruta.src.endsWith('/?$')) {
            ruta.src = `${ruta.src.slice(0, -1)}/?$`;
          }
          if (destino.startsWith('/') && !destino.endsWith('/') && !/\.[a-z0-9]+$/i.test(destino)) {
            ruta.headers.Location = `${destino}/`;
          }
          tocadas++;
        }
        await writeFile(fichero, JSON.stringify(salida, null, 2));
        logger.info(`${tocadas} redirecciones aceptan ahora la barra final.`);
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  /**
   * El dominio de verdad desde el 21 sep 2026. De acá salen el
   * `<link rel="canonical">`, las URLs absolutas y el futuro sitemap, así que
   * tiene que ser **el canónico**, con `www`: en Vercel el ápice
   * `emilserios.com` hace un 308 hacia `www.emilserios.com`, y apuntar los
   * canónicos a una dirección que redirige es pedirle a Google que adivine.
   */
  site: 'https://www.emilserios.com',

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
  integrations: [redireccionesConBarra()],

  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: {
      // El español vive en la raíz (/), el inglés en /en.
      prefixDefaultLocale: false,
    },
  },

  /**
   * Las direcciones viejas, que no se rompen: Emi las pegó en sus correos.
   *
   * Son diez y están escritas a mano. Hasta el 23 sep 2026 había además dos
   * patrones dinámicos —`/aulavirtual/[producto]` → `/productos/[producto]` y
   * su gemelo inglés— y **se quitaron porque hacían daño**: en Vercel se
   * convierten en «cualquier cosa bajo /aulavirtual/», así que se comían las
   * páginas reales del aula pedidas sin barra —`/aulavirtual/entrar` acababa
   * en `/productos/entrar`, un 404— y rompían la redirección del panel de aquí
   * abajo, cuyo destino es una de esas páginas. No cubrían nada que no
   * cubrieran ya estas líneas: la única carta que vivió en
   * `/aulavirtual/<slug>/` fue la de la membresía (del 31 ago al 9 sep 2026,
   * se ve en el historial de `src/data/aula.ts`), y los productos nuevos nacen
   * ya en Formaciones, sin dirección vieja que redirigir.
   *
   * Los dos patrones de `/productos/[producto]` y `/en/products/[producto]`
   * (24 sep 2026) sí son dinámicos, y a propósito: bajo esas carpetas ya no
   * vive ninguna página, así que llevarse «cualquier cosa» de ahí es justo lo
   * que se quiere —cada página de ventas, también las que Emi cree mañana desde
   * el panel—.
   *
   * Se resuelven **en Vercel**, antes de mirar ningún fichero. Van con y sin
   * barra final gracias a `redireccionesConBarra()`, más arriba: Astro no deja
   * pedirlo desde acá. El destino se escribe **sin barra**, aunque el resto
   * del sitio la lleve —con ella el build falla con
   * `InvalidRedirectDestination`—, y es esa misma integración la que se la
   * pone al publicar.
   */
  redirects: {
    /*
     * Formaciones vivió en `/productos/` —y en inglés en `/en/products/`— hasta
     * el 24 sep 2026, cuando Adrián pidió que «products» no saliera en los
     * enlaces. La portada y cada página de ventas: `/productos/estudiemos-juntos/`
     * está pegada en los correos de Emi. Ver `routes` en `src/i18n/ui.ts`.
     */
    '/productos': '/formaciones',
    '/productos/[producto]': '/formaciones/[producto]',
    '/en/products': '/en/courses',
    '/en/products/[producto]': '/en/courses/[producto]',

    /*
     * La carta de la membresía vivió en el aula del 31 ago al 9 sep 2026. Va
     * directo a su dirección de hoy, sin pasar por `/productos/`: una
     * redirección en cadena es un viaje más para quien hace clic y una pista
     * peor para Google.
     */
    '/aulavirtual/estudiemos-juntos': '/formaciones/estudiemos-juntos',
    '/en/classroom/estudiemos-juntos': '/en/courses/estudiemos-juntos',

    /*
     * El escritorio de la alumna se llamaba `/panel/` y dejó de llamarse así el
     * 20 sep 2026: en la academia `/panel/` es la CONSOLA DE EMI, y que las dos
     * pantallas compartieran nombre era una confusión esperando a pasar. La
     * palabra queda reservada para la consola.
     */
    '/aulavirtual/panel': '/aulavirtual/escritorio',
    '/en/classroom/panel': '/en/classroom/desk',

    /*
     * El aula no tiene portada desde el 23 sep 2026: se entra directo a la
     * pantalla de acceso. Lo pidió Adrián —«que pida directo usuario y
     * contraseña»—. Hasta ese día `/aulavirtual/` era una página que
     * presentaba el aula y tenía un botón que llevaba a esa misma pantalla.
     * Los enlaces del sitio ya van directo; esto es para los que están fuera,
     * en correos y marcadores. Y quien ya tiene la sesión abierta no se queda
     * ahí: la pantalla de acceso lo pasa al escritorio.
     */
    '/aulavirtual': '/aulavirtual/entrar',
    '/en/classroom': '/en/classroom/signin',
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
