# Progreso — Contrabajo en la Ciudad

Bitácora del sitio de Emilse Ríos. Se actualiza en cada PR.

**Última actualización:** 10 de agosto de 2026 · PR #3

---

## Cómo trabajamos

- **Un PR por cambio, siempre.** Por mínimo que sea el cambio, va en su propia
  rama y su propio Pull Request a `main`. Emi lo mergea, lo mira, ajustamos, y
  seguimos.
- **`main` no se toca directamente.** Solo recibió el commit inicial (README y
  `.gitignore`) porque sin él no existía base contra la que abrir un PR.
- Este documento se actualiza en el mismo PR que introduce el cambio, no después.

---

## De dónde viene el diseño

El concepto visual ya estaba hecho en Claude Design. Llegó como export
`.dc.html` con tres piezas: **Sistema de Diseño**, **Contrabajo en la Ciudad**
(Home + Sobre mí) y **Animación de entrada**. Esta fase es la implementación.

El sistema, tal como lo fija el diseño:

| | |
|---|---|
| Color | Papel `#FAFAF8`, tinta `#0D0D0D`, tinta secundaria, línea. Ningún otro. |
| Tipografía | Instrument Serif (titulares), Newsreader (cuerpo), IBM Plex Mono (etiquetas), Mrs Saint Delafield (solo la firma) |
| Espaciado | Rejilla de 8 px. Sin excepciones. |
| Formas | Radios: cero. Sombras: cero. Las divisiones son reglas de 1 px. |
| Medida | 60–68 caracteres. Columna de 640 px, número marginal de 48 px. |
| Movimiento | Máximo tres animaciones en la Home, dos en el resto. |
| Prohibido | Marquesinas, contadores, cursores propios, texto que se escribe letra a letra, tarjetas que se levantan, zoom automático, iconos, emojis, fondos grises de relleno. |

### Enmiendas al sistema

El sistema es de Emi y se puede cambiar; lo que no se puede es cambiarlo sin
dejar constancia. Hasta hoy, dos:

- **10 ago 2026 · Se levanta la prohibición de parallax y el tope sube a tres
  animaciones en la Home.** Lo pide el fondo del contrabajo. La prohibición
  existía contra el parallax de verdad —capas a distinta velocidad, que da
  tirones y marea— y eso sigue fuera: la imagen del fondo no se mueve ni un
  píxel. Lo que avanza con el scroll es un revelado, de la misma familia que
  el de las frases-ancla.
- **10 ago 2026 · «Papel y tinta, ningún otro color» rige la interfaz, no las
  fotografías.** Las fotos traen su color y cuentan como fotos. Vale para el
  fondo del contrabajo y para el retrato y el video que están por llegar.

---

## Hecho

### PR #1 — Fundación y Home

**Stack.** Astro 7, estático, sin framework de UI. Se eligió por tres razones:
cero JavaScript por defecto (el sitio es de lectura), i18n con rutas reales, y
colecciones de contenido en Markdown para el archivo del newsletter, que va a
crecer.

**Sistema de diseño en código**
- `src/styles/tokens.css` — todos los tokens: color, escala tipográfica,
  rejilla de 8 px, anchos de columna, curvas de animación.
- `src/styles/base.css` — reset mínimo y primitivas (`.mono`, `.row`,
  `.prose`, `.reveal`, foco visible, salto al contenido).

**Tipografías autohospedadas.** Las cuatro familias viven en
`src/assets/fonts` y se sirven desde nuestro dominio: el build no depende de la
red y el navegador de quien lee no le pide nada a Google. Licencia OFL incluida
en `src/assets/fonts/OFL.txt`.

**Bilingüe.** Español en la raíz (`/`), inglés en `/en/`. Cadenas de interfaz en
`src/i18n/ui.ts`, textos de página en `src/data/home.ts`. Con `hreflang`,
`canonical` y conmutador que no te saca de la página donde estás.

