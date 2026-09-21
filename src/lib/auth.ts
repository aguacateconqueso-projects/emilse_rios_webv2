import { supabase, isSupabaseConfigured } from './supabase';

/**
 * La sesión, el perfil y las cuatro cosas que se hacen con ellos.
 *
 * Todo esto corre **en el navegador** y habla directo con Supabase. No hay
 * servidor de por medio y no hace falta: quien decide qué puede leer cada quien
 * son las políticas RLS de la base de datos.
 *
 * ⚠️ **Nada de lo que hay acá es una barrera de seguridad.** `esAdmin()` sirve
 * para decidir qué se DIBUJA, no para proteger nada: alguien con la consola
 * abierta puede hacer que devuelva `true` y lo único que conseguirá es ver una
 * pantalla vacía, porque las consultas se las rechaza la base de datos. La
 * puerta es `is_admin()` dentro de la RLS; esto es el cartel de la puerta.
 */

export type Perfil = {
  id: string;
  email: string | null;
  full_name: string | null;
  preferred_lang: 'es' | 'en';
  role: 'member' | 'admin';
};

/** El usuario de la sesión, o `null` si no hay ninguna. */
export async function usuario() {
  if (!isSupabaseConfigured) return null;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user ?? null;
}

/** El perfil completo de quien está dentro, o `null`. */
export async function perfil(): Promise<Perfil | null> {
  const u = await usuario();
  if (!u) return null;
  const { data } = await supabase
    .from('profiles')
    .select('id, email, full_name, preferred_lang, role')
    .eq('id', u.id)
    .maybeSingle();
  return (data as Perfil) ?? null;
}

/** Si es Emi (o Adrián). Para DIBUJAR, nunca para proteger — ver arriba. */
export const esAdmin = (p: Perfil | null): boolean => p?.role === 'admin';

/** Entrar con correo y contraseña. */
export async function entrar(email: string, clave: string) {
  return supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password: clave });
}

/**
 * Manda el correo con el enlace de un solo uso para poner la contraseña.
 *
 * Sirve para las dos cosas y por eso no hay dos botones: la primera vez —la
 * cuenta se creó al pagar y nunca tuvo clave— y la vez que alguien la olvidó.
 * `redirectTo` tiene que estar en la lista de Redirect URLs de Supabase Auth o
 * el enlace del correo no lleva a ninguna parte.
 */
export async function pedirClave(email: string, redirectTo: string) {
  return supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo });
}

/** Fija la contraseña nueva. Solo funciona con la sesión que trae el correo. */
export async function fijarClave(clave: string) {
  return supabase.auth.updateUser({ password: clave });
}

/** Salir, y limpiar los dos almacenes (lo hace el adaptador de `supabase.ts`). */
export async function salir() {
  if (isSupabaseConfigured) await supabase.auth.signOut();
}
