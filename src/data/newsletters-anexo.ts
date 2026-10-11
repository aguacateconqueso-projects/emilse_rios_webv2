import { FIRMA, POSDATAS, type Newsletter } from './newsletters';

/**
 * Las tres primeras entradas, en español y en inglés: **las del anexo del
 * pedido de SEO de Emi** (11 oct 2026), tal cual. Reemplazan a las del 9 oct,
 * que venían de los borradores de su PDF de correcciones.
 *
 * **Viven en Supabase**: la migración `0013_newsletters.sql` las siembra y
 * desde entonces Emi las edita en el panel. Esto es lo que la web enseña
 * **solo mientras esa migración no esté pegada** —la tabla no existe—, para
 * que `/newsletters/` no salga vacía entre el despliegue y el pegado. Con la
 * tabla, manda la tabla, aunque esté vacía. El SQL de la siembra sale de acá
 * (`npx tsx scripts/semilla-newsletters.mts`), así que dicen lo mismo.
 *
 * Fecha: el día en que se publican en la web (Emi, 11 oct 2026). En la base
 * de datos, el día en que se pega la migración; acá, el del pedido. Orden:
 * la 3 primero, después la 2 y la 1 (Emi: «3, 2, 1»): mismo día, la última
 * creada arriba.
 *
 * Las direcciones del 9 oct quedan en `slugs_anteriores`: llevan a las
 * nuevas con un 301 también desde `/newsletters/`.
 */

export const FECHA_ANEXO = '2026-10-11';

/** Los `id` fijos, para que la siembra y esto sean la misma entrada. */
export const IDS = {
  es1: '6e750001-0000-4000-8000-000000000001',
  es2: '6e750001-0000-4000-8000-000000000002',
  es3: '6e750001-0000-4000-8000-000000000003',
  en1: '6e750001-0000-4000-8000-000000000011',
  en2: '6e750001-0000-4000-8000-000000000012',
  en3: '6e750001-0000-4000-8000-000000000013',
} as const;

const p = (...parrafos: string[]) => parrafos.map((t) => (/^<(ul|ol)>/.test(t) ? t : `<p>${t}</p>`)).join('');
const ol = (...items: string[]) => `<ol>${items.map((i) => `<li>${i}</li>`).join('')}</ol>`;
const ul = (...items: string[]) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;

const es = { firma: FIRMA, pd: POSDATAS.es.pd, pd2: POSDATAS.es.pd2, pd3: '' };
const en = { firma: FIRMA, pd: POSDATAS.en.pd, pd2: POSDATAS.en.pd2, pd3: '' };

