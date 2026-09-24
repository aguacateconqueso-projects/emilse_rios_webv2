# Conectar el aula

Lo que hay que hacer **fuera del código** para que el Aula Virtual pida sesión
de verdad y solo deje entrar a quien tiene la membresía al día.

Escrito el **22 de septiembre de 2026**, con el PR que puso el candado de pago.
El porqué está en `progreso.md` → **El aula, conectada**; esto es la lista de
tareas.

---

## Antes de empezar: lo que YA existe

**No hay que crear ni migrar nada.** El proyecto de Supabase es el mismo que
lleva un año sirviendo la academia, y ya tiene todo lo que el aula necesita:

| | |
|---|---|
| `profiles` | con `role` (`member` / `admin`) y el correo |
| `subscriptions` | con `status`, `tier` y `current_period_end` |
| el trigger `on_auth_user_created` | crea el perfil solo, al registrarse alguien |
| `is_admin()` | quién ve el panel |
| `has_active_sub()` | **quién entra al aula** — es el candado |
| las políticas RLS | quién puede leer qué |

Son las migraciones `0001` a `0008` de `emilse_rios_membresias`, ya aplicadas.
Este sitio **solo lee**. Por eso esta conexión es barata: no se copia una fila,
no se toca un esquema, y la academia sigue funcionando exactamente igual.

---

## 1 · Vercel — las tres variables

En el proyecto de `emilserios.com`: **Settings** → **Environment Variables**.

| Variable | De dónde sale | Para qué |
|---|---|---|
| `PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → *Project URL* | el aula habla con la base de datos |
| `PUBLIC_SUPABASE_ANON_KEY` | ahí mismo → *anon / public* | ídem |
| `SUPABASE_SERVICE_ROLE_KEY` | ahí mismo → *service_role* | crear la cuenta al pagar |

La tercera ya hacía falta para el cobro (ver `docs/UNIR-LAS-DOS-CASAS.md`), así
que si ya está puesta, no se toca.

**Marcarlas para Production**, y también para Preview si se quiere probar antes
de publicar. **Y redesplegar**: Vercel no aplica una variable nueva al
despliegue que ya está en el aire.

⚠️ **`PUBLIC_SUPABASE_URL` es la RAÍZ del proyecto, y nada más:**

```
✅  https://<ref>.supabase.co
❌  https://<ref>.supabase.co/rest/v1     ← el error que costó media tarde
❌  https://<ref>.supabase.co/            ← la barra final también sobra
```

El panel enseña la URL del proyecto en un sitio y los endpoints REST —con
`/rest/v1` al final— en otro, y copiar el segundo es facilísimo. El cliente le
pega `/auth/v1` a lo que le des, así que con `/rest/v1` delante pide
`…/rest/v1/auth/v1/token` y recibe un **404**.

**Y el fallo es mudo**, que es lo peor: el 404 muere en la pasarela y **nunca
llega al servicio de autenticación**, así que no aparece nada en Users ni en
Authentication → Logs. Solo se ve en **Logs → API/Postgres**, entre el ruido.

Desde el 22 sep 2026 el código limpia la URL solo y avisa por consola
(`[supabase] PUBLIC_SUPABASE_URL tiene que ser la raíz…`), así que el sitio
funciona igual — pero **la variable hay que arreglarla**, o el aviso se queda
ahí para siempre.

⚠️ **`PUBLIC_SUPABASE_ANON_KEY` lleva el prefijo `PUBLIC_` a propósito y no es
un descuido.** Esa clave es pública por diseño: viaja en el HTML y la ve
cualquiera con el inspector abierto. Lo que decide qué puede leer cada quien no
es la clave, son las **políticas RLS** de la base de datos. La que no puede
salir nunca del servidor es `SUPABASE_SERVICE_ROLE_KEY`, que se salta la RLS
entera — y por eso ésa no lleva prefijo.

---

## 2 · Supabase — las Redirect URLs

**Authentication** → **URL Configuration** → *Redirect URLs*. **Añadir**, no
sustituir: es aditivo y la academia sigue funcionando igual.

    https://www.emilserios.com/aulavirtual/nueva-clave/
    https://www.emilserios.com/en/classroom/new-password/
    https://www.emilserios.com/aulavirtual/pasar/
    https://www.emilserios.com/en/classroom/handoff/

Las dos primeras son donde aterriza el enlace del correo de la contraseña; sin
ellas, ese enlace no lleva a ninguna parte. Las dos últimas son el puente de
traspaso desde la academia.

Y las vistas previas de Vercel, con un comodín que vale para todas las ramas
(puesto el 24 sep 2026): `https://*-adrians-projects-594b3131.vercel.app/**`.
El proyecto de Vercel es `emilse-rios-webv2_1`.

### Y el Site URL, en esa misma pantalla

Justo encima está **Site URL**, y desde la capa A dice
`https://www.emilseriosacademy.com`. **Cambiarlo a `https://www.emilserios.com`.**

