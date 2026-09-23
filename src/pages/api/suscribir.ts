import type { APIRoute } from 'astro';
import { hayProveedor, suscribir } from '../../lib/klaviyo';

/**
 * El alta al newsletter. Es a donde manda el campo «Acá te suscribes».
 *
 * Hecha el 22 sep 2026. Hasta ese día el formulario **no daba de alta a
 * nadie**: `PUBLIC_NEWSLETTER_ENDPOINT` estaba vacía y en producción se
 * limitaba a enseñar un error honesto con una dirección a la que escribir.
 *
 * Existe porque el navegador no puede hablar con Klaviyo directamente sin
 * regalarle la clave a cualquiera — ver `src/lib/klaviyo.ts`.
 *
 * ---
 *
 * **La respuesta es la misma pase lo que pase con el correo**, y eso es a
 * propósito: si contestara distinto cuando la dirección ya está suscrita,
 * cualquiera podría averiguar quién lee el newsletter de Emi probando correos.
 * Es la misma regla que ya sigue la pantalla de acceso del aula al pedir el
 * enlace de la contraseña.
 *
 * Lo que sí se distingue es **el fallo nuestro** —sin proveedor, Klaviyo caído,
 * Klaviyo rechazando— porque ahí no hay nada que filtrar y quien se está
 * suscribiendo merece saber que no ha quedado apuntado. El motivo de verdad va
 * a los logs de la función; a la pantalla va un no genérico.
 */
export const prerender = false;

/**
 * Un correo no llega a 254 caracteres —lo dice el RFC 5321— y este tope está
 * antes de la expresión regular a propósito: es lo que impide que alguien
 * mande un megabyte para hacer trabajar al servidor.
 */
const MAX_EMAIL = 254;

/**
 * Deliberadamente laxa: algo, arroba, algo, punto, algo, y sin espacios.
 *
 * Validar correos «bien» con una expresión regular es una trampa conocida —las
 * que lo intentan rechazan direcciones válidas de verdad— y acá además no hace
 * falta: quien decide si un correo existe es Klaviyo, y si la lista lleva doble
 * confirmación, el propio dueño del buzón. Esto solo para los errores de dedo.
 */
const PARECE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * La comprobación: abrir `/api/suscribir` en el navegador dice si **este
 * despliegue** tiene la clave. `{"proveedor":true}` o `false`, y nada más —
 * ni la clave, ni la lista, ni la cuenta—.
 *
 * Existe desde el 23 sep 2026. Hasta entonces la comprobación era buscar
 * `data-endpoint` en el código fuente de la página, y eso dejó de servir el
 * mismo día, cuando el formulario pasó a llamar siempre al servidor. Esto es
 * más directo: contesta la función que da el alta, no el HTML del build.
 *
 * No toca Klaviyo: que la clave exista no dice que tenga los tres permisos.
 * Eso lo dice el alta de prueba — ver `docs/CONECTAR-KLAVIYO.md`.
 */
export const GET: APIRoute = () => json({ proveedor: hayProveedor });

export const POST: APIRoute = async ({ request }) => {
  let cuerpo: any = {};
  try {
    cuerpo = await request.json();
  } catch {
    /* cuerpo vacío o inválido: cae en la comprobación de abajo */
  }

  const email = typeof cuerpo?.email === 'string' ? cuerpo.email.trim().toLowerCase() : '';
  if (!email || email.length > MAX_EMAIL || !PARECE_CORREO.test(email)) {
    return json({ error: 'email_invalido' }, 400);
  }

  const r = await suscribir(email);
  if (r.ok) return json({ ok: true });

  /* 503 y no 500 en los dos primeros: no es que la petición estuviera mal, es
     que esta casa no puede atenderla ahora mismo. El formulario los trata
     igual —enseña su aviso— pero el código correcto es el que hace que un
     monitor de disponibilidad sepa distinguirlos. */
  const status = r.motivo === 'sin-proveedor' || r.motivo === 'caido' ? 503 : 502;
  return json({ error: r.motivo }, status);
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
