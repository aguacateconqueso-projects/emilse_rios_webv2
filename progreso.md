# Progreso — Contrabajo en la Ciudad

Sitio de **Emilse Ríos**, contrabajista y docente. Su newsletter, su aula, su
membresía y sus cursos. Este documento es la memoria del proyecto: quien lo lea
de cero debería poder seguir trabajando sin preguntar nada.

**Última actualización:** 21 de septiembre de 2026 · **la Home lleva el copy
nuevo de Emi** —más corta, sin archivo de correos y sin el cierre en negro—;
la capa A está en pie y mergeada —adaptador de Vercel, sesión contra el
Supabase de la academia, `/panel/` para Emi— y **Edu ofrece acceso de
colaborador en Hostinger y la ruta Cloudflare**, pendiente de una llamada de
30 min

---

## Dónde estamos

| | |
|---|---|
| **Publicado** | Sí, en Vercel. Despliega solo en cada merge a `main`. |
| **Dominio** | Pendiente. Todavía se ve en la URL de Vercel. El destino es `emilserios.com`. |
| **Páginas** | Home, Sobre mí, Productos, el Aula Virtual —puerta y aula por dentro— y sus pantallas de acceso, en español e inglés. Más `/panel/`, la consola de Emi, solo en español. |
| **Identidad** | El logo de Emi, vectorizado, en cabecera, pie, entrada y favicon. |
| **Alcance** | Desde el 31 ago 2026 esto deja de ser solo el sitio: aquí van también el aula, la membresía y los cursos. Ver **La plataforma**. |
| **Sesión** | Desde el 20 sep 2026 el aula pide sesión de verdad, contra el **mismo Supabase de la academia**. Falta poner las variables en Vercel y las Redirect URLs en Supabase; sin eso queda en modo maqueta y lo dice. |
| **Lo que falta para lanzar** | Conectar Klaviyo. El formulario **no da de alta a nadie**. |

Rutas vivas: `/` · `/en/` · `/sobre-mi/` · `/en/about/` · `/productos/` ·
`/en/products/` · `/productos/estudiemos-juntos/` ·
`/en/products/estudiemos-juntos/` · `/aulavirtual/` · `/en/classroom/`

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
y la página lo dice.

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

⚠️ **Sin comprobar.** Se intentó el 19 sep 2026 desde la sesión de trabajo y la
red del entorno bloquea las consultas DNS. Es un `dig NS emilserios.com` desde
cualquier terminal, o whatsmydns.net desde el navegador.

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

Con estos cuatro, el resto se arma sin volver a preguntarle nada:

1. **A qué nameservers apunta `emilserios.com`.** Se ve en Namecheap, en la
   ficha del dominio. Es el dato que decide todo el orden — la tabla de qué
   significa cada respuesta está justo arriba.
2. **Dónde vive `info@emilserios.com`**, cuántos buzones hay y quién los paga.
3. **La zona DNS entera**, con los **MX** y los **TXT** (SPF, DKIM, DMARC). Son
   los registros que rompen el correo si se pierden.
4. **El listado de URLs publicadas**, que **se pierde para siempre** el día que
   borre el sitio, y sin el cual cada enlace viejo cae en un 404.

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
1  Edu dice a QUÉ NAMESERVERS apunta el dominio y DÓNDE vive
   info@emilserios.com — cuántos buzones hay y quién los paga
2  Edu exporta la ZONA DNS entera: A, CNAME, MX, TXT (SPF/DKIM/DMARC),
   subdominios
3  Se decide dónde vive el correo y SE MUDA. No se toca nada más hasta que
   llegue un correo de prueba al buzón nuevo.
4  Edu hace el PUSH del dominio a la cuenta de Namecheap de Emi (instantáneo)
5  Se delegan los nameservers a Cloudflare —CUENTA DE EMI, no de Edu—, con
   la zona replicada y REVISADA a mano ANTES de delegar