Es seguro, y conviene entender por qué antes de tocarlo: el Site URL es **el
respaldo**, el sitio al que Supabase manda cuando nadie le dice a dónde ir, o
cuando lo que le dicen no está en la lista de arriba. **Ninguno de los caminos
de las dos casas depende de él**: la pantalla de acceso, la de `/gracias/` y el
webhook de la academia pasan todos su `redirectTo` a mano, y esas direcciones ya
están permitidas. Lo único que cambia es a dónde cae lo que se salga del guion.

⚠️ **Si Emi tiene plantillas de correo personalizadas** que usen `{{ .SiteURL }}`
—Authentication → Email Templates— sus enlaces cambiarán de dominio con esto.
Mirarlas antes.

---

## ⚠️ Lo que NO hay que hacer todavía: redirigir la academia

La tentación es razonable —el sitio viejo ya no debería recibir a nadie— y es
**exactamente el movimiento que rompe tres cosas a la vez**. Con un 301 de
`emilseriosacademy.com` a cualquier sitio:

1. **Se cae el webhook de Stripe.** Vive en
   `emilseriosacademy.com/api/stripe-webhook` y es lo que escribe la suscripción
   en la base de datos. Una redirección deja el aviso de Stripe llegando a una
   página de ventas, que no procesa nada. **Resultado: alguien paga y no recibe
   acceso** — y no se entera nadie hasta que esa persona escriba.
2. **Se cae el aula de la membresía.** Los videos semanales se siguen sirviendo
   allá. Las miembros de hoy se quedan sin sus clases.
3. **Se cae el puente de traspaso antes de existir.** Sin la academia viva no hay
   de dónde traer la sesión, y entonces **todo el mundo tiene que restablecer su
   contraseña** en vez de entrar con un clic.

El orden bueno ya está escrito en `docs/UNIR-LAS-DOS-CASAS.md`: primero el
puente, después el correo de aviso, después mudar el webhook, y **semanas
después** la academia pasa a ser un 301. Ahora no.

**Lo que sí se puede hacer ya**, si la molestia es que alguien llegue al sitio
viejo: redirigir **rutas sueltas** —la portada, `/aula/`— y dejar `/api/*` en
paz. Pero ni siquiera eso hace falta antes del correo de aviso.

---

## 3 · Los admins

⚠️ **Antes que nada: en este sitio NADIE puede crearse una cuenta.** Y es a
propósito — no hay registro abierto, porque el aula se compra. Las cuentas nacen
de un solo sitio: `/api/claim-account`, después de un pago de Stripe.

Eso incluye a Emi y a Adrián, que nunca han pagado nada. **Sus cuentas hay que
crearlas a mano.**

Y ojo con la trampa, que es de las que hacen perder una tarde: **«¿Primera vez,
o se te olvidó la clave?» tampoco las crea.** Por debajo es
`resetPasswordForEmail`, y esa función solo manda el correo si la cuenta ya
existe — si no existe, **contesta que todo fue bien y no manda nada**, para no
delatar quién está registrado. Así que parece que funcionó, y no llega ningún
correo nunca.

### 3.1 · Crear las dos cuentas

En **Supabase → Authentication → Users → Add user → Create new user**:

| Campo | Qué poner |
|---|---|
| Email | `emilserios.bass@gmail.com` · luego `adrianmendozam@gmail.com` |
| Password | una contraseña **distinta para cada uno** |
| Auto Confirm User | **marcado** ✅ |

⚠️ **«Auto Confirm User» marcado, o no se puede entrar.** Sin confirmar, Supabase
rechaza el inicio de sesión con «Email not confirmed» — que en pantalla se ve
como el mismo «ese correo o esa contraseña no son correctos» de siempre.

⚠️ **Una contraseña distinta para cada persona, y que no haya viajado por un
chat.** Dos cuentas de admin con la misma clave es una sola cuenta con dos
nombres: si se filtra una, se filtraron las dos, y los registros no dicen quién
hizo qué.

Al crear el usuario, el trigger `on_auth_user_created` le crea el perfil solo.
No hay que hacer nada más.

### 3.2 · Comprobar que entran

Cada uno en `https://www.emilserios.com/aulavirtual/entrar/`, con su correo y su
contraseña. Tienen que entrar al escritorio.

**La pantalla ya distingue dos cosas, y la diferencia importa:**

- **«Ese correo o esa contraseña no son correctos»** → es de credenciales. La
  cuenta no existe, la clave no es ésa, o el correo está sin confirmar. (Los
  tres se cuentan igual a propósito: distinguirlos deja averiguar quién es
  miembro probando correos.)
- **«No pudimos completar el acceso, y no es tu contraseña»** → **no toques la
  contraseña**. Es de nuestro lado, y el motivo está en la consola.

En los dos casos, **abrir la consola** (F12 → Console) y buscar `[acceso]`:

