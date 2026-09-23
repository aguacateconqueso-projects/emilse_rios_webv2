import type { Lang } from '../i18n/ui';
import { NEWSLETTER_URL } from '../lib/membership';

/**
 * Las cartas de venta: la de la membresía y las de los cursos.
 *
 * **Desde el 23 sep 2026, por la noche, las cuatro se pintan con el sistema
 * del sitio** —Instrument Serif, Newsreader, IBM Plex Mono, papel y tinta,
 * reglas de 1 px—, dentro de `Base.astro`, con el mismo menú y el mismo pie
 * que la Home y *Sobre mí*. Lo pidió Adrián: «tenemos que unificar estilo».
 * Hasta ese día la de la membresía era un documento aparte con la ropa de la
 * academia —crema, Hanken Grotesk, cursor de clave de fa, notas musicales—, y
 * las de los cursos la copiaban. El componente es `CartaVenta.astro`, y la
 * página, `src/pages/productos/[producto].astro`.
 *
 * Los textos viven acá: cambiar una frase es tocar este fichero, nunca
 * maquetación. Los de la membresía son los del copy nuevo de Emi del 23 sep,
 * traídos tal cual desde `membresia/Carta.astro`, que se borró.
 *
 * **Los cursos todavía no se venden.** Su botón es el alta al newsletter,
 * «Avísame cuando abra», en los tres: Adrián lo prefirió al «Próximamente» y
 * al botón en gris. Cuando abran, `boton` pasa a llevar al cobro — y eso pide
 * su precio en Stripe y un `/api/checkout` que sepa de cursos, que hoy solo
 * sabe de la membresía.
 */

/**
 * Un bloque del cuerpo de una carta. Un texto suelto es un párrafo; el resto
 * dice qué es:
 *   · fuerte     → párrafo destacado, en la tipografía de titulares.
 *   · grito      → frase centrada, en cursiva, en la de titulares.
 *   · acento     → la frase más grande de la carta, centrada («El arco.»).
 *   · testimonio → la cita de una alumna, con su nombre.
 *                  La presentación va en el párrafo de antes, NUNCA dentro.
 *   · lista      → «para ti» (tono 'si') o «no es para ti» (tono 'no').
 *   · puntos     → lo que trae el curso, en filas.
 *
 * ⚠️ En cada carta, **ES y EN tienen que tener los mismos bloques en el mismo
 * orden**: el cambio de idioma se ancla al bloque por su posición.
 */
export type Bloque =
  | string
  | { k: 'fuerte' | 'grito' | 'acento'; text: string }
  | { k: 'testimonio'; text: string; autor: string }
  | { k: 'lista'; tono: 'si' | 'no'; titulo: string; items: string[] }
  | { k: 'puntos'; titulo?: string; items: string[] };

/** Los textos de las puertas de la membresía. Solo ella las tiene. */
export type Puertas = {
  /** Plantillas: {time} = 23:59, {tz} = CEST/CET, {date} = 2 de septiembre. */
  closeLeadToday: string;
  closeLeadDay: string;
  payClosed: string;
  closedNote: string;
  closedNoteNoDate: string;
  closedLink: string;
};

export type Carta = {
  metaTitle: string;
  metaDesc: string;
  title: string;
  subtitle: string;
  /** La apertura grande: dos renglones. */
  ledeA: string;
  ledeB: string;
  photoAlt: string;
  carta: Bloque[];

  /* --- La ficha de precio ------------------------------------------------- */
  includesH: string;
  /** El nombre en el otro idioma, en cursiva al lado del nombre. */
  titleEcho: string;
  priceLabel: string;
  price: string;
  /** «/mes» en la membresía. Los cursos no llevan. */
  pricePer?: string;
  /** Lo que se lee bajo el precio, destacado. */
  priceNote?: string;
  priceNoteRest?: string;
  /** Lo que incluye. Sale del propio copy de Emi, no se inventa. */
  priceFeatures: string[];
  /** La letra pequeña bajo la ficha. */
  priceFoot?: string;

  /** El botón. `fuera`: abre en otra pestaña (el alta del newsletter). */
  boton: { texto: string; href: string; fuera?: boolean };

  /** La frase grande de cierre, antes del último botón (membresía). */
  final?: string;
  /** Testimonios en su propia sección, tras la ficha de precio (vibrato). */
  testimonios?: { titulo: string; items: { text: string; autor: string }[] };
  /** La posdata, entre la ficha de precio y las preguntas. */
  pd?: { rotulo: string; text: string };

  faqH: string;
  /** `correo` y `a2`: la respuesta sigue con un enlace de correo y remata. */
  faq: { q: string; a: string; correo?: string; a2?: string }[];
  /** El pie del newsletter, al final (membresía). */
  news?: { pre: string; link: string };
  /** Las puertas y la cuenta atrás (membresía). */
  puertas?: Puertas;
};

/**
 * El alta al newsletter: la página alojada de Klaviyo. Es el botón de los
 * cursos que todavía no se venden y el pie de la membresía.
 */
export const NEWSLETTER = NEWSLETTER_URL;

/** El botón de los cursos que todavía no se venden, en los dos idiomas. */
const AVISAME = {
  es: { texto: 'Avísame cuando abra', href: NEWSLETTER, fuera: true },
  en: { texto: 'Let me know when it opens', href: NEWSLETTER, fuera: true },
};

/* ==========================================================================
   Todo el diapasón — curso 1, ficha 02
   ==========================================================================

   El copy es de Emi, el del 23 sep 2026, palabra por palabra. Lo único
   nuestro es la ropa: qué frase va en negrita, cuál centrada.

   ⚠️ **El inglés llegó cortado.** En el mensaje de Adrián, después de «You
   don’t need to practice 8 hours a day.» faltaba todo hasta la última
   pregunta frecuente: el final de ese párrafo, el siguiente, el precio, el
   botón y las preguntas 1 a 6 —de la 6 solo quedaba la cola—. **Esos trozos
   están traducidos por nosotros desde el español**, siguiendo el tono de la
   carta de «Double bass from scratch», que sí llegó entera. Conviene que Emi
   los mire. Van marcados con «TRADUCIDO» en el comentario de cada uno. */

