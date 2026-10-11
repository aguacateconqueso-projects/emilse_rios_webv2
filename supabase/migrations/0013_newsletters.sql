-- =============================================================================
-- 0013 — Los newsletters pasados
--
-- Ejecutar en Supabase → SQL Editor, UNA vez. Mismo proyecto de siempre; la
-- numeración sigue la de las migraciones anteriores.
--
-- 11 oct 2026, el pedido de SEO de Emi (punto 5): «Algunos newsletters
-- pasados», sus correos publicados como entradas en `/newsletters/` y
-- `/en/newsletters/`, que **Emi publica sola desde el panel** (pestaña
-- «Newsletters pasados»). Ver `src/data/newsletters.ts`.
--
--   newsletters         las entradas PUBLICADAS. Las lee cualquiera: es la web.
--   newsletter_drafts   el BORRADOR de cada entrada (solo lo ve Emi).
--                       «Publicar» copia el borrador a `newsletters` y lo
--                       borra. Van separadas por lo mismo que las páginas de
--                       ventas (0010): con una sola tabla, quien puede leer la
--                       publicada podría leer también el borrador a medias.
--
-- Lo que pone la base de datos, no el navegador:
--
--   · `published_at`, la hora de cada publicación (la de las páginas de
--     ventas, `paginas_publicar()`): es el `lastmod` del sitemap y el
--     `dateModified` para Google;
--   · `slugs_anteriores`: si Emi cambia la dirección de una entrada ya
--     publicada, la vieja se apunta acá y la página la lleva a la nueva con
--     un 301 (los correos enviados con la vieja siguen funcionando).
--
-- Y siembra **las tres primeras entradas, en español y en inglés**: las del
-- anexo del documento, con fecha de hoy (el día en que se publican en la web,
-- como pidió Emi) y en el orden 3, 2, 1. Salen de
-- `src/data/newsletters-anexo.ts`, que es lo que la web enseña mientras esta
-- migración no esté pegada.
--
-- ⚠️ SOLO ADITIVA E IDEMPOTENTE. Se puede volver a pegar entera: no toca nada
-- que exista, y las entradas sembradas que Emi ya haya cambiado (o borrado)
-- no vuelven.
-- =============================================================================

begin;

create table if not exists public.newsletters (
  id                uuid primary key default gen_random_uuid(),
  lang              text not null check (lang in ('es', 'en')),
  slug              text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  titulo            text not null,
  cuerpo            text not null default '',
  firma             text not null default '',
  pd                text not null default '',
  pd2               text not null default '',
  pd3               text not null default '',
  -- «Sigue leyendo» y «Traducción vinculada»: sin clave foránea a propósito.
  -- Si Emi borra una entrada, la web ignora el enlace roto y sigue.
  relacionadas      uuid[] not null default '{}',
  traduccion        uuid,
  titulo_google     text not null default '',
  meta              text not null default '',
  extracto          text not null default '',
  fecha             date not null default ((now() at time zone 'Europe/Madrid')::date),
  slugs_anteriores  text[] not null default '{}',
  created_at        timestamptz not null default now(),
  published_at      timestamptz not null default now(),
  unique (lang, slug)
);

create table if not exists public.newsletter_drafts (
  id          uuid primary key,
  datos       jsonb not null,
  updated_at  timestamptz not null default now()
);

-- La hora de publicar, del reloj de la base de datos (0010).
drop trigger if exists newsletters_publicar on public.newsletters;
create trigger newsletters_publicar before insert or update on public.newsletters
  for each row execute function public.paginas_publicar();

drop trigger if exists newsletter_drafts_tocar on public.newsletter_drafts;
create trigger newsletter_drafts_tocar before update on public.newsletter_drafts
  for each row execute function public.cursos_tocar();

-- La dirección de antes, apuntada al cambiarla. El panel nunca escribe esta
-- columna: la lleva la base de datos sola.
create or replace function public.newsletters_slug()
returns trigger language plpgsql as $$
begin
  if tg_op = 'UPDATE' and new.slug is distinct from old.slug then
    new.slugs_anteriores := array_append(array_remove(old.slugs_anteriores, old.slug), old.slug);
  end if;
  new.slugs_anteriores := array_remove(new.slugs_anteriores, new.slug);
  return new;
