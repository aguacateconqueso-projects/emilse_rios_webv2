# Conectar Klaviyo

Lo que hay que hacer **fuera del código** para que «Acá te suscribes» dé de alta
de verdad. Son dos pasos en Klaviyo y uno en Vercel, más una comprobación.

Escrito el **22 de septiembre de 2026**, con el PR que montó `/api/suscribir`,
y corregido el mismo día: pedía dos permisos donde hacen falta tres, y usaba una
versión de la API que Klaviyo retira el 15 de octubre. Retocado el **23 sep
2026**, cuando la clave ya estaba puesta y la vista previa seguía diciendo que
no —casi seguro, por ser un build de antes de la clave—. El porqué de cada decisión está en
`progreso.md` → **El newsletter, conectado**.

---

## Antes de empezar: lo que ya sabemos

La lista del newsletter **ya existe y ya funciona**. Es la que lleva la página
alojada de Klaviyo a la que mandan hoy la carta de ventas y el pie de la
membresía:

    https://manage.kmail-lists.com/subscriptions/subscribe?a=TPxGBg&g=SaE8Px
                                                             ↑            ↑
                                              company ID de Emi      la lista

Así que **el ID de la lista es `SaE8Px`** y ya está puesto por defecto en el
código. No hay que ir a buscarlo, y no hay que ponerlo en Vercel salvo que Emi
quiera otra lista.

Los dos identificadores son públicos —viajan en esa URL que Emi comparte— así
que no son secretos. **La clave privada del paso 1 sí lo es.**

---

## La alerta de WooCommerce: se apaga, no se arregla

A Emi le llegó un aviso de Klaviyo: **«Klaviyo ya no puede conectarse a
WooCommerce»**. Es lo esperado y no tiene arreglo, porque no hay nada a lo que
conectarse: WooCommerce vivía en el WordPress de Edu, y el 21 sep 2026
`www.emilserios.com` pasó a apuntar a Vercel. **Los cobros viven en Stripe**, y nada de este
documento depende de WooCommerce — el alta al newsletter va por la API, con la
clave del paso 1.

Lo que hay que hacer, en este orden:

1. **Mirar los flujos antes de tocar nada.** En **Flows**, ver si alguno
   **activo** arranca con un evento de WooCommerce —*Placed Order*, *Started
   Checkout*, *Ordered Product*—. Esos ya no se van a disparar nunca: se ponen
   en borrador. El de bienvenida del newsletter tiene que arrancar con
   **«Added to list» → la lista `SaE8Px`**; si arranca con otra cosa, es lo
   primero que hay que arreglar.
2. **Integrations → WooCommerce → Disable.** *Disable*, no *Remove*: las dos
   dejan de intentarlo y ninguna borra nada —Klaviyo no borra los datos de
   pedidos ya sincronizados—, pero *Disable* guarda la configuración por si
   hiciera falta mirarla.

Con eso deja de llegar la alerta. **El sustituto natural de WooCommerce dentro
de Klaviyo es su integración oficial con Stripe** —trae a Klaviyo los pagos, las
facturas y los cobros fallidos para disparar flujos—, pero es una decisión
aparte y nada de lo de abajo la necesita.

---

## 1 · Klaviyo → la clave privada

1. Entrar en Klaviyo con la cuenta de Emi.
2. Arriba a la derecha, el nombre de la cuenta → **Settings** → **API keys**.
3. **Create Private API Key**.
4. Nombre: algo que diga de dónde viene, por ejemplo `emilserios.com — alta web`.
   El día que haya que revocarla, el nombre es lo único que dice cuál es.
5. **Permisos: los mínimos, que son tres.** Elegir **Custom Key** —nunca
   *Full Access Key*— y dar acceso completo (escritura) **solo** a estos; todo
   lo demás se queda en *No Access*:

   | Permiso | Por qué |
   |---|---|
   | **Lists** | mete el correo en la lista `SaE8Px` |
   | **Profiles** | crea la ficha de quien se suscribe |
   | **Subscriptions** | marca el consentimiento, que es lo que da el alta |

   ⚠️ **Sin *Subscriptions*, Klaviyo contesta `403` y no se apunta nadie.** Esta
   guía pedía solo los dos primeros hasta el 22 sep 2026; si la clave se creó
   con esa versión, hay que editarla y añadir el tercero.
6. Copiarla. Empieza por `pk_`. **Klaviyo la enseña una sola vez.**

⚠️ **No pegarla en el repositorio, ni en un mensaje, ni en este fichero.** El
repositorio es público. Va solo a Vercel, en el paso 3.

