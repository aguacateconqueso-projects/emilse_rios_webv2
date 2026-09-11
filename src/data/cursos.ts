import type { Lang } from '../i18n/ui';
import { catalogo, type Product } from './aula';

/**
 * El CONTENIDO de los cursos: módulos, clases y dónde vive cada video.
 *
 * Es el gemelo de `src/data/aula.ts` del otro lado de la puerta. Aquel fichero
 * es la **fachada** —lo que se vende: nombre, precio, carta—; este es lo que se
 * compra —lo que hay dentro cuando ya pagaste—. Se atan por el `slug`, que es
 * la identidad del curso en todo el proyecto: la misma cadena en el catálogo,
 * en la URL, en el enlace que Emi pega en un correo y, el día que exista, en su
 * fila de la base de datos.
 *
 * **Todo lo de acá es de muestra.** Los títulos son marcadores, no títulos, y
 * ningún video tiene todavía su identificador: Emi está pasando el material de
 * Vimeo a Bunny Stream, y hasta que termine cada clase se dibuja como el marco
 * vacío que ya usa el resto del sitio para las fotos que no han llegado. Es la
 * regla de la casa: un hueco que se ve es un hueco que alguien arregla.
 *
 * El día que haya base de datos, este fichero es lo que se sustituye por una
 * consulta. Por eso las formas de abajo ya se parecen a las filas que tendrán
 * `courses`, `modules` y `lessons`, y por eso cada lección lleva un `id`
 * estable: **ese id es la clave del progreso**, y si se renumera al reordenar
 * las clases, todo el mundo pierde por dónde iba.
 */

/* ==========================================================================
   Bunny Stream — dónde viven los videos
   ========================================================================== */

/**
 * La biblioteca de Bunny Stream de Emi.
 *
 * Va por variable de entorno porque es dato de despliegue, no de contenido, y
 * porque el día que haya una biblioteca de pruebas aparte no hay que tocar
 * código. Sin ella, todas las clases se dibujan como marco vacío — que es
 * exactamente lo que hay hoy.
 *
 * No es un secreto: el identificador de la biblioteca viaja en el `src` del
 * iframe y lo ve cualquiera con el inspector abierto. Lo que protege el video
 * de Bunny es el **token de firma y la lista de dominios permitidos**, que se
 * configuran en su panel y no acá.
 *
 * ⚠️ Al publicar en el dominio de verdad hay que añadir `emilserios.com` a los
 * *allowed referrers* de la biblioteca, o los embeds se bloquean aunque el
 * código esté bien. Es la misma trampa que ya tiene anotada Vimeo.
 */
export const BUNNY_LIBRARY = process.env.PUBLIC_BUNNY_LIBRARY ?? '';

/** El host del reproductor de Bunny. Solo cambia si ellos lo cambian. */
const BUNNY_HOST = 'https://iframe.mediadelivery.net';

/**
 * La dirección del reproductor de una clase, o `null` si todavía no hay video.
 *
 * `autoplay=false` a propósito: el aula no arranca sola. La alumna llega a la
 * clase, lee de qué va y le da cuando esté lista — y si venía de otra clase,
 * la posición la restaura el guardado del progreso, no el reproductor.
 */
export function bunnySrc(guid?: string): string | null {
  if (!guid || !BUNNY_LIBRARY) return null;
  const q = new URLSearchParams({ autoplay: 'false', preload: 'true', responsive: 'true' });
  return `${BUNNY_HOST}/embed/${BUNNY_LIBRARY}/${guid}?${q}`;
}

/* ==========================================================================
   Las formas
   ========================================================================== */

/** Un material descargable de la clase: la partitura, el PDF del ejercicio. */
export type Recurso = {
  /** A dónde apunta. Hoy no hay ninguno; cuando los haya, van a Storage. */
  href: string;
  copia: Record<Lang, { nombre: string }>;
};

