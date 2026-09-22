-- =============================================================================
-- Quién es admin, y (opcional) un alumno de prueba.
--
-- Ejecutar en Supabase → SQL Editor. Es idempotente: se puede correr las veces
-- que haga falta y deja siempre el mismo resultado.
--
-- Traído de `emilse_rios_membresias` el 22 sep 2026, al conectar el aula.
-- `progreso.md` lo venía citando como `supabase/set_admin.sql` desde la capa A
-- pero el fichero vivía SOLO en el repo de la academia, así que el paso de los
-- admins estaba escrito y no se podía dar. Ahora vive acá, que es donde está el
-- aula.
--
-- ⚠️ **NO crea nada.** Las tablas, el trigger y las funciones ya existen en el
--    proyecto de Supabase —son las migraciones de la academia, el mismo
--    proyecto—. Esto solo cambia filas.
--
-- ⚠️ **ANTES de ejecutarlo, cada admin tiene que haber entrado una vez** por
--    `/aulavirtual/entrar/` con su correo: el perfil se crea en ese momento, no
--    antes. Si falta alguno, el script ABORTA sin tocar nada — así nadie pierde
--    el admin por un typo o por un inicio de sesión pendiente.
-- =============================================================================

do $$
declare
  -- Los correos con acceso al panel, en minúsculas. Para sumar o quitar a
  -- alguien se edita SOLO esta lista y se vuelve a ejecutar.
  admin_emails constant text[] := array[
    'emilserios.bass@gmail.com',   -- Emi
    'adrianmendozam@gmail.com'     -- Adrián (apoyo)
  ];

  -- El alumno de prueba. **VACÍO por defecto, y a propósito.**
  --
  -- Si se pone un correo acá, este script le REGALA una membresía de 30 días
  -- para poder probar el aula por dentro. Es exactamente lo que hace falta para
  -- comprobar el candado de pago —entrar como alguien que sí tiene acceso, sin
  -- pasar por Stripe— y exactamente lo que NO se quiere dejar puesto por
  -- descuido: es una suscripción de verdad en la tabla de verdad.
  --
  -- Costumbre sana: se rellena, se prueba, y se vuelve a vaciar.
  tester_email constant text := '';

  missing text;
begin
  -- 0) Todos los admins tienen que tener perfil. Si falta alguno, abortar.
  select string_agg(e, ', ') into missing
  from unnest(admin_emails) e
  where not exists (select 1 from public.profiles p where lower(p.email) = lower(e));
  if missing is not null then
    raise exception 'Sin perfil (tienen que entrar una vez por /aulavirtual/entrar/ antes): %', missing;
  end if;

  -- 1) Los correos de la lista pasan a admin.
  update public.profiles set role = 'admin'
  where lower(email) = any (admin_emails);

  -- 2) Cualquier OTRO admin baja a miembro: al panel entra solo la lista de
  --    arriba. La RLS impide que un miembro se ascienda solo.
  update public.profiles set role = 'member'
  where role = 'admin' and lower(email) <> all (admin_emails);

  -- 3) El alumno de prueba, si se puso uno: suscripción activa de 30 días, y
  --    solo si no tiene ya una vigente.
  if tester_email <> '' then
    insert into public.subscriptions (user_id, status, tier, current_period_end)
    select p.id, 'active', 'founder_57', now() + interval '30 days'
    from public.profiles p
    where lower(p.email) = lower(tester_email)
      and not exists (
        select 1 from public.subscriptions s
        where s.user_id = p.id
          and s.status = 'active'
          and (s.current_period_end is null or s.current_period_end > now())
      );
  end if;
end $$;

-- Comprobación: Emi y Adrián como admin, el resto como member.
select email, role, created_at
from public.profiles
order by (role = 'admin') desc, created_at;
