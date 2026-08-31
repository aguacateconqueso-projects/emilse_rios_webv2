# Progreso — Contrabajo en la Ciudad

Sitio de **Emilse Ríos**, contrabajista y docente. Su newsletter, su aula, su
membresía y sus cursos. Este documento es la memoria del proyecto: quien lo lea
de cero debería poder seguir trabajando sin preguntar nada.

**Última actualización:** 31 de agosto de 2026 · abre el Aula Virtual, en fachada

---

## Dónde estamos

| | |
|---|---|
| **Publicado** | Sí, en Vercel. Despliega solo en cada merge a `main`. |
| **Dominio** | Pendiente. Todavía se ve en la URL de Vercel. El destino es `emilserios.com`. |
| **Páginas** | Home, Sobre mí y el Aula Virtual, las tres en español e inglés. |
| **Identidad** | El logo de Emi, vectorizado, en cabecera, pie, entrada y favicon. |
| **Alcance** | Desde el 31 ago 2026 esto deja de ser solo el sitio: aquí van también el aula, la membresía y los cursos. Ver **La plataforma**. |
| **Lo que falta para lanzar** | Conectar Klaviyo. El formulario **no da de alta a nadie**. |

Rutas vivas: `/` · `/en/` · `/sobre-mi/` · `/en/about/` · `/aulavirtual/` ·
`/en/classroom/` · `/aulavirtual/estudiemos-juntos/` ·
`/en/classroom/estudiemos-juntos/`

**Lo que está en marcha ahora mismo** es la plataforma: se decidió el alcance,
se dibujó el aula, y Emi le mandó a Edu —quien hizo la web original y controla
el dominio— la pedida completa para recuperar `emilserios.com`. **Se espera su
respuesta.** Nada de las primeras cinco fases depende de eso, así que se puede
avanzar mientras. Todo está en la sección siguiente.

Y ya hay algo puesto: **el Aula Virtual abrió en fachada**. Está el catálogo con
los siete productos, la página de venta de la membresía y el botón de comprar,
que hoy lleva al cobro que ya funciona en la academia. Sin base de datos, sin
webhook y sin tocar nada de lo que está cobrando. Es **La tienda, y el recorrido
de compra**, más abajo.

Del sitio en sí, lo último que se tocó fue **el menú**. La cabecera dejó de ser
una barra: ahora es una cápsula de cristal que flota sobre la página, con la
firma de Emi en el centro y la palabra «MENÚ» al lado. Al pulsarla crece hacia
abajo y descubre Inicio, Sobre mí, Aula Virtual y el conmutador de idioma, que
antes estaban sueltos a la derecha. Copia el comportamiento del sitio que Emi pasó de
referencia, y trajo dos enmiendas al sistema —radio y sombra, solo para esta
cápsula— anotadas más abajo.

Fueron dos PRs: el **#14** llevó la primera versión —una barra a lo ancho con
un panel cuadrado colgando— y el **#15** la rehízo entera después de que Emi la
devolviera por tres cosas: no se veía transparente, no tenía animación de
entrada ni de salida, y a veces se repintaba de negro el marco superior.

