import type { Lang } from '../i18n/ui';

/** Un tramo de texto dentro de un párrafo. `mono` lo pone en IBM Plex Mono. */
export type Run = { text: string; mono?: boolean };

export type Block =
  | { k: 'hero'; n: string; eyebrow: string; title: string; lead: string }
  /** La lámina: la foto de Emi a lo ancho, con su pie. Ver `Home.astro`. */
  | { k: 'plate'; caption: string; alt: string }
  | { k: 'runs'; n: string; runs: Run[] }
  | { k: 'h2'; n: string; text: string }
  | { k: 'prose'; n?: string; paras: string[] }
  | { k: 'anchor'; num?: string; text: string }
  | { k: 'form'; id: string }
  | { k: 'cards'; n: string; label: string }
  | { k: 'closing'; num: string; text: string; link: string };

export type HomeCopy = { blocks: Block[] };

const es: HomeCopy = {
  blocks: [
    {
      k: 'hero',
      n: '01',
      eyebrow: 'El newsletter',
      title: 'Contrabajo en la Ciudad',
      lead: 'Cada semana envío correos donde explico los errores que estancan tu progreso con el contrabajo. Son tan obvios que parecen tontos, pero son tan comunes que tal vez los estés cometiendo a diario — sin saberlo.',
    },
    { k: 'form', id: 'suscribete' },
    {
      k: 'plate',
      caption: 'Emilse Ríos — Madrid',
      alt: 'Emilse Ríos sonriendo en una calle de Madrid, con su contrabajo al hombro delante de un portal de madera',
    },
    {
      k: 'runs',
      n: '02',
      runs: [
        {
          text: 'Al suscribirte recibes un correo de bienvenida con un concepto que va a cambiar tu forma de producir el sonido. El video dura ',
        },
        { text: '4:04', mono: true },
        { text: '. En el minuto ' },
        { text: '3:36', mono: true },
        {
          text: ' te muestro un ejercicio que seguro conoces — no hay contrabajista que no lo haya practicado. Pero el 90% lo hace mal, JA. Casi nadie sabe de dónde viene realmente ese movimiento. Tú sí lo vas a saber.',
        },
      ],
    },
    { k: 'h2', n: '03', text: 'Quiero contarte por qué traje este newsletter al mundo' },
    {
      k: 'prose',
      paras: [
        'Hace muuuchos años, cuando estudiaba Sociología, presenté la prueba de admisión al conservatorio para estudiar contrabajo en paralelo. ¿Qué tan difícil podía ser? ¡JA!',
        'Lo difícil no fue coordinar los horarios. Lo difícil fueron los «no» que recibí. Sobre todo por mi edad — ya era adulta, no una niña de 4 años con talento innato.',
        'Mis compañeros de cátedra tenían diez años menos. Y mi profesor no mostraba mucho entusiasmo por explicarme, por decirlo de alguna forma. Sus comentarios eran: «eso no es así, tienes que estudiar más». Y ya. Sin decirme cómo resolverlo.',
        'Me tocó buscar por mi cuenta. Y con la ayuda de compañeros y colegas, poco a poco avancé.',
        'Hasta que encontré El Sistema de Orquestas de Venezuela — un mundo paralelo a la educación académica tradicional donde desde el día uno ya estás tocando en una orquesta.',
        'Sí, sí: la primera semana forman un ensamble que solo toca cuerdas al aire, y de ahí van aprendiendo todo, creciendo juntos. No importa tu edad. No importa tu contexto social. Su lema lo dice todo: «Tocar y Luchar».',
      ],
    },
    { k: 'anchor', text: 'Se aprende tocando.' },
    {
      k: 'prose',
      paras: [
        'Para mi cerebro de socióloga encajó perfecto: la música es un salvavidas para la humanidad, y todos merecen tener acceso a ella. Ahí no hay que estar listo para tocar: se aprende tocando.',
        'La musicalidad va primero. No hacen falta cinco años de libros y métodos técnicos antes de tu primera obra — todo eso se aprende mientras disfrutas de la música.',
        'Me convertí en profesional. Guardé el título de Socióloga y llevo más de veinte años tocando y formando contrabajistas en casi todos los continentes.',
      ],
    },
    { k: 'anchor', text: 'Todos pueden lograrlo. Solo necesitas constancia y el enfoque correcto.' },
    {
      k: 'prose',
      paras: [
        'Por eso existe Contrabajo en la Ciudad. Lo que El Sistema y todos esos años de orquesta me enseñaron no debería quedarse solo conmigo — sería egoísta de mi parte. Debería estar en tu bandeja de entrada cada semana.',
      ],
    },
    { k: 'form', id: 'suscribete-2' },
    { k: 'cards', n: '04', label: 'Correos anteriores' },
    {
      k: 'closing',
      num: '05',
      text: 'Atención: si ya tocas perfecto y no tienes absolutamente nada que mejorar con el instrumento, entonces ni te molestes. No te sirve de nada.',
      link: '[No hagas click acá]',
    },
  ],
};