const diapasonEs: Carta = {
  metaTitle: 'Todo el diapasón — Formación de Emilse Rios',
  metaDesc:
    'De posición 1 al pulgar, ¡sin miedo! Dos formaciones: «Todo el diapasón» y «Todas las escalas (sin aburrirte)», con obras y acompañamiento de piano desde el nivel uno.',
  title: 'Todo el diapasón',
  subtitle: 'De posición 1 al pulgar, ¡sin miedo!',
  ledeA:
    'Si alguna vez te has sentido estancado con el instrumento y eres de los que piensa «ay noo, otra vez» cada vez que ve una clave de sol en la partitura,',
  ledeB: 'esta formación es para ti.',
  photoAlt: 'Una mano apoyada en el cuerpo de un contrabajo, en una escalinata al sol',
  carta: [
    'En realidad, son dos formaciones. Una te muestra el camino y la otra te mantiene en forma.',
    'La primera, «Todo el diapasón: De posición 1 al pulgar, ¡sin miedo!»: conoces todo el diapasón tocando obras reales con acompañamiento de piano desde el nivel uno.',
    'La segunda es mi formación completa de escalas, a la que me encanta llamar «Todas las escalas (sin aburrirte)».',
    { k: 'grito', text: 'En esta historia te cuento por qué van juntas y por qué son necesarias:' },
    'Hace un tiempo, uno de mis alumnos me avisó unas horas antes de su clase que quería grabarla.',
    'Sus padres habían tomado una decisión: nada de música hasta que mejorara sus calificaciones. Sin clases, sin orquesta, sin contrabajo. Esa iba a ser su última clase por tiempo indefinido.',
    'Pasé toda la mañana pensando qué darle en una hora. Nunca había estado tan molesta y triste, y a la vez con tantas ganas de contener a alguien.',
    'Ponerme en su lugar me generaba demasiadas emociones.',
    'No quería aturdirlo con información, así que decidí regalarle un tiempo de disfrute: terminamos su obra (teníamos un par de meses con «Canción triste» de Koussevitzky) y la tocó como si fuese un recital.',
    'Al final le dejé un resumen de todo lo que había logrado en nuestro periodo de clases: técnica, escalas, obras. En un año ya tocaba con soltura y se había unido a una orquesta de jóvenes.',
    'Así tendría no solo una guía para volver a transitar, sino la motivación de estar recordando algo que ya sabía, no aprendiéndolo por primera vez. Es diferente.',
    {
      k: 'fuerte',
      text: 'Esa tarde me quedé pensando: ¿cómo no tengo algo así para todos? Una guía completa, organizada, a la que cualquiera pueda volver — después de una pausa, después de un año, después de lo que sea.',
    },
    'Sinceramente, me tomó muchos meses. Entre alumnos y orquesta, fue todo un reto. Pero hoy estoy muy feliz de poder traerte esta formación intensiva.',
    'Esta guía es perfecta si estás conociendo el instrumento desde un nivel inicial o retomando después de una pausa — siempre podrás volver a ella. Y si te surge alguna duda en el camino, será bienvenida: en el aula virtual encontrarás un foro para hacer tus preguntas, y yo te acompaño en el proceso.',
    'Está diseñada para que aprendas a moverte por el diapasón de manera fluida, desde la primera posición hasta el pulgar, en tiempo récord.',
    'Como todo en la vida, la constancia va a determinar tu progreso — pero de mi parte te dejo todos los recursos para que toques con fluidez a lo largo de todo el instrumento en pocos meses.',
    { k: 'grito', text: '¡Y sí, la posición del pulgar también!' },
    'Me parece muy gracioso el miedo colectivo que hay a esta posición. Muy sinceramente te digo: todo es más fácil en ese registro.',
    'No hay que tenerle miedo a la posición del pulgar. Hay que tenerle miedo a las bañeras — esas sí que deben darte miedo. Pero esa es otra historia…',
    'El caso es que los nuevos métodos de enseñanza del contrabajo se enfocan en comenzar por ahí. No quiero aburrirte con detalles: mi meta con este curso es que disfrutes cada paso. Por eso, en cada región del diapasón tendrás una obra con acompañamiento de piano, para tocar y poner en práctica lo técnico.',
    'Está diseñado para que no te quedes estancado años viendo libros de técnica. Puedes verlos, si te hace feliz, mientras tocas en orquestas y ensambles y disfrutas de tu instrumento.',
    {
      k: 'puntos',
      titulo: 'Dentro de esta formación intensiva de contrabajo encontrarás:',
      items: [
        'Un ejercicio básico que, tocando solo 3 escalas, te hace recordar las notas de toda la parte grave del contrabajo.',
        'Otra versión del mismo ejercicio que te hace recordar las notas de toda la parte grave y media del contrabajo, tocando solo 4 escalas. Con esto ya tienes para reconocer todo hasta la posición de pulgar. Simple.',
        'Un ejercicio de articulación que te hace entender la forma de la mano en la posición de pulgar. No siempre es la misma; acá entenderás por qué.',
        'Bienvenido a la clave de sol: entramos a la posición temida. ¿Y cómo se coloca el pulgar? Hay dos maneras: depende de si eres un superhéroe o no, te funciona una o la otra.',
        '¿Puedes usar marcas en el diapasón para tener referencia? Al inicio, sí, y aquí te explico por qué.',
        'Vamos a ver obras con acompañamiento de piano en cada región del diapasón: Mahler, Marcello y Handel. Hacer música desde el inicio es la mejor manera de desarrollar el oído melódico.',
        'Los acompañamientos de piano están en 3 velocidades, así puedes avanzar a tu ritmo. Sin excusas.',
        'Tus preguntas las voy respondiendo en el foro: esta es una formación que sí tiene acompañamiento continuo y personalizado.',
      ],
    },
    {
      k: 'fuerte',
      text: 'Y después, cuando ya sabes ubicarte en el diapasón, ahí entra la segunda formación: «Todas las escalas (sin aburrirte)».',
    },
    { k: 'grito', text: 'Escalas. Muchos las odian. Todos las necesitamos.' },
    'Seguro te ha pasado: no entender cómo debe sonar la siguiente nota, sentir que no tienes fuerza para mantenerte en posición, no poder coordinar que el arco cambie igual que la mano izquierda, no entender el beat del metrónomo.',
    'Si eres de los que piensa «¡si escucho el metrónomo, me pierdo!», tranquilo, lo vamos a resolver. La finalidad es desarrollar ritmo interno y oído armónico poco a poco, sin aburrirse (por algo se llama así la formación).',
    '¿Y cuál es la parte divertida? El acompañamiento de piano. El piano de fondo desarrolla tu oído melódico cada día: dejas de depender del afinador y tienes un metrónomo automático marcándote cada beat.',
    { k: 'acento', text: 'HER·MO·SO.' },
    'La verdad es que todos debemos estudiar escalas — todos, sin importar el nivel. Y con piano, es muchísimo más divertido.',
    { k: 'fuerte', text: 'Tú puedes lograrlo. Solo necesitas constancia y la guía correcta.' },
    {
      k: 'lista',
      tono: 'si',
      titulo: 'Esta formación es para ti si:',
      items: [
        'Llevas meses — o años — en la misma posición sin avanzar.',
        'Quieres entrar a una orquesta o ensamble, pero no te puedes mover con fluidez a lo largo del diapasón.',
        'Eres músico de jazz y no conoces la posición de pulgar, pero quieres animarte a hacer solos y melodías para aportar algo diferente.',
        'Volviste de una pausa y no sabes por dónde retomar.',
        'Sientes que el pulgar es un territorio lejano y un poco intimidante.',
        'Quieres mantenerte activo con el contrabajo, con una guía clara.',
      ],
    },
    {
      k: 'lista',
      tono: 'no',
      titulo: 'Esta formación NO es para ti si:',
      items: [
        'No conoces lo básico del instrumento: cómo pararte, sostenerlo y mantener una buena postura corporal. Si es tu caso, te recomiendo mi formación «Contrabajo desde cero»: allí vas a construir buenas bases.',
        'No sabes leer partituras: vas a necesitar un mínimo de conocimiento para leer las obras y los ejercicios.',
        'No tienes tiempo para dedicarle. Es un curso intensivo, pero no mágico: requiere un mínimo de inversión de tiempo. Recuerda que la constancia lo es todo.',
      ],
    },
    'No necesitas haber estudiado en un conservatorio. No necesitas practicar 8 horas todos los días. Solo necesitas constancia — y las ganas de avanzar con el instrumento.',
    'Tienes la libertad de avanzar a tu propio ritmo. Yo estoy aquí para acompañarte en el proceso.',
  ],

  includesH: 'Te cuento qué incluye',
  titleEcho: 'Fingerboard',
  priceLabel: 'Precio',
  price: '240 €',
  priceNote: 'El acceso a las dos formaciones es de 240 €.',
  priceFeatures: [
    '«Todo el diapasón: De posición 1 al pulgar, ¡sin miedo!», completa.',
    '«Todas las escalas (sin aburrirte)», completa.',
    'Obras y escalas con acompañamiento de piano en 3 velocidades.',
    'Foro de preguntas: las respondo yo.',
    'El acceso es tuyo, sin fecha de caducidad, 24/7.',
  ],
  boton: AVISAME.es,

  faqH: 'Preguntas frecuentes',
  faq: [
    {
      q: '¿Necesito un nivel avanzado para entrar?',
      a: 'No. Necesitas conocer lo básico del instrumento (si empiezas desde cero absoluto, mi curso «Contrabajo desde cero» es el paso previo). Desde ahí, esta guía te lleva progresivamente hasta el pulgar.',
    },
    {
      q: '¿De verdad son dos cursos?',
      a: 'Sí. «Todo el diapasón» y «Todas las escalas (sin aburrirte)», completos, los dos en tu aula virtual desde el primer día. Decidí no separarlos porque uno te enseña a moverte por el instrumento y el otro te mantiene en forma. Se necesitan.',
    },
    {
      q: '¿Cuánto tiempo tengo acceso?',
      a: 'El acceso es tuyo, sin fecha de caducidad, 24/7. Puedes volver a la guía después de una pausa, de un año, de lo que sea. Para eso la hice.',
    },
    {
      q: '¿Cómo funciona el acompañamiento?',
      a: 'Por el foro que encuentras dentro del aula virtual, haces tus preguntas y te respondo. Y si te animas a mandarme un video tocando, bienvenido — también los reviso.',
    },
    {
      q: '¿Necesito un pianista?',
      a: 'No. Todos los acompañamientos están grabados: los descargas o los reproduces desde el aula y tocas encima.',
    },
    {
      q: '¿Necesito leer partituras?',
      a: 'Sí, lo básico. Cada escala y obra viene con su PDF para el atril, video de referencia donde la toco y el audio del piano.',
    },
    {
      q: '¿Cuánto tiempo necesito a la semana?',
      a: 'Media hora al día, los días que puedas. La constancia hace el resto.',
    },
  ],

};

