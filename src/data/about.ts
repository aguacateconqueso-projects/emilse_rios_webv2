import type { Lang } from '../i18n/ui';

export type Testimonial = { text: string; meta: string; pendiente?: boolean };

export type Block =
  | { k: 'ahero'; title: string; paras: string[] }
  | { k: 'prose'; paras: string[] }
  /** Frase-ancla. Varias líneas cuando es una lista, como las tres lecciones. */
  | { k: 'anchor'; text: string | string[] }
  | { k: 'form'; id: string; label?: string }
  | { k: 'testi'; label: string; items: Testimonial[] };

export type AboutCopy = { title: string; blocks: Block[] };

const es: AboutCopy = {
  title: '¿Nos conocemos?',
  blocks: [
    {
      k: 'ahero',
      title: '¿Nos conocemos?',
      paras: [
        '¡Hola! Emilse por acá (aunque casi todos me llaman Emi). La de la foto soy yo.',
        'Acá se supone que te cuente que vengo de una familia de generaciones de músicos, que a los 7 años ya era una niña prodigio y que toco un instrumento prehistórico valorado en 150 billones.',
        'No puedo.',
        'No es mi caso. Y además no te sirve para nada.',
        'Te cuento otra cosa.',
      ],
    },
    {
      k: 'prose',
      paras: [
        'En mi primer día con el instrumento, el profesor del conservatorio me escuchó y me dijo que el contrabajo no era para mí. Que mi mano era muy pequeña. Que no tenía fuerza. Que estaba pasada de edad.',
        'Tenía diez años más que mis compañeros y estaba en la universidad estudiando Sociología. Empezar adulto a estudiar un instrumento tiene eso: para el mundo académico siempre vas atrás. Pero ciertamente tienes algo extra.',
      ],
    },
    { k: 'anchor', text: 'Me gusta llamarlo conciencia para estudiar.' },
    {
      k: 'prose',
      paras: [
        '¿Sabes?',
        'Como cuando ves a esa gente en el gym con el celular en la mano y hablando mientras hace los ejercicios. En realidad no están haciendo nada, están perdiendo el tiempo, entrenando sin conciencia. En el contrabajo pasa igual.',
        'Y esto de estar consciente y atenta a los detalles me funcionó. De hecho me volví una espía obsesiva: preguntando, investigando y estudiando.',
        'Encontré maestros increíbles, de esos que no te encasillan en un libro y te hacen ver métodos «hasta que te salga bien». Los buenos maestros jamás hacen eso. Uno de ellos fue Félix Petit. Por cierto, a él le debo todas las audiciones que he ganado en orquesta.',
      ],
    },
    {
      k: 'prose',
      paras: [
        'Siento que en este camino desarrollé un superpoder: ver el detalle mínimo que está trabando a alguien cuando toca.',
        'No es talento. No te lo enseñan en la carrera. Es lo que te pasa cuando observas mucho y de muchas maneras, sin aferrarte a ningún concepto.',
        'En este camino encontré El Sistema de Orquestas de Venezuela, y ahí entendí por qué aquellos años del comienzo habían sido tan absurdos. Porque en El Sistema desde el día uno ya estás tocando en una orquesta. Así sea con cuerdas al aire y una sola posición, no importa tu edad, no importa tu contexto. Su lema lo dice todo: «Tocar y Luchar».',
        'Para mi cerebro de socióloga eso encajó al instante: la música no es un club de talentosos, no tienes que ser un niño de 7 años con un don especial, y sobre todo, no hay que estar listo para salir a tocar.',
        'En esos 10 años dentro de El Sistema aprendí 3 cosas que quiero compartir contigo:',
      ],
    },
    {
      k: 'anchor',
      text: [
        'Se aprende tocando.',
        'Todos pueden lograrlo.',
        'La constancia sin el enfoque correcto no sirve.',
      ],
    },
    {
      k: 'prose',
      paras: [
        '¿Por qué estoy segura de eso?',
        'Porque siete años después de aquel primer «no» fui la primera mujer contrabajista en tocar como solista y en la fila de la Sinfónica de Maracaibo, mi ciudad natal. Terminé dando clases en el conservatorio que al inicio no me aceptó. Así son las vueltas de la vida.',
        'Cinco años seguidos me invitaron a giras internacionales con la Orquesta Sinfónica Simón Bolívar, bajo la batuta de Gustavo Dudamel y de maestros como Claudio Abbado.',
        'Y en paralelo di clases: la Academia Latinoamericana de Contrabajo, el Conservatorio Simón Bolívar, la Universidad Nacional Experimental de las Artes, diez años formando orquestas infantiles y juveniles de El Sistema.',
        'Después, en Argentina, la Universidad Católica Argentina y el Programa de Orquestas para la Equidad.',
      ],
    },
    {
      k: 'prose',
      paras: [
        '¿Y ahora?',
        'En 2025 di un nuevo salto al vacío, o por lo menos así lo sentí en el cuerpo.',
        'Renuncié a los puestos estables que había ganado por audición en Argentina — asistente de solista en la Sinfónica Municipal de Avellaneda y contrabajista de la Banda Sinfónica de la Ciudad de Buenos Aires — para viajar, tocar y conocer el mundo (un poco más).',
        'Lo hago hasta hoy. Tengo base en Madrid y una academia online donde formo contrabajistas alrededor del mundo.',
        'Si a ti también te dijeron alguna vez que estaba mal sin decirte cómo arreglarlo, creo que nos vamos a llevar bien. Cada semana te escribo y te cuento esos detalles.',
        'En la academia además abro clases 1:1 por temporadas, formaciones y una membresía. Pero no las abro al público general: las comparto solo con mi comunidad. Esta es la puerta de entrada.',
      ],
    },
    { k: 'form', id: 'suscribete', label: 'Contrabajo en la Ciudad' },
    /*
     * «Qué dicen mis alumnos» va acá, y hoy no está.
     *
     * Estuvo publicado con tres huecos en cursiva que decían «testimonio
     * pendiente». Salió el 21 sep 2026: un hueco anunciado vale mientras se
     * está trabajando en la página, pero el sitio ya está en el aire y un
     * visitante no tiene por qué leer nuestras notas internas.
     *
     * **No está retirado, está esperando.** Emi manda los testimonios de
     * verdad y entonces vuelve — y volver es escribir acá el bloque, nada más:
     * el tipo `testi`, su caso en `About.astro` y su CSS siguen puestos y sin
     * tocar, justamente para que sea una sola línea de trabajo y no un
     * rediseño. La forma es:
     *
     *   { k: 'testi', label: 'Qué dicen mis alumnos', items: [
     *       { text: '…', meta: 'Nombre · País' },
     *   ] }
     *
     * `pendiente: true` es lo que pintaba el hueco en cursiva apagada. Un
     * testimonio real no lo lleva.
     */
  ],
};

