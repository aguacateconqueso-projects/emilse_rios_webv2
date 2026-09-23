/**
 * Los botones: el relleno nace donde está el cursor, el botón lo sigue un
 * poco y se acerca, y suelta notas musicales. Es el script de la carta de la
 * membresía que vino de la academia, con los mismos números, llevado a todo el
 * sitio el 23 sep 2026. El aspecto, en `base.css` (`.boton`).
 *
 * Vivía dentro de `Base.astro` y salió acá el 23 sep 2026, por la noche,
 * cuando el aula y el panel pasaron al sistema del sitio: el panel no usa
 * `Base.astro` —es una herramienta, con su propia barra— y pinta botones que
 * nacen después de cargar la página (las filas de una tabla, las clases de un
 * curso). Por eso esto se arma **una vez por botón** y vuelve a mirar cuando
 * alguien avisa con `botones:nuevos`:
 *
 *   document.dispatchEvent(new CustomEvent('botones:nuevos'));
 */
const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fino = window.matchMedia('(pointer: fine)').matches;
const NOTAS = ['♪', '♫', '♩', '♬'];
const COLORES = ['#a94f2b', '#6b3f2a', '#c9a24a', '#7a8b5a', '#4a6d8c', '#b5504a'];

/** Dos o tres notas que salen del botón y suben un segundo. */
const soltar = (boton: HTMLElement) => {
  const r = boton.getBoundingClientRect();
  const cuantas = 2 + Math.floor(Math.random() * 2);
  for (let i = 0; i < cuantas; i++) {
    const nota = document.createElement('span');
    nota.className = 'note-pop';
    nota.setAttribute('aria-hidden', 'true');
    nota.textContent = NOTAS[Math.floor(Math.random() * NOTAS.length)];
    nota.style.left = `${r.left + 12 + Math.random() * Math.max(1, r.width - 24)}px`;
    nota.style.top = `${r.top + r.height * 0.3}px`;
    nota.style.color = COLORES[Math.floor(Math.random() * COLORES.length)];
    nota.style.fontSize = `${15 + Math.random() * 13}px`;
    nota.style.setProperty('--dx', `${((Math.random() * 2 - 1) * 46).toFixed(0)}px`);
    nota.style.setProperty('--rot', `${((Math.random() * 2 - 1) * 40).toFixed(0)}deg`);
    document.body.appendChild(nota);
    nota.addEventListener('animationend', () => nota.remove());
  }
};

function armar(boton: HTMLElement) {
  if (boton.dataset.armado) return;
  boton.dataset.armado = '1';
  let reloj: number | undefined;

  const apagado = () =>
    boton.hasAttribute('disabled') || boton.getAttribute('aria-disabled') === 'true';

  boton.addEventListener('pointermove', (e) => {
    const r = boton.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    boton.style.setProperty('--mx', `${x}px`);
    boton.style.setProperty('--my', `${y}px`);
    /* Magnético: se va hacia el cursor, 8 px a lo ancho y 6 a lo alto
       como mucho, y se acerca un 3 %. */
    if (fino && !quieto && !apagado()) {
      const dx = (x - r.width / 2) / r.width;
      const dy = (y - r.height / 2) / r.height;
      boton.style.transform = `translate(${(dx * 8).toFixed(1)}px, ${(dy * 6).toFixed(1)}px) scale(1.03)`;
    }
  });

  boton.addEventListener('pointerleave', () => {
    boton.style.transform = '';
    if (reloj) window.clearInterval(reloj);
    reloj = undefined;
  });

  if (fino && !quieto) {
    boton.addEventListener('pointerenter', () => {
      if (apagado()) return;
      soltar(boton);
      reloj = window.setInterval(() => {
        if (apagado()) return;
        soltar(boton);
      }, 460);
    });
  }
}

const armarTodos = () => document.querySelectorAll<HTMLElement>('[data-boton]').forEach(armar);

armarTodos();
document.addEventListener('botones:nuevos', armarTodos);
