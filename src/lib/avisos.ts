import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Pide el correo de aviso de una pregunta o de una respuesta (1 oct 2026).
 * **Del navegador**: lo llaman el aula, justo después de guardar una
 * pregunta, y el panel, justo después de guardar una respuesta. Quien manda el
 * correo es `/api/avisos`, en el servidor; ver ahí las reglas.
 *
 * - `pregunta` → le llega a Emi. `id` es la pregunta.
 * - `respuesta` → le llega a quien preguntó. `id` es la fila de `answers` en
 *   el foro de la membresía, y la de `course_questions` en un curso.
 *
 * **No lanza ni hace esperar**: lo guardado ya está guardado, y si el correo
 * no sale no hay nada que la alumna o Emi puedan hacer en esa pantalla. Va con
 * `keepalive`, así que sale aunque justo después se cambie de página.
 */
export function avisarPorCorreo(tipo: 'pregunta' | 'respuesta', tabla: 'foro' | 'curso', id: string | null | undefined): void {
  if (!isSupabaseConfigured || !id) return;
  void (async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch('/api/avisos', {
        method: 'POST',
        keepalive: true,
        headers: { 'content-type': 'application/json', authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ tipo, tabla, id }),
      });
      if (!res.ok) console.error('[avisos] el aviso no salió', res.status, await res.text().catch(() => ''));
    } catch (e) {
      console.error('[avisos] el aviso no salió', e);
    }
  })();
}
