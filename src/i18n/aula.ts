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
    'course.lessons': 'clases',
    'course.lesson': 'clase',
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

    /* --- La puerta: entrar, salir, poner la clave ------------------------- */
    'gate.checking': 'Comprobando tu acceso…',
    'gate.wait': 'Un momento.',
    'gate.needed': 'Esto es para quien ya entró',
    'gate.neededLead':
      'Inicia sesión con el correo con el que compraste. Si todavía no tienes nada, la tienda está acá al lado.',
    'gate.signin': 'Iniciar sesión',
    /* El candado de pago, desde el 22 sep 2026. El texto no acusa a nadie de
       no haber pagado: quien llega acá suele ser alguien que SÍ pagó y cuyo
       cobro se retrasó, o que acaba de pagar y el webhook no ha llegado. */
    'gate.noSub': 'Tu suscripción no está al día',
    'gate.noSubLead':
      'Entramos con tu cuenta, pero no encontramos una suscripción activa. Si acabas de pagar, dale un minuto y recarga — a veces tarda un poco en llegar. Y si crees que hay un error, escríbeme a info@emilserios.com y lo miramos.',
    'gate.seeMembership': 'Ver la membresía',
    'gate.otherAccount': 'Entrar con otra cuenta',
    'gate.adminOnly': 'Esta parte es solo de Emi',
    'gate.adminOnlyLead':
      'Has entrado, pero esta pantalla es el panel de control y no está a tu nombre. Tu sitio es el escritorio.',

    'signin.eyebrow': 'Acceso',
    'signin.title': 'Entra al aula',
    'signin.lead': 'Con el correo con el que compraste.',
    'signin.email': 'Tu correo',
    'signin.pass': 'Tu contraseña',
    'signin.remember': 'Mantener la sesión iniciada',
    'signin.rememberHelp':
      'En un equipo compartido, déjala sin marcar: la sesión se cierra al cerrar el navegador.',
    'signin.go': 'Entrar',
    'signin.first': '¿Primera vez, o se te olvidó la clave?',
    'signin.firstLead':
      'Te mandamos un correo con un enlace para ponerla. Sirve igual si tu cuenta se creó al pagar y nunca tuvo contraseña.',
    'signin.send': 'Mandarme el enlace',
    'signin.sent':
      'Si ese correo tiene cuenta, el enlace ya va en camino. Revisa también la carpeta de no deseados.',
    'signin.bad': 'Ese correo o esa contraseña no son correctos.',
    /* Para cuando el fallo NO es de credenciales. Decir «no son correctos» ahí
       es mandar a alguien a cambiar una contraseña que estaba bien — pasó el
       22 sep 2026 y costó una tarde. */
    'signin.broke':
      'No pudimos completar el acceso, y no es tu contraseña: es algo de nuestro lado. Vuelve a intentarlo en un momento, y si sigue igual escríbeme a info@emilserios.com.',
    'signin.noEmail': 'Escribe tu correo.',
    'signin.store': 'Todavía no he comprado nada',
    'signin.leaving': 'Cerrando tu sesión…',

    'pass.eyebrow': 'Tu contraseña',
    'pass.title': 'Pon tu contraseña',
    'pass.lead': 'La usarás para entrar al aula de ahora en adelante.',
    'pass.new': 'Contraseña nueva',
    'pass.repeat': 'Otra vez, para estar seguros',
    'pass.short': 'Que tenga ocho caracteres por lo menos.',
    'pass.mismatch': 'Las dos no coinciden.',
    'pass.save': 'Guardar y entrar',
    'pass.noLink':
      'Este enlace ya se usó o caducó. Pide uno nuevo desde la pantalla de acceso.',
    'pass.askAgain': 'Pedir otro enlace',

    /* --- El panel de Emi --------------------------------------------------- */
    'panel.title': 'Panel',
    'panel.seeAula': 'Ver el aula →',
    'panel.back': '← Volver al panel',
    'panel.who': 'Vista de Emi · Admin',
    'panel.soon': 'Lo que viene acá',

    /* --- Gracias, la pantalla de después de pagar -------------------------- */
    /* El copy del camino por correo es el definitivo de Emi, traído tal cual de
       la academia. El del camino de la contraseña se reescribió: allí pedía «no
       cierres esta pestaña» en rojo parpadeante porque el acceso dependía de un
       correo que podía tardar; acá la compradora entra en el mismo clic, así que
       esa alarma ya no dice la verdad. */
    'thanks.eyebrow': 'Bienvenida',
    'thanks.title': 'Gracias por unirte',
    'thanks.lead': 'Elige tu contraseña y entra directo al aula. Sin correo, sin esperas.',
    'thanks.pass': 'Tu contraseña',
    'thanks.repeat': 'Otra vez, para estar seguros',
    'thanks.go': 'Crear mi contraseña y entrar',
    'thanks.going': 'Entrando…',
    'thanks.toEmail': '¿Prefieres recibir el acceso por correo?',
    'thanks.emailTitle': 'Te mando el acceso por correo',
    'thanks.emailLead':
      'Escribe el correo con el que realizaste tu pago y te llegará el enlace de acceso a la plataforma. Esta pestaña se va, pero a tu correo puedes volver siempre — ahí quedará guardado.',
    'thanks.email': 'Tu correo',
    'thanks.send': 'Enviarme mi acceso',
    'thanks.sending': 'Enviando…',
    'thanks.sent': '¡Listo! Revisa tu bandeja, llega en un momento.',
    'thanks.spam':
      'Revisa bien tu bandeja, también spam y correos no deseados. Si no te llega, escríbeme y lo solucionamos.',
    'thanks.notPaid':
      'No pudimos confirmar tu pago desde este enlace. Pide el acceso por correo acá abajo y llega igual.',
    'thanks.signinFailed':
      'Tu contraseña quedó creada, pero no pudimos iniciar tu sesión sola. Entra con tu correo y esa contraseña.',
    'thanks.failed': 'No se pudo crear tu contraseña: ',
    'thanks.sendFailed': 'No se pudo enviar: ',

    /* --- El puente de traspaso --------------------------------------------- */
    'pass.bridgeTitle': 'Trayendo tu sesión',
    'pass.bridgeFailTitle': 'Hay que entrar a mano',
    'pass.bridgeLead': 'Un momento: te estamos pasando a la casa nueva.',
    'pass.bridgeFail':
      'No pudimos traer tu sesión. No se ha perdido nada — entra con tu correo y tu contraseña de siempre.',

    /* --- Sin backend ------------------------------------------------------- */
    'off.badge': 'Sin conectar',
    'off.lead':
      'El aula todavía no está enchufada a su base de datos, así que esta pantalla se puede mirar sin sesión. Lo que ves es de muestra.',
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
    'course.lessons': 'classes',
    'course.lesson': 'class',
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

    /* --- La puerta: entrar, salir, poner la clave ------------------------- */
    'gate.checking': 'Checking your access…',
    'gate.wait': 'One moment.',
    'gate.needed': 'This is for people who are already in',
    'gate.neededLead':
      'Sign in with the email you bought with. If you have nothing yet, the store is right next door.',
    'gate.signin': 'Sign in',
    'gate.noSub': "Your subscription isn't current",
    'gate.noSubLead':
      "We're in with your account, but we couldn't find an active subscription. If you've just paid, give it a minute and reload — it sometimes takes a moment to come through. And if you think this is a mistake, write to info@emilserios.com and we'll look into it.",
    'gate.seeMembership': 'See the membership',
    'gate.otherAccount': 'Sign in with another account',
    'gate.adminOnly': "This part is Emi's only",
    'gate.adminOnlyLead':
      "You're signed in, but this screen is the control panel and it isn't in your name. Your place is the desk.",

    'signin.eyebrow': 'Access',
    'signin.title': 'Come into the classroom',
    'signin.lead': 'With the email you bought with.',
    'signin.email': 'Your email',
    'signin.pass': 'Your password',
    'signin.remember': 'Keep me signed in',
    'signin.rememberHelp':
      'On a shared computer, leave it unticked: the session ends when you close the browser.',
    'signin.go': 'Sign in',
    'signin.first': 'First time, or forgot your password?',
    'signin.firstLead':
      "We'll email you a link to set it. It works the same if your account was created when you paid and never had a password.",
    'signin.send': 'Email me the link',
    'signin.sent':
      "If that address has an account, the link is on its way. Check your spam folder too.",
    'signin.bad': "That email or password isn't right.",
    'signin.broke':
      "We couldn't complete your sign-in, and it isn't your password — something on our side went wrong. Try again in a moment, and if it keeps happening write to info@emilserios.com.",
    'signin.noEmail': 'Type your email.',
    'signin.store': "I haven't bought anything yet",
    'signin.leaving': 'Signing you out…',

    'pass.eyebrow': 'Your password',
    'pass.title': 'Set your password',
    'pass.lead': "You'll use it to sign in from now on.",
    'pass.new': 'New password',
    'pass.repeat': 'Once more, to be sure',
    'pass.short': 'Make it at least eight characters.',
    'pass.mismatch': "The two don't match.",
    'pass.save': 'Save and sign in',
    'pass.noLink': 'This link has been used already, or it expired. Ask for a new one from the sign-in screen.',
    'pass.askAgain': 'Ask for another link',

    /* --- El panel de Emi --------------------------------------------------- */
    'panel.title': 'Panel',
    'panel.seeAula': 'See the classroom →',
    'panel.back': '← Back to panel',
    'panel.who': "Emi's view · Admin",
    'panel.soon': 'What goes here',

    /* --- Gracias, la pantalla de después de pagar -------------------------- */
    'thanks.eyebrow': 'Welcome',
    'thanks.title': 'Thank you for joining',
    'thanks.lead': 'Choose your password and go straight into the classroom. No email, no waiting.',
    'thanks.pass': 'Your password',
    'thanks.repeat': 'Once more, to be sure',
    'thanks.go': 'Create my password and go in',
    'thanks.going': 'Signing in…',
    'thanks.toEmail': 'Prefer to get your access by email instead?',
    'thanks.emailTitle': "I'll email you your access",
    'thanks.emailLead':
      'Type the email you used for your payment and the link to the platform will arrive there. This tab will go away, but you can always come back to your email — it will stay saved there.',
    'thanks.email': 'Your email',
    'thanks.send': 'Send me my access',
    'thanks.sending': 'Sending…',
    'thanks.sent': 'Done! Check your inbox — it should arrive in a moment.',
    'thanks.spam':
      "Check your inbox carefully — also spam and junk mail. If it doesn't arrive, write to me and we'll fix it.",
    'thanks.notPaid':
      "We couldn't confirm your payment from this link. Ask for your access by email below and it will get to you all the same.",
    'thanks.signinFailed':
      "Your password was set, but we couldn't sign you in automatically. Sign in with your email and that password.",
    'thanks.failed': "Couldn't create your password: ",
    'thanks.sendFailed': "Couldn't send it: ",

    /* --- El puente de traspaso --------------------------------------------- */
    'pass.bridgeTitle': 'Bringing your session over',
    'pass.bridgeFailTitle': "You'll have to sign in by hand",
    'pass.bridgeLead': "One moment — we're moving you into the new house.",
    'pass.bridgeFail':
      "We couldn't bring your session over. Nothing is lost — sign in with your usual email and password.",

    /* --- Sin backend ------------------------------------------------------- */
    'off.badge': 'Not connected',
    'off.lead':
      "The classroom isn't plugged into its database yet, so this screen can be viewed without signing in. What you see is sample content.",
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
const segmentoEscritorio: Record<Lang, string> = { es: 'escritorio', en: 'desk' };
const segmentoEntrar: Record<Lang, string> = { es: 'entrar', en: 'signin' };
const segmentoClave: Record<Lang, string> = { es: 'nueva-clave', en: 'new-password' };
const segmentoSalir: Record<Lang, string> = { es: 'salir', en: 'signout' };
const segmentoPasar: Record<Lang, string> = { es: 'pasar', en: 'handoff' };