export type Leccion = {
  /**
   * La identidad de la clase, y **la clave con la que se guarda el progreso**.
   *
   * Se escribe, no se calcula a partir del orden: reordenar las clases no debe
   * mover el avance de nadie. Formato `m<módulo>-l<clase>` por comodidad de
   * lectura, pero lo único que importa es que sea único dentro del curso y que
   * no cambie nunca.
   */
  id: string;
  /** El GUID del video en Bunny Stream. Sin él, la clase sale como marco vacío. */
  bunny?: string;
  /** Duración en segundos. Se usa para la barra de avance y para el listado. */
  duracion?: number;
  recursos?: Recurso[];
  copia: Record<Lang, { titulo: string; resumen?: string }>;
};

export type Modulo = {
  id: string;
  lecciones: Leccion[];
  copia: Record<Lang, { titulo: string }>;
};

export type Curso = {
  /** El mismo slug que en el catálogo de `aula.ts`. Es la atadura entre los dos. */
  slug: string;
  /**
   * La línea que describe el curso **por dentro**.
   *
   * No es la del catálogo, y tiene que ser otra: afuera se vende —«todavía no
   * tiene carta de ventas», «Emi anuncia la fecha por el newsletter»— y adentro
   * se estudia. A quien ya pagó, leer en su propio escritorio que el curso está
   * a la espera de su carta de ventas no le dice nada: lo que necesita saber es
   * de qué va lo que compró.
   */
  copia?: Record<Lang, { resumen: string }>;
  modulos: Modulo[];
};

/* ==========================================================================
   El contenido de muestra
   ========================================================================== */

/** Atajo para no repetir la misma forma catorce veces mientras es maqueta. */
const l = (
  id: string,
  duracion: number,
  es: string,
  en: string,
  resumen?: [string, string],
): Leccion => ({
  id,
  duracion,
  copia: {
    es: { titulo: es, resumen: resumen?.[0] },
    en: { titulo: en, resumen: resumen?.[1] },
  },
});

/**
 * Un curso entero de muestra, para que la forma del aula se vea y se pueda
 * probar el recorrido completo: entrar, ver el índice, pasar de clase, que se
 * guarde el minuto, marcar como vista y preguntar.
 *
 * **Los títulos son marcadores.** Están escritos con la forma que tienen los
 * cursos de Emi —arco alemán, técnica, un concepto por módulo— para que el
 * diseño se juzgue con textos de largo realista, no con «Lección 1».
 */
const cursoDeMuestra: Modulo[] = [
  {
    id: 'm1',
    copia: {
      es: { titulo: 'Antes de tocar una nota' },
      en: { titulo: 'Before you play a note' },
    },
    lecciones: [
      l('m1-l1', 412, 'Cómo se presenta este curso', 'How this course works', [
        'Qué vamos a hacer estas seis semanas, en qué orden y por qué ese orden y no otro.',
        "What we'll do over these six weeks, in what order, and why that order and not another.",
      ]),
      l('m1-l2', 736, 'La altura del instrumento', 'Setting the instrument height', [
        'La mitad de los problemas de arco son de altura. Ajustamos el pie y medimos con el arco.',
        'Half of all bow problems are height problems. We set the endpin and measure with the bow.',
      ]),
      l('m1-l3', 598, 'Cómo se sostiene el arco alemán', 'Holding the German bow'),
    ],
  },
  {
    id: 'm2',
    copia: {
      es: { titulo: 'El peso y el punto de contacto' },
      en: { titulo: 'Weight and contact point' },
    },
    lecciones: [
      l('m2-l1', 845, 'De dónde sale el sonido', 'Where the sound comes from', [
        'El peso no se hace con la mano. Buscamos de dónde viene, y lo sentimos sin el instrumento primero.',
        "Weight doesn't come from the hand. We find where it comes from, and feel it without the instrument first.",
      ]),
      l('m2-l2', 1024, 'Las cuatro avenidas del arco', 'The four lanes of the bow'),
      l('m2-l3', 690, 'Ejercicio: cuerdas al aire con metrónomo', 'Exercise: open strings with a metronome'),
      l('m2-l4', 533, 'Los errores que vas a cometer', "The mistakes you're going to make"),
    ],
  },
  {
    id: 'm3',
    copia: {
      es: { titulo: 'Coordinación de las dos manos' },
      en: { titulo: 'Coordinating both hands' },
    },
    lecciones: [
      l('m3-l1', 912, 'Por qué la izquierda llega tarde', 'Why the left hand arrives late'),
      l('m3-l2', 1180, 'Legato sin costuras', 'Seamless legato'),
      l('m3-l3', 764, 'Ejercicio: escala de dos octavas', 'Exercise: two-octave scale'),
      l('m3-l4', 486, 'Cómo seguir tú sola desde acá', 'How to carry on by yourself from here'),
    ],
  },
];

