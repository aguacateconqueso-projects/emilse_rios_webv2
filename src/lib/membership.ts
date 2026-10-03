/**
 * Puertas de la membresía — la ventana en la que SE PUEDE ENTRAR.
 *
 * Trasplantado de `emilse_rios_membresias` (`src/lib/membership.ts`) junto con
 * la carta de ventas, siguiendo la Ruta A de `docs/PORTAR-CARTA-DE-VENTAS.md`.
 * Se trajo **con los mismos nombres de variable de entorno** que en la academia,
 * a propósito: el día de la mudanza las dos casas leen el mismo dato y no hay
 * que traducir nada.
 *
 * Emi cierra las puertas los meses en que el tema es progresivo —cada semana se
 * apoya en la anterior, y así lo dice el copy del mes dentro de la carta—:
 * pasada la fecha, nadie entra hasta la reapertura.
 *
 * ⚠️ **Acá esto solo pinta la carta.** Quien corta el cobro de verdad es
 * `/api/checkout` de la academia, que comprueba estas mismas fechas en su
 * servidor. Por eso las dos casas tienen que decir lo mismo: si en la academia
 * las puertas están cerradas y acá la carta dijera que están abiertas, la
 * lectora llegaría al checkout y se comería un 403.
 *
 * Las fechas van en ISO **con zona horaria explícita** (`+02:00` = horario de
 * verano de Madrid, CEST; `+01:00` en invierno, CET). Sin zona, el build las
 * leería en UTC y el cierre caería una o dos horas antes de lo prometido.
 *
 * ⚠️ SE CAMBIAN CADA MES, junto con el bloque del mes de la carta, y **en los
 * dos proyectos de Vercel**:
 *   MEMBERSHIP_CLOSES_AT   cuándo se cierran las puertas de este ciclo.
 *   MEMBERSHIP_REOPENS_AT  cuándo vuelven a abrirse (vacío = siguen cerradas).
 */

/**
 * Cierre del ciclo en curso. Por defecto, el que promete el copy de septiembre
 * de 2026: miércoles 2 a las 23:59 CEST.
 */
export const CLOSES_AT = process.env.MEMBERSHIP_CLOSES_AT || '2026-09-02T23:59:59+02:00';

/**
 * Reapertura. Por defecto el 1 de octubre de 2026, que es lo que promete la FAQ
 * («durante septiembre no entra nadie»). Si se deja VACÍO, las puertas se
 * quedan cerradas indefinidamente hasta que alguien ponga una fecha.
 */
export const REOPENS_AT = process.env.MEMBERSHIP_REOPENS_AT ?? '2026-10-01T00:00:00+02:00';

/**
 * Alta al newsletter: el campo del final de cada carta (`#suscribete-carta`,
 * en `CartaVenta.astro`). Es la salida de la carta para quien llega tarde y el
 * botón de los cursos que todavía no se venden.
 *
 * **Hasta el 1 oct 2026 era la página alojada de Klaviyo**
 * (`manage.kmail-lists.com/…&g=SaE8Px`), que da de alta siempre en la misma
 * lista, sin idioma, y a todos les llegaba la bienvenida en inglés. El campo
 * de la carta manda el idioma de la página, y el alta va a la lista de ese
 * idioma (ver `src/lib/klaviyo.ts`).
 */
export const NEWSLETTER_ANCLA = '#suscribete-carta';

/**
 * Nombre del parámetro del pase de invitación en la URL.
 *
 * El pase deja entrar a UNA persona con las puertas cerradas. Acá **no se
 * comprueba** —quien decide es `/api/checkout` de la academia, que es donde
 * vive el secreto—: la carta se limita a encender los botones y a arrastrar el
 * `?pase=…` hasta el checkout. Un pase inventado, por tanto, solo consigue ver
 * los botones vivos y chocar con el 403 del otro lado.
 *
 * En español porque el enlace lo ve la persona invitada, no un programa.
 */
export const INVITE_PARAM = 'pase';

/**
 * ¿Están cerradas AHORA? Sin fecha de cierre válida → abierto (estado por
 * defecto: una membresía sin configurar no debe dejar de vender).
 */
export function doorsClosed(now: Date = new Date()): boolean {
  const closes = Date.parse(CLOSES_AT);
  if (Number.isNaN(closes)) return false;
  if (now.getTime() <= closes) return false;
  const reopens = Date.parse(REOPENS_AT);
  if (!Number.isNaN(reopens) && now.getTime() >= reopens) return false;
  return true;
}
