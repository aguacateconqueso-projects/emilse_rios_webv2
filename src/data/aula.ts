import type { Lang } from '../i18n/ui';

/**
 * El catálogo del Aula Virtual.
 *
 * Esto es **la fachada**: lo que se ve antes de pagar y antes de entrar. No hay
 * base de datos detrás todavía, ni derechos de acceso, ni webhook. El día que
 * los haya, este fichero es lo que se sustituye por una consulta — por eso la
 * forma de `Product` ya se parece a la fila que tendrá `products`.
 *
 * **Regla que manda sobre todas:** nada que no funcione se publica enlazado.
 * Un producto en `proximamente` no tiene página y su ficha no es un enlace. Se
 * dice que está por llegar en vez de fingir que existe.
 */

/** Un producto a la venta tiene página y botón; uno por llegar, ninguna de las dos. */
export type Estado = 'venta' | 'proximamente';

/** Manda cómo se cobra y cómo caduca el derecho de acceso, no cómo se pinta. */
export type Tipo = 'membresia' | 'curso';

/** Cada bloque de una página de producto. Mismo vocabulario que `data/about.ts`. */
export type Bloque =
  | { k: 'prose'; n?: string; paras: string[] }
  | { k: 'anchor'; text: string }
  | { k: 'lista'; n: string; titulo: string; items: string[] }
  | { k: 'faq'; n: string; titulo: string; items: { q: string; a: string }[] };

export type Pagina = {
  /** Titular de la página de venta. */
  titulo: string;
  /** Entradilla, debajo del titular. */
  entradilla: string;
  bloques: Bloque[];
};

export type Copia = {
  nombre: string;
  /** Una línea en la ficha del catálogo. 100–140 caracteres. */
  resumen: string;
  /** Lo que se lee bajo el precio: «al mes» o «pago único». */
  cadencia: string;
  precio: string;
  pagina?: Pagina;
};

export type Product = {
  slug: string;
  tipo: Tipo;
  estado: Estado;
  /** El número que va al margen de la ficha. Se escribe, no se calcula. */
  num: string;
  /**
   * A dónde lleva «Comprar». Hoy sale del sitio: la membresía sigue cobrando en
   * `emilseriosacademy.com` y ahí se queda hasta el cambio de dominio. Cuando
   * el pago viva acá, esto pasa a ser una ruta interna y nada más cambia.
   */
  comprarHref?: Record<Lang, string>;
  /** La carta de ventas larga que Emi ya tiene escrita, si la hay. */
  cartaHref?: Record<Lang, string>;
  copia: Record<Lang, Copia>;
};

/** Dónde vive hoy la membresía. Una sola constante: al mudarla se toca acá. */
export const ACADEMIA = 'https://emilseriosacademy.com';

/** El botón de arriba a la derecha del aula. Lleva al aula que ya funciona. */
export const entrarHref: Record<Lang, string> = {
  es: `${ACADEMIA}/entrar/`,
  en: `${ACADEMIA}/entrar/en/`,
};

/**
 * Los seis cursos que están por salir.
 *
 * Emi los tiene grabados; lo que falta es su estrategia de venta —nombre,
 * promesa, precio y carta—. Hasta que llegue, cada uno ocupa su sitio en el
 * catálogo como lo que es: un hueco anunciado. **Los nombres de abajo son
 * marcadores**, no títulos: se sustituyen cuando Emi los mande.
 */
const proximos = (n: number): Product => ({
  slug: `curso-0${n}`,
  tipo: 'curso',
  estado: 'proximamente',
  num: `0${n + 1}`,
  copia: {
    es: {
      nombre: `Curso ${n}`,
      resumen: 'Grabado y a la espera de su carta de ventas. Emi anuncia la fecha por el newsletter.',
      cadencia: '',
      precio: '',
    },
    en: {
      nombre: `Course ${n}`,
      resumen: 'Recorded, waiting on its sales letter. Emi announces the date through the newsletter.',
      cadencia: '',
      precio: '',
    },
  },
});

