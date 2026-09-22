import { createClient } from '@supabase/supabase-js';

/**
 * El cliente de Supabase del navegador.
 *
 * **Apunta al MISMO proyecto que la academia**, no a uno nuevo. Un proyecto de
 * Supabase no está atado a un dominio: lo único que ataba aquél a
 * `emilseriosacademy.com` eran dos campos del panel de Auth —Site URL y
 * Redirect URLs—, y añadir `emilserios.com` a esa lista es aditivo. Usuarios,
 * contraseñas, suscripciones y los `customer_id` de Stripe se quedan donde
 * están; acá no se copia ni una fila. Ver **La mudanza de la sesión** en
 * `progreso.md`.
 *
 * La clave `anon` es **pública a propósito** y viaja en el HTML. Quien decide
 * qué ve cada quien no es esta clave: son las políticas RLS de la base de
 * datos. Por eso el frontend se puede reescribir entero sin tocar una sola
 * regla de acceso — y por eso esta mudanza es barata.
 */
/**
 * La URL del proyecto, **limpiada**.
 *
 * `createClient` quiere la raíz —`https://<ref>.supabase.co`— y le pega
 * `/auth/v1`, `/rest/v1` o lo que toque según a quién le hable. Pegarle una
 * base que ya lleve `/rest/v1` produce `…/rest/v1/auth/v1/token`, que no existe
 * y devuelve **404**.
 *
 * ⚠️ **No es un caso hipotético: pasó el 22 sep 2026 y costó media tarde.** El
 * panel de Supabase enseña la URL del proyecto en un sitio y los endpoints REST
 * —con `/rest/v1` al final— en otro, y copiar el segundo es facilísimo. Lo peor
 * es cómo se ve el fallo desde fuera: **el 404 muere en la pasarela y nunca
 * llega al servicio de autenticación**, así que en Supabase → Users no aparece
 * ningún intento, en Authentication → Logs tampoco, y la pantalla dice que la
 * contraseña no es correcta. Se buscan contraseñas durante una hora.
 *
 * Así que se limpia acá, que es donde se puede: fuera la barra final y fuera el
 * sufijo del endpoint si alguien lo pegó. Y se avisa por consola, porque
 * arreglarlo en silencio esconde una variable mal puesta en Vercel que alguien
 * va a volver a copiar igual.
 */
function limpiarUrl(bruta: string | undefined): string | undefined {
  if (!bruta) return bruta;
  const limpia = bruta.trim().replace(/\/+$/, '').replace(/\/(rest|auth|storage|realtime)\/v1$/, '');
  if (limpia !== bruta.trim()) {
    console.warn(
      `[supabase] PUBLIC_SUPABASE_URL tiene que ser la raíz del proyecto. Se recibió «${bruta}» y se usará «${limpia}». Arréglalo en Vercel.`,
    );
  }
  return limpia;
}

const url = limpiarUrl(import.meta.env.PUBLIC_SUPABASE_URL);
const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY?.trim();

/**
 * Si es `false`, no hay backend: el aula se comporta como la maqueta que era y
 * lo dice en pantalla. Ninguna página debe romperse por esto — se avisa, no se
 * finge.
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

/* --------------------------------------------------------------------------
   «Mantener la sesión iniciada»
   --------------------------------------------------------------------------
   Traído tal cual de la academia, con el mismo nombre de clave, porque es el
   mismo comportamiento y la misma gente: la casilla de la pantalla de acceso
   decide DÓNDE se guarda el token.

     recordar (por defecto) → localStorage:   sobrevive a cerrar el navegador
     no recordar            → sessionStorage: se va con la pestaña

   La pantalla de acceso escribe la preferencia ANTES de iniciar sesión, para
   que el token nazca ya en el almacén correcto. Al salir se limpian los dos.
   -------------------------------------------------------------------------- */
const REMEMBER_KEY = 'erm_remember';

function almacen(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(REMEMBER_KEY) === '0'
      ? window.sessionStorage
      : window.localStorage;
  } catch {
    // Navegación privada, almacenamiento bloqueado, iframe particionado…
    return null;
  }
}

/** Escribe la preferencia de la casilla. La llama la pantalla de acceso. */
export function recordarSesion(recordar: boolean): void {
  try {
    if (recordar) window.localStorage.removeItem(REMEMBER_KEY);
    else window.localStorage.setItem(REMEMBER_KEY, '0');
  } catch {
    /* sin almacenamiento, manda el valor por defecto: recordar */
  }
}

const almacenSegunCasilla = {
  getItem: (k: string) => {
    try {
      return almacen()?.getItem(k) ?? null;
    } catch {
      return null;
    }
  },
  setItem: (k: string, v: string) => {
    try {
      almacen()?.setItem(k, v);
    } catch {
      /* ídem */
    }
  },
  removeItem: (k: string) => {
    try {
      window.localStorage.removeItem(k);
      window.sessionStorage.removeItem(k);
    } catch {
      /* ídem */
    }
  },
};

export const supabase = createClient(
  url || 'https://sin-configurar.supabase.co',
  anonKey || 'sin-configurar',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      /**
       * Recoge el token que llega en el `#hash` — el del correo de crear o
       * recuperar contraseña, y el del puente `/pasar/` que traerá la sesión
       * desde la academia el día de la mudanza.
       */
      detectSessionInUrl: true,
      /**
       * `implicit` y no `pkce`, igual que la academia. No es una preferencia:
       * es lo que hace posible el puente de traspaso, porque los tokens viajan
       * en el hash y se pueden pasar de un dominio al otro. Cambiarlo rompe la
       * mudanza.
       */
      flowType: 'implicit',
      storage: typeof window !== 'undefined' ? almacenSegunCasilla : undefined,
    },
  },
);