| En la consola | Qué pasa |
|---|---|
| `Invalid login credentials` | la cuenta no existe, o la contraseña no es ésa |
| `Email not confirmed` | falta marcar *Auto Confirm* — se arregla en el usuario |
| `Invalid API key` | `PUBLIC_SUPABASE_ANON_KEY` de Vercel está mal o incompleta |
| `Auth session or user missing` | Supabase contestó `200` pero sin sesión utilizable. **Las credenciales eran buenas.** Mirar Authentication → Logs para ver el `/token` |
| `Request rate limit reached` | demasiados intentos seguidos; esperar |
| `[supabase] PUBLIC_SUPABASE_URL tiene que ser la raíz…` | la variable de Vercel lleva `/rest/v1` o una barra de más. El sitio se apaña, pero arréglala |
| un error de red | Supabase no contestó |

💡 **Authentication → Logs en Supabase es la otra mitad del diagnóstico**, y
llega antes que la consola: si `/token` sale en **200**, las credenciales
estaban bien y el problema es de este lado. Si sale en 400, no.

⚠️ **Y si ahí no aparece NADA**, el intento no llegó al servicio de
autenticación. Entonces el sitio de mirar es **Logs → API**, buscando un `404`
sobre `/token`: es la URL mal formada de arriba.

### 3.3 · Y recién entonces, el script

En **Supabase → SQL Editor**, pegar y ejecutar **`supabase/set_admin.sql`** de
este repositorio.

⚠️ **El orden no es una recomendación.** El perfil de cada persona existe desde
que se crea el usuario, no antes. Si el script se ejecuta con alguien sin perfil,
**aborta sin tocar nada** y dice quién falta — está hecho así a propósito, para
que nadie pierda el admin por un typo.

El script deja además una consulta al final que enseña quién quedó como admin.

---

## 4 · Comprobarlo

### Que el aula esté conectada

Ver el código fuente de `https://www.emilserios.com/aulavirtual/escritorio/` y
buscar **`class="porton"`**. La palabra que decide es `hidden`:

```html
<div class="porton" data-porton hidden>   ← NO conectada: el portón está
                                             apagado y el aula se deja mirar
<div class="porton" data-porton>          ← conectada ✅
```

Si sale `hidden`, faltan las variables en Vercel o falta redesplegar. (Es el
mismo truco que sirvió para el newsletter: lo que decide se ve en el HTML.)

La pantalla de acceso, `/aulavirtual/entrar/`, es la otra mitad de la
comprobación: ahí, sin conectar, sale un aviso de **«Sin conectar»** encima del
formulario.

### Que el candado funcione

Son cuatro casos, y conviene verlos los cuatro:

| Quién | Qué tiene que pasar |
|---|---|
| Sin sesión | «Esto es para quien ya entró» + *Iniciar sesión* / *Tienda* |
| Miembro con la suscripción al día | **entra** |
| Miembro sin suscripción al día | «Tu suscripción no está al día» + *Ver la membresía* / *Entrar con otra cuenta* |
| Emi (admin), sin suscripción | **entra** — no se paga a sí misma |

El tercero es el que casi nadie prueba y el que más se nota si falla. Para
probarlo sin cancelar la suscripción de nadie: entra con una cuenta que no tenga
suscripción. Y para probar el segundo sin pasar por Stripe, `set_admin.sql`
tiene un `tester_email` que regala una membresía de 30 días — se rellena, se
prueba, **y se vuelve a vaciar**.

### Si algo no cuadra

La consola del navegador (F12 → Console). Si la comprobación de la suscripción
falla —la función no expuesta, la red— sale ahí como `[aula] no se pudo
comprobar la suscripción`, **y el aula deja pasar**. Es deliberado: ver la nota
de abajo.

---

## Lo que esto NO hace, y conviene tener claro

**1 · El portón decide qué se DIBUJA, no qué se puede leer.** Hoy el contenido
de las clases va escrito en el HTML porque es de muestra, así que alguien con la
consola abierta lo ve igual, tenga o no suscripción. No importa mientras sea de
muestra — **y deja de no importar el día que entre el curso de verdad**. Ese día
las clases tienen que llegar por consulta a Supabase con la RLS decidiendo. Es
lo que `progreso.md` llama cerrar la capa B.

**2 · Si la comprobación falla, se deja pasar.** Entre dejar entrar a alguien de
más durante un minuto y dejar fuera a **toda la membresía** por un fallo de
configuración, lo segundo es mucho peor — y hoy, con el contenido de muestra, no
hay nada que proteger que no esté ya a la vista. ⚠️ **Esto se invierte con el
punto 1**: cuando las clases vengan de la base de datos, un fallo acá tiene que
cerrar.

**3 · Quien compró un CURSO suelto todavía no entra.** El único derecho de
acceso que hay hoy en la base de datos es la suscripción a la membresía. Los
cursos piden la tabla de derechos de acceso —`entitlements`— que está pendiente.
Hoy no molesta porque no hay ningún curso a la venta; molestará el día que lo
haya, y está anotado.

**4 · El aula de la membresía sigue en la academia.** Los videos semanales se
sirven allá; el botón «Membresía» del escritorio todavía sale del sitio, y lo
dice.
