# Unir las dos casas

Qué hay que hacer **fuera del código** para que la mudanza de
`emilseriosacademy.com` a `emilserios.com` funcione, y qué hay que pegar en el
repositorio de la academia (`aguacateconqueso-projects/emilse_rios_membresias`).

Escrito el **22 de septiembre de 2026**, con el PR que trajo el checkout a esta
casa. El porqué de cada decisión está en `progreso.md` → **La unión de las dos
casas**; esto es la lista de tareas.

---

## Lo que ya no hace falta

**Nada en el panel de Stripe.** El webhook sigue viviendo en la academia y sigue
apuntado a su dirección de siempre. No se toca su endpoint, ni su `whsec_`, ni
las URLs de retorno del portal de cliente.

Esto no es pereza: un webhook **no tiene dominio**. Stripe llama a la dirección
que tenga apuntada, y esa dirección escribe en el **mismo proyecto de Supabase**
que esta casa, con un `UPSERT` por `stripe_subscription_id`. Que el checkout
viva acá y el webhook allá no desincroniza nada — y además deja intacto el
correo de bienvenida, que sale por Resend con el dominio de la academia
verificado. `emilserios.com` todavía no puede mandar correo: su DKIM sigue roto
(ver `progreso.md` → **El dominio, y Edu**).

⚠️ **El día que el webhook se mude**, hay que hacer las tres cosas a la vez:
endpoint nuevo en Stripe, `STRIPE_WEBHOOK_SECRET` nuevo en Vercel y
`emilserios.com` verificado en Resend. Y no antes de arreglar el DKIM.

---

## 1 · Vercel, en el proyecto de `emilserios.com`

Las variables nuevas. Las cuatro de Stripe son **exactamente los mismos
valores** que ya están en el proyecto de la academia — se copian, no se crean:

| Variable | De dónde sale | Por qué |
|---|---|---|
| `STRIPE_SECRET_KEY` | copiar de la academia | crea la sesión de Checkout |
| `STRIPE_PRICE_STANDARD` | copiar de la academia | el precio de hoy (65 €/mes) |
| `STRIPE_PRICE_FOUNDER` | copiar de la academia | el de fundador; su ventana está cerrada, pero `currentTier()` lo mira |
| `STRIPE_FOUNDER_UNTIL` | copiar si está puesta | la fecha de corte entre los dos |
| `PUBLIC_SITE_URL` | `https://www.emilserios.com` | las URLs de vuelta de Stripe |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API | crear la cuenta al pagar |

⚠️ **`PUBLIC_SITE_URL` siempre con `www`.** En Vercel el ápice pelado contesta
308 hacia `www`, y hay terceros que no siguen redirecciones — en la academia eso
ya causó un incidente con el webhook.

⚠️ **Las dos claves de Stripe tienen que ser del mismo modo.** Una
`sk_live_…` con un `price_…` de test da un 500 con el motivo escrito en
pantalla; está puesto a propósito para poder diagnosticarlo desde el navegador.

Y las dos de las puertas, que ahora viven **en dos casas**:

    MEMBERSHIP_CLOSES_AT
    MEMBERSHIP_REOPENS_AT

⚠️ **Se cambian cada mes y hay que cambiarlas en los DOS proyectos de Vercel.**
Si acá dicen «abierto» y allá «cerrado», la carta invita a entrar por una puerta
que el checkout tiene cerrada. Mientras el webhook siga en la academia, este
desdoble existe.

---

## 2 · Supabase → Authentication → URL Configuration

**Añadir** a *Redirect URLs* —añadir, no sustituir: es aditivo y la academia
sigue funcionando igual—:

    https://www.emilserios.com/aulavirtual/nueva-clave/
    https://www.emilserios.com/en/classroom/new-password/
    https://www.emilserios.com/aulavirtual/pasar/
    https://www.emilserios.com/en/classroom/handoff/

Las dos primeras ya estaban desde la capa A. **Las dos últimas son nuevas**: son
el puente de traspaso, y sin ellas el enlace que trae la sesión desde la
academia no lleva a ninguna parte.

Conviene añadir también las de la URL de Vercel (`*.vercel.app`) para poder
probar antes de publicar.

---

## 3 · El puente, en el repositorio de la academia

Una página nueva en `emilse_rios_membresias`, en `src/pages/pasar/index.astro`.
Lee la sesión que esa casa ya tiene y se la pasa a esta en el `#hash`.

⚠️ **Lo tiene que pulsar la alumna.** En un `<iframe>` no funciona: el
particionado de almacenamiento de los navegadores impide leer el
`localStorage` del otro dominio. Por eso es un botón y no una redirección
automática.

