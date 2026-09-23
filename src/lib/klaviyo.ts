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

/**
 * La clave privada. Vacía = no hay proveedor, y el sitio lo dice en vez de fingir.
 *
 * ⚠️ **Necesita tres permisos de escritura, no dos:** `lists`, `profiles` y
 * `subscriptions`. Sin el tercero Klaviyo contesta `403` y nadie queda
 * apuntado. Hasta el 22 sep 2026 la guía pedía solo los dos primeros.
 */
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

/**
 * La versión fechada de la API. Ver el aviso de arriba.
 *
 * Klaviyo sostiene cada fecha **dos años** y después la retira. Hasta el
 * 22 sep 2026 esto decía `2024-10-15`, que se retira el **15 oct 2026**:
 * el alta habría seguido contestando, pero con el comportamiento de otra
 * versión que nadie eligió. `2026-07-15` es la estable de ese día, y la forma
 * del cuerpo de abajo está comprobada contra ella — contra el SDK oficial de
 * Klaviyo, `klaviyo-api` 23.0.0. **Dura hasta julio de 2028.**
 */
const REVISION = process.env.KLAVIYO_REVISION || '2026-07-15';

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
 * ⚠️ **También le quita la baja a quien se había dado de baja.** Lo dice la
 * documentación de Klaviyo: este trabajo levanta las supresiones
 * `UNSUBSCRIBE`, `SPAM_REPORT` y `USER_SUPPRESSED`. Con confirmación simple,
 * cualquiera puede volver a apuntar a otra persona tecleando su correo, y esa
 * persona recibe campañas desde ese momento; con doble, lo que recibe es un
 * correo de confirmación y no queda suscrita hasta pulsarlo. Es la razón para
 * que la lista lleve doble confirmación.
 *
 * Responde `202 Accepted` sin cuerpo cuando lo acepta: el alta se procesa
 * detrás. Por eso no se puede saber desde acá si el correo existía ya, y por
 * eso tampoco hace falta — la respuesta al navegador es la misma en los dos
 * casos, que es lo correcto para no delatar quién está suscrito.
 */
export async function suscribir(email: string): Promise<Resultado> {
  if (!API_KEY) {
    /* Va a los logs para que este fallo no sea mudo: hasta el 23 sep 2026 el
       formulario ni llamaba sin clave, y en Vercel no quedaba rastro. Vercel
       no aplica una variable nueva a un despliegue que ya existe: hay que
       redesplegar, y en el entorno —Production o Preview— que se esté mirando. */
    console.error(
      '[klaviyo] falta KLAVIYO_API_KEY en este despliegue: nadie queda apuntado.',
      { entorno: process.env.VERCEL_ENV || 'local' },
    );
    return { ok: false, motivo: 'sin-proveedor' };
  }

  const cuerpo = {
    data: {
      type: 'profile-subscription-bulk-create-job',
      attributes: {
        /* Queda escrito en el registro de consentimiento de cada perfil. Es
           lo que deja a Emi distinguir en Klaviyo a quien se apuntó desde el
           sitio de quien lo hizo por la página alojada de la lista. */
        custom_source: 'emilserios.com',
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
