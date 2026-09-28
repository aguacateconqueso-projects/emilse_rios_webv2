-- =============================================================================
-- 0011 — Las preguntas de la membresía, privadas (1:1 con Emi)
--
-- Ejecutar en Supabase → SQL Editor, UNA vez. Mismo proyecto de siempre; la
-- numeración sigue la de las migraciones anteriores.
--
-- Hasta el 28 sep 2026 las preguntas de la membresía eran un FORO: cualquier
-- miembro con la suscripción al día leía todas las preguntas del ejercicio
-- vigente, con sus respuestas (migración 0004 de la academia). Emi lo quiso
-- 1:1, como el hilo de los cursos: **cada miembro ve solo sus preguntas y las
-- respuestas a ellas**. Emi (admin) sigue viéndolo todo y respondiendo desde
-- el panel → Mensajes: sus políticas «admin all» no se tocan.
--
-- Lo que cambia, y nada más:
--   · questions: la lectura de un miembro pasa de «todas las del ejercicio
--     vigente» a «las mías», de cualquier semana. Así una respuesta que llega
--     después de que cambió el ejercicio no se pierde.
--   · answers: la lectura de un miembro, solo las de sus preguntas. (Ya lo
--     heredaba de la política de questions; se escribe explícita para que no
--     dependa de eso.)
--
-- Escribir no cambia: un miembro con la suscripción al día pregunta sobre su
-- propia fila («questions: member write», de la 0002).
--
-- ⚠️ Afecta también a lo que ya existe: las preguntas que hasta hoy eran
-- públicas pasan a verlas solo su autora y Emi. Es lo que se quiere.
--
-- Idempotente: se puede volver a pegar entera.
-- =============================================================================

begin;

drop policy if exists "questions: member read" on public.questions;
create policy "questions: member read" on public.questions for select using (
  user_id = auth.uid()
);

drop policy if exists "answers: member read" on public.answers;
create policy "answers: member read" on public.answers for select using (
  exists (
    select 1 from public.questions q
    where q.id = answers.question_id
      and q.user_id = auth.uid()
  )
);

commit;

notify pgrst, 'reload schema';

-- Comprobación: tienen que salir las dos políticas nuevas, más las de Emi.
select tablename, policyname, cmd
from pg_policies
where schemaname = 'public' and tablename in ('questions', 'answers')
order by tablename, policyname;
