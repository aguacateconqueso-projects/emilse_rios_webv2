-- =============================================================================
-- 0009 — Los cursos: lo que Emi arma desde su panel y las alumnas estudian.
--
-- Ejecutar en Supabase → SQL Editor, UNA vez, en el MISMO proyecto de la
-- academia (el que ya tiene 0001–0008, que viven en `emilse_rios_membresias`).
-- La numeración sigue la suya a propósito: es el mismo esquema.
--
-- ⚠️ ES SOLO ADITIVA. No toca ni una tabla, ni una función, ni una política de
--    la membresía —`profiles`, `subscriptions`, `exercises`, `has_active_sub()`
--    siguen exactamente igual—. Crea tablas nuevas, con nombres que no chocan
--    con nada, y sus reglas. La membresía que está cobrando no se entera.
--
-- ⚠️ ES IDEMPOTENTE. Se puede volver a pegar entera sin romper nada: todo va
--    con `if not exists`, `create or replace` o `drop … if exists` delante, y
--    los tipos con el envoltorio `exception when duplicate_object` (la lección
--    de la 0007, que no lo llevaba).
--
-- Lo que crea:
--
--   courses            el curso: nombre, línea de adentro, publicado o no
--   course_units       sus bloques («unidades»; Emi los titula como quiera)
--   course_lessons     las clases: video ES/EN de Bunny, texto, materiales
--   course_access      quién tiene cada curso (a mano, Stripe o PayPal)
--   course_progress    por dónde va cada alumna, clase a clase
--   course_questions   las dudas del hilo privado, con la respuesta de Emi
--   bucket «cursos»    los materiales (PDF, partituras, audios), PRIVADO
--
-- Quién ve qué, en una línea: **Emi (admin) lo ve y lo toca todo; una alumna
-- ve solo lo publicado de los cursos que tiene, y solo su propio avance y sus
-- propias dudas.** Lo decide la base de datos, no la pantalla.
-- =============================================================================

begin;