const diapasonEn: Carta = {
  metaTitle: 'Fingerboard — A program by Emilse Rios',
  metaDesc:
    'From position 1 to thumb, no fear! Two programs: “Fingerboard” and “All the scales (without getting bored)”, with pieces and piano accompaniment from level one.',
  title: 'Fingerboard',
  subtitle: 'From position 1 to thumb, no fear!',
  ledeA:
    'If you’ve ever felt stuck with the instrument, and you’re the kind of person who thinks “oh nooo, not again” every time you see a treble clef on the page,',
  ledeB: 'this program is for you.',
  photoAlt: 'A hand resting on the body of a double bass, on sunlit steps',
  carta: [
    'The truth is, it’s two programs. One shows you the way, and the other keeps you in shape.',
    'The first, “Fingerboard: from position 1 to thumb, No fear!”: you get to know the whole fingerboard by playing real pieces with piano accompaniment from level one.',
    'The second is my complete scales program, which I love calling “All the scales (without getting bored).”',
    { k: 'grito', text: 'In this story I’ll tell you why they go together and why you need both:' },
    'A while ago, one of my students let me know, a few hours before his lesson, that he wanted to record it.',
    'His parents had made a decision: no music until his grades improved. No lessons, no orchestra, no double bass. That was going to be his last lesson for who knew how long.',
    'I spent the whole morning thinking about what to give him in one hour. I had never been so angry and sad, and at the same time so eager to hold someone up.',
    'Putting myself in his shoes stirred up too many emotions.',
    'I didn’t want to overwhelm him with information, so I decided to give him time to simply enjoy: we finished his piece (we’d spent a couple of months on Koussevitzky’s “Chanson triste”) and he played it as if it were a recital.',
    'At the end, I left him a summary of everything he had achieved during our time together: technique, scales, pieces. In one year he was already playing with ease and had joined a youth orchestra.',
    'That way he’d have not just a guide to come back to, but the motivation of remembering something he already knew, not learning it for the first time. It’s different.',
    {
      k: 'fuerte',
      text: 'That afternoon I kept thinking: why don’t I have something like this for everyone? A complete, organized guide anyone can come back to — after a break, after a year, after whatever.',
    },
    'Honestly, it took me many months. Between students and orchestra, it was quite a challenge. But today I’m very happy to bring you this intensive program.',
    'This guide is perfect if you’re getting to know the instrument from a beginner level or coming back after a break — you can always return to it. And if a question comes up along the way, it’s welcome: in the virtual classroom you’ll find a forum to ask your questions, and I’m with you through the process.',
    'It’s designed so you learn to move across the fingerboard fluently, from first position to thumb, in record time.',
    'Like everything in life, consistency will determine your progress — but from my side, I’m giving you all the resources you need to play fluently across the whole instrument in a few months.',
    { k: 'grito', text: 'And yes, thumb position too!' },
    'I find the collective fear of this position really funny. I’ll tell you very honestly: everything is easier in that register.',
    'You don’t need to be afraid of thumb position. Be afraid of bathtubs — those are what should scare you. But that’s another story…',
    'The thing is, the newer double bass teaching methods focus on starting there. I don’t want to bore you with details: my goal with this course is for you to enjoy every step. That’s why, in every region of the fingerboard, you’ll have a piece with piano accompaniment to play and put the technique into practice.',
    'It’s designed so you don’t stay stuck for years looking at technique books. You can look at them, if that makes you happy, while you play in orchestras and ensembles and enjoy your instrument.',
    {
      k: 'puntos',
      titulo: 'Inside this intensive double bass program you’ll find:',
      items: [
        'A basic exercise that, by playing just 3 scales, helps you remember the notes of the whole low register of the double bass.',
        'Another version of the same exercise that helps you remember the notes of the whole low and middle register, playing just 4 scales. With this, you can already recognize everything up to thumb position. Simple.',
        'An articulation exercise that helps you understand the shape of the hand in thumb position. It’s not always the same; here you’ll understand why.',
        'Welcome to the treble clef: we enter the dreaded position. And how do you place the thumb? There are two ways: depending on whether you’re a superhero or not, one or the other will work for you.',
        'Can you use markers on the fingerboard as a reference? At first, yes, and here I explain why.',
        'We’ll work on pieces with piano accompaniment in every region of the fingerboard: Mahler, Marcello, and Handel. Making music from the start is the best way to develop your melodic ear.',
        'The piano accompaniments come in 3 speeds, so you can move at your own pace. No excuses.',
        'I answer your questions in the forum: this is a program that does come with ongoing, personal support.',
      ],
    },
    {
      k: 'fuerte',
      text: 'And then, once you know your way around the fingerboard, the second program comes in: “All the scales (without getting bored).”',
    },
    { k: 'grito', text: 'Scales. Many people hate them. We all need them.' },
    'I’m sure it’s happened to you: not knowing how the next note should sound, feeling you don’t have the strength to hold the position, not being able to coordinate the bow changing at the same time as the left hand, not understanding the metronome’s beat.',
    'If you’re one of those people who thinks “if I listen to the metronome, I get lost!”, relax, we’ll sort it out. The goal is to develop inner rhythm and a harmonic ear little by little, without getting bored (there’s a reason the program has that name).',
    'And what’s the fun part? The piano accompaniment. The piano in the background develops your melodic ear every day: you stop depending on the tuner, and you have an automatic metronome marking every beat for you.',
    { k: 'acento', text: 'HER·MO·SO.' },
    'The truth is, we all need to practice scales — all of us, whatever our level. And with piano, it’s so much more fun.',
    { k: 'fuerte', text: 'You can do it. All you need is consistency and the right guide.' },
    {
      k: 'lista',
      tono: 'si',
      titulo: 'This program is for you if:',
      items: [
        'You’ve spent months — or years — in the same position without moving forward.',
        'You want to join an orchestra or ensemble, but you can’t move fluently across the fingerboard.',
        'You’re a jazz musician who doesn’t know thumb position, but you want to try solos and melodies that bring something different.',
        'You’ve come back from a break and don’t know where to pick up.',
        'Thumb position feels like a distant, slightly intimidating territory.',
        'You want to stay active on the double bass, with a clear guide.',
      ],
    },
    {
      k: 'lista',
      tono: 'no',
      titulo: 'This program is NOT for you if:',
      items: [
        'You don’t know the basics of the instrument yet: how to stand, how to hold it, and how to keep good posture. If that’s you, I recommend my program “Double bass from scratch”: that’s where you’ll build solid foundations.',
        'You can’t read music: you’ll need a minimum of reading skills for the pieces and exercises.',
        'You don’t have time to dedicate to it. It’s an intensive course, but not a magic one: it requires a minimum investment of time. Remember, consistency is everything.',
      ],
    },
    /* TRADUCIDO desde «Solo necesitas constancia…»: el inglés llegó cortado. */
    'You don’t need to have studied at a conservatory. You don’t need to practice 8 hours a day. All you need is consistency — and the drive to move forward with the instrument.',
    /* TRADUCIDO. */
    'You’re free to move at your own pace. I’m here to support you through the process.',
  ],

  includesH: 'What’s included',
  titleEcho: 'Todo el diapasón',
  priceLabel: 'Price',
  price: '€240',
  /* TRADUCIDO. */
  priceNote: 'Access to both programs is €240.',
  priceFeatures: [
    '“Fingerboard: from position 1 to thumb, No fear!”, complete.',
    '“All the scales (without getting bored)”, complete.',
    'Pieces and scales with piano accompaniment at 3 speeds.',
    'A forum for your questions: I answer them myself.',
    'The access is yours, no expiration, 24/7.',
  ],
  boton: AVISAME.en,

  faqH: 'Frequently asked questions',
  faq: [
    /* De la 1 a la 6, TRADUCIDAS desde el español: el inglés llegó cortado
       y de la 6 solo quedaba la cola, que coincide con esta. */
    {
      q: 'Do I need an advanced level to join?',
      a: 'No. You need to know the basics of the instrument (if you’re starting from absolute zero, my course “Double bass from scratch” is the step before). From there, this guide takes you progressively all the way to thumb position.',
    },
    {
      q: 'Is it really two courses?',
      a: 'Yes. “Fingerboard” and “All the scales (without getting bored)”, complete, both in your virtual classroom from day one. I decided not to split them because one teaches you to move around the instrument and the other keeps you in shape. They need each other.',
    },
    {
      q: 'How long do I have access?',
      a: 'The access is yours, no expiration, 24/7. You can come back to the guide after a break, after a year, after whatever. That’s what I made it for.',
    },
    {
      q: 'How does the support work?',
      a: 'Through the forum inside the virtual classroom: you ask your questions and I answer them. And if you feel brave enough to send me a video of yourself playing, you’re welcome to — I review those too.',
    },
    {
      q: 'Do I need a pianist?',
      a: 'No. All the accompaniments are recorded: you download them or play them from the classroom and play along.',
    },
    {
      q: 'Do I need to read music?',
      a: 'Yes, the basics. Each scale and piece comes with its PDF for your music stand, a reference video where I play it, and the piano audio.',
    },
    {
      q: 'How much time do I need per week?',
      a: 'Half an hour a day, on the days you can. Consistency does the rest.',
    },
  ],

};

/* ==========================================================================
   Contrabajo desde cero — curso 2, ficha 03
   ==========================================================================

   El copy es de Emi, el del 23 sep 2026, entero en los dos idiomas. El botón
   es el alta al newsletter —«Avísame cuando abra»—, que es lo que pidió. */

const desdeCeroEs: Carta = {
  metaTitle: 'Contrabajo desde cero — Formación de Emilse Rios',
  metaDesc:
    'Una guía clara y práctica para comenzar: empiezas de cero y haces música en semanas, no en años. Dos obras con acompañamiento de piano, tus primeras escalas y un foro donde te respondo yo.',
  title: 'Contrabajo desde cero',
  subtitle: 'Una guía clara y práctica para comenzar',
  ledeA: '¿Cuántos meses de ejercicios técnicos hay que tener antes de tocar tu primera obra?',
  ledeB: 'Ninguno.',
  photoAlt: 'Un contrabajo tumbado en una escalinata de piedra',
  carta: [
    'En esta historia te cuento por qué — y por qué hay gente que pasa un año entero con el instrumento sin hacer música.',
    'En el 2017, comencé a dar clases en una institución privada de música en la ciudad de Buenos Aires. Era mi primer trabajo como docente fuera de Venezuela.',
    'En el primer encuentro con los alumnos me di cuenta de que solo conocían un libro, un método, y todos lo seguían: era lo que el profe anterior había dejado. Ellos simplemente se esforzaban por avanzar en el libro.',
    '«Yo ya voy por el tomo 2», me dijo el más avanzado. Él tenía ya año y medio con el instrumento.',
    'No lo podía creer.',
    '—¿Y han visto alguna obra para contrabajo? ¿Han hecho algún recital entre ustedes? ¿Alguno se ha animado a tocar en alguna orquesta?',
    '—Aún no, apenas vamos por el libro.',
    '—No hay que terminar ningún libro, se va estudiando en paralelo.',
    '—Acá vemos este método.',
    { k: 'fuerte', text: 'La verdad, no lo puedo creer.' },
    'De donde yo vengo, la filosofía es completamente diferente. En El Sistema de Venezuela — donde crecí como músico — desde la semana uno ya estás tocando. Así sea una pieza corta, arreglada, con cuerdas al aire. No importa. Estás haciendo música. Estás en un ensamble. Estás enamorándote del instrumento antes de que nadie te diga que es difícil.',
    'Por eso, a los 3 meses, mis alumnos argentinos ya estaban haciendo un recital: para nosotros, entre compañeros, pero tocando obras, aprendiendo de una manera diferente.',
    { k: 'grito', text: 'Porque la técnica se aprende tocando, no esperando estar listo para tocar.' },
    'Esa es la razón por la cual existe esta formación: una guía clara para empezar desde cero y hacer música en semanas, no en años.',
    'Y no vas a estar solo en esto. Te acompaño durante todo el proceso.',
    'Tendremos el foro disponible mientras haces la formación: me escribes tus dudas sobre el contenido y te respondo. Y si te animas a mandarme un video tocando, bienvenido — también los reviso.',
    {
      k: 'fuerte',
      text: 'Empezar desde cero con alguien mirando tu proceso no es lo mismo que empezar solo frente a YouTube.',
    },
    'No necesitas conocimiento previo. No necesitas leer partituras perfectamente. No necesitas un talento especial. Solo necesitas un contrabajo a mano y constancia.',
    {
      k: 'puntos',
      titulo: 'Esto es parte de lo que encontrarás en el aula virtual:',
      items: [
        'En el módulo 1 te enseño cuáles son las partes del contrabajo, cómo mantenerlo, limpiarlo y cómo afinarlo.',
        'En un video de 3:35 te muestro cómo encontrar una posición natural que te haga estar cómodo al tocar y evitar dolores y lesiones a futuro. Y sí, la altura del puntal también entra acá.',
        'Hablamos del arco: qué tan tenso debe estar, cuáles son los conceptos básicos para comenzar a tocar y hasta cómo ponerle resina (parece obvio, pero la verdad es que no todos lo hacen bien).',
        '¿Te ha pasado? Cada vez que intentas tocar una cuerda, suena la de al lado. ¡Ja! Típico. Por eso, en un video de 3:00 te muestro un ejercicio superfácil para que domines el cruce de cuerdas.',
        'Vemos las notas de las dos primeras posiciones. No sé si es tan fácil memorizarlas al inicio, pero con nuestra primera obra seguro se te hace más fácil. ¿Por qué? Porque es música, no notas sueltas: al poder recordar la melodía, podrás recordar las notas más fácil.',
        'Aprenderás tus primeras escalas, fundamentales para entrenar tu oído desde el inicio.',
        'Vas a tocar en total dos obras, con arreglos pedagógicos, y ambas tienen acompañamiento de piano en tres velocidades, para que vayas progresando poco a poco. Esto es fundamental para que tu oído melódico vaya desarrollándose: sólo así aprendes a reconocer las notas, que te confieso que es mucho más difícil en esta etapa. Todo es muy grave y nuevo. Paciencia.',
        'Encontrarás un foro donde puedes hacer tus preguntas, esta es una formación que sí tiene acompañamiento personalizado.',
      ],
    },
    {
      k: 'lista',
      tono: 'si',
      titulo: 'Esta formación es para ti si:',
      items: [
        'Acabas de conseguir un contrabajo (o estás por hacerlo) y no sabes por dónde empezar.',
        'Empezaste por tu cuenta con videos sueltos y sientes que no hay un orden.',
        'Llevas meses en ejercicios técnicos y todavía no has tocado tu primera obra.',
        'Crees que ya es tarde para empezar. (No lo es. Yo empecé adulta.)',
        'Eres docente y quieres tener una guía clara para tus alumnos.',
      ],
    },
    {
      k: 'lista',
      tono: 'no',
      titulo: 'Esta formación NO es para ti si:',
      items: [
        'Ya dominas las primeras posiciones y lo que buscas es avanzar por el instrumento. Para eso está «Todo el diapasón: de posición 1 al pulgar, ¡sin miedo!» — esta te quedaría corta.',
        'No tienes un mínimo de tiempo para dedicarle; necesitas por lo menos media hora al día. No tiene que ser todos los días, pero la constancia lo es todo.',
      ],
    },
    {
      k: 'fuerte',
      text: 'Entras de cero. Sales tocando tus primeras escalas y obras con acompañamiento de piano.',
    },
  ],

  includesH: 'Te cuento qué incluye',
  titleEcho: 'Double bass from scratch',
  priceLabel: 'Precio',
  price: '140 €',
  priceNote: 'El acceso a la formación es de 140 €.',
  priceFeatures: [
    'Las partes del contrabajo, cómo mantenerlo, limpiarlo y afinarlo.',
    'Tus primeras escalas y dos obras con acompañamiento de piano en tres velocidades.',
    'Foro de preguntas: te respondo yo, y reviso tus videos.',
    'El acceso es tuyo, sin caducidad, 24/7.',
  ],
  boton: AVISAME.es,
  pd: {
    rotulo: 'PD',
    text: 'En la semana uno de El Sistema, los niños tocan en una orquesta solo con cuerdas al aire. Nadie les dice que no están listos, ni que deben terminar un método antes de entrar. Yo a ti tampoco te lo voy a decir.',
  },

  faqH: 'Preguntas frecuentes',
  faq: [
    {
      q: '¿Necesito tener contrabajo propio?',
      a: 'Necesitas acceso a uno — propio, alquilado o prestado. Esta formación es para tocar desde la primera semana, no para ver videos.',
    },
    {
      q: '¿Necesito saber leer partituras?',
      a: 'No de inmediato, pero te recomiendo aprender. Te explico lo necesario en el camino, y cada obra viene con video de referencia donde la toco, PDF para el atril y el audio del piano.',
    },
    {
      q: '¿Qué arco necesito?',
      a: 'Enseño la toma del arco alemán. Si tienes arco francés, todo el trabajo de mano izquierda y cruce de cuerdas te sirve igual, pero la técnica de arco que muestro es alemana. Es la toma de arco más natural y fácil, y te la recomiendo para comenzar.',
    },
    {
      q: '¿Hay edad máxima?',
      a: 'No. No hay requisito físico, ni edad correcta, ni perfil selecto.',
    },
    {
      q: '¿Cómo funciona el acompañamiento?',
      a: 'Mi aula virtual tiene un foro, mientras haces la formación. Me escribes tus dudas sobre el contenido y te respondo. Y tus videos tocando son bienvenidos — los reviso y te comento.',
    },
    {
      q: '¿Cuánto tiempo necesito?',
      a: 'Media hora al día, los días que puedas. La constancia hace el resto.',
    },
    {
      q: '¿Cuánto dura mi acceso?',
      a: 'Es tuyo, sin caducidad, 24/7. Puedes volver a la guía cuando quieras.',
    },
  ],

};

