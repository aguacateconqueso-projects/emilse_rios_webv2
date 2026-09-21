import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Los clientes de Supabase **del servidor**. Nunca se importan desde una
 * pantalla: la clave `service_role` se salta la RLS entera, y si viaja al
 * navegador cualquiera puede leer y escribir lo que quiera.
 *
 * Solo lo usan las rutas de API —las que llevan `export const prerender =
 * false`—, y para lo poco que el navegador no puede hacer: crear cuentas y
 * escribir el espejo de Stripe. Todo lo demás pasa por la clave `anon` con la
 * RLS decidiendo, que es como funciona el resto del proyecto.
 */
const url = process.env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
const anonKey = process.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** El cliente con `service_role`, o `null` si falta la clave. */
export function supabaseAdmin(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Valida el token que manda el navegador en `Authorization: Bearer …` y
 * devuelve el usuario, o `null`.
 *
 * Es el primer paso de **toda** ruta de API privada: el navegador dice quién
 * dice ser, y esto se lo pregunta a Supabase en vez de creerle.
 */
export async function usuarioDeLaPeticion(request: Request) {
  const cabecera = request.headers.get('authorization') || '';
  const token = cabecera.startsWith('Bearer ') ? cabecera.slice(7) : null;
  if (!token || !url || !anonKey) return null;
  const cliente = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await cliente.auth.getUser(token);
  if (error) return null;
  return data.user ?? null;
}

/**
 * Lo mismo, pero además exige que sea admin. Devuelve el usuario o `null`.
 *
 * ⚠️ **Esta sí es una barrera de verdad**, al revés que `esAdmin()` de
 * `auth.ts`: corre en el servidor, con `service_role`, y lee el rol de la base
 * de datos. Toda ruta de API del panel empieza por acá.
 */
export async function adminDeLaPeticion(request: Request) {
  const admin = supabaseAdmin();
  if (!admin) return null;
  const u = await usuarioDeLaPeticion(request);
  if (!u) return null;
  const { data } = await admin.from('profiles').select('role').eq('id', u.id).maybeSingle();
  return data?.role === 'admin' ? u : null;
}
