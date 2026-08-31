import type { ImageMetadata } from 'astro';
import type { Lang } from '../i18n/ui';
import membresiaFoto from '../assets/img/emilse-membresia.jpg';

/**
 * El catálogo del Aula Virtual y las cartas de venta de sus productos.
 *
 * Esto es **la fachada**: lo que se ve antes de pagar y antes de entrar. No hay
 * base de datos detrás todavía, ni derechos de acceso, ni webhook. El día que
 * los haya, este fichero es lo que se sustituye por una consulta — por eso la
 * forma de `Product` ya se parece a la fila que tendrá `products`.
 *
 * **Regla que manda sobre todas:** nada que no funcione se publica enlazado.
 * Un producto en `proximamente` no tiene página y su ficha no es un enlace. Se
 * dice que está por llegar en vez de fingir que existe.
 *
 * **Los textos no viven en los componentes.** Cambiar una frase de la carta es
 * tocar este fichero, nunca maquetación.
 */

/** Un producto a la venta tiene página y botón; uno por llegar, ninguna de las dos. */
export type Estado = 'venta' | 'proximamente';

/** Manda cómo se cobra y cómo caduca el derecho de acceso, no cómo se pinta. */
export type Tipo = 'membresia' | 'curso';

/** Un párrafo de la carta. Algunos van en negrita enteros, como en el original. */
export type Para = string | { fuerte: true; texto: string };

/** Una pregunta del bloque final. La última lleva una dirección de correo. */
export type Pregunta = { q: string; a: string; correo?: string };

/** Una columna del bloque «es para ti / no es para ti». */
export type Columna = { titulo: string; items: string[] };

/**
 * Los bloques con los que se arma una carta de venta.
 *
 * Son los que hacían falta para traer entera la carta de la membresía, que es
 * el modelo. Un curso nuevo se escribe combinándolos en otro orden; si alguna
 * carta pide una forma que no está acá, se añade un tipo, no se mete
 * maquetación dentro del texto.
 */
export type Bloque =
  /** La apertura grande, en dos líneas y en cursiva. */
  | { k: 'lede'; a: string; b: string }
  | { k: 'prose'; n?: string; paras: Para[] }
  | { k: 'anchor'; text: string }
  /** Los descubrimientos numerados: una etiqueta y su párrafo. */
  | { k: 'hitos'; n: string; lead: string; items: { t: string; p: string }[] }
  /** Para quién es y para quién no, a dos columnas. */
  | { k: 'contraste'; n: string; si: Columna; no: Columna }
  | { k: 'lista'; n: string; titulo: string; items: string[] }
  | { k: 'faq'; n: string; titulo: string; items: Pregunta[] }
  /** La posdata firmada. */
  | { k: 'pd'; label: string; texto: string; firma: string }
  /**
   * El bloque de compra, puesto donde la carta lo pida. `precio` es la ficha
   * entera —importe, lo que incluye y la letra pequeña—; `simple` es solo el
   * botón, para los sitios donde la carta ya lo ha contado todo.
   */
  | { k: 'cta'; variante: 'simple' | 'precio' };

export type Pagina = {
  /** Titular de la carta. */
  titulo: string;
  /** La línea que va debajo del titular. */
  subtitulo: string;
  bloques: Bloque[];
};

/** Lo que necesita el bloque de compra, en el idioma que toque. */
export type Compra = {
  /** El texto del botón. En la membresía es «Acá te unes», no «Comprar». */
  etiqueta: string;
  /** Lo que incluye, en la ficha de precio. */
  incluye: string[];
  /** La línea corta bajo el botón. */
  nota: string;
  /** El párrafo largo de la letra pequeña, debajo de la ficha. */
  pie: string;
};

export type Copia = {
  nombre: string;
  /** Una línea en la ficha del catálogo. 100–140 caracteres. */
  resumen: string;
  /** Lo que se lee bajo el precio: «al mes» o «pago único». */
  cadencia: string;
  precio: string;
  /** Texto del marco cuando todavía no hay foto. */
  fotoPie: string;
  fotoAlt?: string;
  compra?: Compra;
  pagina?: Pagina;
};