const desdeCeroEn: Carta = {
  metaTitle: 'Double bass from scratch — A program by Emilse Rios',
  metaDesc:
    'A clear, practical guide to getting started: you begin from scratch and make music in weeks, not years. Two pieces with piano accompaniment, your first scales, and a forum where I answer you myself.',
  title: 'Double bass from scratch',
  subtitle: 'A clear, practical guide to getting started',
  ledeA: 'How many months of technical exercises do you have to do before you play your first piece?',
  ledeB: 'None.',
  photoAlt: 'A double bass lying on stone steps',
  carta: [
    'In this story I’ll tell you why — and why some people spend a whole year with the instrument without making music.',
    'In 2017, I started teaching at a private music school in Buenos Aires. It was my first teaching job outside Venezuela.',
    'At my first meeting with the students, I realized they only knew one book, one method, and they all followed it: it was what the previous teacher had left them. They were simply working hard to get further in the book.',
    '“I’m already on volume 2,” the most advanced one told me. He’d been playing for a year and a half.',
    'I couldn’t believe it.',
    '“And have you looked at any pieces for double bass? Have you played a recital for each other? Has any of you been brave enough to play in an orchestra?”',
    '“Not yet. We’re still working through the book.”',
    '“You don’t have to finish any book. You work through it in parallel.”',
    '“This is the method we use here.”',
    { k: 'fuerte', text: 'I still can’t believe it.' },
    'Where I come from, the philosophy is completely different. In Venezuela’s El Sistema — where I grew up as a musician — you’re playing from week one. Even if it’s a short arranged piece on open strings. It doesn’t matter. You’re making music. You’re in an ensemble. You’re falling in love with the instrument before anyone tells you it’s hard.',
    'That’s why, three months in, my Argentine students were already giving a recital: just for us, among classmates, but playing pieces, learning a different way.',
    { k: 'grito', text: 'Because technique is learned by playing, not by waiting until you’re ready to play.' },
    'That’s the reason this program exists: a clear guide to start from scratch and make music in weeks, not years.',
    'And you won’t be alone in this. I’m with you through the whole process.',
    'We’ll have the forum open while you take the program: you write me your questions about the content, and I answer them. And if you feel brave enough to send me a video of yourself playing, you’re welcome to — I review those too.',
    {
      k: 'fuerte',
      text: 'Starting from scratch with someone watching your progress is not the same as starting alone in front of YouTube.',
    },
    'You don’t need any prior knowledge. You don’t need to read music perfectly. You don’t need special talent. All you need is a double bass within reach, and consistency.',
    {
      k: 'puntos',
      titulo: 'Here’s part of what you’ll find in the virtual classroom:',
      items: [
        'In module 1, I teach you the parts of the double bass, how to look after it, clean it, and tune it.',
        'In a 3:35 video, I show you how to find a natural position that keeps you comfortable while you play and helps you avoid pain and injuries down the road. And yes, endpin height is covered here too.',
        'We talk about the bow: how tight it should be, the basic concepts to start playing, and even how to apply rosin (it sounds obvious, but the truth is not everyone does it right).',
        'Has this happened to you? Every time you try to play one string, the one next to it rings. Ha! Classic. That’s why, in a 3:00 video, I show you a super easy exercise so you can master string crossings.',
        'We learn the notes in the first two positions. I’m not sure they’re that easy to memorize at first, but with our first piece it’ll definitely get easier. Why? Because it’s music, not isolated notes: when you can remember the melody, you’ll remember the notes more easily.',
        'You’ll learn your first scales, essential for training your ear from the start.',
        'You’ll play two pieces in total, with pedagogical arrangements, and both come with piano accompaniment at three speeds, so you can progress little by little. This is essential for developing your melodic ear: it’s the only way you learn to recognize the notes, which, I’ll admit, is much harder at this stage. Everything is so low and new. Patience.',
        'You’ll find a forum where you can ask your questions — this is a program that does come with personal support.',
      ],
    },
    {
      k: 'lista',
      tono: 'si',
      titulo: 'This program is for you if:',
      items: [
        'You just got a double bass (or you’re about to) and don’t know where to start.',
        'You started on your own with random videos and feel there’s no order to it.',
        'You’ve spent months on technical exercises and still haven’t played your first piece.',
        'You think it’s too late to start. (It isn’t. I started as an adult.)',
        'You’re a teacher and want a clear guide for your students.',
      ],
    },
    {
      k: 'lista',
      tono: 'no',
      titulo: 'This program is NOT for you if:',
      items: [
        'You’ve already mastered the first positions and what you’re after is moving further across the instrument. That’s what “Fingerboard: from position 1 to thumb, No fear!” is for — this one would fall short.',
        'You can’t set aside a minimum amount of time for it; you need at least half an hour a day. It doesn’t have to be every day, but consistency is everything.',
      ],
    },
    {
      k: 'fuerte',
      text: 'You come in from scratch. You come out playing your first scales and pieces with piano accompaniment.',
    },
  ],

  includesH: 'What’s included',
  titleEcho: 'Contrabajo desde cero',
  priceLabel: 'Price',
  price: '€140',
  priceNote: 'Access to the program is €140.',
  priceFeatures: [
    'The parts of the double bass, how to look after it, clean it, and tune it.',
    'Your first scales and two pieces with piano accompaniment at three speeds.',
    'A forum for your questions: I answer them myself, and I review your videos.',
    'The access is yours, no expiration, 24/7.',
  ],
  boton: AVISAME.en,
  pd: {
    rotulo: 'PS',
    text: 'In week one of El Sistema, kids play in an orchestra with nothing but open strings. Nobody tells them they’re not ready, or that they have to finish a method book before joining. I won’t tell you that either.',
  },

  faqH: 'Frequently asked questions',
  faq: [
    {
      q: 'Do I need my own double bass?',
      a: 'You need access to one — your own, rented, or borrowed. This program is for playing from the first week, not for watching videos.',
    },
    {
      q: 'Do I need to read music?',
      a: 'Not right away, but I recommend learning. I explain what you need along the way, and each piece comes with a reference video where I play it, a PDF for your music stand, and the piano audio.',
    },
    {
      q: 'What bow do I need?',
      a: 'I teach the German bow hold. If you have a French bow, all the left-hand and string-crossing work still applies, but the bow technique I show is German. It’s the most natural and easiest bow hold, and I recommend it for beginners.',
    },
    {
      q: 'Is there an age limit?',
      a: 'No. There’s no physical requirement, no right age, no ideal profile.',
    },
    {
      q: 'How does the support work?',
      a: 'My virtual classroom has a forum while you take the program. You write me your questions about the content, and I answer them. And your playing videos are welcome — I review them and give you feedback.',
    },
    {
      q: 'How much time do I need?',
      a: 'Half an hour a day, on the days you can. Consistency does the rest.',
    },
    {
      q: 'How long do I have access?',
      a: 'It’s yours, no expiration, 24/7. You can come back to the guide whenever you want.',
    },
  ],

};

