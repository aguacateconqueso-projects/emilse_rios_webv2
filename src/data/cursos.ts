import type { Lang } from '../i18n/ui';

/**
 * El curso DE MUESTRA del aula — y nada más.
 *
 * **Desde el 23 sep 2026 los cursos de verdad no viven acá**: los carga Emi
 * desde su panel (pestaña Cursos), se guardan en Supabase y llegan al aula por
 * consulta, con la RLS decidiendo quién ve qué. Ver `src/lib/aula-datos.ts` y
 * `supabase/migrations/0009_cursos.sql`.
 *
 * Esto se queda para **la maqueta**: cuando faltan las variables de Supabase
 * —en local, o en una vista previa sin ellas— el aula enseña este curso para
 * que se pueda mirar y probar entera. Los títulos son marcadores escritos con
 * la forma de los cursos de Emi, para juzgar el diseño con textos de largo
 * realista, no con «Clase 1».
 *
 * ⚠️ **Sin imports que no sean tipos.** Este fichero viaja al navegador —lo
 * importa `aula-datos.ts`—, así que no puede tocar `process.env` ni el
 * catálogo (que arrastra las fotos). Hasta ese día lo hacía, y no importaba
 * porque solo se leía en el build.
 */

type Copia<T> = Record<Lang, T>;

export type ClaseMuestra = {
  id: string;
  duracion?: number;
  copia: Copia<{ titulo: string; resumen?: string }>;
};

export type UnidadMuestra = {
  id: string;
  clases: ClaseMuestra[];
  copia: Copia<{ titulo: string }>;
};

export type CursoMuestra = {
  /** El mismo slug que la ficha de Formaciones (`src/data/aula.ts`). */
  slug: string;
  copia?: Copia<{ resumen: string }>;
  unidades: UnidadMuestra[];
};

/** Atajo para no repetir la misma forma once veces. */
const l = (
  id: string,
  duracion: number,
  es: string,
  en: string,
  resumen?: [string, string],
): ClaseMuestra => ({
  id,
  duracion,
  copia: {
    es: { titulo: es, resumen: resumen?.[0] },
    en: { titulo: en, resumen: resumen?.[1] },
  },
});

const unidades: UnidadMuestra[] = [
  {
    id: 'u1',
    copia: {
      es: { titulo: 'Antes de tocar una nota' },
      en: { titulo: 'Before you play a note' },
    },
    clases: [
      l('u1-c1', 412, 'Cómo se presenta este curso', 'How this course works', [
        'Qué vamos a hacer estas seis semanas, en qué orden y por qué ese orden y no otro.',
        "What we'll do over these six weeks, in what order, and why that order and not another.",
      ]),
      l('u1-c2', 736, 'La altura del instrumento', 'Setting the instrument height', [
        'La mitad de los problemas de arco son de altura. Ajustamos el pie y medimos con el arco.',
        'Half of all bow problems are height problems. We set the endpin and measure with the bow.',
      ]),
      l('u1-c3', 598, 'Cómo se sostiene el arco alemán', 'Holding the German bow'),
    ],
  },
  {
    id: 'u2',
    copia: {
      es: { titulo: 'El peso y el punto de contacto' },
      en: { titulo: 'Weight and contact point' },
    },
    clases: [
      l('u2-c1', 845, 'De dónde sale el sonido', 'Where the sound comes from', [
        'El peso no se hace con la mano. Buscamos de dónde viene, y lo sentimos sin el instrumento primero.',
        "Weight doesn't come from the hand. We find where it comes from, and feel it without the instrument first.",
      ]),
      l('u2-c2', 1024, 'Las cuatro avenidas del arco', 'The four lanes of the bow'),
      l('u2-c3', 690, 'Ejercicio: cuerdas al aire con metrónomo', 'Exercise: open strings with a metronome'),
      l('u2-c4', 533, 'Los errores que vas a cometer', "The mistakes you're going to make"),
    ],
  },
  {
    id: 'u3',
    copia: {
      es: { titulo: 'Coordinación de las dos manos' },
      en: { titulo: 'Coordinating both hands' },
    },
    clases: [
      l('u3-c1', 912, 'Por qué la izquierda llega tarde', 'Why the left hand arrives late'),
      l('u3-c2', 1180, 'Legato sin costuras', 'Seamless legato'),
      l('u3-c3', 764, 'Ejercicio: escala de dos octavas', 'Exercise: two-octave scale'),
      l('u3-c4', 486, 'Cómo seguir tú sola desde acá', 'How to carry on by yourself from here'),
    ],
  },
];

export const cursos: CursoMuestra[] = [
  {
    slug: 'todo-el-diapason',
    copia: {
      es: {
        resumen:
          'Tres unidades sobre la base de todo: la altura del instrumento, de dónde sale el peso y cómo dejan de pelearse las dos manos.',
      },
      en: {
        resumen:
          'Three modules on the foundation of everything: instrument height, where the weight comes from, and how the two hands stop fighting each other.',
      },
    },
    unidades,
  },
];