const membresia: Product = {
  slug: 'estudiemos-juntos',
  tipo: 'membresia',
  estado: 'venta',
  num: '01',
  comprarHref: {
    es: `${ACADEMIA}/api/checkout?lang=es`,
    en: `${ACADEMIA}/api/checkout?lang=en`,
  },
  cartaHref: { es: `${ACADEMIA}/`, en: `${ACADEMIA}/en/` },
  copia: {
    es: {
      nombre: 'Estudiemos Juntos',
      resumen:
        'La membresía. Un ejercicio nuevo cada semana, el concepto que lo sostiene, y Emi respondiendo en el foro.',
      cadencia: 'al mes',
      precio: '€65',
      pagina: {
        titulo: 'Estudiemos Juntos',
        entradilla:
          'Estudiar contrabajo sola tiene un problema, y no es la falta de material: es que nadie te dice si lo que estás haciendo está bien.',
        bloques: [
          {
            k: 'prose',
            n: '01',
            paras: [
              'La membresía es la manera de estudiar conmigo sin que dependa de que coincidamos en un horario. Cada jueves subo un ejercicio nuevo, con el concepto que hay detrás explicado, y durante la semana lo trabajamos.',
              'No hay niveles. El mismo video sirve si llevas seis meses o si llevas quince años: guío las dos versiones dentro de la misma explicación, porque el gesto es el mismo y lo que cambia es cuánto pides de él.',
            ],
          },
          { k: 'anchor', text: 'Un ejercicio a la semana, bien hecho, vale más que veinte a medias.' },
          {
            k: 'lista',
            n: '02',
            titulo: 'Qué hay dentro',
            items: [
              'El ejercicio de la semana, en video, con lo que hay que mirar y lo que hay que evitar.',
              'El concepto base que lo sostiene: por qué ese ejercicio y no otro.',
              'El bonus, que se acumula y no caduca: material que se queda contigo mientras seas miembro.',
              'El foro, donde preguntas y respondo yo. No hay moderadores ni asistentes.',
              'Foro en español y en inglés, cada uno por su lado y sin traducción automática.',
            ],
          },
          {
            k: 'prose',
            n: '03',
            paras: [
              'El ejercicio de cada semana desaparece cuando entra el siguiente. Es a propósito y es lo que más preguntan.',
              'Si se acumularan, la membresía se convertiría en una biblioteca de cosas que nunca vas a abrir — y la sensación de ir atrasada no ayuda a nadie a estudiar. Lo que hay es lo de esta semana, y esta semana da tiempo de sobra.',
            ],
          },
          {
            k: 'faq',
            n: '04',
            titulo: 'Lo que suelen preguntarme',
            items: [
              {
                q: '¿Cómo funciona el pago?',
                a: 'Es una suscripción mensual, como cualquier otra. Pagas el día que entras y ese es tu día de cobro cada mes. El precio con el que entras se congela para ti mientras sigas dentro.',
              },
              {
                q: '¿Puedo pagar en mi moneda?',
                a: 'El cobro va por Stripe, que detecta la moneda de tu tarjeta y cobra en ella. Hoy son €65 al mes.',
              },
              {
                q: '¿Puedo cancelar cuando quiera?',
                a: 'Sí, desde tu cuenta y sin explicar nada. Mantienes el acceso hasta el final del mes que ya pagaste. Si más adelante quieres volver, entras con el precio que esté vigente entonces.',
              },
              {
                q: '¿Hace falta un nivel mínimo?',
                a: 'Hace falta tener el instrumento y haber empezado. A partir de ahí, el material se adapta a lo que traes.',
              },
            ],
          },
        ],
      },
    },
    en: {
      nombre: 'Estudiemos Juntos',
      resumen:
        'The membership. A new exercise every week, the concept that holds it up, and Emi answering in the forum.',
      cadencia: 'a month',
      precio: '€65',
      pagina: {
        titulo: 'Estudiemos Juntos',
        entradilla:
          "Studying double bass alone has one problem, and it isn't a shortage of material: it's that nobody tells you whether what you're doing is right.",
        bloques: [
          {
            k: 'prose',
            n: '01',
            paras: [
              "The membership is how you study with me without us having to share a timetable. Every Thursday I post a new exercise, with the concept behind it explained, and we work on it through the week.",
              'There are no levels. The same video works whether you have been playing six months or fifteen years: I guide both versions inside the same explanation, because the gesture is the same and what changes is how much you ask of it.',
            ],
          },
          { k: 'anchor', text: 'One exercise a week, done properly, beats twenty done halfway.' },
          {
            k: 'lista',
            n: '02',
            titulo: "What's inside",
            items: [
              'The exercise of the week, on video, with what to watch for and what to avoid.',
              'The underlying concept: why that exercise and not another one.',
              "The bonus, which piles up and doesn't expire: material that stays with you while you're a member.",
              'The forum, where you ask and I answer. No moderators, no assistants.',
              'A forum in Spanish and one in English, kept apart, with no machine translation.',
            ],
          },
          {
            k: 'prose',
            n: '03',
            paras: [
              'Each week the exercise disappears when the next one arrives. It is deliberate, and it is what people ask about most.',
              "If they piled up, the membership would turn into a library of things you never open — and feeling behind has never helped anyone practise. What there is, is this week's, and a week is plenty.",
            ],
          },
          {
            k: 'faq',
            n: '04',
            titulo: 'What people usually ask me',
            items: [
              {
                q: 'How does payment work?',
                a: 'It is a monthly subscription like any other. You pay on the day you join and that becomes your billing day each month. The price you join at freezes for you as long as you stay.',
              },
              {
                q: 'Can I pay in my own currency?',
                a: 'Payment runs through Stripe, which detects your card currency and charges in it. Right now it is €65 a month.',
              },
              {
                q: 'Can I cancel whenever I want?',
                a: 'Yes, from your account, with no explanation. You keep access until the end of the month you already paid for. If you come back later, you join at whatever price is in force then.',
              },
              {
                q: 'Do I need a minimum level?',
                a: 'You need the instrument and to have started. From there, the material adapts to what you bring.',
              },
            ],
          },
        ],
      },
    },
  },
};

/** El catálogo, en el orden en que se muestra. La membresía va primera. */
export const catalogo: Product[] = [membresia, ...[1, 2, 3, 4, 5, 6].map(proximos)];

/** Los que tienen página propia: hoy, solo la membresía. */
export const conPagina = (): Product[] =>
  catalogo.filter((p) => p.estado === 'venta' && p.copia.es.pagina && p.copia.en.pagina);

export const buscarProducto = (slug: string): Product | undefined =>
  catalogo.find((p) => p.slug === slug);