/* ==========================================================================
   Tu vibrato como un cantante — curso 3, ficha 04
   ==========================================================================

   El copy es de Emi, el del 23 sep 2026, en los dos idiomas. Dos cosas son
   nuestras:

   · **Los testimonios en inglés están traducidos por nosotros**: llegaron
     solo en español. Van marcados con «TRADUCIDO». Es lo mismo que hace la
     carta de la membresía («translated from Spanish»).
   · **Los emojis del testimonio de Sergio salieron** —«♥️♥️🙌🏼»—: el sistema
     del sitio no los usa. El texto está entero.

   Y el botón es «Avísame cuando abra», como en los otros dos cursos, aunque
   el copy traía «Acá entras» y «Avísame cuando esté disponible este curso»:
   lo pidió Adrián, para unificar. */

const vibratoEs: Carta = {
  metaTitle: 'Tu vibrato como un cantante — Formación de Emilse Rios',
  metaDesc:
    'Encuentra tu propia voz a través del contrabajo. Tu vibrato es la herramienta más poderosa que tienes para expresarte: aprende a dominarlo y a usarlo como un cantante.',
  title: 'Tu vibrato como un cantante',
  subtitle: 'Encuentra tu propia voz a través del contrabajo',
  ledeA:
    'Tu vibrato es la herramienta más poderosa que tienes para expresarte a través del contrabajo.',
  ledeB: 'Te voy a contar una historia de uno de mis contrabajistas favoritos:',
  photoAlt: 'El mar visto desde arriba, con la espuma de las olas',
  carta: [
    'Janne Saksala, en una masterclass, paró a un estudiante justo al llegar al clímax de la «Elegía» de Bottesini y le preguntó: «¿Por qué haces ese A con tercer dedo? ¿Cuál es el mejor dedo que tienes para vibrar?». Y el chico dijo: «El 1», y tocó con uno.',
    'Saksala lo volvió a parar y le dijo: «Prueba con el 2». Y allí estuvo un poco mejor.',
    'Luego le dijo: «Yo, en mi partitura, anoto en las notas que quiero destacar en expresión la letra B, de best vibrato finger».',
    'Es decir, a él no le importa qué digitación es más cómoda para tocar el pasaje: simplemente la construye en base a llegar con dedo 2 al clímax, que es su best vibrato finger (o por lo menos lo era en ese momento), y poder dar su mejor vibrato.',
    {
      k: 'fuerte',
      text: 'Escucharlo decir eso me hizo entender por qué me gusta tanto como contrabajista, lo que lo hace tan musical: está pensando siempre en lo que quiere decir con cada frase. No en qué es lo técnicamente apropiado.',
    },
    'Por eso, cuando escuchamos diferentes versiones de la misma obra por grandes solistas, parecen totalmente diferentes. Puedes buscar en YouTube uno de los conciertos de Bottesini, escoger a 3 de tus solistas favoritos y verás cómo cada uno tiene una forma diferente de cantarlo. Y el tipo de vibrato que deciden usar en cada parte tiene mucho que ver con ello.',
    'Te cuento mi historia con el vibrato. Si sientes que estás estancado con este tema, que tu mano se pone rígida cada vez que lo intentas, tal vez te interese.',
    'Cuando yo comencé a estudiar contrabajo, vibraba como todos al inicio, porque hay que hacerlo: era un «adorno». El único problema que veía era lo difícil que era mantenerlo. Si eran notas muy largas, a la mitad ya mi mano se ponía muy tensa y rígida, y el vibrato era muy nervioso.',
    { k: 'grito', text: 'Para qué te voy a mentir: sonaba como una cabra, jajaja.' },
    'Como todos mis compañeros, intentaba imitar a los grandes: escuchaba las grabaciones y me anotaba en la partitura golpes de arco y sitios donde vibrar.',
    'Pero obviamente no sonaba igual. Mi vibrato de cabra no aportaba nada a la obra.',
    'Un día, en una clase con Félix Petit, recuerdo que me dijo: «Mi niña, ¿por qué decidiste vibrar desde el inicio de la frase?». Yo le dije: «Porque así lo hace Gary Karr». Y bueno… obviamente Gary no tiene vibrato de cabra, así que era desastroso.',
    {
      k: 'fuerte',
      text: 'Pero recuerdo que ese día Félix me dijo: «No puedes copiar el vibrato de otro. Tu vibrato debe ser único. Vamos a trabajarlo».',
    },
    'Y a partir de esa clase comencé a entender que el vibrato no es solo un movimiento repetitivo, que no es un adorno que se aplica a las notas largas. Y que hay infinitas formas de producirlo, como infinitas personalidades en el mundo.',
    'Y como ya sabrás, no puedes copiar la personalidad de alguien más. Se ve, se escucha y se siente falso. Con el vibrato pasa igual.',
    { k: 'acento', text: 'Por eso hice esta formación.' },
    'Está diseñada para que no solo domines la técnica, sino que puedas preguntarte: ¿cómo lo haría si fuese un cantante?',
    'Un cantante tiene algo que decir. Frasea, respira, construye ideas musicales con intención. No repite el texto sin pensar: un buen cantante usa y controla cada nota intencionalmente para contar una historia.',
    'Eso es lo que vamos a hacer con el contrabajo. Que cante. Que tenga tu firma. Que cuando alguien te escuche, no escuche a Gary Karr ni a Saksala ni a tu profesor.',
    { k: 'fuerte', text: 'Te escuche a ti. Lo que tú intencionalmente quieres expresar con cada frase.' },
    { k: 'grito', text: 'La técnica acá está al servicio de la música, no al revés.' },
    {
      k: 'puntos',
      titulo: '¿Qué vas a encontrar dentro del aula virtual?',
      items: [
        '¿Sabías que hay dos tipos de afinación? Una la usas a diario y la otra va a cambiar tu manera de escuchar para siempre.',
        'Te explico por qué tu contrabajista favorito es tu contrabajista favorito: qué lo hace diferente y cómo escuchar la diferencia. Y, por supuesto, cómo usar eso a tu favor.',
        'De dónde viene el movimiento: esto, en un video de 2:00. Fácil.',
        '¿Qué tiene que ver el mar con el vibrato? Mucho. Te lo explico.',
        'Te voy a enseñar el ejercicio más aburrido que existe (es lo que hay). Tan aburrido que vas a querer apagar la compu, pero si tienes paciencia, vas a mejorar en tiempo récord.',
        'En un video de 3:00 te muestro un ejercicio inclusive más aburrido que el anterior. ¿Me vas a odiar? No creo, porque es tan efectivo que luego vas a poder dominar el movimiento. Imposible sonar como una cabra después de esto.',
        'Vibrato continuo: no solo es para los músicos de instrumentos de viento. A nosotros nos hace ganar conexión entre las notas, como un cantante. Esa es la finalidad.',
        '¿Los dedos se separan de la cuerda o no? Siempre me hacen esta pregunta, y acá te lo explico en 2 min. Rápido y sin vueltas: me encanta ir al grano.',
        '¿Una escala puede contar una historia? Es decir, ¿puede tener sentido musical? Acá te muestro cómo — como lo haría un cantante.',
      ],
    },
    {
      k: 'lista',
      tono: 'si',
      titulo: 'Los contrabajistas que más se han beneficiado con este curso son:',
      items: [
        'Estudiantes de conservatorio que quieren avanzar rápido y entender los principios del vibrato.',
        'Contrabajistas de jazz que quieren incluir solos de alto nivel en su performance.',
        'Contrabajistas de orquestas juveniles que necesitan mejorar su vibrato de cabra, jajaja (lo siento, pero es lo que hay).',
        'Contrabajistas profesionales que quieren tener una guía clara para entender el movimiento y explicarlo a sus alumnos.',
      ],
    },
  ],

  includesH: 'Te cuento qué incluye',
  titleEcho: 'Your vibrato, like a singer',
  priceLabel: 'Precio',
  price: '240 €',
  priceFeatures: [
    'Los dos tipos de afinación, y por qué tu contrabajista favorito es tu favorito.',
    'De dónde viene el movimiento, y los ejercicios para dominarlo.',
    'Vibrato continuo, y cómo hacer que una escala cuente una historia.',
    'Foro de preguntas: las respondo yo.',
    'Acceso al aula 24/7, ilimitado, para ver los videos las veces que quieras.',
  ],
  boton: AVISAME.es,

  testimonios: {
    titulo: 'Testimonios',
    items: [
      {
        autor: 'Mat H.',
        text: 'Siento que lo estoy trabajando bien, estoy encontrando mi sonido, mi vibrato. Además esta buenísimo el paso a paso. Cuando tengo tiempo lo escucho y estudio a conciencia y siento que voy progresando.',
      },
      {
        autor: 'Sergio I.',
        text: 'El curso está buenísimo!!! Nunca pensé que iba a poder resolver el karma del vibrato, y eso que todavía no llegué hasta el final!!! Estoy mejorando muchísimo, Gracias a ti',
      },
      {
        autor: 'Josue M.',
        text: 'Me gusta tocar con el video el ejercicio, encima de lo que suena, y una vez que lo tengo ya puedo ir por mi cuenta, me he dado cuenta de los errores que cometía y de la tensión que le ponía al intentar vibrar.',
      },
      {
        autor: 'Mat F.',
        text: 'He mejorado mucho mi vibrato, ahora puedo diferenciar varios tipos de vibrato, aun estoy practicando cuando usar cada uno.',
      },
    ],
  },

  faqH: 'Preguntas frecuentes',
  faq: [
    {
      q: '¿Puedo hacerte preguntas?',
      a: 'Sí, hay un foro dentro del aula virtual: puedes hacer tus preguntas y las respondo personalmente.',
    },
    {
      q: '¿Voy a aprender a cantar en este curso?',
      a: 'Vas a poder usar los recursos expresivos de un cantante y aplicarlos al contrabajo. El instrumento es tu medio para cantar en este curso, no tu voz. Yo no puedo enseñarte a cantar: canto muy, muy feo, por cierto.',
    },
    { q: '¿Cómo es el material?', a: 'Son videos que puedes reproducir solo en el aula virtual.' },
    {
      q: '¿Cuándo puedo ingresar al aula virtual?',
      a: 'Tienes acceso al aula virtual 24/7, de manera ilimitada: allí puedes ver los videos de la formación las veces que quieras.',
    },
    {
      q: '¿Es para principiantes?',
      a: 'No, debes por lo menos conocer el diapasón hasta la región media del instrumento. Si ya la conoces, eres bienvenido. Puedes guardar la parte de vibrato en la posición del pulgar para el futuro: recuerda que el acceso al curso estará allí para ti.',
    },
  ],
};

