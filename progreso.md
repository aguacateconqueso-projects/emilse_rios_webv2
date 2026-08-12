# Progreso — Contrabajo en la Ciudad

Sitio de **Emilse Ríos**, contrabajista y docente, y de su newsletter.
Este documento es la memoria del proyecto: quien lo lea de cero debería poder
seguir trabajando sin preguntar nada.

**Última actualización:** 12 de agosto de 2026 · la portada de la Home

---

## Dónde estamos

| | |
|---|---|
| **Publicado** | Sí, en Vercel. Despliega solo en cada merge a `main`. |
| **Dominio** | Pendiente. Todavía se ve en la URL de Vercel. |
| **Páginas** | Home y Sobre mí, las dos en español e inglés. |
| **Identidad** | El logo de Emi, vectorizado, en cabecera, pie, entrada y favicon. |
| **Lo que falta para lanzar** | Conectar el proveedor de correo. El formulario **no da de alta a nadie**. |

Rutas vivas: `/` · `/en/` · `/sobre-mi/` · `/en/about/`

Lo último que se tocó fue **la portada de la Home**: título centrado, y la foto
de Emi con el contrabajo en una calle de Madrid como lámina. El orden de la
apertura es **título → subtítulo → formulario → lámina**, y después sigue la
lectura normal. Antes fue el fondo del contrabajo (PRs #4 a #7), cerrado y
aprobado; si se retoma, es solo para mover los mandos de `tokens.css` — ver la
receta más abajo. **Lo siguiente sin dueño es el cierre para producción**, en
«Próximos PRs».

---

## Arrancar

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # build de producción en ./dist
npm run preview  # sirve el build
npm run audit    # auditoría del diseño (necesita preview en marcha)
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
se ha tocado tres veces:

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
    Header · Footer · LangSwitch   Cabecera, pie, conmutador ES/EN
    Logo.astro                     La firma de Emi, como máscara
    Intro.astro                    Animación de entrada (solo Home)
    Backdrop.astro                 El contrabajo tras el cristal (solo Home)
    Home.astro · About.astro       Los bloques de cada página
    EmailArchive.astro             Fichas del newsletter + <dialog>
    SubscribeForm.astro            Campo de suscripción
    MediaSlot.astro                Hueco de imagen
  content/correos/       Un .md por correo y por idioma
  content.config.ts      Esquema del archivo del newsletter
  data/home.ts           Textos de la Home (es / en)
  data/about.ts          Textos de Sobre mí (es / en)
  i18n/ui.ts             Cadenas de interfaz + mapa de rutas
  layouts/Base.astro     <head>, cabecera, pie, revelado de frases-ancla
  pages/                 index · sobre-mi · en/index · en/about
  styles/tokens.css      Los tokens del sistema
  styles/base.css        Reset y primitivas compartidas
public/logo.svg          La firma vectorizada. La usa Logo.astro de máscara
public/favicon.svg       La E del logo. Se adapta al tema del navegador
scripts/audit.mjs        Auditoría de contraste y rejilla
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
`src/assets/img/emilse-madrid.jpg`: **2400 × 1200, a color y sin recortar más**.

- **A color, aunque se vea en blanco y negro.** El gris lo pone el CSS, porque
  el revelado necesita el color debajo para poder devolverlo. Si se sube ya
  desaturada, el efecto no tiene de dónde sacarlo.
- **2400 px de ancho.** La lámina mide 640 px CSS —la medida de lectura—, que
  en densidad 2 son 1280. Astro genera el 1× y el 2×; el original solo tiene
  que dar de sobra. No hace falta tocarlo si se cambia el ancho de
  presentación, y por eso se deja generoso.
- **Recorte 2:1.** Del original se toma la franja que empieza al 16,5 % de la
  altura. Conserva la voluta arriba y el puño abajo, que es lo que hace que se
  lea el instrumento entero.

El original de cámara —5721 × 3806, 6,2 MB— está en el commit `378eccb`, en
`public/image_hero.jpg`. Se sacó de `public/` a propósito: ahí se servía en
crudo al navegador, sin pasar por el optimizador.

Para rehacerla desde el original:

```js
sharp(original)
  .extract({ left: 0, top: Math.round(3806 * 0.165), width: 5721, height: 2861 })
  .resize({ width: 2400 })
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

Mide renglón a renglón, no la caja del bloque, y descarta el texto que existe
solo para el lector de pantalla: WCAG pide contraste a la «presentación visual
del texto», y eso no lo es.

Usa `sharp` para leer los píxeles. Está declarado en `devDependencies` — antes
solo llegaba como dependencia transitiva de Astro, que es como no tenerlo.

---

## Decisiones ya tomadas

Están discutidas y resueltas. No hace falta volver sobre ellas salvo que Emi
pida lo contrario.

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
- **Nada que no funcione se publica enlazado.** «Aula Virtual» y el
  «Reproducir» del video están apagados a propósito, no rotos.
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
- **El orden de la apertura es título → subtítulo → formulario → lámina.**
  Decisión de Emi, 12 ago 2026. Al principio la lámina iba antes del
  formulario, de frontispicio, para dar la cara antes de pedir el correo. Puesta
  después, la apertura queda más limpia —tres cosas de texto seguidas y luego
  la imagen— y el formulario sube, que es donde conviene que esté. La foto
  sigue estando en la primera pantalla y media, así que no pierde el trabajo de
  poner cara.
- **La portada va centrada y fuera de la rejilla de lectura.** El título, el
  subtítulo y el párrafo de entrada van centrados en la página, con el numeral
  `01` centrado encima en vez de al margen — el mismo patrón que ya usaban las
  frases-ancla y el cierre en negro para los momentos que no se leen en
  columna. Ojo con una cosa al medirlo: la columna de lectura **no** está
  centrada en la página, va 40 px a la derecha porque el numeral vive en el
  margen izquierdo. La portada sí está centrada en la página. Esos 40 px de
  diferencia son a propósito, no un descuadre: la portada no tiene numeral al
  margen del que colgar.
- **La lámina va dentro de la rejilla de lectura, alineada con los párrafos.**
  Usa el mismo hueco de numeral vacío que el formulario, así que mide lo que
  mide la medida —640 px— y no puede salirse. Estuvo un paso fuera (900 px
  contra los 768 de la columna) como gesto editorial, y sobresalir de los
  márgenes no quedaba bien: la página tiene un borde de texto muy claro y la
  foto lo rompía. Si alguna vez se quiere más grande, se hace ancho de columna,
  no ancho suelto.
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
- **Las horizontales van en el flujo; las verticales, al costado del texto.**
  Un formato por función, y nunca los dos mezclados en la misma tira. Esta foto
  es horizontal y su horizontalidad es el argumento: la calle se va vacía hacia
  la izquierda y ella entra por la derecha con la voluta. Recortada en vertical
  se pierde la ciudad y queda un retrato de estudio cualquiera. El vertical de
  la casa es el retrato pendiente de *Sobre mí*, que ya tiene su hueco a 3/4.
- **La lámina va en blanco y negro, y el color es lo que ocurre al pasarle el
  scroll por encima.** En color permanente entran el ladrillo naranja y el
  coche azul, y la interfaz es estrictamente monocroma. Así el reposo de la
  página sigue siendo monocromo y el color es una recompensa, no un estado. El
  acercamiento que la acompaña va en una sola dirección, no de ida y vuelta:
  subiendo y bajando la foto respira, y eso se lee como un tic.
- **En pantalla estrecha la lámina pasa de 2:1 a 3:2.** Una panorámica a 342 px
  de ancho es una tira de 171 px y la cara queda diminuta. Al darle más alto hay
  que recortar por los lados, y lo primero que sobra es la calle vacía de la
  izquierda, no ella: de ahí el `object-position: 65%`.
- **El tramo del revelado se ancla a `cover 50%`, no a la posición en la
  página.** Va referido a la propia lámina y a la ventana, así que se recolocó
  solo cuando la foto se movió de antes del formulario a después y de 900 px a
  640. Comprobado después de moverla: sigue llegando en blanco y negro a
  1440 × 900, 1440 × 1200, 1280 × 800 y 390 × 844.
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

- [ ] **Conectar el proveedor de correo.** Hoy no hay ninguno: el formulario
      valida y maqueta bien, pero **no da de alta a nadie**. Está resuelto para
      que no mienta — en producción y sin proveedor muestra un error honesto con
      una dirección a la que escribir, en vez de un «Listo» falso.

      Falta que Emi diga cuál usa (ConvertKit, MailerLite, Beehiiv…). **Aviso
      para quien lo implemente:** no basta con poner
      `PUBLIC_NEWSLETTER_ENDPOINT`. El formulario hace un `POST` de
      `{ email }` en JSON desde el navegador, y la mayoría de proveedores no
      aceptan eso por CORS ni admiten exponer la clave en el cliente. Lo más
      probable es que haga falta una función serverless en Vercel que reciba el
      correo y hable con la API del proveedor con la clave del lado del
      servidor. Conviene contarlo antes de estimar.

- [ ] **Conectar el dominio `contrabajoenlaciudad.com`.** El `site` de
      `astro.config.mjs` ya apunta ahí, así que las direcciones absolutas del
      HTML son las definitivas aunque todavía se vea en la URL de Vercel.

### Contenido que falta (de Emi)

- [ ] **Retrato con el contrabajo**, en blanco y negro, para *Sobre mí*. Es
      **vertical** y distinto del de la Home: ahí ya está la foto de Madrid, y
      repetirla en las dos páginas las aplana.
- [ ] **Video «Viaje en el tiempo»** (2:41) y su fotograma.
- [ ] **Los tres correos reales.** Los N.º 40, 41 y 42 tienen asunto y adelanto
      de verdad, pero el cuerpo es de muestra — marcados `borrador: true`.
- [ ] **Los tres testimonios** de *Sobre mí*.
- [ ] **Enlaces reales de Instagram y YouTube.** Apuntan a las portadas.

### Próximos PRs

- [ ] **Cierre para producción.** `sitemap.xml`, `robots.txt`, imagen de Open
      Graph, datos estructurados y página 404. Es el candidato natural al
      siguiente PR si el proveedor de correo sigue sin decidirse.
- [ ] **Comprobación de tipos en el build.** Hoy Astro transpila sin verificar:
      un error de tipos no rompe el despliegue, pero tampoco avisa. Añadir
      `@astrojs/check` y un `npm run check`.
- [ ] **Aula Virtual.** Está en el menú, apagada. Falta definir qué es: una
      página, un enlace afuera, o una zona con acceso.

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