6  emilserios.com apunta a Vercel — el cambio de dominio, que es la fase 6
7  RECIÉN AHORA Edu borra el hosting. Es el último paso, no el primero.
```

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

**El catálogo tiene siete productos**, y **cada uno lleva su foto**. La membresía,
que es lo único a la venta, y seis cursos que Emi ya tiene grabados pero todavía
sin estrategia de venta. Los seis salen como «Próximamente» y **sus fichas no son
enlaces**: no tienen página porque no tienen carta, y una URL indexable
prometiendo algo que no se puede comprar es peor que un hueco anunciado. Cuando
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
| `payHref: '/api/checkout?lang=…'` | apunta al checkout de la academia (`ACADEMIA`, de `data/aula.ts`), que es donde se cobra hoy |
| El aviso de que el cobro sale del sitio | añadido **una vez**, en la ficha de precio, con el mismo texto que el resto de la tienda (`products.leaving`) |
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

1. **El puente de traspaso**, mientras el dominio viejo siga vivo. Una página en
   `emilseriosacademy.com/pasar/` lee la sesión con `getSession()` y redirige a
   `https://emilserios.com/entrar/#access_token=…&refresh_token=…`; el sitio
   nuevo hace `setSession(...)` y ya está dentro. **No es un invento: la
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
1  No tocar la base de datos. Mismo proyecto, misma URL, misma clave anon.
2  AÑADIR emilserios.com a Site URL y Redirect URLs de Supabase Auth.
   Es aditivo: el dominio viejo sigue funcionando.
3  Desplegar el aula nueva en emilserios.com contra ese mismo Supabase.
4  MANTENER emilseriosacademy.com viva, con la app vieja + el puente.
   Si se apaga antes, el puente no existe.