-- ---------------------------------------------------------------------------
-- La hora de la última edición, para que el panel pueda decir «editado hace…».
-- ---------------------------------------------------------------------------
create or replace function public.cursos_tocar()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- CURSOS
-- ---------------------------------------------------------------------------
create table if not exists public.courses (
  id          uuid primary key default gen_random_uuid(),
  -- La identidad del curso en todo el proyecto: la misma cadena que la ficha de
  -- Formaciones (`src/data/aula.ts`) y que la dirección del aula.
  slug        text not null unique
              check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title_es    text not null default '',
  title_en    text not null default '',
  -- La línea de ADENTRO («de qué va lo que compraste»), no la de la tienda.
  summary_es  text,
  summary_en  text,
  -- Borrador = solo lo ve Emi. Publicado = lo ve quien lo tiene.
  published   boolean not null default false,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists courses_tocar on public.courses;
create trigger courses_tocar before update on public.courses
  for each row execute function public.cursos_tocar();

-- ---------------------------------------------------------------------------
-- UNIDADES — el bloque que agrupa clases. En la pantalla no se llama «unidad»:
-- se llama como Emi lo titule («Nivel 1», «Antes de tocar una nota»…).
-- ---------------------------------------------------------------------------
create table if not exists public.course_units (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references public.courses(id) on delete cascade,
  title_es    text not null default '',
  title_en    text not null default '',
  position    integer not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists course_units_course_idx on public.course_units (course_id, position);

-- ---------------------------------------------------------------------------
-- CLASES
--
-- `course_id` va repetido aunque se pueda sacar de la unidad: es lo que deja
-- escribir las reglas de acceso sin un JOIN en cada consulta, y lo que permite
-- mover una clase de unidad sin perder de qué curso es.
--
-- `id` es la clave del PROGRESO. No se recalcula nunca: reordenar o mover una
-- clase no le cambia el avance a nadie.
-- ---------------------------------------------------------------------------
create table if not exists public.course_lessons (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references public.courses(id) on delete cascade,
  unit_id     uuid not null references public.course_units(id) on delete cascade,
  title_es    text not null default '',
  title_en    text not null default '',
  summary_es  text,
  summary_en  text,
  -- La URL limpia del reproductor de Bunny, ya normalizada por el panel
  -- (`src/lib/video.ts`). Una por idioma: Emi graba las dos.
  video_es    text,
  video_en    text,
  duration_s  integer check (duration_s is null or duration_s >= 0),
  -- [{ "id", "nombre_es", "nombre_en", "path" | "url", "lang": "es"|"en"|"ambos" }]
  -- `path` es la ruta en el bucket privado «cursos»; `url`, un enlace externo.
  materials   jsonb not null default '[]'::jsonb,
  -- Una clase en borrador no la ve nadie más que Emi, aunque el curso esté
  -- publicado. Sirve para ir subiendo sin enseñar la obra a medias.
  published   boolean not null default true,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists course_lessons_unit_idx on public.course_lessons (unit_id, position);
create index if not exists course_lessons_course_idx on public.course_lessons (course_id);

drop trigger if exists course_lessons_tocar on public.course_lessons;
create trigger course_lessons_tocar before update on public.course_lessons
  for each row execute function public.cursos_tocar();

-- ---------------------------------------------------------------------------
-- ACCESO — quién tiene cada curso.
--
-- Es la tabla de derechos de acceso de los cursos, y va separada de la de la
-- membresía a propósito: `has_active_sub()` es la puerta de algo que cobra
-- ahora mismo y no se toca de paso. Un curso se compra una vez y es para
-- siempre (`expires_at` nulo); el campo existe por si algún día hace falta.
-- ---------------------------------------------------------------------------
create table if not exists public.course_access (
  user_id     uuid not null references public.profiles(id) on delete cascade,
  course_id   uuid not null references public.courses(id) on delete cascade,
  source      text not null default 'manual'
              check (source in ('manual', 'stripe', 'paypal')),
  granted_at  timestamptz not null default now(),
  expires_at  timestamptz,
  primary key (user_id, course_id)
);
create index if not exists course_access_course_idx on public.course_access (course_id);

-- ---------------------------------------------------------------------------
-- PROGRESO — por dónde va cada alumna. Solo en los cursos: la membresía no se
-- «completa» (decidido el 31 ago 2026).
-- ---------------------------------------------------------------------------
create table if not exists public.course_progress (
  user_id     uuid not null references public.profiles(id) on delete cascade,
  lesson_id   uuid not null references public.course_lessons(id) on delete cascade,
  course_id   uuid not null references public.courses(id) on delete cascade,
  position_s  integer not null default 0 check (position_s >= 0),
  duration_s  integer not null default 0 check (duration_s >= 0),
  completed   boolean not null default false,
  updated_at  timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
create index if not exists course_progress_user_idx on public.course_progress (user_id, updated_at desc);

-- ---------------------------------------------------------------------------
-- DUDAS — el hilo privado entre cada alumna y Emi, por curso.
-- La pregunta viaja con la clase y el minuto pegados: lo que Emi necesita para
-- responder sin preguntar «¿dónde?».
-- ---------------------------------------------------------------------------
create table if not exists public.course_questions (
  id           uuid primary key default gen_random_uuid(),
  course_id    uuid not null references public.courses(id) on delete cascade,
  lesson_id    uuid references public.course_lessons(id) on delete set null,
  user_id      uuid not null references public.profiles(id) on delete cascade,
  -- «Nombre I.» como en el foro de la membresía: la alumna no puede leer
  -- perfiles ajenos, así que el nombre a mostrar viaja en la fila.
  author_name  text,
  minute_s     integer check (minute_s is null or minute_s >= 0),
  body         text not null check (length(btrim(body)) > 0),
  answer       text,
  answered_at  timestamptz,
  created_at   timestamptz not null default now()
);
create index if not exists course_questions_course_idx on public.course_questions (course_id, created_at);
create index if not exists course_questions_pending_idx on public.course_questions (answered_at) where answered_at is null;

-- =============================================================================
-- FUNCIONES (SECURITY DEFINER, como `is_admin()`: evitan recursión de RLS)
-- =============================================================================

-- ¿Tiene la persona de la sesión este curso?
create or replace function public.has_course(c uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from course_access
    where user_id = auth.uid()
      and course_id = c
      and (expires_at is null or expires_at > now())
  );
$$;

-- ¿Puede leer este fichero del bucket «cursos»? La primera carpeta de la ruta
-- es el id del curso: `<course_id>/<lesson_id>/<fichero>`. Se comprueba la
-- forma antes de convertirla, para que un nombre raro dé «no» y no un error.
create or replace function public.can_read_course_file(object_name text)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare
  carpeta text := split_part(object_name, '/', 1);
begin
  if carpeta !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' then
    return false;
  end if;
  return public.has_course(carpeta::uuid);
end;
$$;

-- Reordenar un curso entero de una vez: el orden de las unidades y, dentro de
-- cada una, el de sus clases (que pueden venir de otra unidad: así se mueve una
-- clase de sitio). Una sola llamada y una sola transacción, para que un corte
-- de red a mitad no deje la mitad de las clases con el orden viejo.
--
--   p_orden = [ { "unit": "<uuid>", "lessons": ["<uuid>", …] }, … ]
--
-- SECURITY INVOKER: corre con los permisos de quien llama, así que la RLS
-- decide. Solo un admin puede tocar estas filas.
create or replace function public.course_reorder(p_course uuid, p_orden jsonb)
returns void language plpgsql security invoker set search_path = public as $$
declare
  bloque jsonb;
  clase  text;
  i int := 0;
  j int;
begin
  if not public.is_admin() then
    raise exception 'Solo el panel puede reordenar un curso.' using errcode = '42501';
  end if;
  for bloque in select * from jsonb_array_elements(p_orden) loop
    update course_units set position = i
      where id = (bloque->>'unit')::uuid and course_id = p_course;
    j := 0;
    for clase in select * from jsonb_array_elements_text(coalesce(bloque->'lessons', '[]'::jsonb)) loop
      update course_lessons
        set position = j, unit_id = (bloque->>'unit')::uuid
        where id = clase::uuid and course_id = p_course;
      j := j + 1;
    end loop;
    i := i + 1;
  end loop;
end;
$$;

-- =============================================================================
-- RLS
-- =============================================================================
alter table public.courses          enable row level security;
alter table public.course_units     enable row level security;
alter table public.course_lessons   enable row level security;
alter table public.course_access    enable row level security;
alter table public.course_progress  enable row level security;
alter table public.course_questions enable row level security;

-- ---- courses ----
drop policy if exists "courses: admin all" on public.courses;
drop policy if exists "courses: student read" on public.courses;
create policy "courses: admin all" on public.courses
  for all using (is_admin()) with check (is_admin());
create policy "courses: student read" on public.courses
  for select using (published and has_course(id));

-- ---- course_units ----
drop policy if exists "units: admin all" on public.course_units;
drop policy if exists "units: student read" on public.course_units;
create policy "units: admin all" on public.course_units
  for all using (is_admin()) with check (is_admin());
create policy "units: student read" on public.course_units
  for select using (
    has_course(course_id)
    and exists (select 1 from courses c where c.id = course_units.course_id and c.published)
  );

-- ---- course_lessons ----
drop policy if exists "lessons: admin all" on public.course_lessons;
drop policy if exists "lessons: student read" on public.course_lessons;
create policy "lessons: admin all" on public.course_lessons
  for all using (is_admin()) with check (is_admin());
create policy "lessons: student read" on public.course_lessons
  for select using (
    published
    and has_course(course_id)
    and exists (select 1 from courses c where c.id = course_lessons.course_id and c.published)
  );

-- ---- course_access ----
-- La alumna ve sus propias filas (para saber qué cursos tiene). Dar y quitar
-- acceso es cosa del panel (admin) o del webhook (service_role, que no pasa por
-- acá).
drop policy if exists "access: admin all" on public.course_access;
drop policy if exists "access: self read" on public.course_access;
create policy "access: admin all" on public.course_access
  for all using (is_admin()) with check (is_admin());
create policy "access: self read" on public.course_access
  for select using (user_id = auth.uid());

-- ---- course_progress ----
-- Cada quien escribe el suyo, y solo de cursos que tiene. Emi lo lee todo.
drop policy if exists "progress: self all" on public.course_progress;
drop policy if exists "progress: admin read" on public.course_progress;
create policy "progress: self all" on public.course_progress
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid() and (has_course(course_id) or is_admin()));
create policy "progress: admin read" on public.course_progress
  for select using (is_admin());

-- ---- course_questions ----
-- La alumna escribe y lee las suyas. Responder es cosa de Emi: la alumna no
-- puede escribir `answer` porque no tiene política de UPDATE.
drop policy if exists "cq: admin all" on public.course_questions;
drop policy if exists "cq: self read" on public.course_questions;
drop policy if exists "cq: self insert" on public.course_questions;
drop policy if exists "cq: self delete pending" on public.course_questions;
create policy "cq: admin all" on public.course_questions
  for all using (is_admin()) with check (is_admin());
create policy "cq: self read" on public.course_questions
  for select using (user_id = auth.uid());
create policy "cq: self insert" on public.course_questions
  for insert with check (
    user_id = auth.uid()
    and has_course(course_id)
    and answer is null
    and answered_at is null
  );
-- Puede retirar una pregunta mientras Emi no la haya contestado.
create policy "cq: self delete pending" on public.course_questions
  for delete using (user_id = auth.uid() and answered_at is null);

-- =============================================================================
-- STORAGE — bucket PRIVADO «cursos»
--
-- Al revés que «pdfs» (el de la membresía, público), este es privado: lo que
-- hay dentro es material de pago. El aula no enlaza el fichero: le pide a
-- Supabase un enlace firmado que caduca, y Supabase solo lo da si esta política
-- dice que sí.
-- =============================================================================
insert into storage.buckets (id, name, public)
values ('cursos', 'cursos', false)
on conflict (id) do update set public = false;

drop policy if exists "cursos: admin insert" on storage.objects;
drop policy if exists "cursos: admin update" on storage.objects;
drop policy if exists "cursos: admin delete" on storage.objects;
drop policy if exists "cursos: read" on storage.objects;

create policy "cursos: admin insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'cursos' and public.is_admin());

create policy "cursos: admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'cursos' and public.is_admin())
  with check (bucket_id = 'cursos' and public.is_admin());

create policy "cursos: admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'cursos' and public.is_admin());

create policy "cursos: read" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'cursos'
    and (public.is_admin() or public.can_read_course_file(name))
  );

commit;

-- La caché de esquema de PostgREST no ve las tablas nuevas hasta que relee
-- (si no, el panel da PGRST205/PGRST204). Ver el incidente de la 0005.
notify pgrst, 'reload schema';
