# Progreso — Contrabajo en la Ciudad

Sitio de **Emilse Ríos**, contrabajista y docente, y de su newsletter.
Este documento es la memoria del proyecto: quien lo lea de cero debería poder
seguir trabajando sin preguntar nada.

**Última actualización:** 10 de agosto de 2026 · después del PR #7

---

## Dónde estamos

| | |
|---|---|
| **Publicado** | Sí, en Vercel. Despliega solo en cada merge a `main`. |
| **Dominio** | Pendiente. Todavía se ve en la URL de Vercel. |
| **Páginas** | Home y Sobre mí, las dos en español e inglés. |
| **Lo que falta para lanzar** | Conectar el proveedor de correo. El formulario **no da de alta a nadie**. |

Rutas vivas: `/` · `/en/` · `/sobre-mi/` · `/en/about/`

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
| Movimiento | Máximo tres animaciones en la Home, dos en el resto. |
| Prohibido | Marquesinas, contadores, cursores propios, texto que se escribe letra a letra, tarjetas que se levantan, zoom automático, iconos, emojis, fondos grises de relleno. |

Todo esto está en `src/styles/tokens.css`. **Ningún valor suelto en los
componentes**: si hace falta uno nuevo, se añade como token.

### Enmiendas, con fecha

El sistema es de Emi y se puede cambiar. Lo que no se puede es cambiarlo sin
dejar constancia, porque si no la tabla de arriba deja de ser fiable. Hasta hoy
se ha tocado dos veces, las dos en el PR #4:

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
imagen de mala resolución: 360 px de origen estirados a 512 en pantalla. Al
abrir el encuadre hay que subir la resolución, no bajarla — se ve más campo y
cada píxel de la foto rinde menos.

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

Estado en las cuatro rutas, a 1440 y a 390 px de ancho:

```
CONTRASTE por debajo de AA .................. 0
ESPACIADOS fuera de la rejilla de 8 px ...... 0
CONTRASTE contra el fondo ya pintado ........ 0   (peor caso real, 13,2:1)
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
  escala de pantalla (360 px, mateado y suavizado, 41 kB). Pasarlo por
  `getImage` solo lo recodificaría con el canal alfa sin pérdida y lo
  multiplicaría por ocho.
- **Nunca escribir prefijos `-webkit-` a mano.** Poniendo `backdrop-filter` y
  `-webkit-backdrop-filter` juntos, el minificador las deduplica y se queda con
  la prefijada — que Chrome no reconoce. El cristal estuvo semanas sin
  esmerilar nada por eso, y la imagen se veía en crudo. Los prefijos los pone
  el minificador según targets; escribir solo la forma sin prefijo.
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

- [ ] **Retrato con el contrabajo**, en blanco y negro, para *Sobre mí*.
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
- El papel lo pinta `html`, no `body`. Tiene que seguir así: el fondo vive en
  una capa con `z-index: -1`, y si `body` recupera su color se la come.
