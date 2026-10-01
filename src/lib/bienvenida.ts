import { supabaseAdmin } from './supabase-admin';
import { hayResend, mandarCorreo, correoBienvenida, RESPONDER_A } from './correo';
import { clavePath, entrarPath } from '../i18n/aula';

/**
 * La bienvenida de quien acaba de pagar la membresía: el correo con su enlace
 * para poner la contraseña. **Solo de servidor.** La llama el webhook de
 * Stripe cuando el pago crea una cuenta nueva.
 *
 * Trasplantado de `emilse_rios_membresias` (`src/lib/welcome-email.ts`) el 27
 * sep 2026, con la mudanza. Lo que cambió es a dónde lleva: a la pantalla de
 * la contraseña de esta casa (`/aulavirtual/nueva-clave/`), que tiene que
 * estar —y está desde el 22 sep— en las Redirect URLs de Supabase.
 *
 * Dos caminos, el primero el bueno:
 *   1. Resend, con el copy de Emi y en el idioma en que pagó. El enlace de un
 *      solo uso lo genera Supabase sin mandar nada (`generateLink`).
 *   2. Si falta Resend o falla: el correo estándar de Supabase, con el mismo
 *      destino. Llega en inglés y sin el copy, pero llega.
 *
 * No lanza. Si todo falla, queda en los logs de Vercel con `[bienvenida]`, y
 * la compradora igual puede entrar desde «¿Primera vez?» de la pantalla de
 * acceso, o ya puso su contraseña en `/gracias/`.
 */
export async function enviarBienvenida(email: string, lang: 'es' | 'en', origen: string): Promise<void> {
  const admin = supabaseAdmin();
  if (!admin) {
    console.error('[bienvenida] falta la service_role: no se puede mandar a', email);
    return;
  }
  const base = origen.replace(/\/+$/, '');
  const correo = email.trim().toLowerCase();
  const destino = `${base}${clavePath(lang)}`;

  if (hayResend) {
    const { data, error } = await admin.auth.admin.generateLink({
      type: 'recovery',
      email: correo,
      options: { redirectTo: destino },
    });
    const enlace = (data as any)?.properties?.action_link as string | undefined;
    if (enlace) {
      const { subject, html, text } = correoBienvenida(lang, enlace, `${base}${entrarPath(lang)}`);
      const envio = await mandarCorreo({ to: correo, subject, html, text, replyTo: RESPONDER_A });
      if (!envio.error) return;
      console.error('[bienvenida] Resend falló, va el de Supabase:', envio.error.message);
    } else {
      console.error('[bienvenida] no se pudo generar el enlace, va el de Supabase:', error?.message);
    }
  }

  const { error } = await admin.auth.resetPasswordForEmail(correo, { redirectTo: destino });
  if (error) console.error('[bienvenida] tampoco salió el de Supabase para', correo, error.message);
}
