import type { Lang } from '../i18n/ui';

export type Fact = { label: string; text: string };
export type Testimonial = { text: string; meta: string; pendiente?: boolean };

export type Block =
  | { k: 'ahero'; num: string; title: string; paras: string[] }
  | { k: 'prose'; n?: string; paras: string[] }
  | { k: 'anchor'; num?: string; text: string }
  | { k: 'facts'; n: string; items: Fact[] }
  | { k: 'video'; n: string; caption: string; dur: string; paras: string[] }
  | { k: 'form'; id: string }
  | { k: 'testi'; n: string; items: Testimonial[] };

export type AboutCopy = { title: string; blocks: Block[] };

const es: AboutCopy = {
  title: '¿Nos conocemos?',
  blocks: [
    {
      k: 'ahero',
      num: '01',
      title: '¿Nos conocemos?',
      paras: [
        '¡Hola! Emilse por acá (aunque casi todos me llaman Emi). La de la foto soy yo.',
        'En mi primer día con el instrumento, el profesor del conservatorio me vio y me dijo que el contrabajo no era para mí. Esta es la historia de por qué se equivocó. Y si a ti también te dijeron que no alguna vez — quizá te convenga leerla.',
      ],
    },
    {
      k: 'prose',
      n: '02',
      paras: [
        'La primera vez que vi una orquesta sinfónica fui con mi mamá, y esa noche ella me contó algo que yo no sabía:',
        'Mi abuela, madre soltera, limpiaba casas para sacar a sus hijos adelante. Una de esas casas era la del director de esa misma orquesta que estábamos viendo.',
        'De repente todo tuvo sentido. Las tardes en que mi abuela me cuidaba no me ponía televisión como en las demás casas: me hacía escuchar El lago de los cisnes o la Obertura 1812 y me decía que de grande yo iba a ser bailarina.',
        'Y ahí estaba yo, dos generaciones después, enamorándome del instrumento más imponente del escenario.',
      ],
    },
    { k: 'anchor', text: 'Amor a primera vista.' },
    {
      k: 'prose',
      n: '03',
      paras: [
        'En mi casa, ser alguien en la vida significaba una cosa: tener un título, preferiblemente médico, ingeniero o abogado. No me preguntes por qué, parece ser un tema de los latinos.',
        'Mi mamá es médica y me exigía un título de verdad, así que estudié Sociología. Te confieso que la elegí porque era lo único que daban solo por la mañana — y así me quedaban las tardes libres para escaparme a estudiar guitarra. Y más adelante, contrabajo.',
      ],
    },
    {
      k: 'prose',
      n: '04',
      paras: [
        'En el conservatorio, cambiar de guitarra a contrabajo fue una travesía de «no puedes».',
        'El primero, ese profesor del primer día: que mi mano era muy pequeña, que no tenía fuerza suficiente y que estaba «pasada de edad». Mi mamá fue a pelear con el conservatorio entero hasta que otro profesor aceptó darme clase. Las madres tienen ese superpoder, ¿cierto?',
        'Años más tarde — siete, para ser exacta — fui la primera mujer contrabajista en tocar como solista y en la fila de la Sinfónica de Maracaibo, mi ciudad natal. Y di clases en el conservatorio donde al inicio no me aceptaron.',
      ],
    },
    { k: 'anchor', text: 'Así son las vueltas de la vida. Eso hace la constancia.' },
    {
      k: 'prose',
      n: '05',
      paras: [
        'Exactamente un día después de recibir mi título de socióloga me fui de lleno al contrabajo: me mudé a Caracas, donde sí había más mujeres contrabajistas y un movimiento de orquestas mucho más grande.',
        'Ahí me formé con uno de los mejores profesores del mundo, Félix Petit, y entré a El Sistema — donde desde el día uno ya estás tocando en orquesta, sin importar tu edad ni tu contexto.',
      ],
    },
    { k: 'anchor', text: 'La música no es un club de talentosos. Es una herramienta de crecimiento.' },
    {
      k: 'prose',
      paras: [
        'Bajo esa mirada enseño hasta hoy.',
        'Tenía casi 30 años. Mis compañeros de cátedra, hasta diez menos. Solo vi una opción: poner toda mi energía en alcanzarlos. Sí, soy bastante competitiva. No te voy a mentir.',
        'Y lo hice.',
      ],
    },
    {
      k: 'facts',
      n: '06',
      items: [
        {
          label: '5 años',
          text: 'Giras internacionales consecutivas con la Orquesta Sinfónica Simón Bolívar, bajo la batuta de Gustavo Dudamel y de maestros como Claudio Abbado.',
        },
        {
          label: 'Docencia',
          text: 'Academia Latinoamericana de Contrabajo, Conservatorio Simón Bolívar y Universidad Nacional Experimental de las Artes.',
        },
        {
          label: '10+ años',
          text: 'Formando orquestas infantiles y juveniles de El Sistema.',
        },
        {
          label: 'Argentina',
          text: 'Programa de Orquestas para la Equidad y Universidad Católica Argentina.',
        },
        { label: '20+ años', text: 'Tocando y enseñando contrabajo.' },
      ],
    },
    {
      k: 'video',
      n: '07',
      caption: 'Viaje en el tiempo',
      dur: '2:41',
      paras: [
        'Te dejo acá al lado un viaje en el tiempo. Si prefieres seguir leyendo, sigue leyendo: no te pierdes nada que no te esté contando ya.',
      ],
    },
    {
      k: 'anchor',
      num: '08',
      text: 'No hace falta ser un gigante de manos enormes. Ni un niño prodigio de cuatro años. No hay requisito físico. No hay edad correcta. Solo necesitas constancia.',
    },
    {
      k: 'prose',
      n: '09',
      paras: [
        '¿Y ahora? En 2025 tomé una decisión grande: renuncié a los puestos estables que había ganado por audición en Argentina — asistente de solista en la Sinfónica Municipal de Avellaneda y contrabajista de la Banda Sinfónica de la Ciudad de Buenos Aires — para viajar, tocar y conocer el mundo.',
        '¿Arriesgado? Sí. ¿Valió la pena? Uff, súper sí.',
        'Hoy tengo base en Madrid y una academia online donde formo contrabajistas alrededor del mundo — nació casi sin planearlo, en la pandemia, cuando gracias al encierro descubrí que podía vivir sin conciertos, pero no sin enseñar.',
        'En la academia abro espacios de clases 1:1 por temporadas, tengo formaciones específicas para construir bases técnicas sólidas, y también una membresía. Pero no las abro al público en general. Las comparto solo con mi comunidad. Si quieres acceder, esta es la puerta de entrada:',
      ],
    },
    { k: 'form', id: 'suscribete' },
    {
      k: 'testi',
      n: '10',
      items: [
        { text: 'Testimonio pendiente — el texto llega después.', meta: 'Nombre · País', pendiente: true },
        { text: 'Testimonio pendiente — el texto llega después.', meta: 'Nombre · País', pendiente: true },
        { text: 'Testimonio pendiente — el texto llega después.', meta: 'Nombre · País', pendiente: true },
      ],
    },
  ],
};