/**
 * La página de agradecimiento, donde aterriza quien acaba de pagar.
 *
 * **No cuelga del aula**, al revés que todo lo de acá abajo, y es a propósito:
 * quien la ve todavía no es alumna —no tiene cuenta ni sesión— y venía de la
 * carta de ventas, que vive en la tienda. Colgarla de `/aulavirtual/` sería
 * meterla detrás de una puerta por la que aún no ha pasado.
 *
 * ⚠️ **Su dirección es la `success_url` de Stripe**, y la escribe
 * `/api/checkout` con el dominio delante. Cambiarla acá sin cambiar nada más
 * está bien —el checkout la lee de esta función— pero **las compras ya en
 * curso apuntan a la vieja**: Stripe guarda la URL en la sesión al crearla.
 */
export const graciasPath = (lang: Lang): string => (lang === 'en' ? '/en/thank-you/' : '/gracias/');

/**
 * El puente de traspaso: donde aterriza la sesión traída desde la academia.
 *
 * Existe por una razón concreta y conocida desde el 11 sep 2026: el token de
 * la sesión vive en `localStorage`, y `localStorage` es **por origen**.
 * `emilserios.com` no puede leer el de `emilseriosacademy.com`, así que al unir
 * las dos casas todo el mundo queda deslogueado una vez. No hay forma de
 * evitarlo. Lo que sí se puede es que volver a entrar cueste un clic y no una
 * contraseña olvidada, y eso es esta página.
 *
 * ⚠️ **Tiene que estar en las Redirect URLs de Supabase Auth**, con el dominio
 * delante, igual que la pantalla de la contraseña nueva.
 */
