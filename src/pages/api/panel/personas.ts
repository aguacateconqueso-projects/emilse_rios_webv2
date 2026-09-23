import type { APIRoute } from 'astro';
import { adminDeLaPeticion, buscarOCrearUsuario, supabaseAdmin } from '../../../lib/supabase-admin';

/**
 * Crear una cuenta desde el panel (pestaña Personas → «Nueva persona»).
 *
 *   POST /api/panel/personas   { email, nombre? }   → { id, creada }
 *
 * Es lo único de Personas que el navegador no puede hacer: una cuenta nueva
 * se crea en `auth.users`, y eso pide la `service_role`. Todo lo demás —dar o
 * quitar la membresía a mano, dar o quitar un curso— lo hace el panel directo
 * contra Supabase con la sesión de Emi y la RLS decidiendo (`is_admin()`).
 *
 * Da de alta con `buscarOCrearUsuario()`, el mismo criterio que el cobro: si
 * la cuenta ya existe, la devuelve sin tocarla. El nombre solo se escribe si
 * el perfil no tenía uno. **No manda ningún correo**: el enlace para poner la
 * contraseña lo pide el panel después, si Emi quiere, con el mismo correo de
 * «primera vez» de la pantalla de acceso.
 *
 * ⚠️ Solo admin: empieza por `adminDeLaPeticion()`, que corre en el servidor y
 * lee el rol de la base de datos.
 */
export const prerender = false;

const json = (cuerpo: unknown, status = 200) =>
  new Response(JSON.stringify(cuerpo), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

export const POST: APIRoute = async ({ request }) => {
  const quien = await adminDeLaPeticion(request);
  if (!quien) return json({ error: 'no_autorizado' }, 401);
  const admin = supabaseAdmin();
  if (!admin) return json({ error: 'Falta SUPABASE_SERVICE_ROLE_KEY en este despliegue.' }, 500);

  let cuerpo: { email?: unknown; nombre?: unknown } = {};
  try {
    cuerpo = await request.json();
  } catch {
    /* sin cuerpo: se contesta abajo */
  }
  const email = typeof cuerpo.email === 'string' ? cuerpo.email.trim().toLowerCase() : '';
  const nombre = typeof cuerpo.nombre === 'string' ? cuerpo.nombre.trim().slice(0, 120) : '';
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: 'Correo no válido.' }, 400);

  try {
    const { userId, creado } = await buscarOCrearUsuario(admin, email);
    if (!userId) return json({ error: 'No se pudo crear ni encontrar la cuenta.' }, 500);
    if (nombre) {
      const { data: perfil } = await admin.from('profiles').select('full_name').eq('id', userId).maybeSingle();
      if (perfil && !perfil.full_name) await admin.from('profiles').update({ full_name: nombre }).eq('id', userId);
    }
    return json({ id: userId, creada: creado });
  } catch (e) {
    console.error('[panel/personas]', e);
    return json({ error: 'No se pudo crear la cuenta.' }, 500);
  }
};