const vibratoEn: Carta = {
  metaTitle: 'Your vibrato, like a singer — A program by Emilse Rios',
  metaDesc:
    'Find your own voice through the double bass. Your vibrato is the most powerful tool you have to express yourself: learn to master it and use it like a singer.',
  title: 'Your vibrato, like a singer',
  subtitle: 'Find your own voice through the double bass',
  ledeA:
    'Your vibrato is the most powerful tool you have to express yourself through the double bass.',
  ledeB: 'Let me tell you a story about one of my favorite bassists:',
  photoAlt: 'The sea seen from above, with the foam of the waves',
  carta: [
    'Janne Saksala, in a masterclass, stopped a student right as he reached the climax of Bottesini’s “Elegy” and asked him: “Why are you playing that A with your third finger? What’s your best finger for vibrato?” The student said, “My first,” and played it with his first.',
    'Saksala stopped him again and said, “Try your second.” And it got a little better.',
    'Then he told him: “In my part, on the notes I want to bring out expressively, I write the letter B — for best vibrato finger.”',
    'In other words, he doesn’t care which fingering is most comfortable for the passage: he simply builds it around arriving at the climax on finger 2, his best vibrato finger (or at least it was at the time), so he can give his best vibrato.',
    {
      k: 'fuerte',
      text: 'Hearing him say that made me understand why I love him so much as a bassist, what makes him so musical: he’s always thinking about what he wants to say with each phrase. Not about what’s technically appropriate.',
    },
    'That’s why, when we listen to different versions of the same piece by great soloists, they sound completely different. You can look up one of the Bottesini concertos on YouTube, pick 3 of your favorite soloists, and you’ll see how each one has a different way of singing it. And the kind of vibrato they choose for each section has a lot to do with it.',
    'Let me tell you my story with vibrato. If you feel stuck with it, if your hand goes stiff every time you try, you might find it interesting.',
    'When I started playing the double bass, I vibrated like everyone does at the beginning, because you’re supposed to: it was an “ornament.” The only problem I saw was how hard it was to sustain. On very long notes, halfway through, my hand would get tense and stiff, and the vibrato was very nervous.',
    { k: 'grito', text: 'Why lie to you: I sounded like a goat, hahaha.' },
    'Like all my classmates, I tried to imitate the greats: I listened to recordings and marked bowings and places to vibrate in my part.',
    'But obviously it didn’t sound the same. My goat vibrato added nothing to the piece.',
    'One day, in a lesson with Félix Petit, I remember he asked me: “Mi niña, why did you decide to vibrate from the start of the phrase?” I told him: “Because that’s how Gary Karr does it.” And well… obviously Gary doesn’t have a goat vibrato, so it was a disaster.',
    {
      k: 'fuerte',
      text: 'But I remember that day Félix told me: “You can’t copy someone else’s vibrato. Your vibrato has to be your own. Let’s work on it.”',
    },
    'And from that lesson on, I started to understand that vibrato isn’t just a repetitive movement, that it isn’t an ornament you add to long notes. And that there are infinite ways to produce it, just like there are infinite personalities in the world.',
    'And as you probably know, you can’t copy someone else’s personality. It looks, sounds, and feels fake. Vibrato is the same.',
    { k: 'acento', text: 'That’s why I made this program.' },
    'It’s designed so you don’t just master the technique, but can also ask yourself: how would I do this if I were a singer?',
    'A singer has something to say. They phrase, they breathe, they build musical ideas with intention. They don’t repeat the lyrics without thinking: a good singer uses and controls every note on purpose to tell a story.',
    'That’s what we’re going to do with the double bass. Make it sing. Give it your signature. So that when someone hears you, they don’t hear Gary Karr, or Saksala, or your teacher.',
    { k: 'fuerte', text: 'They hear you. What you intentionally want to express with each phrase.' },
    { k: 'grito', text: 'Here, technique serves the music, not the other way around.' },
    {
      k: 'puntos',
      titulo: 'What will you find inside the virtual classroom?',
      items: [
        'Did you know there are two kinds of intonation? You use one every day, and the other will change the way you listen forever.',
        'I explain why your favorite bassist is your favorite bassist: what makes them different and how to hear the difference. And, of course, how to use that to your advantage.',
        'Where the movement comes from: all in a 2:00 video. Easy.',
        'What does the sea have to do with vibrato? A lot. I’ll explain.',
        'I’m going to teach you the most boring exercise in existence (it is what it is). So boring you’ll want to shut your laptop, but if you’re patient, you’ll improve in record time.',
        'In a 3:00 video, I show you an exercise even more boring than the last one. Will you hate me? I don’t think so, because it’s so effective that afterwards you’ll be able to master the movement. Impossible to sound like a goat after this.',
        'Continuous vibrato: it’s not just for wind players. For us, it builds connection between the notes, like a singer. That’s the goal.',
        'Do your fingers leave the string or not? I get asked this all the time, and here I explain it in 2 minutes. Quick, no detours: I love getting straight to the point.',
        'Can a scale tell a story? In other words, can it make musical sense? Here I show you how — the way a singer would.',
      ],
    },
    {
      k: 'lista',
      tono: 'si',
      titulo: 'The bassists who’ve benefited most from this course are:',
      items: [
        'Conservatory students who want to progress fast and understand the principles of vibrato.',
        'Jazz bassists who want to add high-level solos to their performances.',
        'Youth orchestra bassists who need to fix their goat vibrato, hahaha (sorry, but it is what it is).',
        'Professional bassists who want a clear guide to understand the movement and explain it to their students.',
      ],
    },
  ],

  includesH: 'What’s included',
  titleEcho: 'Tu vibrato como un cantante',
  priceLabel: 'Price',
  price: '€240',
  priceFeatures: [
    'The two kinds of intonation, and why your favorite bassist is your favorite.',
    'Where the movement comes from, and the exercises to master it.',
    'Continuous vibrato, and how to make a scale tell a story.',
    'A forum for your questions: I answer them myself.',
    'Unlimited 24/7 access to the classroom, to watch the videos as many times as you like.',
  ],
  boton: AVISAME.en,

  /* TRADUCIDOS los cuatro: llegaron solo en español. */
  testimonios: {
    titulo: 'What students say (translated from Spanish)',
    items: [
      {
        autor: 'Mat H.',
        text: 'I feel like I’m working on it the right way — I’m finding my sound, my vibrato. And the step-by-step is great. When I have time I listen to it and practice mindfully, and I feel I’m making progress.',
      },
      {
        autor: 'Sergio I.',
        text: 'The course is amazing!!! I never thought I’d be able to solve the curse of vibrato, and I haven’t even reached the end yet!!! I’m improving so much. Thank you',
      },
      {
        autor: 'Josue M.',
        text: 'I like playing the exercise along with the video, on top of what’s playing, and once I’ve got it I can go on my own. I’ve noticed the mistakes I was making and the tension I put in when trying to vibrate.',
      },
      {
        autor: 'Mat F.',
        text: 'My vibrato has improved a lot. Now I can tell several kinds of vibrato apart; I’m still practicing when to use each one.',
      },
    ],
  },

  faqH: 'Frequently asked questions',
  faq: [
    {
      q: 'Can I ask you questions?',
      a: 'Yes, there’s a forum inside the virtual classroom: you can ask your questions and I answer them personally.',
    },
    {
      q: 'Will I learn to sing in this course?',
      a: 'You’ll be able to use a singer’s expressive tools and apply them to the double bass. In this course, the instrument is your way of singing, not your voice. I can’t teach you to sing: I sing really, really badly, by the way.',
    },
    { q: 'What’s the material like?', a: 'Videos you can play only inside the virtual classroom.' },
    {
      q: 'When can I access the virtual classroom?',
      a: 'You have unlimited 24/7 access: you can watch the program videos as many times as you like.',
    },
    {
      q: 'Is it for beginners?',
      a: 'No. You should at least know the fingerboard up to the middle register of the instrument. If you do, you’re welcome: you can save the thumb-position vibrato section for later — remember, your access to the course will be there for you.',
    },
  ],
};

/* ==========================================================================
   Estudiemos juntos — la membresía, ficha 01
   ==========================================================================

   El copy nuevo de Emi del 23 sep 2026, traído tal cual desde
   `membresia/Carta.astro` cuando la carta pasó al sistema del sitio. Lo único
   que cambió de forma es la pregunta del correo, que allí iba partida en
   `a1`/`email`/`a2`. Es la única carta con puertas: ver `src/lib/membership.ts`. */

