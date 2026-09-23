# Progreso — Contrabajo en la Ciudad

Sitio de **Emilse Ríos**, contrabajista y docente. Su newsletter, su aula, su
membresía y sus cursos. Este documento es la memoria del proyecto: quien lo lea
de cero debería poder seguir trabajando sin preguntar nada.

**Última actualización:** 23 de septiembre de 2026.

> **🚧 LA CORTINA ESTÁ BAJADA desde el 23 sep 2026.** Quien entra a
> `www.emilserios.com` —a cualquier dirección— ve solo la firma de Emi sobre
> negro y «Estamos trabajando en la web», y no puede hacer nada: las APIs
> contestan 503. **Las vistas previas de los PRs y `npm run dev` siguen
> enseñando la web de verdad**, que es donde se trabaja. Para reabrir,
> `CORTINA_BAJADA = false` en `src/lib/cortina.ts`, en un PR. Todo en **La
> cortina**, justo debajo de **Dónde estamos**.

> **🔗 REGLA DE TRABAJO (pedida por Adrián el 23 sep 2026): cada vez que se
> sube un cambio, se le deja el enlace directo para verlo** —a la página
> exacta que cambió, en la vista previa de la rama, no «mira el PR»—. Adrián
> no encontraba las vistas previas, y una vez estuvo mirando la de una rama
> vieja buscando cambios que estaban en otra. Mientras se trabaje en la rama
> `claude/youthful-meitner-21x8ys`, la raíz es siempre esta:
>
> **https://emilse-rios-webv2-git-claude-y-2c57cd-adrians-projects-594b3131.vercel.app**
>
> y se le añade la ruta: `/sobre-mi/`, `/en/products/`… Con otra rama, la
> raíz cambia: sale en el comentario de **vercel[bot]** del PR, fila
> `emilse-rios-webv2`, enlace **Preview** (desde la sesión se lee con las
> herramientas de GitHub, pidiendo los comentarios del PR). Vercel tarda un
> par de minutos en construir después de cada push. Ver **La cortina → Cómo
> se sigue viendo la web**.

