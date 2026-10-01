import type { APIRoute } from 'astro';
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabaseAdmin, usuarioDeLaPeticion } from '../../lib/supabase-admin';
import { siteOrigin } from '../../lib/stripe';
import {
  AVISOS_A,
  RESPONDER_A,
  correoPreguntaNueva,
  correoRespuesta,
  hayResend,
  mandarCorreo,
} from '../../lib/correo';
import { cursoHref, membresiaPath } from '../../i18n/aula';
import { catalogo } from '../../data/aula';

/**
 * Los avisos por correo de las preguntas (1 oct 2026, pedido de Adrián).
 *
 *   POST /api/avisos   { tipo: 'pregunta' | 'respuesta', tabla: 'foro' | 'curso', id }
 *
 * - **`pregunta`**: alguien acaba de preguntar —en la membresía (`foro`, una
 *   fila de `questions`) o en un curso (`curso`, una de `course_questions`)—
 *   y le llega un correo a Emi con la pregunta y el enlace a esa conversación
 *   en el panel. Solo la puede pedir **quien hizo la pregunta**.
 * - **`respuesta`**: Emi acaba de responder y le llega un correo a quien
 *   preguntó, en su idioma y en la voz de Emi. Solo la puede pedir **un
 *   admin**. En el foro, `id` es la fila de `answers` (cada respuesta nueva
 *   avisa); en un curso, la de `course_questions` (avisa la primera vez, no
 *   cuando Emi cambia la respuesta).
 *
 * La llaman el aula y el panel **justo después de guardar** (ver
 * `src/lib/avisos.ts`). Las preguntas y respuestas se siguen guardando directo
 * contra Supabase, como siempre: si esto falla, lo guardado no se pierde, solo
 * no sale el correo, y queda en los logs de Vercel con `[avisos]`.
 *
 * **Nunca avisa dos veces lo mismo**: antes de mandar, marca la fila
 * (`aviso_at`, migración 0012) con un `update … where aviso_at is null`; si ya
 * estaba marcada, no manda. Sin la migración, la regla es más floja: solo si
 * lo avisado tiene menos de diez minutos.
 *
 * Sin `RESEND_API_KEY` no manda nada y lo dice (las vistas previas no la
 * tienen: solo está en Production).
 */
export const prerender = false;