const membresiaEs: Carta = {
  metaTitle: 'Estudiemos Juntos — Membresía de Emilse Rios',
  metaDesc: 'Estudiemos Juntos es una membresía de ejercicios para contrabajistas. El 90% de lo que trabajamos es el arco: un ejercicio nuevo cada jueves y un concepto técnico explicado cada mes.',
  title: 'Estudiemos juntos',
  subtitle: 'La membresía',
  ledeA: 'Siete tomos de un método no te preparan para resolver problemas en el escenario.',
  ledeB: 'Te cuento por qué.',
  photoAlt: 'Emilse Rios',
  carta: [
    'Llegas al ensayo. Repartieron la obra hace dos semanas y hay un pasaje que no te sale. Lo estudiaste. Lo estudiaste bastante, de hecho.',
    'Pero no puedes resolverlo. Y tus compañeros sí: tienen más experiencia, y pueden decirte «si usas más arco cuando vayas a la posición de pulgar la cuerda no se ahoga», «el truco para que se entienda el pasaje rápido es pensar que la cuerda tiene dos lados diferentes», «si anticipas la posición el pasaje te suena más conectado».',
    'Les tomó unos 20 años descubrir esos detalles, pero te los pueden decir en un momento.',
    'Te cuento que traje esta membresía al mundo para ser tu compañera de atril, y esos detalles te los explico en videos de 4 minutos, o 5 dependiendo de lo que estemos trabajando.',
    { k: 'fuerte', text: 'Estudiemos Juntos es una membresía de ejercicios. El 90% de lo que trabajamos es el arco.' },
    '¿Por qué?',
    'Porque es lo que menos te enseñan los métodos.',
    'Porque no importa si estás estudiando por tu cuenta o estás en el conservatorio, la realidad que me encuentro es siempre la misma: métodos progresivos que se basan en la mano izquierda.',
    'Por cierto, te dejo el comentario de una suscriptora. Lo corté y pegué tal cual:',
    { k: 'testimonio', autor: 'Magdalena', text: 'Antes del curso veía solo un método, escalas y todo enfocado a la mano izquierda, y sinceramente lo quería mejorar porque creo que tengo una deficiencia en el arco. Me ayudó a ser más consciente en la manera de producir sonido. Antes tocaba con mucha presión y eso me hizo lesionarme; ahora entiendo mejor cómo funciona todo. Lo uso como calentamiento cada día, y luego me pongo a estudiar lo que tengo que estudiar del conservatorio' },
    { k: 'grito', text: 'Volvamos, ya basta de que el arco sea algo secundario.' },
    'Entre 2012 y 2014 estuve recibiendo master class con Klaus Stoll, ex solista de la Filarmónica de Berlín.',
    'Un comentario suyo me marcó. Me lo dijo mientras yo tocaba el Dittersdorf, obsesionada con encontrar la digitación perfecta. Todo mal, jaja.',
    { k: 'grito', text: '«El arco es nuestra boca, dientes y lengua.»' },
    'Es nuestra más grande herramienta de comunicación.',
    { k: 'fuerte', text: 'Yo buscaba la respuesta en la mano izquierda. Estaba en la derecha.' },
    'Y da igual si tu meta es tocar en orquesta, eres jazzista, músico popular, o simplemente disfrutas tocar todas las suites de Bach en la sala de tu casa.',
    'Las notas las tocan todos —si estudian, claro está, jaja—, pero cómo las tocan, qué tipo de sonido tienen, cómo interpretan el pasaje: eso es 100% trabajo del arco.',
    '¿Lo has notado? Te estudias las notas una y otra vez, lo practicas, y al momento de tocar hay pitos, vibraciones que no sabes por qué pasan, el sonido es nasal, suena plano, no expresivo.',
    'No sabes cómo hacer para que suene como en la grabación que has escuchado 650 veces. Aunque las notas estén, el problema es que dejas a un lado tu principal herramienta de comunicación.',
    { k: 'acento', text: 'El arco.' },
    { k: 'grito', text: 'Por eso existe Estudiemos Juntos.' },
    'Cada jueves te dejo un ejercicio en la plataforma. Uno. Basado en un concepto técnico que te explico una vez al mes: de dónde vienen los movimientos, la coordinación, el sonido. De dónde vienen las cosas, no cómo repetirlas.',
    'Te dejo lo que me escribió Mario, un exalumno del mundo del jazz que ahora está en la membresía:',
    { k: 'testimonio', autor: 'Mario', text: 'La plataforma es muy intuitiva, me gustan mucho los ejercicios. No siempre tengo tiempo de verlos, pero por lo menos me mantengo activo. El trabajo del arco está muy, muy bueno' },
    'Te sigo contando, cada jueves, cuando entra el ejercicio nuevo, el anterior desaparece.',
    'Sí, leíste bien. Yo borro el contenido anterior.',
    '¿Por qué haría eso?',
    'Porque las bibliotecas abruman. Cincuenta ejercicios archivados “para después” terminan en no hacer ninguno — y encima con la culpa de no estar haciendo nada.',
    'Si quieres una biblioteca infinita de ejercicios que nunca vas a hacer ni a terminar de comprender, puedes ir a YouTube. Es gratis, y podrás entretenerte todo el día, pasar horas simplemente buscando ejercicios específicos para ti. Suerte con eso.',
    { k: 'fuerte', text: 'Acá hay un ejercicio esta semana. Si lo haces, avanzas. Si no lo haces, se va y viene otro. Sin culpas. Simple.' },
    '¿Te parece poco un ejercicio por semana? Mira lo que me escribió Laura:',
    { k: 'testimonio', autor: 'Laura', text: 'Siento que me ayudó a organizar un poco más el estudio. Como son pequeñas tareas, las puedo hacer aunque tenga poco tiempo, e igual trabajar algún objetivo' },
    'Volvamos, tienes un canal directo para escribirme. Respondo yo, no una inteligencia artificial. Esta es una membresía con acompañamiento continuo.',
    { k: 'lista', tono: 'si', titulo: 'Las personas que más se han beneficiado de esta membresía son:', items: [
      'Alumnos de conservatorio enfocados en libros de métodos (el típico programa de conservatorio), donde el arco juega un papel secundario.',
      'Jazzistas que quieren incluir el arco en su repertorio, hacer solos y presentar una propuesta única para diferenciarse del resto.',
      'Músicos populares que quieren aprender a tocar con arco para incluir solos y partes melódicas en su repertorio.',
      'Contrabajistas que se sienten estancados con la técnica francesa y quieren cambiarse a arco alemán y dominarlo en poco tiempo.',
      'Personas que estudian por su cuenta y quieren una meta clara semanal para avanzar técnicamente.',
    ] },
    'Y este me llegó de un papá:',
    { k: 'testimonio', autor: 'Sergio', text: 'Esta buenisimo esto, se la di a mi hijo para que vaya trabajando técnica por su cuenta, y me dijo que se entiende muy bien, que entendió por qué no hay que apretar con el pulgar, y le gustan los ejercicios' },
    'Creo fielmente que el arco alemán es la manera más natural de tomar el arco, y gracias a eso es muchísimo más fácil dominar los golpes de arco en menos tiempo. Por eso, esta es una membresía especializada en arco alemán.',
    { k: 'lista', tono: 'no', titulo: 'Esta membresía NO es para ti si:', items: [
      'Buscas una biblioteca infinita de ejercicios para guardar y ver algún día. Acá no hay biblioteca, no hay archivo, no hay “lo veo después”.',
      'Necesitas preparar una meta específica: entrar a un conservatorio, ganar una audición. Para eso hacen falta clases particulares. Esto te mantiene en forma técnicamente y te da bases; no resuelve repertorio puntual.',
      'No tienes un par de horas a la semana. No hace falta que sea todos los días, pero sí un par de días cada semana. Los ejercicios no son mágicos, aunque sí son muy buenos. Debes dedicarles tiempo.',
    ] },
    'Y uno más, de Paloma, antes de contarte qué incluye:',
    { k: 'testimonio', autor: 'Paloma', text: 'Al entrar encontré un video extra que está muy bueno. Son cosas que a lo mejor ya sabía, pero uno va olvidando ponerlas en práctica. Me gusta también que los ejercicios sean cortos: los veo cuando tengo tiempo y siento que me activa la técnica' },
  ],

  includesH: 'Te cuento qué incluye',
  titleEcho: 'Let’s study together',
  priceLabel: 'Precio',
  price: '65 €',
  pricePer: '/mes',
  priceNote: '65 € al mes.',
  priceNoteRest: 'Ese precio se congela para ti. Aunque suba.',
  priceFeatures: [
    'Cada jueves, un ejercicio nuevo en la plataforma basado en un concepto base.',
    'Cada mes, un concepto técnico explicado. Uno solo. Simple.',
    'Acceso a la plataforma 24/7, estés donde estés.',
    'Canal directo de preguntas. Las respondo personalmente.',
  ],
  priceFoot: 'Pagas cada mes el día que entraste: si entras un 20, tu mes va del 20 al 20. Nunca pierdes días. Te puedes dar de baja cuando quieras, sin explicaciones. Eso sí: si te vas y luego vuelves, entras con el precio vigente en ese momento.',
  boton: { texto: 'Acá te unes', href: '/api/checkout?lang=es' },
  final: '¡Estudiemos juntos!',

  faqH: 'Preguntas frecuentes',
  faq: [
    { q: '¿Sirve si toco arco francés?', a: 'Los conceptos sí: el sonido, la distribución, de dónde viene el movimiento. Pero no te lo recomiendo, está pensada para arco alemán. Tampoco te recomiendo el arco francés, pero esa es mi opinión no solicitada de hoy.' },
    { q: '¿Debo tener un nivel avanzado?', a: 'No, pero sí debes manejar al menos las primeras posiciones y sostener el arco con cierta soltura. Cada ejercicio lo dejo adaptado a nivel inicial-intermedio y avanzado.' },
    { q: '¿Qué pasa si entro a mitad de mes?', a: 'Tienes el ejercicio de esa semana hasta que lo reemplace el jueves siguiente. El concepto del mes sí queda disponible durante todo el mes.' },
    { q: '¿Cuánto tiempo necesito?', a: 'Un par de días a la semana, media hora cada uno. No hace falta más.' },
    { q: '¿Cómo funciona el pago?', a: 'Suscripción mensual automática, como Netflix. Pagas el día que entras y ese es tu día de cobro cada mes.' },
    { q: '¿Puedo cancelar cuando quiera?', a: 'Sí, desde tu cuenta, sin explicar nada. Mantienes el acceso hasta el final del período pagado. Si vuelves después, entras con el precio vigente en ese momento.' },
    { q: '¿Cómo hago mis preguntas?', a: 'Me escribes por el aula. Las respondo yo.' },
    { q: '¿En qué idioma es?', a: 'Inglés y español. Te registras en el que prefieras.' },
    { q: '¿Cuesta menos que una clase?', a: 'Sí. Una clase particular cuesta más que un mes entero de membresía (un concepto muy bien explicado y 4 ejercicios para practicarlo).' },
    { q: '¿En qué horarios puedo entrar?', a: '24/7.' },
    { q: 'Tengo una pregunta que no está acá.', a: 'Escríbeme a ', correo: 'info@emilserios.com', a2: ' y te contesto personalmente.' },
  ],
  news: { pre: '¿Aún no estás suscrito al newsletter?', link: 'Acá te suscribes' },
  puertas: {
    closeLeadToday: 'Cierra hoy a las {time} {tz}',
    closeLeadDay: 'Cierra el {date} a las {time} {tz}',
    payClosed: 'Puertas cerradas',
    closedNote: 'Las puertas están cerradas. Abren el {date}.',
    closedNoteNoDate: 'Las puertas están cerradas por ahora.',
    closedLink: 'Avísame cuando abran',
  },
};