```astro
---
// /pasar/ — le pasa la sesión de esta casa a emilserios.com.
//
// El token vive en localStorage y localStorage es POR ORIGEN, así que
// emilserios.com no puede leer el de acá. Esto es lo que hace que volver a
// entrar cueste un clic y no una contraseña olvidada.
//
// Los tokens viajan en el #hash — que es lo que permite `flowType: 'implicit'`,
// el que usan las dos casas — así que no tocan ningún servidor ni quedan en
// ningún log. Al otro lado, /aulavirtual/pasar/ los planta con setSession() y
// borra el hash con history.replaceState.
export const prerender = true;
const DESTINO = 'https://www.emilserios.com/aulavirtual/pasar/';
---

<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Pasar al sitio nuevo</title>
    <link rel="stylesheet" href="/colors_and_type.css" />
  </head>
  <body>
    <main>
      <h1>El aula se mudó</h1>
      <p>
        Ahora vive en <strong>emilserios.com</strong>. Pulsa el botón y entras
        sin escribir tu contraseña — llevamos tu sesión con nosotros.
      </p>

      <button id="pasar" type="button" hidden>Llévame al aula nueva</button>

      <p id="sinSesion" hidden>
        No hay ninguna sesión abierta en esta pestaña.
        <a href={DESTINO.replace('/pasar/', '/entrar/')}>Entra en el sitio nuevo</a>
        con tu correo y tu contraseña de siempre.
      </p>
    </main>

    <script define:vars={{ DESTINO }}>
      import { supabase } from '../../lib/supabase';

      const boton = document.getElementById('pasar');
      const sinSesion = document.getElementById('sinSesion');

      const { data } = await supabase.auth.getSession();
      const s = data.session;

      if (!s?.access_token || !s?.refresh_token) {
        sinSesion.hidden = false;
      } else {
        boton.hidden = false;
        boton.addEventListener('click', () => {
          // `expires_in` y `token_type` van a propósito, aunque el otro lado
          // solo necesite los dos tokens: con ellos, el `detectSessionInUrl`
          // del cliente de allá también puede consumir el hash él solo y sin
          // quejarse. Los dos caminos acaban igual, pero así ninguno registra
          // un error por el camino.
          const hash = new URLSearchParams({
            access_token: s.access_token,
            refresh_token: s.refresh_token,
            expires_in: String(s.expires_in ?? 3600),
            token_type: s.token_type ?? 'bearer',
          });
          location.href = DESTINO + '#' + hash.toString();
        });
      }
    </script>
  </body>
</html>
```

> El `define:vars` de arriba vuelve el script inline, y un script inline **no
> puede importar módulos**. En la academia hay que resolverlo como se resuelve
> allí —su `Aula.astro` ya importa `supabase` en un `<script>` normal—: sacar
> `DESTINO` a un `data-` del botón y quitar el `define:vars`. Se deja escrito
> así acá porque lo que importa es el mecanismo, no el acarreo de la constante.

Su gemela inglesa, `src/pages/pasar/en/index.astro`, apunta a
`https://www.emilserios.com/en/classroom/handoff/`.

---

## 4 · El correo de aviso

**Antes del cambio, no después.** Convierte un susto en un trámite. Lo manda Emi
por Klaviyo, a la lista de miembros, y dice tres cosas:

1. el aula se mudó a `emilserios.com`;
2. hay que volver a entrar **una vez** — con el mismo correo y la misma
   contraseña de siempre, nada se ha perdido;
3. el enlace a `emilseriosacademy.com/pasar/`, que se lo ahorra.

---

## 5 · Probarlo, en este orden

1. **Con las puertas cerradas** (hoy lo están hasta el 1 de octubre):
   `https://www.emilserios.com/api/checkout?lang=es` tiene que dar **403** con
   la pantalla de «Las puertas están cerradas» y la fecha de reapertura.
2. **Con un pase**, si hay `MEMBERSHIP_INVITE_CODE` puesto: la misma dirección
   con `&pase=EL-CODIGO` tiene que llegar a Stripe.
3. **Una compra de verdad en modo test**, con las claves `sk_test_…`: pagar,
   aterrizar en `/gracias/?session_id=…`, poner la contraseña y **entrar al
   escritorio sin pasar por ningún correo**.
4. **Comprobar en Supabase** que esa compra escribió su fila en
   `subscriptions` — y que el webhook de la academia, cuando llegue, la deja
   igual. Esa es la prueba de que los dos caminos son idempotentes.
5. **El puente**: entrar en la academia, ir a `/pasar/`, pulsar el botón y
   aparecer dentro del escritorio de `emilserios.com` sin escribir nada. Y
   mirar la barra de direcciones: **el hash no puede seguir ahí**.

---

## Lo que sigue pendiente después de esto

- **El webhook**, cuando el DKIM de `emilserios.com` esté arreglado y
  `emilserios.com` verificado en Resend.
- **El aula de la membresía** — los videos semanales — sigue en la academia. El
  botón «Membresía» del escritorio todavía sale del sitio, y lo dice.
- **Las URLs de retorno del portal de cliente de Stripe**, que siguen apuntando
  al dominio viejo. Se cambian en el panel de Stripe cuando la membresía entera
  viva acá, no antes.
- **`trialing`**, que sigue significando cosas distintas en el código y en la
  base de datos. Ver `progreso.md`.
