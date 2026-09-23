import type { Lang } from '../i18n/ui';
import { NEWSLETTER_URL } from '../lib/membership';

/**
 * Las cartas de venta de los cursos, en el formato de la de la membresía.
 *
 * Existen desde el 23 sep 2026. Adrián pasó el copy de Emi de dos cursos —«Todo
 * el diapasón» y «Contrabajo desde cero»— y pidió «mantenemos el formato de la
 * membresía». Así que se pintan con la misma ropa y los mismos bloques que la
 * carta de la membresía (`membresia/Carta.astro`), con `CartaCurso.astro`, y
 * los textos viven acá: cambiar una frase es tocar este fichero, nunca
 * maquetación.
 *
 * **Las dos están en «Próximamente».** Tienen página y precio escrito, pero no
 * se venden todavía: el botón de «Todo el diapasón» sale en gris, sin enlace,
 * con un «Avísame cuando abra» debajo; el de «Contrabajo desde cero» es ese
 * mismo aviso, y lleva al alta del newsletter. Cuando abran, el botón pasa a
 * llevar al cobro — y eso pide su precio en Stripe y un `/api/checkout` que
 * sepa de cursos, que hoy solo sabe de la membresía.
 */

/**
 * Un bloque del cuerpo de una carta. Un texto suelto es un párrafo; el resto
 * dice qué es:
 *   · fuerte     → párrafo en negrita.
 *   · grito      → frase centrada, en cursiva y negrita.
 *   · acento     → la frase más grande de la carta, centrada («El arco.»).
 *   · testimonio → la cita de una alumna, en su recuadro, con su nombre.
 *                  La presentación va en el párrafo de antes, NUNCA dentro.
 *   · lista      → el recuadro de «para ti» (tono 'si', ✓) o «no es para ti»
 *                  (tono 'no', –).
 *   · puntos     → una lista corrida con flechas, sin recuadro: lo que trae el
 *                  curso. Nació con las cartas de los cursos.
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

export type CartaCurso = {
  metaTitle: string;
  metaDesc: string;
  title: string;
  subtitle: string;
  /** La apertura grande, en cursiva: dos renglones. */
  ledeA: string;
  ledeB: string;
  photoAlt: string;
  carta: Bloque[];

  /* --- La tarjeta de precio ---------------------------------------------- */
  includesH: string;
  /** El nombre en el otro idioma, en pequeño al lado del nombre. */
  titleEcho: string;
  priceLabel: string;
  price: string;
  priceNote: string;
  /** Lo que incluye. Sale del propio copy de Emi, no se inventa. */
  priceFeatures: string[];

  /**
   * El botón. **Sin `href` sale en gris y no lleva a ninguna parte**: es lo que
   * pidió Adrián para los cursos que todavía no se venden. Con `href`, es un
   * botón normal.
   */
  boton: { texto: string; href?: string; fuera?: boolean };
  /** La línea bajo el botón mientras no se vende. */
  pronto: string;
  /** El enlace al alta del newsletter bajo un botón gris. Sin él, no se pinta. */
  avisame?: string;
  /** La posdata, entre la tarjeta de precio y las preguntas. */
  pd?: { rotulo: string; text: string };

  faqH: string;
  faq: { q: string; a: string }[];

  footBack: string;
  footHome: string;
  footLegal: string;
};

/**
 * El alta al newsletter: la página alojada de Klaviyo, la misma a la que lleva
 * el «Avísame cuando abran» de la membresía.
 */
export const NEWSLETTER = NEWSLETTER_URL;

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

const diapasonEs: CartaCurso = {
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
  boton: { texto: 'Nos vemos dentro' },
  pronto: 'Próximamente.',
  avisame: 'Avísame cuando abra',

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

  footBack: 'Volver a Formaciones',
  footHome: 'Inicio',
  footLegal: '© 2026 Emilse Rios',
};

const diapasonEn: CartaCurso = {
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
  /* TRADUCIDO: «Nos vemos dentro». */
  boton: { texto: 'See you inside' },
  pronto: 'Coming soon.',
  avisame: 'Let me know when it opens',

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

  footBack: 'Back to Courses',
  footHome: 'Home',
  footLegal: '© 2026 Emilse Rios',
};

/* ==========================================================================
   Contrabajo desde cero — curso 2, ficha 03
   ==========================================================================

   El copy es de Emi, el del 23 sep 2026, entero en los dos idiomas. El botón
   es el alta al newsletter —«Avísame cuando abra»—, que es lo que pidió. */

const desdeCeroEs: CartaCurso = {
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
  boton: { texto: 'Avísame cuando abra', href: NEWSLETTER, fuera: true },
  pronto: 'Próximamente.',
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

  footBack: 'Volver a Formaciones',
  footHome: 'Inicio',
  footLegal: '© 2026 Emilse Rios',
};

const desdeCeroEn: CartaCurso = {
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
  boton: { texto: 'Let me know when it opens', href: NEWSLETTER, fuera: true },
  pronto: 'Coming soon.',
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

  footBack: 'Back to Courses',
  footHome: 'Home',
  footLegal: '© 2026 Emilse Rios',
};

/**
 * Las cartas escritas, por el slug del producto. Un curso con carta tiene
 * página —`/productos/<slug>/`— y su ficha en Formaciones es un enlace, aunque
 * todavía no se venda. Uno sin carta sigue siendo solo su ficha.
 */
export const cartas: Record<string, Record<Lang, CartaCurso>> = {
  'todo-el-diapason': { es: diapasonEs, en: diapasonEn },
  'contrabajo-desde-cero': { es: desdeCeroEs, en: desdeCeroEn },
};

export const tieneCarta = (slug: string): boolean => slug in cartas;
