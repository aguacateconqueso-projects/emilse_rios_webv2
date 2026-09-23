import { datos, type Acceso } from './aula-datos';

/**
 * Quién está dentro, preguntado UNA vez por página.
 *
 * Lo necesitan dos scripts a la vez —el portón del marco (`layouts/Aula.astro`)
 * y la pantalla (escritorio o curso)— y sin esto serían dos viajes idénticos a
 * Supabase. Los módulos del navegador se cargan una sola vez por página, así
 * que esta promesa es la misma para los dos.
 */
let promesa: Promise<Acceso> | null = null;

export function acceso(): Promise<Acceso> {
  if (!promesa) promesa = datos.acceso();
  return promesa;
}

/**
 * ¿Puede pasar? Emi siempre; el resto, con la membresía al día o con algún
 * curso. Si la comprobación de la suscripción falló, se deja pasar: el portón
 * decide qué se DIBUJA, y el contenido llega por consulta con la RLS
 * decidiendo, así que dejar pasar de más un minuto enseña un escritorio vacío,
 * no un curso. Dejar fuera a toda la membresía por un mal minuto de Supabase
 * sería mucho peor.
 */
export const puedePasar = (a: Acceso): boolean =>
  a.sesion && (a.admin || a.membresia || a.cursos || a.dudoso);
