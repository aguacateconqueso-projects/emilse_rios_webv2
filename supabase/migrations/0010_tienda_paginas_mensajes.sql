-- =============================================================================
-- 0010 — La tienda, las páginas de ventas y las respuestas de Emi.
--
-- Ejecutar en Supabase → SQL Editor, UNA vez, DESPUÉS de la 0009. Mismo
-- proyecto de la academia; la numeración sigue la suya.
--
-- ⚠️ SOLO ADITIVA E IDEMPOTENTE, como la 0009. No toca la membresía: ni
--    `profiles`, ni `subscriptions`, ni `exercises`, ni sus reglas. Crea tablas
--    nuevas, añade columnas a `course_questions` (de la 0009) y reescribe una
--    función de la 0009, `can_read_course_file()`, para que las respuestas en
--    audio de Emi solo las pueda oír la alumna que preguntó.
--
-- Lo que crea:
--
--   products            lo que se ve en Formaciones: estado, precio, foto,
--                       orden. Lo maneja Emi desde la pestaña Tienda
--   sales_pages         la página de ventas PUBLICADA de cada producto (lo
--                       que lee la web)
--   sales_page_drafts   el BORRADOR de cada página (solo lo ve Emi). Publicar
--                       es copiar el borrador a `sales_pages`
--   bucket «tienda»     las fotos de las fichas, PÚBLICO: salen en la web
--   course_questions    + answer_video, answer_audio_path, answer_seen_at
--   marcar_respuestas_vistas(curso)   la alumna marca que ya leyó
-- =============================================================================

begin;

-- ---------------------------------------------------------------------------
-- PRODUCTOS — las fichas de Formaciones.
--
-- Mientras esta tabla esté VACÍA, la web sigue enseñando el catálogo escrito
-- en el código (`src/data/aula.ts`). En cuanto Emi importa ese catálogo desde
-- la pestaña Tienda —o crea el primer producto—, manda la base de datos.
--
-- Los cuatro estados (decididos el 19 sep 2026):
--   borrador      no se ve en ninguna parte
--   proximamente  se ve, su botón es «Avísame cuando abra»
--   venta         se ve y se compra
--   cerrado       se ve, no se compra; quien ya lo tiene, lo sigue teniendo
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  slug          text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  tipo          text not null default 'curso' check (tipo in ('membresia', 'curso')),
  estado        text not null default 'borrador'
                check (estado in ('borrador', 'proximamente', 'venta', 'cerrado')),
  position      integer not null default 0,
  -- El número al margen de la ficha («01»). Se escribe, no se calcula.
  num           text,
  nombre_es     text not null default '',
  nombre_en     text not null default '',
  resumen_es    text,
  resumen_en    text,
  precio_es     text,
  precio_en     text,
  cadencia_es   text,
  cadencia_en   text,
  -- La foto: una URL pública (del bucket «tienda» o de la propia web).
  foto_url      text,
  foto_alt_es   text,
  foto_alt_en   text,
  -- El curso del aula que abre comprar esto (para dar acceso al pagar).
  course_id     uuid references public.courses(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

drop trigger if exists products_tocar on public.products;
create trigger products_tocar before update on public.products
  for each row execute function public.cursos_tocar();

-- ¿Manda ya la base de datos? Es decir: ¿hay algún producto, aunque sea en
-- borrador? La web no puede contestarlo con una consulta normal, porque sin
-- sesión no ve los borradores: si Emi pusiera todo en borrador, la web creería
-- que la tabla está vacía y volvería a enseñar el catálogo del código.
create or replace function public.tienda_en_bd()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from products);
$$;

-- ---------------------------------------------------------------------------
-- PÁGINAS DE VENTAS — publicada y borrador, en dos tablas.
--
-- Dos tablas y no una con dos columnas: la web lee sin sesión, y la RLS decide
-- por FILAS, no por columnas. Con una sola tabla, quien pudiera leer la versión
-- publicada podría leer también el borrador a medio escribir.
--
-- `carta` es `{ "es": Carta, "en": Carta }`, la misma forma que el tipo
-- `Carta` de `src/data/cartas.ts`: lo que Emi edita es exactamente lo que la
-- web ya sabe pintar.
-- ---------------------------------------------------------------------------
create table if not exists public.sales_pages (
  slug          text primary key references public.products(slug)
                on update cascade on delete cascade,
  carta         jsonb not null,
  published_at  timestamptz not null default now()
);

create table if not exists public.sales_page_drafts (
  slug          text primary key references public.products(slug)
                on update cascade on delete cascade,
  carta         jsonb not null,
  updated_at    timestamptz not null default now()
);

