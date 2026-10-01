-- =============================================================================
-- 0012 — Los avisos por correo de las preguntas y las respuestas
--
-- Ejecutar en Supabase → SQL Editor, UNA vez. Mismo proyecto de siempre; la
-- numeración sigue la de las migraciones anteriores.
--
-- Desde el 1 oct 2026 (pedido de Adrián), cuando alguien pregunta —en la
-- membresía o en un curso— le llega un correo a Emi, y cuando Emi responde le
-- llega uno a quien preguntó. Los manda `/api/avisos` (ver `src/lib/avisos.ts`
-- y `src/pages/api/avisos.ts`), por Resend.
--
-- Esta migración solo apunta **cuándo salió cada aviso**, para que nunca salga
-- dos veces: el servidor marca la fila ANTES de mandar, con un
-- `update … where aviso_at is null`, y si la fila ya estaba marcada no manda
-- nada. Así un doble clic, una pestaña recargada o alguien llamando a la ruta
-- a mano no le llenan el buzón a nadie.
--
--   questions          + aviso_at             la pregunta, avisada a Emi
--   answers            + aviso_at             la respuesta, avisada al miembro
--   course_questions   + aviso_at             la pregunta, avisada a Emi
--                      + aviso_respuesta_at   la respuesta, avisada a la alumna
--
-- Las columnas las escribe solo el servidor, con la `service_role`. No hacen
-- falta políticas nuevas: nadie más las necesita.
--
-- **Sin esta migración los avisos igual salen**, con una regla más floja: solo
-- si la pregunta o la respuesta tiene menos de diez minutos.
--
-- ⚠️ SOLO ADITIVA E IDEMPOTENTE. Se puede volver a pegar entera.
-- =============================================================================

begin;

alter table public.questions        add column if not exists aviso_at timestamptz;
alter table public.answers          add column if not exists aviso_at timestamptz;
alter table public.course_questions add column if not exists aviso_at timestamptz;
alter table public.course_questions add column if not exists aviso_respuesta_at timestamptz;

-- Lo que ya existe no se avisa: el correo es para lo que entre de hoy en
-- adelante, no para las preguntas y respuestas de antes.
update public.questions        set aviso_at = created_at where aviso_at is null;
update public.answers          set aviso_at = created_at where aviso_at is null;
update public.course_questions set aviso_at = created_at where aviso_at is null;
update public.course_questions set aviso_respuesta_at = answered_at
 where aviso_respuesta_at is null and answered_at is not null;

commit;

notify pgrst, 'reload schema';

-- Comprobación: tienen que salir las cuatro columnas.
select table_name, column_name
from information_schema.columns
where table_schema = 'public'
  and column_name in ('aviso_at', 'aviso_respuesta_at')
order by table_name, column_name;