end;
$$;

drop trigger if exists newsletters_slug on public.newsletters;
create trigger newsletters_slug before insert or update on public.newsletters
  for each row execute function public.newsletters_slug();

alter table public.newsletters       enable row level security;
alter table public.newsletter_drafts enable row level security;

-- ---- newsletters: la publicada la lee cualquiera; escribe solo Emi ----
drop policy if exists "newsletters: public read" on public.newsletters;
drop policy if exists "newsletters: admin all" on public.newsletters;
create policy "newsletters: public read" on public.newsletters
  for select using (true);
create policy "newsletters: admin all" on public.newsletters
  for all using (is_admin()) with check (is_admin());

-- ---- newsletter_drafts: solo Emi ----
drop policy if exists "newsletter_drafts: admin all" on public.newsletter_drafts;
create policy "newsletter_drafts: admin all" on public.newsletter_drafts
  for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- LAS TRES PRIMERAS, en español y en inglés (el anexo del documento de Emi).
-- Generado con `npx tsx scripts/semilla-newsletters.mts`.
-- ---------------------------------------------------------------------------
insert into public.newsletters
  (id, lang, slug, titulo, cuerpo, firma, pd, pd2, pd3, relacionadas, traduccion,
   titulo_google, meta, extracto, fecha, slugs_anteriores, created_at)
