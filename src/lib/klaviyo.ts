/**
 * Klaviyo — el alta al newsletter. **Solo servidor.**
 *
 * Nunca se importa desde una pantalla: `KLAVIYO_API_KEY` es una clave privada
 * que puede leer y escribir la lista entera de Emi. Es la misma línea que
 * separa `supabase.ts` de `supabase-admin.ts` y `membership.ts` de
 * `membership-server.ts`.
 *
 * ---
 *
 * **Por qué hace falta un servidor para esto.** El formulario podría hablar con
 * Klaviyo directamente desde el navegador —tienen un endpoint de cliente para
 * eso— pero entonces cualquiera puede darle de alta a cualquiera con un bucle
 * de dos líneas. Con la llamada acá, el correo pasa por una puerta que podemos
 * cerrar el día que haga falta, y la clave no sale nunca del servidor.
 *
 * Es además lo que `progreso.md` ya había decidido: «hace falta una función
 * serverless en Vercel que reciba el correo y hable con la API de Klaviyo con
 * la clave del lado del servidor».
 *
 * ---
 *
 * ⚠️ **La versión de la API va fechada y es obligatoria.** Klaviyo versiona por
 * fecha en la cabecera `revision`, y sin ella —o con una que retiraron— la
 * llamada falla aunque todo lo demás esté bien. Si algún día empieza a fallar
 * de golpe sin haber tocado nada, esto es lo primero que hay que mirar: se sube
 * la fecha en `KLAVIYO_REVISION` y ya.
 */

/** La clave privada. Vacía = no hay proveedor, y el sitio lo dice en vez de fingir. */
const API_KEY = process.env.KLAVIYO_API_KEY || '';

/**
 * La lista a la que entra quien se suscribe.
 *
 * Por defecto, **la lista real del newsletter de Emi**: es la misma `SaE8Px`
 * que lleva la página alojada de Klaviyo a la que ya mandan la carta de ventas
 * y el pie de la membresía (ver `NEWSLETTER` en `src/data/aula.ts`). No es un
 * secreto — viaja en esa URL pública— y ponerla por defecto evita el fallo más
 * caro de todos: dar de alta a gente en una lista equivocada durante semanas
 * sin que nadie lo note.
 */
const LIST_ID = process.env.KLAVIYO_LIST_ID || 'SaE8Px';

/** La versión fechada de la API. Ver el aviso de arriba. */
const REVISION = process.env.KLAVIYO_REVISION || '2024-10-15';

const ENDPOINT = 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/';

/** Si es `false` no hay proveedor: el formulario avisa en vez de mentir. */
export const hayProveedor = Boolean(API_KEY);

export type Resultado =
  | { ok: true }
  | { ok: false; motivo: 'sin-proveedor' | 'rechazado' | 'caido'; detalle?: string };

/**
 * Da de alta un correo en la lista del newsletter.
 *
 * Usa el trabajo de **suscripción**, no el de crear perfiles, y la diferencia
 * importa: crear un perfil mete a alguien en la base de datos pero **no le
 * suscribe a nada**, así que nunca recibiría un correo. Éste marca el
 * consentimiento de marketing, que es lo que le da el alta de verdad — y, si la
 * lista tiene doble confirmación activada en el panel de Klaviyo, es también lo
 * que dispara ese correo de confirmación.
 *
 * Responde `202 Accepted` sin cuerpo cuando lo acepta: el alta se procesa
 * detrás. Por eso no se puede saber desde acá si el correo existía ya, y por
 * eso tampoco hace falta — la respuesta al navegador es la misma en los dos
 * casos, que es lo correcto para no delatar quién está suscrito.
 */
export async function suscribir(email: string): Promise<Resultado> {
  if (!API_KEY) return { ok: false, motivo: 'sin-proveedor' };

  const cuerpo = {
    data: {
      type: 'profile-subscription-bulk-create-job',
      attributes: {
        profiles: {
          data: [
            {
              type: 'profile',
              attributes: {
                email,
                subscriptions: { email: { marketing: { consent: 'SUBSCRIBED' } } },
              },
            },
          ],
        },
      },
      relationships: { list: { data: { type: 'list', id: LIST_ID } } },
    },
  };

  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Klaviyo-API-Key ${API_KEY}`,
        revision: REVISION,
        accept: 'application/vnd.api+json',
        'content-type': 'application/vnd.api+json',
      },
      body: JSON.stringify(cuerpo),
    });
  } catch (e: any) {
    /* Klaviyo no contestó: red, DNS, su caída. No es culpa de quien se
       suscribe, así que se registra y se le pide que lo intente luego. */
    console.error('[klaviyo] no se pudo llamar a la API', e?.message || e);
    return { ok: false, motivo: 'caido', detalle: e?.message };
  }

  if (res.ok) return { ok: true };

  /* Klaviyo contestó que no. **El cuerpo del error va a los logs entero y a
     propósito**: es donde se lee si la `revision` caducó, si el `LIST_ID` no
     existe o si la clave no tiene permiso, y sin él estos fallos son mudos.
     No se le devuelve al navegador — puede nombrar la lista y la cuenta. */
  const detalle = await res.text().catch(() => '');
  console.error('[klaviyo] la API rechazó el alta', {
    status: res.status,
    revision: REVISION,
    list: LIST_ID,
    cuerpo: detalle.slice(0, 2000),
  });
  return { ok: false, motivo: 'rechazado', detalle: `HTTP ${res.status}` };
}
