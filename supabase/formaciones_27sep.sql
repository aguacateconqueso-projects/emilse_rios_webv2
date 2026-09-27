-- =============================================================================
-- Formaciones, 27 sep 2026: los textos de las portadas de Emi, «Todas las
-- escalas» con ficha propia y las clases online.
--
-- Ejecutar en Supabase → SQL Editor, en el proyecto de siempre. Es idempotente:
-- se puede volver a pegar entera y deja siempre lo mismo.
--
-- Por qué hace falta: desde que se importó el catálogo en el panel (24 sep),
-- **Formaciones lee las fichas de la tabla `products`, no del código**. El
-- código (`src/data/aula.ts`) tiene ya estos mismos textos, pero solo se ve si
-- la base de datos no contesta. Esto pone la tabla igual que el código.
--
-- Lo que toca, y nada más:
--   · el texto de la ficha (`resumen_*`) de las cuatro que ya estaban;
--   · el nombre en inglés de la membresía («Let’s Study Together»);
--   · el número y el orden de las seis;
--   · y crea «Todas las escalas» y «Clases online», las dos «Próximamente».
-- No toca el estado, el precio ni la foto de las que ya estaban: si Emi los
-- cambió desde la Tienda, se quedan como ella los dejó.
--
-- Las fotos de las dos nuevas son ficheros públicos de la web
-- (`public/fotos/`). La de «Todas las escalas» es provisional; Emi la cambia
-- desde la Tienda cuando tenga la suya.
-- =============================================================================

begin;

update public.products set
  position = 0, num = '01',
  nombre_en = 'Let’s Study Together',
  resumen_es = 'El problema no es que no tengas tiempo. Es que no sabes qué hacer con los 30 minutos que sí tienes.',
  resumen_en = 'The problem is not that you don’t have time. It’s that you don’t know what to do with the 30 minutes you do have.'
where slug = 'estudiemos-juntos';

update public.products set
  position = 1, num = '02',
  resumen_es = 'De posición 1 al pulgar, sin miedo. En realidad son dos formaciones: incluye el curso completo «Todas las escalas (sin aburrirte)». Si eres de los que piensan «ayy noo» al ver la clave de sol, esta formación es para ti.',
  resumen_en = 'From position 1 to thumb, no fear! It’s actually two programs: it includes the full course “All the scales (without getting bored)”. If you see a treble clef and think “oh no…”, this program is for you.'
where slug = 'todo-el-diapason';

update public.products set
  position = 3, num = '04',
  resumen_es = 'Una guía clara y práctica para comenzar. ¿Cuántos meses de ejercicios técnicos hay que aguantar antes de tocar tu primera obra? ¡Ninguno!',
  resumen_en = 'A clear and practical guide to begin. How many months of technical exercises do you have to sit through before your first piece? None!'
where slug = 'contrabajo-desde-cero';

update public.products set
  position = 4, num = '05',
  resumen_es = 'El vibrato es la herramienta más poderosa que tienes para expresarte a través del contrabajo.',
  resumen_en = 'Vibrato is the most powerful tool you have to express yourself through the double bass.'
where slug = 'tu-vibrato-como-un-cantante';

insert into public.products
  (slug, tipo, estado, position, num,
   nombre_es, nombre_en, resumen_es, resumen_en,
   foto_url, foto_alt_es, foto_alt_en)
values
  ('todas-las-escalas', 'curso', 'proximamente', 2, '03',
   'Todas las escalas (sin aburrirte)', 'All the scales (without getting bored)',
   'Las escalas no son aburridas, la manera en la que las estudias, sí.',
   'Scales aren’t boring. The way you study them is.',
   '/fotos/todas-las-escalas.webp',
   'Emilse Ríos con su contrabajo delante de una puerta de madera, en Madrid',
   'Emilse Ríos with her double bass in front of a wooden door, in Madrid'),
  ('clases-online', 'curso', 'proximamente', 5, '06',
   'Clases online', 'Online lessons',
   'El talento no existe. No como te lo vendieron. No es un don mágico que algunos tienen y otros no.',
   'The talent doesn’t exist. Not the way they sold it to you. It’s not a magical gift that some people have and others don’t.',
   '/fotos/clases-online.webp',
   'Emilse Ríos en una calle con árboles, abrazada a su contrabajo',
   'Emilse Ríos on a tree-lined street, hugging her double bass')
on conflict (slug) do update set
  position = excluded.position,
  num = excluded.num,
  nombre_es = excluded.nombre_es,
  nombre_en = excluded.nombre_en,
  resumen_es = excluded.resumen_es,
  resumen_en = excluded.resumen_en;

commit;

-- Comprobación: tienen que salir las seis, del 01 al 06, en este orden.
select num, slug, estado, nombre_es
from public.products
order by position, created_at;
