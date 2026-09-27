/**
 * Las fotos toman color al pasarles el scroll, en las pantallas sin cursor.
 *
 * Las fotografías del sitio van en blanco y negro y toman color al pasarles
 * el cursor por encima —el retrato de *Sobre mí*, las fichas de Formaciones,
 * la foto de cada carta—. En un teléfono no hay cursor, así que se quedaban
 * grises para siempre: Emi lo vio el 27 sep 2026 («en mobile todas las fotos
 * están en blanco y negro, tienen que agarrar color al hacer scroll»).
 *
 * Así que ahí el gesto lo dispara el scroll: la foto se enciende al entrar en
 * la franja central de la pantalla y se apaga al salir de ella, que es lo que
 * hace la lámina de la Home. El color sigue siendo algo que pasa mientras la
 * miras, no un estado. El aspecto —la clase `a-color`— está en `base.css`.
 *
 * Solo con `(hover: none)`: con cursor manda el `:hover` de siempre, y los
 * dos gestos a la vez se pisarían.
 */
const tactil = window.matchMedia('(hover: none)').matches;

if (tactil && 'IntersectionObserver' in window) {
  const fotos = document.querySelectorAll<HTMLElement>('.slot__img, .plate__img');
  const observador = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) e.target.classList.toggle('a-color', e.isIntersecting);
    },
    /* La franja central: el 60 % del alto de la pantalla. */
    { rootMargin: '-20% 0px -20% 0px' },
  );
  fotos.forEach((f) => observador.observe(f));
}