export const pasarPath = (lang: Lang): string => `${raiz[lang]}/${segmentoPasar[lang]}/`;

/** La puerta: la única página del aula que se ve sin haber pagado. */
export const puertaPath = (lang: Lang): string => `${raiz[lang]}/`;

/**
 * El escritorio: la primera pantalla después de iniciar sesión.
 *
 * ⚠️ **No se llama «panel», y es a propósito.** En la academia `/panel/` es la
 * consola de Emi, y Emi va a usar las dos cosas el mismo día. Que la pantalla
 * de la alumna se llamara igual que la de ella era una confusión esperando a
 * pasar, así que la palabra «panel» queda reservada para la consola y esta
 * pantalla se llama por lo que el menú ya decía que era: el escritorio.
 */
export const escritorioPath = (lang: Lang): string =>
  `${raiz[lang]}/${segmentoEscritorio[lang]}/`;

/** El reproductor de un curso. */
export const cursoPath = (slug: string, lang: Lang): string =>
  `${raiz[lang]}/${segmentoCurso[lang]}/${slug}/`;

/** La pantalla de acceso. Cuelga del aula, como todo lo de esta parte. */
export const entrarPath = (lang: Lang): string => `${raiz[lang]}/${segmentoEntrar[lang]}/`;

/**
 * Donde se pone la contraseña nueva.
 *
 * Es el destino del enlace que llega por correo, así que **su dirección tiene
 * que estar en las Redirect URLs de Supabase Auth**, con el dominio delante. Si
 * no está, el enlace del correo no lleva a ninguna parte.
 */
export const clavePath = (lang: Lang): string => `${raiz[lang]}/${segmentoClave[lang]}/`;

/** Salir. Cierra la sesión y devuelve a la puerta. */
export const salirPath = (lang: Lang): string => `${raiz[lang]}/${segmentoSalir[lang]}/`;

/**
 * La consola de Emi.
 *
 * **Solo en español y sin gemela inglesa**, a propósito: la usan dos personas y
 * las dos hablan español. El contenido que se escribe desde ella sí es
 * bilingüe; la herramienta no.
 */
export const panelPath = (): string => '/panel/';
