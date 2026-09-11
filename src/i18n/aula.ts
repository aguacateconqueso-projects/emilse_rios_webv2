import type { Lang } from './ui';

/**
 * Los textos de interfaz del aula y sus direcciones.
 *
 * Viven aparte de `src/i18n/ui.ts` a propósito: `ui.ts` es el sitio público
 * —la web que cualquiera lee sin haber pagado— y el aula es la aplicación que
 * hay detrás de la puerta. Son dos vocabularios distintos: afuera se habla de
 * comprar, adentro de estudiar. Mezclarlos en un fichero haría que cada cambio
 * en una frase del reproductor tocara el mismo fichero que la portada.
 *
 * **La regla del resto del repo sigue en pie:** ningún texto se escribe dentro
 * de un componente. Cambiar una palabra del aula es tocar este fichero.
 *
 * Se maqueta con el español, que es el texto más largo; el inglés entra en las
 * mismas cajas sin tocar nada.
 */
export const aulaUi = {
  es: {
    /* --- Marco de la aplicación ----------------------------------------- */
    'app.title': 'Aula Virtual',
    'app.desk': 'Mi escritorio',
    'app.membership': 'Membresía',
    'app.courses': 'Mis cursos',
    'app.account': 'Mi cuenta',
    'app.store': 'Tienda',
    'app.leave': 'Salir',
    'app.skip': 'Saltar al contenido',
    'app.menu': 'Menú del aula',
    'app.close': 'Cerrar',
    'app.backDesk': 'Volver al escritorio',
    'app.site': 'Ir al sitio público',

    /* --- Escritorio ------------------------------------------------------ */
    'desk.hello': 'Hola',
    'desk.lead': 'Esto es lo que tienes abierto ahora mismo.',
    'desk.resume': 'Sigue por donde ibas',
    'desk.resumeCta': 'Continuar',
    'desk.resumeNone': 'Todavía no has empezado ningún curso.',
    'desk.startCta': 'Empezar el primero',
    'desk.mine': 'Mis cursos',
    'desk.membershipTitle': 'Estudiemos Juntos',
    'desk.membershipLead':
      'El ejercicio de esta semana, el concepto del mes y el foro donde Emi responde.',
    'desk.membershipCta': 'Entrar a la membresía',
    'desk.membershipAway':
      'La membresía todavía vive en emilseriosacademy.com. Se muda a esta casa con el cambio de dominio, y no tienes que hacer nada.',
    'desk.storeTitle': '¿Quieres seguir aprendiendo?',
    'desk.storeLead': 'Mira los cursos que Emi tiene a la venta.',
    'desk.storeCta': 'Ver la tienda',

    /* --- Estado de un curso ---------------------------------------------- */
    'course.progress': 'de progreso',
    'course.lessons': 'lecciones',
    'course.lesson': 'lección',
    'course.done': 'Terminado',
    'course.notStarted': 'Sin empezar',
    'course.enter': 'Entrar al curso',
    'course.continue': 'Continuar',
    'course.locked': 'Todavía no lo tienes',
    'course.soon': 'Emi lo está preparando',
    'course.empty': 'Las clases de este curso todavía no están cargadas.',
    'course.emptyLead':
      'Emi está pasando los videos a su nuevo hogar. Cuando terminen de subirse, aparecen acá solas.',

    /* --- Reproductor ------------------------------------------------------ */
    'player.module': 'Módulo',
    'player.contents': 'Contenido del curso',
    'player.about': 'Sobre esta clase',
    'player.resources': 'Material de la clase',
    'player.markDone': 'Marcar como vista',
    'player.markUndone': 'Vista',
    'player.next': 'Siguiente clase',
    'player.prev': 'Clase anterior',
    'player.resumed': 'Retomamos donde lo dejaste',
    'player.restart': 'Empezar de cero',
    'player.noVideo': 'El video de esta clase todavía no está subido',
    'player.noVideoLead':
      'Este es el marco donde irá. Puedes arrastrar la barra para probar cómo se guarda tu avance.',
    'player.demoBar': 'Barra de prueba — simula el minuto en el que vas',
    'player.saved': 'Tu avance se guarda solo',

    /* --- Preguntas -------------------------------------------------------- */
    'ask.open': 'Tengo una duda',
    'ask.title': 'Pregúntale a Emi',
    'ask.lead':
      'Tu pregunta llega con el curso, la clase y el minuto en el que estás. Emi te responde por acá y te avisa por correo.',
    'ask.at': 'En el minuto',
    'ask.atOff': 'No mandar el minuto',
    'ask.label': '¿Qué se te trabó?',
    'ask.placeholder': 'Cuéntame con tus palabras qué no te sale…',
    'ask.send': 'Enviar la pregunta',
    'ask.cancel': 'Cancelar',
    'ask.empty': 'Escribe tu pregunta antes de enviarla.',
    'ask.sent': 'Listo. Emi la tiene.',
    'ask.thread': 'Mis preguntas de este curso',
    'ask.threadEmpty': 'Todavía no has preguntado nada en este curso.',
    'ask.waiting': 'Esperando a Emi',
    'ask.answered': 'Respondida',
    'ask.deleteOne': 'Borrar',
    'ask.local':
      'Maqueta: por ahora tus preguntas se guardan en este navegador. Cuando el aula esté enchufada, salen hacia Emi.',

    /* --- Avisos de la maqueta --------------------------------------------- */
    'demo.badge': 'Maqueta',
    'demo.lead':
      'Esto es el aula en construcción, con contenido de muestra. Tu avance y tus preguntas se guardan en este navegador para que puedas probarla; nada sale de tu equipo todavía.',
    'demo.reset': 'Borrar mi avance de prueba',
    'demo.resetAsk': '¿Borramos el avance y las preguntas de prueba de este navegador?',
  },
  en: {
    /* --- Marco de la aplicación ----------------------------------------- */
    'app.title': 'Virtual Classroom',
    'app.desk': 'My desk',
    'app.membership': 'Membership',
    'app.courses': 'My courses',
    'app.account': 'My account',
    'app.store': 'Store',
    'app.leave': 'Sign out',
    'app.skip': 'Skip to content',
    'app.menu': 'Classroom menu',
    'app.close': 'Close',
    'app.backDesk': 'Back to my desk',
    'app.site': 'Go to the public site',

    /* --- Escritorio ------------------------------------------------------ */
    'desk.hello': 'Hello',
    'desk.lead': "Here's what you have open right now.",
    'desk.resume': 'Pick up where you left off',
    'desk.resumeCta': 'Continue',
    'desk.resumeNone': "You haven't started a course yet.",
    'desk.startCta': 'Start the first one',
    'desk.mine': 'My courses',
    'desk.membershipTitle': "Let's study together",
    'desk.membershipLead':
      "This week's exercise, the month's concept and the forum where Emi answers.",
    'desk.membershipCta': 'Enter the membership',
    'desk.membershipAway':
      'The membership still lives at emilseriosacademy.com. It moves into this house with the domain change, and you have nothing to do.',
    'desk.storeTitle': 'Want to keep learning?',
    'desk.storeLead': "See the courses Emi has on sale.",
    'desk.storeCta': 'See the store',

    /* --- Estado de un curso ---------------------------------------------- */
    'course.progress': 'complete',
    'course.lessons': 'lessons',
    'course.lesson': 'lesson',
    'course.done': 'Finished',
    'course.notStarted': 'Not started',
    'course.enter': 'Enter the course',
    'course.continue': 'Continue',
    'course.locked': "You don't have this one yet",
    'course.soon': 'Emi is preparing it',
    'course.empty': "This course's classes aren't loaded yet.",
    'course.emptyLead':
      'Emi is moving the videos to their new home. Once they finish uploading, they show up here on their own.',

    /* --- Reproductor ------------------------------------------------------ */
    'player.module': 'Module',
    'player.contents': 'Course contents',
    'player.about': 'About this class',
    'player.resources': 'Class material',
    'player.markDone': 'Mark as watched',
    'player.markUndone': 'Watched',
    'player.next': 'Next class',
    'player.prev': 'Previous class',
    'player.resumed': 'We picked up where you left off',
    'player.restart': 'Start from the beginning',
    'player.noVideo': "This class's video isn't uploaded yet",
    'player.noVideoLead':
      'This is the frame it will live in. Drag the bar to try out how your progress is saved.',
    'player.demoBar': 'Test bar — stands in for the minute you are on',
    'player.saved': 'Your progress saves itself',

    /* --- Preguntas -------------------------------------------------------- */
    'ask.open': 'I have a question',
    'ask.title': 'Ask Emi',
    'ask.lead':
      "Your question arrives with the course, the class and the minute you're on. Emi answers here and emails you.",
    'ask.at': 'At minute',
    'ask.atOff': "Don't send the minute",
    'ask.label': 'What got you stuck?',
    'ask.placeholder': "Tell me in your own words what isn't working…",
    'ask.send': 'Send the question',
    'ask.cancel': 'Cancel',
    'ask.empty': 'Write your question before sending it.',
    'ask.sent': 'Done. Emi has it.',
    'ask.thread': 'My questions on this course',
    'ask.threadEmpty': "You haven't asked anything on this course yet.",
    'ask.waiting': 'Waiting on Emi',
    'ask.answered': 'Answered',
    'ask.deleteOne': 'Delete',
    'ask.local':
      "Mock-up: for now your questions are stored in this browser. Once the classroom is wired up, they go out to Emi.",

    /* --- Avisos de la maqueta --------------------------------------------- */
    'demo.badge': 'Mock-up',
    'demo.lead':
      'This is the classroom under construction, with sample content. Your progress and questions are saved in this browser so you can try it out; nothing leaves your machine yet.',
    'demo.reset': 'Clear my test progress',
    'demo.resetAsk': 'Clear the test progress and questions from this browser?',
  },
} as const;