const en: HomeCopy = {
  blocks: [
    {
      k: 'hero',
      n: '01',
      eyebrow: 'The newsletter',
      title: 'Double Bass in the City',
      lead: 'Every week I send emails explaining the mistakes that stall your progress on the double bass. They are so obvious they look silly, and so common that you may be making them daily — without knowing it.',
    },
    { k: 'form', id: 'suscribete' },
    {
      k: 'plate',
      caption: 'Emilse Ríos — Madrid',
      alt: 'Emilse Ríos smiling on a street in Madrid, her double bass on her shoulder in front of a wooden doorway',
    },
    {
      k: 'runs',
      n: '02',
      runs: [
        {
          text: 'When you subscribe you get a welcome email with one idea that will change the way you produce sound. The video is ',
        },
        { text: '4:04', mono: true },
        { text: ' long. At minute ' },
        { text: '3:36', mono: true },
        {
          text: " I show you an exercise you already know — there isn't a bassist alive who hasn't practised it. But 90% do it wrong, HA. Almost nobody knows where that movement really comes from. You will.",
        },
      ],
    },
    { k: 'h2', n: '03', text: 'Let me tell you why I brought this newsletter into the world' },
    {
      k: 'prose',
      paras: [
        'Maaany years ago, while I was studying Sociology, I sat the conservatory entrance exam to study double bass on the side. How hard could it be? HA!',
        "The hard part wasn't fitting the schedules together. The hard part were the «no»s I got. Mostly about my age — I was already an adult, not a four-year-old with innate talent.",
        "My classmates were ten years younger. And my teacher wasn't exactly enthusiastic about explaining things to me, let's put it that way. His feedback was: «that's not how you do it, you need to practise more». And that was that. Never how to fix it.",
        'So I had to look on my own. And with help from classmates and colleagues, little by little, I moved forward.',
        "Until I found El Sistema, Venezuela's orchestra programme — a world parallel to traditional academic training, where from day one you are already playing in an orchestra.",
        "Yes, really: in the first week they put together an ensemble that plays nothing but open strings, and from there everyone learns everything, growing together. Your age doesn't matter. Your background doesn't matter. Their motto says it all: «Play and Fight».",
      ],
    },
    { k: 'anchor', text: 'You learn by playing.' },
    {
      k: 'prose',
      paras: [
        "For my sociologist brain it fit perfectly: music is a lifeline for humanity, and everyone deserves access to it. There you don't have to be ready to play: you learn by playing.",
        "Musicality comes first. You don't need five years of books and technical methods before your first piece — all of that is learned while you enjoy the music.",
        'I became a professional. I filed away the Sociology degree and I have spent more than twenty years playing and training bassists on almost every continent.',
      ],
    },
    { k: 'anchor', text: 'Anyone can do it. All you need is consistency and the right focus.' },
    {
      k: 'prose',
      paras: [
        "That is why Contrabajo en la Ciudad exists. What El Sistema and all those orchestra years taught me shouldn't stay with me alone — that would be selfish of me. It should be in your inbox every week.",
      ],
    },
    { k: 'form', id: 'suscribete-2' },
    { k: 'cards', n: '04', label: 'Past emails' },
    {
      k: 'closing',
      num: '05',
      text: 'Warning: if you already play perfectly and have absolutely nothing to improve on the instrument, then don’t even bother. This is no use to you.',
      link: "[Don't click here]",
    },
  ],
};

export function getHomeCopy(lang: Lang): HomeCopy {
  return lang === 'en' ? en : es;
}