const en: AboutCopy = {
  title: 'Have we met?',
  blocks: [
    {
      k: 'ahero',
      title: 'Have we met?',
      paras: [
        "Hi! Emilse here (though most people call me Emi). That's me in the photo.",
        "This is where I'm supposed to tell you I come from generations of musicians, that I was a child prodigy at seven, and that I play a prehistoric instrument worth 150 billion.",
        "Can't do it.",
        "Not my story. And it wouldn't help you anyway.",
        'Let me tell you something else.',
      ],
    },
    {
      k: 'prose',
      paras: [
        "On my first day with the instrument, the conservatory teacher listened to me and said the double bass wasn't for me. That my hand was too small. That I didn't have the strength. That I was past «the right age».",
        "I was ten years older than my classmates and I was at university studying Sociology. Starting an instrument as an adult is like that: in the academic world you're always behind. But you do bring something extra.",
      ],
    },
    { k: 'anchor', text: 'I like to call it conscious practice.' },
    {
      k: 'prose',
      paras: [
        'You know?',
        "Like those people at the gym with their phone in one hand, chatting while they do the exercises. They're not really doing anything, they're wasting their time, training without paying attention. Same thing happens with the double bass.",
        'And this whole being aware and paying attention to the details thing worked for me. I actually turned into an obsessive spy: asking, digging around, studying.',
        "I found incredible teachers — the kind who don't lock you inside a book and make you grind through methods «until you get it right». Good teachers never do that. One of them was Félix Petit. By the way, I owe him every orchestra audition I've ever won.",
      ],
    },
    {
      k: 'prose',
      paras: [
        "Somewhere along the way I think I developed a superpower: I can spot the tiny detail that's holding someone back when they play.",
        "It's not talent. Nobody teaches you that in school. It's what happens when you watch a lot, in a lot of different ways, without getting locked into one school of technique.",
        "On that same road I found El Sistema, Venezuela's orchestra program, and that's when I understood why those first years had been so absurd. Because in El Sistema you're playing in an orchestra from day one. Even if it's on open strings, even if it's in one position. Your age doesn't matter. Where you come from doesn't matter. Their motto says it all: «Tocar y Luchar» — Play and Fight.",
        "To my sociologist brain it made instant sense: music isn't a club for the talented, you don't have to be a seven-year-old with a special gift, and above all, you don't have to be ready before you start playing.",
        'In those 10 years inside El Sistema I learned 3 things I want to pass on to you:',
      ],
    },
    {
      k: 'anchor',
      text: [
        'You learn by playing.',
        'Anyone can do this.',
        'Consistency without the right approach gets you nowhere.',
      ],
    },
    {
      k: 'prose',
      paras: [
        'How do I know?',
        'Because seven years after that first «no», I became the first woman bassist to play as a soloist and in the section of the Maracaibo Symphony, in my hometown. And I ended up teaching at the conservatory that turned me down in the first place. Life has a way of coming back around.',
        'For five years running I was invited on international tours with the Simón Bolívar Symphony Orchestra, under Gustavo Dudamel and conductors like Claudio Abbado.',
        "And I was teaching the whole time: the Latin American Double Bass Academy, the Simón Bolívar Conservatory, the National Experimental University of the Arts, plus ten years training children's and youth orchestras in El Sistema.",
        'Later, in Argentina, the Universidad Católica Argentina and the Orchestras for Equity Program.',
      ],
    },
    {
      k: 'prose',
      paras: [
        'And now?',
        "In 2025 I took another leap into the unknown — that's what it felt like in my body, anyway.",
        "I resigned from the permanent positions I'd won by audition in Argentina — assistant principal at the Avellaneda Municipal Symphony and bassist with the Buenos Aires City Symphonic Band — to travel, play, and see the world (a bit more of it).",
        "Still doing that today. I'm based in Madrid, with an online academy where I train bass players all over the world.",
        'If someone ever told you it was wrong without telling you how to fix it, I think you and I are going to get along. I write every week and tell you those details.',
        "At the academy I also open 1:1 lessons in seasons, courses, and a membership. But I don't open them to the general public — I share them with my community only. This is the way in.",
      ],
    },
    { k: 'form', id: 'suscribete', label: 'Double Bass in the City' },
    /* El gemelo inglés del bloque de testimonios. Ver la nota en `es`. */
  ],
};

export function getAboutCopy(lang: Lang): AboutCopy {
  return lang === 'en' ? en : es;
}
