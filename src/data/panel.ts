/**
 * Las secciones del panel de Emi, en el orden de la barra.
 *
 * Una sola lista para las dos cosas que las enseñan: la barra de pestañas de
 * arriba y **la vista general**, la primera pantalla del panel, con una
 * tarjeta por sección. Adrián la pidió de vuelta el 23 sep 2026 —«extraño la
 * vista general que teníamos antes; la primera vista de Emi debería ser
 * esa»—: era la lista de pestañas anunciadas de la capa A, y ahora cada
 * tarjeta abre la suya y dice cómo está.
 *
 * Solo en español: el panel lo usan dos personas y las dos hablan español.
 */
export type Seccion = {
  id: 'hoy' | 'membresia' | 'cursos' | 'tienda' | 'ventas' | 'personas' | 'mensajes';
  titulo: string;
  /** Lo que hace, en una línea. La tarjeta de la vista general. */
  que: string;
};

export const secciones: Seccion[] = [
  {
    id: 'hoy',
    titulo: 'Hoy',
    que: 'Las cifras del día y lo que pide atención: el ejercicio de la semana, las preguntas, los cursos.',
  },
  {
    id: 'membresia',
    titulo: 'Membresía',
    que: 'El ejercicio de la semana, el concepto base y el bonus, en los dos idiomas.',
  },
  {
    id: 'cursos',
    titulo: 'Cursos',
    que: 'Arma tus cursos: bloques, clases, videos de Bunny y materiales. Publica cuando quieras.',
  },
  {
    id: 'tienda',
    titulo: 'Tienda',
    que: 'Lo que se ve en Formaciones: qué vendes, a qué precio, con qué foto y en qué estado.',
  },
  {
    id: 'ventas',
    titulo: 'Págs. de ventas',
    que: 'Redacta la página de ventas de cada formación, bloque a bloque y en los dos idiomas.',
  },
  {
    id: 'personas',
    titulo: 'Personas',
    que: 'Todas las cuentas: quién tiene la membresía, quién compró qué, y dar o quitar acceso.',
  },
  {
    id: 'mensajes',
    titulo: 'Mensajes',
    que: 'Las preguntas del foro de la membresía y de los cursos, para responder desde acá.',
  },
];