export type Product = {
  slug: string;
  tipo: Tipo;
  estado: Estado;
  /** El número que va al margen de la ficha. Se escribe, no se calcula. */
  num: string;
  /** La foto del producto. Sin ella, la ficha dibuja un marco con su etiqueta. */
  foto?: ImageMetadata;
  /**
   * A dónde lleva el botón de compra. Hoy sale del sitio: la membresía sigue
   * cobrando en `emilseriosacademy.com` y ahí se queda hasta el cambio de
   * dominio. Cuando el pago viva acá, esto pasa a ser una ruta interna y nada
   * más cambia.
   */
  comprarHref?: Record<Lang, string>;
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
 * promesa, precio, foto y carta—. Hasta que llegue, cada uno ocupa su sitio en
 * el catálogo como lo que es: un hueco anunciado, con su marco de foto vacío.
 * **Los nombres de abajo son marcadores**, no títulos.
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
      fotoPie: 'La foto de este curso todavía no ha llegado',
    },
    en: {
      nombre: `Course ${n}`,
      resumen: 'Recorded, waiting on its sales letter. Emi announces the date through the newsletter.',
      cadencia: '',
      precio: '',
      fotoPie: "This course's photo hasn't arrived yet",
    },
  },
});

/**
 * La membresía, con su carta de ventas entera.
 *
 * El texto es **el de `emilseriosacademy.com`, tal cual**: es la carta que Emi
 * escribió, la que lleva un año vendiendo, y no se reescribe. Lo que cambia es
 * la ropa — se pinta con el sistema de diseño de este sitio, en blanco y negro,
 * no con la capa cálida de la academia — porque si el aula parece un sitio
 * distinto al público, la alumna nota la costura.
 *
 * Lo que se dejó fuera del original, y por qué:
 *
 * - **El precio de fundador.** Su ventana cerró el 23 de julio de 2026 y en la
 *   academia el copy quedó inerte. Acá entra solo el precio estándar; si Emi
 *   vuelve a abrir una ventana, es un bloque nuevo, no un `if` escondido.
 * - **El alta al newsletter del final.** En este sitio el newsletter tiene su
 *   propio sitio y su propio formulario; repetirlo dentro de la carta era
 *   mandar a la lectora a otro lado justo cuando está por comprar.
 */
