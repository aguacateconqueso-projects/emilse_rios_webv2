# Progreso — Contrabajo en la Ciudad

Bitácora del sitio de Emilse Ríos. Se actualiza en cada PR.

**Última actualización:** 9 de agosto de 2026 · PR #2

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
| Movimiento | Máximo dos animaciones por página. |
| Prohibido | Parallax, marquesinas, contadores, cursores propios, texto que se escribe letra a letra, tarjetas que se levantan, zoom automático, iconos, emojis, fondos grises de relleno. |

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
```

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
- [ ] **La firma en SVG.** Ahora la entrada escribe «Emilse Ríos» con la
      tipografía Mrs Saint Delafield y una máscara. Con el trazo real, la misma
      animación se ejecuta con `stroke-dashoffset` y el gesto es de verdad.
      El favicon también sale de ahí — hoy es una «E» provisional.
- [ ] **Enlaces reales de Instagram y YouTube.** Apuntan a las portadas.

### Próximos PRs

- [ ] **PR #3 — Cierre para producción.** `sitemap.xml`, `robots.txt`, imagen
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
