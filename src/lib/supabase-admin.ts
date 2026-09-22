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
/**
 * La misma limpieza que hace `supabase.ts` del lado del navegador, y por la
 * misma razón: una `PUBLIC_SUPABASE_URL` con `/rest/v1` pegado al final produce
 * rutas como `…/rest/v1/auth/v1/token`, que devuelven 404. Pasó el 22 sep 2026
 * y el fallo es mudo — el 404 muere en la pasarela y no deja rastro en los
 * registros de autenticación.
 *
 * Son cuatro líneas duplicadas a propósito: sacarlas a un módulo compartido
 * obligaría a que este fichero —de servidor, con la `service_role`— y el del
 * navegador importaran del mismo sitio, y esa frontera es justo la que este
 * proyecto mantiene separada a mano.
 */
const limpiarUrl = (bruta: string | undefined): string | undefined =>
  bruta?.trim().replace(/\/+$/, '').replace(/\/(rest|auth|storage|realtime)\/v1$/, '');

const url = limpiarUrl(process.env.PUBLIC_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL);
const anonKey = (
  process.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY
)?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

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

/**
 * Busca el perfil por correo; si no existe, crea el usuario.
 *
 * Trasplantado de `emilse_rios_membresias` el 22 sep 2026, con la mudanza del
 * cobro. **Tiene que dar de alta con exactamente el mismo criterio que el
 * webhook de la academia**, porque los dos escriben en el mismo Supabase y los
 * dos pueden llegar primero: el webhook cuando Stripe avisa del pago, y
 * `/api/claim-account` cuando la compradora pone su contraseña en `/gracias/`.
 * Si uno normalizara el correo distinto del otro, un mismo pago crearía dos
 * cuentas y solo una tendría la suscripción.
 *
 * De ahí el `eq` con el correo en minúsculas y sin espacios: GoTrue los guarda
 * así y el trigger de la base de datos los copia tal cual al perfil, con lo que
 * la igualdad exacta es correcta y además evita los comodines de un `like`.
 *
 * El usuario nace **sin contraseña** —el trigger le crea el perfil— y quien la
 * pone es quien acaba de pagar. `creado` dice si es alta nueva, que es lo que
 * el webhook de la academia usa para decidir si manda el correo de bienvenida.
 */
export async function buscarOCrearUsuario(
  admin: SupabaseClient,
  email: string | null,
): Promise<{ userId: string | null; creado: boolean }> {
  if (!email) return { userId: null, creado: false };
  const minus = email.trim().toLowerCase();

  const { data: perfil } = await admin
    .from('profiles')
    .select('id')
    .eq('email', minus)
    .maybeSingle();
  if (perfil?.id) return { userId: perfil.id, creado: false };

  const { data: alta, error } = await admin.auth.admin.createUser({
    email: minus,
    email_confirm: true,
  });
  if (alta?.user?.id) return { userId: alta.user.id, creado: true };

  /* Ya existía en `auth` pero sin perfil —una cuenta vieja de antes del
     trigger, o una carrera con el webhook—. Se le busca por correo: no es un
     alta nueva y no debe contarse como tal. */
  if (error) {
    const { data: lista } = await admin.auth.admin.listUsers();
    const u = lista?.users?.find((x) => (x.email || '').toLowerCase() === minus);
    if (u) return { userId: u.id, creado: false };
    console.error('[supabase-admin] no se pudo crear ni encontrar el usuario de', minus, error.message);
  }
  return { userId: null, creado: false };
}