const membresia: Product = {
  slug: 'estudiemos-juntos',
  tipo: 'membresia',
  estado: 'venta',
  num: '01',
  foto: membresiaFoto,
  comprarHref: {
    es: `${ACADEMIA}/api/checkout?lang=es`,
    en: `${ACADEMIA}/api/checkout?lang=en`,
  },
  copia: {
    es: {
      nombre: 'Estudiemos Juntos',
      resumen:
        'La membresía. Un ejercicio nuevo cada jueves, el concepto que lo sostiene, y Emi respondiendo en el foro.',
      cadencia: 'al mes',
      precio: '€65',
      fotoPie: 'Retrato de Emi con el contrabajo',
      fotoAlt: 'Emilse Ríos',
      compra: {
        etiqueta: 'Acá te unes',
        incluye: [
          'Cada jueves un ejercicio nuevo en la plataforma basado en un concepto base.',
          'Cada mes te explico un tema, un concepto base técnico, para que entiendas de dónde vienen los movimientos, la coordinación, el sonido, solo un concepto. Simple.',
          'El acceso a la plataforma lo tienes 24/7 estés donde estés.',
          'Foro de preguntas, las respondo personalmente, y puedes ver preguntas de otros miembros, del grupo también se aprende.',
        ],
        nota: 'Cancela cuando quieras, sin explicar nada.',
        pie: 'Pagas cada mes en la fecha que entraste. Por ejemplo, si entras un 20, tu mes va del 20 al 20. Nunca pierdes días. Te puedes dar de baja cuando quieras, sin explicaciones. Eso sí: si te vas y luego quieres volver, entras con el precio que esté vigente en ese momento.',
      },
      pagina: {
        titulo: 'Estudiemos juntos',
        subtitulo: 'La membresía',
        bloques: [
          {
            k: 'lede',
            a: 'El problema no es que te falte tiempo para estudiar.',
            b: 'Es que no sabes qué hacer con los 30 minutos que sí tienes.',
          },
          {
            k: 'prose',
            paras: [
              'Esta es la primera membresía para contrabajistas. Y nos enfocamos en el arco alemán. Cada mes un concepto para mantenerte activo con la técnica: coordinación, vibrato, golpes de arco —legato, spiccato, staccato—. Cada semana un ejercicio específico. Si quieres perfeccionar tu técnica y tener acompañamiento mientras lo haces, nos vemos dentro.',
            ],
          },
          { k: 'cta', variante: 'simple' },
          {
            k: 'prose',
            n: '01',
            paras: [
              'En 2012 mi único trabajo era tocar lo mejor posible las sinfonías del compositor que más amo en la vida. Pero no siempre fue así, y en esta historia te cuento algo que te va a ayudar a gestionar mejor tu tiempo de estudio, si sientes que no tienes tiempo, tal vez te interese.',
              'Ese año tocamos todas las sinfonías de Mahler. En el Walt Disney Concert Hall, con la orquesta sinfónica Simón Bolívar y la Filarmónica de Los Ángeles juntas en el escenario, dirigidas por Gustavo Dudamel.',
              'Un mes completo en California. Hotel cinco estrellas con un trato especial, tan especial, que uno de los regalos que nos dieron fue llevar a toda la orquesta a Disney, el día libre más divertido de ese tour sin duda, sentí que todos volvimos a tener 10 años. Durante unos cuatro años más, mi vida fue más o menos así.',
              { fuerte: true, texto: 'Y en 2016 emigré. Tuve que dejar mi país.' },
              'Llegué a Argentina. Y mientras esperaba el trámite para tener documentos, no podía audicionar, ni tocar ni dar clases en ningún lado. Me tocó trabajar doce horas al día en una heladería.',
              'Vivía en un departamento compartido con amigos, así que el único momento que tenía para estudiar era antes de las siete de la mañana. Y el único lugar donde no molestaba a nadie era la azotea del edificio.',
              'Ahí estaba yo ahora subiendo un contrabajo por las escaleras de una azotea en Buenos Aires. Algunos días lo lograba. Media hora, una hora si me levantaba más temprano. Otros días el cansancio me ganaba.',
            ],
          },
          {
            k: 'hitos',
            n: '02',
            lead: 'Descubrí 3 cosas:',
            items: [
              {
                t: 'La primera',
                p: 'las excusas, complicaciones, falta de tiempo, están, así es la vida y no podemos hacer nada al respecto. Lo que sí podemos es entrenar nuestra disciplina y ser constantes. Una excelente manera de comenzar es con 30 min, tal vez algunos días podría ser más.',
              },
              {
                t: 'La segunda',
                p: 'Las metas son importantes. Sin metas, te paras frente al atril, afinas, ¿y? ¿Qué vas a tocar? Lo mismo de siempre, terminas sintiendo que no avanzas.',
              },
              {
                t: 'La tercera',
                p: 'Si bien hay muchos ejercicios dando vueltas en internet, te toma más tiempo encontrarlos y organizarlos que estudiarlos, como lo veo, YouTube muchas veces más que aportar se convierte en un ladrón del tiempo de estudio.',
              },
            ],
          },
          {
            k: 'prose',
            n: '03',
            paras: [
              {
                fuerte: true,
                texto:
                  'Tener una meta nos hace movernos, nos hace abrir espacio en la agenda, nos entrena la constancia. Es mi consejo para ti, anótala, puede ser una obra que siempre quisiste tocar, o conocer la región aguda del instrumento. Lo que sea, anótala. Ármate un plan para llegar a ella.',
              },
              {
                fuerte: true,
                texto:
                  'Esta es una membresía para hacer lo justo, para sostener tu constancia semana a semana, para mejorar sin acumular ejercicios que nunca vas a ver ni a practicar (ya para eso está YouTube).',
              },
              'Cada jueves, cuando entra el ejercicio nuevo, el anterior desaparece. Sí, leíste bien. Yo borro el contenido anterior.',
              '¿Por qué haría eso?',
              'Porque las bibliotecas abruman. Tener cincuenta ejercicios archivados «para después» termina en no hacer ninguno. Y no solo eso, sino con la culpa de que no estás haciendo nada.',
            ],
          },
          { k: 'anchor', text: '¿Necesitas ayuda? ¿Una guía clara? Para eso existe Estudiemos Juntos.' },
          {
            k: 'contraste',
            n: '04',
            si: {
              titulo: 'Esta membresía es para ti si…',
              items: [
                'Tienes poco tiempo para estudiar a la semana pero quieres una guía clara de cómo seguir avanzando con el contrabajo.',
                'Eres de los que estudia por su cuenta, sin profesor, y muchas veces no sabe «por dónde comenzar».',
                'Tienes años estancado en el mismo repertorio, el mismo libro o método de ejercicios.',
                'Te cuesta ser constante con el estudio del contrabajo.',
                'Has alcanzado un nivel que te permite tocar en orquestas y ensambles pero tienes muchos vacíos técnicos que te detienen en golpes de arco básicos: spiccato, staccato, legato.',
                'Sientes que tu técnica te limita en avanzar en la interpretación (mejor vibrato, conexión entre las notas, etc.).',
                'Estás en el mundo del jazz y quieres aprender y dominar el arco.',
              ],
            },
            no: {
              titulo: 'No es para ti si…',
              items: [
                'Buscas una biblioteca infinita de ejercicios para guardar y ver «algún día». Acá no hay biblioteca, no hay archivo, no hay «lo veo después». Hay un ejercicio esta semana. Si no lo haces, se va y viene otro, sin culpas, simple.',
                'Estás buscando ayuda para lograr una meta específica: entrar a un conservatorio o una orquesta. Para eso necesitarías clases particulares. Esta membresía está pensada para mantenerte en forma y activo técnicamente. No veremos cómo resolver problemas de repertorio específico, aunque estos ejercicios sí te ayudan a crear bases para resolver esos problemas después.',
                'Y si no estás dispuesto a abrir espacio en tu vida para estudiar, aunque sea un par de días a la semana, entonces no te molestes en entrar. Esta membresía no es para ti.',
                'Los ejercicios estarán adaptados para varios niveles, pero todo se comienza lento, para incorporar y entender. Si no tienes paciencia para estudiar lento, no te va a funcionar.',
              ],
            },
          },
          {
            k: 'prose',
            n: '05',
            paras: [
              'Los cursos se terminan. Los libros de métodos también. Esta membresía no: cada semana entra un ejercicio nuevo que te mantiene activo con la técnica. Y sí, hay acompañamiento. Haces tu pregunta en el chat y la contesto yo personalmente.',
            ],
          },
          { k: 'cta', variante: 'precio' },
          {
            k: 'prose',
            paras: [
              'Mucho para muchos.',
              'Un regalo para el que quiera aprender esos conceptos técnicos que te ayudan a mejorar exponencialmente tu nivel de contrabajo, y poder disfrutar del sonido de tu instrumento. Así de simple. ¡Estudiemos juntos!',
            ],
          },
          { k: 'cta', variante: 'simple' },
          {
            k: 'pd',
            label: 'P.D.',
            texto:
              'Esta membresía la hice para la Emilse del 2016, la que subía el contrabajo por las escaleras de esa azotea con todas las ganas de no abandonar el instrumento, pero que con el paso del tiempo fue quedándose sin saber qué estudiar. Se la debía. Si alguna vez has sentido que no sabes por dónde comenzar o qué estudiar, entonces también es para ti.',
            firma: '— Emilse',
          },
          {
            k: 'faq',
            n: '06',
            titulo: 'Preguntas frecuentes',
            items: [
              {
                q: '¿Puedo pagar en mi moneda?',
                a: 'El pago se procesa con Stripe. Al suscribirte, detecta automáticamente la moneda de tu tarjeta y pagas en ella. Hoy son €65 al mes, unos $75 USD. El precio con el que entras se congela para ti mientras seas miembro.',
              },
              {
                q: '¿Debo tener un nivel avanzado para entrar?',
                a: 'No, pero sí debes tener conocimiento de por lo menos las primeras posiciones del instrumento. Yo dejaré el ejercicio para adaptarlo a un nivel inicial, intermedio o avanzado. Son conceptos básicos que todos debemos estudiar a lo largo de nuestra carrera, sin importar el nivel, y entre más rápido comiences mejor.',
              },
              {
                q: '¿Si toco arco francés, esta membresía me sirve?',
                a: 'Esta membresía está diseñada específicamente para arco alemán. Algunos conceptos de mano izquierda te servirán igual, pero los golpes de arco los enseño solo con técnica alemana. ¿Por qué? Porque considero que es más fácil, más rápida y más natural para el cuerpo. Es la que recomiendo.',
              },
              {
                q: '¿Qué pasa si entro a mitad del mes, puedo ver el contenido anterior?',
                a: 'Podrás tener acceso al ejercicio que esté esa semana hasta que lo reemplace, cada jueves entra un nuevo ejercicio que reemplaza el anterior. Pero el concepto básico sí queda durante todo el mes, es un video que te hace entender las bases de cada ejercicio.',
              },
              {
                q: '¿Cómo funciona el pago?',
                a: 'Es una suscripción mensual, así como tus otras suscripciones (Netflix, Disney, etc.), es un pago automático mensual. En este caso pagas el día que entras y ese será tu día de cobro cada mes. El precio con el que entras se congela para ti mientras seas miembro.',
              },
              {
                q: '¿Puedo cancelar cuando quiera?',
                a: 'Sí, desde tu cuenta, sin explicar nada. Mantienes el acceso hasta el final del período que ya pagaste. Si luego quieres volver, entras con el precio vigente en ese momento, no con el tuyo anterior.',
              },
              {
                q: '¿Cómo hago mis preguntas?',
                a: 'En el chat del aula. Yo las respondo, todos pueden leer las preguntas y respuestas de los demás — ahí también se aprende.',
              },
              {
                q: '¿En qué idioma es?',
                a: 'Esta versión está en inglés y español, puedes registrarte en el idioma de tu preferencia.',
              },
              {
                q: '¿Cuánto tiempo necesito?',
                a: 'Media hora al día, los días que puedas, con eso es suficiente. Así de simple.',
              },
              {
                q: '¿En qué horarios puedo ingresar a la plataforma?',
                a: 'Está disponible para ti 24/7.',
              },
              {
                q: 'Tengo una pregunta que no aparece acá:',
                a: 'Escríbeme y te la contesto personalmente:',
                correo: 'info@emilserios.com',
              },
            ],
          },
          { k: 'cta', variante: 'simple' },
        ],
      },
    },
    en: {
      nombre: 'Estudiemos Juntos',
      resumen:
        'The membership. A new exercise every Thursday, the concept that holds it up, and Emi answering in the forum.',
      cadencia: 'a month',
      precio: '€65',
      fotoPie: 'Portrait of Emi with the double bass',
      fotoAlt: 'Emilse Ríos',
      compra: {
        etiqueta: 'Join here',
        incluye: [
          'A new exercise every Thursday on the platform, based on a core concept.',
          'Every month I explain one topic — a core technical concept — so you understand where the movements, coordination, and sound come from. Just one concept. Simple.',
          'Platform access, 24/7, wherever you are.',
          'A questions forum — I answer personally, and you can see other members’ questions too; you learn from the group as well.',
        ],
        nota: 'Cancel anytime, no questions asked.',
        pie: 'You pay each month on the date you joined. For example, if you join on the 20th, your month runs from the 20th to the 20th. You never lose days. You can cancel whenever you want, no explanations needed. One thing though: if you leave and later want to come back, you join at whatever price is in force at that moment.',
      },
      pagina: {
        titulo: 'Let’s study together',
        subtitulo: 'The membership',
        bloques: [
          {
            k: 'lede',
            a: 'The problem isn’t that you’re short on time to practice.',
            b: 'It’s that you don’t know what to do with the 30 minutes you do have.',
          },
          {
            k: 'prose',
            paras: [
              'This is the first membership for bass players. And we focus on the German bow. One concept a month to keep you active with your technique: coordination, vibrato, bow strokes —legato, spiccato, staccato—. One specific exercise a week. If you want to sharpen your technique and have support while you do it, see you inside.',
            ],
          },
          { k: 'cta', variante: 'simple' },
          {
            k: 'prose',
            n: '01',
            paras: [
              'In 2012 my only job was to play, as well as I possibly could, the symphonies of the composer I love most in the world. But it wasn’t always like that, and in this story I’ll tell you something that might help you manage your practice time better — if you feel like you don’t have time, this might interest you.',
              'That year we played all of Mahler’s symphonies. At the Walt Disney Concert Hall, with the Simón Bolívar Symphony Orchestra and the Los Angeles Philharmonic together on stage, conducted by Gustavo Dudamel.',
              'A full month in California. A five-star hotel with such special treatment that one of the gifts they gave us was taking the whole orchestra to Disneyland — without a doubt the most fun day off of that tour — I felt like we were all ten years old again. For about four more years, my life looked more or less like that.',
              { fuerte: true, texto: 'And in 2016 I emigrated. I had to leave my country.' },
              'I arrived in Argentina. And while I waited for my papers, I couldn’t audition, or play, or teach anywhere. I ended up working twelve hours a day in an ice cream shop.',
              'I shared a flat with friends, so the only moment I had to practice was before seven in the morning. And the only place where I wouldn’t bother anyone was the rooftop of the building.',
              'So there I was, carrying a double bass up the stairs to a rooftop in Buenos Aires. Some days I made it. Half an hour, an hour if I got up earlier. Other days exhaustion won.',
            ],
          },
          {
            k: 'hitos',
            n: '02',
            lead: 'I discovered 3 things:',
            items: [
              {
                t: 'The first',
                p: 'the excuses, complications, lack of time — they’re there, that’s life and there’s nothing we can do about it. What we can do is train our discipline and be consistent. A great way to start is with 30 minutes — some days it might be more.',
              },
              {
                t: 'The second',
                p: 'Goals matter. Without goals, you stand at the music stand, you tune, and… now what? What are you going to play? The same as always — you end up feeling like you’re not moving forward.',
              },
              {
                t: 'The third',
                p: 'There are plenty of exercises floating around the internet, but finding and organizing them takes longer than actually practicing them. The way I see it, YouTube often steals more practice time than it gives back.',
              },
            ],
          },
          {
            k: 'prose',
            n: '03',
            paras: [
              {
                fuerte: true,
                texto:
                  'Having a goal makes us move — it makes us carve out space in the calendar, it trains our consistency. That’s my advice to you: write it down. It can be a piece you always wanted to play, or getting to know the high register of the instrument. Whatever it is, write it down. Build a plan to reach it.',
              },
              {
                fuerte: true,
                texto:
                  'This membership is about doing just enough — sustaining your consistency week after week, improving without piling up exercises you’ll never watch or practice (that’s what YouTube is for).',
              },
              'Every Thursday, when the new exercise comes in, the previous one disappears. Yes, you read that right. I delete the previous content.',
              'Why would I do that?',
              'Because libraries overwhelm. Having fifty exercises archived “for later” ends up in doing none of them. And not just that — with the guilt of not doing anything.',
            ],
          },
          { k: 'anchor', text: 'Need help? A clear guide? That’s exactly why Let’s study together exists.' },
          {
            k: 'contraste',
            n: '04',
            si: {
              titulo: 'This membership is for you if…',
              items: [
                'You have little time to practice each week but want a clear guide to keep advancing on the double bass.',
                'You study on your own, without a teacher, and often don’t know “where to begin.”',
                'You’ve spent years stuck on the same repertoire, the same book or method of exercises.',
                'You struggle to be consistent with your practice.',
                'You’ve reached a level that lets you play in orchestras and ensembles but you have technical gaps that hold you back on basic bow strokes: spiccato, staccato, legato.',
                'You feel your technique limits you from advancing in interpretation (better vibrato, connection between notes, etc.).',
                'You’re in the jazz world and want to learn and master the bow.',
              ],
            },
            no: {
              titulo: 'It’s not for you if…',
              items: [
                'You’re after an endless library of exercises to save and watch “someday.” There’s no library here, no archive, no “I’ll see it later.” There’s one exercise this week. If you don’t do it, it’s gone and another arrives — no guilt, simple.',
                'You’re looking for help toward a specific goal: getting into a conservatory or an orchestra. That would call for private lessons. This membership is meant to keep you fit and technically active. We won’t work through specific repertoire problems, though these exercises do help you build the foundations to solve them later.',
                'And if you’re not willing to make space in your life to practice, even a couple of days a week, then don’t bother joining. This membership isn’t for you.',
                'The exercises will be adapted for several levels, but everything starts slow, so you take it in and understand it. If you don’t have the patience to study slowly, it won’t work for you.',
              ],
            },
          },
          {
            k: 'prose',
            n: '05',
            paras: [
              'Courses come to an end. So do method books. This membership doesn’t: every week a new exercise comes in that keeps you active with your technique. And yes, there’s support. You ask your question in the chat and I answer it personally.',
            ],
          },
          { k: 'cta', variante: 'precio' },
          {
            k: 'prose',
            paras: [
              'A lot for a lot of you.',
              'A gift for anyone who wants to learn the technical concepts that help you improve your double bass playing exponentially, and enjoy the sound of your instrument. Simple as that. Let’s study together!',
            ],
          },
          { k: 'cta', variante: 'simple' },
          {
            k: 'pd',
            label: 'P.S.',
            texto:
              'I made this membership for the Emilse of 2016 — the one carrying her double bass up the stairs of that rooftop, full of determination not to give up the instrument, but who over time was left not knowing what to study. I owed it to her. If you’ve ever felt like you don’t know where to begin or what to study, then this is for you too.',
            firma: '— Emilse',
          },
          {
            k: 'faq',
            n: '06',
            titulo: 'Frequently asked questions',
            items: [
              {
                q: 'Can I pay in my own currency?',
                a: 'Payments run through Stripe. When you join, it automatically detects your card’s currency and you pay in it. Right now it’s €65 a month, about $75 USD. The price you join at stays frozen for you as long as you’re a member.',
              },
              {
                q: 'Do I need to be advanced to join?',
                a: 'No, but you should at least know the first positions of the instrument. I’ll leave each exercise adapted to a beginner, intermediate or advanced level. These are basic concepts we all need to study throughout our careers, whatever our level — and the sooner you start, the better.',
              },
              {
                q: 'I play French bow. Does this membership work for me?',
                a: 'This membership is designed specifically for the German bow. Some left-hand concepts will help you either way, but I teach bow strokes with German technique only. Why? Because I consider it easier, faster, and more natural for the body. It’s the one I recommend.',
              },
              {
                q: 'What happens if I join mid-month, can I see the previous content?',
                a: 'You’ll have access to whatever exercise is live that week until it’s replaced — a new one arrives every Thursday and replaces the previous one. The core concept, though, stays for the whole month: it’s a video that helps you understand the foundation of each exercise.',
              },
              {
                q: 'How does payment work?',
                a: 'It’s a monthly subscription, just like your others (Netflix, Disney, etc.) — an automatic monthly charge. In this case you pay the day you join and that becomes your billing day each month. The price you join with freezes for you as long as you’re a member.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes, from your account, with no explanation. You keep access until the end of the period you already paid for. If you later want to come back, you join at the price in force at that moment, not your previous one.',
              },
              {
                q: 'How do I ask my questions?',
                a: 'In the classroom chat. I answer them, everyone can read each other’s questions and answers — that’s another place you learn.',
              },
              {
                q: 'What language is it in?',
                a: 'This version is in English and Spanish; you can register in the language you prefer.',
              },
              {
                q: 'How much time do I need?',
                a: 'Half an hour a day, the days you can — that’s enough. Simple as that.',
              },
              {
                q: 'What hours can I access the platform?',
                a: 'It’s available to you 24/7.',
              },
              {
                q: 'I have a question that isn’t listed here:',
                a: 'Write to me and I’ll answer you personally:',
                correo: 'info@emilserios.com',
              },
            ],
          },
          { k: 'cta', variante: 'simple' },
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