Antes de eso, la lámina volvió a ser horizontal con un recorte de Emi, antes la
portada centrada, y antes el fondo del contrabajo (PRs #4 a #7), cerrado y
aprobado; si se retoma, es solo para mover los mandos de `tokens.css` — ver la
receta más abajo. **Lo siguiente sin dueño, del sitio, es el cierre para
producción**, en «Próximos PRs»; de la plataforma, traer el repo de la
membresía.

---

## La plataforma

Hasta el 30 de agosto de 2026 este repo era un sitio de dos páginas con una
newsletter. Desde el **31 de agosto** es la casa de todo lo de Emi: el sitio
público, el aula de las alumnas, la membresía y los cursos, **en un solo
dominio, un solo despliegue y un solo repositorio**. Esto reencuadra el resto
del documento: lo de abajo sigue siendo cierto, pero es la primera capa de algo
más grande.

Lo que hoy está repartido, y qué le pasa a cada cosa:

| Dónde | Qué es | Qué le pasa |
|---|---|---|
| `emilserios.com` | WordPress + Tutor LMS, hecho por **Edu** | Se tira. **El dominio se queda**, y es el destino final de todo. |
| `emilseriosacademy.com` | La membresía «Estudiemos Juntos». Viva, cobrando, con miembros reales. | Su código se muda **a este repo**. El dominio acaba redirigiendo. |
| Vimeo · Stripe · Klaviyo | Videos, cobros y newsletter | **Los maneja Emi**, están a su nombre. No hay que pedirlos ni migrarlos. |
| Este repo | Home y Sobre mí | Es la base sobre la que se monta todo lo demás. |

La membresía existe en un dominio aparte por una sola razón: el DNS de
`emilserios.com` lo controlaba un tercero difícil de localizar y no se pudo
crear un subdominio. Recuperar ese control es lo que destraba la fusión.

### El dominio, y Edu

`emilserios.com` está registrado en **Hostinger**, en la cuenta de Edu, que
hizo la web original. **Emi le envió el 31 de agosto de 2026 el correo con
todo lo que hace falta, en una sola pedida.** Se le pidió:

1. **El dominio.** Vía preferente: mover el dominio a una cuenta de Hostinger
   de Emi, que en hPanel es inmediato y no pasa por códigos ni esperas. Vía
   alterna: código de autorización (EPP) + quitar el bloqueo de traspaso.
2. **La zona DNS entera**, exportada: A, CNAME, **MX**, TXT (SPF/DKIM/DMARC) y
   subdominios.
3. **Dónde vive `info@emilserios.com`**, cuántos buzones hay y quién los paga.
4. **Acceso al hosting** y una copia completa del sitio (ficheros + BD).
5. **Search Console y Analytics**, y el listado de URLs publicadas.
6. Cualquier otro servicio colgado del dominio.
7. Una fecha de corte y estar localizable el día del cambio.

**Estado: enviado, esperando respuesta.** Nada de las fases 1 a 5 depende de
esto, así que se puede avanzar entretanto; lo único que bloquea de verdad es la
fase 6.

Tres trampas apuntadas para cuando conteste:

- **El orden importa.** Primero el traspaso, después cambiar el contacto del
  titular. Al revés se activa un bloqueo ICANN de 60 días.
- **Traspasar el dominio no mueve el DNS.** El registrador de destino arranca
  con sus nameservers por defecto. La zona hay que replicarla **antes** de que
  el traspaso se complete, o se cae el correo de Emi el mismo día.
- **El correo probablemente vive dentro del plan de hosting.** Si es el correo
  incluido de Hostinger, apagar el hosting apaga el buzón — y ese buzón es el
  `reply-to` de todos los correos de la academia. Hay que decidir dónde vive el
  correo antes de tocar nada.

Si Edu solo diera **una** cosa, la útil es delegar los nameservers a Cloudflare
bajo una cuenta de Emi: es un cambio de dos minutos por su parte, el dominio
sigue siendo suyo, y a partir de ahí el DNS se controla desde acá para siempre.

### El aula

Una sola aula para las dos cosas que vende Emi: la membresía y los cursos.

**La parte de fuera ya existe** —el catálogo y las cartas de venta, en
`/aulavirtual/`, sin sesión— y está descrita en **La tienda, y el recorrido de
compra**, aquí abajo. Lo que sigue es la parte de dentro, la que pide haber
pagado y haber entrado:

```
/aula/                   Mi escritorio
                         ├─ Si tiene membresía: el ejercicio de esta semana,
                         │  con la cuenta atrás al jueves
                         ├─ Mis cursos, con barra de progreso
                         └─ Entrada a la tienda

/aula/membresia/         Las tres pestañas de hoy, INTACTAS
                         (ejercicio de la semana · concepto base · bonus)

/aula/curso/<slug>/      El reproductor
                         ├─ Columna: módulos y lecciones, con sus ✓
                         ├─ Centro: video, descripción, PDF
                         ├─ «Marcar como completada»
                         └─ Hilo privado con Emi

/aula/tienda/            El mismo catálogo, ya con sesión
                         ├─ Comprado     → «Entrar al curso»
                         ├─ A la venta   → «Comprar»
                         └─ Próximamente → «Avisadme cuando salga»

/aula/cuenta/            Suscripción, facturación, contraseña, idioma
/panel/                  La consola de Emi (solo admin, solo español)
```

`/aula/tienda/` y `/aulavirtual/` **son el mismo catálogo leído desde dos
sitios**: los mismos productos, los mismos precios, la misma página de venta.
Lo único que cambia es que dentro se sabe qué compró ya quien mira, y por eso
una ficha comprada dice «Entrar» en vez de «Comprar». No son dos catálogos que
haya que mantener a la vez: hoy los dos salen de `src/data/aula.ts` y el día que
haya base de datos saldrán los dos de la misma consulta.

**El foro no es uno, son dos mecanismos distintos.** En la membresía el foro es
colectivo: todas leen todas las preguntas, y **solo Emi responde**. En un curso
el hilo es **privado** entre esa alumna y Emi. Son tablas distintas y reglas de
acceso distintas, y está bien que lo sean.

En el hilo del curso, Emi puede responder con **video y con audio**. El video se
resuelve pegando un enlace de Vimeo, reutilizando el normalizador que ya existe
en su panel —el que acepta la URL, el enlace de gestión, el ID pelado o el
`<iframe>` entero, porque Emi pega algo distinto cada vez—. El audio se graba
desde el navegador y va a Storage sin transcodificar: para un instrumento, «escucha
cómo suena esto» suele valer más que ver las manos, y pesa cien veces menos.
**Y hay correo en los dos sentidos:** a la alumna cuando Emi responde, a Emi
cuando entra una pregunta. Sin eso el hilo no sirve.

### La tienda, y el recorrido de compra

El Aula Virtual es, por fuera, una tienda. El recorrido entero, de la primera
mirada hasta estar dentro estudiando, son siete pasos:

```
1  Catálogo            /aulavirtual/            ✅ hecho
2  Página de venta     /aulavirtual/<slug>/     ✅ hecho (la de la membresía)
3  Botón de comprar    dentro de esa página     ✅ hecho
4  Enlace de pago      Stripe · PayPal          ◻︎ Stripe sí, pero en la academia
5  Confirmación                                 ◻︎ existe en la academia
6  Correo + crear la cuenta                     ◻︎ existe en la academia
7  Entra, con lo que compró desbloqueado        ◻︎ pide derechos de acceso
```

Los tres primeros pasos son este repo y ya están. Del cuarto al sexto **existen
y funcionan hoy**, pero en `emilseriosacademy.com`: por eso el botón «Comprar»
de la membresía sale del sitio, y por eso la propia página lo dice en vez de
dejar que la alumna descubra sola que cambió de dominio a mitad de una compra.
El séptimo es lo que trae la migración de derechos de acceso.

**El catálogo tiene siete productos.** La membresía, que es lo único a la venta,
y seis cursos que Emi ya tiene grabados pero todavía sin estrategia de venta. Los
seis salen como «Próximamente» y **sus fichas no son enlaces**: no tienen página
porque no tienen carta, y una URL indexable prometiendo algo que no se puede
comprar es peor que un hueco anunciado. Cuando Emi mande el nombre, el precio y
la carta de cada uno, se escriben en `src/data/aula.ts` y la página aparece sola.

**Los nombres «Curso 1» a «Curso 6» son marcadores**, no títulos. Están puestos
para que se vea la forma del catálogo, y se sustituyen enteros.

Tres cosas que se decidieron con esto, y que conviene no volver a discutir:

- **PayPal solo para los cursos.** La membresía es una suscripción recurrente y
  ya cobra por Stripe; meter ahí un segundo proveedor con su propio modelo de
  suscripciones es duplicar webhooks y conciliación a cambio de nada. En un
  curso, PayPal es un pago único, que es su caso fácil. La tabla de derechos de
  acceso ya lo soporta: es otro valor de `source`.
- **Se paga primero y la cuenta se crea después** — y esto no hay ni que
  construirlo. Leyendo `src/pages/api/checkout.ts` de la academia se ve que el
  checkout **ya es anónimo**: nadie inicia sesión para pagar, Stripe recoge el
  correo, y en `/gracias/` el comprador pone su contraseña ahí mismo con
  `/api/claim-account`, sin depender de que le llegue ningún correo. Los cursos
  copian ese camino en vez de inventar otro.
- **La membresía no se toca hasta después del cambio de dominio.** Está cobrando,
  con miembros reales dentro. Todo lo nuevo se construye al lado.

**Comprar desde dentro tiene que ser el mismo camino, no otro.** Quien ya pagó
algo —membresía o un curso— entra en `/aula/tienda/`, compra otro curso y se le
desbloquea sin volver a crear cuenta ni volver a escribir su correo: ya está
identificado, así que el pago se ata a su usuario y el derecho de acceso se
escribe encima del que ya tiene. Es el mismo webhook y la misma tabla; lo único
que cambia respecto a una compra de fuera es que no hay paso 6, porque la cuenta
ya existe.

**El correo de confirmación y la factura los mandan Stripe y PayPal**, cada uno
por su lado, y así se queda: son ellos los que tienen los datos fiscales y la
numeración. La plataforma manda lo suyo, que es distinto — «ya tienes acceso, y
esto es lo que acabas de desbloquear» — y no intenta hacer de facturador. Lo que
sí hay que comprobar antes de vender es que el recibo de Stripe esté encendido
en el panel de Emi, porque viene apagado por defecto.

### Cómo se decide el acceso

Hoy, en la membresía, el acceso es una sola pregunta binaria: `has_active_sub()`.
Eso vale para **una** membresía y para nada más. Un curso es otra forma: compra
única, acceso de por vida. La pieza que unifica las dos es una tabla de
**derechos de acceso**:

```
entitlements
  user_id · product_id
  source      'stripe_sub' | 'stripe_once' | 'manual'
  granted_at
  expires_at  NULL = para siempre       ← cursos
              fecha = fin de período    ← membresía
  revoked_at
```

Con eso, la membresía pasa a ser **un producto más** cuyo derecho caduca cada
mes, y el webhook de Stripe tiene una sola responsabilidad: escribir derechos,
venga de una suscripción o de un pago único. `has_active_sub()` se reescribe
encima de esta tabla, así que **nada de lo que hoy funciona en la membresía se
rompe**.

Los cursos son un modelo aparte —`products` → `courses` → `modules` →
`lessons`, más `lesson_progress` y los hilos privados—. **No se estira la tabla
`exercises` con más valores de `kind`**: está optimizada para «una fila vigente
a la vez con ventana temporal», que es justo lo contrario de un curso.

### Las reglas que no se rompen

De la membresía, heredadas y no negociables:

1. **Un solo ejercicio semanal vigente**, igual para todos, que rota los jueves
   y **desaparece**. No hay biblioteca histórica: es el gancho de retención y
   Emi lo argumenta en su carta de ventas. La tentación al unificar es
   «ya que los cursos son permanentes, dejemos también los ejercicios viejos».
   Eso rompe el producto.
2. **No hay niveles.** Emi guía inicial y avanzado dentro del mismo video.
3. **Dos foros separados por idioma**, sin traducción automática.
4. **El bonus se acumula y no expira.** Única excepción a la ventana.
5. **Contenido y cobro son dos relojes independientes.** El contenido es un
   calendario global semanal; el cobro es mensual desde el alta de cada quien.

De los cursos, nuevas:

6. **Cerrar un curso quita el botón de comprar, nunca quita el acceso a quien
   ya lo compró.** Emi va a hacer lanzamientos: abrir, cerrar, reabrir. Acceso
   de por vida es de por vida aunque el curso lleve dos años descatalogado. Es
   el fallo clásico de estas plataformas y es un desastre de reputación.
7. **Publicar y anunciar son dos actos distintos.** El correo de lanzamiento
   sale de un botón aparte, con confirmación que diga a cuánta gente va. Si se
   dispara al guardar, el día que Emi corrija una errata todo el mundo lo
   recibe dos veces.
8. **Todo correo comercial lleva enlace de baja**, y se respeta. Escribir a
   quien compró un curso es legal en la UE por la excepción de cliente
   existente, pero solo con baja funcionando.

Y una que viene de la membresía y hay que reimplantar tal cual: **la red contra
el bucle de pago**. Alguien que ya pagó puede quedar encerrado en la puerta de
pago si el webhook de Stripe falla o tarda. La solución vive en tres capas
—reintentos al volver del pago, una llamada que le pregunta a Stripe
directamente, y un camino de alta que no depende del webhook en absoluto— y
nació de un incidente real con el primer suscriptor. Cualquier panel nuevo la
necesita.

### Las cartas de venta de los cursos

Cada curso tiene su página pública propia, **`/aulavirtual/<slug>/`** —y
`/en/classroom/<slug>/`—, indexable, con el sistema de diseño de este sitio. Emi
la escribe desde su panel. Esa página es a la vez la carta de ventas y el destino
del botón de la tienda: una sola cosa con dos usos.

Cuelga del aula y no de un `/cursos/` aparte, que es donde se dibujó primero,
porque el recorrido es uno solo: se entra al Aula Virtual, se mira el catálogo,
se abre un producto y se compra. Una segunda rama de URLs para el mismo paso
obligaba a decidir en cada enlace a cuál de las dos mandar.

Al publicar, el anuncio va por dos vías distintas y **cada herramienta hace lo
suyo**: la plataforma avisa a los usuarios que ya tienen cuenta, cada uno en su
idioma; y **la campaña grande la manda Emi por Klaviyo**, que es donde está su
lista de verdad. La plataforma no intenta ser un mailer masivo — mandar
campañas por el proveedor transaccional le quema la reputación al dominio justo
cuando más falta hace que lleguen los correos de acceso.

La lista de «avisadme cuando salga» es, en la práctica, la lista de
relanzamiento de Emi. Tiene que ser exportable a Klaviyo.

### El código de la membresía, ya leído

Vive en **`aguacateconqueso-projects/emilse_rios_membresias`** — ojo al nombre,
es `emilse_rios`, con guion bajo, igual que este repo. Leído entero el 31 ago
2026. Son **6.076 líneas en `src/`** y **405 de SQL** en siete migraciones. El
dossier de traspaso resultó fiel: no hay sorpresas de arquitectura.

**Es un repositorio público, y no hay credenciales dentro.** El `.gitignore`
excluye `.env` y `.env.*` salvo `.env.example`, y ese ejemplo solo lleva
marcadores (`sk_test_...`, `eyJ...`). Comprobado con un barrido de patrones de
clave sobre el árbol. Al mudar el código **hay que mantener esa disciplina**,
porque este repo también es público.

Lo que se confirma leyendo el código, y que importa para la mudanza:

- **La lógica de acceso está toda en la base de datos, no en el frontend.** Las
  páginas hablan directo con Supabase desde el navegador con la clave `anon`,
  que es pública a propósito; quien decide qué ve cada quien son las políticas
  RLS. **Por eso el frontend se puede reescribir entero sin tocar una sola
  regla de acceso** — es lo que hace barata esta mudanza.
- **`has_active_sub()` se define una sola vez**, en la migración `0001`, y las
  demás se apoyan en ella. Cambiarla por derechos de acceso es tocar **una
  función**, no siete migraciones.
- **La sesión usa `flowType: 'implicit'`** y un adaptador propio de
  almacenamiento: la casilla «mantener sesión iniciada» decide si el token va a
  `localStorage` o a `sessionStorage`. Es lo que hará que todo el mundo tenga
  que volver a entrar al cambiar de dominio.
- **El espejo de Stripe está aislado** en `src/lib/stripe-sync.ts`, compartido
  por el webhook y por la verificación bajo demanda, precisamente para que los
  dos caminos escriban la misma fila. Ese aislamiento es lo que permitirá
  añadir el pago único sin tocar el de la suscripción.

Y dos cosas que hay que arreglar al mudar, encontradas leyendo:

- ⚠️ **La migración `0007` no es idempotente**, aunque el dossier diga que
  todas lo son. Su `create type public.content_kind as enum (…)` no lleva el
  envoltorio `do $$ … exception when duplicate_object` que sí usa la `0001`, así
  que **volver a pegarla falla**. Va dentro de una transacción, así que no deja
  nada a medias, pero conviene saberlo antes de repetirla por si acaso. Las
  migraciones nuevas se escriben con el envoltorio.
- ⚠️ **`trialing` no significa lo mismo en el código que en la base de datos.**
  `subGrantsAccess()` da acceso a `'active'` y a `'trialing'`, pero
  `has_active_sub()` —que es la puerta de verdad— solo acepta `'active'`. Si
  algún día Emi ofrece un período de prueba, la red de seguridad escribiría una
  fila `trialing` que la RLS rechazaría: el usuario pagaría y no vería nada.
  Hoy no se usan pruebas, así que no está roto; al pasar a derechos de acceso
  hay que decidir de una vez si `trialing` entra o no, y que lo digan los dos
  lados igual.

La capa visual de la academia que se guarda sin enchufar son dos ficheros:
`public/membresia-ui.css` y `public/membresia-ui.js`.

### Las fases

```
Fase 0   Pedir el dominio a Edu (enviado) + traer el repo de la membresía
Fase 1   Derechos de acceso + mudar el aula y el panel a este repo
Fase 2   Cursos: modelo, reproductor, progreso, hilo privado con video y audio
Fase 3   Tienda + pago único + los estados de lanzamiento
Fase 4   Cartas de venta + botón de anuncio
Fase 5   Cargar los 4 cursos y las alumnas que ya compraron
Fase 6   El cambio de dominio, con todo lo demás funcionando
```

**De las fases 3 y 4 ya está la mitad de fuera**: el catálogo, los tres estados
de la ficha y la carta de venta de la membresía, sin backend. Lo que les queda
es lo que necesita base de datos —el pago único, el estado de lanzamiento que se
cambia desde el panel, y el botón de anuncio—, y eso va detrás de la fase 1. Se
adelantó a propósito: es lo que se puede ver y aprobar antes de gastar en
fontanería, y no toca nada de lo que hoy cobra.

**No hay fase de migración automática.** Son **4 cursos y unas 5 alumnas**: se
cargan a mano en una tarde desde el panel, y el acceso se concede desde la
pantalla de miembros que ya existe. Escribir una herramienta para eso costaría
más que hacerlo. De Tutor LMS solo hace falta que Emi pase la estructura de
cada curso —qué lecciones, en qué orden, con qué enlace de Vimeo— y los correos
de quienes compraron.

**El cambio de dominio va al final**, aunque el control del dominio se pida ya:
son cosas distintas. El día del cambio hay que tocar, todo junto:
`PUBLIC_SITE_URL` · la URL del webhook en Stripe · el enlace del portal de
Stripe que está a mano en el menú del aula · las **Redirect URLs** de Supabase
Auth · la **lista de dominios permitidos en Vimeo**, o los videos se bloquean
aunque el embed sea correcto · verificar el dominio en Resend · los 301 de las
URLs viejas. Y **todo el mundo tendrá que volver a iniciar sesión**, porque la
sesión vive en `localStorage` y eso es por origen. Hay que avisarlo por correo
antes, no después.

### Lo que se decidió el 31 de agosto de 2026

- **El dominio final es `emilserios.com`.** Es el nombre de ella, tiene
  historial y enlaces, y es el dominio del buzón que aparece como `reply-to` en
  todos los correos de la academia. `contrabajoenlaciudad.com` es un nombre de
  producto, no de persona.
- **Todo vive en este repo.** Un repositorio, un despliegue, un dominio. La
  alternativa era mantener dos proyectos hablando con la misma base de datos, y
  eso duplica el mantenimiento para siempre a cambio de ahorrarse una mudanza
  una sola vez.
- **El aula hereda el sistema de diseño de este sitio**, no el de la academia.
  Si el aula parece un sitio distinto al público, la alumna nota la costura. La
  capa visual de la academia —paleta cálida, cursor de clave de fa, notas
  musicales de colores— **se guarda en el repo sin enchufar** por si Emi la
  quiere recuperar; no se borra.
- **Los cursos se abren enteros al comprar**, con acceso de por vida. Sin
  goteo por semanas.
- **Sin certificados.** Van a ser muchos cursos.
- **Progreso solo en los cursos**, no en la membresía. En la membresía no tiene
  sentido: el contenido desaparece igual.
- **Membresía y cursos van separados** de momento: sin paquete y sin descuento
  cruzado. El modelo de derechos de acceso lo soporta el día que se decida lo
  contrario; sería solo un precio distinto en Stripe.
- **Nada del WordPress viejo hace falta**, salvo el dominio y el correo. Los
  videos están en Vimeo de Emi, el orden de los cursos lo tiene ella, Tutor LMS
  lo maneja ella, Stripe está a su nombre y la newsletter es suya en Klaviyo.
  Eso redujo la pedida a Edu a la mitad.

---

## Arrancar

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # build de producción en ./dist
npm run preview  # sirve el build
npm run audit    # auditoría del diseño (necesita preview en marcha)
npm run audit:menu # contraste del menú de cristal (idem)
```

Astro 7, estático, sin framework de UI. No hace falta adaptador para Vercel.

---

## Cómo trabajamos

- **Un PR por cambio, siempre.** Por mínimo que sea, va en su propia rama y su
  propio Pull Request a `main`. Emi lo mergea, lo mira, ajustamos, y seguimos.
- **`main` no se toca directamente.** Solo recibió el commit inicial, porque sin
  él no existía base contra la que abrir un PR.
- **Siempre contra `main`, nunca encadenando PRs.** El PR #5 se abrió contra la
  rama del #4 «para que el diff se leyera solo». Esa rama ya estaba mergeada,
  así que el reapuntado automático de GitHub no podía ocurrir: al mergear el
  #5, su contenido fue a parar a una rama muerta y nunca llegó a `main`. Hubo
  que reabrirlo como #6. Un diff un poco más largo se lee sin problema; una
  rama muerta cuesta media hora y confunde a quien mergea.
- **Una rama con su PR ya mergeado está muerta: no se le añaden commits.** Es
  el mismo error del #5 por otra puerta, y volvió a pasar en el #14. Emi lo
  mergeó, luego pidió cambios, y los cambios se empujaron a *esa misma rama*.
  El `push` funcionó, GitHub no se quejó de nada y el PR siguió mergeado y
  cerrado: el trabajo no llegó a `main` y no se veía en ningún sitio. Lo cazó
  Emi, no yo. **Cuando llega feedback sobre algo ya mergeado, el trabajo nuevo
  arranca de `main` en una rama nueva y va en un PR nuevo** — así salió el #15.
  La señal de alarma es empujar a una rama y que el PR no muestre commits
  nuevos.
- **Antes de abrir un PR, comprobar de qué commit sale la rama.** Si `main` se
  ha movido, traerlo primero. A mitad de esta sesión se mergeó un PR que
  reescribía `progreso.md` entero y hubo que rehacer los cambios a mano sobre
  la estructura nueva.
- Este documento se actualiza **en el mismo PR** que introduce el cambio.

---

## El sistema de diseño

Viene de Claude Design, ya aprobado. Llegó como export `.dc.html` en tres
piezas: Sistema de Diseño, las dos páginas, y la animación de entrada.
**No se inventa nada fuera de esto.**

| | |
|---|---|
| Color | Papel `#FAFAF8`, tinta `#0D0D0D`, tinta secundaria, línea. Ningún otro **en la interfaz**; las fotografías traen el suyo. |
| Tipografía | Instrument Serif (titulares), Newsreader (cuerpo), IBM Plex Mono (etiquetas). La firma no es tipografía: es el logo. |
| Espaciado | Rejilla de 8 px. Sin excepciones. |
| Formas | Radios: cero. Sombras: cero. Las divisiones son reglas de 1 px. |
| Medida | 60–68 caracteres. Columna de 640 px, número marginal de 48 px. |
| Movimiento | Máximo cuatro animaciones en la Home, dos en el resto. |
| Prohibido | Marquesinas, contadores, cursores propios, texto que se escribe letra a letra, tarjetas que se levantan, zoom automático, iconos, emojis, fondos grises de relleno. |

Todo esto está en `src/styles/tokens.css`. **Ningún valor suelto en los
componentes**: si hace falta uno nuevo, se añade como token.

### Enmiendas, con fecha

El sistema es de Emi y se puede cambiar. Lo que no se puede es cambiarlo sin
dejar constancia, porque si no la tabla de arriba deja de ser fiable. Hasta hoy
se ha tocado seis veces:

- **31 ago 2026 · El radio y la sombra del menú valen para la cápsula de
  ingresar al aula.** La enmienda del 20 de agosto decía «solo para la cápsula
  del menú», y esto la amplía a un segundo objeto: el botón de arriba a la
  derecha del Aula Virtual. No es un permiso nuevo, es el mismo: son los dos
  únicos objetos del sitio que **flotan sobre la página** en vez de dividirla, y
  se parecen a propósito, porque son las dos cosas que se pueden pulsar sin
  haber bajado. Siguen siendo `--menu-radius` y `--menu-shadow`; `--radius` y
  `--shadow` siguen valiendo cero. Si aparece un tercer objeto flotante, entra
  aquí; cualquier cosa que **no flote** y quiera esquinas redondeadas es otra
  enmienda distinta.

- **20 ago 2026 · La cápsula del menú lleva esquinas redondeadas y sombra.**
  Las dos cosas están prohibidas en la tabla —«Radios: cero. Sombras: cero»— y
  las dos las pidió Emi con el sitio de referencia delante, después de ver una
  primera versión a escuadra. Valen **solo para la cápsula del menú**, que es
  un objeto que flota sobre la página y no una división de la página: por eso
  no arrastran al resto del sitio, que sigue a escuadra y sin sombras. Están
  como `--menu-radius` y `--menu-shadow`, separadas de `--radius` y `--shadow`,
  que siguen valiendo cero. Si alguna vez se quiere redondear algo más, es otra
  enmienda: estos dos tokens no son un permiso general.
- **20 ago 2026 · La apertura del menú no cuenta contra el tope de
  animaciones.** Es respuesta a una acción, de la misma familia que un `hover`,
  no movimiento ambiental — el mismo criterio que ya se aplicó al acuse de
  recibo del formulario. Las cuatro de la Home siguen siendo la entrada, las
  frases-ancla, el fondo del contrabajo y la lámina.

Y antes:

- **12 ago 2026 · El tope de la Home sube a cuatro animaciones.** Lo pide el
  revelado de la lámina. Las cuatro son ahora: la entrada, las frases-ancla, el
  fondo del contrabajo y la lámina. Tres de ellas van ligadas al scroll o a que
  algo entre en pantalla, no al reloj, así que nada se mueve solo: la página
  quieta está quieta. Ese es el límite real, más que el número — si alguna vez
  se propone una quinta, la pregunta no es cuántas hay sino si arranca sola.

Y antes, las dos del PR #4:

- **10 ago 2026 · Cae la prohibición de parallax; el tope sube a tres
  animaciones en la Home.** Lo pide el fondo del contrabajo. La prohibición
  existía contra el parallax de verdad —capas a distinta velocidad, que da
  tirones y marea— y eso sigue fuera: la imagen del fondo no se mueve ni un
  píxel. Lo que avanza con el scroll es un revelado, de la misma familia que el
  de las frases-ancla.
- **10 ago 2026 · «Ningún otro color» rige la interfaz, no las fotografías.**
  Una foto trae su color y cuenta como foto. Vale para el fondo del contrabajo
  y para el retrato y el video que están por llegar.

---

## Mapa del proyecto

```
src/
  assets/fonts/          Las tres familias en woff2 + OFL.txt
  assets/img/            contrabajo.webp, el fondo de la Home
                         emilse-madrid.jpg, la lámina de la Home
  components/
    Header.astro                   Cabecera: la firma centrada y el menú
    Footer · LangSwitch            Pie y conmutador ES/EN
    Logo.astro                     La firma de Emi, como máscara
    Intro.astro                    Animación de entrada (solo Home)
    Backdrop.astro                 El contrabajo tras el cristal (solo Home)
    Home.astro · About.astro       Los bloques de cada página
    Catalogo.astro                 La lista de productos del Aula Virtual
    Producto.astro                 La página de venta de un producto
    EmailArchive.astro             Fichas del newsletter + <dialog>
    SubscribeForm.astro            Campo de suscripción
    MediaSlot.astro                Hueco de imagen
  content/correos/       Un .md por correo y por idioma
  content.config.ts      Esquema del archivo del newsletter
  data/home.ts           Textos de la Home (es / en)
  data/about.ts          Textos de Sobre mí (es / en)
  data/aula.ts           El catálogo: los 7 productos y sus cartas (es / en)
  i18n/ui.ts             Cadenas de interfaz + mapa de rutas
  layouts/Base.astro     <head>, cabecera, pie, revelado de frases-ancla
  pages/                 index · sobre-mi · en/index · en/about
                         aulavirtual/index · aulavirtual/[producto]
                         en/classroom/index · en/classroom/[producto]
  styles/tokens.css      Los tokens del sistema
  styles/base.css        Reset y primitivas compartidas
public/logo.svg          La firma vectorizada. La usa Logo.astro de máscara
public/favicon.svg       La E del logo. Se adapta al tema del navegador
scripts/audit.mjs        Auditoría de contraste y rejilla
scripts/audit-menu.mjs   Contraste del menú de cristal, con el panel abierto
```

**Los textos no viven en los componentes.** Cambiar una frase es tocar
`src/data/` o `src/i18n/`, nunca maquetación.

---

## Recetas

### Publicar un correo del newsletter

Dejar caer dos ficheros en `src/content/correos/`, `043.es.md` y `043.en.md`:

```markdown
---
numero: 43
lang: es
etiqueta: "N.º 43"
asunto: El asunto del correo
adelanto: La línea que se lee en la ficha, antes de abrirlo…
---

El cuerpo, en Markdown.
```

No hay que tocar código. Se ordenan solos de mayor a menor. Quitar
`borrador: true` de los tres actuales cuando lleguen los correos de verdad.

### Poner un curso a la venta

Todo el catálogo del Aula Virtual sale de `src/data/aula.ts`. Un curso pasa de
«Próximamente» a estar a la venta cambiando su entrada:

1. `estado: 'venta'` en vez de `'proximamente'`.
2. El `nombre`, el `resumen` de una línea, el `precio` y la `cadencia` («pago
   único, acceso de por vida»), **en los dos idiomas**.
3. Una `pagina` con su `titulo`, su `entradilla` y sus `bloques` — hay cuatro
   clases: `prose`, `anchor`, `lista` y `faq`, y se combinan en el orden que
   pida la carta. La membresía sirve de ejemplo.
4. `comprarHref` con el enlace de pago de cada idioma.

Con eso, la ficha del catálogo se vuelve un enlace y `getStaticPaths` genera
`/aulavirtual/<slug>/` y `/en/classroom/<slug>/` sola. **No hay que tocar
ninguna página.** Si falta la `pagina`, el producto no se genera aunque esté en
`'venta'`: es la red que impide publicar un enlace a una carta que no existe.

### Poner una imagen donde hay un marco vacío

Las dos llamadas a `MediaSlot` ya existen en `About.astro`. Solo hay que
importar la imagen y añadirle `src` — el `placeholder` se queda, porque sigue
siendo el texto de respaldo:

```astro
import retrato from '../assets/img/retrato.jpg';

<MediaSlot src={retrato} alt={t('media.portraitAlt')} placeholder={t('media.portrait')} />
```

`MediaSlot` la sirve optimizada, en densidad 2x y en blanco y negro.

### Cambiar la foto de la lámina

La lámina es la foto de la Home, justo después del formulario. El fichero es
`src/assets/img/emilse-madrid.jpg`: **1536 × 948, a color**.

- **A color, aunque se vea en blanco y negro.** El gris lo pone el CSS, porque
  el revelado necesita el color debajo para poder devolverlo. Si se sube ya
  desaturada, el efecto no tiene de dónde sacarlo.
- **1536 px de ancho.** La lámina se presenta a 640 px CSS —la medida de
  lectura—, que en densidad 2 son 1280. Astro genera el 1× y el 2× (48 y
  165 kB en WebP); el original solo tiene que dar de sobra.
- **El encuadre no se toca.** Este lo recortó Emi: llega a 2048 × 1264 y solo
  se reescala. `aspect-ratio` en `Home.astro` vale exactamente lo que el
  fichero —`1536 / 948`— para que el marco no vuelva a recortar por su cuenta.
  **Si se cambia la foto por otra de proporción distinta, hay que cambiar ese
  `aspect-ratio` con ella**, o el marco la recorta en silencio.

El original está en el commit `d63b52b`, en `public/image_hero_3.png` (4,2 MB).
Se sacó de `public/` a propósito: ahí se servía en crudo al navegador, sin
pasar por el optimizador. Las dos fotos anteriores de la lámina siguen en el
historial: el retrato corto en `378eccb` (`public/image_hero.jpg`) y la de
cuerpo entero, vertical, en `58dd75c` (`public/image_hero_2.jpg`).

Para rehacerla desde el original:

```js
sharp(original)
  .resize({ width: 1536 })
  .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: '4:4:4' })
```

El texto del pie y el `alt` viven en `src/data/home.ts`, en el bloque `plate`.
El pie es el mismo en los dos idiomas; el `alt`, no.

### Subir o bajar el contrabajo del fondo

Los mandos están juntos en `src/styles/tokens.css`, y no hay que tocar nada
más. Lo que de verdad decide cuánta madera llega al papel es **la opacidad por
lo que deja pasar el cristal**: hoy `0,45 × 0,50 ≈ 22 %`.

```css
--bass-width       /* ancho de la banda izquierda */
--bass-opacity     /* cuánta imagen. El mando principal */
--bass-saturation  /* a esta opacidad queda poco color: se sube, no se baja */
--glass-veil       /* cuánto papel lleva el cristal */
--glass-blur       /* cuánto esmerila. Está en 1 px, y son píxeles CSS: en una
                      pantalla de densidad 2 valen el doble. Subirlo se lee
                      como mala resolución, no como cristal */
```

Para rehacer el fichero desde la foto original —está en el commit `fbff7e5`,
en `public/doublebass_background_ref.jpg`: **sin recortar**, escalar a 1200 px
de ancho, alfa = `smoothstep(0,10 → 0,38)` sobre la luminancia, **suavizar solo
el canal alfa** con un gaussiano de radio 4, y WebP con calidad 70 y alfa 40.
Son 184 kB.

Las dos cosas raras de esa receta tienen su porqué:

- **1200 px, no 700.** La banda mide 512 px CSS, que en una pantalla de
  densidad 2 son 1024 de dispositivo. A 700 la imagen se ampliaba 1,7× y se
  veía blanda justo en las pantallas buenas. A 1200 va a tamaño real en 2× y
  sobrada en 1×.
- **Se suaviza el alfa, no el color.** El mate es una silueta y no necesita
  detalle fino, pero su canal arrastraba toda la veta de la madera y era lo
  que disparaba el peso. Suavizándolo, el fichero pasa de ~900 kB a 184 sin
  que se note nada — casi el triple de píxeles que la versión de 700 por el
  mismo peso. El color va sin tocar, que es lo que da la sensación de nitidez.

El encuadre es el de la foto entera **a propósito**. Al principio se usó un
recorte cerrado sobre la efe y, aunque el efecto se entendía, parecía una
imagen de mala resolución. Al abrir el encuadre hay que subir la resolución,
no bajarla: se ve más campo y cada píxel de la foto rinde menos.

### Añadir una página

1. Añadirla al mapa `routes` de `src/i18n/ui.ts`, con su slug en cada idioma.
2. Crear los dos ficheros en `src/pages/` (español en la raíz, inglés bajo `en/`).
3. Pasarle `route="loQueSea"` al layout `Base`.

De ahí salen solos los enlaces, el `canonical` y las alternativas `hreflang`.

---

## Auditoría

`npm run audit` comprueba contraste WCAG AA, espaciados fuera de la rejilla de
8 px y animaciones declaradas. Se corre con `npm run preview` en marcha:

```bash
node scripts/audit.mjs http://localhost:4321/sobre-mi/ 390
```

Estado en las cuatro rutas, a 1440 y a 390 px de ancho, vuelto a pasar con la
lámina puesta:

```
CONTRASTE por debajo de AA .................. 0
ESPACIADOS fuera de la rejilla de 8 px ...... 0
CONTRASTE contra el fondo ya pintado ........ 0   (peor caso real, 13,4:1)
```

**La tercera comprobación existe por el fondo del contrabajo.** Las dos
primeras miran el `background-color` de los ancestros, y por ahí ese fondo no
aparece nunca: no lo pinta ningún ancestro, sino una capa fija por debajo de
todo. La nueva mide sobre los píxeles ya pintados — apaga el texto, fotografía
cada renglón dos veces (con el fondo y sin él) y solo juzga los píxeles que el
fondo cambia. Así las reglas de 1 px del diseño, que salen iguales en las dos
capturas, no cuentan como fondo de nada.

### La auditoría del menú

`npm run audit:menu` es la misma idea aplicada al panel del menú, que también
es translúcido y por el que también pasa la página. Abre el menú y mide sus
cuatro renglones sobre los tres fondos que existen: el bloque negro del cierre
—el peor caso—, una fotografía y papel liso.

```
peor caso de todos .......................... 4,83:1 ✓   (el cierre en negro)
```

Sirve además para **elegir el velo**: con `VELO=66% npm run audit:menu` se mide
sin tocar el token. Así se encontró el suelo, entre 62 % (4,37:1, por debajo de
AA) y 66 % (4,66:1).

**Sin el método de las dos capturas no hay medición posible.** El primer
intento buscaba los píxeles más oscuros del renglón y daba 1,00:1 en sitios
donde el texto es tinta plena sobre papel: lo más oscuro del renglón no era el
texto del menú, eran las letras de la página que se ven **a través** del
cristal. Solo apagando los glifos y comparando se separan las dos cosas.

Mide renglón a renglón, no la caja del bloque, y descarta el texto que existe
solo para el lector de pantalla: WCAG pide contraste a la «presentación visual
del texto», y eso no lo es.

Usa `sharp` para leer los píxeles. Está declarado en `devDependencies` — antes
solo llegaba como dependencia transitiva de Astro, que es como no tenerlo.

---

## Decisiones ya tomadas

Están discutidas y resueltas. No hace falta volver sobre ellas salvo que Emi
pida lo contrario. Las que tienen que ver con la plataforma —dominio, aula,
cursos, acceso— viven en **La plataforma**, más arriba, y no se repiten acá.

- **La tienda vive en `/aulavirtual/` y las cartas cuelgan de ella**, en
  `/aulavirtual/<slug>/`. Un solo recorrido: catálogo, producto, comprar. El
  slug de la sección se traduce —`/en/classroom/`— pero **el del producto no**:
  el slug es la identidad del producto, la misma que llevará su fila en la base
  de datos y la que Emi pegue en un correo. Un producto, un slug, dos idiomas.
  La membresía es `estudiemos-juntos`, que es su nombre, no `membresia`.

- **La ficha del catálogo es una fila, no una tarjeta.** El sistema prohíbe las
  tarjetas que se levantan y las sombras, así que lo que separa un producto del
  siguiente es una regla de 1 px, igual que la ficha de trayectoria de *Sobre
  mí*. La fila entera es la zona pulsable, no solo el nombre.

- **El botón de comprar es el único botón macizo del sitio.** Tinta llena, papel
  encima, sin radio y sin sombra. Se lo gana porque es el final del recorrido y
  no hay color de acento con el que destacarlo de otra manera. Aparece dos
  veces en la carta, arriba y al final: quien ya está decidido no debería tener
  que leerla entera para encontrar dónde pagar.

- **El botón de ingresar solo sale dentro del aula.** En la Home y en *Sobre mí*
  no pinta nada: quien llega ahí viene a leer. Y su corte responsive —56 rem—
  **está medido, no elegido**: la cápsula del menú va centrada y esta clavada al
  margen derecho, así que se acercan según crece la ventana. Con la etiqueta
  inglesa, la larga, a 832 px todavía se solapaban 4 px y a 864 quedaban 12; a
  56 rem hay 28 px de aire. Por debajo, la puerta se va dentro del panel del
  menú. Si cambia el texto del botón o el ancho de la cápsula, se vuelve a
  medir.

- **El menú vive en una cápsula de cristal, y la firma dejó de llevar a la
  portada.** Decisión de Emi, 20 ago 2026, con el sitio de «analogue» de
  referencia. La primera versión fue una barra a lo ancho con panel cuadrado, y
  Emi la devolvió: quería la cápsula flotante de la referencia, cristal de
  verdad y animación en los dos sentidos. Como la firma ya no es un enlace,
  **«Inicio» es la primera opción del panel**: si no, no habría forma de volver
  a la portada — el logo del pie tampoco enlaza.
- **La cabecera ya no es una barra, y eso arregla el marco negro.** Emi vio que
  «a veces se repasa de negro el marco superior». Había dos `backdrop-filter`
  anidados —uno en la barra, otro en el panel de dentro—, que es una receta
  conocida de artefactos de composición; y encima la barra muestreaba la
  entrada, un panel negro a pantalla completa con `z-index: 200`, mientras se
  desvanecía. Ahora la cabecera no tiene fondo, ni regla, ni filtro: solo
  coloca la cápsula, que es lo único que filtra en todo el sitio. **Emi
  confirmó el 20 ago 2026 que ya no se ve.** No llegó a reproducirse acá —es un
  artefacto de composición de la GPU y en un navegador sin pantalla no
  aparece—, así que la comprobación tuvo que hacerla ella en su máquina: de las
  dos causas probables no se supo nunca cuál era, solo que quitándolas las dos
  se acabó. Si alguna vez vuelve, el sitio donde mirar es el `backdrop-filter`
  de la cápsula contra la animación de entrada.
- **La cabecera no captura el ratón.** Sigue siendo una banda fija de lado a
  lado, pero transparente: sin `pointer-events: none` se comería los clics de
  toda la franja superior de la página. El `auto` se devuelve en la cápsula.
- **El velo del cristal se eligió midiendo, no a ojo.** Emi pidió que se viera
  transparente. Se barrió el valor con `npm run audit:menu` y el suelo está
  entre 62 % —4,37:1, por debajo de AA— y 66 % —4,66:1—. Quedó en **70 %**
  (4,83:1 en el peor caso), que deja margen sin ser opaco. Se pudo bajar tanto
  desde el 90 % de la primera versión porque **las opciones pasaron a tinta
  plena**: la página actual ya no se marca aclarando la letra, que es justo lo
  que hundía el contraste sobre cristal, sino con un fondo apenas insinuado.
- **Abrir y cerrar con animación pide JavaScript, pero no depende de él.** El
  `<details>` nativo quita su contenido de golpe: no hay salida que animar. El
  truco es interceptar el clic, no dejarle cerrar, animar, y poner
  `open = false` al terminar la transición. Para que eso no rompa el caso sin
  script, el elemento se marca con `data-js` **desde el propio script**: si no
  se ejecuta, esa marca no existe y el CSS se queda con la regla de `[open]`,
  que deja el menú abierto sin animación. Comprobado con `javaScriptEnabled:
  false`.
- **El alto se anima con `grid-template-rows` de `0fr` a `1fr`.** Es la única
  forma de llevar un alto automático a cero con transición sin medirlo en
  JavaScript.
- **`transitionend` burbujea, y eso costó el cierre.** La primera versión
  cerraba de golpe: el fundido del contenido dura 0,14 s, menos que el alto,
  terminaba antes, subía hasta el contenedor y disparaba el remate a mitad de
  la animación. Hay que mirar `event.target` **y** `event.propertyName`. Con
  red de seguridad por temporizador, porque en una pestaña de fondo el evento
  puede no llegar nunca.
- **La tinta secundaria del panel es otra, `--ink-soft-glass`.** El 58 % de
  siempre está calibrado contra el papel liso y sobre el cristal no llega a AA.
  Vale solo dentro de la cápsula. El conmutador de idioma lo hereda por
  `--lang-soft`, una variable que `LangSwitch` lee con la de siempre como
  respaldo: así el pie, que usa el mismo componente sobre papel, no se entera.
- **Debajo de la firma, o al lado, va la palabra «MENÚ».** Con la firma sola el
  sitio se queda **sin ninguna navegación visible**: nada indica que se abra. El
  sistema prohíbe iconos, así que la pista solo puede ser texto. Es lo que en la
  referencia hacen las dos etiquetas que flanquean el logotipo. La cápsula es
  una rejilla de tres columnas con las de fuera iguales, y por eso la firma cae
  en el centro exacto aunque la etiqueta esté solo a un lado.

- **Astro estático, sin framework de UI.** El sitio es de lectura: cero
  JavaScript por defecto. Si algún día hay zona de miembros o pagos, se
  reevalúa.
- **Tipografías autohospedadas y versionadas** en `src/assets/fonts`. El build
  no depende de la red y el navegador de quien lee no le pide nada a Google.
  Licencia OFL incluida, como exige redistribuirlas.
- **Sin `preload` de fuentes.** El atributo de Astro precarga *todas* las
  variantes de cada familia, incluidas `latin-ext` y las cursivas que las
  páginas no usan: eran 10 ficheros y ~560 kB antes del primer pixel. Las
  `@font-face` viajan en la hoja de estilos, que ya bloquea el render, así que
  el navegador las descubre igual de pronto y baja solo lo necesario.
- **Tinta secundaria al 58 %, no al 55 %.** El diseño la fija al 55 %, pero
  sobre el papel da 4,24:1 y no llega al 4,5:1 que pide WCAG AA para texto
  pequeño — y las etiquetas mono son de 12 px. Al 58 % da 4,68:1 y la
  diferencia no se ve.
- **Slug propio por idioma.** `/sobre-mi/` y `/en/about/`, no `/en/sobre-mi/`.
- **Nada que no funcione se publica enlazado.** El «Reproducir» del video está
  apagado a propósito, no roto, y los seis cursos por salir son fichas sin
  enlace. «Aula Virtual» estuvo apagada en el menú hasta el 31 ago 2026, que es
  cuando empezó a llevar a algún sitio.
- **Excepción consciente al tope de animaciones:** el acuse de recibo del
  formulario aparece con un fundido de 0,4 s. Es respuesta a una acción, de la
  misma familia que un `hover`, no movimiento ambiental. Está en el diseño
  original.
- **La firma es el logo, y se pinta como máscara.** `public/logo.svg` sobre
  `currentColor`, no un `<img>`: así el mismo fichero de 7,8 kB sirve en tinta
  sobre papel (cabecera y pie) y en papel sobre tinta (la entrada), se cachea
  una vez para todo el sitio y no infla el HTML. El nombre viaja en texto para
  el lector de pantalla, y es lo que queda si la máscara no carga. El alto lo
  fija quien lo usa con `--logo-height`, nunca por `style` en línea, que
  ganaría a cualquier media query.
- **El logo dice «Rios», sin tilde, y así se queda.** Decisión de Emi. La
  tilde vive en los textos —copias, `alt`, lo que oye un lector de pantalla,
  que siguen diciendo «Ríos»—, no en el trazo.
- **El favicon se saca por componente conexa, nunca recortando a ojo.** La E
  es una pieza suelta del dibujo y ocupa de x=1 a x=328; el primer intento la
  cortó en 235 y en la pestaña se veía un tajo vertical. Si algún día hay que
  rehacerlo: etiquetar las piezas del canal alfa, quedarse con la de la E, y
  centrar **su** caja de tinta en un lienzo cuadrado — el lienzo del trazado
  no vale, que lleva aire de sobra y descentra la letra.
- **Va sin los dos puntos** que acompañan a la E en la firma. A 32 px se
  convierten en motas y ensucian; la E sola aguanta mejor.
- **El favicon cambia de color con el tema del navegador.** Lleva un
  `prefers-color-scheme` dentro del propio SVG: tinta sobre barra clara, papel
  sobre barra oscura. En tinta sobre una pestaña oscura no se veía.
- **La entrada no usa `stroke-dashoffset`.** Era el plan mientras la firma fue
  texto, pero el logo vectorizado es un contorno relleno, no una línea central:
  dibujaría el perímetro de las letras y las rellenaría de golpe. En caligrafía
  enlazada eso queda peor. Se quedó el barrido, con el filo inclinado al ángulo
  de la letra: la firma no aparece, se escribe.
- **Los negros de la foto del fondo son transparentes.** Sin el mate, el fondo
  negro del estudio se convertía en una plancha gris a la izquierda — justo lo
  que el sistema prohíbe. Con él, el contrabajo emerge del papel y las efes se
  leen como un recorte.
- **El fondo se sirve sin pasar por el optimizador.** El fichero ya viene a la
  escala de pantalla (1200 px, mateado, 184 kB). Pasarlo por `getImage` solo lo
  recodificaría con el canal alfa sin pérdida y lo multiplicaría por tres.
- **Nunca escribir prefijos `-webkit-` a mano.** Poniendo `backdrop-filter` y
  `-webkit-backdrop-filter` juntos, el minificador las deduplica y se queda con
  la prefijada — que Chrome no reconoce. El cristal no esmeriló nada hasta que
  se detectó, y la imagen se veía en crudo. Los prefijos los pone el
  minificador según targets; escribir solo la forma sin prefijo.
- **Las imágenes decorativas se dimensionan para densidad 2, no para 1.** El
  fondo se sirvió primero a 700 px para una banda de 512 px CSS, que parecía
  de sobra — y en una pantalla de densidad 2 esa banda son 1024 de dispositivo,
  así que se ampliaba y se veía blanda precisamente en las mejores pantallas.
  Al comprobar cómo se ve algo, comprobarlo también a `deviceScaleFactor: 2`.
- **El desenfoque del cristal va sobre la imagen, no sobre el cristal.** Detrás
  del cristal solo hay la imagen y papel liso, así que el resultado es el
  mismo. Pero un `backdrop-filter` a pantalla completa se recalcula en cada
  fotograma —la máscara del revelado cambia con el scroll— y eso bajaba la Home
  de 60 a 20 fps. Medido: 16,7 ms por fotograma con el cristal quitado, 50 ms
  con él. Con el desenfoque en la banda, 16,7 ms.
- **La foto de Emi es una lámina, no un hero.** No va a pantalla completa: eso
  la pondría por encima del título y haría que la página fuera sobre ella y no
  sobre el newsletter, además de comerse el remate de la entrada, que es donde
  se escribe la firma. Y hace dos trabajos concretos: demuestra el título
  (contrabajo, calle, ciudad) y pone cara al «yo» que escribe, que en un
  newsletter en primera persona no es adorno.
- **El orden de la apertura es título → subtítulo → formulario → lámina, en
  columna.** Decisión de Emi, 13 ago 2026, después de probar la alternativa. La
  portada va centrada arriba; el formulario y la lámina siguen en la rejilla de
  lectura, uno debajo del otro. Nada en paralelo.
- **Se probó la apertura a dos columnas —párrafo a la izquierda, foto a la
  derecha— y no funcionó.** Está en el historial en el PR #12, y conviene saber
  por qué se deshizo antes de volver a proponerla: **la medida de lectura son
  640 px y no caben dos columnas útiles dentro**. Al ancho de la rejilla las
  columnas quedaban en 384 y 288 px, y ni el párrafo tenía medida ni la foto
  tamaño. Ensanchando la banda para que cupieran, se despegaba del resto de la
  página: a 1240 px el párrafo arrancaba en 160 y la foto terminaba en 1340,
  con todo lo demás entre 440 y 1080. No hay ancho que resuelva las dos cosas a
  la vez. **La lección es del ancho, no de la idea:** en esta rejilla, texto y
  foto en paralelo solo saldrían rompiendo la columna de lectura.
- **La portada va centrada y fuera de la rejilla de lectura.** El título, el
  subtítulo y el párrafo de entrada van centrados en la página, con el numeral
  `01` centrado encima en vez de al margen — el mismo patrón que ya usaban las
  frases-ancla y el cierre en negro para los momentos que no se leen en
  columna. Ojo con una cosa al medirlo: la columna de lectura **no** está
  centrada en la página, va 40 px a la derecha porque el numeral vive en el
  margen izquierdo. La portada sí está centrada en la página. Esos 40 px de
  diferencia son a propósito, no un descuadre: la portada no tiene numeral al
  margen del que colgar.
- **La lámina va dentro de la rejilla de lectura, a lo ancho de la columna.**
  Usa el mismo hueco de numeral vacío que el formulario, así que mide los
  640 px de la medida y queda alineada al píxel con los párrafos, con el pie y
  con la regla del formulario. Estuvo un paso fuera (900 px contra los 768 de
  la columna) como gesto editorial, y sobresalir de los márgenes no quedaba
  bien: la página tiene un borde de texto muy claro y la foto lo rompía.
- **Se descartó la tira de tres fotos al costado del texto.** Era la otra idea
  sobre la mesa: replicar el fondo del contrabajo a la izquierda y sacar tres
  fotos a la derecha con el scroll. No se hizo por cuatro razones, y las cuatro
  siguen en pie si vuelve a proponerse. Solo hay una foto, no tres, y tendrían
  que aguantar el mismo blanco y negro y la misma luz. El hueco a la derecha de
  la columna son 336 px a 1440, 256 a 1280 y nada por debajo de 1200, así que
  el efecto solo existiría en monitores grandes. Tres fotos a plena opacidad
  enfrente del fondo convierten la página en un pasillo simétrico y le quitan
  al contrabajo lo que lo hace funcionar, que es ser un fantasma al 22 %. Y
  *Sobre mí* ya es exactamente texto a la izquierda y retrato a la derecha: la
  Home haciendo lo mismo confunde las dos páginas.
- **Una horizontal puede llenar la columna; una vertical no.** Es la regla que
  decide el ancho de cualquier foto que entre en el flujo del texto. Una
  horizontal a los 640 px de la medida mide unos 400 de alto y se lee de un
  vistazo. Una vertical a esos mismos 640 mide 800: deja de ser una lámina y se
  convierte en una parada, porque hay que scrollear para verla entera. Y
  achicándola para que quepa, la cara se vuelve diminuta. Nunca los dos
  formatos mezclados en la misma tira.
- **La lámina es horizontal, y se llegó ahí por descarte.** El recorrido, para
  no repetirlo: primero un retrato corto horizontal; después una foto de cuerpo
  entero vertical, que obligó a achicarla a 416 px para que no fuera una parada
  y aun así no encajaba; luego esa misma vertical al lado del texto, que no
  cabía en la medida. Al final Emi recortó ella misma la foto de cuerpo entero
  a **1,62 horizontal** —cara grande, contrabajo entero, el portal con su
  voluta de latón— y con eso la lámina vuelve a lo que siempre funcionó: a lo
  ancho de la columna, después del formulario. **Si aparece otra foto vertical,
  el problema no es la foto: es que esta rejilla no tiene sitio para una.**
- **La lámina va en blanco y negro, y el color es lo que ocurre al pasarle el
  scroll por encima.** En color permanente entran la madera del contrabajo y el
  oro de la fachada, y la interfaz es estrictamente monocroma. Así el reposo de la
  página sigue siendo monocromo y el color es una recompensa, no un estado. El
  acercamiento que la acompaña va en una sola dirección, no de ida y vuelta:
  subiendo y bajando la foto respira, y eso se lee como un tic.
- **La lámina no lleva recorte aparte para móvil.** Lo hubo mientras fue una
  panorámica 2:1 con media calle vacía: a 342 px de ancho quedaba una tira de
  171 px y había que recortar por los lados. El encuadre de ahora lo eligió
  Emi y ya viene cerrado —1,62 en vez de 2—, así que en estrecho se mantiene
  entero. Volver a recortarlo por CSS sería deshacer su decisión.
- **El revelado se ancla a `cover 50%` con `view()`, y hay una regla detrás.**
  El tramo va referido al paso de la propia lámina por la ventana, así que se
  recoloca solo cada vez que la foto cambia de sitio o de tamaño — y ha
  cambiado cuatro veces.

  Eso vale **mientras la lámina viva por debajo del pliegue**, que es donde
  está. El 13 ago 2026 estuvo un rato en la primera pantalla, en la apertura a
  dos columnas, y ahí `view()` no puede cumplir la única condición que importa
  —llegar en blanco y negro—: sus puntos de anclaje se calculan restando el
  alto de la ventana, así que para un elemento de la primera pantalla caen en
  scroll negativo en cuanto la ventana pasa de unos 1050 px, y el navegador
  entra directo a mitad del tramo. Medido entonces: **65 % de color al cargar
  en una ventana de 1200**. La solución fue `scroll(root)` con el tramo en
  píxeles, y se deshizo con el resto de aquella maqueta.

  **La regla, por si vuelve a hacer falta:** una foto por debajo del pliegue va
  con `view()`, que se recoloca sola; una de la primera pantalla va con
  `scroll(root)`, que es lo único que garantiza el primer fotograma al cargar —
  es el mismo motivo por el que el fondo del contrabajo usa `scroll(root)`.

  Comprobado que llega en blanco y negro a 1440 × 900, 1440 × 1200,
  1920 × 1400, 1280 × 800, 900 × 1000 y 390 × 844.
- **Al medir el gris desde Playwright, cuidado con la notación científica.**
  A mitad de camino el filtro vale `grayscale(1.00929e-16)` —cero— y un
  `match(/[\d.]+/)` lee «1.00929» y hace pensar que la curva no es monótona.
  Capturar el paréntesis entero: `match(/grayscale\(([^)]+)\)/)`.
- **El recorte horizontal vive en `html`, no en `body`.** Con
  `overflow-x: hidden` en el `body`, su `overflow-y` pasa a `auto` por regla del
  propio CSS y el `body` se convierte en contenedor de scroll — uno que no
  scrollea nunca, porque quien scrollea es el documento. Cualquier animación
  atada a la posición de un elemento se engancha al contenedor más cercano,
  encontraba ese, y se quedaba congelada. En la raíz el recorte se propaga al
  viewport y no hay contenedor intermedio. Comprobado que no reaparece scroll
  horizontal en las cuatro rutas a 1440, 1280 y 390.
- **El marco de la lámina recorta con `clip`, no con `hidden`.** Misma trampa,
  un piso más abajo: los dos recortan igual lo que el acercamiento saca del
  marco, pero `hidden` crea contenedor de scroll y `clip` no. Con `hidden`, el
  revelado se ataba al marco en vez de al documento y se quedaba clavado a
  mitad de camino. **Regla general: si se pone un `overflow` para recortar y
  dentro hay algo ligado al scroll, tiene que ser `clip`.**
- **`animation-range` se escribe con un solo valor.** Puesto entero como
  `cover 50% exit 100%`, el minificador lo dejaba en `cover 50% exit 0%` — que
  no es lo mismo: el color entraba y salía en un cuarto del recorrido. El final
  que se quiere es justo el que toma por defecto, así que no nombrarlo lo deja
  fuera del alcance del minificador. Es de la misma familia que lo de
  `animation-timeline`, acá abajo, y conviene mirar el CSS ya construido
  —`grep animation-range dist/_astro/*.css`— antes de dar por bueno un
  revelado que «no va».
- **`animation-timeline` va en su propia regla**, separada del atajo
  `animation`. Juntas, el minificador las funde en `animation: … scroll(root)`,
  y la línea de tiempo dentro del atajo no la acepta ningún navegador: se caía
  la declaración entera y el fondo no animaba. Está comentado en
  `Backdrop.astro` para que nadie lo «arregle».

---

## Pendiente

### Bloquea el lanzamiento

- [ ] **Conectar Klaviyo.** El formulario valida y maqueta bien, pero **no da
      de alta a nadie**. Está resuelto para que no mienta — en producción y sin
      proveedor muestra un error honesto con una dirección a la que escribir,
      en vez de un «Listo» falso.

      **El proveedor ya se sabe: Emi usa Klaviyo** y la cuenta es suya
      (31 ago 2026). Falta enchufarlo. **Aviso para quien lo implemente:** no
      basta con poner `PUBLIC_NEWSLETTER_ENDPOINT`. El formulario hace un
      `POST` de `{ email }` en JSON desde el navegador, y la mayoría de
      proveedores no aceptan eso por CORS ni admiten exponer la clave en el
      cliente. Hace falta una función serverless en Vercel que reciba el correo
      y hable con la API de Klaviyo con la clave del lado del servidor — un
      `POST` a su API de perfiles. Hay que elegir además **a qué lista entra**
      quien se suscribe. Conviene contarlo antes de estimar.

- [ ] **Recuperar `emilserios.com`.** Emi le mandó a Edu la pedida completa el
      31 de agosto de 2026 — dominio, zona DNS, correo, hosting y Google, todo
      en un solo correo. **Esperando respuesta.** Es lo único del proyecto que
      depende de alguien de fuera, y es lo que más puede tardar. Los detalles y
      las tres trampas del traspaso están en **La plataforma → El dominio, y Edu**.

- [ ] **Decidir qué pasa con `contrabajoenlaciudad.com`.** Quedó abierto el
      31 ago 2026. El dominio principal es `emilserios.com`, ya decidido; falta
      saber si el otro se redirige, si se queda como marca de la newsletter, o
      si se suelta. **Mientras no se decida, `astro.config.mjs` sigue con
      `site: 'https://contrabajoenlaciudad.com'` y eso ya no es correcto**: de
      ahí salen el `<link rel="canonical">`, las URLs absolutas y el futuro
      sitemap. Cambiarlo es una línea, pero conviene hacerlo cuando se sepa el
      destino y en su propio PR.

### Contenido que falta (de Emi)

- [ ] **Retrato con el contrabajo**, en blanco y negro, para *Sobre mí*. Es
      distinto del de la Home: ahí ya está la foto de la calle, y repetirla en
      las dos páginas las aplana. Su hueco en *Sobre mí* es a 3/4.
- [ ] **Video «Viaje en el tiempo»** (2:41) y su fotograma.
- [ ] **Los tres correos reales.** Los N.º 40, 41 y 42 tienen asunto y adelanto
      de verdad, pero el cuerpo es de muestra — marcados `borrador: true`.
- [ ] **Los tres testimonios** de *Sobre mí*.
- [ ] **Enlaces reales de Instagram y YouTube.** Apuntan a las portadas.
- [ ] **El nombre, el precio y la carta de los 6 cursos.** Es lo que bloquea el
      catálogo: hoy las seis fichas dicen «Curso 1» a «Curso 6» y salen como
      «Próximamente», sin enlace, porque no hay nada a lo que enlazar. De cada
      uno hace falta el nombre, una línea de resumen, el precio y la carta de
      ventas. En cuanto lleguen se escriben en `src/data/aula.ts` y la página
      aparece sola. **Depende de que Emi haga su estrategia de venta**, que es
      lo que está esperando.

- [ ] **La estructura de los 4 cursos.** Para la fase 5: qué lecciones, en qué
      orden, con qué enlace de Vimeo y qué PDF. Lo tiene Emi, que maneja el
      Tutor LMS y el Vimeo directamente. Ojo con el número: el catálogo tiene
      **seis** huecos de curso y aquí se hablaba de **cuatro**. Hay que
      preguntarle a Emi cuántos son de verdad y ajustar el que sobre.
- [ ] **Los correos de quienes ya compraron un curso** (unas 5 personas), para
      concederles el acceso a mano en la plataforma nueva.

### Próximos PRs

- [ ] **Cierre para producción.** `sitemap.xml`, `robots.txt`, imagen de Open
      Graph, datos estructurados y página 404. Es el candidato natural al
      siguiente PR si el proveedor de correo sigue sin decidirse.
- [ ] **Comprobación de tipos en el build.** Hoy Astro transpila sin verificar:
      un error de tipos no rompe el despliegue, pero tampoco avisa. Añadir
      `@astrojs/check` y un `npm run check`.
- [ ] **Mudar el código de la membresía a este repo.** El repositorio ya está
      localizado y leído entero (`aguacateconqueso-projects/emilse_rios_membresias`,
      31 ago 2026) — ver **La plataforma → El código de la membresía, ya leído**.
      Es el siguiente paso real y no depende de Edu. Empieza por la migración de
      derechos de acceso, que es una función y no siete migraciones.

- [x] **Aula Virtual, la fachada.** Hecho el 31 ago 2026: el catálogo con los
      siete productos, la carta de la membresía, el botón de comprar y la puerta
      de ingresar, en los dos idiomas. Sin backend. La opción del menú dejó de
      estar apagada. Ver **La plataforma → La tienda, y el recorrido de compra**.

- [ ] **Que el botón de comprar cobre en casa.** Hoy «Comprar» y «Ingresar»
      llevan a `emilseriosacademy.com`, que es donde el cobro y el aula
      funcionan. Las dos direcciones salen de `ACADEMIA`, una sola constante en
      `src/data/aula.ts`: cuando el pago viva acá se cambia ahí y nada más.

- [ ] **PayPal para los cursos.** Decidido el 31 ago 2026 que la membresía se
      queda solo en Stripe y PayPal entra únicamente como pago único de cursos.
      Va detrás de los derechos de acceso: es otro valor de `source` escribiendo
      en la misma tabla.

- [ ] **Ponerle marco al hilo privado de los cursos.** Cuánto se compromete
      Emi a responder. Con 5 alumnas no urge, pero **hay que decidirlo antes de
      vender**: después de vender ya no se puede cambiar sin quedar mal. Aunque
      sea un «respondo en 72 h laborables» escrito en la página del curso.

- [ ] **Preguntarle a Emi por el IVA.** Stripe Tax está apagado. Que su
      contadora lo declare y que Stripe lo *cobre* son cosas distintas: si está
      apagado, el IVA del país del comprador sale del margen de Emi sin que se
      note. La pregunta exacta es «¿el IVA lo estamos añadiendo al precio o lo
      estamos absorbiendo?».

- [ ] **La casilla de renuncia al desistimiento** en el checkout de los cursos.
      En la UE hay 14 días de devolución en contenido digital salvo que el
      comprador renuncie expresamente marcándola. Sin ella, cualquiera puede ver
      el curso entero y pedir el dinero de vuelta el día 13.

- [ ] **Decidir dónde vive la carta de ventas de la academia.** Hoy está
      escondida y Emi la ofrece por enlace directo desde su newsletter. Al
      fusionar hay que elegir su URL dentro de `emilserios.com` y mantenerla
      `noindex`. Pendiente de confirmar con Emi.

---

## Notas sueltas

- El sitio **no lleva analítica ni cookies**. Si se añade algo, hay que poner
  aviso y revisar la nota legal.
- **Se maqueta con el español**, que es el texto más largo. El inglés entra en
  las mismas cajas sin ajustar nada.
- Sin JavaScript no se pierde contenido: las frases-ancla quedan visibles y el
  panel negro de la entrada no llega a aparecer.
- La entrada se reproduce **una vez por sesión** (`sessionStorage`). Para
  volver a verla, abrir una ventana nueva o borrar la clave `cec_intro`.
- El fondo del contrabajo **solo está en la Home**, y se enciende con la prop
  `backdrop` del layout `Base`. En *Sobre mí* no va: ahí manda el retrato.
- La lámina **se queda quieta y en blanco y negro** si el navegador no soporta
  `animation-timeline: view()` o si hay `prefers-reduced-motion`. No se pierde
  nada: el blanco y negro es el estado de reposo, no un paso intermedio.
- El papel lo pinta `html`, no `body`. Tiene que seguir así: el fondo vive en
  una capa con `z-index: -1`, y si `body` recupera su color se la come.
