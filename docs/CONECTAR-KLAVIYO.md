# Conectar Klaviyo

Lo que hay que hacer **fuera del código** para que «Acá te suscribes» dé de alta
de verdad. Son dos pasos en Klaviyo y uno en Vercel, más una comprobación.

Escrito el **22 de septiembre de 2026**, con el PR que montó `/api/suscribir`.
El porqué de cada decisión está en `progreso.md` → **El newsletter, conectado**.

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

## 1 · Klaviyo → la clave privada

1. Entrar en Klaviyo con la cuenta de Emi.
2. Arriba a la derecha, el nombre de la cuenta → **Settings** → **API keys**.
3. **Create Private API Key**.
4. Nombre: algo que diga de dónde viene, por ejemplo `emilserios.com — alta web`.
   El día que haya que revocarla, el nombre es lo único que dice cuál es.
5. **Permisos: los mínimos.** No hace falta acceso completo. Con permiso de
   escritura sobre **Lists** y **Profiles** basta; si el panel ofrece
   «Full Access», no se elige.
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
Dos cosas a tener en cuenta antes de elegir:

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
| `KLAVIYO_REVISION` | otra fecha de la API | no · por defecto `2024-10-15` |

Marcarla para **Production** (y para Preview, si se quiere probar antes de
publicar). **Y redesplegar**: Vercel no aplica una variable nueva al despliegue
que ya está en el aire.

⚠️ **`KLAVIYO_API_KEY` no lleva prefijo `PUBLIC_`, y no es un descuido.** En
Astro, lo que empieza por `PUBLIC_` viaja al navegador y se ve en el HTML. Esta
clave no puede. Lo único que cruza al navegador es un sí o un no — si hay
proveedor o no lo hay.

---

## 4 · Comprobarlo

### Antes de tocar Vercel: que la API sea la que creemos

La forma del cuerpo de abajo es la del trabajo de suscripción de Klaviyo, pero
**no se pudo verificar contra su documentación** al escribir esto. Este `curl`
lo confirma en diez segundos, desde cualquier terminal. Sustituye la clave:

```bash
curl -i -X POST 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/' \
  -H 'Authorization: Klaviyo-API-Key pk_TU_CLAVE' \
  -H 'revision: 2024-10-15' \
  -H 'content-type: application/vnd.api+json' \
  -H 'accept: application/vnd.api+json' \
  -d '{
    "data": {
      "type": "profile-subscription-bulk-create-job",
      "attributes": {
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
- **`401` / `403`** → la clave no vale o le faltan permisos. Volver al paso 1.

Usa un correo de prueba de verdad, y después bórralo del perfil en Klaviyo.

### Después de desplegar: el sitio

1. Ver el código fuente de `www.emilserios.com` y buscar `data-endpoint`.
   - `data-endpoint="/api/suscribir"` → la clave está puesta. ✅
   - `data-endpoint` a secas → falta la clave, o falta redesplegar.
2. Escribir un correo en **Acá te suscribes** y pulsar.
   - «**Listo. Revisa tu bandeja de entrada.**» → dado de alta.
   - «No pudimos completar la suscripción…» → algo falla; ver abajo.
3. Mirarlo en Klaviyo: **Audience** → la lista → el correo tiene que estar ahí.
   Con doble confirmación aparecerá como pendiente hasta que se confirme.
4. Probar los **dos** formularios de la Home —el de arriba y el de abajo del
   todo— y el de *Sobre mí*. Son el mismo componente, pero son tres sitios.

### Si dice que no

El motivo de verdad está en **Vercel → el proyecto → Logs**, buscando
`[klaviyo]`. Se registra el estado HTTP, la `revision` y la lista que se usaron,
y **el cuerpo del error de Klaviyo entero**, que es donde se lee la causa. A la
pantalla no va nada de eso a propósito: nombra la lista y la cuenta.

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