**Home, completa en los dos idiomas** — hero, párrafo con minutos en mono,
frases-ancla, dos campos de suscripción, archivo de correos y cierre en negro.

**Archivo del newsletter.** Colección de contenido en
`src/content/correos/`, un Markdown por correo y por idioma
(`042.es.md`). Para publicar uno nuevo basta con dejar caer el fichero: no hay
que tocar código. Se abre en un `<dialog>` nativo — foco atrapado y Escape
funcionan sin escribir nada.

**Las dos animaciones, y solo dos**
1. **La entrada** — la firma se escribe sobre negro (0–1,1 s), pausa
   (1,1–1,4 s), el panel sale hacia arriba (1,4–2,0 s). Solo en la Home y solo
   la primera visita de la sesión. Un script en `<head>` decide antes de pintar,
   así que no parpadea para quien ya la vio.
2. **El revelado de las frases-ancla** — fundido más 8 px de subida, 0,7 s, con
   `IntersectionObserver`.

Ambas se desactivan con `prefers-reduced-motion`. Sin JavaScript, las
frases-ancla se quedan visibles y el panel negro no llega a aparecer: no se
pierde contenido.

### PR #2 — Sobre mí

**La página completa en los dos idiomas** — hero a dos columnas con el retrato,
la historia, cinco frases-ancla, la ficha de trayectoria, el bloque de video,
el formulario y los testimonios.

**Slugs por idioma.** El inglés dejó de heredar la dirección española: la
página es `/sobre-mi/` en español y `/en/about/` en inglés. Hay un mapa de
rutas en `src/i18n/ui.ts` (`routes`) del que salen los enlaces, el `canonical`
y las alternativas `hreflang`. Al añadir una página se añade allí y en
`src/pages`. El conmutador de idioma te deja en la misma página, no te manda al
inicio.

**«Sobre mí» ya enlaza.** Estaba inerte en cabecera y pie desde el PR #1 para
no publicar un enlace roto.

**Huecos de imagen.** `MediaSlot.astro` dibuja un marco con su etiqueta
mientras no llega el archivo — una regla de 1 px y el texto en mono, nunca un
relleno gris, que el sistema prohíbe. Para poner la foto de verdad basta con
importarla y pasarla en `src`; el componente ya la sirve optimizada y en blanco
y negro. El enlace «Reproducir» del video está apagado hasta que exista el
archivo.

**Menos duplicación.** Los estilos de bloque que ahora comparten las dos
páginas — `.block`, `.anchor`, `.section-title`, `.inline-mono` — se movieron
de `Home.astro` a `base.css`.

### PR #3 — El logo y el contrabajo de fondo

**La firma ya es el logo de Emi.** Llegó como PNG de 2560 × 1440, del que solo
1631 × 487 eran trazo. Se recortó y se vectorizó con `potrace`; vive en
`public/logo.svg` y pesa 7,8 kB.

**El logo dice «Rios», sin tilde, y así se queda.** Decisión de Emi, 10 ago
2026: la tilde vive en los textos —copias, `alt`, lo que oye un lector de
pantalla, que siguen diciendo «Ríos»—, no en el trazo. No hace falta volver
sobre esto.

Se pinta como **máscara sobre `currentColor`**, no como `<img>`: así el mismo
fichero sirve en tinta sobre papel (cabecera y pie) y en papel sobre tinta (la
entrada), se cachea una vez para todo el sitio y no infla el HTML. El nombre
viaja en texto para el lector de pantalla — y es lo que queda si la máscara no
carga. El alto lo fija quien lo usa con `--logo-height`; nunca por `style` en
línea, que ganaría a las media queries.

De aquí salen tres cosas que estaban pendientes:

- **El favicon** ya no es una «E» provisional: es la E del propio logo,
  recortada de la firma.