---

## 2 · Klaviyo → decidir si hay doble confirmación

En **Audience** → **Lists & Segments** → la lista del newsletter →
**Settings** → *List opt-in process*:

- **Single opt-in:** quien escribe su correo queda suscrito al instante.
- **Double opt-in:** Klaviyo le manda un correo de confirmación y no queda
  suscrito hasta que pulsa el enlace.

**Lo decide Emi, no el código** — `/api/suscribir` respeta lo que diga la lista.
**La recomendación es doble confirmación**, y por una razón concreta: el alta
por API **le quita la baja a quien se había dado de baja** —Klaviyo lo
documenta así—. Con confirmación simple, cualquiera puede volver a apuntar a
otra persona tecleando su correo, y esa persona empieza a recibir campañas; con
doble, lo que le llega es un correo para confirmar, y si no lo pulsa no pasa
nada.

Dos cosas más a tener en cuenta antes de elegir:

- Con doble confirmación, la pantalla del sitio dice «Listo. Revisa tu bandeja
  de entrada», que **es exactamente lo que hay que hacer**. El copy ya sirve
  para los dos casos.
- El correo de bienvenida con el video que promete la Home lo manda **Klaviyo**,
  con su flujo de bienvenida, no este sitio. Si ese flujo está atado a la lista,
  seguirá funcionando igual: entra por la misma puerta que la página alojada.

---

## 3 · Vercel → la variable

En el proyecto de `emilserios.com`: **Settings** → **Environment Variables**.

| Variable | Valor | ¿Obligatoria? |
|---|---|---|
| `KLAVIYO_API_KEY` | la `pk_…` del paso 1 | **sí** — sin ella no se da de alta nadie |
| `KLAVIYO_LIST_ID` | otro ID de lista | no · por defecto `SaE8Px` |
| `KLAVIYO_REVISION` | otra fecha de la API | no · por defecto `2026-07-15` |

**Solo se pone la primera.** Las otras dos no se crean: sus valores buenos ya
están en el código —`SaE8Px` es la lista real del newsletter, `2026-07-15` la
versión de la API— y existen solo para cambiarlos sin tocar código. Escribirlas
en Vercel con esos mismos valores no rompe nada, pero es peor: la variable manda
sobre el código, así que el día que se suba la versión en el código, Vercel
seguiría clavando la vieja sin que nadie lo note.

Marcarla para **Production y Preview**. Con la cortina bajada, **las vistas
previas son el único sitio donde se puede probar**: en producción
`/api/suscribir` contesta 503 pase lo que pase.

**Y redesplegar, y es el paso que más se olvida.** Vercel no aplica una
variable nueva a un despliegue que ya existe: la lee al construir. Una vista
previa —las `…-git-claude-…vercel.app`— es siempre el **último build de su
rama**, así que si ese build es de antes de poner la clave, **sigue sin clave
aunque la variable ya esté en Vercel**. Se arregla de cualquiera de estas dos
maneras:

- **Vercel → Deployments** → ese despliegue → **⋯ → Redeploy**; o
- un push nuevo a la rama, que construye otro con las variables de ese momento.

Se comprueba en diez segundos: ver **4 · Comprobarlo → Después de desplegar**.

⚠️ **`KLAVIYO_API_KEY` no lleva prefijo `PUBLIC_`, y no es un descuido.** En
Astro, lo que empieza por `PUBLIC_` viaja al navegador y se ve en el HTML. Esta
clave no puede. Lo único que cruza al navegador es un sí o un no — si hay
proveedor o no lo hay.

---

## 4 · Comprobarlo

### Antes de tocar Vercel: que la clave funcione

La forma del cuerpo **está comprobada** contra la versión `2026-07-15` de la
API, leyendo el SDK oficial de Klaviyo (`klaviyo-api` 23.0.0, publicado ese
mismo día). Lo que este `curl` confirma es lo que no se puede comprobar desde
el código: **que la clave existe y tiene los tres permisos**. Diez segundos,
desde cualquier terminal. Sustituye la clave:

```bash
curl -i -X POST 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/' \
  -H 'Authorization: Klaviyo-API-Key pk_TU_CLAVE' \
  -H 'revision: 2026-07-15' \
  -H 'content-type: application/vnd.api+json' \
  -H 'accept: application/vnd.api+json' \
  -d '{
    "data": {
      "type": "profile-subscription-bulk-create-job",
      "attributes": {
        "custom_source": "emilserios.com",
        "profiles": { "data": [ {
          "type": "profile",
          "attributes": {
            "email": "TU-CORREO-DE-PRUEBA@gmail.com",
            "subscriptions": { "email": { "marketing": { "consent": "SUBSCRIBED" } } }
          }
        } ] }
      },
      "relationships": { "list": { "data": { "type": "list", "id": "SaE8Px" } } }
    }
  }'
```