/**
 * Los cursos con contenido cargado.
 *
 * Hoy solo el primero, y de muestra. Los otros cinco existen en el catálogo
 * —`aula.ts`— pero todavía no tienen clases: en el aula se ven con su estado
 * vacío, que está diseñado a propósito y dice la verdad («Emi los está
 * subiendo») en vez de fingir un curso que no está.
 */
export const cursos: Curso[] = [
  {
    slug: 'curso-01',
    copia: {
      es: {
        resumen:
          'Tres módulos sobre la base de todo: la altura del instrumento, de dónde sale el peso y cómo dejan de pelearse las dos manos.',
      },
      en: {
        resumen:
          'Three modules on the foundation of everything: instrument height, where the weight comes from, and how the two hands stop fighting each other.',
      },
    },
    modulos: cursoDeMuestra,
  },
];

/* ==========================================================================
   Consultas
   ========================================================================== */

export const buscarCurso = (slug: string): Curso | undefined =>
  cursos.find((c) => c.slug === slug);

/** Todas las clases de un curso, en el orden en que se estudian. */
export const leccionesDe = (curso: Curso): Leccion[] =>
  curso.modulos.flatMap((m) => m.lecciones);

/**
 * Los cursos que esta alumna tiene comprados.
 *
 * **Es el único trozo de la maqueta que finge una sesión.** Cuando exista la
 * tabla de derechos de acceso, esto pasa a ser una consulta por usuario y lo
 * demás —el escritorio, el índice, el reproductor— no se entera: siguen
 * recibiendo una lista de cursos y pintándola.
 *
 * Mientras tanto, la alumna de prueba tiene la membresía y el primer curso,
 * que es justo la combinación que enseña las dos mitades del escritorio.
 */
export const ALUMNA_DEMO = {
  nombre: 'Ana',
  membresia: true,
  cursos: ['curso-01'],
} as const;

/** Las fichas de catálogo de los cursos comprados, en el orden del catálogo. */
export const misCursos = (): Product[] =>
  catalogo.filter((p) => p.tipo === 'curso' && ALUMNA_DEMO.cursos.includes(p.slug as 'curso-01'));

/** Los cursos del catálogo que esta alumna todavía no tiene. */
export const cursosPorComprar = (): Product[] =>
  catalogo.filter(
    (p) => p.tipo === 'curso' && !ALUMNA_DEMO.cursos.includes(p.slug as 'curso-01'),
  );

/**
 * `mm:ss` o `h:mm:ss`. Para el listado de clases y para la barra.
 *
 * **Cero no es lo mismo que «no se sabe»:** una clase sin `duracion` devuelve
 * cadena vacía y su hueco desaparece de la ficha, pero estar en el segundo cero
 * de un video es un dato y se escribe `0:00`. Su gemelo del navegador
 * —`Aula.reloj`, en `src/layouts/Aula.astro`— hace exactamente lo mismo, y
 * tienen que seguir haciéndolo: el listado se pinta en el build y los minutos
 * que cambian solos se pintan en el cliente.
 */
export function reloj(segundos?: number): string {
  if (segundos == null || Number.isNaN(segundos) || segundos < 0) return '';
  const s = Math.floor(segundos % 60);
  const m = Math.floor((segundos / 60) % 60);
  const h = Math.floor(segundos / 3600);
  const dosCifras = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${dosCifras(m)}:${dosCifras(s)}` : `${m}:${dosCifras(s)}`;
}