- **Mrs Saint Delafield se ha retirado.** Existía solo para escribir la firma
  como texto. Fuera dos ficheros de fuente y una familia del config: el sitio
  usa tres tipografías, no cuatro.
- **La entrada escribe la firma de verdad.** El barrido ya no descubre un texto
  sino el trazo real, y su filo va inclinado al ángulo de la letra: no aparece,
  se escribe. Se descartó `stroke-dashoffset` — el vectorizado es un contorno
  relleno, no una línea central, así que dibujaría el perímetro de las letras y
  las rellenaría de golpe. En caligrafía enlazada eso queda peor, no mejor.

**El contrabajo detrás del cristal**, solo en la Home. Dos capas fijas por
debajo de todo el contenido: la fotografía en una banda a la izquierda y, sobre
ella, una hoja de papel esmerilado a pantalla completa. La foto **nunca se ve
en crudo**, siempre difuminada y siempre por debajo del texto. El «cristal» es
el papel del sitio al 50 % con desenfoque: esquinas rectas y sin borde, que el
sistema no tiene radios ni sombras. La cabecera ya hacía esto mismo.

- **Ninguna capa se mueve.** Lo que avanza al bajar es una máscara vertical que
  descubre el instrumento de arriba abajo. Va con animaciones de scroll de CSS
  (`animation-timeline: scroll()`), sin JavaScript y fuera del hilo principal.
  Donde no hay soporte —o con `prefers-reduced-motion`— la imagen se queda
  quieta y entera: no se pierde nada.
- **Los negros de la foto son transparentes.** El fondo negro del estudio se
  convertía en una plancha gris a la izquierda, justo lo que el sistema
  prohíbe. La imagen lleva un mate por luminancia, así que el contrabajo emerge
  del papel y las efes se leen como un recorte. Los mandos —ancho, opacidad,
  saturación, velo y desenfoque del cristal— están todos en `tokens.css`.
- **41 kB.** El fichero de `src/assets/img/` ya viene a la escala de pantalla,
  así que se sirve tal cual: pasarlo por el optimizador de Astro solo lo
  recodificaría con el canal alfa sin pérdida y lo multiplicaría por ocho.

Para rehacer el asset desde el original —que está en el commit `fbff7e5`, en
`public/doublebass_background_ref.jpg`: recorte `(220, 0, 2500, 5938)`, escalar
a 360 px de ancho, desenfoque gaussiano de radio 2, alfa = `smoothstep(0,10 →
0,38)` sobre la luminancia, y WebP con calidad 74 y alfa 62.

---

## Auditoría — Paso 9

Automatizada y repetible: `npm run audit` (necesita `npm run preview` en marcha).
Comprueba contraste WCAG AA, espaciados fuera de la rejilla de 8 px y número de
animaciones.

Estado en las cuatro rutas (`/`, `/en/`, `/sobre-mi/`, `/en/about/`) y a
390 px de ancho:

```
CONTRASTE por debajo de AA .................. 0
ESPACIADOS fuera de la rejilla de 8 px ...... 0
CONTRASTE contra el fondo ya pintado ........ 0   (peor caso real, 13,2:1)
```

El fondo del contrabajo obligó a añadir la tercera comprobación. Las dos
primeras miran el `background-color` de los ancestros, y por ahí el fondo no
aparece: no lo pinta ningún ancestro, sino una capa fija por debajo de todo.
La nueva mide sobre los píxeles ya pintados — apaga el texto, fotografía cada
renglón dos veces (con el fondo y sin él) y solo juzga los píxeles que el
fondo cambia. Así las reglas de 1 px del diseño, que salen iguales en las dos
capturas, no cuentan como fondo de nada. El peor caso medido con el
contrabajo puesto es **13,2:1**, muy por encima del 4,5:1 que pide AA.

Se corrigió también un falso positivo: el texto que existe solo para el lector
de pantalla se contaba como texto visible. WCAG pide contraste a la
«presentación visual del texto», y eso no lo es.