values
  ('6e750001-0000-4000-8000-000000000001',
    'es',
    'fuerza-mano-izquierda-contrabajo',
    'Cómo ganar fuerza en la mano izquierda del contrabajo',
    '<p>En este correo vas a encontrar un tip muy importante para mejorar tu legato y tener más fuerza en la mano izquierda.</p><p>La cosa es así. La mano izquierda en forma de C es poder. Es una frase famosa del gran Gary Karr, pero no es el único que lo dice.</p><p>De hecho, todos los grandes contrabajistas que enseñan o tienen videos por ahí lo mencionan en algún momento.</p><p>Hace unos días, viendo una masterclass de Thomas Martin —si acabas de aterrizar en este planeta y no sabes quién es, bueno... es una leyenda del contrabajo—.</p><p>En fin, él dice que la mejor forma de fortalecer la mano izquierda es con patrones.</p><p>No escalas. Patrones, ¿sabes?</p><p>Esos ejercicios donde repites un patrón en cada posición. Por ejemplo: 1-2-4-1, subes medio tono, 1-2-4-1, subes otra vez... y así, subiendo de medio tono en medio tono.</p><p>Y hay dos formas de sacarles provecho:</p><ol><li>Tocar con arcos separados, abajo-arriba en cada nota.</li><li>Tocar todo el patrón ligado, un arco por patrón.</li></ol><p>Con la primera trabajas la coordinación, que está genial.</p><p>Con la segunda trabajas la fuerza, que es mucho mejor. Por lo menos ahora, justo en el mes en el que nos enfocamos en el legato.</p><p>Y sí, una mano izquierda fuerte es fundamental para un buen legato. Hasta los pianos más suaves necesitan una mano izquierda que presione con mucha firmeza.</p><p>Una vez, ensayando para el Festival de Lucerna, el maestro Claudio Abbado nos dijo:</p><p>“Este piano hay que pensarlo como un forte. Un forte enorme que se toca muy, muy lejos.”</p><p>En fin, eso ya es otro newsletter.</p><p>Entonces: patrones, ligados, y que toda la articulación salga de la mano izquierda.</p><p>¿Lo has probado? Casi todos los métodos los tienen. Solo tienes que probarlos ligados.</p>',
    'Un abrazo,
Emilse',
    '¿Todavía no estás en mi newsletter? Te suscribes <a href="#suscribete">aquí</a>. Suscribirse es gratis, darse de baja también.',
    'Cuando te suscribes, te llega un correo de bienvenida con un video. Es un ejercicio donde te explico un concepto que va a cambiar la forma en que produces el sonido. El video dura 4:04 y casi seguro conoces el ejercicio: no hay contrabajista en el mundo que no lo haya practicado. Pero el 90% lo hace mal, ¡JA! Casi nadie sabe de dónde viene realmente ese movimiento. Pero tú no vas a estar en ese 90%. Tú no. No después de ver el video. Ya me contarás.',
    '',
    array['6e750001-0000-4000-8000-000000000002', '6e750001-0000-4000-8000-000000000003']::uuid[],
    '6e750001-0000-4000-8000-000000000011'::uuid,
    'Cómo ganar fuerza en la mano izquierda del contrabajo',
    'Patrones ligados: el ejercicio para ganar fuerza en la mano izquierda y mejorar tu legato en el contrabajo, según una masterclass de Thomas Martin.',
    'En este correo vas a encontrar un tip muy importante para mejorar tu legato y tener más fuerza en la mano izquierda.',
    (now() at time zone 'Europe/Madrid')::date,
    array['como-ganar-fuerza-en-la-mano-izquierda-contrabajo']::text[],
    now() - interval '3 seconds'),
  ('6e750001-0000-4000-8000-000000000002',
    'es',
    'como-usar-vibrato-contrabajo',
    'Cómo usar el vibrato en el contrabajo: dónde y cuándo vibrar',
    '<p>Hoy te traigo un ejercicio. Tarea, reto, llámalo como quieras — la finalidad es la misma: hacerte más consciente del vibrato que usas. Y de cómo lo usas.</p><p>Pero antes te cuento una historia.</p><p>Hablando con un colega esta semana, me decía que por mucho que estudia vibrato, no logra avanzar. O bueno, sí, pero no.</p><p>A ver, según él, le salen cada vez mejor los ejercicios.</p><p>Pero… cuando lo pone en práctica en una obra, no siempre sabe exactamente dónde vibrar ni cómo.</p><p>También cuando intenta mantenerlo, su mano se pone muy tensa. Es decir, puede vibrar una negra, una blanca, pero conectar varios compases le resulta súper difícil y su mano se torna rígida.</p><p>De esto último te hablo <a href="/newsletters/vibrato-contrabajo-mano-tensa/">en el próximo correo</a>. Hoy me enfoco en la parte de “no sé dónde vibrar”.</p><p>Entonces, como soy freaky fan de dar consejos que nadie me pide, le dije:</p><p>“No sabes dónde vibrar porque no tienes la historia en tu cabeza.”</p><p>Si tienes una frase, tienes una posibilidad de decir algo. Y cuando decides qué quieres decir, entonces automáticamente sabes dónde colocar el vibrato.</p><p>¿Por qué sé esto?</p><p>Porque cuando estaba redactando el guion de <a href="/formaciones/tu-vibrato-como-un-cantante/">los videos del curso</a>, me senté a pensar muuuuucho cuál fue el momento exacto en el que hice click. Recuerdo que mi vibrato era muy nervioso, y también recuerdo que en algún punto dejó de ser un problema.</p><p>No es que me convertí en Emilse la súper contrabajista, para nada. Pero el vibrato no representó nunca más un problema, así que podía usar mi tiempo de estudio para resolver otras cosas.</p><p>Y para saber cómo estructurar el curso, necesitaba ubicar qué fue lo que me hizo dar ese paso y que el vibrato fuese una de mis herramientas para interpretar y no un dolor de cabeza que no podía resolver.</p><p>Así fue que di con ese momento. El click que lo cambió todo. Que por cierto, no es que es un instante donde un ser superior te ilumina y pahh desde ahí todo te sale lindo, nada que ver (ojalá).</p><p>Simplemente, cambias tu forma de ver algo, y con la práctica lo incorporas.</p><p>Entonces…</p><p>Pensar en la historia, automáticamente te da el vibrato que usas, y cuándo lo usas.</p><p>HER MO SO.</p><p><strong>El ejercicio:</strong></p><p>Escoge una frase. Solo una. La que quieras. Puede ser un fragmento de una obra que estés tocando — y la consigna es: entre más fácil, mejor. Cualquier pieza del Suzuki vendría bien para esto. Fácil, para que te concentres en lo que quieres decir y no estés luchando con las notas.</p><p>Esta frase, solo una, 8 compases máximo: tócala, grábala, en 2 versiones diferentes, solo usando vibrato. Es decir, lo que las hará diferentes será el sitio donde vibras y, claro que sí, cómo vibras.</p><p>Este ejercicio es para ayer!!!</p><p>¿Por qué? Porque necesitas entender que el vibrato es tu herramienta para contar algo.</p><p>Si quieres mandarme los videos, súper. Disfrutaré verlos. Y si tengo tiempo durante la semana, seguramente te dé feedback.</p>',
    'Un abrazo,
Emilse',
    '¿Todavía no estás en mi newsletter? Te suscribes <a href="#suscribete">aquí</a>. Suscribirse es gratis, darse de baja también.',
    'Cuando te suscribes, te llega un correo de bienvenida con un video. Es un ejercicio donde te explico un concepto que va a cambiar la forma en que produces el sonido. El video dura 4:04 y casi seguro conoces el ejercicio: no hay contrabajista en el mundo que no lo haya practicado. Pero el 90% lo hace mal, ¡JA! Casi nadie sabe de dónde viene realmente ese movimiento. Pero tú no vas a estar en ese 90%. Tú no. No después de ver el video. Ya me contarás.',
    '',
    array['6e750001-0000-4000-8000-000000000003', '6e750001-0000-4000-8000-000000000001']::uuid[],
    '6e750001-0000-4000-8000-000000000012'::uuid,
    'Cómo usar el vibrato en el contrabajo: dónde y cuándo vibrar',
    'Si no sabes dónde vibrar, es porque no tienes la historia en tu cabeza. Un ejercicio de 8 compases para usar el vibrato del contrabajo con intención.',
    'Hoy te traigo un ejercicio. Tarea, reto, llámalo como quieras — la finalidad es la misma: hacerte más consciente del vibrato que usas. Y de cómo lo usas.',
    (now() at time zone 'Europe/Madrid')::date,
    array['tipos-de-vibrato-en-el-contrabajo']::text[],
    now() - interval '2 seconds'),
  ('6e750001-0000-4000-8000-000000000003',
    'es',
    'vibrato-contrabajo-mano-tensa',
    'El error más común al aprender vibrato en el contrabajo',
    '<p>“El vibrato me sale bien, pero cuando intento mantenerlo mi mano se pone tensa, rígida.”</p><p>A todos nos ha pasado, amigo, no te preocupes.</p><p>De hecho, tengo un colega que ha pasado años estudiando técnica, vibrato específicamente. Es un coleccionista de videos de YouTube.</p><p>Hay mucha información en esa plataforma, y eso es bueno y no tanto, ¿je? Aunque podrías encontrar todo lo que necesitas allí para aprender por tus medios, intentar organizar el contenido para que se adapte a tu problema específico puede tomarte muchísimo tiempo.</p><p>En fin, este colega tiene muchísimos datos y ejercicios, y mucho tiempo practicándolos, pero no ve progresos. O bueno, sí, ya puede vibrar, pero su mano se pone rígida cuando intenta conectar frases.</p><p>Es decir, después de pasar varios compases vibrando aparece la tensión y su vibrato se torna nervioso.</p><p>Tan nervioso que llega a un punto en el que ya no puede seguir, se paraliza.</p><p>La razón por la cual esos ejercicios no le funcionan no es porque sean malos. Como te dije, hay muchísima información buena en esa plataforma, grandes maestros dando grandes consejos, pero… ellos no están viéndote. Tal vez ese ejercicio no es para ti.</p><p>En el caso de mi colega, su problema viene de la base: cómo posicionarse con el instrumento.</p><p>Tu cuerpo es el apoyo. Si olvidas esto, terminas apretando con el pulgar.</p><p>Ahora bien, vengo a recordarte la técnica, porque es lo que más fácil se olvida cuando estás concentrado en el vibrato.</p><p>En realidad es una cadena:</p><ul><li>Básicamente, dejar que el contrabajo venga hacia nosotros, no al revés. Lo que me lleva a…</li><li>El soporte más grande que tenemos con el instrumento es nuestro cuerpo: la pierna, la cadera, si tocamos de pie. Para esto, y solo para esto, tengo que ser sincera y asumir que (aunque no me guste) sentados es más fácil. Y esto nos lleva a…</li><li>No apretar con el pulgar, es solo un pequeño apoyo.</li></ul><p>Esta es la clave para evitar la tensión en la mano (y por ende en el vibrato).</p><p>Y cuando pensamos que hay que mantener el mismo vibrato hasta el final, es más difícil tocar relajados. El cuerpo lo entiende como un movimiento mecánico, repetitivo, y terminamos sonando robóticos. El truco es enfocarnos en otra cosa. Pero de esto te hablo <a href="#suscribete">en el siguiente correo</a>.</p>',
    'Un abrazo,
Emilse',
    '¿Todavía no estás en mi newsletter? Te suscribes <a href="#suscribete">aquí</a>. Suscribirse es gratis, darse de baja también.',
    'Cuando te suscribes, te llega un correo de bienvenida con un video. Es un ejercicio donde te explico un concepto que va a cambiar la forma en que produces el sonido. El video dura 4:04 y casi seguro conoces el ejercicio: no hay contrabajista en el mundo que no lo haya practicado. Pero el 90% lo hace mal, ¡JA! Casi nadie sabe de dónde viene realmente ese movimiento. Pero tú no vas a estar en ese 90%. Tú no. No después de ver el video. Ya me contarás.',
    '',
    array['6e750001-0000-4000-8000-000000000002', '6e750001-0000-4000-8000-000000000001']::uuid[],
    '6e750001-0000-4000-8000-000000000013'::uuid,
    'Vibrato en el contrabajo: por qué se tensa tu mano',
    'El vibrato te sale bien, pero al mantenerlo la mano se pone rígida. El error más común está en la base: cómo te apoyas en el contrabajo.',
    '“El vibrato me sale bien, pero cuando intento mantenerlo mi mano se pone tensa, rígida.” A todos nos ha pasado, amigo, no te preocupes.',
    (now() at time zone 'Europe/Madrid')::date,
    array['error-mas-comun-al-aprender-vibrato-contrabajo']::text[],
    now() - interval '1 seconds'),
  ('6e750001-0000-4000-8000-000000000011',
    'en',
    'left-hand-strength-double-bass',
    'How to build left hand strength on the double bass',
    '<p>In this email you’ll find a really important tip for improving your legato and getting more strength in your left hand.</p><p>Here’s the thing. The left hand in a C shape means power. It’s a famous line from the great Gary Karr, but he’s not the only one who says it.</p><p>In fact, every great bass player who teaches or has videos out there mentions it at some point.</p><p>A few days ago, watching a masterclass by Thomas Martin —if you just landed on this planet and don’t know who he is, well... he’s a legend of the double bass—.</p><p>Anyway, he says the best way to strengthen the left hand is with patterns.</p><p>Not scales. Patterns, you know?</p><p>Those exercises where you repeat a pattern in every position. For example: 1-2-4-1, move up a half step, 1-2-4-1, move again... and so on, going up by half steps.</p><p>And there are two ways to get something out of them:</p><ol><li>Play with separate bows, down-up on each note.</li><li>Play the whole pattern slurred, one bow per pattern.</li></ol><p>With the first one you work on coordination, which is great.</p><p>With the second one you work on strength, which is much better. At least right now, right in the month where we’re focusing on legato.</p><p>And yes, a strong left hand is essential for a good legato. Even the quietest pianos require a left hand pressing down very firmly.</p><p>Once, rehearsing for the Lucerne Festival, maestro Claudio Abbado told us:</p><p>“This piano should be thought of as a forte. A huge forte being played very, very far away.”</p><p>Anyway, that’s a whole other newsletter.</p><p>So: patterns, slurred, and let all the articulation come from the left hand.</p><p>Have you tried it? Almost every method book has them. You just have to try them slurred.</p>',
    'Un abrazo,
Emilse',
    'Not on my newsletter yet? Sign up <a href="#suscribete">here</a>. Signing up is free. So is unsubscribing.',
    'When you sign up you get a welcome email with a video. It’s an exercise where I explain one concept that’s going to change the way you produce sound. The video runs 4:04 and you almost certainly know the exercise — there isn’t a bass player alive who hasn’t practiced it. But 90% do it wrong, HA! Hardly anyone knows where that movement actually comes from. You won’t be in that 90% though. Not you. Not after you watch the video. You’ll have to let me know.',
    '',
    array['6e750001-0000-4000-8000-000000000012', '6e750001-0000-4000-8000-000000000013']::uuid[],
    '6e750001-0000-4000-8000-000000000001'::uuid,
    'How to build left hand strength on the double bass',
    'Slurred patterns: the exercise to build left hand strength and improve your legato on the double bass, from a Thomas Martin masterclass.',
    'In this email you’ll find a really important tip for improving your legato and getting more strength in your left hand.',
    (now() at time zone 'Europe/Madrid')::date,
    array['how-to-build-left-hand-strength-double-bass']::text[],
    now() - interval '3 seconds'),
  ('6e750001-0000-4000-8000-000000000012',
    'en',
    'how-to-use-vibrato-double-bass',
    'How to use vibrato on the double bass: where and when to vibrate',
    '<p>Today I’m bringing you an exercise. Homework, challenge, call it whatever you want — the goal is the same: to make you more aware of the vibrato you use. And of how you use it.</p><p>But first, let me tell you a story.</p><p>Talking with a colleague this week, he told me that no matter how much he studies vibrato, he can’t move forward. Well, he can, but he can’t.</p><p>Let me explain. According to him, the exercises keep coming out better and better.</p><p>But… when he puts it into practice in a piece, he doesn’t always know exactly where to vibrate or how.</p><p>Also, when he tries to sustain it, his hand gets really tense. I mean, he can vibrate a quarter note, a half note, but connecting several bars is super hard for him and his hand goes rigid.</p><p>I’ll talk about that last part <a href="/en/newsletters/double-bass-vibrato-tense-hand/">in the next email</a>. Today I’m focusing on the “I don’t know where to vibrate” part.</p><p>So, since I’m a freaky fan of giving advice nobody asks for, I told him:</p><p>“You don’t know where to vibrate because you don’t have the story in your head.”</p><p>If you have a phrase, you have a chance to say something. And when you decide what you want to say, you automatically know where to put the vibrato.</p><p>How do I know this?</p><p>Because when I was writing the script for <a href="/en/programs/vibrato-like-a-singer/">the course videos</a>, I sat down and thought for a looooong time about the exact moment it clicked for me. I remember my vibrato was really nervous, and I also remember that at some point it stopped being a problem.</p><p>It’s not like I became Emilse the super bassist, not at all. But vibrato was never a problem again, so I could use my practice time to solve other things.</p><p>And to know how to structure the course, I needed to pin down what made me take that step, so that vibrato became one of my tools for interpreting music and not a headache I couldn’t solve.</p><p>That’s how I found that moment. The click that changed everything. Which, by the way, isn’t an instant where some higher being enlightens you and pahh, from then on everything comes out beautiful. Nothing like that (I wish).</p><p>You simply change the way you see something, and with practice you make it yours.</p><p>So…</p><p>Thinking about the story automatically gives you the vibrato you use, and when you use it.</p><p>BEAU-TI-FUL.</p><p><strong>The exercise:</strong></p><p>Choose a phrase. Just one. Whichever you want. It can be a fragment of a piece you’re playing — and the rule is: the easier, the better. Any Suzuki piece would work for this. Easy, so you can focus on what you want to say instead of fighting with the notes.</p><p>This phrase, just one, 8 bars max: play it, record it, in 2 different versions, using only vibrato. That is, what makes them different is where you vibrate and, of course, how you vibrate.</p><p>This exercise is due yesterday!!!</p><p>Why? Because you need to understand that vibrato is your tool for telling something.</p><p>If you want to send me the videos, great. I’ll enjoy watching them. And if I have time during the week, I’ll probably give you feedback.</p>',
    'Un abrazo,
Emilse',
    'Not on my newsletter yet? Sign up <a href="#suscribete">here</a>. Signing up is free. So is unsubscribing.',
    'When you sign up you get a welcome email with a video. It’s an exercise where I explain one concept that’s going to change the way you produce sound. The video runs 4:04 and you almost certainly know the exercise — there isn’t a bass player alive who hasn’t practiced it. But 90% do it wrong, HA! Hardly anyone knows where that movement actually comes from. You won’t be in that 90% though. Not you. Not after you watch the video. You’ll have to let me know.',
    '',
    array['6e750001-0000-4000-8000-000000000013', '6e750001-0000-4000-8000-000000000011']::uuid[],
    '6e750001-0000-4000-8000-000000000002'::uuid,
    'How to use vibrato on the double bass: where to vibrate',
    'If you don’t know where to vibrate, it’s because you don’t have the story in your head. An 8-bar exercise to use double bass vibrato with intention.',
    'Today I’m bringing you an exercise. Homework, challenge, call it whatever you want — the goal is the same: to make you more aware of the vibrato you use. And of how you use it.',
    (now() at time zone 'Europe/Madrid')::date,
    array['types-of-vibrato-on-the-double-bass']::text[],
    now() - interval '2 seconds'),
  ('6e750001-0000-4000-8000-000000000013',
    'en',
    'double-bass-vibrato-tense-hand',
    'The most common mistake when learning vibrato on the double bass',
    '<p>“My vibrato comes out fine, but when I try to sustain it my hand gets tense, rigid.”</p><p>It’s happened to all of us, my friend, don’t worry.</p><p>In fact, I have a colleague who has spent years studying technique, vibrato specifically. He’s a YouTube video collector.</p><p>There’s a lot of information on that platform, and that’s good and not so good, heh? Even though you could find everything you need there to learn on your own, trying to organize the content so it fits your specific problem can take you a huge amount of time.</p><p>Anyway, this colleague has tons of information and exercises, and a long time practicing them, but he doesn’t see progress. Well, he does, he can vibrate now, but his hand goes rigid when he tries to connect phrases.</p><p>I mean, after several bars of vibrato the tension shows up and his vibrato gets nervous.</p><p>So nervous that it reaches a point where he can’t keep going. He freezes.</p><p>The reason those exercises don’t work for him isn’t that they’re bad. Like I said, there’s a ton of good information on that platform, great teachers giving great advice, but… they’re not watching you. Maybe that exercise isn’t for you.</p><p>In my colleague’s case, his problem comes from the foundation: how he positions himself with the instrument.</p><p>Your body is the support. If you forget this, you end up squeezing with your thumb.</p><p>Now, I’m here to remind you of the technique, because it’s the easiest thing to forget when you’re focused on vibrato.</p><p>It’s actually a chain:</p><ul><li>Basically, let the double bass come to us, not the other way around. Which brings me to…</li><li>The biggest support we have with the instrument is our body: the leg, the hip, if we play standing. For this, and only for this, I have to be honest and admit that (even though I don’t like it) sitting is easier. And that brings us to…</li><li>Don’t squeeze with the thumb. It’s just a small support.</li></ul><p>This is the key to avoiding tension in the hand (and therefore in the vibrato).</p><p>And when we think we have to keep the same vibrato all the way to the end, it’s harder to play relaxed. The body understands it as a mechanical, repetitive movement, and we end up sounding robotic. The trick is to focus on something else. But I’ll tell you about that <a href="#suscribete">in the next email</a>.</p>',
    'Un abrazo,
Emilse',
    'Not on my newsletter yet? Sign up <a href="#suscribete">here</a>. Signing up is free. So is unsubscribing.',
    'When you sign up you get a welcome email with a video. It’s an exercise where I explain one concept that’s going to change the way you produce sound. The video runs 4:04 and you almost certainly know the exercise — there isn’t a bass player alive who hasn’t practiced it. But 90% do it wrong, HA! Hardly anyone knows where that movement actually comes from. You won’t be in that 90% though. Not you. Not after you watch the video. You’ll have to let me know.',
    '',
    array['6e750001-0000-4000-8000-000000000012', '6e750001-0000-4000-8000-000000000011']::uuid[],
    '6e750001-0000-4000-8000-000000000003'::uuid,
    'Double bass vibrato: why your hand gets tense',
    'Your vibrato works, but when you sustain it your hand goes rigid. The most common mistake is in the foundation: how you hold the double bass.',
    '“My vibrato comes out fine, but when I try to sustain it my hand gets tense, rigid.” It’s happened to all of us, my friend, don’t worry.',
    (now() at time zone 'Europe/Madrid')::date,
    array['most-common-vibrato-mistake-double-bass']::text[],
    now() - interval '1 seconds')
on conflict (id) do nothing;

commit;

notify pgrst, 'reload schema';

-- Comprobación: tienen que salir 6 filas, 3 en cada idioma, la 3 primero.
select lang, fecha, slug, titulo
from public.newsletters
order by lang desc, fecha desc, created_at desc;