const en: AboutCopy = {
  title: 'Have we met?',
  blocks: [
    {
      k: 'ahero',
      num: '01',
      title: 'Have we met?',
      paras: [
        "Hi! Emilse here (though almost everyone calls me Emi). That's me in the photo.",
        "On my first day with the instrument, the conservatory teacher looked at me and told me the double bass wasn't for me. This is the story of why he was wrong. And if someone once told you no too — you may want to read it.",
      ],
    },
    {
      k: 'prose',
      n: '02',
      paras: [
        "The first time I saw a symphony orchestra I went with my mum, and that night she told me something I didn't know:",
        'My grandmother, a single mother, cleaned houses to raise her children. One of those houses belonged to the conductor of the very orchestra we were watching.',
        "Suddenly everything made sense. On the afternoons my grandmother looked after me she didn't put the television on like in every other house: she made me listen to Swan Lake or the 1812 Overture and told me that when I grew up I would be a dancer.",
        'And there I was, two generations later, falling in love with the most imposing instrument on the stage.',
      ],
    },
    { k: 'anchor', text: 'Love at first sight.' },
    {
      k: 'prose',
      n: '03',
      paras: [
        'At home, being someone in life meant one thing: having a degree, preferably doctor, engineer or lawyer. Don’t ask me why, it seems to be a Latino thing.',
        "My mum is a doctor and demanded a real degree, so I studied Sociology. I'll confess I chose it because it was the only course taught in the mornings only — which left my afternoons free to sneak off and study guitar. And later, double bass.",
      ],
    },
    {
      k: 'prose',
      n: '04',
      paras: [
        'At the conservatory, switching from guitar to double bass was a long crossing of «you can’t».',
        "The first one, that teacher on the first day: my hand was too small, I didn't have enough strength and I was «past the age». My mum went and fought the entire conservatory until another teacher agreed to teach me. Mothers have that superpower, right?",
        'Years later — seven, to be exact — I became the first woman double bassist to play as a soloist and in the section of the Maracaibo Symphony, my home city. And I taught at the conservatory that first turned me down.',
      ],
    },
    { k: 'anchor', text: "That's how life turns. That's what consistency does." },
    {
      k: 'prose',
      n: '05',
      paras: [
        'Exactly one day after receiving my Sociology degree I went all in on the double bass: I moved to Caracas, where there were more women bassists and a far bigger orchestral movement.',
        'There I trained with one of the best teachers in the world, Félix Petit, and joined El Sistema — where from day one you are already playing in an orchestra, whatever your age or background.',
      ],
    },
    { k: 'anchor', text: 'Music is not a club for the talented. It is a tool for growth.' },
    {
      k: 'prose',
      paras: [
        'That is the view I still teach from today.',
        "I was almost 30. My classmates, up to ten years younger. I saw only one option: put all my energy into catching up with them. Yes, I'm quite competitive. I won't lie to you.",
        'And I did it.',
      ],
    },
    {
      k: 'facts',
      n: '06',
      items: [
        {
          label: '5 years',
          text: 'Consecutive international tours with the Simón Bolívar Symphony Orchestra, under Gustavo Dudamel and masters such as Claudio Abbado.',
        },
        {
          label: 'Teaching',
          text: 'Latin American Double Bass Academy, Simón Bolívar Conservatory and the National Experimental University of the Arts.',
        },
        {
          label: '10+ years',
          text: "Building children's and youth orchestras within El Sistema.",
        },
        {
          label: 'Argentina',
          text: 'Orchestras for Equity Programme and the Catholic University of Argentina.',
        },
        { label: '20+ years', text: 'Playing and teaching the double bass.' },
      ],
    },
    {
      k: 'video',
      n: '07',
      caption: 'Time travel',
      dur: '2:41',
      paras: [
        "I'm leaving a little time travel here beside you. If you'd rather keep reading, keep reading: you won't miss anything I'm not already telling you.",
      ],
    },
    {
      k: 'anchor',
      num: '08',
      text: 'You don’t need to be a giant with enormous hands. Or a four-year-old prodigy. There is no physical requirement. There is no right age. All you need is consistency.',
    },
    {
      k: 'prose',
      n: '09',
      paras: [
        'And now? In 2025 I made a big decision: I resigned from the permanent positions I had won by audition in Argentina — assistant principal at the Avellaneda Municipal Symphony and bassist of the Buenos Aires City Symphonic Band — to travel, play and see the world.',
        'Risky? Yes. Worth it? Oh, absolutely.',
        "Today I'm based in Madrid with an online academy where I train bassists around the world — it was born almost unplanned, during the pandemic, when lockdown showed me I could live without concerts, but not without teaching.",
        "In the academy I open 1:1 slots in seasons, I have specific trainings for building solid technical foundations, and a membership too. But I don't open them to the general public. I share them only with my community. If you want in, this is the door:",
      ],
    },
    { k: 'form', id: 'suscribete' },
    {
      k: 'testi',
      n: '10',
      items: [
        { text: 'Testimonial pending — copy to come.', meta: 'Name · Country', pendiente: true },
        { text: 'Testimonial pending — copy to come.', meta: 'Name · Country', pendiente: true },
        { text: 'Testimonial pending — copy to come.', meta: 'Name · Country', pendiente: true },
      ],
    },
  ],
};

export function getAboutCopy(lang: Lang): AboutCopy {
  return lang === 'en' ? en : es;
}
