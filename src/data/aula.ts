import type { ImageMetadata } from 'astro';
import type { Lang } from '../i18n/ui';
import membresiaFoto from '../assets/img/emilse-membresia.jpg';
import diapasonFoto from '../assets/img/curso-diapason.jpg';
import desdeCeroFoto from '../assets/img/curso-desde-cero.jpg';
import vibratoFoto from '../assets/img/curso-vibrato.jpg';
import { tieneCarta } from './cartas';

/**
 * El catálogo de la tienda —`/productos/`—: la ficha de cada producto, más la
 * dirección de la puerta del aula. Las cartas de venta viven aparte, en
 * `src/data/cartas.ts`.
 *
 * Esto es **la fachada**: lo que se ve antes de pagar y antes de entrar. No hay
 * base de datos detrás todavía, ni derechos de acceso, ni webhook. El día que
 * los haya, este fichero es lo que se sustituye por una consulta — por eso la
 * forma de `Product` ya se parece a la fila que tendrá `products`.
 *
 * **Regla que manda sobre todas:** nada que no funcione se publica enlazado.
 * Un producto en `proximamente` y sin carta no tiene página y su ficha no es
 * un enlace. Se dice que está por llegar en vez de fingir que existe. Con
 * carta sí tiene página, y su botón dice la verdad: «Avísame cuando abra».
 *
 * **Los textos no viven en los componentes.** Cambiar una frase de una ficha
 * es tocar este fichero, nunca maquetación.
 */

/**
 * Los cuatro estados de una ficha (decididos el 19 sep 2026). Los del código
 * solo usan `venta` y `proximamente`; `borrador` y `cerrado` llegaron con la
 * pestaña Tienda del panel, el 23 sep 2026:
 *   borrador      no se ve en ninguna parte
 *   proximamente  se ve; su botón es «Avísame cuando abra»
 *   venta         se ve y se compra
 *   cerrado       se ve y no se compra; quien ya lo tiene, lo sigue teniendo
 */
export type Estado = 'borrador' | 'proximamente' | 'venta' | 'cerrado';

/** Manda cómo se cobra y cómo caduca el derecho de acceso, no cómo se pinta. */
export type Tipo = 'membresia' | 'curso';

export type Copia = {
  nombre: string;
  /** Una línea en la ficha del catálogo. 100–140 caracteres. */
  resumen: string;
  /** Lo que se lee bajo el precio: «al mes» o «pago único». */
  cadencia: string;
  precio: string;
  /** Texto del marco cuando todavía no hay foto. */
  fotoPie: string;
  fotoAlt?: string;
};

export type Product = {
  slug: string;
  tipo: Tipo;
  estado: Estado;
  /** El número que va al margen de la ficha. Se escribe, no se calcula. */
  num: string;
  /**
   * La foto del producto. Sin ella, la ficha dibuja un marco con su etiqueta.
   * Importada de `src/assets` en el catálogo del código; una URL cuando la
   * ficha viene de la pestaña Tienda (el bucket público «tienda»).
   */
  foto?: ImageMetadata | string;
  copia: Record<Lang, Copia>;
};


/** Dónde vive hoy la membresía. Una sola constante: al mudarla se toca acá. */
export const ACADEMIA = 'https://emilseriosacademy.com';

/**
 * La puerta del aula: el botón de la página `/aulavirtual/` y el de la cápsula
 * de la cabecera en la tienda.
 *
 * **Desde la capa A (20 sep 2026) es una ruta de esta casa**, no un salto a la
 * academia. La sesión vive acá, contra el mismo Supabase de siempre. Se deja
 * escrito acá y no se llama a `entrarPath()` desde cada sitio porque este
 * fichero es el que ya reunía las direcciones de la puerta, y porque la cápsula
 * de la cabecera —que es del sitio público— no debería tener que importar nada
 * del aula para pintar un enlace.
 */
export const entrarHref: Record<Lang, string> = {
  es: '/aulavirtual/entrar/',
  en: '/en/classroom/signin/',
};

/** Lo que lleva la ficha de un curso por salir: nombre, una línea y la foto. */
type Ficha = { nombre: string; resumen: string; fotoAlt: string };

/**
 * Un curso por salir: su ficha en el catálogo, sin página ni precio.
 *
 * **Desde el 23 sep 2026 tienen nombre, texto y foto de verdad.** Hasta ese día
 * había uno solo, «Curso 1», con un marco vacío: un hueco anunciado. Emi mandó
 * los tres primeros —el nombre y el texto salen de sus portadas, en los dos
 * idiomas— y Adrián las fotos. Siguen en `proximamente`: no se venden.
 *
 * **Y los tres tienen carta de ventas desde esa misma noche**, con su botón
 * «Avísame cuando abra». Viven en `src/data/cartas.ts`, y un curso con carta
 * tiene página y su ficha es un enlace aunque todavía no se venda
 * (`tienePagina`, abajo).
 *
 * El número es el de la ficha: la membresía es el `01`, así que el curso 1
 * lleva el `02`. **El slug se lee** —`todo-el-diapason`—, porque desde que hay
 * cartas es la dirección que Emi va a compartir. Hasta el 23 sep 2026 eran
 * `curso-01`, `curso-02`, `curso-03`; `curso-01` era además el slug del curso
 * de muestra del aula, y `cursos.ts` se cambió con él.
 */
const proximo = (n: number, slug: string, foto: ImageMetadata, es: Ficha, en: Ficha): Product => ({
  slug,
  tipo: 'curso',
  estado: 'proximamente',
  num: `0${n + 1}`,
  foto,
  copia: {
    /* Sin precio ni cadencia: la ficha dice «Próximamente» en su lugar. El pie
       es el texto del marco sin foto, y estos la tienen. */
    es: { ...es, cadencia: '', precio: '', fotoPie: es.nombre },
    en: { ...en, cadencia: '', precio: '', fotoPie: en.nombre },
  },
});

