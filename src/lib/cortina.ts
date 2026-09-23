/**
 * La cortina: el sitio entero tapado por la firma de Emi y una línea que dice
 * que estamos trabajando en la web.
 *
 * Se bajó el 23 sep 2026. Emi está cambiando los copies y la bienvenida del
 * newsletter —ahora quiere siete correos por suscriptora—, el alta todavía no
 * funciona, y era mejor enseñar una pantalla honesta que una web a medias en
 * la que se puede pulsar «suscribirme» y no pasa nada.
 *
 * **Solo baja en producción** —`VERCEL_ENV === 'production'`, es decir, en
 * `www.emilserios.com`—. Las vistas previas de cada PR y `npm run dev` siguen
 * enseñando la web de verdad, que es donde se sigue trabajando.
 *
 * Quien la aplica es `src/middleware.ts`; la pantalla es `src/pages/cortina.astro`
 * y sus textos, `src/data/cortina.ts`.
 *
 * **Para subirla** —reabrir la web— se pone `false` acá, en un PR, y se mergea.
 */
export const CORTINA_BAJADA = true;

/** La página que se enseña en lugar de todas las demás. */
export const RUTA_CORTINA = '/cortina';

/**
 * Si la cortina tapa este build o esta petición.
 *
 * La variable `CORTINA` manda sobre todo lo demás, en las dos direcciones:
 *
 * - `CORTINA=1 npm run dev` la baja en local, para verla sin desplegar.
 * - `CORTINA=0` en las variables de Vercel la sube sin tocar el código —hay
 *   que redesplegar igual—. Es la salida de emergencia, no la manera normal.
 */
export function cortinaBajada(): boolean {
  const forzada = process.env.CORTINA?.trim();
  if (forzada === '1') return true;
  if (forzada === '0') return false;
  return CORTINA_BAJADA && process.env.VERCEL_ENV === 'production';
}