Dos cosas que la auditoría encontró y se corrigieron, por si vuelven a surgir:

- **Tinta secundaria al 55 %.** El sistema la define así, pero sobre el papel da
  4,24:1 y no llega al 4,5:1 que pide AA para texto pequeño — y las etiquetas
  mono son de 12 px. Está al **58 %**, que da 4,68:1. La diferencia no se ve.
- **Precarga de fuentes.** El atributo `preload` de Astro precarga *todas* las
  variantes de cada familia, incluidas `latin-ext` y las cursivas que la Home no
  usa: eran **10 ficheros y ~560 kB** antes del primer pixel. Se quitó. Las
  `@font-face` viajan en la hoja de estilos, que ya bloquea el render, así que
  el navegador las descubre igual de pronto y baja solo lo que el texto necesita.

Una excepción consciente al «máximo dos animaciones»: el acuse de recibo del
formulario aparece con un fundido de 0,4 s. Es respuesta a una acción de quien
lee, de la misma familia que un `hover`, no movimiento ambiental de la página.
Está en el diseño original.

---

## Pendiente

### Bloquea el lanzamiento

- [ ] **Conectar el proveedor de correo.** Hoy no hay ninguno: el formulario
      valida y maqueta bien, pero **no da de alta a nadie**. Está resuelto para
      que no mienta — en producción y sin proveedor muestra un error honesto con
      una dirección a la que escribir, en vez de un «Listo» falso. Hace falta
      decidir el proveedor (ConvertKit, MailerLite, Beehiiv…) y poner
      `PUBLIC_NEWSLETTER_ENDPOINT`.
- [x] **Dónde se despliega** — Vercel, desde el PR #1. El sitio es estático, así
      que no hace falta adaptador ni configuración.
- [ ] **Conectar el dominio `contrabajoenlaciudad.com`.** Mientras tanto, el
      `site` de `astro.config.mjs` ya apunta ahí: de él salen el `canonical` y
      las alternativas `hreflang`, así que las direcciones absolutas del HTML
      son las definitivas aunque todavía se vea en la URL de Vercel.

### Contenido que falta (de Emi)

- [ ] **Retrato con el contrabajo**, en blanco y negro, para *Sobre mí*. El
      hueco ya está montado: importar la imagen y pasarla a `MediaSlot`.
- [ ] **Video «Viaje en el tiempo»** (2:41) y su fotograma. El enlace
      «Reproducir» está apagado hasta que llegue.
- [ ] **Los tres correos reales** del archivo. Hoy los N.º 40, 41 y 42 tienen
      asunto y adelanto de verdad, pero el cuerpo es texto de muestra —
      marcados con `borrador: true`.
- [ ] **Los tres testimonios** de *Sobre mí*.
- [x] **La firma en SVG** — llegó en el PR #3, y con ella el favicon.
- [ ] **Enlaces reales de Instagram y YouTube.** Apuntan a las portadas.

### Próximos PRs

- [ ] **PR #4 — Cierre para producción.** `sitemap.xml`, `robots.txt`, imagen
      de Open Graph, datos estructurados y página 404.
- [ ] **Comprobación de tipos en el build.** Hoy Astro transpila sin verificar:
      un error de tipos no rompe el despliegue, pero tampoco avisa. Añadir
      `@astrojs/check` y un `npm run check`.
- [ ] **Aula Virtual.** Está en el menú, apagada. Falta definir qué es: una
      página, un enlace afuera, o una zona con acceso.

---

## Notas para quien retome esto

- El sitio no lleva analítica ni ninguna cookie. Si se añade algo, hay que
  poner aviso.
- Los textos largos viven en `src/data/`, no en los componentes. Cambiar una
  frase no debería obligar a tocar maquetación.
- Se maqueta con el español, que es el texto más largo. El inglés entra en las
  mismas cajas sin ajustar nada.