5  El correo de aviso.
6  Semanas después, la academia pasa a ser un 301 al sitio nuevo.
```

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
se ha tocado nueve veces:

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
                         emilse-madrid.jpg, la lámina de la Home
                         emilse-membresia.jpg, el retrato de la carta
  components/
    Header.astro                   Cabecera: la firma centrada y el menú
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
    Aula.astro                     La puerta del aula: entrar, o ir a la tienda
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
  data/about.ts          Textos de Sobre mí (es / en)
  data/aula.ts           El catálogo: los 7 productos y sus cartas (es / en)
                         — la FACHADA, lo que se vende
  data/cursos.ts         Unidades, clases y videos de Bunny — lo que se COMPRA.
                         Se ata a data/aula.ts por el slug
  lib/membership.ts      Las fechas de las puertas y el alta al newsletter,
                         traídas de la academia con sus mismos nombres de
                         variable de entorno
  i18n/ui.ts             Cadenas de interfaz + mapa de rutas
  i18n/aula.ts           Las cadenas y las rutas del aula, aparte: afuera se
                         habla de comprar y adentro de estudiar
  layouts/Base.astro     <head>, cabecera, pie, revelado de frases-ancla
  layouts/Aula.astro     El marco del aula: barra, pie, y `window.Aula` —el
                         almacén del progreso, maqueta de la base de datos
  pages/                 index · sobre-mi · en/index · en/about
                         productos/index · productos/[producto]
                         productos/estudiemos-juntos (la carta trasplantada,
                           suelta y sin layout — ver más arriba el porqué)
                         en/products/index · en/products/[producto]
                         en/products/estudiemos-juntos
                         aulavirtual/index · en/classroom/index
                         aulavirtual/escritorio · aulavirtual/curso/[curso]
                         en/classroom/desk · en/classroom/course/[curso]
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
  la carta. Dónde van lo dice `data/aula.ts`, no el componente. El aviso de que
  el cobro todavía vive fuera se da **una sola vez**, en la primera: repetirlo
  cuatro veces es ruido, callarlo es dejar que la lectora descubra sola el
  cambio de dominio a mitad de una compra.

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
  subtítulo y el párrafo de entrada van centrados en la página, con el numeral
  `01` centrado encima en vez de al margen — el mismo patrón que ya usaban las
  frases-ancla, y el cierre en negro mientras existió, para los momentos que no
  se leen en columna. Ojo con una cosa al medirlo: la columna de lectura **no**
  está centrada en la página, va 40 px a la derecha porque el numeral vive en el
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

- [ ] **Decidir las fechas de las puertas de la membresía en ESTE proyecto.** La
      carta trasplantada trae `src/lib/membership.ts` con las mismas dos fechas
      que la academia y los mismos nombres de variable —`MEMBERSHIP_CLOSES_AT` y
      `MEMBERSHIP_REOPENS_AT`—, pero en Vercel hay que ponerlas **también acá**;
      sin ellas manda el valor por defecto del fichero, que es el ciclo de
      septiembre de 2026. Hoy eso deja la carta con las puertas cerradas hasta el
      1 de octubre, que es lo correcto — pero el mes que Emi cambie el ciclo y
      solo lo cambie en una casa, la carta invitará a entrar por una puerta que
      el checkout tiene cerrada. Lo sano el día de la mudanza del cobro: una sola
      fuente para las dos.

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

- [ ] **La llamada de 30 min con Edu**, que él mismo ofreció el 21 sep 2026
      junto con el acceso de colaborador en Hostinger. Hay que salir de ahí con
      **cuatro datos**: a qué nameservers apunta el dominio, dónde vive
      `info@emilserios.com`, la zona DNS entera —con MX y TXT— y el listado de
      URLs publicadas. Están en **El dominio, y Edu → Los cuatro datos que tiene
      que dar la llamada**, junto con los dos cuidados al migrar la zona.
      Y lo que no puede faltar decirle: **que no borre nada del hosting
      todavía**.

- [ ] **Abrir la cuenta de Cloudflare a nombre de Emi**, antes de la llamada. Si
      la abre Edu, se cambia una dependencia por otra y no se ha ganado nada.

- [ ] **El push del dominio a una cuenta de Namecheap de Emi.** Es lo que cierra
      el tema y **no lo resuelve Cloudflare**: delegar el DNS arregla lo técnico,
      pero el registro sigue en la cuenta de Edu. Mientras esté ahí, Emi está a
      una renovación no pagada de perder su propio nombre.

- [ ] **Comprobar a qué nameservers apunta `emilserios.com`.** Un minuto, y
      decide si apagar el hosting de Edu se lleva el DNS por delante o no. Se
      intentó el 19 sep 2026 desde la sesión de trabajo y **la red del entorno
      bloquea las consultas DNS**: hay que hacerlo desde fuera (`dig NS
      emilserios.com` o whatsmydns.net). La tabla de qué significa cada respuesta
      está en **El dominio, y Edu**.

- [ ] **Decidir dónde vive `info@emilserios.com` y mudarlo.** Es el primer paso
      real del traspaso y bloquea a todos los demás: es el `reply-to` de todos
      los correos de la academia y el canal de rescate el día que toda la
      membresía tenga que volver a iniciar sesión. Nada se toca hasta que llegue
      un correo de prueba al buzón nuevo.

- [ ] **Decidir qué pasa con `contrabajoenlaciudad.com`.** Quedó abierto el
      31 ago 2026. El dominio principal es `emilserios.com`, ya decidido; falta
      saber si el otro se redirige, si se queda como marca de la newsletter, o
      si se suelta. **Mientras no se decida, `astro.config.mjs` sigue con
      `site: 'https://contrabajoenlaciudad.com'` y eso ya no es correcto**: de
      ahí salen el `<link rel="canonical">`, las URLs absolutas y el futuro
      sitemap. Cambiarlo es una línea, pero conviene hacerlo cuando se sepa el
      destino y en su propio PR.

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

- [ ] **Retrato con el contrabajo**, en blanco y negro, para *Sobre mí*. Es
      distinto del de la Home: ahí ya está la foto de la calle, y repetirla en
      las dos páginas las aplana. Su hueco en *Sobre mí* es a 3/4.
- [ ] **Video «Viaje en el tiempo»** (2:41) y su fotograma.
- [ ] **Los tres correos reales.** Los N.º 40, 41 y 42 tienen asunto y adelanto
      de verdad, pero el cuerpo es de muestra — marcados `borrador: true`.
      **Sin prisa desde el 21 sep 2026:** el copy nuevo se llevó «Correos
      anteriores» de la Home y ahora mismo no hay ninguna página que los
      muestre. Dejan de hacer falta hasta que Emi quiera el archivo de vuelta.
- [ ] **Los tres testimonios** de *Sobre mí*.
- [ ] **Enlaces reales de Instagram y YouTube.** Apuntan a las portadas.
- [ ] **El nombre, el precio, el enlace de pago, la foto y la carta del PRIMER
      curso.** Es lo único que le falta a la página de Productos para dejar de
      ser un catálogo de marcadores: hoy las seis fichas dicen «Curso 1» a
      «Curso 6», con el marco de la foto vacío, y salen como «Próximamente»,
      sin enlace, porque no hay nada a lo que enlazar. Hace falta el nombre, una
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
      esqueleto; de los otros dos falta todo. Ojo con el número: el catálogo
      tiene **seis** huecos de curso y ahora se habla de **tres**. Hay que
      ajustar los que sobren.
- [ ] **Los correos de quienes ya compraron un curso** (unas 5 personas), para
      concederles el acceso a mano en la plataforma nueva. Adrián los pasa en
      cuanto los tenga (19 sep 2026).

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