> **Para quien retome en una sesión nueva (23 sep 2026, por la tarde).** Con
> la cortina bajada se está terminando la web detrás. Ese día entraron en
> `main` tres PRs, los tres probados y mergeados:
>
> - **#42 · La cortina.** Ver **La cortina**.
> - **#43 · «Productos» pasa a «Formaciones»** (en inglés «Courses»), con su
>   entrada nueva, y **la carta de la membresía reescrita entera**, con cinco
>   testimonios. Ver **Formaciones, y la carta nueva**.
> - **#44 · Las direcciones viejas**, que con barra final daban 404. Ver **Las
>   direcciones viejas**.
>
> Y por la tarde, dos más:
>
> - **#46 · El newsletter deja de fallar en silencio.** Ver **El newsletter,
>   conectado → La primera prueba**.
> - **#47 · Cinco retoques que pidió Adrián:** la Home entra con la escalera
>   de *Sobre mí* al volver, «Te cuento otra cosa» baja a abrir la historia,
>   Formaciones pierde el `00` y sus fotos se acercan y toman color con el
>   cursor, y *Sobre mí* estrena retrato. Ver **Cinco retoques del 23 de
>   septiembre**.
> - **Y siete más, al final de la tarde:** el menú del sitio llega a la carta
>   de la membresía y a la pantalla de acceso, el aula se entra directo con
>   correo y contraseña, *Sobre mí* cambia otra vez de retrato —ahora
>   horizontal— y Formaciones estrena tres cursos con nombre, texto y foto.
>   Ver **Siete cambios de la tarde del 23 de septiembre**.
>
> **Lo que viene, en el orden en que lo pidieron Adrián y Emi:**
>
> 1. **El newsletter todavía no da de alta** («suscribirse no funciona»). El
>    código está en `main` desde el 22 sep, ya con la API `2026-07-15`; lo que
>    falta es de paneles, en este orden:
>    1. **Klaviyo → Custom Key** con escritura sobre **Lists, Profiles y
>       Subscriptions**. Si ya había una clave hecha con la guía vieja, se
>       edita para añadir *Subscriptions*. ✅ Hecho (Adrián, 23 sep).
>    2. **Vercel → `KLAVIYO_API_KEY`** en Production **y Preview**, y
>       **redesplegar**. ✅ La variable está puesta (Adrián, 23 sep). **Solo
>       esa:** `KLAVIYO_LIST_ID` y `KLAVIYO_REVISION` no se crean, sus valores
>       buenos ya van en el código.
>    3. **Comprobar:** un alta de prueba y el correo dentro de la lista
>       `SaE8Px`. ⏸️ **Aplazado a propósito, por decisión de Adrián (23
>       sep):** se prueba **todo junto, al subir la cortina**, cuando Emi
>       tenga montada la bienvenida de siete correos —el punto 2—. Así un
>       solo correo de prueba comprueba el alta **y** la serie. La primera
>       prueba, en una vista previa vieja, dijo que no, casi seguro porque ese
>       build era de antes de la clave; el #46 dejó el fallo con rastro en los
>       logs. Ver **El newsletter, conectado → La primera prueba**.
>    4. **Klaviyo → apagar WooCommerce**, mirando antes los flujos. Y decidir
>       con Emi la doble confirmación (recomendada).
> 2. **La bienvenida pasa a ser de siete correos** a cada persona que se
>    suscribe. Es un flujo de Klaviyo —una serie que dispara el alta a la
>    lista—, no código, y los textos los tiene Emi. Lo que sí es código: la Home
>    promete «un correo de bienvenida con un video» (`src/data/home.ts`), y eso
>    hay que alinearlo con la serie nueva.
> 3. **El resto de copies nuevos de Emi.** Ya entraron Formaciones y la carta;
>    faltan los demás, que manda ella. Y cuatro decisiones de la carta que
>    quedaron abiertas: ver **Pendiente → Contenido que falta (de Emi)**.
> 4. **Subir la cortina:** `CORTINA_BAJADA = false` en `src/lib/cortina.ts`,
>    en un PR. **Y ahí va la prueba del newsletter**, la que quedó aplazada.
>    Lo mejor es hacerla **en la vista previa de ese mismo PR, antes de
>    mergear**: las vistas previas nunca tienen cortina y ya leen la clave
>    (Adrián marcó Production y Preview). Si algo falla, se arregla sin que la
>    web esté abierta con un formulario roto. Los pasos:
>    1. abrir `/api/suscribir` en la vista previa → `{"proveedor":true}`;
>    2. suscribir un correo de prueba de verdad;
>    3. verlo en Klaviyo, en la lista `SaE8Px` (pendiente si hay doble
>       confirmación, hasta pulsar el enlace);
>    4. que llegue el primero de los siete correos;
>    5. si dice que no, buscar `[klaviyo]` en Vercel → Logs: la tabla de
>       `docs/CONECTAR-KLAVIYO.md` dice qué es cada línea.
>
>    Si se prefiere probar ya en `www.emilserios.com`, que sea lo primero
>    después de mergear: son dos minutos.
>
> Y una comprobación que no depende de la cortina y nadie ha hecho todavía:
> `curl -sI https://www.emilserios.com/aulavirtual/estudiemos-juntos/` tiene
> que dar `301` hacia `/productos/estudiemos-juntos/` (el arreglo del #44). La
> sesión del 23 sep no tenía salida a `emilserios.com` y no pudo mirarlo.
>
> **Para ver lo que se hace mientras tanto:** la vista previa de Vercel de cada
> rama. Ver **La cortina → Cómo se sigue viendo la web**.
>
> **El correo de Emi funciona**, en las dos direcciones y a la bandeja de
> entrada (Adrián, 22 sep). Queda solo mirar la línea `DKIM:` en «Mostrar
> original» para cerrar lo de los CNAME proxied.

**EL AULA ESTÁ CONECTADA Y SE ENTRA** (22 sep 2026). Adrián entró con su cuenta contra el
Supabase de siempre: variables, Redirect URLs, sesión y candado de pago
funcionan de punta a punta. **No hubo que crear ni migrar nada** — el esquema es
el de la academia, el mismo proyecto.

**Y al final del día, Klaviyo.** A Emi le llegó un aviso —«Klaviyo ya no puede
conectarse a WooCommerce»— y al revisarlo salieron **dos fallos en el alta al
newsletter que habrían dejado a la gente sin apuntar**: la clave pedía dos
permisos donde hacen falta tres, y la versión de la API se retira el 15 de
octubre. Los dos están corregidos; el aviso se apaga, no se arregla. Ver **El
newsletter, conectado → La corrección del mismo día**.

Fue un día largo, y estas cinco cosas se movieron, de la última a la primera:

| | |
|---|---|
| **El aula** | Conectada y probada. El portero pide sesión **y suscripción al día** — antes bastaba con la sesión, y eso dejaba entrar a quien canceló hace seis meses. |
| **El newsletter** | «Acá te suscribes» ya da de alta de verdad, contra Klaviyo desde el servidor. Hasta hoy **no apuntaba a nadie**. |
| **El cobro** | Vive en `www.emilserios.com`. El botón de comprar dejó de salir del sitio, y quien paga pone su contraseña y entra en el mismo clic. |
| **La sesión** | Puesto el puente que la trae desde la academia, para que nadie tenga que recordar su contraseña al mudarse. |
| **El sitio** | (21 sep) Salió al aire en su dominio y dejó de enseñar huecos. |

**Lo que falta, y nada de ello es código:**

1. **`supabase/set_admin.sql`**, para que Emi y Adrián sean admin. Antes,
   comprobar cuál es el correo real de Emi.
2. **`KLAVIYO_API_KEY`** en Vercel, o el newsletter no da de alta. **Con tres
   permisos de escritura: Lists, Profiles y Subscriptions** — sin el tercero,
   Klaviyo contesta 403. Y apagar la integración de WooCommerce en Klaviyo.
3. **Pegar el puente** en el repo de la academia, y el correo de aviso.

Está todo en `docs/CONECTAR-EL-AULA.md`, `docs/CONECTAR-KLAVIYO.md` y
`docs/UNIR-LAS-DOS-CASAS.md`.

⚠️ **Y dos cosas siguen a medias desde antes:** los CNAME de correo siguen
proxied y el dominio sigue registrado en la cuenta de Namecheap de Edu. **Lo del
correo pesa menos de lo que parecía:** el 22 sep 2026 Adrián y Emi se
escribieron y todo llegó a la bandeja de entrada, en las dos direcciones. Ver
**Los CNAME de correo quedaron PROXIED → La prueba del 22 de septiembre**.

⚠️ **El webhook de Stripe sigue viviendo en la academia a propósito**, así que
`emilseriosacademy.com` **no se redirige todavía**: un 301 ahí deja a alguien
pagando sin recibir acceso.

---

## Dónde estamos

| | |
|---|---|
| **Publicado** | Sí, en Vercel, y desde el 21 sep 2026 **en `www.emilserios.com`**. Despliega solo en cada merge a `main`. **Desde el 23 sep, tapado por la cortina** — ver **La cortina**. |
| **Dominio** | **Resuelto a medias.** El sitio ya vive en `www.emilserios.com` y el DNS lo sirve Cloudflare. **Falta el push del registro** a una cuenta de Namecheap de Emi: hoy el dominio sigue siendo de Edu. Ver **El dominio, y Edu → Cómo quedó**. |
| **Páginas** | Home, Sobre mí, Formaciones —hasta el 23 sep 2026 se llamó Productos—, el Aula Virtual —puerta y aula por dentro— y sus pantallas de acceso, en español e inglés. Más `/panel/`, la consola de Emi, solo en español. |
| **Identidad** | El logo de Emi, vectorizado, en cabecera, pie, entrada y favicon. |
| **Alcance** | Desde el 31 ago 2026 esto deja de ser solo el sitio: aquí van también el aula, la membresía y los cursos. Ver **La plataforma**. |
| **Sesión** | **Conectada y probada el 22 sep 2026**: se entra de verdad, contra el **mismo Supabase de la academia**, y el candado pide **suscripción al día**. Las variables y las Redirect URLs ya están puestas. Falta `set_admin.sql`. Ver `docs/CONECTAR-EL-AULA.md`. |
| **Cobro** | **Desde el 22 sep 2026 vive acá.** `/api/checkout` crea la sesión de Stripe, `/gracias/` recoge a quien pagó y `/api/claim-account` le crea la cuenta. El **webhook sigue en la academia**, y es correcto que siga: ver **La unión de las dos casas**. |
| **Newsletter** | **Conectado desde el 22 sep 2026.** `/api/suscribir` da de alta en la lista real de Klaviyo (`SaE8Px`), con la API en su versión `2026-07-15`. `KLAVIYO_API_KEY` **puesta en Vercel el 23 sep 2026**, con los permisos Lists, Profiles y Subscriptions; **la prueba se hace al subir la cortina**, junto con la bienvenida de siete correos —ver **El newsletter, conectado → La primera prueba**—. La integración de WooCommerce de Klaviyo está muerta desde el 21 sep y **se apaga**: los cobros son de Stripe. |
| **Lo que falta para lanzar** | **Dos variables en Vercel, y ninguna es código:** `KLAVIYO_API_KEY` o el newsletter no da de alta, y las de Stripe o el botón de comprar da un 500. |

Rutas vivas: `/` · `/en/` · `/sobre-mi/` · `/en/about/` · `/productos/` ·
`/en/products/` · `/productos/estudiemos-juntos/` ·
`/en/products/estudiemos-juntos/` · `/aulavirtual/entrar/` ·
`/en/classroom/signin/`. **`/aulavirtual/` y `/en/classroom/` ya no son
páginas** desde el 23 sep 2026: redirigen a la pantalla de acceso.

Y el aula por dentro: `/aulavirtual/escritorio/` · `/aulavirtual/curso/<slug>/` ·
`/en/classroom/desk/` · `/en/classroom/course/<slug>/`. Van con `noindex` y
**desde el 20 sep 2026 piden sesión** — salvo si faltan las variables de
Supabase, y entonces se dejan mirar y lo avisan en pantalla. **El contenido
sigue siendo de muestra**: la maqueta ya tiene puerta, pero detrás no hay
todavía ni un video de verdad. Las direcciones viejas —`…/panel/`— redirigen:
esa palabra quedó reservada para la consola de Emi.

Y las de la puerta, nuevas del mismo día: `/aulavirtual/entrar/` ·
`/aulavirtual/nueva-clave/` · `/aulavirtual/salir/` con sus gemelas
`/en/classroom/signin/` · `/en/classroom/new-password/` ·
`/en/classroom/signout/`, más **`/panel/`**, la consola de Emi, solo en
español.

Las dos direcciones viejas de la carta de la membresía
—`/aulavirtual/estudiemos-juntos/` y su gemela inglesa— **siguen funcionando**:
redirigen a la nueva. Están puestas en `astro.config.mjs` y salen del propio
catálogo, así que valen para cualquier producto que se publique.

**Lo último, el 22 de septiembre de 2026: empezó la unión de las dos casas.**
Ya hay dominio, así que la pregunta dejó de ser «cuándo» y pasó a ser «en qué
orden». Lo pidió Adrián con el orden ya puesto —«primero el link activo de los
productos y después conectar supabase para que la membresía siga funcionando
como si nada»— y así se hizo. Tiene su sección entera más abajo: **La unión de
las dos casas**. En corto:

- **El cobro se mudó.** `/api/checkout`, `/gracias/` y `/api/claim-account` son
  rutas de esta casa. El botón de la carta ya no saca a la lectora del sitio a
  mitad de una compra, y quien paga **pone su contraseña y entra en el mismo
  clic**, sin esperar ningún correo.
- **El webhook NO se mudó, y es la decisión que sostiene todo lo demás.** Un
  webhook no tiene dominio: Stripe llama a la dirección que tenga apuntada, y la
  de la academia escribe en el MISMO Supabase con un `UPSERT`. Dejarlo ahí
  significa **cero cambios en el panel de Stripe** y el correo de bienvenida
  intacto, que sale por Resend con el dominio de la academia verificado —
  `emilserios.com` todavía no puede mandar correo, su DKIM sigue roto.
- **El puente de traspaso está puesto.** `/aulavirtual/pasar/` recibe la sesión
  que la alumna trae desde la academia y la planta acá. Es el paso 1 de las tres
  capas que este documento dejó decididas el 11 de septiembre, y lo que hace que
  volver a entrar cueste un clic y no una contraseña olvidada.
- **Lo que falta no es código.** Copiar cuatro variables de Stripe a Vercel,
  añadir dos Redirect URLs en Supabase y pegar una página en el repo de la
  academia. Paso a paso en `docs/UNIR-LAS-DOS-CASAS.md`.

**Antes de eso, el 21 de septiembre de 2026 por la
tarde,** se hicieron seis cosas que Emi y Adrián pidieron de una vez. Ninguna es
grande; juntas cambian lo que el sitio dice de sí mismo, que hasta esa tarde
era «esto todavía se está montando»:

- **La lámina de la Home cambia de foto, y ahora es vertical.** Es Emi en la
  calle, de cuerpo entero, sosteniendo el contrabajo en horizontal delante de un
  portal de madera. El fichero es `src/assets/img/emilse-hero.jpg` y sale del
  original de 3572 × 5368 que estaba subido en `public/` desde el 19 de
  septiembre — el que este documento venía marcando como peso muerto. La lámina
  se queda donde estaba, con su pie, su blanco y negro y su revelado al bajar;
  lo único que cambia es la proporción del marco y un tope de ancho para que una
  vertical no se coma la pantalla. Ver **Recetas → Cambiar la foto de la
  lámina**.
- **El pie se queda sin redes.** Instagram y YouTube enlazaban a la portada de
  cada plataforma, no a las cuentas de Emi. Vuelven cuando haya direcciones de
  verdad.
- **_Sobre mí_ entra con movimiento y responde al cursor.** La página aparecía
  de golpe, con el titular ya puesto. Ahora los renglones suben y se funden en
  escalera al cargar, los párrafos se revelan al bajar como los del resto del
  sitio, y el retrato **toma color y se levanta ocho píxeles al pasarle el
  cursor por encima**. Trajo una enmienda al sistema, anotada más abajo.
- **El arranque de *Sobre mí* es un solo bloque.** «No puedo. / No es mi caso. /
  Te cuento otra cosa» estaba en un bloque de prosa aparte, debajo del de
  entrada; son el remate de la frase de los 150 billones y ahora se leen pegados
  a ella, al lado del retrato.
- **«Qué dicen mis alumnos» sale de la página, y queda pendiente.** Estaban los
  tres huecos en cursiva diciendo «testimonio pendiente». Emi manda los de
  verdad y vuelve: el tipo, el componente y el CSS siguen puestos, así que
  volver es escribir el bloque en `src/data/about.ts` y nada más.
- **Productos anuncia un curso, no seis.** La membresía y **un** «Curso 1 ·
  Próximamente». Los otros cinco eran el mismo hueco repetido cinco veces, que
  no anuncia cinco cursos: anuncia que la tienda está vacía.

**Lo que está en marcha ahora mismo** es la plataforma, y el 19 de septiembre
de 2026 se movieron tres cosas a la vez:

- **Edu está contestando, y ahora sí se mueve.** El dominio no está donde
  creíamos —es **Namecheap**, y en Hostinger solo el hosting—, y su primera
  propuesta, mudar el hosting antes que nada, **es la que rompe el correo de
  Emi**. En su segunda respuesta ofrece **acceso de colaborador en Hostinger** y
  **delegar el DNS a Cloudflare**, que son las dos cosas buenas. Queda una
  llamada de 30 min con cuatro datos que sacar. Todo en **El dominio, y Edu**.
- **Llegó la forma real del primer curso**: tres niveles de 4, 5 y 3 clases,
  **un solo producto**, y los videos **ya están todos en Bunny** — la migración
  desde Vimeo está terminada. No cambia el modelo, pero sí **el vocabulario**:
  lo que Emi llama «módulo» es un video, o sea lo que el proyecto llamaba
  lección. Ya está corregido en el código. Ver **El primer curso, y las
  palabras**.
- **Se decidió el master panel de Emi**: ella maneja sola cursos, tienda,
  cartas, personas y accesos; nosotros mantenemos el código y el diseño. La
  línea exacta entre una cosa y otra, y las cinco capas en las que se construye,
  están en **El panel de Emi**.

Lo último que se hizo, el 9 sep 2026, fue **trasplantar la carta de venta de la
membresía**: la página a la que lleva la ficha de la membresía en Productos ya no
se pinta con el sistema de este sitio, sino que es el fichero de la academia
traído entero —crema, Hanken Grotesk, cursor de clave de fa, notas musicales,
botones de tinta que crecen desde el cursor—. Lo pidió Emi con el kit
`docs/PORTAR-CARTA-DE-VENTAS.md` delante. Es una excepción de una sola ruta,
anotada como enmienda al sistema de diseño, y la versión en blanco y negro sigue
escrita debajo por si se quiere volver. Está contado en **La carta
trasplantada**. ⚠️ Ojo con una consecuencia: la carta trae también **las puertas
de la membresía**, y hoy están cerradas hasta el 1 de octubre, así que el botón
de comprar aparece apagado — igual que en la academia.

Y antes de eso: **la tienda abrió, y desde el 9 sep 2026 tiene página
propia**. Se llama **Productos**, vive en `/productos/` y `/en/products/`, y en
ella están los siete productos, la carta de venta de la membresía y el botón de
comprar, que hoy lleva al cobro que ya funciona en la academia. Sin base de
datos, sin webhook y sin tocar nada de lo que está cobrando. Es **La tienda, y
el recorrido de compra**, más abajo.

**El Aula Virtual dejó de ser la tienda.** Es lo que se compra, así que ahora
está detrás del inicio de sesión, igual que la membresía: `/aulavirtual/` ya no
enseña el catálogo, es una puerta con el botón de ingresar y un enlace a la
tienda para quien todavía no ha comprado nada. La sesión de verdad sigue siendo
la de la academia — acá no hay sesión todavía —, así que el botón sale del sitio
y la página lo dice. (Eso se quedó atrás dos veces: la sesión vive acá desde el
20 sep 2026 y **el cobro desde el 22**. Lo que sigue en la academia es el aula
de la membresía, los videos semanales.)

Del sitio en sí, lo último que se tocó fue **el menú**. La cabecera dejó de ser
una barra: ahora es una cápsula de cristal que flota sobre la página, con la
firma de Emi en el centro y la palabra «MENÚ» al lado. Al pulsarla crece hacia
abajo y descubre Inicio, Sobre mí, Productos, Aula Virtual y el conmutador de
idioma, que
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

## La cortina

**Bajada el 23 de septiembre de 2026**, a pedido de Adrián: «tenemos que
desconectar la web». Emi está cambiando muchas cosas a la vez —todos los
copies, y la bienvenida del newsletter, que ahora quiere que sean **siete
correos a cada persona que se suscribe**—, el alta al newsletter todavía no
funciona, y una web en la que se pulsa «suscribirme» y no pasa nada es peor que
una que dice honestamente que está en obras. Se baja para pasar el día
terminando el resto.

**Qué ve la gente.** En cualquier dirección de `www.emilserios.com` —la Home,
*Sobre mí*, la tienda, la carta de la membresía, el aula, `/gracias/`,
`/panel/`— la misma pantalla: la entrada de la Home que no se levanta. La firma
de Emi se escribe en papel sobre tinta, y debajo «Estamos trabajando en la
web.», «Volvemos muy pronto». Sale en los dos idiomas: el de la dirección en
grande (`/en/…` en inglés) y el otro debajo, pequeño, porque no hay conmutador.
**No hay nada que pulsar**: ni menú, ni pie, ni enlaces. Las tres rutas de
servidor —`/api/suscribir`, `/api/checkout`, `/api/claim-account`— contestan
**503** sin tocar Klaviyo, Stripe ni Supabase.

**Solo en producción.** La cortina baja cuando `VERCEL_ENV === 'production'`,
así que **las vistas previas de cada PR enseñan la web de verdad**: se sigue
trabajando y revisando como siempre, y lo que se mergea a `main` queda detrás
de la cortina hasta que se suba. En local, `npm run dev` también enseña la web;
para ver la cortina, `CORTINA=1 npm run dev`.

**Cómo está hecha, en corto.** El sitio es estático: Vercel sirve cada página
como un fichero y no pasa por el servidor. Por eso la cortina se pone **en el
build**: `src/middleware.ts` corre una vez por página al generarla y le escribe
dentro la cortina (`next('/cortina')`, una reescritura: la dirección se queda,
el contenido cambia). La página es `src/pages/cortina.astro` y lee el idioma de
`Astro.originPathname`, la dirección de antes de reescribir. Los textos, en
`src/data/cortina.ts`.

**Para subirla:** `CORTINA_BAJADA = false` en `src/lib/cortina.ts`, en un PR, y
mergear. Hay además una salida de emergencia sin código —`CORTINA=0` en las
variables de Vercel y redesplegar—, pero la manera normal es el PR, para que el
código diga la verdad sobre lo que está en el aire.

Tres cosas que conviene saber:

- **Tapando la Home no lleva `noindex`**, a propósito: eso le pediría a Google
  que olvide la Home, y la cortina es cosa de días. Las páginas contestan 200
  —son ficheros, no pueden contestar 503—, así que si Google pasa estos días
  puede guardar «Estamos trabajando» como texto de la Home; se corrige solo en
  la siguiente visita después de subirla. `/cortina/`, en su propia dirección,
  sí lleva `noindex`.
- **Lo que cobra no se entera.** La membresía sigue viva en
  `emilseriosacademy.com`, y el webhook de Stripe vive allí. Lo único que pasa
  por esta casa y queda tapado es el cobro nuevo —con las puertas cerradas
  hasta el 1 oct, el botón ya estaba apagado— y el puente `/aulavirtual/pasar/`,
  que todavía no tiene su mitad pegada en la academia.
- **Las redirecciones viejas siguen funcionando**, y llevan a la cortina:
  `.vercel/output/config.json` sale idéntico con la cortina bajada y subida.

### Cómo se sigue viendo la web

Hasta la cortina, Emi revisaba en producción: mergeaba, miraba
`emilserios.com` y pedía ajustes. Con la cortina bajada eso ya no sirve, y lo
que lo reemplaza son **las vistas previas de Vercel**, que enseñan la web sin
cortina porque ahí `VERCEL_ENV` vale `preview`:

- **Cada PR tiene la suya**: el bot de Vercel la deja en un comentario del PR
  («Preview»). Enseña `main` más los cambios de ese PR.
- **Cada rama tiene además una dirección fija**, que siempre apunta a su
  último push:
  `emilse-rios-webv2-git-<rama>-adrians-projects-594b3131.vercel.app` (Vercel
  acorta los nombres largos con un código). Una sesión que trabaja siempre en
  la misma rama tiene, por tanto, un solo enlace para todo el día.

**Cómo se abre, paso a paso** (Adrián preguntó el 23 sep 2026 y no estaba
escrito):

- **Desde GitHub, lo más corto:** abrir el PR → pestaña **Conversation** →
  bajar hasta el comentario de **vercel[bot]**, que es una tabla con los dos
  proyectos → en la fila de `emilse-rios-webv2`, columna *Actions*, el enlace
  **Preview**. (No dice «Visit Preview», como se escribió aquí al principio.)
  Un PR ya mergeado conserva el comentario y el enlace sigue funcionando.
- **Ojo con abrir la de otra rama.** Cada rama tiene su dirección, y la de una
  rama vieja enseña esa rama, no la última. El 23 sep 2026 Adrián miraba la de
  `claude/busy-heisenberg-2ig8dt` (`…-git-claude-b-bc8959-…`) buscando los
  cambios del PR #47, que estaban en la de `claude/youthful-meitner-21x8ys`
  (`…-git-claude-y-2c57cd-…`). Lo más seguro es entrar siempre desde el
  comentario del PR.
- **Desde Vercel:** el proyecto → **Deployments** → buscar la rama en la
  columna de la rama (o filtrar por ella) → pulsar el despliegue → **Visit**.
  El de arriba del todo es el último push.

Tres cosas que muerden, y ninguna se pudo comprobar desde la sesión, porque
no tenía salida a `vercel.app`:

- **Si la vista previa pide entrar en Vercel, Emi no puede verla.** Opciones:
  el botón **Share** de la barra de Vercel sobre la vista previa, que genera un
  enlace para compartir, o apagar la protección en **Settings → Deployment
  Protection → Vercel Authentication**. Vercel les pone `noindex` a las vistas
  previas igual.
- **Las vistas previas leen las variables de «Preview», no las de
  «Production».** Si `KLAVIYO_API_KEY` o las de Supabase están solo en
  Production, en la vista previa el formulario del newsletter avisa de que no
  está conectado y el aula no deja entrar.
- **Hay dos proyectos de Vercel construyendo este mismo repo**:
  `emilse-rios-webv2` y `emilse-rios-webv2_1`, así que cada PR sale con dos
  vistas previas. No se sabe cuál tiene el dominio; el segundo parece un
  duplicado y conviene revisarlo —y borrarlo, si sobra— para no pagar dos
  builds ni confundir variables.

---

## Siete cambios de la tarde del 23 de septiembre

Los pidió Adrián de una vez, después del #47, y van en un solo PR. Todos se
ven en la vista previa de la rama —la raíz está en la regla de arriba del
todo—.

1. **El menú está siempre, también en la carta de la membresía.** Quien
   entraba a la membresía desde Formaciones «entraba en la nada misma»: la
   carta es un documento aparte, trasplantado de la academia con su propia
   ropa, y su única navegación era una píldora con ES/EN y «Entrar». Ahora
   lleva la cápsula del menú de todo el sitio, marcando «Formaciones», con la
   cápsula de «Ingresar al aula» a la derecha como en Formaciones. La píldora
   salió. El idioma vive dentro del menú y **sigue conservando el sitio de
   la lectura** al cambiar, como lo hacía la píldora.

   **Cómo se hizo, porque no es obvio:** la carta no puede cargar `tokens.css`
   ni `base.css` —le pisarían el fondo crema y la tipografía— y la base de la
   academia que sí carga define su propio `--space-2` (8 px y no 16) y un
   `a:hover` que subraya. Así que la cabecera va dentro de
   `src/components/CabeceraSuelta.astro`, que le da, **solo dentro del
   envoltorio**, los tokens y las dos clases (`.mono`, `.visually-hidden`)
   que necesita. `--paper` y `--ink` se heredan de la página, así que el
   cristal es de la misma crema cálida que la carta. ⚠️ **Esos tokens están
   copiados de `tokens.css`**: si allí cambian, hay que cambiarlos allá.
2. **El mismo menú, en la pantalla de acceso al aula** (`layouts/Acceso.astro`,
   que sirve a entrar y a la contraseña nueva). No lo pidió con esas
   palabras, pero es la misma regla —«el menú tiene que estar siempre
   presente»— y con el punto 3 se volvió imprescindible: «Aula virtual» trae
   directo acá, y sin menú era un callejón. El enlace del pie que decía
   «Aula Virtual» —y que ahora llevaría a esta misma pantalla— pasa a
   «Inicio».
3. **El aula se entra directo con correo y contraseña.** Se borró la portada
   —`/aulavirtual/` y `/en/classroom/`, con `components/Aula.astro` y sus
   textos `aula.*`—, que presentaba el aula y tenía un botón hacia el
   acceso. El menú, el pie y el «¿Ya compraste?» de Formaciones van directo
   a `/aulavirtual/entrar/`. Las dos direcciones viejas **redirigen** al
   acceso, para los enlaces que haya fuera (`astro.config.mjs`; lo comprueba
   `npm run audit:redirecciones`, que ya pasa las 32). Quien tiene la sesión
   abierta no se queda en el acceso: la pantalla lo pasa al escritorio, como
   siempre. `puertaPath` —la puerta— es ahora el acceso, así que al salir del
   aula se vuelve ahí.
4. **Otro retrato en *Sobre mí*, y este es el bueno:** la versión horizontal
   de la foto de la calle —`about_me3`—. El marco sigue igual: la foto llena
   el alto y se recorta por los lados, centrada, que es donde está Emi.
5. **Curso 1 ya tiene nombre: «Todo el diapasón»** («Fingerboard» en
   inglés), con el texto de la portada de Emi: «De posición 1 al pulgar, sin
   miedo…», y que incluye el curso completo «Todas las escalas (sin
   aburrirte)».
6. **Curso 2: «Contrabajo desde cero»** («Double Bass from Scratch»).
7. **Curso 3: «Tu vibrato como un cantante»** («Your Vibrato Like a
   Singer»). Su portada llegó solo en español: **el inglés es traducción
   nuestra** y conviene que Emi lo mire.

Sobre los cursos:

- **Siguen «Próximamente»**: sin precio, sin carta de ventas y sin página,
  así que su ficha no es un enlace. Lo que cambió es que ya no son huecos:
  tienen nombre, texto y foto. Salen de `proximo()` en `src/data/aula.ts`.
- **Los textos salen de las portadas de Emi**, casi palabra por palabra. Lo
  único que se tocó: en la del vibrato, «a través del contrabajo» salía dos
  veces —arriba y abajo de la portada, donde se leen por separado— y en una
  línea se queda una.
- **Las fotos.** Adrián subió cinco ficheros a `public/img/`: `course_1`,
  `course_1ok`, `course_2`, `course_3` y `about_me3`. **`course_1` y
  `course_2` eran idénticas byte a byte** —el contrabajo tumbado en la
  escalinata, que es la portada de «Contrabajo desde cero»—, y `course_1ok`
  es la corrección: la mano sobre el contrabajo, que es la de «Todo el
  diapasón». Se usaron `course_1ok`, `course_2` y `course_3`, reducidas a
  1400 px en `src/assets/img/curso-*.jpg`, y los cinco originales se
  borraron de `public/` (siguen en el historial de git).
- **El hover de las fotos pasó a todas las fichas**, también a las de
  «Próximamente». En el #47 era solo en las que son enlace; con las tres
  fotos nuevas, eso dejaba quietas tres de cuatro. En esas la flecha sigue
  siendo la normal y no hay nada que invite a pulsar.
- **Los slugs siguen siendo `curso-01`, `curso-02`, `curso-03`.** No se ven en
  ninguna dirección todavía, y `curso-01` es el que usa el curso de muestra
  del aula. Cuando salgan a la venta es el momento de ponerles uno que se lea.
- Con cuatro fichas en tres columnas, la cuarta queda sola en su fila. Es lo
  esperado; con el siguiente curso se completa.

## Cinco retoques del 23 de septiembre

Los pidió Adrián de una vez, con la cortina bajada, y van en un solo PR. Se
ven en su vista previa.

1. **La Home entra al volver.** La firma sobre negro sale una vez por sesión;
   las demás veces la portada aparecía de golpe. Ahora entra con la escalera
   de *Sobre mí*: el titular, el rótulo, la entradilla, el párrafo del video y
   el primer formulario, uno detrás de otro. Está en `Home.astro`, y lo decide
   `data-intro='seen'`, que pone el script de `<head>` de `Base.astro`. Por qué
   no cuenta como quinta animación: en **Enmiendas, con fecha**.
2. **«Te cuento otra cosa» baja.** Cerraba la entrada de *Sobre mí*, al lado
   del retrato, y ahora abre la historia, encima de «En mi primer día…». En
   los dos idiomas —en inglés, «Let me tell you something else»—. Es
   `src/data/about.ts`. Deshace a medias lo del 21 sep, que había subido las
   tres frases a la entrada: «No puedo» y «No es mi caso» se quedan arriba.
3. **Formaciones pierde el `00`** de encima del titular. En su lugar, 16 px de
   aire, para que el titular no suba a pegarse a la píldora del menú: se queda
   exactamente donde estaba. Los números de las fichas —`01`, `02`— siguen.
4. **Las fotos de Formaciones responden al cursor:** toman color y se acercan
   un 4 % dentro de su marco. El detalle, en la enmienda del mismo día.
   (Empezó solo en las fichas que son enlace; horas después, con las fotos
   de los tres cursos, pasó a todas. Ver **Siete cambios de la tarde**.)
5. **Retrato nuevo en *Sobre mí*.** ⚠️ **Duró unas horas:** esa misma tarde
   Adrián subió la versión horizontal de la misma foto, y es la que se
   queda. Ver **Siete cambios de la tarde**. Lo de abajo sigue valiendo
   para el marco. Emi en la calle, abrazada al contrabajo y
   lanzando un beso. Es **vertical**, y el marco sigue siendo el de siempre:
   lo llena a lo ancho y se recorta arriba y abajo, anclado al 35 % de alto
   para que la cara y la mano salgan en los tres tamaños.

   Dos cosas que conviene saber:

   - **El marco ya no lo puede estirar la foto.** Con la horizontal no pasaba
     nada, pero la vertical, a su alto natural, llevaba el marco a 720 × 1080
     en el escritorio y a 390 × 586 en el teléfono. Ahora la foto va colgada
     del marco (`position: absolute`), y el marco mide lo que medía: el alto
     del texto de al lado en el escritorio, 336 px de alto en el teléfono.
   - **El fichero.** Adrián la subió a `public/img/about_me2.jpg`: 3993 ×
     6002 y 8,3 MB, que Vercel habría servido tal cual a quien pidiera la
     dirección. Se redujo a 1800 de ancho —lo que pide el sitio a doble
     densidad— y reemplaza a `src/assets/img/about-me.jpg`, que es de donde
     Astro saca los tamaños: 96 kB y 218 kB en WebP. El original se borró de
     `public/`; sigue en el historial de git, en el commit `7984abd`, y la
     foto horizontal de antes, en cualquier commit anterior. El texto
     alternativo se reescribió para la foto nueva.

## Formaciones, y la carta nueva

**23 de septiembre de 2026, con la cortina bajada.** Es el primer cambio de
los que Emi mandó ese día; llegó entero, con el copy en los dos idiomas.

**«Productos» pasa a llamarse «Formaciones»**, y en inglés **«Courses»**: en el
menú, en el pie, en el título de la pestaña, en «Volver a…» de la carta y en
la consola de Emi. La página estrena entrada: «Tú también puedes lograrlo», el
párrafo de las historias —la profesora que odiaba las escalas, el vibrato de
cabra— y «No necesitas un talento innato ni una edad específica. Solo
constancia.». Está en `src/i18n/ui.ts` (`products.heading`, `products.lead`,
`products.close`).

**La dirección NO cambió, a propósito:** sigue siendo `/productos/` y
`/en/products/`. `/productos/estudiemos-juntos/` está pegada en correos de Emi,
y renombrar la ruta obliga a redirigir las viejas —y el día que el nombre
vuelva a cambiar, otra vez—. Si se quiere `/formaciones/`, es una línea en
`routes` de `src/i18n/ui.ts` más las redirecciones en `astro.config.mjs`.

Ojo con esas redirecciones: hasta el 23 sep 2026 las que genera Astro para
Vercel no aceptaban la barra final, y `/aulavirtual/estudiemos-juntos/` daba
404. Se arregló en el PR #44 —ver **Las direcciones viejas**— y
`npm run audit:redirecciones` lo comprueba antes de mover ninguna dirección.

**La carta de la membresía se reescribió entera** (`src/components/membresia/Carta.astro`),
con **cinco testimonios**: Magdalena, Mario, Laura, Sergio y Paloma. La ropa
es la misma —crema, botones de tinta, notas, la tarjeta de precio que se
invierte, la FAQ—; cambian el texto y, con él, qué bloques hay:

- **Salieron**, porque no están en el copy nuevo: el video de un minuto, el
  tema del mes (septiembre, flexibilidad de la muñeca), la historia de 2016,
  los tres descubrimientos, la posdata, «Mucho para muchos» y la línea
  «Cancela cuando quieras» de la tarjeta. La pregunta «¿Puedo pagar en mi
  moneda?» también salió de la FAQ.
- **El cuerpo es ahora una lista de bloques**, `t.carta`: un texto suelto es
  un párrafo, y el resto dice qué es —`fuerte`, `grito`, `acento`,
  `testimonio`, `lista`—. Cambiar la carta es tocar texto, no maquetación.
- **ES y EN tienen que tener los mismos bloques en el mismo orden.** El cambio
  de idioma de la píldora se ancla al bloque por su posición; hoy son 54 hijos
  de `.page` en los dos.
- **La presentación de cada testimonio va en el párrafo de antes, nunca
  dentro de la cita.** En el inglés que mandó Emi venía pegada a la cita, y en
  el español de Magdalena quedaba «Lo corté y pegué tal cual:» dentro de las
  comillas; las dos se sacaron al párrafo de presentación.
- **Los «para ti» y «no es para ti» dejaron de ir lado a lado:** en el copy
  nuevo los separan un testimonio y un párrafo, así que cada recuadro va solo,
  a lo ancho de la columna.
- **La apertura ya no va forzada en una línea.** «Siete tomos de un método no
  te preparan…» es el doble de larga que la anterior y se salía de la columna.

La versión en blanco y negro de la carta, en `src/data/aula.ts`, **no se tocó**:
no se ve —la membresía lleva `cartaPropia: true`— y sigue con el copy viejo.

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
crear un subdominio. Ese tercero es Edu, **y el 19 de septiembre de 2026
contestó**. Recuperar ese control es lo que destraba la fusión.

### El dominio, y Edu

**Edu contestó el 19 de septiembre de 2026**, y lo primero que hace su respuesta
es corregir un dato que este documento daba por bueno:

> «En este momento el dominio lo tenemos con **Namecheap** y el hosting con
> **Hostinger**. Mudar el hosting es sencillo porque solo tendría que eliminar
> la página del mío y se habilita en el tuyo. Podemos hacer eso primero y luego
> el dominio.»

`emilserios.com` **no está registrado en Hostinger**, como decía acá hasta hoy.
Está en **Namecheap**; en Hostinger solo está el alojamiento del WordPress. Son
dos casas distintas y eso cambia las dos vías del traspaso:

- **Vía preferente, y es la buena:** el **push entre cuentas de Namecheap**
  —«transfer to another Namecheap user»—. Es el equivalente exacto de lo que
  aquí se había planeado para hPanel: instantáneo, gratis, sin código EPP, sin
  espera, y **sin salir del registrador**, así que no dispara el bloqueo ICANN
  de 60 días que sí dispara un traspaso entre registradores. Hace falta que Emi
  tenga una cuenta de Namecheap y que Edu sepa su usuario. (Confirmar el nombre
  exacto de la opción en el panel de él; la mecánica es esa.)
- **Vía alterna:** código de autorización (EPP) + quitar el bloqueo, y traspaso
  a otro registrador. Tarda hasta cinco días y deja el dominio bloqueado 60 días
  después. Solo si el push no se puede.

#### Su propuesta es correcta en la intención y peligrosa en el orden

Edu ofrece hacer el hosting primero y el dominio después. **Hay que decirle que
no, y por qué.** Tres razones, y las tres muerden:

1. **«Eliminar la página del mío» apaga el plan de Hostinger, y con él
   probablemente el correo.** Ya estaba apuntado acá como trampa y su propuesta
   la pisa de frente: si `info@emilserios.com` es el correo incluido del plan de
   Hostinger, borrar el hosting borra el buzón. Y ese buzón es el `reply-to` de
   **todos** los correos de la academia, y el canal de rescate el día que toda
   la membresía tenga que volver a iniciar sesión.
2. **No queremos el hosting.** Ya está decidido —«nada del WordPress viejo hace
   falta, salvo el dominio y el correo»— y sigue en pie: el sitio nuevo vive en
   Vercel. Mudar el WordPress a un Hostinger de Emi es pagar y mantener durante
   meses un sitio que vamos a tirar. **El hosting no se muda: se apaga, y al
   final.**
3. **Apagar el hosting puede llevarse el DNS por delante, no solo la web.** El
   dominio está en Namecheap, pero la **zona** puede estar en Hostinger. Si los
   nameservers apuntan a Hostinger, borrar el plan deja el dominio sin zona:
   cae la web, cae el correo y caen los subdominios, aunque el registro siga
   intacto en Namecheap. Registrador y zona DNS son cosas distintas y pueden
   vivir en casas distintas — y acá, aparentemente, viven en casas distintas.

#### La comprobación que hay que hacer antes que nada

**A qué nameservers apunta hoy `emilserios.com`.** Es un minuto y decide todo lo
demás:

| Si apunta a… | La zona vive en | Borrar el hosting… |
|---|---|---|
| `dns1.registrar-servers.com` · `dns2…` | Namecheap (BasicDNS) | no toca el DNS |
| `ns1.dns-parking.com` · `ns2…` | **Hostinger** | **se lleva el DNS entero** |
| Otros (Cloudflare, etc.) | Ese tercero | hay que preguntarle a Edu quién es |

✅ **Resuelto el 21 sep 2026, y por la vía de arriba:** la zona se migró a
Cloudflare y los nameservers en Namecheap pasaron a `anna.ns.cloudflare.com` y
`clay.ns.cloudflare.com`. Sea cual fuera la respuesta original, **ya no importa**:
el día que Edu borre el hosting, el DNS no depende de él. Ver **Cómo quedó**,
más abajo.

#### La segunda respuesta, del 21 sep 2026

Contestó otra vez, y ofrece dos cosas:

> «Si quieres dame como 30 min y lo vemos, creo es más fácil si te agrego como
> **colaborador dentro de Hostinger**.»
>
> «El dominio, ¿tienes los **DNS de Cloud**? Me gusta esa opción porque como ya
> está en Hostinger entonces no hay un cambio como tal, sino que ya es tema
> interno de propiedades.»

**Las dos son buenas y las dos se aceptan.** El acceso de colaborador es lo
mejor que ha ofrecido hasta ahora: deja de hacer falta preguntarle cómo está
montado, porque se ve. Y Cloudflare es exactamente la ruta que este documento ya
señalaba como la útil si él solo diera una cosa.

⚠️ **Pero su frase mezcla dos cosas que no son la misma**, y conviene no
heredarle la confusión:

| | Qué es | Dónde está | Qué lo mueve |
|---|---|---|---|
| **El registro** | De quién **es** el dominio | Namecheap, cuenta de Edu | El push a una cuenta de Emi |
| **La zona DNS** | Quién **responde** las consultas | Por confirmar | Cambiar los nameservers |

Delegar el DNS a Cloudflare arregla lo técnico —y lo arregla del todo: el día
que Edu borre el hosting, el DNS ya no depende de él—, **pero no cambia de quién
es el dominio**. Eso sigue en su cuenta de Namecheap hasta que se haga el push.
«No hay un cambio como tal» vale para el hosting; para el registro, no.

Mientras el dominio esté en la cuenta de otro, Emi está a una renovación no
pagada de perder su propio nombre. No es urgencia del mismo día, pero es lo que
cierra el tema.

⚠️ **La cuenta de Cloudflare la abre Emi (o Adrián por ella), nunca Edu.** Si la
abre él, no se ha ganado nada: se cambia una dependencia por otra.

#### Los cuatro datos que tiene que dar la llamada

La llamada se hizo el 21 sep 2026 y resolvió tres de los cuatro:

1. ✅ **A qué nameservers apunta `emilserios.com`.** Ya no importa: apunta a
   Cloudflare, `anna` y `clay`.
2. ✅ **Dónde vive `info@emilserios.com`.** En **Hostinger**, y ahí se queda por
   ahora. Sigue sin saberse **cuántos buzones hay y quién los paga** — y eso
   último importa el día que Edu deje de pagar el plan.
3. ✅ **La zona DNS entera.** Está en Cloudflare, en 11 registros, replicada y
   funcionando.
4. ❌ **El listado de URLs publicadas.** **Sigue sin pedirse, y ahora urge
   más**: el WordPress viejo ya no se ve —el `www` apunta a Vercel— pero los
   ficheros siguen en el hosting de Edu. Esa lista son las direcciones que la
   gente tiene guardadas y que Google tiene indexadas, y **se pierde para
   siempre** el día que él borre el sitio. Hoy cada enlace viejo cae en un 404.

Y dos cuidados al migrar la zona a Cloudflare:

- **Revisar los MX y los TXT a mano, registro por registro.** Cloudflare importa
  lo que encuentra al añadir el dominio, pero no siempre los detecta todos — y
  justo los de correo son los que más duelen. Se compara contra lo que pase Edu
  **antes** de cambiar los nameservers, no después.
- **Cuando se apunte a Vercel, esos registros van en DNS only** (nube gris), no
  proxied. Cloudflare por delante de Vercel da problemas de certificado y de
  caché. Los MX no se proxean nunca, de todos modos.

#### El orden correcto, que es el suyo al revés

```
1  ✅ Edu dice a QUÉ NAMESERVERS apunta el dominio y DÓNDE vive
      info@emilserios.com — falta cuántos buzones hay y quién los paga
2  ✅ Edu exporta la ZONA DNS entera
3  ⏭️  Se decide dónde vive el correo y SE MUDA
      → NO SE HIZO. El correo se quedó en Hostinger, donde estaba.
4  ⏭️  Edu hace el PUSH del dominio a la cuenta de Namecheap de Emi
      → NO SE HIZO. El dominio sigue en la cuenta de Edu.
5  ✅ Se delegan los nameservers a Cloudflare
      → hecho, pero ojo: la cuenta de Cloudflare es de Adrián/Edu, NO de Emi
6  ✅ emilserios.com apunta a Vercel — el sitio está en el aire
7  ⛔ Edu borra el hosting — SIGUE SIENDO EL ÚLTIMO PASO, y sigue sin hacerse
```

**Se saltaron el 3 y el 4, a propósito, para poder publicar el sitio el mismo
día.** Eso no es un error —el orden existía para proteger el correo, y el correo
no se tocó— pero **deja dos deudas abiertas** que hay que cerrar antes de dejar
que Edu apague nada: el dominio sigue siendo suyo (paso 4) y el buzón de Emi
sigue en su plan de Hostinger (paso 3). **Mientras esas dos sigan abiertas, el
paso 7 no se puede dar.**

**Lo que sí conviene aceptarle ya**: una copia del sitio (ficheros + base de
datos) y **el listado de URLs publicadas**. No para levantarlo en ningún lado,
sino para los 301: son las direcciones que la gente tiene guardadas y que Google
tiene indexadas. Sin esa lista, cada enlace viejo cae en un 404 el día del
cambio, y esa lista se pierde para siempre en cuanto él borre el sitio.

**Lo que hay que pedirle explícitamente: que no borre nada todavía.** Es la
única parte de su respuesta que urge contestar.

Del resto de la pedida del 31 de agosto siguen sin respuesta los puntos 5
(Search Console y Analytics), 6 (otros servicios colgados del dominio) y 7 (una
fecha de corte y estar localizable ese día).

#### Las trampas, actualizadas

- **El correo antes que nada.** Se resuelve primero, siempre. No es negociable
  y ahora tiene nombre propio: la primera frase de Edu es una oferta de borrarlo
  sin saberlo.
- **Mover el dominio no mueve el DNS.** La zona se replica **antes** de delegar,
  nunca después.
- **El contacto del titular, al final.** Con el push dentro de Namecheap se
  esquiva el bloqueo de 60 días de los traspasos entre registradores, pero
  **cambiar el registrante puede activar su propio bloqueo de 60 días**. Si hay
  que cambiar el contacto, que sea lo último de todo.
- Si Edu solo diera **una** cosa, la útil sigue siendo la misma: delegar los
  nameservers a Cloudflare bajo una cuenta de Emi. Dos minutos por su parte, el
  dominio sigue donde está, y a partir de ahí el DNS se controla desde acá para
  siempre.

#### Cómo quedó, el 21 de septiembre de 2026

**El sitio está en el aire en `www.emilserios.com`.** Lo hicieron Adrián y Edu
juntos, en una sesión.

| | |
|---|---|
| **Registro** | Namecheap, **todavía en la cuenta de Edu**. Adrián tiene acceso. El push a una cuenta de Emi **sigue pendiente**. |
| **Zona DNS** | **Cloudflare.** Nameservers: `anna.ns.cloudflare.com` · `clay.ns.cloudflare.com`. |
| **Web** | Vercel. `www.emilserios.com` sirve el sitio; el ápice `emilserios.com` hace un **308 hacia www**, así que el canónico es **con `www`**. |
| **Correo** | **Sigue en Hostinger, intacto.** Lo único que se mudó es el DNS. |

Los dos registros que apuntan a Vercel, los dos **CNAME y en DNS only**:

```
@     CNAME   1c3acc4056a0b8e9.vercel-dns-017.com    (DNS only)
www   CNAME   1c3acc4056a0b8e9.vercel-dns-017.com    (DNS only)
```

Tres cosas que conviene saber de ese bloque, porque no son obvias:

- **Vercel ya no da una sola IP para todos.** Da un host por proyecto, y ese
  `1c3acc4056...vercel-dns-017.com` es el de este. Los valores viejos
  —`cname.vercel-dns.com`, `76.76.21.21`— siguen funcionando, pero **el valor
  bueno se lee siempre del panel de Vercel**, en «View DNS configuration», no
  de ninguna guía.
- **Sí, hay un CNAME en el ápice, y sí, convive con los MX.** Normalmente eso
  es ilegal en DNS. Funciona porque Cloudflare hace *CNAME flattening*: guarda
  el CNAME y al responder devuelve las IPs ya resueltas, así que los MX y los
  TXT de `emilserios.com` se sirven con total normalidad. **Es la razón por la
  que Cloudflare era el lugar correcto para esto.**
- **Los dos en gris, no negociable.** Con la nube naranja Cloudflare se mete
  entre el visitante y Vercel, y Vercel no puede validar el dominio ni emitir
  el certificado. Lo dice su propio panel: `Proxy — Disabled`.

Se borraron los **cinco registros A y AAAA** que quedaban de Hostinger (Edu lo
hizo con Adrián), y el CNAME de `www` que apuntaba a `www.emilserios.com.cdn.hstgr.net`
**se editó, no se borró**: pasó a apuntar a Vercel. Con eso el WordPress viejo
dejó de verse. La zona quedó en 11 registros.

#### ⚠️ Los CNAME de correo quedaron PROXIED, y eso rompe el DKIM

**Es lo primero que hay que mirar en la próxima sesión.**

Cinco registros de correo siguen con la nube naranja:

```
autoconfig                  CNAME → autoconfig.mail.hostinger.com          🟠
autodiscover                CNAME → autodiscover.mail.hostinger.com        🟠
hostingermail-a._domainkey  CNAME → hostingermail-a.dkim.mail.hostinger.com 🟠
hostingermail-b._domainkey  CNAME → hostingermail-b.dkim.mail.hostinger.com 🟠
hostingermail-c._domainkey  CNAME → hostingermail-c.dkim.mail.hostinger.com 🟠
```

**Por qué importa.** El proxy de Cloudflare solo entiende HTTP/HTTPS, y DKIM se
valida a nivel DNS. Proxiado, Cloudflare devuelve **sus** IPs en vez de la
cadena hacia Hostinger, así que el servidor del otro lado no encuentra la llave
pública: **la firma de los correos que Emi envía no se puede verificar**. Los
`autoconfig`/`autodiscover` rompen además la autoconfiguración en Outlook y
Thunderbird. **Recibir sigue bien** —los MX están en gris y correctos—; lo que
está en riesgo es **enviar**.

Mientras Namecheap apuntaba a Hostinger esto era inocuo. Desde que Cloudflare es
autoritativo, está activo.

**Por qué está así.** Edu dijo que estaba bien y que no se tocara, y Adrián
decidió seguirlo para no frenar la salida del sitio (21 sep 2026). **Es una
decisión consciente, no un olvido.** Se deja anotado con su fecha para que el
día que aparezca el síntoma nadie tenga que investigarlo desde cero.

Conviene no heredar la confusión de fondo: Edu dijo «no toques los TXT», y tiene
razón — el SPF, el DMARC y el de Klaviyo son TXT y están bien, en gris. **Pero
los registros de DKIM de Hostinger no son TXT, son CNAME**, y a esos la
instrucción no los cubría.

| | |
|---|---|
| **Síntoma a vigilar** | Los correos que **envía** Emi caen en spam, o los rechazan. Sobre todo a Gmail y Outlook. |
| **Cómo comprobarlo** | [mxtoolbox.com](https://mxtoolbox.com) → DKIM Lookup con los selectores `hostingermail-a`, `-b`, `-c`. También vale mandar un correo a una cuenta de Gmail y mirar «Mostrar original». |
| **El arreglo** | Cinco clics en Cloudflare: nube naranja → **gris (DNS only)** en esos cinco. No hay que cambiar ningún contenido. |

##### La prueba del 22 de septiembre

**El correo de Emi funciona.** Adrián le escribió y ella le contestó, y todo
llegó **a la bandeja de entrada**, no a spam. Recibir, que nunca estuvo en
duda, y **enviar**, que era lo que este apartado ponía en riesgo.

Conviene leerla bien, porque prueba lo que importa y no más: **el síntoma no
está.** No prueba que el DKIM pase — un correo puede llegar a la bandeja con el
DKIM roto si el SPF pasa y el DMARC se alinea por ahí, que es lo más probable
con el SPF de Hostinger en gris y correcto. La forma de saberlo del todo cuesta
treinta segundos: en Gmail, el correo de Emi → los tres puntos → **Mostrar
original**, y leer la línea `DKIM:`.

- `DKIM: 'PASS'` → está bien, y los cinco CNAME se pueden quedar como están.
- `DKIM: 'FAIL'` o sin línea → funciona **apoyado solo en el SPF**. Los cinco
  clics siguen valiendo la pena, pero dejan de ser urgentes.


### El aula

Una sola aula para las dos cosas que vende Emi: la membresía y los cursos.

**La parte de fuera ya existe** —el catálogo y las cartas de venta, en
`/productos/`, sin sesión— y está descrita en **La tienda, y el recorrido de
compra**, aquí abajo. Lo que sigue es la parte de dentro, la que pide haber
pagado y haber entrado, y que hoy está entera en la academia. `/aulavirtual/` es
su puerta: lo único de esta parte que se ve sin sesión.

```
/aula/                   Mi escritorio
                         ├─ Si tiene membresía: el ejercicio de esta semana,
                         │  con la cuenta atrás al jueves
                         ├─ Mis cursos, con barra de progreso
                         └─ Entrada a la tienda

/aula/membresia/         Las tres pestañas de hoy, INTACTAS
                         (ejercicio de la semana · concepto base · bonus)

/aula/curso/<slug>/      El reproductor
                         ├─ Columna: unidades y clases, con sus ✓
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

`/aula/tienda/` y `/productos/` **son el mismo catálogo leído desde dos
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
1  Catálogo            /productos/              ✅ hecho
2  Página de venta     /productos/<slug>/       ✅ hecho (la de la membresía)
3  Botón de comprar    dentro de esa página     ✅ hecho
4  Enlace de pago      /api/checkout            ✅ hecho, y ACÁ (22 sep 2026)
5  Confirmación        /gracias/                ✅ hecho, y ACÁ (22 sep 2026)
6  Crear la cuenta     /api/claim-account       ✅ hecho, y ACÁ — sin correo
7  Entra, con lo que compró desbloqueado        ◻︎ pide derechos de acceso
```

**Del uno al seis son este repo desde el 22 sep 2026.** Hasta ese día los pasos
4 a 6 vivían en `emilseriosacademy.com` —funcionaban, pero el botón «Comprar»
sacaba a la lectora del sitio a mitad de una compra, y la página tenía que
avisarlo—. Hoy la compra entera ocurre sin cambiar de dominio, y el paso 6 ni
siquiera pasa por el correo: quien paga pone su contraseña en `/gracias/` y
entra. Ver **La unión de las dos casas**.

El séptimo es lo que trae la migración de derechos de acceso. Y el **webhook**
de Stripe sigue en la academia a propósito, que es otra cosa: no es un paso del
recorrido de la compradora, es lo que espeja su suscripción en la base de datos
después.

**El catálogo tiene dos productos** desde el 21 sep 2026 —eran siete—, y **cada
uno lleva su foto**. La membresía, que es lo único a la venta, y **un** curso que
Emi ya tiene grabado pero todavía sin estrategia de venta. Ese sale como
«Próximamente» y **su ficha no es un enlace**: no tiene página porque no tiene
carta, y una URL indexable prometiendo algo que no se puede comprar es peor que
un hueco anunciado. Los otros cinco cursos estuvieron anunciados igual, y eran
el mismo hueco repetido cinco veces; vuelven de uno en uno, cuando cada uno
tenga nombre, precio y carta. Cuando
Emi mande el nombre, el precio, la foto y la carta de cada uno, se escriben en
`src/data/aula.ts` y la página aparece sola.

Las seis fotos que faltan **se ven como marcos vacíos con su etiqueta**, que es
lo que ya hace el resto del sitio con las imágenes que Emi no ha mandado. No se
rellenan con una foto de archivo ni con un gris: un hueco que se ve es un hueco
que alguien arregla.

**La carta de la membresía es la de `emilseriosacademy.com`, entera y en el
mismo orden.** No se reescribió: lleva un año vendiendo y el texto es de Emi.

⚠️ **Y desde el 9 sep 2026 tampoco cambió la ropa: se trasplantó también.** Hasta
ese día la carta se pintaba en blanco y negro con el sistema de este sitio; hoy
llega tal cual venía, con la crema de la academia, su Hanken Grotesk, su cursor
de clave de fa y sus notas musicales. Lo pidió Emi con el kit de trasplante
delante —`docs/PORTAR-CARTA-DE-VENTAS.md`—, y está anotado como enmienda al
sistema de diseño. Lo que sigue describe **la versión B/N**, que no se ha
borrado: vive en `src/data/aula.ts` y en `Producto.astro`, sin ruta, y se vuelve
a ella quitando `cartaPropia: true` de la membresía. Lo que hay publicado hoy
está en **La carta trasplantada**, más abajo.

Las piezas, en el orden en que van, y todas están (las dos versiones llevan las
mismas):

```
foto · título · subtítulo · apertura en dos líneas
gancho + botón
la historia (2012, la azotea de Buenos Aires)
los tres descubrimientos
la meta, y por qué el ejercicio desaparece
«¿Necesitas ayuda? ¿Una guía clara?»
es para ti / no es para ti, a dos columnas
los cursos se terminan, esta membresía no
ficha de precio + botón
«Mucho para muchos» + botón
posdata firmada
once preguntas, desplegables + botón
«¿Aún no estás suscrito al newsletter?»
```

**La ficha de precio va pieza por pieza como la original**: el nombre con su eco
en el otro idioma —*Estudiemos juntos · Let's study together*—, la etiqueta
«Precio», el importe con su «/mes», el párrafo que explica que el precio se
congela, lo que incluye, el botón, «cancela cuando quieras» y la letra pequeña
del día de cobro. A dos columnas, como allí.

**Las preguntas van desplegables**, también como allí: once abiertas a la vez son
un muro, y quien busca la suya la encuentra antes leyendo solo los titulares. Se
resuelve con `<details>`, sin una línea de script y con el teclado ya hecho.

Lo único que se dejó fuera es **el precio de fundador**, y no por criterio: su
ventana cerró el 23 de julio de 2026 y en la academia el copy quedó como código
inerte detrás de un `if` con una fecha. Acá entra solo el precio estándar. Si Emi
vuelve a abrir una ventana, se añade como bloque, no como una condición
escondida.

**El pie del newsletter sí está**, y su botón sale a la página alojada de
Klaviyo, igual que en el original. Es lo que hay: el formulario propio de este
sitio todavía no da de alta a nadie, así que mandar ahí no es un rodeo, es el
único camino que llega. El día que Klaviyo esté conectado acá, este enlace pasa a
ser interno.

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

### La carta trasplantada

Lo que está publicado en `/productos/estudiemos-juntos/` y en
`/en/products/estudiemos-juntos/` desde el 9 sep 2026 es el
`Landing.astro` de `emilse_rios_membresias`, traído **entero**. No es una copia
a ojo: es el mismo fichero, con los mismos números. La regla del kit es de una
línea — *no reescribir la carta, trasplantarla* — y la razón es que cada
`cubic-bezier`, cada `560ms` y cada `260%` está elegido, y aproximarlo se nota.

Lo que vino, y de dónde:

| Qué | Dónde vive acá |
|---|---|
| La carta entera (copy, markup, 400 líneas de CSS y 4 scripts) | `src/components/membresia/Carta.astro` |
| Tipografías y tokens de la academia | `public/colors_and_type.css` |
| El retrato del hero (y la imagen de compartir) | `public/img/foto.jpg` |
| El logo caligráfico | `public/img/logo_emi_alpha.png` |
| El cursor de clave de fa, oscuro y claro | `public/img/clef-cursor*.svg` |
| El respaldo del `onerror` de la foto | `public/emi-city.jpg` |
| Las fechas de las puertas y el alta al newsletter | `src/lib/membership.ts` |

**Va suelta, sin `Base.astro`.** La carta imprime el documento completo —su
`<!DOCTYPE html>`, su `<head>`, su `<body>`—, así que meterla dentro del layout
daría dos documentos anidados. Por eso tiene página propia
(`src/pages/productos/estudiemos-juntos.astro` y su gemela inglesa) y la ruta
dinámica `[producto].astro` se salta los productos con `cartaPropia`.

⚠️ **Y por eso esa página no importa nada más.** Astro recoge el CSS de todo lo
que una página importa, aunque no lo pinte: mientras la carta vivió dentro de
`[producto].astro`, la hoja del sistema del sitio se colaba **después** de la
suya y le pisaba el fondo crema. Si algún día alguien añade un `import` a ese
fichero, el síntoma vuelve.

Los siete cables que había que soltar, y cómo quedaron:

| Cable | Qué se hizo |
|---|---|
| `payHref: '/api/checkout?lang=…'` | apuntó al checkout de la academia hasta el 22 sep 2026; hoy **la misma dirección es una ruta de esta casa**, así que el cable se soltó solo al mudar el cobro |
| El aviso de que el cobro sale del sitio | se añadió **una vez**, en la ficha de precio; **salió el 22 sep 2026** con el checkout, porque ya no era verdad. La frase sigue en `products.leaving` y `Compra.astro` la enseña sola si un producto vuelve a cobrarse fuera |
| `/entrar/` de la píldora | va a `entrarHref`, la misma puerta del aula que usa la cápsula de la tienda |
| El conmutador ES/EN | va a las dos direcciones de esta página, no a la raíz de la academia |
| Privacidad y Términos del pie (dos `#`) | cambiados por «Volver a Productos» e «Inicio», que sí existen |
| `Analitica.astro` y el rescate del enlace mágico de Supabase | fuera: son del sitio de la membresía y acá mandarían a un 404 |
| `STRIPE_FOUNDER_UNTIL` y el flip de precio | fuera: entra solo el precio estándar, escrito en el markup |

Y dos redes que el kit recomienda y que la academia tiene en un fichero aparte,
puestas acá dentro: **el revelado se enciende igual a 1,4 s** pase lo que pase
—todo bloque `.reveal` arranca en `opacity: 0`, así que un fallo del script
dejaría la carta en blanco, que es el fallo número uno al portarla— y un
`<noscript>` que la enseña entera sin JavaScript.

**Las puertas mandan sobre los botones, y hoy están cerradas.**
`src/lib/membership.ts` trae las mismas dos fechas que la academia, con los
mismos nombres de variable: `MEMBERSHIP_CLOSES_AT` (por defecto, 2 sep 2026
23:59 CEST) y `MEMBERSHIP_REOPENS_AT` (1 oct 2026). Con las puertas cerradas el
botón se queda sin `href` y sale el aviso con el enlace al newsletter; el 1 de
octubre se abre solo, sin desplegar. Es lo que dice la carta de septiembre y lo
que hace el `/api/checkout` de la academia, que cortaría igual con un 403.

⚠️ **Cada mes que Emi cambie el ciclo hay que tocar las dos casas.** Las
variables se ponen en Vercel, y ahora hay dos proyectos que las leen. Si se
desalinean, la carta invita a entrar por una puerta que el checkout tiene
cerrada.

Lo comprobado el día del trasplante, con la lista del punto 8 del kit: fondo
crema, cursor de clave de fa en toda la página, logo y foto cargando, foto en
blanco y negro que gana color al pasar el cursor, los 22 bloques entrando con
fundido, el relleno de tinta naciendo **donde entra el cursor** (`--mx: 14px`)
con su magnetismo y su flecha, las notas musicales de colores, la ficha de
precio invirtiéndose entera —botón incluido—, la FAQ con su `+` que pasa a `–`,
los hovers en marrón de instrumento, `::selection` en negativo, una columna en
móvil sin scroll horizontal, y el contenido entero visible tanto con «reducir
movimiento» como sin JavaScript.

### El aula por dentro

Construida el **11 de septiembre de 2026**. Es una **maqueta navegable**: las
pantallas están terminadas y el recorrido entero se puede hacer de principio a
fin, pero no hay sesión, ni base de datos, ni videos. Sirve para que Emi la vea,
la use y opine; no para estudiar.

```
/aulavirtual/escritorio/         Mi escritorio
/aulavirtual/curso/<slug>/       El reproductor del curso
/en/classroom/desk/              Sus gemelas inglesas
/en/classroom/course/<slug>/
```

Las cuatro llevan `noindex`: están detrás de una puerta, no tienen nada que
hacer en un buscador. Se llega desde `/aulavirtual/`, que sigue siendo lo único
de esta parte que se ve sin haber pagado.

**La membresía y los cursos viven juntos, y se ven distintos a propósito.** El
escritorio los pone uno debajo del otro —primero por dónde ibas, después la
membresía, después tus cursos, y al final la tienda— pero la ficha de la
membresía **no lleva barra de avance**. No es un olvido: la membresía es un
flujo que no termina —un ejercicio nuevo cada jueves, y el de la semana pasada
desaparece— y un curso es un camino con final. Una barra de progreso en la
membresía mentiría sobre lo que es. Su botón sale hoy a `emilseriosacademy.com`
y **la ficha lo dice**, igual que ya hace el botón de comprar de la tienda:
nadie debería enterarse del salto de dominio a mitad de camino.

Cinco decisiones que conviene no volver a discutir:

1. **Una página por curso, no una por clase.** Cambiar de clase es cambiar el
   `#hash`, sin recargar. El índice no parpadea, el scroll no se pierde, y pasar
   de la clase 4 a la 5 es instantáneo — que es como se estudia de verdad. El
   hash además es una dirección pegable en un correo (`…/curso-01/#u2-c1`) sin
   que existan cuarenta páginas que mantener.
2. **El progreso se guarda solo.** El reproductor avisa del minuto, se apunta
   cada cinco segundos y al volver se retoma ahí. Pasado el 92 % la clase se da
   por vista sola: los últimos segundos no los mira nadie. El botón de «marcar
   como vista» sigue estando, pero para corregir a la máquina, no para hacerle
   el trabajo.
3. **Entrar a un curso sin hash abre la última clase vista, no la primera.**
4. **Un hilo de preguntas por alumna y por curso**, no uno por clase. Una duda
   que nace en la clase 3 casi siempre sigue en la 4. El **botón de preguntar sí
   vive en cada clase**, y lo que se escribe viaja con el curso, la clase y el
   minuto pegados — que es exactamente lo que Emi necesita para responder sin
   preguntar «¿dónde?». El minuto se puede quitar con una casilla.
5. **La clave del progreso es el `id` de la clase, y se escribe a mano.** No se
   calcula del orden: reordenar las clases no puede mover el avance de nadie.

**Los videos son de Bunny Stream, no de Vimeo.** Emi está migrando el material.
Mientras tanto ninguna clase tiene identificador y todas se dibujan como el
marco vacío que el sitio ya usa para las fotos que faltan — con una diferencia:
ese marco trae **una barra de prueba arrastrable** que hace de minuto del video,
para poder validar el guardado del avance sin un solo video subido. El puente
con el reproductor de Bunny (protocolo `player.js` por `postMessage`) está
escrito y **sin probar contra un video real**; ver el pendiente.

Lo que hoy es mentira piadosa, y dónde se deshace el día que haya servidor:

| Finge | Dónde vive | Qué lo sustituye |
|---|---|---|
| Quién eres | `ALUMNA_DEMO` en `src/data/cursos.ts` | La sesión |
| Qué compraste | `ALUMNA_DEMO.cursos` | La tabla de derechos de acceso |
| Tu avance | `window.Aula` → `localStorage` | `lesson_progress` |
| Tus preguntas | `window.Aula` → `localStorage` | La tabla del hilo + correo a Emi |

`window.Aula` —en `src/layouts/Aula.astro`— está escrito para que **ese día solo
cambie ese bloque**: las pantallas llaman a `Aula.ver()`, `Aula.marcar()` o
`Aula.preguntar()` sin saber si detrás hay `localStorage` o un `fetch`. Las
formas guardadas ya son las filas que tendrán las tablas, y están documentadas
ahí mismo.

⚠️ **`localStorage` es de un navegador.** No viaja entre dispositivos y se va con
los datos del sitio. Está bien en una maqueta y no lo está el día del estreno: el
progreso tiene que vivir en el servidor, atado al usuario.

⚠️ **Esta es la única parte del proyecto que necesita JavaScript.** Todo lo
demás —portada, tienda, cartas— se lee entero sin él. Acá no hay manera honesta
de evitarlo: un reproductor que recuerda el minuto es una aplicación.

### La capa A, en pie

Hecha el **20 de septiembre de 2026**. Es el cimiento del panel de Emi y, de
paso, lo que convierte `/aulavirtual/` de puerta pintada en puerta de verdad.

**La sesión ya vive acá**, contra el **mismo Supabase de la academia** — mismo
proyecto, mismos usuarios, mismas contraseñas, ni una fila copiada. Lo que se
construyó:

| | |
|---|---|
| `astro.config.mjs` | **Adaptador de Vercel.** El sitio sigue siendo estático; lo que cambia es que ahora una página puede pedir servidor con `prerender = false`. Sin esto no hay panel, ni webhook, ni nada de lo que viene |
| `src/lib/supabase.ts` | El cliente del navegador. `flowType: 'implicit'` y el almacén que obedece a la casilla de «mantener la sesión iniciada», los dos traídos igual que en la academia |
| `src/lib/auth.ts` | Sesión, perfil, entrar, pedir clave, fijarla, salir |
| `src/lib/supabase-admin.ts` | Lo de servidor, para las rutas de API que vengan |
| `/aulavirtual/entrar/` · `/en/classroom/signin/` | La pantalla de acceso, con la ropa de este sitio |
| `/aulavirtual/nueva-clave/` · `…/new-password/` | Donde aterriza el enlace del correo |
| `/aulavirtual/salir/` · `…/signout/` | Cierra sesión de verdad y devuelve a la puerta |
| **`/panel/`** | La consola de Emi: su portero, su barra y las siete pestañas anunciadas y apagadas |
| `src/layouts/Aula.astro` | El portero del aula, y el enlace `← Volver al panel` |
| `.env.example` | Las variables, documentadas |

#### Un efecto secundario que conviene saber

Con el adaptador, **las redirecciones de `astro.config.mjs` dejaron de ser
páginas con `<meta refresh>` y pasaron a ser 301 de servidor** — que es lo que
su propio comentario venía pidiendo. Comprobado en `.vercel/output/config.json`:
las específicas se escriben antes que el comodín `[producto]`, así que
`/aulavirtual/panel` sigue llegando a `/aulavirtual/escritorio` y no a
`/productos/panel`.

#### Sin backend no se rompe nada, y lo dice

`isSupabaseConfigured` es `false` cuando faltan las dos variables. En ese caso
**el aula se comporta como la maqueta que era** —se puede mirar sin sesión— y
cada pantalla pinta un aviso de «Sin conectar» en vez de un formulario que no
va a funcionar. Es lo mismo que ya hace el formulario del newsletter: se avisa,
no se finge.

⚠️ **Esa puerta abierta tiene fecha de caducidad.** Hoy no esconde nada porque
el contenido de las clases es de muestra y va escrito en el HTML. **El día que
entre el curso de verdad, «sin backend» tiene que significar cerrado, no
abierto** — y, más importante, las clases tienen que llegar por consulta a
Supabase con la RLS decidiendo, en vez de venir horneadas en la página. Está en
el pendiente que cierra la capa B.

(La misma lógica, y el mismo día de caducidad, valen para el candado de pago que
entró el 22 sep 2026: si la comprobación falla, el aula abre. Ver **El aula,
conectada**.)

#### Lo que estos porteros son y lo que no

El portero del aula y el del panel deciden **qué se dibuja**. No protegen nada:
quien fuerce uno desde la consola del navegador verá una pantalla vacía, porque
las consultas se las rechaza la base de datos. **La puerta de verdad es la RLS**
—`is_admin()`, `has_active_sub()`— y las rutas de API, que empezarán todas por
`adminDeLaPeticion()`, que sí corre en el servidor.

Dos detalles que se cuidaron porque se notan:

- **El enlace `← Volver al panel` nace `hidden`** y lo enseña el script tras leer
  el rol. Al revés, una alumna vería parpadear un enlace al panel de Emi cada
  vez que entra.
- **El portón nace visible** y se quita al confirmar la sesión. Al revés, se
  vería el aula un instante antes de que le digan que no puede.

Y uno que es de seguridad aunque parezca de copy: **al pedir el enlace de la
contraseña siempre se contesta lo mismo**, exista la cuenta o no. Si dijera «esa
cuenta no existe», cualquiera podría averiguar quién es miembro probando
correos.

#### Lo que hay que hacer en los paneles de fuera

Nada de esto funciona hasta que:

1. **En Supabase → Authentication → URL Configuration**, añadir a **Redirect
   URLs** el dominio nuevo y la URL de Vercel, con las cuatro rutas que reciben
   el enlace del correo:
   `…/aulavirtual/nueva-clave/` y `…/en/classroom/new-password/`.
   Es **aditivo**: la academia sigue funcionando igual.
2. **En Vercel**, poner `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY`. Sin
   ellas todo sigue en modo maqueta.
3. **Los dos admins**: que Emi y Adrián entren una vez cada uno —el perfil se
   crea en ese momento— y después ejecutar `supabase/set_admin.sql`.

⚠️ **Esa lista se quedó corta el 22 sep 2026**, cuando el aula estrenó candado
de pago y `set_admin.sql` por fin entró en este repo. La versión buena y
completa, con las cuatro Redirect URLs y el orden que importa, está en
`docs/CONECTAR-EL-AULA.md`.

#### Lo que NO entró, y por qué

**La tabla `entitlements` y la reescritura de `has_active_sub()`.** Estaban en la
capa A y se sacan a su propio PR a propósito: esa función es la puerta de una
membresía que **está cobrando ahora mismo**, con miembros de verdad. Una
migración que la toca no se revisa de paso, entre un adaptador y un formulario.
Y antes hay que decidir lo de `trialing`, que sigue abierto.

**Las tres pestañas del panel de la academia.** El armazón está y las pestañas
se anuncian apagadas; traer Membresía, Miembros y Foro es el siguiente PR, cada
una en su componente.

### El primer curso, y las palabras

Llegó el **19 de septiembre de 2026**, y es la primera vez que el proyecto ve la
forma de un curso de verdad en vez de la maqueta:

| | |
|---|---|
| **Idiomas** | Los dos, **ES y EN**, como todo lo demás |
| **Niveles** | **Tres** |
| **Clases** | Nivel 1 → **4** · Nivel 2 → **5** · Nivel 3 → **3** · total **12** |
| **Se vende** | **Como un solo producto.** No se compra nivel por nivel |
| **Videos** | **Ya están todos en Bunny.** La migración desde Vimeo está terminada |

⚠️ **Corrección de lo que se escribió acá primero.** En la primera lectura se
entendió que el curso tenía *tres niveles de 4, 5 y 3 módulos*, con las clases
colgando de cada módulo, y se dio por hecho que hacía falta **un piso más** en
el modelo: una tabla `course_levels`, el índice plegado en tres alturas y un
esquema de `id` nuevo. **Nada de eso hace falta.** Emi lo aclaró en el acto: lo
que ella llama «módulo» **es un video**. El curso son doce clases repartidas en
tres grupos, que es exactamente la forma que el proyecto ya tenía.

#### El modelo no cambia; el vocabulario sí

El problema nunca fue la estructura, era que las mismas palabras significaban
cosas distintas de cada lado de la mesa:

| Emi dice | El proyecto decía | Qué queda, desde hoy |
|---|---|---|
| Curso | Curso | **Curso** |
| Nivel | Módulo | **Unidad** |
| Módulo | Lección | **Clase** |

Y el mapa de siempre, con los nombres nuevos:

```
Curso  →  Unidad  →  Clase          (el video, y la clave del progreso)
```

**Por qué «unidad» y no otra cosa.** «Nivel» es la palabra de *este* curso y no
de todos: obligar a un curso organizado por temas a inventar «Nivel único» es un
impuesto que se paga para siempre. «Sección» ya está tomada — el layout del aula
usa `seccion` para decir en qué parte del aula estás—, y «bloque» también, por
los bloques de las cartas de venta. «Unidad» estaba libre, es la palabra
corriente en enseñanza, y no choca con ninguna de las dos acepciones de
«módulo».

**Y en pantalla no aparece ninguna de las tres.** Hasta hoy el reproductor
imprimía la palabra «Módulo» encima del título de la clase, sacada de la cadena
`player.module`. Esa cadena **se borró**: ahora se muestra el título que Emi le
puso al grupo. Si escribe «Nivel 1 — Fundamentos», eso es lo que se lee; si el
día de mañana un curso va por temas, se lee el tema. **La palabra la pone Emi,
no el código**, y así no hay nada que traducir ni que discutir. El número
ordinal sigue estando en el índice de la izquierda, que es donde sirve para
orientarse.

Lo que se tocó, el mismo 19 sep 2026 y con el build verde:

- `src/data/cursos.ts` — los tipos `Modulo` y `Leccion` pasan a `Unidad` y
  `Clase`, y con ellos `modulos` → `unidades`, `lecciones` → `clases`,
  `leccionesDe()` → `clasesDe()`.
- `src/components/aula/Curso.astro` y `Escritorio.astro` — lo mismo, incluidas
  las clases de CSS (`.modulo__h` → `.unidad__h`) y el dato del hilo de
  preguntas (`leccion` → `clase`).
- `src/i18n/aula.ts` — fuera `player.module`; y «lecciones» pasa a «clases» en
  las dos lenguas (`lessons` → `classes`), que además **arregla una
  incoherencia que ya estaba**: el reproductor decía «Siguiente clase» y el
  escritorio, dos pantallas antes, contaba «11 lecciones».
- Los `id` de muestra, de `m2-l1` a `u2-c1`, y el hash con ellos
  (`…/curso-01/#u2-c1`).

**El `id` sigue siendo la clave del progreso y se escribe a mano**, como siempre.
Cambiar su forma hoy es gratis porque no hay ni una clase real cargada ni una
alumna con avance guardado; el día que la haya, cambiarlo le borra por dónde iba.
Por eso se hizo ahora y no después.

#### El curso es más pequeño de lo que parecía

Doce clases, en dos idiomas: **veinticuatro videos**, no los sesenta y pico que
salían de la primera lectura. Eso devuelve la cuenta a donde estaba: **cargar el
curso a mano es una tarde**, y el script que saca la estructura de la API de
Bunny —que lista la biblioteca con GUID, título, duración y colección— pasa de
ser necesario a ser **cómodo**. Sigue valiendo la pena si los otros dos cursos
son más grandes o si copiar veinticuatro GUID a mano empieza a producir erratas,
pero ya no bloquea nada.

Sigue faltando, de Bunny: el **identificador de la biblioteca** —va a Vercel como
`PUBLIC_BUNNY_LIBRARY`— y añadir `emilserios.com` a los *allowed referrers*, o
los embeds se bloquean aunque el código esté bien: es la misma trampa que ya
tiene anotada Vimeo.

#### Cuántos cursos, y cuándo

**Uno solo sale a la venta ahora.** Emi tiene **tres cursos completos**, pero
cada uno necesita su propio proceso de venta y los va a ir sacando de a poco.

El plan, decidido el 19 sep 2026: **se montan los tres en la plataforma y se
dejan cargados pero invisibles**, de modo que el día que Emi quiera lanzar uno
solo tenga que darle a publicar. Eso obliga a una cosa concreta en el catálogo,
que hoy no existe: **un curso tiene que poder estar completo y no verse**. Ver
los cuatro estados en **El panel de Emi**.

Ojo con el número, que sigue sin cuadrar: el catálogo de `src/data/aula.ts`
tiene **seis** huecos de curso, acá se habla de **tres**. Hay que ajustar los que
sobren cuando se sepa el plan de Emi.

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

Cada curso tiene su página pública propia, **`/productos/<slug>/`** —y
`/en/products/<slug>/`—, indexable, con el sistema de diseño de este sitio. Emi
la escribe desde su panel. Esa página es a la vez la carta de ventas y el destino
del botón de la tienda: una sola cosa con dos usos.

Cuelga de la tienda y no de un `/cursos/` aparte, que es donde se dibujó
primero, porque el recorrido es uno solo: se mira el catálogo, se abre un
producto y se compra. Una segunda rama de URLs para el mismo paso obligaba a
decidir en cada enlace a cuál de las dos mandar. Y **no cuelga del aula**, que
es donde estuvo hasta el 9 sep 2026: el aula pide sesión, y una carta de ventas
detrás de un inicio de sesión no vende nada.

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

### El aula, conectada

Hecho el **22 de septiembre de 2026**. Adrián preguntó qué hacía falta para
conectar la base de datos y entrar al aula, y la respuesta corta fue: **casi
nada de código, y ninguna credencial**. Lo que sí hacía falta era una decisión,
y la tomó: ponerle el candado de pago.

#### Lo que ya existía, y es la mitad buena de esta historia

**No hubo que crear ni migrar nada.** El proyecto de Supabase es el mismo que
lleva un año sirviendo la academia, y ya tenía todo:

| | |
|---|---|
| `profiles` | con `role` y el correo |
| `subscriptions` | con `status`, `tier`, `current_period_end` |
| `on_auth_user_created` | el trigger que crea el perfil solo |
| `is_admin()` | quién ve el panel |
| `has_active_sub()` | **quién entra al aula** |

Está en las migraciones `0001` a `0008` de `emilse_rios_membresias`, ya
aplicadas. Este sitio **solo lee**. Es la otra cara de lo que se decidió el 11
de septiembre —«la lógica de acceso está toda en la base de datos, no en el
frontend»— y por eso conectar el aula cuesta tres pasos de panel.

#### El candado

Hasta este día el portero hacía **una** pregunta: ¿hay sesión? Con eso,
**alguien que canceló hace seis meses seguía entrando**. No era un descuido —la
capa A lo dejó fuera a propósito, con el contenido de muestra detrás— pero ya no
hay razón para dejarlo así.

Ahora hace dos, en paralelo:

```
¿hay sesión?          no → «Esto es para quien ya entró»
                           + Iniciar sesión · Tienda
        ↓ sí
¿es admin?            sí → adentro     (Emi no se paga a sí misma)
        ↓ no
¿has_active_sub()?    no → «Tu suscripción no está al día»
                           + Ver la membresía · Entrar con otra cuenta
        ↓ sí
                     adentro
```

Tres detalles que se cuidaron porque se notan:

- **Emi entra siempre.** No tiene suscripción, y sin esa línea el candado la
  dejaría fuera de su propia aula.
- **Los botones del «sin suscripción» son otros.** Ahí «iniciar sesión» no
  arregla nada —ya está dentro de su cuenta— y lo que necesita es ponerse al día
  o darse cuenta de que entró con el correo equivocado, que pasa más de lo que
  parece cuando alguien tiene dos.
- **El texto no acusa a nadie de no haber pagado.** Quien llega a esa pantalla
  suele ser alguien que SÍ pagó y cuyo cobro se retrasó, o que acaba de pagar y
  el webhook no ha llegado todavía. Por eso dice «si acabas de pagar, dale un
  minuto y recarga», y da una dirección.

#### Si la comprobación falla, se deja pasar

Y es una decisión, no un descuido. Si `has_active_sub()` no contesta —no está
expuesta, la red falló, Supabase tuvo un mal minuto— el aula **abre** y el error
va a la consola.

El razonamiento: este portón decide **qué se dibuja**, no qué se puede leer. La
barrera de verdad es la RLS. Y hoy, además, el contenido de las clases es de
muestra y va escrito en el HTML, así que cerrar acá no protegería nada que no
esté ya a la vista. Entre dejar entrar a alguien de más un minuto y **dejar
fuera a toda la membresía** por un fallo de configuración, lo segundo es mucho
peor.

⚠️ **Esto se invierte el día que entre el curso de verdad.** Ese día las clases
llegan por consulta con la RLS decidiendo —lo que cierra la capa B— y entonces
un fallo acá tiene que cerrar, no abrir. Está escrito en el propio fichero, al
lado de la línea que lo hace.

#### Lo que este candado NO cubre

⚠️ **Quien compró un CURSO suelto no entra.** El único derecho de acceso que hay
en la base de datos es la suscripción a la membresía; los cursos piden la tabla
`entitlements`, que sigue pendiente. Hoy no molesta —no hay ningún curso a la
venta— y molestará el día que lo haya. Cuando llegue, la pregunta del portero
deja de ser `has_active_sub()` a secas.

#### El Site URL, y una trampa que conviene dejar escrita

Al hacer los pasos, Adrián encontró en Supabase el campo **Site URL** todavía
apuntando a `https://www.emilseriosacademy.com`, y preguntó dos cosas. La
primera tenía razón y faltaba en el documento; la segunda habría roto tres
cosas. Van las dos, porque cualquiera las va a volver a pensar.

**Sí: el Site URL se cambia** a `https://www.emilserios.com`. Es **el
respaldo** —a dónde manda Supabase cuando nadie le dice a dónde ir, o cuando lo
que le dicen no está permitido— y por eso cambiarlo es seguro: **ningún camino
de las dos casas depende de él**. La pantalla de acceso, la de `/gracias/` y los
tres generadores de enlace del webhook de la academia pasan todos su
`redirectTo` a mano, y esas direcciones ya están en la lista. ⚠️ Lo único que
hay que mirar antes son las plantillas de correo: si alguna usa
`{{ .SiteURL }}`, sus enlaces cambian de dominio.

**No: la academia NO se redirige todavía.** La idea es razonable —el sitio viejo
ya no debería recibir a nadie— y es exactamente el movimiento que rompe tres
cosas a la vez:

1. **Se cae el webhook de Stripe**, que vive en
   `emilseriosacademy.com/api/stripe-webhook`. Un 301 deja el aviso de Stripe
   llegando a una página de ventas, que no procesa nada. **Alguien paga y no
   recibe acceso**, y no se entera nadie hasta que esa persona escriba. Es la
   otra cara de la decisión de no mudar el webhook: **si se queda, el dominio
   que lo aloja tiene que seguir respondiendo.**
2. **Se cae el aula de la membresía.** Los videos semanales se sirven allá.
3. **Se cae el puente de traspaso antes de existir**, y entonces todo el mundo
   tiene que restablecer su contraseña en vez de entrar con un clic.

El orden bueno ya estaba escrito en **La mudanza de la sesión**: puente → correo
de aviso → webhook → **y semanas después** el 301. Lo que sí se puede hacer ya,
si molesta que alguien llegue al sitio viejo, es redirigir **rutas sueltas** —la
portada, `/aula/`— dejando `/api/*` en paz.

#### En este sitio nadie puede crearse una cuenta, y eso incluye a Emi

Descubierto **el mismo día, probándolo**: Emi y Adrián no podían entrar, y el
mensaje decía «ese correo o esa contraseña no son correctos» sin más.

La causa no era la contraseña: **sus cuentas no existían**. Y no podían existir,
porque en este sitio **no hay registro abierto** —a propósito: el aula se
compra—. Las cuentas nacen de un solo sitio, `/api/claim-account`, después de un
pago de Stripe. Emi y Adrián nunca han pagado nada.

⚠️ **Y la trampa, que es de las que hacen perder una tarde: «¿Primera vez, o se
te olvidó la clave?» tampoco crea la cuenta.** Por debajo es
`resetPasswordForEmail`, que **solo manda el correo si la cuenta ya existe**; si
no existe, contesta que todo fue bien y no manda nada, para no delatar quién
está registrado. Parece que funcionó y no llega ningún correo nunca.

El paso 3 de `docs/CONECTAR-EL-AULA.md` decía «que entren una vez y el perfil se
crea solo». **Era falso** y está corregido: las dos cuentas se crean a mano en
Supabase → Authentication → Users, con **Auto Confirm User marcado** —sin eso,
Supabase rechaza el inicio de sesión con «Email not confirmed», que en pantalla
se ve exactamente igual que una contraseña mala—. El trigger
`on_auth_user_created` hace el resto.

#### La causa de verdad: `/rest/v1` pegado a la URL de Supabase

Lo que tenía a Adrián fuera del aula, encontrado el 22 sep 2026 en **Logs → API**:

```
404  POST  https://<ref>.supabase.co/rest/v1/auth/v1/token?grant_type=password
                                     ^^^^^^^^^
```

`PUBLIC_SUPABASE_URL` en Vercel llevaba **`/rest/v1` pegado al final**. El
cliente le añade `/auth/v1` a la base que le den, así que pedía
`…/rest/v1/auth/v1/token`, que no existe.

**Es un error fácil de cometer:** el panel de Supabase enseña la URL del
proyecto en un sitio y los endpoints REST —con `/rest/v1`— en otro.

**Y es un fallo mudo, que es lo que lo hizo caro.** El 404 muere en la pasarela
y **nunca llega al servicio de autenticación**: no aparece en Users, no aparece
en Authentication → Logs, no deja rastro donde uno mira. Solo sale en Logs →
API, entre el ruido de los checkpoints de Postgres. Mientras tanto la pantalla
decía que la contraseña no era correcta, así que se buscaron contraseñas.

⚠️ **Los `200` de Authentication → Logs que despistaron eran de otros
intentos**, de antes de que la variable estuviera mal o desde la academia —esos
registros son del USUARIO en el proyecto, no de este sitio—. Lección: un 200 ahí
prueba que *alguna vez* entró, no que *este* intento llegara.

**Arreglado en dos sitios, y los dos hacen falta:**

- **En Vercel**, la variable: `https://<ref>.supabase.co`, sin sufijo y sin
  barra final.
- **En el código**, `limpiarUrl()` en `supabase.ts` y su gemela en
  `supabase-admin.ts`: quitan la barra final y el sufijo `/rest/v1`,
  `/auth/v1`, `/storage/v1` o `/realtime/v1` si alguien lo pega. **Y avisan por
  consola.** Arreglarlo en silencio escondería una variable mal puesta que
  alguien volvería a copiar igual.

Comprobado con la URL rota exacta: la petición sale corregida a
`/auth/v1/token`, el acceso entra al escritorio, y la consola nombra la
variable y el valor que se usó.

#### «No son correctos» mentía, y eso costó una tarde

El 22 sep 2026, con el aula ya conectada, Adrián no podía entrar. La pantalla
decía «ese correo o esa contraseña no son correctos». Se probaron contraseñas,
se miró si la cuenta existía, se dudó de la conexión.

**Nada de eso era.** Los logs de Supabase —Authentication → Logs— enseñaban el
`/token` de sus dos intentos devolviendo **`200`**: las credenciales eran
buenas y Supabase las había aceptado. El error salía **después**, del lado del
navegador, y la pantalla lo contaba como si fuera la contraseña.

Leyendo `signInWithPassword` de `auth-js` 2.116, después de un `200` solo quedan
dos caminos que devuelvan error: que la respuesta no traiga sesión o usuario
utilizables —`AuthInvalidTokenResponseError: Auth session or user missing`— o
que algo falle al guardar la sesión. **Ninguno tiene que ver con la
contraseña.**

Así que la pantalla ahora dice **dos cosas y no una**:

- **`error.status === 400`** → es de credenciales, y ahí el mensaje sigue siendo
  el mismo diga lo que diga Supabase. «No existe», «clave incorrecta» y «email
  not confirmed» se cuentan igual: distinguirlos deja averiguar quién es miembro
  probando correos, y confirmar que una cuenta existe ya es delatarla.
- **Cualquier otra cosa** → «no pudimos completar el acceso, y **no es tu
  contraseña**». Acá caen la clave `anon` mal copiada, un 429, un 500, la red y
  el caso de arriba. **Nada de eso es un vector de enumeración**, así que decirlo
  no cuesta nada — y ahorra la tarde.

Comprobado con un Supabase de mentira, los seis casos: 400 de credenciales y 400
de correo sin confirmar dan el mensaje genérico; 401, 429 y el `200` sin sesión
dan el nuevo; y el éxito entra al escritorio.

💡 **Regla que queda:** cuando el acceso falle, **Authentication → Logs de
Supabase llega antes que la consola**. Si el `/token` sale en 200, el problema
no está en las credenciales y no hay que tocarlas.

#### El mensaje de error escondía cinco cosas distintas

La pantalla de acceso decía «ese correo o esa contraseña no son correctos» pase
lo que pase, **y no registraba nada en ninguna parte**. Eso está bien para el
mensaje —distinguir «no existe» de «clave incorrecta» deja averiguar quién es
miembro probando correos— y estaba mal para todo lo demás: la cuenta que no
existe, el correo sin confirmar, la clave `anon` mal copiada en Vercel y un
error de red se veían **idénticos**, y no había manera de saber cuál era.

Desde el 22 sep 2026 el error entero va a **la consola del navegador**. No es una
contradicción con lo anterior: la consola solo la ve quien está sentado delante,
que es quien acaba de teclear ese correo y esa contraseña, así que no se le
cuenta nada que no sepa. El mensaje de pantalla no cambia.

#### Cómo acabó, y las tres lecciones que valen para la próxima

**Se entra.** Adrián entró con su cuenta el 22 sep 2026, contra el Supabase de
siempre. La cadena completa —variables de Vercel, Redirect URLs, Site URL,
sesión, candado de pago— funciona de punta a punta.

Costó media tarde, y **el tiempo se fue en diagnosticar, no en arreglar**: los
dos arreglos de verdad fueron un campo de Vercel y cuatro líneas de código. Lo
que falló fue saber dónde mirar. Las tres lecciones, por orden de lo que habría
ahorrado más tiempo:

1. **Un mensaje de error que lo dice todo igual no protege a nadie: esconde.**
   «Ese correo o esa contraseña no son correctos» tapaba una URL mal copiada, y
   mandó a buscar contraseñas que estaban bien. El mensaje genérico sigue siendo
   correcto **solo para el 400**; todo lo demás se dice, porque no es un vector
   de enumeración.
2. **Un fallo puede no dejar rastro donde uno mira.** El 404 moría en la
   pasarela y no aparecía ni en Users ni en Authentication → Logs. **Cuando ahí
   no hay nada, el intento no llegó**, y hay que ir a Logs → API.
3. **Un registro puede ser de otra cosa.** Los `200` de Authentication → Logs
   que parecían decir «las credenciales son buenas» eran de otros intentos del
   mismo usuario en el proyecto, no de este sitio. Un 200 ahí prueba que
   *alguna vez* entró, no que *este* intento llegara.

**Lo que queda del paso 3:** ejecutar `supabase/set_admin.sql`. Y antes,
comprobar en Supabase → Users **cuál es el correo real de Emi**: el script tiene
escrito `emilserios.bass@gmail.com` y en la lista se veía un
`emilse.art@gmail.com`. Si no coincide, se edita el array del script — si no,
aborta y no toca nada, que es lo que tiene que hacer.

#### `set_admin.sql`, que estaba citado y no existía

Este documento venía diciendo desde la capa A que había que ejecutar
`supabase/set_admin.sql`. **El fichero vivía solo en el repo de la academia**,
así que el paso estaba escrito y no se podía dar. Ahora está acá, en
`supabase/set_admin.sql`, con un cambio: el alumno de prueba **nace vacío**.

En el original venía con un correo puesto, y ese bloque **regala una membresía
de 30 días**. Es justo lo que hace falta para probar el candado sin pasar por
Stripe, y justo lo que no se quiere dejar puesto por descuido: es una
suscripción de verdad en la tabla de verdad. Se rellena, se prueba, se vacía.

### El newsletter, conectado

Hecho el **22 de septiembre de 2026**. Era el último pendiente que bloqueaba el
lanzamiento, y llevaba en esa lista desde el principio: **el formulario no daba
de alta a nadie.**

Lo que había hasta ese día: el campo validaba, maquetaba bien y, en producción,
enseñaba un error honesto con `info@emilserios.com`. No mentía —eso estaba
resuelto a propósito— pero tampoco servía. Adrián lo comprobó en el código
fuente del sitio publicado: `data-endpoint` viajaba vacío en los dos
formularios de la Home y en el de *Sobre mí*.

#### Cómo quedó

```
«Acá te suscribes»
        ↓  POST {email}
/api/suscribir          valida, normaliza y llama a Klaviyo
        ↓                desde el SERVIDOR, con la clave privada
[ Klaviyo ]             trabajo de suscripción → lista SaE8Px
        ↓
«Listo. Revisa tu bandeja de entrada.»
```

- **`src/lib/klaviyo.ts`** — solo servidor. La clave, la lista, la versión de
  la API y la llamada.
- **`src/pages/api/suscribir.ts`** — la ruta. Valida el correo y traduce el
  resultado a un sí o un no genérico.
- **`SubscribeForm.astro`** — apunta a `/api/suscribir` por defecto.

#### Tres decisiones, y por qué

**1 · La llamada va por el servidor, no desde el navegador.** Klaviyo tiene un
endpoint de cliente que habría evitado escribir la ruta — pero entonces
cualquiera puede dar de alta a cualquiera con un bucle de dos líneas, y la
clave viaja en el HTML. Es lo que este documento ya había decidido cuando el
pendiente se escribió, y sigue siendo lo correcto. **Y hoy cuesta menos que
antes:** el repo ya tiene rutas de servidor desde la capa A, así que la
infraestructura estaba puesta.

**2 · El ID de la lista va por defecto en el código, no en Vercel.** Es
`SaE8Px`, la lista real del newsletter — la misma a la que lleva la página
alojada de Klaviyo que usan la carta de ventas y el pie de la membresía (ver
`NEWSLETTER` en `src/data/aula.ts`). No es un secreto: viaja en esa URL que Emi
comparte. Ponerla por defecto evita el fallo más caro de todos: **dar de alta a
gente en una lista equivocada durante semanas sin que nadie lo note.** Se puede
cambiar con `KLAVIYO_LIST_ID`, pero el valor por defecto es el bueno.

**3 · La respuesta es la misma esté o no ese correo ya suscrito.** Si
contestara distinto, cualquiera podría averiguar quién lee el newsletter de Emi
probando direcciones. Es la misma regla que ya sigue la pantalla de acceso del
aula al pedir el enlace de la contraseña. Lo que sí se distingue es **el fallo
nuestro** —sin proveedor, Klaviyo caído, Klaviyo rechazando— porque ahí no hay
nada que filtrar y quien se suscribe merece saber que no quedó apuntado.

#### Lo que no cambió, y es importante

**El comportamiento sin proveedor se queda igual.** Si falta
`KLAVIYO_API_KEY`, el formulario hace lo de siempre: en desarrollo simula un
«Listo» para poder revisar el diseño, y en producción dice que no se pudo y da
una dirección a la que escribir.

⚠️ **De ahí una trampa que conviene saber: probarlo en local no prueba nada.**
En `astro dev` sin clave el formulario dice «Listo» y no ha dado de alta a
nadie. La comprobación de verdad es mirar el correo en Klaviyo.

#### Lo que hay que saber si un día deja de funcionar

⚠️ **La API de Klaviyo va versionada por fecha**, en la cabecera `revision`, y
es obligatoria. Klaviyo sostiene cada fecha **dos años** y después la retira.
La que usa el código es `2026-07-15`, que **dura hasta julio de 2028**. Si el
alta empieza a fallar de golpe sin haber tocado nada, eso es lo primero que hay
que mirar: se sube la fecha en `KLAVIYO_REVISION`.

El motivo de verdad siempre está en **Vercel → Logs**, buscando `[klaviyo]`: se
registra el estado HTTP, la `revision`, la lista y **el cuerpo del error de
Klaviyo entero**. A la pantalla no va nada de eso a propósito — nombra la lista
y la cuenta.

**La forma del cuerpo de la petición está comprobada** desde el mismo 22 sep
2026, contra el SDK oficial de Klaviyo (`klaviyo-api` 23.0.0, versión
`2026-07-15`), campo por campo. El `curl` de `docs/CONECTAR-KLAVIYO.md` sigue
haciendo falta, pero para otra cosa: **comprobar la clave**, que no se puede
comprobar desde el código.

#### La corrección del mismo día

Esa misma noche, al revisar el aviso de WooCommerce que le llegó a Emi, se
comprobó el alta contra el SDK oficial de Klaviyo —el entorno sigue sin salida
hacia sus servidores, pero sí hacia npm— y salieron **dos fallos que habrían
dejado a la gente sin apuntar**:

1. **La clave pedía dos permisos donde hacen falta tres.** La guía decía
   *Lists* y *Profiles*; el trabajo de suscripción pide además
   **`subscriptions:write`**. Una clave hecha al pie de la letra habría dado
   **403 en cada alta**, con el formulario diciendo «no pudimos» y nadie
   sabiendo por qué hasta mirar los logs. Corregido en la guía, en
   `.env.example` y en el comentario de la clave.
2. **La versión de la API caducaba en tres semanas.** `2024-10-15` se retira
   el **15 de octubre de 2026**. Klaviyo no rompe la llamada al retirarla: la
   atiende con el comportamiento de la versión más antigua que siga viva, que
   es peor, porque cambia sin avisar. Subida a **`2026-07-15`**, la estable de ese día.

Y dos cosas que se añadieron de paso:

- **El alta lleva origen: `custom_source: 'emilserios.com'`.** Queda escrito en
  el registro de consentimiento de cada perfil, y es lo que deja a Emi
  distinguir en Klaviyo a quien se apuntó desde el sitio de quien lo hizo por
  la página alojada.
- **La recomendación de doble confirmación, con su motivo.** La documentación
  de Klaviyo dice que este trabajo **le quita la baja a quien se había dado de
  baja**. Con confirmación simple, cualquiera puede volver a apuntar a otra
  persona tecleando su correo; con doble, a esa persona le llega un correo para
  confirmar y nada más. Sigue siendo decisión de Emi.

#### La primera prueba, y por qué dijo que no (23 sep 2026)

Adrián hizo la clave con los tres permisos y puso `KLAVIYO_API_KEY` en Vercel.
Se saltó la doble confirmación porque Emi ya la tenía decidida en la lista. Y
**no creó `KLAVIYO_LIST_ID` ni `KLAVIYO_REVISION`, que es lo correcto**: sus
valores buenos van por defecto en el código, y ponerlos en Vercel solo
sirve para clavarlos —el día que se suba la versión en el código, la variable
seguiría mandando la vieja—.

Probó en la vista previa de `claude/busy-heisenberg-2ig8dt`
(`…-git-claude-b-bc8959-…vercel.app`) y el formulario dijo «We couldn't
complete the subscription». **La causa casi segura no es Klaviyo ni el
dominio: es el build.** Las páginas de este sitio se escriben al construir, y
el formulario decidía entonces si tenía proveedor —`hayProveedor`— y lo dejaba
escrito en el HTML. Ese build es del merge del #45, de antes de poner la clave:
el formulario nació sin `data-endpoint` y el navegador enseñaba el error **sin
llegar a llamar al servidor**. Por eso tampoco habría nada en los logs.

Lo que se cambió para que esto no vuelva a quedar mudo:

- **El formulario llama siempre a `/api/suscribir`**, con clave o sin ella.
  Solo simula en `astro dev` sin clave, como antes. Sin clave, el servidor
  contesta 503 y lo deja escrito en los logs: `[klaviyo] falta
  KLAVIYO_API_KEY en este despliegue`.
- **`GET /api/suscribir` dice si el despliegue tiene la clave**:
  `{"proveedor":true}` o `false`, y nada más. Es la comprobación nueva,
  desde el navegador; la de buscar `data-endpoint` en el código fuente dejó de
  servir con el cambio de arriba.
- **La guía** explica lo de redesplegar la vista previa y trae una tabla de
  qué significa cada línea de `[klaviyo]` en los logs.

Se mergeó como el **#46**, ese mismo día.

**Y la prueba buena se aplazó, a propósito.** Adrián prefirió no probar en
una vista previa y hacerlo **todo junto al subir la cortina**, cuando Emi
tenga montada la bienvenida de siete correos: así un solo correo de prueba
comprueba el alta y la serie. La clave está en Production y en Preview, así
que no falta nada de paneles. Los pasos de esa prueba, y por qué conviene
hacerla en la vista previa del PR que sube la cortina, están arriba del todo,
en **Lo que viene → 4**.

Un apunte de ese día, para quien lea los logs: a esa hora en los logs de
producción no había ni una línea `[klaviyo]`, y es lo esperado. Con la cortina
bajada nadie ve el formulario, así que nadie llega a llamar a
`/api/suscribir`.

#### WooCommerce, que ya no está

**El aviso «Klaviyo ya no puede conectarse a WooCommerce» es lo esperado.**
WooCommerce vivía en el WordPress de Edu, y el 21 sep 2026 `www.emilserios.com`
pasó a apuntar a Vercel: Klaviyo llama a una tienda que ya no existe. **No se
reconecta** —los cursos y la membresía se cobran por Stripe y viven en Bunny y
en esta casa— **y no afecta al newsletter**, que va por la API.

Se apaga así, en este orden: primero mirar en **Flows** que ningún flujo activo
arranque con un evento de WooCommerce (*Placed Order*, *Started Checkout*…) y
pasarlos a borrador; después **Integrations → WooCommerce → Disable**. Klaviyo
no borra los datos de pedidos ya sincronizados. Está en
`docs/CONECTAR-KLAVIYO.md`.

**El sustituto natural dentro de Klaviyo es su integración oficial con
Stripe**: trae los pagos, las facturas y los cobros fallidos para disparar
flujos —la bienvenida a quien compra, el aviso de tarjeta rechazada—. Queda
como idea, no como pendiente: nadie la ha pedido todavía.

#### Lo que sigue siendo de Klaviyo, y no de este sitio

**El correo de bienvenida con el video** que promete la Home lo manda Klaviyo,
con su flujo de bienvenida atado a la lista. Este sitio solo da el alta. Y si
la lista tiene **doble confirmación** activada, Klaviyo manda su correo y la
persona no queda suscrita hasta pulsarlo — el copy de la pantalla, «Listo.
Revisa tu bandeja de entrada», ya sirve para los dos casos.

### La unión de las dos casas

Hecha —la primera mitad— el **22 de septiembre de 2026**. Es lo que este
documento venía llamando «el cambio de dominio»: `emilseriosacademy.com` deja de
ser un sitio aparte y pasa a ser, por ahora, un servicio de fondo.

Adrián lo pidió con el orden puesto: **primero el enlace activo de los
productos, después Supabase, y que la membresía siga funcionando como si nada.**
Ese orden es el correcto y conviene entender por qué: el enlace de compra es lo
único que un visitante nuevo ve roto —sale del dominio a mitad de una compra— y
no toca a nadie que ya esté pagando. La sesión, en cambio, sí toca a los
miembros de verdad, así que va después y va con red.

#### Lo que se mudó

| | Antes | Ahora |
|---|---|---|
| El botón de comprar | `emilseriosacademy.com/api/checkout` | **`/api/checkout`**, acá |
| Después de pagar | `emilseriosacademy.com/gracias/` | **`/gracias/`** y `/en/thank-you/`, acá |
| Crear la cuenta | `…/api/claim-account` de la academia | **`/api/claim-account`**, acá |
| El webhook de Stripe | la academia | **la academia** — no se movió |
| El correo de bienvenida | Resend, desde la academia | **igual** — lo manda su webhook |
| El aula de la membresía | la academia | **igual** — los videos siguen allá |

Ficheros nuevos: `src/lib/stripe.ts`, `src/lib/stripe-sync.ts`,
`src/lib/membership-server.ts`, `src/pages/api/checkout.ts`,
`src/pages/api/claim-account.ts`, `src/components/acceso/Gracias.astro` y
`src/components/acceso/Pasar.astro`, más sus cuatro páginas. Todos trasplantados
de `emilse_rios_membresias` salvo `Pasar.astro`, que es nuevo.

#### Por qué el webhook se queda en la academia

Es la decisión que sostiene el resto, así que va escrita sin rodeos: **no
mudarlo no es dejarlo a medias, es la parte barata de hacerlo bien.**

1. **Un webhook no tiene dominio.** Stripe llama a la dirección que tenga
   apuntada en su panel. Esa dirección escribe en el **mismo proyecto de
   Supabase** que esta casa — no hay dos bases de datos, nunca las hubo.
2. **Los dos caminos son idempotentes.** `writeSubscriptionRow()` hace `UPSERT`
   por `stripe_subscription_id`. Que `/api/claim-account` escriba la fila desde
   acá y el webhook la reescriba desde allá deja exactamente el mismo
   resultado, llegue quien llegue primero. ⚠️ **Si esto deja de ser
   idempotente, la mudanza a medias deja de ser segura.**
3. **Mudarlo cuesta tres cosas que hoy no se pueden hacer bien**: endpoint nuevo
   en el panel de Stripe, `STRIPE_WEBHOOK_SECRET` nuevo, y `emilserios.com`
   verificado en Resend. Lo tercero **depende del DKIM, que está roto** (ver
   **El dominio, y Edu**). Un webhook caído significa que alguien paga y no
   recibe acceso.

Así que el orden es: primero el DKIM, después Resend, después el webhook. Está
en **Pendiente**.

#### El desdoble que esto deja abierto

⚠️ **Las fechas de las puertas están escritas en dos casas y hay que cambiarlas
en las dos.** `MEMBERSHIP_CLOSES_AT` y `MEMBERSHIP_REOPENS_AT` viven en los dos
proyectos de Vercel: acá mandan sobre la carta y sobre `/api/checkout`, allá
sobre su webhook y su copy. Si acá dicen «abierto» y allá «cerrado», la carta
invita a entrar por una puerta que el otro lado tiene cerrada. Este desdoble
existe mientras el webhook siga allá, y desaparece con él.

#### Lo que la compradora ve ahora

```
/productos/estudiemos-juntos/   la carta, con su botón
        ↓
/api/checkout?lang=es           ¿puertas abiertas? → sesión de Stripe
        ↓                       ¿cerradas? → 403 con la fecha de reapertura
   [ Stripe ]
        ↓
/gracias/?session_id=…          pone su contraseña
        ↓
/api/claim-account              comprueba el pago CONTRA STRIPE, crea la
        ↓                       cuenta, fija la clave y espeja la suscripción
/aulavirtual/escritorio/        dentro, sin haber abierto el correo
```

**Dónde está la autorización, que es lo que hay que entender antes de tocar
`/api/claim-account`:** en tener un `session_id` de Stripe pagado. Nadie más lo
tiene. Y **el correo no lo escribe el navegador** — sale del propio checkout de
Stripe—, que es lo que impide quedarse con la cuenta de otra persona tecleando
su dirección. Una versión que preguntara «¿este correo pagó?» sería un secuestro
de cuentas con pasos extra.

La pantalla de `/gracias/` tiene **dos caminos**, y el del correo es el de
respaldo: si no hay `session_id` —o si la compradora lo prefiere— pide el correo
y manda el enlace de siempre. Ese camino **no necesitó ninguna ruta de API
propia**: es el mismo `resetPasswordForEmail` que ya usa la pantalla de acceso,
apuntando a la misma pantalla de contraseña nueva. Una pieza menos que mantener.

#### Lo que sigue en la academia, y no es un olvido

- **El webhook de Stripe**, por lo de arriba.
- **El aula de la membresía** — los videos semanales. El botón «Membresía» del
  escritorio todavía sale del sitio, y lo dice.
- **Las URLs de retorno del portal de cliente de Stripe.** Se cambian en su
  panel cuando la membresía entera viva acá, no antes.
- **La academia tiene que seguir viva**, y esto no es optativo: sin ella no hay
  puente de traspaso. Pasa a ser un 301 semanas después, no ahora.

### La mudanza de la sesión

Decidido el **11 de septiembre de 2026**, al preguntarse si había que copiar las
credenciales de la academia a una base de datos nueva.

**No se copia nada, y no se crea un Supabase nuevo.** Un proyecto de Supabase no
está atado a un dominio: es un backend al que se le habla desde donde sea. Lo
único que hoy lo ata a `emilseriosacademy.com` son **dos campos de configuración
en el panel de Auth** —Site URL y Redirect URLs—, no la base de datos.

Así que el aula de `emilserios.com` apunta al **mismo proyecto**. Usuarios,
contraseñas, suscripciones, los `customer_id` de Stripe y las políticas RLS se
quedan exactamente donde están. Cero migración. Es la otra cara de lo que ya
sabíamos leyendo el código: *la lógica de acceso está toda en la base de datos,
no en el frontend*, y por eso el frontend se puede reescribir entero sin tocar
una regla de acceso.

⚠️ **Dos proyectos con usuarios copiados es el peor escenario posible**, y ni
por un día. Bifurca la verdad desde el minuto uno: alguien cambia su contraseña
en uno, una suscripción se cancela en el otro, y no hay manera de reconciliar
eso sin tocar filas a mano. (Sí, técnicamente se pueden exportar e importar los
hashes bcrypt de `auth.users` entre proyectos. Es la respuesta correcta a otra
pregunta.)

**Lo único que la alumna va a notar: queda deslogueada una vez.** No hay forma
de evitarlo y no es culpa de Supabase — el token vive en `localStorage` bajo la
clave `sb-<ref>-auth-token`, y `localStorage` es **por origen**.
`emilserios.com` no puede leer el de `emilseriosacademy.com`. Lo que sí se puede
es hacer que volver a entrar cueste un clic y no una contraseña olvidada, con
tres capas:

1. **El puente de traspaso**, mientras el dominio viejo siga vivo. ✅ **La mitad
   de acá está construida desde el 22 sep 2026**: `/aulavirtual/pasar/` y su
   gemela `/en/classroom/handoff/` reciben los tokens en el `#hash`, los plantan
   con `setSession()` y borran el hash. Falta la mitad de allá — la página
   `emilseriosacademy.com/pasar/` que lee la sesión con `getSession()` y
   redirige—, y está escrita entera, lista para pegar, en
   `docs/UNIR-LAS-DOS-CASAS.md`. **No es un invento: la
   academia ya usa `flowType: 'implicit'`**, que es exactamente esto — los
   tokens viajan en el hash. Dos cosas obligatorias: que la redirección la
   inicie la alumna (un `<iframe>` lo rompe el particionado de almacenamiento de
   los navegadores) y borrar el hash con `history.replaceState` en cuanto se
   consume, para que no quede en el historial.
2. **Entrar con el correo, sin contraseña** (enlace mágico) en el aula nueva.
   Cubre a quien no pase por el puente o no recuerde su clave, y además sirve
   para siempre, no solo para la mudanza.
3. **El correo de aviso, antes del cambio y no después.** Convierte un susto en
   un trámite.

Con las tres, el peor caso de cualquier miembro es *volver a entrar*, nunca
*perder la cuenta*: la identidad es el correo, y el correo no se toca.

**El orden, que acá sí importa:**

```
1  No tocar la base de datos. Mismo proyecto, misma URL, misma clave anon.   ✅
2  AÑADIR emilserios.com a Redirect URLs, y CAMBIAR el Site URL.            ✅ 22 sep
   Las Redirect URLs son aditivas: el dominio viejo sigue funcionando.
   El Site URL es solo el respaldo — nadie depende de él.
3  Desplegar el aula nueva en emilserios.com contra ese mismo Supabase.      ✅
4  MANTENER emilseriosacademy.com viva, con la app vieja + el puente.        ◻︎ pegar
   Si se apaga antes, el puente no existe.
5  El correo de aviso.                                                       ◻︎ Emi
6  Semanas después, la academia pasa a ser un 301 al sitio nuevo.            ◻︎
```

Lo que queda de esa lista **no es código**: son dos campos en el panel de
Supabase, una página que pegar en el repo de la academia y un correo que manda
Emi. Los tres están detallados en `docs/UNIR-LAS-DOS-CASAS.md`.

Tres trampas, y las tres muerden si no se ven venir:

- **El buzón antes que la autenticación.** Ya está apuntado para el traspaso de
  Edu que `info@emilserios.com` probablemente vive dentro del plan de Hostinger.
  Acá se agrava: si Supabase manda sus correos con SMTP del dominio, tocar los
  DNS justo cuando todo el mundo necesita un enlace de acceso deja sin el único
  canal de rescate. **El correo se resuelve primero. Nunca al revés.**
- **Stripe.** Los `customer_id` están en la base de datos y no se mueven, pero
  **el endpoint del webhook y las URLs de retorno del portal de cliente apuntan
  al dominio viejo** y se cambian a mano en su panel.
- **`trialing`.** Tocar la autenticación deja a un paso de `has_active_sub()`,
  donde sigue el desajuste ya apuntado: `subGrantsAccess()` da acceso a
  `trialing` y `has_active_sub()` no. Hoy no está roto porque no hay pruebas. No
  se despierta sin decidirlo.

### El panel de Emi

Decidido el **19 de septiembre de 2026**, y es la pieza que le da autonomía:
**un solo panel desde el que Emi maneja toda su plataforma** — la membresía
semana a semana como hoy, más los cursos, la tienda, las cartas de venta, las
personas y los accesos.

#### Por qué hoy no puede, y no es por ella

En el proyecto conviven dos mundos, y la diferencia no es de dificultad sino de
dónde vive el contenido:

| | Dónde vive | Quién lo cambia | Qué cuesta un cambio |
|---|---|---|---|
| **La membresía** (en la academia) | Base de datos | Emi sola, cada jueves | Un formulario |
| **El catálogo y los cursos** (acá) | `src/data/aula.ts` · `cursos.ts` | Nosotros | Commit, PR y despliegue |

Emi ya carga sola, cada semana, videos de Bunny, PDFs y textos en dos idiomas
con ventanas de publicación. **No es que no pueda: es que en este repo no hay
dónde escribirlo.** Mientras el catálogo viva en ficheros de código, la respuesta
a «¿lo hace Emi o lo hacemos nosotros?» está forzada.

Así que la pregunta de verdad no es *quién*, es **qué se muda de fichero a base
de datos**. Y ahí hay una línea que conviene no cruzar.

#### La línea

| A la base de datos → lo maneja Emi | En código → lo mantenemos nosotros |
|---|---|
| Cursos: nombre, precio, foto, estado, orden | Las páginas, las rutas, el layout |
| Unidades y clases: título, video, PDF, duración | El sistema de diseño |
| El **texto** de las cartas de venta | Los **tipos de bloque** que existen |
| Personas: altas y bajas a mano, quién compró qué | La lógica de acceso, el webhook, los correos |
| Qué está a la venta / próximamente / cerrado | Idiomas nuevos, páginas nuevas |

**Emi rellena plantillas; no inventa maquetación.** Si el panel le deja escribir
HTML o texto con formato libre, el sistema de diseño se muere en tres semanas y
cada arreglo vuelve a pasar por nosotros — que es justo lo que este panel existe
para evitar. Es la misma regla que ya manda en el repo: *los textos no viven en
los componentes*.

#### Quién entra

**Dos personas, y nadie más** (20 sep 2026):

| | |
|---|---|
| `emilserios.bass@gmail.com` | Emi |
| `adrianmendozam@gmail.com` | Adrián, de apoyo |

**El mecanismo ya existe y es el correcto**, así que no hay que inventar nada:
`supabase/set_admin.sql`, en el repo de la membresía, lleva esos dos correos
escritos y hace tres cosas cada vez que se ejecuta — comprueba que los dos
tengan perfil y **aborta sin tocar nada si falta alguno** (un typo no deja a
nadie fuera), pone `role = 'admin'` a los de la lista, y **baja a `member` a
cualquier otro admin** que se haya colado. Sumar o quitar un admin es editar esa
lista y volver a ejecutarlo.

⚠️ **La comprobación no se hace nunca comparando correos en el navegador.** Quien
decide es `role = 'admin'` en `profiles`, y quien lo hace cumplir es la función
`is_admin()` dentro de las políticas RLS — o sea, la base de datos. El gate del
panel lee el rol para *dibujar* la pantalla, pero aunque alguien se saltara ese
gate no vería un solo dato: las políticas rechazan la consulta. Una lista de
correos en el cliente es una cortina, no una puerta.

El perfil se crea solo la primera vez que cada uno entra por la pantalla de
acceso. O sea: **primero entran los dos una vez, después se ejecuta el script.**

#### Las pestañas

```
/panel/          solo admin · solo español · noindex

  Hoy         Activos, ventas del mes, preguntas sin responder, qué está en vivo
  Membresía   Lo de hoy, INTACTO: semana · concepto base · bonus
  Cursos      NUEVO · crear, unidades y clases, reordenar, abrir y cerrar
  Tienda      NUEVO · lo que se ve en /productos/: orden, precio, estado, foto
  Cartas      NUEVO · el editor por bloques de cada carta de venta (ES + EN)
  Personas    Miembros + quién compró qué curso · dar y quitar acceso a mano
  Mensajes    El foro de la membresía + los hilos privados de los cursos
  Textos      AL FINAL · el copy de Home y Sobre mí
```

**Membresía**, **Personas** y **Mensajes** ya existen y funcionan en la academia
—son sus pestañas Ejercicios, Miembros y Foro—. El resto es lo que hay que
construir.

Dos cosas del panel actual que se conservan tal cual, porque están bien
resueltas: el formulario de contenido es **de dos columnas, ES y EN lado a
lado**, y el normalizador de video acepta la URL, el enlace de gestión, el ID
pelado o el `<iframe>` entero — porque Emi pega algo distinto cada vez. Se
reutiliza sin tocarlo para las clases de los cursos.

#### La ida y la vuelta, tal como Emi ya la usa

En la academia hay un enlace arriba a la derecha que lleva del panel al aula y
del aula al panel, y **eso se conserva igual**: es parte de cómo Emi trabaja y
no hay ninguna razón para cambiárselo.

| Dónde está | Qué dice | Cuándo se ve |
|---|---|---|
| Barra del panel | `Ver el aula →` | Siempre — al panel solo entra un admin |
| Barra del aula | `← Volver al panel` · `← Back to panel` | **Solo si `role === 'admin'`** |

El de vuelta nace `hidden` en el HTML y **lo revela el script después de leer el
perfil**. Tiene que seguir siendo así y no al revés: si se dibujara visible y se
escondiera después, una alumna vería parpadear un enlace al panel de Emi cada vez
que entra al aula.

Los dos existen hoy en el repo de la membresía —`src/pages/panel/index.astro` y
`src/components/membresia/Aula.astro`— y se traen con el resto en la capa A.

**La palabra «panel» ya está libre** (20 sep 2026). Hasta ese día
`/aulavirtual/panel/` era **el escritorio de la alumna** —el menú decía «Mi
escritorio» pero la ruta se llamaba `panel`—, mientras que en la academia
`/panel/` es la consola de Emi. Dos pantallas distintas con el mismo nombre, y
Emi las iba a usar las dos el mismo día: la misma clase de confusión que se
acababa de arreglar con módulo/unidad.

Así que el escritorio se mudó a `/aulavirtual/escritorio/` y
`/en/classroom/desk/`, la función pasó a llamarse `escritorioPath()`, la prop
del layout de `'panel'` a `'escritorio'`, y **`/panel/` queda reservado para la
consola de Emi** — que es lo que el esquema del aula de más arriba ya decía.

Las direcciones viejas redirigen, y esas dos líneas de `astro.config.mjs` **no
eran opcionales** aunque fueran de una maqueta con `noindex`: sin ellas
`/aulavirtual/panel` caía en el patrón `[producto]` que vive justo encima y
acababa en `/productos/panel`, que no existe. Una ruta estática gana a una
dinámica, así que puestas ahí mandan ellas.


⚠️ **El panel de la academia es un solo fichero de 1.059 líneas.** Con tres
pestañas ya está en el límite; con ocho no se sostiene. Al mudarlo se parte en
un componente por pestaña. No es refactor por gusto: es la diferencia entre
poder añadir la novena y no.

#### Los cuatro estados de un producto

Hoy el catálogo solo conoce dos, `venta` y `proximamente`. Con tres cursos
cargados que se publican de a uno, hacen falta cuatro:

| Estado | ¿Se ve en la tienda? | ¿Se puede comprar? | ¿Quien ya compró entra? |
|---|---|---|---|
| `borrador` | No | No | — |
| `proximamente` | Sí, sin enlace | No | — |
| `venta` | Sí | Sí | Sí |
| `cerrado` | Sí | No | **Sí** |

`borrador` es el que falta y el que pidió la realidad: **un curso completo que
todavía no existe para nadie**, listo para que Emi le dé a publicar el día del
lanzamiento. Y `cerrado` es la regla que no se rompe: **cerrar un curso quita el
botón de comprar, nunca el acceso de quien ya lo compró.**

#### Las cinco capas, en orden

**A · El cimiento.** Adaptador de Vercel en este repo, traer `supabase.ts`,
`auth.ts` y `supabase-admin.ts`, la tabla `entitlements` y reescribir
`has_active_sub()` encima — **una función, no siete migraciones**—, y mudar el
panel actual tal cual. Al terminar esta capa **la membresía ya vive en
`emilserios.com` y Emi sigue trabajando igual**, que es el hito que de verdad
importa.

**B · Los cursos.** `products` / `courses` / `units` / `lessons` /
`lesson_progress`, migrar el catálogo de `aula.ts` a `products` —siete filas— y
el editor de cursos en el panel. Las páginas públicas pasan a leer de la base de
datos. **En el panel, la unidad no se llama «unidad»:** se llama como Emi la
titule, igual que en el aula.

**C · La venta.** Pago único de Stripe escribiendo en `entitlements`; el espejo
de Stripe ya está aislado en `stripe-sync.ts` precisamente para esto. Más los
cuatro estados manejados desde el panel.

**D · El editor de cartas.** El único con trampa: el tipo `Bloque` de `aula.ts`
tiene diez formas (`lede`, `prose`, `hitos`, `contraste`, `lista`, `faq`, `pd`,
`news`, `cta`, `anchor`). Un editor honesto es un constructor de bloques —añadir,
elegir tipo, rellenar campos—, y es la pieza que más ganas da de resolver con un
campo de texto libre. **No se hace así:** el campo libre produce cartas que no
se parecen a las de Emi. Se arranca con los cuatro que usa una carta de curso
—`lede`, `prose`, `lista`, `faq`, `cta`— y se añaden los demás cuando hagan
falta.

**E · El copy del sitio.** Home y Sobre mí a una tabla `site_copy`, campo a
campo con la forma que ya tienen `home.ts` y `about.ts`. **Es lo más ambicioso y
lo de menos valor por hora invertida**: Emi cambia ese copy dos veces al año, y
el texto está medido contra la maqueta —se maqueta con el español, que es el más
largo—. Va al final y se decide entonces, con la experiencia de haber visto
cuánto usa el panel de verdad.

#### Tres decisiones técnicas que condicionan el resto

1. **Cómo se publica lo que Emi escribe.** Hoy el sitio es 100 % estático. Con
   el catálogo en base de datos hay dos caminos: **SSR con caché de 60 s en
   Vercel** —Emi guarda y al minuto está en la web— o **estático más un botón
   que dispara un rebuild** —sirve más rápido, pero son dos minutos de espera y,
   si el build falla, el contenido se queda atascado sin que ella entienda por
   qué—. **Se elige el primero** para `/productos/` y `/productos/<slug>/`. Home
   y Sobre mí siguen estáticas mientras su copy siga en código.
2. **El panel habla directo con Supabase desde el navegador**, como ya hace hoy:
   la clave `anon` es pública a propósito y quien manda es la RLS. Solo lo que
   necesita `service_role` —crear cuentas, mandar correos— va por rutas de API,
   que es el patrón ya probado en `add-member.ts`. **Esto es lo que hace barato
   todo el proyecto: no hay que escribir un backend.**
3. **Las fotos de los cursos van a Supabase Storage**, donde ya van los PDFs.
   Hoy las imágenes del catálogo son `import` desde `src/assets/`, o sea código,
   y Emi no puede tocarlas. El precio de moverlas es perder el optimizador de
   imágenes de Astro en esas fotos. Es pequeño, pero se sabe antes y no después.

#### Lo que el panel NO hace

**Contabilidad.** El panel muestra quién compró y quién está activo leyendo
`entitlements` y `subscriptions`, pero **la verdad del dinero es Stripe**. Para
cualquier cosa financiera, un enlace a su panel. Es la diferencia entre un panel
que se mantiene solo y uno que hay que reconciliar a mano cada mes.

Y no se traduce: **el panel es solo en español**, aunque todo el contenido que
se escribe en él sea bilingüe.

#### El orden acordado, y por qué

1. **Capa A**, que es lo que quita `emilseriosacademy.com` de encima.
2. **El primer curso se carga sin editor** — a mano, o generado desde la API de
   Bunny. Son tres cursos y hay que cargarlos una vez.
3. **Con cursos reales delante, se escribe el editor una vez y bien** (capa B).

La razón no es de esfuerzo, es de información: **hoy `curso-01` es de muestra**,
y escribir el editor antes de ver un curso de verdad es adivinar qué campos
necesita. Ya se cobró un aviso de esto el mismo día: al ver el primer curso real
se dio por hecho que el modelo necesitaba un piso más, y lo que necesitaba era
**cambiar dos palabras**. Un editor escrito sobre esa primera lectura habría
nacido con una tabla de sobra.

### Las fases

```
Fase 0   Pedir el dominio a Edu (CONTESTÓ el 19 sep) + traer el repo de la
         membresía · y resolver el correo antes que nada
Fase 1   Sesión + adaptador + el armazón del panel  ✅ 20 sep 2026  (capa A)
         Derechos de acceso y las tres pestañas de la academia: su propio PR
Fase 2   Cursos: modelo, reproductor, progreso, hilo privado con video y
         audio                                                      (capa B)
Fase 3   Tienda + pago único + los cuatro estados de lanzamiento     (capa C)
Fase 4   Cartas de venta + editor por bloques + botón de anuncio     (capa D)
Fase 5   Cargar los cursos y las alumnas que ya compraron
Fase 6   El cambio de dominio, con todo lo demás funcionando
Fase 7   El copy del sitio al panel, si resulta que hace falta       (capa E)
```

Las «capas» entre paréntesis son las de **El panel de Emi**: son la misma
escalera contada desde el lado de quien la va a usar.

**De las fases 3 y 4 ya está la mitad de fuera**: el catálogo, los tres estados
de la ficha y la carta de venta de la membresía, sin backend. Lo que les queda
es lo que necesita base de datos —el pago único, el estado de lanzamiento que se
cambia desde el panel, y el botón de anuncio—, y eso va detrás de la fase 1. Se
adelantó a propósito: es lo que se puede ver y aprobar antes de gastar en
fontanería, y no toca nada de lo que hoy cobra.

**No hay fase de migración automática.** Son **unas 5 alumnas**: el acceso se
concede a mano desde la pantalla de miembros que ya existe, y escribir una
herramienta para eso costaría más que hacerlo.

Con los cursos la cuenta se mantiene: el primero son **doce clases en tres
unidades**, o sea veinticuatro videos contando los dos idiomas, y eso **sí es
una tarde**. De Tutor LMS no sale nada. Generar la estructura desde la API de
Bunny es cómodo pero ya no hace falta — ver **El primer curso, y las palabras**.
De Emi sigue haciendo falta el orden y los textos, y los correos de quienes
compraron.

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

  ⚠️ **Revocado en parte el 9 sep 2026**, y Emi la recuperó: la carta de venta de
  la membresía va con la capa cálida enchufada, trasplantada entera. Vale para
  esa ruta y para nada más — ver la enmienda del 9 sep en **El sistema de
  diseño**. El resto de lo decidido acá sigue en pie: el aula, cuando llegue, es
  de este sitio.
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

## Las direcciones viejas

**Arregladas el 23 de septiembre de 2026**, con la cortina bajada. Son cuatro
—la carta de la membresía cuando vivía en el aula y el escritorio cuando se
llamaba panel, en los dos idiomas— y hasta ese día **tres de cada cuatro
maneras de pedirlas acababan en 404**:

| Se pedía | Pasaba | Ahora |
|---|---|---|
| `/aulavirtual/estudiemos-juntos` | 301 a la carta | 301 a la carta |
| `/aulavirtual/estudiemos-juntos/` | **404** | 301 a la carta |
| `/aulavirtual/panel` | 301 a `/aulavirtual/escritorio`, y de ahí **a `/productos/escritorio`, 404** | 301 al escritorio |
| `/aulavirtual/entrar` (sin barra) | **301 a `/productos/entrar`, 404** | la página |

Y lo mismo con sus gemelas inglesas y con todas las páginas del aula pedidas
sin barra: `escritorio`, `nueva-clave`, `salir`, `pasar`, `signin`, `desk`…

**Las dos causas estaban en cómo el adaptador de Vercel escribe las
redirecciones de `astro.config.mjs`** en `.vercel/output/config.json`:

1. **Sin barra final.** Cada redirección es una expresión que acaba justo
   después del nombre —`^/aulavirtual/estudiemos-juntos$`—, así que la misma
   dirección con barra, que es como el sitio escribe todas las suyas y como
   Emi las copia de la barra del navegador, no la encontraba nadie.
2. **Los patrones dinámicos se comían páginas reales.**
   `/aulavirtual/[producto]` se convierte en «cualquier cosa bajo
   `/aulavirtual/`», y va antes que los ficheros. Se llevaba `/aulavirtual/entrar`
   a la tienda, y también `/aulavirtual/escritorio`, que es justo el destino de
   la redirección del panel.

**Lo que se hizo:**

- **Fuera los patrones dinámicos.** No cubrían nada: la única carta que vivió
  en `/aulavirtual/<slug>/` fue la de la membresía —del 31 ago al 9 sep 2026,
  se ve en el historial de `src/data/aula.ts`—, que ya tenía su línea escrita a
  mano. Los productos nuevos nacen en `/productos/` y no tienen dirección vieja.
- **`redireccionesConBarra()`**, en `astro.config.mjs`: una integración que,
  cuando el adaptador ya escribió `config.json`, les acepta la barra final a
  las redirecciones (`/?$`) y se la pone al destino. Astro no deja pedir
  ninguna de las dos cosas desde `redirects`. El build lo dice en voz alta:
  «4 redirecciones aceptan ahora la barra final».
- **`npm run audit:redirecciones`** (`scripts/redirecciones.mjs`): recorre las
  direcciones viejas y las páginas del aula contra la salida del build, como
  lo haría Vercel, y falla si alguna no aterriza donde debe. Antes del arreglo
  fallaban 18 de 28; después, ninguna.

⚠️ **Lo que no se pudo hacer: comprobarlo en vivo.** La sesión no tenía salida
a `emilserios.com` (el proxy contestaba 403). Después del merge, con
`curl -sI https://www.emilserios.com/aulavirtual/estudiemos-juntos/` tiene que
salir un `301` con `location: /productos/estudiemos-juntos/`. El script da por
hecho algo que no se pudo mirar: que Vercel sirve `…/entrar/index.html` también
a quien pide `…/entrar` sin barra. Lo que sí es seguro es que ninguna
redirección se la lleva ya a otra parte.

**Si se añade una redirección**, va en `redirects` como siempre y la
integración la arregla sola. **Nunca un patrón dinámico bajo una sección que
tenga páginas propias**: en Vercel se come esas páginas.

---

## Arrancar

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # build de producción en ./dist
npm run preview  # sirve el build
npm run audit    # auditoría del diseño (necesita preview en marcha)
npm run audit:menu # contraste del menú de cristal (idem)
npm run audit:redirecciones # las direcciones viejas (necesita un build hecho)
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
| Medida | 60–68 caracteres. Columna de 640 px, número marginal de 48 px — en la Home el número ya no está y el hueco tampoco; ver la enmienda del 21 sep 2026. |
| Movimiento | Máximo cuatro animaciones en la Home, dos en el resto. |
| Prohibido | Marquesinas, contadores, cursores propios, texto que se escribe letra a letra, tarjetas que se levantan, zoom automático, iconos, emojis, fondos grises de relleno. |

Todo esto está en `src/styles/tokens.css`. **Ningún valor suelto en los
componentes**: si hace falta uno nuevo, se añade como token.

### Enmiendas, con fecha

El sistema es de Emi y se puede cambiar. Lo que no se puede es cambiarlo sin
dejar constancia, porque si no la tabla de arriba deja de ser fiable. Hasta hoy
se ha tocado doce veces:

- **23 sep 2026 · La entrada de la Home tiene dos formas, y las fotos de
  Formaciones responden al cursor.** Lo pidió Adrián.

  **La entrada.** La firma sobre negro sale una vez por sesión, y las demás
  veces la Home aparecía de golpe: se iba a *Sobre mí*, se volvía, y la
  portada ya estaba puesta. Ahora, cuando la firma ya salió, la portada entra
  con **la escalera de *Sobre mí*** —cada renglón sube 16 px y se funde, 0,7 s,
  60 ms entre uno y otro—, y con ella el párrafo del video y el primer
  formulario, que es todo lo que se ve antes de la lámina. **No es una quinta
  animación**: es la misma entrada en su segunda forma, y nunca salen las dos
  en la misma carga. Las cuatro de la Home siguen siendo la entrada, las
  frases-ancla, el fondo del contrabajo y la lámina. Tampoco arranca sola en
  el sentido de la enmienda del 12 de agosto: la dispara la carga, igual que
  la firma.

  **Las fotos de Formaciones.** Al pasar el cursor por una ficha, su foto
  **toma color y se acerca un 4 % dentro de su marco**, con la curva y el medio
  segundo del retrato de *Sobre mí*. No cuenta contra el tope, por la enmienda
  del 20 de agosto: es respuesta a una acción. **Se acerca y no se levanta**,
  a diferencia del retrato: lo que se levantaría acá es la ficha entera, y
  eso es una tarjeta que se levanta, que el sistema prohíbe. Y **no es el
  «zoom automático» prohibido**: no arranca solo, lo dispara el cursor, y el
  marco no se mueve. En todas las fichas —al principio solo en las que son
  enlace; ver **Siete cambios de la tarde**—, solo con cursor de
  verdad o foco de teclado, y sin movimiento para quien lo pide, que se queda
  con el color.

- **21 sep 2026 · *Sobre mí* sube a dos animaciones, y su retrato responde al
  cursor.** Lo pidió Emi: «entra sin más, ease in, agrega animaciones, que se
  vea pro, la imagen al hacer hover que tome color y se levante un poquito
  solamente». La tabla dice «dos animaciones fuera de la Home» y la página
  tenía **una** —el revelado al bajar, que ahora además se aplica a los
  párrafos y al formulario, y eso no suma: es la enmienda del 31 de agosto,
  aplicar un movimiento que ya existe a más elementos—. La segunda es **la
  entrada**: al cargar, el titular y los renglones suben 16 px y se funden en
  escalera de 60 ms, y el retrato se funde sin subir. Cuenta como una: son dos
  `@keyframes` porque el texto y la foto no pueden hacer lo mismo —mover media
  pantalla pegada a tres bordes despega la regla del costado del borde de la
  ventana, y se lee como un fallo—, pero es un solo gesto y una sola curva, la
  del revelado (`--ease-reveal`).

  Queda **en el tope, no por debajo**: una animación más en *Sobre mí* es otra
  enmienda.

  **El hover del retrato no cuenta**, por la enmienda del 20 de agosto: es
  respuesta a una acción, de la misma familia que el subrayado de un enlace.
  Toma color —lo mismo que hace la lámina de la Home, solo que disparado por el
  cursor y no por el scroll, porque acá la foto está quieta mientras se lee la
  columna de al lado— y se levanta **un escalón de la rejilla, 8 px**. Ni uno
  más: a partir de ahí deja de ser un retrato en una página y empieza a ser una
  tarjeta, que es otro sistema de diseño. El hueco que abre por abajo es de
  papel, no de sombra — **el sistema sigue diciendo sombras cero y esta no es
  la excepción de la cápsula del menú**. Va dentro de `@media (hover: hover)`:
  en una pantalla táctil el `:hover` se queda pegado después de tocar y el
  retrato se quedaría a color y en el aire. Quien pide menos movimiento se
  queda con el color, que no es movimiento, y sin el salto.

- **21 sep 2026 · Las dos páginas de lectura se quedan sin numerales, y con
  ellos se va el hueco del margen.** Decisión de Emi: «no suma nada». Salieron
  primero de la Home —el `01`, el `02` y el `03`— y el mismo día de *Sobre mí*,
  que llevaba diez. **La tienda y el aula los conservan**, así que el patrón
  sigue en el sistema y lo que cambia es quién lo usa.

  **La consecuencia no es cosmética.** El hueco de 48 px existía para colgar
  de él el numeral, y de paso empujaba la columna de lectura 40 px a la derecha
  del centro de la página — un descuadre a propósito, anotado en **Decisiones
  ya tomadas**, que se justificaba porque ahí vivía algo. Vaciado, no lo
  justifica nada: la portada va centrada en la página y la columna no, y con
  el párrafo de apertura ya centrado el escalón se ve. Así que en las dos la
  columna vuelve al centro. Es `.row--flush` en `base.css`, y el formulario lo
  recibe por una prop (`flush`) porque el mismo componente lo usan también la
  tienda y el aula, **donde los 40 px siguen ahí y siguen siendo correctos**.

  Va con un segundo cambio de Emi el mismo día: **el párrafo de apertura deja
  de ser cuerpo y pasa al tamaño de los títulos de sección** (`--text-section`,
  26 → 32 px). A la medida de 640 px se partía en renglones demasiado cortos,
  así que a ese tamaño ocupa el ancho de la portada, 900 px. **Ningún token
  nuevo**: es el mismo tamaño del `h2` y el mismo ancho del hero.

- **11 sep 2026 · El aula se pinta con la ropa de la membresía, menos el
  cursor.** Segunda enmienda grande, y la hermana de la del 9 de septiembre:
  `/aulavirtual/escritorio/` y `/aulavirtual/curso/<slug>/`, con sus gemelas
  inglesas, **tampoco siguen la tabla de arriba**. Traen la crema `#faf7f1`, la
  tinta cálida `#17140f`, Hanken Grotesk y los botones de la carta con su
  relleno que nace bajo el cursor y sus notas musicales.

  La razón: la alumna que entra al aula **acaba de leer esa carta** y lleva un
  año entrando a esa casa. Si el aula se viera como el sitio público, notaría la
  costura justo al pasar de pagar a estudiar. La decisión del 31 de agosto —«el
  aula hereda el sistema de este sitio»— queda revocada, ahora también para el
  aula. Lo que se hereda es la carta, no la web.

  **Lo que NO se trajo, y es lo único que se dejó fuera: el cursor de clave de
  fa.** Lo pidió Emi. En una carta de ventas es una gracia que dura dos minutos;
  en el aula se pasan horas, se arrastran barras, se marcan casillas y se
  escribe, y el cursor del sistema es el que dice qué se puede hacer con cada
  cosa. Los dos SVG siguen en `public/img/` porque la carta los usa.

  El alcance: las cuatro rutas del aula. Ni un token nuevo en `tokens.css`, ni
  una regla nueva en `base.css`. El aula trae su propio marco —`layouts/Aula.astro`,
  que no usa `Base.astro`— y su propia hoja, `styles/aula.css`, cuyas reglas
  **cuelgan todas de `html.aula`** para ganarle por especificidad a
  `colors_and_type.css` sin depender del orden de carga. Fuera de esas rutas no
  se aplica nada de esto.

- **9 sep 2026 · La carta de la membresía queda FUERA del sistema, entera.** Es
  la enmienda más grande que se ha hecho, así que conviene decirla sin rodeos:
  `/productos/estudiemos-juntos/` y su gemela inglesa **no siguen la tabla de
  arriba**. Traen la crema `#faf7f1` en vez del papel `#FAFAF8`, Hanken Grotesk
  y Space Grotesk en vez de las tres familias del sitio, un cursor propio de
  clave de fa —que la tabla prohíbe—, notas musicales de colores, un contador de
  cuenta atrás —que la tabla también prohíbe— y bastantes más de dos animaciones.

  Lo pidió Emi con el kit de trasplante delante, y la razón es de negocio, no de
  gusto: esa carta lleva un año vendiendo y sus animaciones son parte de lo que
  vende. La decisión del 31 de agosto —«el aula hereda el sistema de este sitio,
  y la capa cálida de la academia se guarda sin enchufar»— **queda revocada para
  esta página, y solo para esta página**. La capa cálida ya no está guardada:
  está enchufada acá.

  El alcance es exacto y no se estira: **una ruta, en sus dos idiomas**. No hay
  ningún token nuevo en `tokens.css`, ni una regla nueva en `base.css`, ni un
  color de la academia en ningún otro componente; la carta trae su propio
  documento y sus propios estilos, y no toca ni es tocada por el resto del
  sitio. La costura que esto abre —una página que se ve de otra casa— es
  conocida y aceptada: se cierra el día que Emi quiera, quitando
  `cartaPropia: true` de la membresía en `src/data/aula.ts`, porque la versión en
  blanco y negro sigue escrita y funcionando debajo.

  Si mañana un curso quiere lo mismo, **es otra enmienda**. Esta no es un
  permiso general para salirse del sistema: es un trasplante concreto, con su
  kit, su inventario y su lista de comprobación.

- **31 ago 2026 · El aula se revela al bajar, y eso no suma una animación
  nueva.** Los bloques de la carta y las fichas del catálogo aparecen con el
  mismo fundido que ya tenían las frases-ancla: la misma clase, la misma curva,
  el mismo observador. La tabla dice «dos animaciones fuera de la Home» y el
  aula tiene **una**, aplicada a más elementos. Aplicar un movimiento que ya
  existe a más sitios no es añadir movimiento; añadir uno distinto sí, y eso
  sigue necesitando enmienda. La carta de la academia hace exactamente esto, así
  que además es lo que la lectora ya conoce.

- **31 ago 2026 · El radio y la sombra del menú valen para la cápsula de
  ingresar al aula.** La enmienda del 20 de agosto decía «solo para la cápsula
  del menú», y esto la amplía a un segundo objeto: el botón de arriba a la
  derecha de la tienda —hasta el 9 sep 2026 estuvo en el Aula Virtual—. No es un permiso nuevo, es el mismo: son los dos
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
                         emilse-hero.jpg, la lámina de la Home
                         about-me.jpg, el retrato de Sobre mí
                         emilse-membresia.jpg, el retrato de la carta
                         curso-diapason · curso-desde-cero ·
                         curso-vibrato .jpg, las fotos de los cursos
  components/
    Header.astro                   Cabecera: la firma centrada y el menú
    CabeceraSuelta.astro           La misma cabecera, para las páginas que
                                   no van en Base.astro: la carta de la
                                   membresía y el acceso al aula
    Footer · LangSwitch            Pie y conmutador ES/EN
    Logo.astro                     La firma de Emi, como máscara
    Intro.astro                    Animación de entrada (solo Home)
    Backdrop.astro                 El contrabajo tras el cristal (solo Home)
    Home.astro · About.astro       Los bloques de cada página
    Catalogo.astro                 La rejilla de productos de la tienda
    Producto.astro                 La carta de venta de un producto, con el
                                   sistema del sitio. Hoy sin ruta: la única
                                   carta escrita es la de la membresía, y esa
                                   va trasplantada
    membresia/Carta.astro          La carta de la membresía, traída entera de
                                   la academia. Imprime el documento completo
    aula/Escritorio.astro          El escritorio: retomar, membresía, mis cursos
    aula/Curso.astro               El reproductor: índice, clase, hilo de dudas
    aula/Boton.astro               El botón de la carta (relleno + flecha + notas)
    Compra.astro                   El bloque de precio y el botón de comprar
    EmailArchive.astro             Fichas del newsletter + <dialog>. Desde el
                                   21 sep 2026 NO SE USA en ninguna página:
                                   el copy nuevo de la Home se lleva por
                                   delante «Correos anteriores». Se guarda
                                   entero, con su colección, para cuando Emi
                                   lo quiera de vuelta
    SubscribeForm.astro            Campo de suscripción
    MediaSlot.astro                Hueco de imagen
  content/correos/       Un .md por correo y por idioma
  content.config.ts      Esquema del archivo del newsletter
  data/home.ts           Textos de la Home (es / en)
  data/about.ts          Textos de Sobre mí (es / en). Cinco tipos de bloque:
                         entrada con foto, prosa, frase-ancla —que admite
                         varias líneas—, formulario y testimonios. El de
                         testimonios está montado y sin usar: espera los de Emi
  data/aula.ts           El catálogo: los productos y sus cartas (es / en)
                         — la FACHADA, lo que se vende
  data/cursos.ts         Unidades, clases y videos de Bunny — lo que se COMPRA.
                         Se ata a data/aula.ts por el slug
  data/cortina.ts        Los textos de la cortina (es / en)
  lib/cortina.ts         La llave de la cortina: CORTINA_BAJADA, y cuándo baja
  middleware.ts          Pone la cortina: reescribe cada página en el build y
                         cierra /api/ con 503. Con la cortina subida, no hace nada
  lib/klaviyo.ts         El alta al newsletter. Solo servidor: la clave
                         privada de Klaviyo no sale de acá
  lib/membership.ts      Las fechas de las puertas y el alta al newsletter,
                         traídas de la academia con sus mismos nombres de
                         variable de entorno. Lo puede importar cualquiera
  lib/membership-server.ts  El pase de invitación. APARTE porque guarda un
                         SECRETO: solo lo importan rutas con prerender = false
  lib/stripe.ts          El cliente de Stripe, los dos Prices y el origen
                         público. Solo servidor
  lib/stripe-sync.ts     Espejar una suscripción en `subscriptions`. UPSERT,
                         y esa idempotencia es lo que deja que el webhook siga
                         viviendo en la academia
  i18n/ui.ts             Cadenas de interfaz + mapa de rutas
  i18n/aula.ts           Las cadenas y las rutas del aula, aparte: afuera se
                         habla de comprar y adentro de estudiar
  layouts/Base.astro     <head>, cabecera, pie, revelado de frases-ancla
  layouts/Aula.astro     El marco del aula: barra, pie, y `window.Aula` —el
                         almacén del progreso, maqueta de la base de datos
  pages/                 index · sobre-mi · en/index · en/about
                         cortina (lo que tapa todo mientras está bajada)
                         productos/index · productos/[producto]
                         productos/estudiemos-juntos (la carta trasplantada,
                           suelta y sin layout — ver más arriba el porqué)
                         en/products/index · en/products/[producto]
                         en/products/estudiemos-juntos
                         aulavirtual/index · en/classroom/index
                         aulavirtual/escritorio · aulavirtual/curso/[curso]
                         en/classroom/desk · en/classroom/course/[curso]
                         gracias · en/thank-you (después de pagar)
                         aulavirtual/pasar · en/classroom/handoff (el puente)
                         api/checkout · api/claim-account (el cobro, servidor)
                         api/suscribir (el alta al newsletter, servidor)
  styles/tokens.css      Los tokens del sistema
  styles/base.css        Reset y primitivas compartidas
  styles/aula.css        El sistema del aula: la crema de la membresía. Todo
                         cuelga de `html.aula` — ver la enmienda del 11 sep
public/logo.svg          La firma vectorizada. La usa Logo.astro de máscara
public/favicon.svg       La E del logo. Se adapta al tema del navegador
public/colors_and_type.css  Tipografías y tokens de la academia. Los piden la
                         carta trasplantada y el aula; el resto del sitio no
public/img/              foto.jpg, logo_emi_alpha.png y los dos cursores de
                         clave de fa: los recursos de esa carta
public/emi-city.jpg      El respaldo del onerror de la foto
docs/PORTAR-CARTA-DE-VENTAS.md  El kit del trasplante. Estaba en public/, que
                         lo habría publicado en la raíz del sitio
docs/UNIR-LAS-DOS-CASAS.md  Lo que hay que hacer FUERA del código para la
                         unión: variables de Vercel, Redirect URLs de Supabase
                         y la página que hay que pegar en el repo de la academia
docs/CONECTAR-KLAVIYO.md  Lo que hay que hacer FUERA del código para que el
                         newsletter dé de alta: la clave, la lista, la variable
                         de Vercel y el curl que confirma la API
docs/CONECTAR-EL-AULA.md  Lo que hay que hacer FUERA del código para que el
                         aula pida sesión y suscripción: las tres variables,
                         las Redirect URLs y el orden de los admins
supabase/set_admin.sql   Quién es admin. NO crea nada: el esquema ya existe en
                         el Supabase de la academia. Se ejecuta DESPUÉS de que
                         cada admin haya entrado una vez
scripts/audit.mjs        Auditoría de contraste y rejilla
scripts/audit-menu.mjs   Contraste del menú de cristal, con el panel abierto
scripts/redirecciones.mjs  Recorre las direcciones viejas contra la salida de
                         Vercel, como lo haría Vercel. Sin servidor ni red
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

⚠️ **Hoy no se ven en ninguna parte.** El copy nuevo de la Home (21 sep 2026)
se llevó por delante «Correos anteriores», que era la única ficha que los
sacaba. La colección, el esquema y `EmailArchive.astro` siguen enteros y
funcionando: devolverlos a la página es añadir un bloque a `data/home.ts` y su
`case` en `Home.astro`. Hasta que eso pase, dejar correos ahí es escribir para
un cajón.

### Poner un curso a la venta

Todo el catálogo de la tienda sale de `src/data/aula.ts`. Un curso pasa de
«Próximamente» a estar a la venta cambiando su entrada:

1. `estado: 'venta'` en vez de `'proximamente'`.
2. El `nombre`, el `resumen` de una línea, el `precio` y la `cadencia` («pago
   único, acceso de por vida»), **en los dos idiomas**.
3. La `foto`, importada desde `src/assets/img`. Sin ella la ficha dibuja el
   marco vacío con el texto de `fotoPie`, que también hay que escribir.
4. Una `pagina` con su `titulo`, su `subtitulo` y sus `bloques`. Hay nueve
   clases y se combinan en el orden que pida la carta:

   | Bloque | Para qué |
   |---|---|
   | `lede` | La apertura grande, en dos líneas |
   | `prose` | Párrafos. Uno puede ir `{ fuerte: true }` |
   | `anchor` | Una frase suelta, centrada, que separa tramos |
   | `hitos` | Una etiqueta y su párrafo, en filas |
   | `contraste` | Para quién es y para quién no, a dos columnas |
   | `lista` | Una enumeración con reglas |
   | `faq` | Preguntas y respuestas |
   | `pd` | La posdata firmada |
   | `news` | El pie: «¿aún no estás suscrito?» y su botón |
   | `cta` | El botón. `precio` es la ficha entera; `simple`, solo el botón |

5. Un `compra` con el texto del botón, lo que incluye, la nota corta y la letra
   pequeña.
6. `comprarHref` con el enlace de pago de cada idioma.

Con eso, la ficha del catálogo se vuelve un enlace y `getStaticPaths` genera
`/productos/<slug>/` y `/en/products/<slug>/` sola. **No hay que tocar
ninguna página.** Si falta la `pagina`, el producto no se genera aunque esté en
`'venta'`: es la red que impide publicar un enlace a una carta que no existe.

### Poner una imagen donde hay un marco vacío

Se importa la imagen y se le añade `src` — el `placeholder` se queda, porque
sigue siendo el texto de respaldo si algún día falta el fichero:

```astro
import retrato from '../assets/img/retrato.jpg';

<MediaSlot src={retrato} alt={t('media.portraitAlt')} placeholder={t('media.portrait')} />
```

`MediaSlot` la sirve optimizada, en densidad 2x y en blanco y negro.

**Si la proporción de la foto no es la del marco**, el marco recorta con
`object-fit: cover` y por defecto se queda con el centro. Cuando eso se lleva
justo lo que importa, se le dice qué salvar con `position`, que es un
`object-position` de toda la vida:

```astro
<MediaSlot src={retrato} … position="right center" />
```

Es lo que hace el retrato de *Sobre mí* (21 sep 2026): la foto es una
horizontal de 3:2 metida en un marco casi cuadrado, y con el recorte centrado
la voluta del contrabajo quedaba cortada. A la derecha, lo que se pierde es
calle vacía.

**En las páginas de lectura ya no queda ninguno.** El de *Sobre mí* tiene su
foto desde el 21 sep 2026 y el del video se quitó con el copy nuevo. Los que
siguen vacíos son los de la tienda: cinco fichas de curso esperando su foto,
que es contenido de Emi — ver **Pendiente → Contenido que falta**.

### Cambiar la foto de la lámina

La lámina es la foto de la Home, justo después del formulario. El fichero es
`src/assets/img/emilse-hero.jpg`: **1400 × 2104, vertical, a color** (desde el
21 sep 2026; antes fue `emilse-madrid.jpg`, horizontal).

- **A color, aunque se vea en blanco y negro.** El gris lo pone el CSS, porque
  el revelado necesita el color debajo para poder devolverlo. Si se sube ya
  desaturada, el efecto no tiene de dónde sacarlo.
- **1400 px de ancho.** La lámina se presenta a 432 px CSS como máximo —ver el
  tope de abajo—, que en densidad 2 son 864. Astro genera el 1× y el 2× (43 y
  176 kB en WebP); el original solo tiene que dar de sobra. Si algún día vuelve
  a ser horizontal y a ocupar la columna entera, el ancho de presentación sube
  a 640 y el original tiene que dar 1280.
- **Es la única imagen del sitio con `quality` escrito.** 70, en `Home.astro`.
  Por defecto Astro saca el 2× en 269 kB, el triple que el retrato de *Sobre
  mí*: es una fachada de piedra a contraluz y la textura no comprime. A 70 son
  176 y el recorte a tamaño real no enseña un solo artefacto. Con otra foto de
  menos grano, esto sobra y se quita.
- **El encuadre no se toca.** `aspect-ratio` en `Home.astro` vale exactamente lo
  que el fichero —`1400 / 2104`— para que el marco no vuelva a recortar por su
  cuenta. **Si se cambia la foto por otra de proporción distinta, hay que
  cambiar ese `aspect-ratio` con ella**, o el marco la recorta en silencio.
- **Y si es vertical, hay que mirar el tope de ancho.** `.plate__fig` lo deja en
  `min(100%, 27rem)`. Sin él, esta proporción a los 640 px de la columna da
  961 px de alto: más que la ventana de casi cualquier portátil, y la foto deja
  de verse entera. Los 432 la dejan en 649, que entra de una vez en una ventana
  de 768. **Con una foto horizontal ese tope sobra** —una horizontal a 640 px
  no pasa de 400 de alto— y se quita.

El original de la de hoy está en el commit `d9d369d`, en `public/image_hero_2.jpg`
(12,9 MB), y salió de `public/` el 21 sep 2026 al entrar en uso. Es la regla de
siempre: en `public/` se sirve en crudo al navegador, sin pasar por el
optimizador. Las fotos anteriores siguen en el historial: la horizontal de
Madrid en `d63b52b` (`public/image_hero_3.png`, 4,2 MB) y, antes de esa, el
retrato corto en `378eccb` (`public/image_hero.jpg`).

Para rehacerla desde el original:

```js
sharp(original)
  .rotate()                       // respeta el EXIF; una vertical sin esto sale tumbada
  .resize({ width: 1400 })
  .jpeg({ quality: 82, mozjpeg: true, progressive: true })
```

El texto del pie y el `alt` viven en `src/data/home.ts`, en el bloque `plate`.
**El `alt` describe la foto, así que se reescribe con ella** — el de hoy dice
«sosteniendo su contrabajo en horizontal delante de un portal de madera», que es
lo que se ve; el anterior decía «con su contrabajo al hombro», que ya no.
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

Estado en todas las rutas, a 1440 y a 390 px de ancho — vuelto a pasar el
9 sep 2026 con Productos y la puerta del aula recién hechas:

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

### La auditoría y el aula

`npm run audit` mide el sitio público, que va en rejilla de 8 px. **Las páginas
del aula dan decenas de avisos de rejilla, y son esperados**: el aula sigue la
base de la academia —`colors_and_type.css`—, que declara rejilla de 8 px *con
4 px para detalle fino*, así que valores como 12, 20 o 36 están dentro de su
sistema y fuera del de aquí. Es la misma frontera que abre la enmienda del
11 sep 2026.

Lo que sí hay que mirar en el aula, y tiene que salir en cero:

```bash
npm run audit -- http://localhost:4321/aulavirtual/escritorio/
npm run audit -- http://localhost:4321/aulavirtual/curso/curso-01/
```

- **CONTRASTE por debajo de AA** → cero. No es negociable.
- **CONTRASTE contra el fondo ya pintado** → cero.
- **ESPACIADOS fuera de la rejilla** → se leen, no se obedecen. Un valor que no
  sea múltiplo de 4 sí es un error.

⚠️ Ese aviso de contraste ya cazó uno de verdad: «Saltar al contenido» salió
tinta sobre tinta porque `.aula a { color: inherit }` le gana por especificidad
a `.skip`. Toda regla del aula que pinte un enlace va prefijada con `.aula`.

### La auditoría del menú

`npm run audit:menu` es la misma idea aplicada al panel del menú, que también
es translúcido y por el que también pasa la página. Abre el menú y mide sus
renglones sobre los fondos que existen: hoy la fotografía de la lámina y papel
liso.

```
peor caso de todos .......................... 6,58:1 ✓   (la lámina)
```

Fueron tres hasta el 21 sep 2026, y el tercero —el bloque negro del cierre— era
el peor con diferencia: 4,83:1, a un pelo de AA. Salió de la Home con el copy
nuevo de Emi y salió también de acá, porque no queda ninguna sección en tinta
plena por la que pase el menú. **El velo se eligió contra ese fondo**, así que
si algún día vuelve una sección oscura hay que devolver el escenario al script
antes de darlo por bueno: los 6,58:1 de ahora no dicen nada sobre ella.

La lámina se busca por selector (`.plate`) y no por una altura fija. Estaba a
700 px de scroll, y el copy nuevo la bajó: la medición se hacía sobre el papel
de encima y salía un número que no era el de la foto.

Sirve además para **elegir el velo**: con `VELO=66% npm run audit:menu` se mide
sin tocar el token. Así se encontró el suelo, entre 62 % (4,37:1, por debajo de
AA) y 66 % (4,66:1) — medido contra el bloque negro, que era el caso duro.

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

- **21 sep 2026 · El sitio sale al aire en `www.emilserios.com`, y el canónico
  lleva `www`.** El DNS pasa a Cloudflare, el ápice hace un 308 hacia `www` y
  `astro.config.mjs` deja de apuntar a `contrabajoenlaciudad.com`. **El canónico
  es con `www` y no al revés** porque es lo que sirve el sitio: apuntar los
  canónicos al ápice, que redirige, es pedirle a Google que adivine. Cómo quedó
  la zona, registro por registro, en **El dominio, y Edu → Cómo quedó**.

  **Se saltaron dos pasos del orden que este documento tenía escrito**, a
  propósito, para poder publicar el mismo día: el correo no se mudó y el dominio
  no se pushó. Ninguno de los dos rompe nada hoy —el correo no se tocó y el
  registro sigue vivo— pero **los dos bloquean el final del traspaso**, y hasta
  cerrarlos Edu no puede apagar el hosting.

- **21 sep 2026 · Los CNAME de correo se quedan proxied, por ahora.** Edu dijo
  que estaba bien y Adrián decidió seguirlo para no frenar la salida del sitio.
  **Es una decisión consciente y está fechada**, no un descuido: la advertencia
  se dio, con el mecanismo y el síntoma, y se optó por publicar. Lo que hay en
  juego —el DKIM de Emi, o sea que sus correos lleguen— y los cinco clics que lo
  arreglan están en **El dominio, y Edu → Los CNAME de correo quedaron
  PROXIED**. Si aparece el síntoma, no hay que investigarlo: está escrito.

- **21 sep 2026 · *Sobre mí* se reescribe entera, y la trayectoria deja de ser
  una tabla.** Copy nuevo de Emi, en los dos idiomas. Lo que sale, por decisión
  suya: **la ficha de trayectoria** —la tabla de «5 años / Docencia / 10+ años
  / Argentina / 20+ años»—, porque el texto nuevo cuenta lo mismo en prosa y
  tenerlo dos veces en la misma página es decirlo dos veces; y **el bloque del
  video**, con su marco vertical. Entra **el retrato**, que ya llegó, y el
  rótulo «Qué dicen mis alumnos» encima de los testimonios, que antes no tenían
  ninguno. (Ese rótulo y sus tres huecos duraron una tarde: **salieron el mismo
  día**, en la tanda siguiente, y esperan los testimonios de verdad. Ver
  **Pendiente → Contenido que falta**.)

  Dos cosas nuevas en los componentes, las dos porque el copy las pidió:
  `MediaSlot` acepta `position` para elegir qué salva el recorte, y el
  formulario acepta un rótulo (`label`) encima de la regla. En *Sobre mí* dice
  «Contrabajo en la Ciudad», porque ahí el campo llega después de mil palabras
  sobre Emi y la página todavía no ha nombrado el newsletter. En la Home no
  hace falta: el título ya lo dice.

  **Las frases-ancla admiten varias líneas** desde este copy: las tres
  lecciones de El Sistema son una lista, no un párrafo, y se leen como tres
  frases.

- **21 sep 2026 · Un solo buzón a la vista: `info@emilserios.com`.** Estaba en
  el pie `hola@contrabajoenlaciudad.com`, y en el mensaje de error de la
  suscripción la misma dirección. Las dos pasan a `info@emilserios.com`, que es
  la que ya usaba la carta de la membresía. ⚠️ **Es la dirección que todavía
  vive en el hosting de Edu** — ver **Pendiente → Bloquea el lanzamiento**. El
  sitio ya la muestra, así que mudarla dejó de ser una tarea de traspaso y pasó
  a ser una de correo que se pierde.

- **21 sep 2026 · La Home no lleva numerales, y su primer párrafo es una
  entradilla.** Segunda pasada de Emi sobre la portada, el mismo día. Tres
  cosas: fuera los `01`, `02`, `03` —«no suma nada»—, el párrafo de apertura al
  tamaño del título de sección, y el párrafo del video centrado, que alineado a
  la izquierda debajo de una portada centrada «parece desordenado». Lo que
  arrastra —la columna vuelve al centro de la página, porque el hueco del
  numeral ya no lo justifica nada— está en **El sistema de diseño → Enmiendas,
  con fecha**. *Sobre mí* no se toca: conserva numerales, hueco y sus 40 px.

- **21 sep 2026 · La Home es el copy de Emi y nada más.** Emi volvió a
  reescribir el texto de la portada, y esta vez la página se acorta: la
  historia del conservatorio pasa de seis párrafos a tres, el párrafo del video
  deja de citar el minuto `3:36` —solo queda el `4:04` en mono— y el remate ya
  no es una amenaza sino la letra pequeña, «Suscribirse es gratis, darse de
  baja también». En inglés el botón pasa de «Subscribe here» a «Sign up here»,
  que es como lo escribió ella; como la cadena es compartida, cambia también en
  *Sobre mí*.

  **Salen dos secciones enteras**, por decisión suya ese mismo día: «Correos
  anteriores» —el archivo del newsletter— y el cierre en negro. La página
  termina donde termina el copy: en el segundo formulario y esa línea. Lo que
  arrastra cada una está anotado donde toca — el archivo en **Recetas →
  Publicar un correo del newsletter**, el bloque negro en **La auditoría del
  menú**, que lo usaba como peor caso de contraste.

- **19 sep 2026 · Emi maneja su plataforma sola, y la línea está trazada.**
  Contenido —cursos, clases, precios, estados, cartas, personas y accesos— a la
  base de datos, y lo maneja ella desde un solo panel. Estructura —páginas,
  rutas, sistema de diseño, lógica de acceso— en código, y lo mantenemos
  nosotros. **Emi rellena plantillas; no inventa maquetación.** Las cinco capas
  en las que se construye están en **La plataforma → El panel de Emi**.

- **19 sep 2026 · El editor de cursos se escribe DESPUÉS de cargar el primero
  a mano.** No por ahorro sino por información: escribirlo antes de ver un curso
  real es adivinar qué campos necesita. La prueba llegó el mismo día — al ver el
  primer curso se dio por hecho que el modelo necesitaba un piso más, y lo que
  necesitaba era cambiar dos palabras.

- **19 sep 2026 · El primer curso se vende entero, no por niveles.** Sus tres
  niveles son **un solo producto**, con un precio y un derecho de acceso. Lo
  confirmó Emi. Es lo coherente con «los cursos se abren enteros al comprar, con
  acceso de por vida», y **cambiar esto después de vender sale caro**: habría
  que partir el producto y reconciliar quién compró qué.

- **20 sep 2026 · «Panel» es la consola de Emi y nada más.** El escritorio de
  la alumna, que hasta ese día vivía en `/aulavirtual/panel/`, se mudó a
  `/aulavirtual/escritorio/` y `/en/classroom/desk/`. Las direcciones viejas
  redirigen. Emi va a usar las dos pantallas el mismo día y no pueden llamarse
  igual.

- **20 sep 2026 · Al panel entran dos personas**, `emilserios.bass@gmail.com` y
  `adrianmendozam@gmail.com`, y nadie más. El mecanismo ya existe —
  `supabase/set_admin.sql` lleva esos dos correos y baja a miembro a cualquier
  otro admin— y **nunca se comprueba comparando correos en el navegador**:
  manda `role = 'admin'` con la RLS detrás. Ver **El panel de Emi → Quién
  entra**.

- **20 sep 2026 · El enlace de ida y vuelta entre el panel y el aula se
  conserva tal cual.** «Ver el aula →» arriba a la derecha en el panel, «←
  Volver al panel» en el aula, este último **oculto hasta que el script
  confirma que es admin**. Es como Emi trabaja hoy y no hay razón para
  cambiárselo.

- **19 sep 2026 · El vocabulario es el de Emi, y la palabra del grupo la escribe
  ella.** `Curso → Unidad → Clase` en el código; en pantalla, el título que Emi
  le ponga a cada unidad («Nivel 1 — Fundamentos»), sin ninguna palabra fija
  delante. Lo que Emi llama «módulo» es un video, o sea una clase. El porqué de
  «unidad» y lo que se tocó están en **El primer curso, y las palabras**.

- **19 sep 2026 · El hosting de Edu no se muda: se apaga, y de último.** Él
  ofreció mudarlo primero; eso apaga el plan de Hostinger y con él,
  probablemente, `info@emilserios.com` y quizá la zona DNS entera. **El correo
  se resuelve primero, siempre.** El orden completo está en **El dominio, y
  Edu**.

- **La tienda vive en `/productos/` y las cartas cuelgan de ella**, en
  `/productos/<slug>/`. Un solo recorrido: catálogo, producto, comprar. El
  slug de la sección se traduce —`/en/products/`— pero **el del producto no**:
  el slug es la identidad del producto, la misma que llevará su fila en la base
  de datos y la que Emi pegue en un correo. Un producto, un slug, dos idiomas.
  La membresía es `estudiemos-juntos`, que es su nombre, no `membresia`.

- **9 sep 2026 · Lo que se vende y lo que se compra son dos sitios distintos.**
  Hasta ese día el Aula Virtual era las dos cosas: el catálogo público y el
  nombre de lo que hay dentro. Ahora la tienda es **Productos**, abierta y sin
  sesión, y **el Aula Virtual es solo lo de dentro**, detrás del inicio de
  sesión, como funciona hoy la membresía. Las direcciones viejas de las cartas
  redirigen a las nuevas, y las redirecciones salen del catálogo, no de una
  lista escrita a mano.

  La puerta de ingresar **no se repite**: la cápsula de la cabecera sale en la
  tienda, que es donde entra quien ya compró y viene a comprar otra cosa, y no
  en `/aulavirtual/`, porque esa página entera ya es la puerta y tiene su botón
  en el cuerpo.

- **El revelado lleva una red de seguridad, y hacía falta de verdad.** El
  `IntersectionObserver` solo avisa cuando **cambia** si el elemento cruza el
  borde, y un salto de scroll mayor que la pantalla —una rueda rápida, la tecla
  Fin, un enlace a un ancla— lo lleva de estar debajo a estar encima en un solo
  fotograma. En los dos momentos está fuera, así que no hay cambio que avisar y
  el bloque **se queda invisible para siempre**. Con una frase-ancla por página
  casi no se notaba; con los dieciséis bloques de la carta pasaba en cuanto
  alguien bajaba con ganas, y se cazó midiendo, no mirando. La red es un barrido
  atado a un fotograma que descubre lo que ya quedó por encima del borde, y se
  desengancha solo cuando no queda nada. Vale para todo el sitio, no solo para
  el aula.

- **Cada producto lleva su foto, en una rejilla de tres columnas.** La forma la
  pidió Emi el 31 ago 2026 con el sitio viejo delante: imagen, título, texto y
  llamada. Lo que **no** se copió de esa referencia es la ropa — allí las fichas
  son cajas negras con esquinas redondeadas y botones de píldora, y acá el
  sistema dice radios cero y sombras cero. Así que la ficha no es una caja: es
  una columna con su foto enmarcada por una regla de 1 px, como los huecos de
  imagen del resto del sitio, y las fotos van en blanco y negro. **La referencia
  daba el orden de las piezas, no el estilo**, y eso no hizo falta enmendarlo.
  La ficha entera es la zona pulsable, no solo el nombre.

- **La carta de la membresía se trajo entera, sin reescribir una frase.** Es de
  Emi y lleva un año vendiendo; el trabajo era vestirla, no mejorarla. Se armó
  con bloques nombrados —apertura, prosa, descubrimientos, es-para-ti /
  no-es-para-ti, ficha de precio, posdata, preguntas— para que la carta de un
  curso se escriba combinándolos en otro orden. **Si una carta futura pide una
  forma que no está, se añade un tipo de bloque; no se mete maquetación dentro
  del texto.**

- **El botón de comprar aparece cuatro veces, y lo decide el texto.** En la
  carta original hay cuatro llamadas y acá también, porque quitarlas cambiaría
  la carta. Dónde van lo dice `data/aula.ts`, no el componente. Mientras el
  cobro vivió fuera, el aviso se dio **una sola vez**, en la primera —repetirlo
  cuatro veces es ruido, callarlo es dejar que la lectora descubra sola el
  cambio de dominio a mitad de una compra—. Desde el 22 sep 2026 el cobro es de
  esta casa y el aviso salió; **la regla de decirlo una vez se queda escrita**
  para el día que un curso cobre desde fuera.

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
  apagado a propósito, no roto, y el curso por salir es una ficha sin enlace.
  **Y desde el 21 sep 2026 su reverso:** un hueco anunciado vale mientras la
  página se monta, pero en un sitio ya publicado se enseña de uno en uno y no
  repetido. Salieron por eso cinco fichas de curso idénticas, los tres
  testimonios en cursiva y las dos redes que llevaban a la portada de su
  plataforma. «Aula Virtual» estuvo apagada en el menú hasta el 31 ago 2026, que es
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
- **La apertura va en columna, y el formulario siempre justo encima de la
  lámina.** Decisión de Emi, 13 ago 2026, después de probar la alternativa. La
  portada va centrada arriba; el formulario y la lámina siguen en la rejilla de
  lectura, uno debajo del otro. Nada en paralelo. El 21 sep 2026 el copy nuevo
  metió el párrafo del video entre la portada y el formulario —el orden es
  título → subtítulo → párrafo del video → formulario → lámina—, porque es ahí
  donde Emi puso el «[Acá te suscribes]». **Lo que no se movió es el par
  formulario → lámina**, que es lo que esa decisión protege: la foto no puede
  quedar por encima del formulario ni pegada al título, o la página pasa a ser
  sobre ella y no sobre el newsletter.
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
  subtítulo y el párrafo de entrada van centrados en la página. Llevó encima un
  numeral `01` centrado en vez de al margen, el mismo patrón de las frases-ancla
  —y del cierre en negro mientras existió— para los momentos que no se leen en
  columna; el numeral salió el 21 sep 2026 con todos los demás de la Home.

  **Ojo con los 40 px al medirlo, que ahora dependen de la página.** La columna
  de lectura se va 40 px a la derecha del centro cuando el numeral vive en el
  margen izquierdo: pasa en la tienda y en el aula, y ahí es a propósito, no un
  descuadre. **En la Home y en *Sobre mí* ya no pasa** — sin numerales no hay
  hueco, y la columna comparte eje con la portada. Ver la enmienda del 21 sep
  2026 en **El sistema de diseño**.
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

- [ ] **⚠️ Las variables de Stripe en Vercel, o el botón de comprar da un 500.**
      Desde el 22 sep 2026 `/api/checkout` vive acá, y **sin
      `STRIPE_SECRET_KEY` y `STRIPE_PRICE_STANDARD` no crea ninguna sesión de
      pago**: contesta 500 con el motivo escrito en pantalla. Los valores son
      **los mismos que ya están en el proyecto de Vercel de la academia** — se
      copian, no se crean. Van también `PUBLIC_SITE_URL`
      (`https://www.emilserios.com`, **con `www`**) y
      `SUPABASE_SERVICE_ROLE_KEY`. La lista entera, con el porqué de cada una,
      está en `docs/UNIR-LAS-DOS-CASAS.md`.

      Hoy esto no se ve porque **las puertas están cerradas hasta el 1 de
      octubre** y el checkout corta antes de mirar a Stripe — sale la pantalla
      de «puertas cerradas», que es lo correcto. **El 1 de octubre deja de
      taparlo.**

- [ ] **Ejecutar `supabase/set_admin.sql`.** Es lo único que queda del paso 3:
      el aula **ya está conectada y se entra** (probado el 22 sep 2026), pero
      sin esto nadie es admin y `/panel/` no se abre para Emi.

      ⚠️ **Antes de ejecutarlo, comprobar en Supabase → Users cuál es el correo
      real de Emi.** El script tiene escrito `emilserios.bass@gmail.com` y en la
      lista se veía un `emilse.art@gmail.com`. Si no coincide, se edita el array
      del inicio del fichero; si no, el script aborta sin tocar nada — que es lo
      que tiene que hacer.

      ⚠️ **Y que Emi haya entrado una vez**, o su perfil no existe todavía y el
      script también aborta.

      Lo que ya quedó hecho, por si hay que rehacerlo: las tres variables de
      Vercel —`PUBLIC_SUPABASE_URL` (¡la RAÍZ, sin `/rest/v1`!),
      `PUBLIC_SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY`—, las cuatro
      Redirect URLs y el Site URL. Todo en `docs/CONECTAR-EL-AULA.md`, con los
      cuatro casos del candado y la tabla de diagnóstico.

      ⚠️ **Lo que NO hay que hacer: redirigir `emilseriosacademy.com`.** Mata el
      webhook de Stripe, el aula de la membresía y el puente de traspaso.

- [ ] **Pegar el puente en el repo de la academia.** La página
      `emilseriosacademy.com/pasar/` está escrita entera, lista para pegar, en
      `docs/UNIR-LAS-DOS-CASAS.md`. Sin ella, la mitad de acá no recibe nada.

- [ ] **Decidir las fechas de las puertas de la membresía en ESTE proyecto.** La
      carta trasplantada trae `src/lib/membership.ts` con las mismas dos fechas
      que la academia y los mismos nombres de variable —`MEMBERSHIP_CLOSES_AT` y
      `MEMBERSHIP_REOPENS_AT`—, pero en Vercel hay que ponerlas **también acá**;
      sin ellas manda el valor por defecto del fichero, que es el ciclo de
      septiembre de 2026. Hoy eso deja la carta con las puertas cerradas hasta el
      1 de octubre, que es lo correcto — pero el mes que Emi cambie el ciclo y
      solo lo cambie en una casa, la carta invitará a entrar por una puerta que
      el checkout tiene cerrada.

      ⚠️ **Desde el 22 sep 2026 esto pesa más, no menos.** Ahora las dos fechas
      mandan **acá** sobre la carta Y sobre `/api/checkout` —el cobro de verdad,
      el que cobra o no cobra—, y **allá** sobre el webhook y su copy. El
      desdoble desaparece el día que el webhook se mude; hasta entonces, **se
      cambian en los dos proyectos de Vercel o no se cambian en ninguno**.

- [ ] **⚠️ El newsletter: la clave está, falta la prueba.** ✅ `KLAVIYO_API_KEY`
      puesta en Vercel el **23 sep 2026**, en Production y Preview, con los
      tres permisos (Adrián). ⏸️ **La prueba se hace al subir la cortina**,
      junto con la bienvenida de siete correos: decisión de Adrián del mismo
      día. Los pasos están arriba del todo, en **Lo que viene → 4**. Lo de
      abajo queda como referencia, por si hubiera que rehacer la clave.

      El código está hecho desde el 22 sep 2026 —ver **El newsletter,
      conectado**—. Sin la clave el formulario no miente, pero tampoco
      suscribe a nadie.

      La clave se saca de klaviyo.com → Settings → API keys → Create Private
      API Key → **Custom Key**, con permiso de escritura sobre **Lists,
      Profiles y Subscriptions** (nunca «Full Access»). ⚠️ **Sin
      Subscriptions contesta 403**: la guía pedía solo dos hasta la noche del
      22 sep 2026, así que si la clave ya se creó, hay que editarla. **Sin
      prefijo `PUBLIC_`**, o viajaría en el HTML. Y hay que **redesplegar**:
      Vercel no aplica una variable nueva al despliegue que ya está en el
      aire.

      El ID de la lista NO hace falta ponerlo: por defecto es `SaE8Px`, la
      lista real del newsletter.

      **Antes de darlo por bueno, correr el `curl` de
      `docs/CONECTAR-KLAVIYO.md`.** La forma del cuerpo ya está comprobada
      contra el SDK oficial; el `curl` comprueba la clave y sus permisos en
      diez segundos.

      ⚠️ **Probarlo en local no prueba nada:** en `astro dev` sin clave el
      formulario dice «Listo» a propósito, para poder revisar el diseño. La
      comprobación de verdad es ver el correo dentro de la lista en Klaviyo.

- [ ] **Apagar la integración de WooCommerce en Klaviyo.** Es la que le manda a
      Emi el aviso «Klaviyo ya no puede conectarse a WooCommerce». No se
      reconecta: la tienda ya no existe y los cobros son de Stripe. Antes,
      mirar que ningún flujo activo arranque con un evento de WooCommerce, y
      que el de bienvenida arranque con **«Added to list» → `SaE8Px`**. Paso a
      paso en `docs/CONECTAR-KLAVIYO.md`.

- [ ] **Los cinco CNAME de correo están PROXIED en Cloudflare.** **Bajó de
      urgencia el 22 sep 2026:** Adrián y Emi se escribieron y todo llegó a la
      bandeja de entrada, en las dos direcciones, así que el síntoma —lo que
      ella envía cayendo en spam— **no está**. Lo que queda es saber si el
      DKIM pasa o si el correo se sostiene solo en el SPF: treinta segundos
      con «Mostrar original» en Gmail, explicado en **La prueba del 22 de
      septiembre**. El arreglo, si hace falta, son cinco clics; el detalle completo, con los nombres de los
      registros y cómo comprobarlo, está en **El dominio, y Edu → Los CNAME de
      correo quedaron PROXIED**. Se dejó así por decisión de Adrián y Edu para
      no frenar la salida del sitio — **no es un olvido, es una deuda con
      fecha.**

- [ ] **Confirmar a nombre de quién quedó la cuenta de Cloudflare.** La zona ya
      vive ahí, así que esto dejó de ser una pregunta previa y pasó a ser una
      comprobación: si la cuenta es de Edu, se cambió una dependencia por otra y
      no se ganó nada. Si es de Adrián, está bien para trabajar pero hay que
      pasarla a Emi antes de cerrar el traspaso.

- [ ] **El listado de URLs publicadas del WordPress viejo.** Pedírselo a Edu
      **ya**. Desde el 21 sep 2026 el sitio viejo no se ve —el `www` apunta a
      Vercel— y cada enlace que la gente tenga guardado cae en un 404. Con la
      lista se pueden montar los 301; sin ella, no. **Se pierde para siempre el
      día que él borre el hosting.**

- [ ] **El push del dominio a una cuenta de Namecheap de Emi.** Es lo que cierra
      el tema y **no lo resuelve Cloudflare**: delegar el DNS arregla lo técnico,
      pero el registro sigue en la cuenta de Edu. Mientras esté ahí, Emi está a
      una renovación no pagada de perder su propio nombre.

      ⚠️ **Subió de urgencia el 21 sep 2026.** Hasta ese día era un dominio con
      un WordPress viejo; desde ese día **es la dirección pública del negocio de
      Emi**, con su sitio, su newsletter y su aula colgando de ella. Adrián tiene
      acceso a la cuenta de Namecheap, que sirve para trabajar pero no es lo
      mismo que ser el titular. Hace falta que Emi tenga cuenta propia de
      Namecheap y que Edu haga el push — instantáneo, gratis, sin bloqueo ICANN.
      La mecánica está en **El dominio, y Edu**.

- [ ] **Mudar `info@emilserios.com` fuera del Hostinger de Edu.** Dónde vive ya
      se sabe —en Hostinger, en el plan de él— y el 21 sep 2026 se decidió
      dejarlo ahí para no frenar la salida del sitio. **Sigue siendo el paso que
      bloquea el final del traspaso:** es el `reply-to` de todos los correos de
      la academia, el canal de rescate el día que la membresía tenga que volver
      a iniciar sesión, y desde el 21 sep 2026 **la dirección que el sitio
      muestra en el pie de todas las páginas** y a la que le pide a la gente que
      escriba si falla la suscripción.

      Mientras el buzón esté en el plan de Edu, **él no puede apagar el hosting**
      y Emi depende de que él lo siga pagando. Nada se toca hasta que llegue un
      correo de prueba al buzón nuevo. Falta además un dato de la llamada:
      **cuántos buzones hay y quién los paga.**

      ✅ **Recibe y envía:** comprobado el 22 sep 2026, cuando Adrián le
      escribió a Emi y la respuesta llegó a su bandeja de entrada. Si la
      prueba fue a otra dirección del dominio y no a `info@`, conviene mandar
      uno a `info@`: es la que el sitio enseña cuando falla la suscripción.

- [ ] **Decidir qué pasa con `contrabajoenlaciudad.com`.** Quedó abierto el
      31 ago 2026 y sigue abierto: falta saber si se redirige a `emilserios.com`,
      si se queda como marca de la newsletter, o si se suelta. **El código ya no
      espera esa decisión**: `astro.config.mjs` pasó a
      `site: 'https://www.emilserios.com'` el 21 sep 2026, el día que el dominio
      se puso en el aire.

### El aula, para que deje de ser maqueta

Por orden: sin lo primero no hay nada que ver, y sin lo segundo no hay a quién
enseñárselo.

- [x] **Pasar los videos de Vimeo a Bunny Stream.** Hecho por Emi; confirmado el
      19 sep 2026. La migración está terminada.

- [ ] **El identificador de la biblioteca de Bunny.** Va a Vercel como
      `PUBLIC_BUNNY_LIBRARY`, y cada clase estrena su `bunny` —el GUID del
      video— en `src/data/cursos.ts`. Sin él, todas las clases se ven como marco
      vacío, que es lo que hay hoy aunque los videos ya existan. **Y hay que
      añadir `emilserios.com` a los *allowed referrers* de la biblioteca**, o los
      embeds se bloquean aunque el código esté bien: es la misma trampa que ya
      tiene anotada Vimeo.

- [ ] **Opcional: el script que genera la estructura del curso desde la API de
      Bunny.** Lista los videos de la biblioteca con GUID, título, duración y
      colección. Con doce clases en dos idiomas **ya no hace falta** —copiar
      veinticuatro GUID es una tarde—, pero evita erratas y sirve igual para los
      otros dos cursos. Ver **El primer curso, y las palabras**.

- [ ] **Probar el puente con el reproductor de Bunny contra un video real.**
      Está escrito contra su documentación (`player.js` por `postMessage`) y
      **nunca se ha ejecutado con un video**. Hay que comprobar dos cosas: que
      llegan los avisos de `timeupdate` y que `setCurrentTime` salta de verdad.
      Vive entero en la función `puente()` de `src/components/aula/Curso.astro`
      y se arregla ahí y en ningún otro sitio. Si falla, el aula sigue
      sirviendo: lo que se pierde es el guardado automático, no la clase — por
      eso el botón de marcar a mano nunca se esconde.

- [ ] **El contenido de verdad de los cursos.** Las tres unidades y las once
      clases de `curso-01` son **de muestra**: están escritas con la forma que
      tienen los cursos de Emi para que el diseño se juzgue con textos de largo
      realista, pero los títulos son marcadores. Del primer curso ya se sabe el
      esqueleto —**3 unidades · 4, 5 y 3 clases · ES y EN**— y los videos están
      en Bunny; faltan los títulos, el orden fino y el material descargable.

- [x] **Corregir la nomenclatura de los cursos.** Hecho el 19 sep 2026:
      `Modulo` → `Unidad` y `Leccion` → `Clase` en los tipos, los componentes,
      el CSS, los `id` de muestra y las dos lenguas, y fuera la palabra fija
      «Módulo» del reproductor. Ver **El primer curso, y las palabras**.

- [x] **¿Los tres niveles son un producto o son tres?** Uno solo. Confirmado por
      Emi el 19 sep 2026.

- [x] **¿Un módulo agrupa clases, o el módulo *es* la clase?** Es la clase — un
      video. Confirmado por Emi el 19 sep 2026, y de ahí salió el cambio de
      vocabulario.

- [ ] **El cuarto estado del catálogo: `borrador`.** Emi tiene tres cursos
      completos y va a publicarlos de a uno, así que un curso tiene que poder
      estar **cargado entero y no verse**. Hoy `src/data/aula.ts` solo conoce
      `venta` y `proximamente`; hacen falta cuatro. La tabla está en **El panel
      de Emi**.

- [ ] **Sacar el progreso del navegador.** Hoy vive en `localStorage`, que es de
      un equipo y se va con los datos del sitio. El día que haya sesión, el
      avance y las preguntas se mudan al servidor. Está preparado: todo pasa por
      `window.Aula` en `src/layouts/Aula.astro`, y las formas guardadas ya son
      las filas de las tablas futuras. **Ese día se cambia ese bloque y nada
      más.**

- [ ] **El otro lado del hilo: el panel de Emi y los correos.** Una pregunta sin
      respuesta no es una función, es un buzón roto. Hacen falta las dos
      direcciones —aviso a Emi cuando entra una duda, aviso a la alumna cuando
      Emi contesta— y la pantalla donde Emi las lee y responde. Sigue en pie lo
      decidido el 31 de agosto: en el hilo de un curso Emi puede responder con
      video y con audio.

- [ ] **Que el aula pida la sesión acá, contra el MISMO Supabase de la
      academia.** No se migra nada ni se crea un proyecto nuevo: se añade
      `emilserios.com` a Site URL y Redirect URLs, y listo. El plan entero —las
      tres capas para que reentrar cueste un clic, el orden de los seis pasos y
      las tres trampas— está en **La plataforma → La mudanza de la sesión**.

- [ ] **El puente de traspaso en la academia** (`/pasar/`), que es lo que
      convierte el deslogueo forzoso en un clic. Vive en el repo de la
      membresía, no en este, y solo sirve mientras el dominio viejo esté vivo.

- [ ] **Las tipografías del aula vienen de Google Fonts.** `colors_and_type.css`
      las trae con un `@import` remoto, igual que en la carta trasplantada,
      mientras el resto del sitio las sirve desde `src/assets/fonts/`. Funciona,
      pero es una petición bloqueante a un tercero en la pantalla donde la
      alumna pasa más tiempo — y un fallo de red la deja con la tipografía del
      sistema. Cuando toque, Hanken Grotesk se descarga y se sirve desde acá
      como las otras tres.

### Contenido que falta (de Emi)

- [ ] **Los siete correos de bienvenida** (pedido del 23 sep 2026). Es una
      serie en Klaviyo, no código; los textos los tiene Emi. Cuando exista, la
      Home tiene que dejar de prometer «un correo de bienvenida con un video»
      (`src/data/home.ts`).
- [ ] **El resto de copies nuevos.** Emi los cambió todos el 23 sep 2026; han
      entrado los de Formaciones y la carta de la membresía.
- [ ] **Cuatro decisiones de la carta nueva**, que quedaron abiertas en el
      PR #43:
      - **El video de un minuto** salió porque no está en el copy nuevo. Si lo
        quiere, hay que decir dónde va.
      - **Dentro del aula, el enlace a la tienda sigue diciendo «Tienda»**
        (`app.store` y `desk.storeCta` en `src/i18n/aula.ts`). ¿Pasa a
        «Formaciones»?
      - **El testimonio de Sergio dice «Esta buenisimo»**, sin tildes: está
        tal cual lo pegó Emi. Corregirlo es una línea.
      - **Al de Laura en inglés se le quitó el «Yes,»** del principio para que
        coincida con el español. Confirmar.
- [x] **`public/image_hero_2.jpg` (12,9 MB) — resuelta el 21 sep 2026.** Era la
      foto vertical de Emi en la calle, subida sin usar y pesando en `public/`,
      que va tal cual al CDN sin pasar por el optimizador. **Ahora es la lámina
      de la Home**: se reescaló a `src/assets/img/emilse-hero.jpg` (1400 px,
      558 kB de origen, 43 y 176 kB en WebP al servirse) y el original salió de
      `public/`, junto con la copia pequeña que Emi dejó en `public/img/`. Los
      dos siguen en el historial —commit `d9d369d` y `722b739`— y la receta para
      rehacerla está en **Recetas → Cambiar la foto de la lámina**.

- [x] **Retrato con el contrabajo para *Sobre mí*.** Llegó el 21 sep 2026 como
      `about_me.jpg` y vive en `src/assets/img/about-me.jpg`: **2048 × 1362, a
      color**, un primer plano de Emi en la calle con la voluta al hombro. El
      marco lo pone en blanco y negro como el resto. Es una horizontal en un
      hueco casi cuadrado, así que va recortada a la derecha; ver **Recetas →
      Poner una imagen donde hay un marco vacío**.
- [ ] **Video «Viaje en el tiempo»** (2:41) y su fotograma. ⚠️ **Se quedó sin
      sitio donde ir** el 21 sep 2026: el copy nuevo de *Sobre mí* no lo
      menciona y el bloque con su marco vertical se quitó. Si el video llega,
      antes hay que decidir dónde va y escribir el texto que lo presenta.
- [ ] **Los tres correos reales.** Los N.º 40, 41 y 42 tienen asunto y adelanto
      de verdad, pero el cuerpo es de muestra — marcados `borrador: true`.
      **Sin prisa desde el 21 sep 2026:** el copy nuevo se llevó «Correos
      anteriores» de la Home y ahora mismo no hay ninguna página que los
      muestre. Dejan de hacer falta hasta que Emi quiera el archivo de vuelta.
- [ ] **Los tres testimonios** de *Sobre mí*. ⚠️ **El bloque salió de la página
      el 21 sep 2026** y está esperando: los tres huecos en cursiva que decían
      «testimonio pendiente» valían mientras la página se montaba, pero el sitio
      ya está publicado y un visitante no tiene por qué leer nuestras notas
      internas. **Volver es una sola línea de trabajo**, no un rediseño: el tipo
      `testi`, su caso en `About.astro` y su CSS siguen puestos y sin tocar, así
      que basta con escribir el bloque en `src/data/about.ts` —la forma exacta
      está anotada ahí mismo, donde estaba— en los dos idiomas.
- [ ] **Enlaces reales de Instagram y YouTube.** ⚠️ **Los dos salieron del pie
      el 21 sep 2026.** Apuntaban a `instagram.com` y `youtube.com` —la portada
      de cada plataforma, no las cuentas de Emi—, y un enlace que no lleva a
      ninguna parte es peor que no tenerlo. Vuelven en cuanto lleguen las
      direcciones de verdad, y entonces con `rel="me"`, que es lo que ata un
      perfil a su dueño. Son dos líneas en `Footer.astro` y sus dos rótulos en
      `src/i18n/ui.ts` —`footer.instagram` y `footer.youtube`, que también
      salieron—.
- [ ] **El nombre, el precio, el enlace de pago, la foto y la carta del PRIMER
      curso.** Es lo único que le falta a la página de Productos para dejar de
      ser un catálogo de marcadores: **desde el 21 sep 2026 queda una sola ficha
      de curso** —«Curso 1», con el marco de la foto vacío y «Próximamente», sin
      enlace, porque no hay nada a lo que enlazar—. Estuvieron las seis, y las
      seis eran el mismo hueco repetido: seis copias de un hueco no anuncian
      seis cursos, anuncian que la tienda está vacía. Hace falta el nombre, una
      línea de resumen, el precio, **una foto**, **el enlace de pago** —Stripe o
      PayPal, pago único— y la carta de ventas. En cuanto lleguen se escriben en
      `src/data/aula.ts` y su página de ventas aparece sola, con su botón; no hay
      que tocar ninguna página. La receta está en **Recetas → Poner un curso a
      la venta**.

      **Solo uno sale a la venta ahora** (19 sep 2026). Los otros dos se montan
      y se quedan en `borrador` hasta que Emi tenga su proceso de venta de cada
      uno; **eso es lo que está esperando**, no el código.

- [ ] **La estructura de los otros dos cursos.** Emi tiene **tres cursos
      completos** (19 sep 2026) y solo va a poner **uno a la venta ahora**; los
      otros dos se montan y se dejan en `borrador`, listos para que ella los
      publique el día que tenga su proceso de venta. Del primero ya está el
      esqueleto; de los otros dos falta todo. El desajuste del número —seis
      huecos en el catálogo contra tres cursos reales— **se resolvió el 21 sep
      2026 por el otro lado**: el catálogo anuncia uno. Los que falten vuelven
      de uno en uno, y volver es añadir su número en la última línea de
      `src/data/aula.ts` (`[1, 2].map(proximos)`); pero el que entre así sigue
      siendo un marcador, y lo que de verdad lo publica es escribirle su
      `copia`.

      ⚠️ `curso-01` no es decorado: es el slug con el que `cursos.ts` ata el
      curso de muestra del aula, y el que lleva la alumna de prueba en su
      escritorio. Quitarlo del catálogo deja ese escritorio sin nada que
      enseñar.
- [ ] **Los correos de quienes ya compraron un curso** (unas 5 personas), para
      concederles el acceso a mano en la plataforma nueva. Adrián los pasa en
      cuanto los tenga (19 sep 2026).

### Próximos PRs

- [ ] **Mudar el webhook de Stripe, y con él el correo de bienvenida.** Es la
      segunda mitad de **La unión de las dos casas**, y **tiene un orden que no
      se puede saltar**:

      1. arreglar el DKIM —los cinco CNAME proxied, arriba—;
      2. verificar `emilserios.com` en Resend;
      3. traer `/api/stripe-webhook`, `welcome-email.ts` y `email.ts` de
         `emilse_rios_membresias`;
      4. endpoint nuevo en el panel de Stripe y `STRIPE_WEBHOOK_SECRET` nuevo
         en Vercel.

      Hacer el 3 y el 4 sin el 1 y el 2 significa que **alguien paga y no
      recibe su correo de bienvenida**. Mientras tanto no hay prisa y no hay
      nada roto: el webhook de la academia escribe en el mismo Supabase y su
      `UPSERT` es idempotente. Con esto desaparece además el desdoble de las
      fechas de las puertas.

- [ ] **Cierre para producción.** `sitemap.xml`, `robots.txt`, imagen de Open
      Graph, datos estructurados y página 404. Es el candidato natural al
      siguiente PR si el proveedor de correo sigue sin decidirse.
- [ ] **Comprobación de tipos en el build.** Hoy Astro transpila sin verificar:
      un error de tipos no rompe el despliegue, pero tampoco avisa. Añadir
      `@astrojs/check` y un `npm run check`.
- [ ] **Mudar el código de la membresía a este repo.** El repositorio ya está
      localizado y leído entero (`aguacateconqueso-projects/emilse_rios_membresias`,
      31 ago 2026) — ver **La plataforma → El código de la membresía, ya leído**.
      **Es el siguiente PR y no depende de Edu.** Es la capa A de **El panel de
      Emi**, y lleva dentro, en este orden: el adaptador de Vercel, los tres
      ficheros de Supabase, la tabla `entitlements` con `has_active_sub()`
      reescrita encima —una función, no siete migraciones— y el panel mudado tal
      cual, partido en un componente por pestaña. Al terminarlo, **la membresía
      ya vive en `emilserios.com`**.

- [x] **Liberar la palabra «panel».** Hecho el 20 sep 2026, antes de la capa A:
      el escritorio de la alumna vive en `/aulavirtual/escritorio/` y
      `/en/classroom/desk/`, las direcciones viejas redirigen, y `/panel/` queda
      reservado para la consola de Emi.

- [ ] **Poner los dos admins en el Supabase de la academia.** Emi y Adrián
      tienen que entrar una vez cada uno por la pantalla de acceso —el perfil se
      crea en ese momento— y después se ejecuta `supabase/set_admin.sql`, que
      aborta sin tocar nada si falta alguno de los dos perfiles. Ver **El panel
      de Emi → Quién entra**.

- [x] **El adaptador de Vercel.** Hecho el 20 sep 2026, con el mismo patrón de
      la academia: `output: 'static'` y `prerender = false` solo donde haga
      falta. De regalo, las redirecciones pasaron a ser 301 de servidor.

- [ ] **Poner las dos variables de Supabase en Vercel** —`PUBLIC_SUPABASE_URL` y
      `PUBLIC_SUPABASE_ANON_KEY`— y **añadir las Redirect URLs** en Supabase →
      Authentication → URL Configuration: el dominio nuevo y la URL de Vercel,
      con `…/aulavirtual/nueva-clave/` y `…/en/classroom/new-password/`. Es
      aditivo: la academia sigue igual. **Sin esto, el aula queda en modo
      maqueta** y lo dice en pantalla.

- [ ] **Cerrar la puerta del modo maqueta antes de que entre el curso de
      verdad.** Hoy, si faltan las variables de Supabase, el aula se deja mirar
      sin sesión — y está bien, porque el contenido es de muestra y va escrito
      en el HTML, así que el portero no esconde nada que no se vea igual con la
      consola abierta. **El día que entre el curso real eso se invierte:** «sin
      backend» tiene que significar cerrado, y las clases tienen que llegar por
      consulta a Supabase con la RLS decidiendo, no horneadas en la página. Es
      lo que cierra la capa B.

- [ ] **La tabla `entitlements` y reescribir `has_active_sub()` encima.** Salió
      de la capa A a propósito: esa función es la puerta de una membresía que
      **está cobrando ahora mismo**. Va en su propio PR, revisada despacio, y
      **antes hay que decidir lo de `trialing`** — `subGrantsAccess()` da acceso
      a `trialing` y `has_active_sub()` no; hoy no está roto porque no hay
      pruebas, y no se despierta sin decidirlo.

- [ ] **Traer las tres pestañas del panel de la academia** —Membresía, Miembros
      y Foro— cada una en su componente. El armazón de `/panel/` ya está y las
      anuncia apagadas.

- [x] **Aula Virtual, la fachada.** Hecho el 31 ago 2026: el catálogo con los
      siete productos, la carta de la membresía, el botón de comprar y la puerta
      de ingresar, en los dos idiomas. Sin backend. La opción del menú dejó de
      estar apagada. Ver **La plataforma → La tienda, y el recorrido de compra**.

- [x] **La tienda se separa del aula.** Hecho el 9 sep 2026: el catálogo y las
      cartas se mudaron a **Productos** —`/productos/` y `/en/products/`—, que
      es una página del sitio como Sobre mí, y el Aula Virtual quedó detrás del
      inicio de sesión. Las direcciones viejas redirigen. Sigue sin haber
      backend: la sesión que abre la puerta es la de la academia.

- [ ] **Que el aula pida la sesión acá.** Hoy `/aulavirtual/` es una puerta
      honesta, no un candado: el botón sale a `emilseriosacademy.com/entrar/`,
      que es donde está la sesión de verdad. Nada de este repo está protegido,
      porque nada de lo de dentro vive todavía en este repo. Va con la mudanza
      del código de la membresía, no antes: poner un formulario de acceso acá
      sin nada detrás sería una puerta pintada en la pared.

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

- **Los 404 de direcciones del WordPress viejo son normales.** En los logs de
  Vercel salen cosas como `GET /podcast/create-success-happiness-and-fulfillment/`
  → 404, con referer `emilserios.com/podcast/…` y un bot como agente
  —PetalBot, el buscador de Huawei, el 23 sep 2026—. Son direcciones que
  sirvió el WordPress de Edu hasta el 21 sep 2026 y que los buscadores siguen
  visitando de memoria. **No hay que hacer nada**: con el 404 aprenden solos
  que ya no existen. Si algún día interesa rescatar alguna, se mira en Google
  Search Console → **Páginas → No encontrada (404)** cuáles tenían visitas de
  verdad, y solo esas se redirigen, en `redirects` de `astro.config.mjs`.
  Esas de `/podcast/` suenan a episodios de otro podcast, no a nada de Emi,
  así que es probable que no haya nada que rescatar.
- El sitio **no lleva analítica ni cookies**. Si se añade algo, hay que poner
  aviso y revisar la nota legal.
- **Se maqueta con el español**, que es el texto más largo. El inglés entra en
  las mismas cajas sin ajustar nada.
- Sin JavaScript no se pierde contenido: las frases-ancla quedan visibles y el
  panel negro de la entrada no llega a aparecer.
- La firma de la entrada sale **una vez por sesión** (`sessionStorage`). Para
  volver a verla, abrir una ventana nueva o borrar la clave `cec_intro`. Las
  demás veces, desde el 23 sep 2026, la Home entra con la escalera de *Sobre
  mí*. Lo decide `data-intro` en `<html>`: `play` la firma, `seen` la
  escalera, y `done` cuando la firma termina — que no dispara la escalera, a
  propósito.
- El fondo del contrabajo **solo está en la Home**, y se enciende con la prop
  `backdrop` del layout `Base`. En *Sobre mí* no va: ahí manda el retrato.
- La lámina **se queda quieta y en blanco y negro** si el navegador no soporta
  `animation-timeline: view()` o si hay `prefers-reduced-motion`. No se pierde
  nada: el blanco y negro es el estado de reposo, no un paso intermedio.
- El papel lo pinta `html`, no `body`. Tiene que seguir así: el fondo vive en
  una capa con `z-index: -1`, y si `body` recupera su color se la come.