export const ANEXO: Newsletter[] = [
  /* --- Español ------------------------------------------------------------ */
  {
    id: IDS.es1,
    lang: 'es',
    slug: 'fuerza-mano-izquierda-contrabajo',
    titulo: 'Cómo ganar fuerza en la mano izquierda del contrabajo',
    cuerpo: p(
      'En este correo vas a encontrar un tip muy importante para mejorar tu legato y tener más fuerza en la mano izquierda.',
      'La cosa es así. La mano izquierda en forma de C es poder. Es una frase famosa del gran Gary Karr, pero no es el único que lo dice.',
      'De hecho, todos los grandes contrabajistas que enseñan o tienen videos por ahí lo mencionan en algún momento.',
      'Hace unos días, viendo una masterclass de Thomas Martin —si acabas de aterrizar en este planeta y no sabes quién es, bueno... es una leyenda del contrabajo—.',
      'En fin, él dice que la mejor forma de fortalecer la mano izquierda es con patrones.',
      'No escalas. Patrones, ¿sabes?',
      'Esos ejercicios donde repites un patrón en cada posición. Por ejemplo: 1-2-4-1, subes medio tono, 1-2-4-1, subes otra vez... y así, subiendo de medio tono en medio tono.',
      'Y hay dos formas de sacarles provecho:',
      ol('Tocar con arcos separados, abajo-arriba en cada nota.', 'Tocar todo el patrón ligado, un arco por patrón.'),
      'Con la primera trabajas la coordinación, que está genial.',
      'Con la segunda trabajas la fuerza, que es mucho mejor. Por lo menos ahora, justo en el mes en el que nos enfocamos en el legato.',
      'Y sí, una mano izquierda fuerte es fundamental para un buen legato. Hasta los pianos más suaves necesitan una mano izquierda que presione con mucha firmeza.',
      'Una vez, ensayando para el Festival de Lucerna, el maestro Claudio Abbado nos dijo:',
      '“Este piano hay que pensarlo como un forte. Un forte enorme que se toca muy, muy lejos.”',
      'En fin, eso ya es otro newsletter.',
      'Entonces: patrones, ligados, y que toda la articulación salga de la mano izquierda.',
      '¿Lo has probado? Casi todos los métodos los tienen. Solo tienes que probarlos ligados.',
    ),
    ...es,
    relacionadas: [IDS.es2, IDS.es3],
    traduccion: IDS.en1,
    titulo_google: 'Cómo ganar fuerza en la mano izquierda del contrabajo',
    meta: 'Patrones ligados: el ejercicio para ganar fuerza en la mano izquierda y mejorar tu legato en el contrabajo, según una masterclass de Thomas Martin.',
    extracto:
      'En este correo vas a encontrar un tip muy importante para mejorar tu legato y tener más fuerza en la mano izquierda.',
    fecha: FECHA_ANEXO,
    slugs_anteriores: ['como-ganar-fuerza-en-la-mano-izquierda-contrabajo'],
    created_at: '2026-10-11T10:00:01Z',
  },
  {
    id: IDS.es2,
    lang: 'es',
    slug: 'como-usar-vibrato-contrabajo',
    titulo: 'Cómo usar el vibrato en el contrabajo: dónde y cuándo vibrar',
    cuerpo: p(
      'Hoy te traigo un ejercicio. Tarea, reto, llámalo como quieras — la finalidad es la misma: hacerte más consciente del vibrato que usas. Y de cómo lo usas.',
      'Pero antes te cuento una historia.',
      'Hablando con un colega esta semana, me decía que por mucho que estudia vibrato, no logra avanzar. O bueno, sí, pero no.',
      'A ver, según él, le salen cada vez mejor los ejercicios.',
      'Pero… cuando lo pone en práctica en una obra, no siempre sabe exactamente dónde vibrar ni cómo.',
      'También cuando intenta mantenerlo, su mano se pone muy tensa. Es decir, puede vibrar una negra, una blanca, pero conectar varios compases le resulta súper difícil y su mano se torna rígida.',
      'De esto último te hablo <a href="/newsletters/vibrato-contrabajo-mano-tensa/">en el próximo correo</a>. Hoy me enfoco en la parte de “no sé dónde vibrar”.',
      'Entonces, como soy freaky fan de dar consejos que nadie me pide, le dije:',
      '“No sabes dónde vibrar porque no tienes la historia en tu cabeza.”',
      'Si tienes una frase, tienes una posibilidad de decir algo. Y cuando decides qué quieres decir, entonces automáticamente sabes dónde colocar el vibrato.',
      '¿Por qué sé esto?',
      'Porque cuando estaba redactando el guion de <a href="/formaciones/tu-vibrato-como-un-cantante/">los videos del curso</a>, me senté a pensar muuuuucho cuál fue el momento exacto en el que hice click. Recuerdo que mi vibrato era muy nervioso, y también recuerdo que en algún punto dejó de ser un problema.',
      'No es que me convertí en Emilse la súper contrabajista, para nada. Pero el vibrato no representó nunca más un problema, así que podía usar mi tiempo de estudio para resolver otras cosas.',
      'Y para saber cómo estructurar el curso, necesitaba ubicar qué fue lo que me hizo dar ese paso y que el vibrato fuese una de mis herramientas para interpretar y no un dolor de cabeza que no podía resolver.',
      'Así fue que di con ese momento. El click que lo cambió todo. Que por cierto, no es que es un instante donde un ser superior te ilumina y pahh desde ahí todo te sale lindo, nada que ver (ojalá).',
      'Simplemente, cambias tu forma de ver algo, y con la práctica lo incorporas.',
      'Entonces…',
      'Pensar en la historia, automáticamente te da el vibrato que usas, y cuándo lo usas.',
      'HER MO SO.',
      '<strong>El ejercicio:</strong>',
      'Escoge una frase. Solo una. La que quieras. Puede ser un fragmento de una obra que estés tocando — y la consigna es: entre más fácil, mejor. Cualquier pieza del Suzuki vendría bien para esto. Fácil, para que te concentres en lo que quieres decir y no estés luchando con las notas.',
      'Esta frase, solo una, 8 compases máximo: tócala, grábala, en 2 versiones diferentes, solo usando vibrato. Es decir, lo que las hará diferentes será el sitio donde vibras y, claro que sí, cómo vibras.',
      'Este ejercicio es para ayer!!!',
      '¿Por qué? Porque necesitas entender que el vibrato es tu herramienta para contar algo.',
      'Si quieres mandarme los videos, súper. Disfrutaré verlos. Y si tengo tiempo durante la semana, seguramente te dé feedback.',
    ),
    ...es,
    relacionadas: [IDS.es3, IDS.es1],
    traduccion: IDS.en2,
    titulo_google: 'Cómo usar el vibrato en el contrabajo: dónde y cuándo vibrar',
    meta: 'Si no sabes dónde vibrar, es porque no tienes la historia en tu cabeza. Un ejercicio de 8 compases para usar el vibrato del contrabajo con intención.',
    extracto:
      'Hoy te traigo un ejercicio. Tarea, reto, llámalo como quieras — la finalidad es la misma: hacerte más consciente del vibrato que usas. Y de cómo lo usas.',
    fecha: FECHA_ANEXO,
    slugs_anteriores: ['tipos-de-vibrato-en-el-contrabajo'],
    created_at: '2026-10-11T10:00:02Z',
  },
  {
    id: IDS.es3,
    lang: 'es',
    slug: 'vibrato-contrabajo-mano-tensa',
    titulo: 'El error más común al aprender vibrato en el contrabajo',
    cuerpo: p(
      '“El vibrato me sale bien, pero cuando intento mantenerlo mi mano se pone tensa, rígida.”',
      'A todos nos ha pasado, amigo, no te preocupes.',
      'De hecho, tengo un colega que ha pasado años estudiando técnica, vibrato específicamente. Es un coleccionista de videos de YouTube.',
      'Hay mucha información en esa plataforma, y eso es bueno y no tanto, ¿je? Aunque podrías encontrar todo lo que necesitas allí para aprender por tus medios, intentar organizar el contenido para que se adapte a tu problema específico puede tomarte muchísimo tiempo.',
      'En fin, este colega tiene muchísimos datos y ejercicios, y mucho tiempo practicándolos, pero no ve progresos. O bueno, sí, ya puede vibrar, pero su mano se pone rígida cuando intenta conectar frases.',
      'Es decir, después de pasar varios compases vibrando aparece la tensión y su vibrato se torna nervioso.',
      'Tan nervioso que llega a un punto en el que ya no puede seguir, se paraliza.',
      'La razón por la cual esos ejercicios no le funcionan no es porque sean malos. Como te dije, hay muchísima información buena en esa plataforma, grandes maestros dando grandes consejos, pero… ellos no están viéndote. Tal vez ese ejercicio no es para ti.',
      'En el caso de mi colega, su problema viene de la base: cómo posicionarse con el instrumento.',
      'Tu cuerpo es el apoyo. Si olvidas esto, terminas apretando con el pulgar.',
      'Ahora bien, vengo a recordarte la técnica, porque es lo que más fácil se olvida cuando estás concentrado en el vibrato.',
      'En realidad es una cadena:',
      ul(
        'Básicamente, dejar que el contrabajo venga hacia nosotros, no al revés. Lo que me lleva a…',
        'El soporte más grande que tenemos con el instrumento es nuestro cuerpo: la pierna, la cadera, si tocamos de pie. Para esto, y solo para esto, tengo que ser sincera y asumir que (aunque no me guste) sentados es más fácil. Y esto nos lleva a…',
        'No apretar con el pulgar, es solo un pequeño apoyo.',
      ),
      'Esta es la clave para evitar la tensión en la mano (y por ende en el vibrato).',
      'Y cuando pensamos que hay que mantener el mismo vibrato hasta el final, es más difícil tocar relajados. El cuerpo lo entiende como un movimiento mecánico, repetitivo, y terminamos sonando robóticos. El truco es enfocarnos en otra cosa. Pero de esto te hablo <a href="#suscribete">en el siguiente correo</a>.',
    ),
    ...es,
    relacionadas: [IDS.es2, IDS.es1],
    traduccion: IDS.en3,
    titulo_google: 'Vibrato en el contrabajo: por qué se tensa tu mano',
    meta: 'El vibrato te sale bien, pero al mantenerlo la mano se pone rígida. El error más común está en la base: cómo te apoyas en el contrabajo.',
    extracto:
      '“El vibrato me sale bien, pero cuando intento mantenerlo mi mano se pone tensa, rígida.” A todos nos ha pasado, amigo, no te preocupes.',
    fecha: FECHA_ANEXO,
    slugs_anteriores: ['error-mas-comun-al-aprender-vibrato-contrabajo'],
    created_at: '2026-10-11T10:00:03Z',
  },

  /* --- English ------------------------------------------------------------ */
  {
    id: IDS.en1,
    lang: 'en',
    slug: 'left-hand-strength-double-bass',
    titulo: 'How to build left hand strength on the double bass',
    cuerpo: p(
      'In this email you’ll find a really important tip for improving your legato and getting more strength in your left hand.',
      'Here’s the thing. The left hand in a C shape means power. It’s a famous line from the great Gary Karr, but he’s not the only one who says it.',
      'In fact, every great bass player who teaches or has videos out there mentions it at some point.',
      'A few days ago, watching a masterclass by Thomas Martin —if you just landed on this planet and don’t know who he is, well... he’s a legend of the double bass—.',
      'Anyway, he says the best way to strengthen the left hand is with patterns.',
      'Not scales. Patterns, you know?',
      'Those exercises where you repeat a pattern in every position. For example: 1-2-4-1, move up a half step, 1-2-4-1, move again... and so on, going up by half steps.',
      'And there are two ways to get something out of them:',
      ol('Play with separate bows, down-up on each note.', 'Play the whole pattern slurred, one bow per pattern.'),
      'With the first one you work on coordination, which is great.',
      'With the second one you work on strength, which is much better. At least right now, right in the month where we’re focusing on legato.',
      'And yes, a strong left hand is essential for a good legato. Even the quietest pianos require a left hand pressing down very firmly.',
      'Once, rehearsing for the Lucerne Festival, maestro Claudio Abbado told us:',
      '“This piano should be thought of as a forte. A huge forte being played very, very far away.”',
      'Anyway, that’s a whole other newsletter.',
      'So: patterns, slurred, and let all the articulation come from the left hand.',
      'Have you tried it? Almost every method book has them. You just have to try them slurred.',
    ),
    ...en,
    relacionadas: [IDS.en2, IDS.en3],
    traduccion: IDS.es1,
    titulo_google: 'How to build left hand strength on the double bass',
    meta: 'Slurred patterns: the exercise to build left hand strength and improve your legato on the double bass, from a Thomas Martin masterclass.',
    extracto:
      'In this email you’ll find a really important tip for improving your legato and getting more strength in your left hand.',
    fecha: FECHA_ANEXO,
    slugs_anteriores: ['how-to-build-left-hand-strength-double-bass'],
    created_at: '2026-10-11T10:00:01Z',
  },
  {
    id: IDS.en2,
    lang: 'en',
    slug: 'how-to-use-vibrato-double-bass',
    titulo: 'How to use vibrato on the double bass: where and when to vibrate',
    cuerpo: p(
      'Today I’m bringing you an exercise. Homework, challenge, call it whatever you want — the goal is the same: to make you more aware of the vibrato you use. And of how you use it.',
      'But first, let me tell you a story.',
      'Talking with a colleague this week, he told me that no matter how much he studies vibrato, he can’t move forward. Well, he can, but he can’t.',
      'Let me explain. According to him, the exercises keep coming out better and better.',
      'But… when he puts it into practice in a piece, he doesn’t always know exactly where to vibrate or how.',
      'Also, when he tries to sustain it, his hand gets really tense. I mean, he can vibrate a quarter note, a half note, but connecting several bars is super hard for him and his hand goes rigid.',
      'I’ll talk about that last part <a href="/en/newsletters/double-bass-vibrato-tense-hand/">in the next email</a>. Today I’m focusing on the “I don’t know where to vibrate” part.',
      'So, since I’m a freaky fan of giving advice nobody asks for, I told him:',
      '“You don’t know where to vibrate because you don’t have the story in your head.”',
      'If you have a phrase, you have a chance to say something. And when you decide what you want to say, you automatically know where to put the vibrato.',
      'How do I know this?',
      'Because when I was writing the script for <a href="/en/programs/vibrato-like-a-singer/">the course videos</a>, I sat down and thought for a looooong time about the exact moment it clicked for me. I remember my vibrato was really nervous, and I also remember that at some point it stopped being a problem.',
      'It’s not like I became Emilse the super bassist, not at all. But vibrato was never a problem again, so I could use my practice time to solve other things.',
      'And to know how to structure the course, I needed to pin down what made me take that step, so that vibrato became one of my tools for interpreting music and not a headache I couldn’t solve.',
      'That’s how I found that moment. The click that changed everything. Which, by the way, isn’t an instant where some higher being enlightens you and pahh, from then on everything comes out beautiful. Nothing like that (I wish).',
      'You simply change the way you see something, and with practice you make it yours.',
      'So…',
      'Thinking about the story automatically gives you the vibrato you use, and when you use it.',
      'BEAU-TI-FUL.',
      '<strong>The exercise:</strong>',
      'Choose a phrase. Just one. Whichever you want. It can be a fragment of a piece you’re playing — and the rule is: the easier, the better. Any Suzuki piece would work for this. Easy, so you can focus on what you want to say instead of fighting with the notes.',
      'This phrase, just one, 8 bars max: play it, record it, in 2 different versions, using only vibrato. That is, what makes them different is where you vibrate and, of course, how you vibrate.',
      'This exercise is due yesterday!!!',
      'Why? Because you need to understand that vibrato is your tool for telling something.',
      'If you want to send me the videos, great. I’ll enjoy watching them. And if I have time during the week, I’ll probably give you feedback.',
    ),
    ...en,
    relacionadas: [IDS.en3, IDS.en1],
    traduccion: IDS.es2,
    titulo_google: 'How to use vibrato on the double bass: where to vibrate',
    meta: 'If you don’t know where to vibrate, it’s because you don’t have the story in your head. An 8-bar exercise to use double bass vibrato with intention.',
    extracto:
      'Today I’m bringing you an exercise. Homework, challenge, call it whatever you want — the goal is the same: to make you more aware of the vibrato you use. And of how you use it.',
    fecha: FECHA_ANEXO,
    slugs_anteriores: ['types-of-vibrato-on-the-double-bass'],
    created_at: '2026-10-11T10:00:02Z',
  },
  {
    id: IDS.en3,
    lang: 'en',
    slug: 'double-bass-vibrato-tense-hand',
    titulo: 'The most common mistake when learning vibrato on the double bass',
    cuerpo: p(
      '“My vibrato comes out fine, but when I try to sustain it my hand gets tense, rigid.”',
      'It’s happened to all of us, my friend, don’t worry.',
      'In fact, I have a colleague who has spent years studying technique, vibrato specifically. He’s a YouTube video collector.',
      'There’s a lot of information on that platform, and that’s good and not so good, heh? Even though you could find everything you need there to learn on your own, trying to organize the content so it fits your specific problem can take you a huge amount of time.',
      'Anyway, this colleague has tons of information and exercises, and a long time practicing them, but he doesn’t see progress. Well, he does, he can vibrate now, but his hand goes rigid when he tries to connect phrases.',
      'I mean, after several bars of vibrato the tension shows up and his vibrato gets nervous.',
      'So nervous that it reaches a point where he can’t keep going. He freezes.',
      'The reason those exercises don’t work for him isn’t that they’re bad. Like I said, there’s a ton of good information on that platform, great teachers giving great advice, but… they’re not watching you. Maybe that exercise isn’t for you.',
      'In my colleague’s case, his problem comes from the foundation: how he positions himself with the instrument.',
      'Your body is the support. If you forget this, you end up squeezing with your thumb.',
      'Now, I’m here to remind you of the technique, because it’s the easiest thing to forget when you’re focused on vibrato.',
      'It’s actually a chain:',
      ul(
        'Basically, let the double bass come to us, not the other way around. Which brings me to…',
        'The biggest support we have with the instrument is our body: the leg, the hip, if we play standing. For this, and only for this, I have to be honest and admit that (even though I don’t like it) sitting is easier. And that brings us to…',
        'Don’t squeeze with the thumb. It’s just a small support.',
      ),
      'This is the key to avoiding tension in the hand (and therefore in the vibrato).',
      'And when we think we have to keep the same vibrato all the way to the end, it’s harder to play relaxed. The body understands it as a mechanical, repetitive movement, and we end up sounding robotic. The trick is to focus on something else. But I’ll tell you about that <a href="#suscribete">in the next email</a>.',
    ),
    ...en,
    relacionadas: [IDS.en2, IDS.en1],
    traduccion: IDS.es3,
    titulo_google: 'Double bass vibrato: why your hand gets tense',
    meta: 'Your vibrato works, but when you sustain it your hand goes rigid. The most common mistake is in the foundation: how you hold the double bass.',
    extracto:
      '“My vibrato comes out fine, but when I try to sustain it my hand gets tense, rigid.” It’s happened to all of us, my friend, don’t worry.',
    fecha: FECHA_ANEXO,
    slugs_anteriores: ['most-common-vibrato-mistake-double-bass'],
    created_at: '2026-10-11T10:00:03Z',
  },
];
