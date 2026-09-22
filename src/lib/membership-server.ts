/**
 * El pase de invitación — la mitad de las puertas que **solo el servidor** ve.
 *
 * `membership.ts`, su hermano, lo puede importar cualquiera: son las dos fechas
 * de las puertas y el nombre del parámetro, y la carta los necesita para pintar
 * la cuenta atrás. Esto no. Acá vive `MEMBERSHIP_INVITE_CODE`, que es un
 * secreto: si un día alguien importara este fichero desde una pantalla, el
 * código viajaría en el HTML y el pase dejaría de valer para nada.
 *
 * Por eso están separados, y por eso esto se importa **únicamente desde rutas
 * con `export const prerender = false`**. Es la misma línea que separa
 * `supabase.ts` de `supabase-admin.ts`.
 *
 * Trasplantado de `emilse_rios_membresias` (`src/lib/membership.ts`) el 22 sep
 * 2026, con los mismos nombres de variable de entorno.
 *
 * ---
 *
 * **Qué es el pase.** El caso real: Emi cierra las puertas del mes, pero quiere
 * darle el cupo a alguien concreto —una alumna que escribió tarde, alguien a
 * quien se lo prometió—. No se le regala el acceso; eso ya existe y es otra
 * cosa. Acá **paga como todo el mundo**, con el mismo Checkout, el mismo precio
 * y el mismo correo de bienvenida. Lo único que se salta es el cierre.
 *
 * Se pone un código en `MEMBERSHIP_INVITE_CODE` y se le manda el enlace:
 *
 *     https://www.emilserios.com/api/checkout?lang=es&pase=EL-CODIGO
 *
 * ⚠️ **Es un secreto compartido, no un cupón de un solo uso.** Quien tenga el
 * enlace puede reenviarlo. De ahí las dos costumbres: un código largo y
 * aleatorio (`openssl rand -hex 12`, nunca «emi») y una caducidad corta en
 * `MEMBERSHIP_INVITE_UNTIL` —24 o 48 horas— para que muera solo aunque nadie se
 * acuerde de borrarlo.
 */

/** Vacío por defecto: sin código no hay pase válido, ni siquiera `?pase=`. */
export const INVITE_CODE = process.env.MEMBERSHIP_INVITE_CODE || '';

/** Caducidad del pase, ISO con zona. Vacío = vale mientras la variable exista. */
export const INVITE_UNTIL = process.env.MEMBERSHIP_INVITE_UNTIL || '';

/**
 * ¿Este pase abre la puerta AHORA?
 *
 * La comparación es de **largo constante**, y no es adorno: el enlace es
 * público y se puede llamar mil veces, así que comparar con `===` filtraría el
 * código carácter a carácter por el tiempo de respuesta. Hacerlo bien cuesta
 * cuatro líneas.
 *
 * Una fecha de caducidad inválida se trata como caducada: ante la duda, no se
 * abre.
 */
export function inviteValid(code: string | null | undefined, now: Date = new Date()): boolean {
  if (!INVITE_CODE || !code) return false;
  if (INVITE_UNTIL) {
    const until = Date.parse(INVITE_UNTIL);
    if (Number.isNaN(until) || now.getTime() > until) return false;
  }
  if (code.length !== INVITE_CODE.length) return false;
  let diff = 0;
  for (let i = 0; i < code.length; i++) diff |= code.charCodeAt(i) ^ INVITE_CODE.charCodeAt(i);
  return diff === 0;
}
