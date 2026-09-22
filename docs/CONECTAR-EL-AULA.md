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

Conviene añadir también las de la URL de Vercel (`*.vercel.app`).

---

## 3 · Los admins

**En este orden, que importa:**

1. **Emi entra una vez** en `https://www.emilserios.com/aulavirtual/entrar/` con
   su correo. Si nunca ha puesto contraseña en este sitio, usa «¿Primera vez, o
   se te olvidó la clave?» y le llega el enlace.
2. **Adrián, lo mismo.**
3. Recién entonces, en **Supabase → SQL Editor**, pegar y ejecutar
   **`supabase/set_admin.sql`** de este repositorio.

⚠️ **El orden no es una recomendación.** El perfil de cada persona se crea la
primera vez que entra, no antes. Si el script se ejecuta con alguien sin perfil,
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