const json = (cuerpo: unknown, status = 200) =>
  new Response(JSON.stringify(cuerpo), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

type Resultado = { status: number; cuerpo: Record<string, unknown> };
const ok = (enviado: boolean, motivo?: string): Resultado => ({ status: 200, cuerpo: { enviado, ...(motivo ? { motivo } : {}) } });
const no = (status: number, error: string): Resultado => ({ status, cuerpo: { error } });

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DIEZ_MIN = 10 * 60 * 1000;
const reciente = (iso: string | null | undefined) => Boolean(iso) && Date.now() - Date.parse(iso!) < DIEZ_MIN;

/** Los cursos con página propia; los demás se abren con `?c=`. */
const conPagina = catalogo.filter((p) => p.tipo === 'curso').map((p) => p.slug);

const reloj = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const primerNombre = (s: string | null | undefined) => s?.trim().split(/\s+/)[0] || null;

/**
 * Marca la fila como avisada. `true` si es esta llamada la que tiene que
 * mandar el correo. Sin la columna (migración 0012 sin pegar), decide por la
 * fecha de lo avisado.
 */
async function reclamar(
  admin: SupabaseClient,
  tabla: string,
  columna: string,
  id: string,
  fecha: string | null | undefined,
): Promise<boolean> {
  const { data, error } = await admin
    .from(tabla)
    .update({ [columna]: new Date().toISOString() })
    .eq('id', id)
    .is(columna, null)
    .select('id');
  if (!error) return (data?.length ?? 0) > 0;
  if (error.message.includes(columna)) return reciente(fecha);
  console.error(`[avisos] no se pudo marcar ${tabla}.${columna}`, error.message);
  return false;
}

/** Si el correo no salió, se quita la marca: el aviso no se dio. */
async function soltar(admin: SupabaseClient, tabla: string, columna: string, id: string) {
  const { error } = await admin.from(tabla).update({ [columna]: null }).eq('id', id);
  if (error && !error.message.includes(columna)) console.error(`[avisos] no se pudo soltar ${tabla}.${columna}`, error.message);
}

/* ==========================================================================
   Una pregunta nueva → a Emi
   ========================================================================== */

async function avisarPregunta(admin: SupabaseClient, uid: string, tabla: 'foro' | 'curso', id: string, origen: string): Promise<Resultado> {
  let fila: any;
  let donde: string;
  let detalle: string[];
  if (tabla === 'foro') {
    const { data, error } = await admin
      .from('questions')
      .select('id, user_id, body, lang, created_at, author_name, exercises(title_es, week_label), profiles(email, full_name)')
      .eq('id', id)
      .maybeSingle();
    if (error) console.error('[avisos] no se pudo leer la pregunta', error.message);
    if (!data) return no(404, 'no_existe');
    fila = data;
    const ex = fila.exercises ?? {};
    donde = 'Membresía';
    detalle = [
      [ex.week_label, ex.title_es].filter(Boolean).join(' · '),
      fila.lang === 'en' ? 'Preguntó en inglés' : '',
    ].filter(Boolean);
  } else {
    const { data, error } = await admin
      .from('course_questions')
      .select('id, user_id, body, minute_s, created_at, author_name, courses(title_es, slug), course_lessons(title_es), profiles(email, full_name)')
      .eq('id', id)
      .maybeSingle();
    if (error) console.error('[avisos] no se pudo leer la pregunta del curso', error.message);
    if (!data) return no(404, 'no_existe');
    fila = data;
    donde = `Curso «${fila.courses?.title_es || fila.courses?.slug || 'sin título'}»`;
    detalle = [
      fila.course_lessons?.title_es ? `Clase: ${fila.course_lessons.title_es}` : '',
      fila.minute_s != null ? `En el minuto ${reloj(fila.minute_s)}` : '',
    ].filter(Boolean);
  }
  if (fila.user_id !== uid) return no(403, 'no_es_tuya');

  const tablaBd = tabla === 'foro' ? 'questions' : 'course_questions';
  if (!(await reclamar(admin, tablaBd, 'aviso_at', id, fila.created_at))) return ok(false, 'ya_avisada');

  const correo: string | null = fila.profiles?.email ?? null;
  const nombre: string = fila.profiles?.full_name || fila.author_name || correo || 'Alguien';
  const { subject, html, text } = correoPreguntaNueva({
    nombre,
    correo,
    donde,
    detalle,
    pregunta: fila.body,
    enlace: `${origen}/panel/#mensajes/${fila.user_id}`,
  });
  const envio = await mandarCorreo({ to: AVISOS_A, subject, html, text });
  if (envio.error) {
    console.error('[avisos] no salió el aviso a Emi', envio.error.message);
    await soltar(admin, tablaBd, 'aviso_at', id);
    return no(502, 'no_salio');
  }
  return ok(true);
}

/* ==========================================================================
   Una respuesta de Emi → a quien preguntó
   ========================================================================== */

async function avisarRespuesta(admin: SupabaseClient, uid: string, tabla: 'foro' | 'curso', id: string, origen: string): Promise<Resultado> {
  const { data: yo } = await admin.from('profiles').select('role').eq('id', uid).maybeSingle();
  if (yo?.role !== 'admin') return no(403, 'solo_admin');

  if (tabla === 'foro') {
    const { data: r, error } = await admin
      .from('answers')
      .select('id, created_at, questions(id, body, lang, author_name, profiles(email, full_name))')
      .eq('id', id)
      .maybeSingle();
    if (error) console.error('[avisos] no se pudo leer la respuesta', error.message);
    const q: any = r?.questions;
    if (!r || !q) return no(404, 'no_existe');
    const para: string | null = q.profiles?.email ?? null;
    if (!para) return ok(false, 'sin_correo');
    if (!(await reclamar(admin, 'answers', 'aviso_at', id, r.created_at))) return ok(false, 'ya_avisada');

    const lang = q.lang === 'en' ? 'en' : 'es';
    const { subject, html, text } = correoRespuesta(lang, {
      nombre: primerNombre(q.profiles?.full_name || q.author_name),
      donde: 'membresia',
      pregunta: q.body,
      enlace: `${origen}${membresiaPath(lang)}`,
    });
    const envio = await mandarCorreo({ to: para, subject, html, text, replyTo: RESPONDER_A });
    if (envio.error) {
      console.error('[avisos] no salió el aviso de la respuesta', envio.error.message);
      await soltar(admin, 'answers', 'aviso_at', id);
      return no(502, 'no_salio');
    }
    return ok(true);
  }

  const { data: q, error } = await admin
    .from('course_questions')
    .select('id, body, author_name, answered_at, courses(title_es, title_en, slug), profiles(email, full_name, preferred_lang)')
    .eq('id', id)
    .maybeSingle();
  if (error) console.error('[avisos] no se pudo leer la pregunta del curso', error.message);
  if (!q) return no(404, 'no_existe');
  const fila: any = q;
  if (!fila.answered_at) return ok(false, 'sin_responder');
  const para: string | null = fila.profiles?.email ?? null;
  if (!para) return ok(false, 'sin_correo');
  if (!(await reclamar(admin, 'course_questions', 'aviso_respuesta_at', id, fila.answered_at))) return ok(false, 'ya_avisada');

  const lang = fila.profiles?.preferred_lang === 'en' ? 'en' : 'es';
  const curso = fila.courses ?? {};
  const { subject, html, text } = correoRespuesta(lang, {
    nombre: primerNombre(fila.profiles?.full_name || fila.author_name),
    donde: 'curso',
    curso: (lang === 'en' ? curso.title_en : curso.title_es) || curso.title_es || curso.slug,
    pregunta: fila.body,
    enlace: `${origen}${cursoHref(curso.slug, lang, conPagina)}`,
  });
  const envio = await mandarCorreo({ to: para, subject, html, text, replyTo: RESPONDER_A });
  if (envio.error) {
    console.error('[avisos] no salió el aviso de la respuesta', envio.error.message);
    await soltar(admin, 'course_questions', 'aviso_respuesta_at', id);
    return no(502, 'no_salio');
  }
  return ok(true);
}

export const POST: APIRoute = async ({ request }) => {
  const usuario = await usuarioDeLaPeticion(request);
  if (!usuario) return json({ error: 'no_autorizado' }, 401);
  const admin = supabaseAdmin();
  if (!admin) return json({ error: 'Falta SUPABASE_SERVICE_ROLE_KEY en este despliegue.' }, 500);

  let cuerpo: { tipo?: unknown; tabla?: unknown; id?: unknown } = {};
  try {
    cuerpo = await request.json();
  } catch {
    /* sin cuerpo: se contesta abajo */
  }
  const { tipo, tabla, id } = cuerpo;
  if ((tipo !== 'pregunta' && tipo !== 'respuesta') || (tabla !== 'foro' && tabla !== 'curso') || typeof id !== 'string' || !UUID.test(id))
    return json({ error: 'peticion_no_valida' }, 400);

  if (!hayResend) {
    console.warn(`[avisos] sin RESEND_API_KEY en este despliegue: no sale el aviso (${tipo}, ${tabla}, ${id})`);
    return json({ enviado: false, motivo: 'sin_resend' });
  }

  try {
    const origen = siteOrigin(request);
    const r =
      tipo === 'pregunta'
        ? await avisarPregunta(admin, usuario.id, tabla, id, origen)
        : await avisarRespuesta(admin, usuario.id, tabla, id, origen);
    return json(r.cuerpo, r.status);
  } catch (e) {
    console.error('[avisos]', e);
    return json({ error: 'fallo' }, 500);
  }
};