export type AulaKey = keyof (typeof aulaUi)['es'];

/** Devuelve un traductor del aula atado al idioma dado. */
export function useAula(lang: Lang) {
  return function a(key: AulaKey): string {
    return aulaUi[lang][key] ?? aulaUi.es[key];
  };
}

/**
 * Las páginas del aula y su dirección en cada idioma.
 *
 * Cuelgan de la puerta que ya existe —`/aulavirtual/` y `/en/classroom/`—, que
 * es lo único de esta parte que se ve sin sesión. Como en el resto del sitio,
 * **el slug de la sección se traduce y el del curso no**: el slug es la
 * identidad del curso, la misma que tendrá su fila en la base de datos.
 */
const raiz: Record<Lang, string> = { es: '/aulavirtual', en: '/en/classroom' };
const segmentoCurso: Record<Lang, string> = { es: 'curso', en: 'course' };

/** La puerta: la única página del aula que se ve sin haber pagado. */
export const puertaPath = (lang: Lang): string => `${raiz[lang]}/`;

/** El escritorio: la primera pantalla después de iniciar sesión. */
export const panelPath = (lang: Lang): string => `${raiz[lang]}/panel/`;

/** El reproductor de un curso. */
export const cursoPath = (slug: string, lang: Lang): string =>
  `${raiz[lang]}/${segmentoCurso[lang]}/${slug}/`;