- **`202 Accepted`** (sin cuerpo) → correcto. El alta se procesa detrás.
- **`400`** → la forma del cuerpo cambió. El cuerpo del error dice qué campo
  falla; se corrige en `src/lib/klaviyo.ts`.
- **`404` o mensaje sobre la revisión** → esa fecha ya no existe. Se prueba con
  una más nueva y se pone en `KLAVIYO_REVISION`.
- **`401`** → la clave no vale o está mal copiada. Volver al paso 1.
- **`403`** → la clave vale pero **le falta un permiso**, casi seguro
  *Subscriptions*. Volver al paso 1.

Usa un correo de prueba de verdad, y después bórralo del perfil en Klaviyo.

### Después de desplegar: el sitio

**Mientras la cortina esté bajada, todo esto se hace en una vista previa, no
en `www.emilserios.com`**: ahí `/api/suscribir` contesta 503 y el formulario
dirá que no aunque la clave esté bien.

1. Abrir **`/api/suscribir`** en el navegador, en el mismo dominio que se va a
   probar —por ejemplo `https://…vercel.app/api/suscribir`—.
   - `{"proveedor":true}` → este despliegue tiene la clave. ✅
   - `{"proveedor":false}` → no la tiene: falta la variable en ese entorno
     (Production o Preview), o falta redesplegar. Ver el paso 3.
   - `{"error":"cortina"}` → es producción con la cortina bajada. Probar en una
     vista previa.

   Hasta el 23 sep 2026 esto se miraba buscando `data-endpoint` en el código
   fuente de la página. Ya no sirve: desde ese día vale siempre
   `/api/suscribir`, haya clave o no.
2. Escribir un correo en **Acá te suscribes** y pulsar.
   - «**Listo. Revisa tu bandeja de entrada.**» → dado de alta.
   - «No pudimos completar la suscripción…» → algo falla; ver abajo.
3. Mirarlo en Klaviyo: **Audience** → la lista → el correo tiene que estar ahí.
   Con doble confirmación aparecerá como pendiente hasta que se confirme. En la
   ficha del perfil, el consentimiento lleva como origen **`emilserios.com`**:
   así se distingue a quien se apuntó desde el sitio.
4. Probar los **dos** formularios de la Home —el de arriba y el de abajo del
   todo— y el de *Sobre mí*. Son el mismo componente, pero son tres sitios.

### Si dice que no

El motivo de verdad está en **Vercel → el proyecto → Logs**, buscando
`[klaviyo]`. Se registra el estado HTTP, la `revision` y la lista que se usaron,
y **el cuerpo del error de Klaviyo entero**, que es donde se lee la causa. A la
pantalla no va nada de eso a propósito: nombra la lista y la cuenta.

| En los logs | Qué pasa | Qué se hace |
|---|---|---|
| `falta KLAVIYO_API_KEY en este despliegue` | el despliegue no tiene la clave | paso 3: la variable en ese entorno, y redesplegar |
| `status: 401` | la clave no vale o está mal copiada | paso 1, y pegarla de nuevo en Vercel |
| `status: 403` | la clave vale pero le falta un permiso, casi seguro *Subscriptions* | paso 1: editar la clave |
| `status: 400` | el cuerpo o la lista no cuadran | leer el `cuerpo` del log: dice qué campo |
| nada con `[klaviyo]` | la petición no llegó a la función | ¿es producción con la cortina bajada? Probar en una vista previa |

---

## Lo que el sitio hace, para saber qué esperar

- **La respuesta es la misma esté o no ese correo ya suscrito.** Si contestara
  distinto, cualquiera podría averiguar quién lee el newsletter de Emi probando
  direcciones.
- **Sin `KLAVIYO_API_KEY` el formulario no miente**: en producción dice que no
  se pudo y da `info@emilserios.com`. En desarrollo simula un «Listo» para poder
  revisar el diseño — si lo pruebas en local y funciona, eso no prueba nada.
- **`PUBLIC_NEWSLETTER_ENDPOINT` sigue existiendo** y manda sobre todo lo demás.
  Es la salida para apuntar a otro proveedor sin tocar código. Vacía, que es lo
  normal, manda `/api/suscribir`.