-- La hora de publicar la pone la base de datos, no el navegador: el panel
-- compara «borrador guardado» con «publicada» para decir si hay cambios sin
-- publicar, y las dos horas tienen que salir del mismo reloj.
create or replace function public.paginas_publicar()
returns trigger language plpgsql as $$
begin
  new.published_at := now();
  return new;
end;
$$;

drop trigger if exists sales_pages_publicar on public.sales_pages;
create trigger sales_pages_publicar before insert or update on public.sales_pages
  for each row execute function public.paginas_publicar();

drop trigger if exists sales_page_drafts_tocar on public.sales_page_drafts;
create trigger sales_page_drafts_tocar before update on public.sales_page_drafts
  for each row execute function public.cursos_tocar();

-- ---------------------------------------------------------------------------
-- LAS RESPUESTAS DE EMI, con video y audio (decidido el 31 ago 2026: «en el
-- hilo de un curso Emi puede responder con video y con audio»).
-- ---------------------------------------------------------------------------
alter table public.course_questions add column if not exists answer_video text;
alter table public.course_questions add column if not exists answer_audio_path text;
alter table public.course_questions add column if not exists answer_seen_at timestamptz;

-- La alumna marca como vistas las respuestas de un curso al abrir su hilo.
-- Función y no política de UPDATE: con una política podría reescribir su
-- pregunta, o la respuesta de Emi. Esto toca una columna y nada más.
create or replace function public.marcar_respuestas_vistas(c uuid)
returns void language sql security definer set search_path = public as $$
  update course_questions
     set answer_seen_at = now()
   where user_id = auth.uid()
     and course_id = c
     and answered_at is not null
     and answer_seen_at is null;
$$;

-- Los ficheros del bucket «cursos»: `<curso>/<clase>/<fichero>` los lee quien
-- tiene el curso, como en la 0009. Las respuestas en audio van a
-- `<curso>/respuestas/<alumna>/<fichero>` y **solo las oye la alumna que
-- preguntó** (y Emi, por su propia política).
create or replace function public.can_read_course_file(object_name text)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare
  carpeta text := split_part(object_name, '/', 1);
begin
  if carpeta !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' then
    return false;
  end if;
  if split_part(object_name, '/', 2) = 'respuestas' then
    return split_part(object_name, '/', 3) = auth.uid()::text
       and public.has_course(carpeta::uuid);
  end if;
  return public.has_course(carpeta::uuid);
end;
$$;

-- =============================================================================
-- RLS
-- =============================================================================
alter table public.products          enable row level security;
alter table public.sales_pages       enable row level security;
alter table public.sales_page_drafts enable row level security;

-- ---- products: la web lee lo que no es borrador; Emi, todo ----
drop policy if exists "products: public read" on public.products;
drop policy if exists "products: admin all" on public.products;
create policy "products: public read" on public.products
  for select using (estado <> 'borrador');
create policy "products: admin all" on public.products
  for all using (is_admin()) with check (is_admin());

-- ---- sales_pages: la versión publicada la lee cualquiera ----
drop policy if exists "sales_pages: public read" on public.sales_pages;
drop policy if exists "sales_pages: admin all" on public.sales_pages;
create policy "sales_pages: public read" on public.sales_pages
  for select using (
    exists (select 1 from products p where p.slug = sales_pages.slug and p.estado <> 'borrador')
  );
create policy "sales_pages: admin all" on public.sales_pages
  for all using (is_admin()) with check (is_admin());

-- ---- sales_page_drafts: solo Emi ----
drop policy if exists "drafts: admin all" on public.sales_page_drafts;
create policy "drafts: admin all" on public.sales_page_drafts
  for all using (is_admin()) with check (is_admin());

-- =============================================================================
-- STORAGE — bucket PÚBLICO «tienda», para las fotos de las fichas
-- =============================================================================
insert into storage.buckets (id, name, public)
values ('tienda', 'tienda', true)
on conflict (id) do update set public = true;

drop policy if exists "tienda: admin insert" on storage.objects;
drop policy if exists "tienda: admin update" on storage.objects;
drop policy if exists "tienda: admin delete" on storage.objects;

create policy "tienda: admin insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'tienda' and public.is_admin());

create policy "tienda: admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'tienda' and public.is_admin())
  with check (bucket_id = 'tienda' and public.is_admin());

create policy "tienda: admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'tienda' and public.is_admin());

commit;

notify pgrst, 'reload schema';