const membresiaEn: Carta = {
  metaTitle: "Let's Study Together — Emilse Rios Membership",
  metaDesc: 'Let’s Study Together is an exercise membership for double bassists. 90% of what we work on is the bow: a new exercise every Thursday and one technical concept explained each month.',
  title: "Let's study together",
  subtitle: 'The membership',
  ledeA: 'Seven volumes of a method won’t prepare you to solve problems on stage.',
  ledeB: 'Let me tell you why.',
  photoAlt: 'Emilse Rios',
  carta: [
    'You show up to rehearsal. They handed out the piece two weeks ago and there’s a passage you can’t get. You practiced it. Practiced it a lot, actually.',
    'But you can’t crack it. And the people next to you can: they’ve got more experience, and they’ll tell you things like “use more bow going into thumb position and the string won’t choke,” “the trick for making that fast passage speak is to think of the string as having two different sides,” “if you anticipate the shift the passage sounds more connected.”',
    'It took them about 20 years to figure those details out. They can hand them to you in a second.',
    'That’s why I brought this membership into the world — to be your stand partner. And those details, I explain them in 4-minute videos, or 5 depending on what we’re working on.',
    { k: 'fuerte', text: 'Let’s Study Together is an exercise membership. 90% of what we work on is the bow.' },
    'Why?',
    'Because it’s what methods teach you least.',
    'Because it doesn’t matter whether you’re practicing on your own or sitting in a conservatory, what I run into is always the same: progressive methods built around the left hand.',
    'By the way, here’s a comment from a subscriber. I copied it as-is (translated from Spanish):',
    { k: 'testimonio', autor: 'Magdalena', text: 'Before this membership, I only ever saw one method, scales, everything focused on the left hand, and honestly I wanted to improve that because I think my bow is a weak spot. It helped me become more aware of how I produce sound. I used to play with a lot of pressure and that got me injured; now I understand much better how everything works. I use it as my warm-up every day, and then I get on with whatever I have to practice for the conservatory.' },
    { k: 'grito', text: 'Enough with the bow being an afterthought.' },
    'Between 2012 and 2014 I took master classes with Klaus Stoll, former solo bassist of the Berlin Philharmonic.',
    'One thing he said stuck with me. He said it while I was playing the Dittersdorf, obsessed with finding the perfect fingering. All wrong, ha!',
    { k: 'grito', text: '“The bow is our mouth, our teeth and our tongue.”' },
    'It’s our single greatest tool for communicating.',
    { k: 'fuerte', text: 'I was looking for the answer in my left hand. It was in my right.' },
    'And it makes no difference whether your goal is orchestra, whether you play jazz, pop music, or you just enjoy playing all the Bach suites in your living room.',
    'Everyone plays the notes — if they practice, obviously, ha — but how they play them, what kind of sound they get, how they shape the passage: that’s 100% the bow’s work.',
    'Have you noticed? You practice the notes over and over, you drill them, and then when you play there are whistles, vibrations you can’t explain, the sound is nasal, it’s flat, there’s nothing expressive about it.',
    'You can’t figure out how to make it sound like the recording you’ve listened to 650 times. The notes are there — the problem is you’ve set aside your main tool for communicating.',
    { k: 'acento', text: 'The bow.' },
    { k: 'grito', text: 'That’s why Let’s Study Together exists.' },
    'Every Thursday I leave you one exercise on the platform. One. Built on a technical concept I explain once a month: where the movements come from, the coordination, the sound. Where things come from, not how to repeat them.',
    'Here’s what Mario wrote me — a former student from the jazz world who’s now in the membership:',
    { k: 'testimonio', autor: 'Mario', text: 'The platform is really intuitive and I love the exercises. I don’t always have time to watch them, but at least I stay active. The bow work is really, really good.' },
    'So, every Thursday, when the new exercise goes up, the old one disappears.',
    'Yes, you read that right. I delete the previous content.',
    'Why would I do that?',
    'Because libraries overwhelm you. Fifty exercises filed away “for later” end with you doing none of them — and carrying the guilt of doing nothing on top of it.',
    'If what you want is an infinite library of exercises you’ll never do or fully understand, you can go to YouTube. It’s free, and you can keep yourself busy all day, spending hours just hunting for the exercises that are right for you. Good luck with that.',
    { k: 'fuerte', text: 'Here there’s one exercise this week. Do it and you move forward. Don’t do it and it’s gone, and another one comes. No guilt. Simple.' },
    'Think one exercise a week isn’t enough? Here’s what Laura wrote me:',
    { k: 'testimonio', autor: 'Laura', text: 'I feel it helped me organize my practice a bit more. Since they’re small tasks, I can do them even when I’m short on time and still work toward a goal.' },
    'And guess what? You get a direct line to write to me. I answer, not an AI. This is a membership with real support behind it.',
    { k: 'lista', tono: 'si', titulo: 'The people who’ve gotten the most out of this membership:', items: [
      'Conservatory students buried in method books (the standard conservatory program), where the bow plays second fiddle.',
      'Jazz players who want to bring the bow into their playing, take bow solos, and offer something nobody else in the room is doing.',
      'Popular musicians who want to learn bow so they can add solos and melodic lines to their repertoire.',
      'Bass players who feel stuck with French bow and want to switch to German and get comfortable with it fast.',
      'People practicing on their own who want one clear weekly goal to keep moving technically.',
    ] },
    'And this one came from a dad:',
    { k: 'testimonio', autor: 'Sergio', text: 'I got it for my son so he could work on technique on his own. He told me it’s very easy to understand, that he understood why you shouldn’t squeeze with your thumb, and he likes the exercises.' },
    'I genuinely believe German bow is the most natural way to hold a bow, and because of that the bow strokes come far faster. That’s why this membership is built around German bow.',
    { k: 'lista', tono: 'no', titulo: 'This membership is NOT for you if:', items: [
      'You’re after an infinite library of exercises to save and watch someday. There’s no library here, no archive, no “I’ll get to it later.”',
      'You need to prepare something specific: a conservatory entrance, an audition. That calls for private lessons. This keeps you technically in shape and builds your foundation; it won’t solve a particular piece of repertoire.',
      'You don’t have a couple of hours a week. It doesn’t have to be every day, but it does have to be a couple of days each week. The exercises aren’t magic — they are very good, but you have to put the time in.',
    ] },
    'One last one, from Paloma, before I tell you what’s included:',
    { k: 'testimonio', autor: 'Paloma', text: 'When I joined, I found a bonus video that’s really good — things I maybe already knew but you forget to put into practice. I also like that the exercises are short. I watch them when I have time, and I feel they get my technique going.' },
  ],

  includesH: 'What’s included',
  titleEcho: 'Estudiemos juntos',
  priceLabel: 'Price',
  price: '€65',
  pricePer: '/mo',
  priceNote: '€65 a month.',
  priceNoteRest: 'That price locks in for you: whenever you join, that’s what you pay for as long as you stay.',
  priceFeatures: [
    'Every Thursday, a new exercise on the platform built on a core concept.',
    'Every month, one technical concept is explained — the core concept. Just one. Simple.',
    'Access to the platform 24/7, wherever you are.',
    'A direct chat for your questions. I answer them personally.',
  ],
  priceFoot: 'You’re billed monthly on the day you joined: join on the 20th and your month runs the 20th to the 20th. You never lose days. You can cancel whenever you want, no explanations. One thing though: if you leave and come back later, you come back at whatever the price is then.',
  boton: { texto: 'Join here', href: '/api/checkout?lang=en' },
  final: 'Let’s Study Together!',

  faqH: 'Frequently asked questions',
  faq: [
    { q: 'Does it work if I play French bow?', a: 'The concepts, yes: the sound, the distribution, where the movement comes from. But I wouldn’t recommend it — this is built for German bow. I wouldn’t recommend French bow either, but that’s my unsolicited opinion for the day.' },
    { q: 'Do I need to be advanced?', a: 'No, but you do need at least the first positions and some ease holding the bow. I adapt every exercise for beginner-intermediate and advanced.' },
    { q: 'What if I join mid-month?', a: 'You get that week’s exercise until the next Thursday replaces it. The concept of the month stays up all month.' },
    { q: 'How much time do I need?', a: 'A couple of days a week, half an hour each. No more than that.' },
    { q: 'How does payment work?', a: 'Automatic monthly subscription, like Netflix. You’re charged on the day you join and that’s your billing day every month.' },
    { q: 'Can I cancel anytime?', a: 'Yes, from your account, without explaining anything. You keep access until the end of the period you’ve paid for. If you come back later, you come back at whatever the price is then.' },
    { q: 'How do I ask my questions?', a: 'There’s a message box inside the classroom. You write, I answer.' },
    { q: 'What language is it in?', a: 'English and Spanish. Sign up in whichever you prefer.' },
    { q: 'Is it less than a lesson?', a: 'Yes. One private lesson costs more than a full month of the membership (one concept explained properly and 4 exercises to work on it).' },
    { q: 'When can I log in?', a: '24/7.' },
    { q: 'I have a question that isn’t here.', a: 'Write to me at ', correo: 'info@emilserios.com', a2: ' and I’ll answer personally.' },
  ],
  news: { pre: 'Not subscribed to the newsletter yet?', link: 'Subscribe here' },
  puertas: {
    closeLeadToday: 'Doors close today at {time} {tz}',
    closeLeadDay: 'Doors close on {date} at {time} {tz}',
    payClosed: 'Doors closed',
    closedNote: 'The doors are closed. They open on {date}.',
    closedNoteNoDate: 'The doors are closed for now.',
    closedLink: 'Tell me when they open',
  },
};

/**
 * Las cartas escritas, por el slug del producto. Un producto con carta tiene
 * página —`/productos/<slug>/`— y su ficha en Formaciones es un enlace, aunque
 * todavía no se venda. Uno sin carta sigue siendo solo su ficha.
 */
export const cartas: Record<string, Record<Lang, Carta>> = {
  'estudiemos-juntos': { es: membresiaEs, en: membresiaEn },
  'todo-el-diapason': { es: diapasonEs, en: diapasonEn },
  'contrabajo-desde-cero': { es: desdeCeroEs, en: desdeCeroEn },
  'tu-vibrato-como-un-cantante': { es: vibratoEs, en: vibratoEn },
};

export const tieneCarta = (slug: string): boolean => slug in cartas;