/** Curso 1. En la portada de Emi: «todo el diapasón: de posición 1 al pulgar sin miedo». */
const diapason = proximo(
  1,
  'todo-el-diapason',
  diapasonFoto,
  {
    nombre: 'Todo el diapasón',
    resumen:
      'De posición 1 al pulgar, sin miedo. Si eres de los que piensan «ayy noo» al ver la clave de sol, esta formación es para ti. Incluye el curso completo «Todas las escalas (sin aburrirte)».',
    fotoAlt: 'Una mano apoyada en el cuerpo de un contrabajo, en una escalinata al sol',
  },
  {
    nombre: 'Fingerboard',
    resumen:
      'From position 1 to thumb, no fear. If you see a treble clef and think «oh no…», this program is for you. Plus the full course «All the scales (without getting bored)».',
    fotoAlt: 'A hand resting on the body of a double bass, on sunlit steps',
  },
);

/** Curso 2. «Contrabajo desde cero: una guía clara y práctica para comenzar». */
const desdeCero = proximo(
  2,
  'contrabajo-desde-cero',
  desdeCeroFoto,
  {
    nombre: 'Contrabajo desde cero',
    resumen:
      'Una guía clara y práctica para comenzar. ¿Cuántos meses de ejercicios técnicos hay que aguantar antes de tocar tu primera obra? ¡Ninguno! En esta formación aprendemos haciendo música, como debe ser.',
    fotoAlt: 'Un contrabajo tumbado en una escalinata de piedra',
  },
  {
    nombre: 'Double bass from scratch',
    resumen:
      'A clear and practical guide to begin. How many months of technical exercises do you have to sit through before your first piece? None! In this program, we learn by making music, the way it should be.',
    fotoAlt: 'A double bass lying on stone steps',
  },
);

/**
 * Curso 3. «Tu vibrato como un cantante».
 *
 * La portada de Emi solo llegó en español; el inglés es traducción. Y su pie
 * decía dos veces «a través del contrabajo» —arriba y abajo de la portada,
 * donde se leen por separado—; en una sola línea se queda una.
 */
const vibrato = proximo(
  3,
  'tu-vibrato-como-un-cantante',
  vibratoFoto,
  {
    nombre: 'Tu vibrato como un cantante',
    resumen:
      'El vibrato es la herramienta más poderosa que tienes para expresarte a través del contrabajo. Encuentra tu propia voz. Te enseño cómo.',
    fotoAlt: 'El mar visto desde arriba, con la espuma de las olas',
  },
  {
    nombre: 'Your vibrato, like a singer',
    resumen:
      "Vibrato is the most powerful tool you have to express yourself through the double bass. Find your own voice. I'll show you how.",
    fotoAlt: 'The sea seen from above, with the foam of the waves',
  },
);

/**
 * La membresía: su ficha en Formaciones.
 *
 * Su carta de ventas —el copy de Emi, las puertas, el cobro— vive en
 * `src/data/cartas.ts`, como las de los cursos, y se pinta con
 * `CartaVenta.astro`. Hasta el 23 sep 2026 este fichero guardaba además otra
 * versión de la carta, la de antes del copy nuevo, en el formato del sitio
 * (`pagina` y `compra`, para `Producto.astro` y `Compra.astro`): esa noche
 * las cartas pasaron todas al sistema del sitio y aquella versión, ya vieja,
 * se borró con sus dos componentes. Está en el historial.
 */
const membresia: Product = {
  slug: 'estudiemos-juntos',
  tipo: 'membresia',
  estado: 'venta',
  num: '01',
  foto: membresiaFoto,
  copia: {
    es: {
      nombre: 'Estudiemos Juntos',
      resumen:
        'La membresía. Un ejercicio nuevo cada jueves, el concepto que lo sostiene, y Emi respondiendo en el foro.',
      cadencia: 'al mes',
      precio: '€65',
      fotoPie: 'Retrato de Emi con el contrabajo',
      fotoAlt: 'Emilse Ríos',
    },
    en: {
      nombre: 'Estudiemos Juntos',
      resumen:
        'The membership. A new exercise every Thursday, the concept that holds it up, and Emi answering in the forum.',
      cadencia: 'a month',
      precio: '€65',
      fotoPie: 'Portrait of Emi with the double bass',
      fotoAlt: 'Emilse Ríos',
    },
  },
};

/**
 * El catálogo, en el orden en que se muestra. La membresía va primera.
 *
 * **Tres cursos anunciados desde el 23 sep 2026**, con nombre, texto y foto.
 * Del 21 al 23 sep hubo uno solo, y era un hueco: seis copias de «Curso N» con
 * el mismo marco vacío no anunciaban seis cursos, anunciaban que la tienda
 * estaba vacía. Los que falten vuelven igual que estos: cuando tengan nombre,
 * texto y foto, con `proximo()`.
 *
 * ⚠️ `todo-el-diapason` no es solo una ficha: es el slug que `cursos.ts` usa
 * para el curso de muestra del aula, y el que lleva la alumna de prueba en su
 * escritorio. Quitarlo de acá deja ese escritorio sin nada que enseñar.
 */
export const catalogo: Product[] = [membresia, diapason, desdeCero, vibrato];

/**
 * Si la ficha de un producto lleva a una página: los que se venden y los que
 * todavía no pero ya tienen su carta escrita (`cartas.ts`).
 */
export const tienePagina = (p: Product): boolean => p.estado === 'venta' || tieneCarta(p.slug);

export const buscarProducto = (slug: string): Product | undefined =>
  catalogo.find((p) => p.slug === slug);
