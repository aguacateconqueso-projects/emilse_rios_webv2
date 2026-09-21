import type { Lang } from '../i18n/ui';

/** Un tramo de texto dentro de un párrafo. `mono` lo pone en IBM Plex Mono. */
export type Run = { text: string; mono?: boolean };

export type Block =
  | { k: 'hero'; eyebrow: string; title: string; lead: string }
  /** La lámina: la foto de Emi a lo ancho, con su pie. Ver `Home.astro`. */
  | { k: 'plate'; caption: string; alt: string }
  | { k: 'runs'; runs: Run[] }
  | { k: 'h2'; text: string }
  | { k: 'prose'; paras: string[] }
  | { k: 'anchor'; text: string }
  | { k: 'form'; id: string }
  /** La letra pequeña que cierra la página, debajo del último formulario. */
  | { k: 'fine'; text: string };

export type HomeCopy = { blocks: Block[] };

const es: HomeCopy = {
  blocks: [
    {
      k: 'hero',
      eyebrow: 'El newsletter',
      title: 'Contrabajo en la Ciudad',
      lead: 'Cada semana envío correos donde explico errores que estancan tu progreso con el contrabajo. Son tan obvios que parecen tontos, pero son tan comunes que tal vez los estés cometiendo a diario — sin saberlo.',
    },
    {
      k: 'runs',
      runs: [
        {
          text: 'Al suscribirte recibes un correo de bienvenida con un video. Se trata de un ejercicio donde te explico un concepto que va a cambiar tu forma de producir el sonido. El video dura ',
        },
        { text: '4:04', mono: true },
        {
          text: ' y el ejercicio seguro lo conoces — no hay contrabajista que no lo haya practicado. Pero el 90% lo hace mal, JA. Casi nadie sabe de dónde viene realmente ese movimiento, pero en ese 90% no vas a estar tú, tú no, no después de ver el video. Ya me contarás.',
        },
      ],
    },
    { k: 'form', id: 'suscribete' },
    {
      k: 'plate',
      caption: 'Emilse Ríos — Madrid',
      alt: 'Emilse Ríos sonriendo en una calle de Madrid, con su contrabajo al hombro delante de un portal de madera',
    },
    { k: 'h2', text: 'Quiero contarte por qué traje este newsletter al mundo' },
    {
      k: 'prose',
      paras: [
        'Si alguna vez sentiste que no tienes lo necesario para alcanzar el nivel que quieres con el contrabajo, esta historia tal vez te interese.',
        'Cuando presenté la prueba de admisión al conservatorio ya era adulta. Mis compañeros de cátedra tenían diez años menos, y lo único que escuchaba de mi profesor era «eso no es así, tienes que estudiar más». ¡Ja!',
        'Estuve años buscando por mi cuenta. Hasta que encontré El Sistema de Orquestas de Venezuela: desde el día uno ya estás tocando en una orquesta. No importa tu edad. No importa tu contexto. Ahí no hay que estar listo para tocar.',
      ],
    },
    { k: 'anchor', text: 'Se aprende tocando.' },
    {
      k: 'prose',
      paras: [
        'No hacen falta cinco años de libros y métodos técnicos antes de tu primera obra.',
      ],
    },
    {
      k: 'anchor',
      text: 'El aprendizaje más grande que me dejó ese camino: todos pueden lograrlo. Solo necesitas constancia y el enfoque correcto.',
    },
    {
      k: 'prose',
      paras: [
        'Llevo más de veinte años tocando y formando contrabajistas internacionalmente.',
        'Lo que aprendí en ese camino no debería quedarse solo conmigo — sería egoísta de mi parte. Tengo la rara habilidad de ver los detalles mínimos necesarios para solucionar problemas al tocar. Y eso te conviene.',
        'Es más, debería estar en tu bandeja de entrada cada semana. Incluyendo ese ejercicio que el 90% hace mal.',
      ],
    },
    { k: 'form', id: 'suscribete-2' },
    { k: 'fine', text: 'Suscribirse es gratis, darse de baja también.' },
  ],
};

const en: HomeCopy = {
  blocks: [
    {
      k: 'hero',
      eyebrow: 'The newsletter',
      title: 'Double Bass in the City',
      lead: "Every week I send out emails where I break down the mistakes that are stalling your progress on the double bass. They're so obvious they sound silly, but they're so common you might be making them every single day — without knowing it.",
    },
    {
      k: 'runs',
      runs: [
        {
          text: "When you sign up you get a welcome email with a video. It's an exercise where I explain one concept that's going to change the way you produce sound. The video runs ",
        },
        { text: '4:04', mono: true },
        {
          text: " and you almost certainly know the exercise — there isn't a bass player alive who hasn't practiced it. But 90% do it wrong, HA! Hardly anyone knows where that movement actually comes from. You won't be in that 90% though. Not you. Not after you watch the video. You'll have to let me know.",
        },
      ],
    },
    { k: 'form', id: 'suscribete' },
    {
      k: 'plate',
      caption: 'Emilse Ríos — Madrid',
      alt: 'Emilse Ríos smiling on a street in Madrid, her double bass on her shoulder in front of a wooden doorway',
    },
    { k: 'h2', text: 'Let me tell you why I brought this newsletter into the world' },
    {
      k: 'prose',
      paras: [
        "If you've ever felt like you don't have what it takes to get where you want to go on this instrument, this story might be worth your time.",
        'When I auditioned for the conservatory I was already an adult. Everyone else in my class was ten years younger, and the only thing I ever heard from my teacher was «that’s not how you do it, you need to practice more». Ha!',
        "I spent years figuring it out on my own. Until I found El Sistema, Venezuela's orchestra program: from day one you're already playing in an orchestra. Your age doesn't matter. Where you come from doesn't matter. Nobody there has to be ready before they start playing.",
      ],
    },
    { k: 'anchor', text: 'You learn by playing.' },
    {
      k: 'prose',
      paras: [
        "You don't need five years of books and technical methods before your first piece.",
      ],
    },
    {
      k: 'anchor',
      text: 'The biggest thing that road taught me: anyone can do this. All you need is consistency and the right approach.',
    },
    {
      k: 'prose',
      paras: [
        "I've spent more than twenty years playing and training bass players internationally.",
        "What I learned along the way shouldn't stay with me — that would be selfish. I have this rare knack for spotting the small details that fix a problem when you play. And that works in your favor.",
        'In fact, it should be in your inbox every week. Including that exercise 90% get wrong.',
      ],
    },
    { k: 'form', id: 'suscribete-2' },
    { k: 'fine', text: 'Signing up is free. So is unsubscribing.' },
  ],
};

export function getHomeCopy(lang: Lang): HomeCopy {
  return lang === 'en' ? en : es;
}
