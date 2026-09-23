import type { Session } from '@supabase/supabase-js';

/**
 * Lo que comparten las pestañas del panel de Emi: cuándo pueden arrancar, cómo
 * se cambia de una a otra, el aviso de «guardado» y las fechas.
 *
 * El panel es UNA página (`/panel/`) con una pestaña por componente
 * (`src/components/panel/`). El panel de la academia era un solo fichero de
 * 1.059 líneas con tres pestañas, y `progreso.md` dejó dicho que con ocho no
 * se sostiene: por eso cada una es su propio fichero y se habla con las demás
 * solo por acá.
 *
 * El orden de las cosas: la consola (`Consola.astro`) pregunta quién entra;
 * si es admin, llama a `arrancar()` con la sesión y enseña la pestaña que diga
 * el `#hash`. Cada pestaña se registra con `alAbrir()` y **no hace nada hasta
 * la primera vez que alguien la abre**: la de Membresía no pide sus ejercicios
 * si Emi entró a mirar un curso.
 */

export type Pestana =
  | 'inicio'
  | 'hoy'
  | 'membresia'
  | 'cursos'
  | 'tienda'
  | 'ventas'
  | 'personas'
  | 'mensajes';

/** `inicio` es la vista general: lo que se ve al entrar, sin `#`. */
export const PESTANAS: Pestana[] = [
  'inicio',
  'hoy',
  'membresia',
  'cursos',
  'tienda',
  'ventas',
  'personas',
  'mensajes',
];

type Arranque = (s: Session | null) => void | Promise<void>;

let sesion: Session | null = null;
let listo = false;
const arranques = new Map<Pestana, Arranque>();
const abiertas = new Set<Pestana>();
let actual: Pestana | null = null;

/** Registra lo que hace una pestaña la primera vez que se abre. */
export function alAbrir(p: Pestana, fn: Arranque) {
  arranques.set(p, fn);
  if (listo && actual === p && !abiertas.has(p)) abrirPorPrimeraVez(p);
}

function abrirPorPrimeraVez(p: Pestana) {
  const fn = arranques.get(p);
  if (!fn) return;
  abiertas.add(p);
  Promise.resolve(fn(sesion)).catch((e) => console.error(`[panel:${p}]`, e));
}

/** Enseña una pestaña y arranca la suya si es la primera vez. */
export function mostrar(p: Pestana) {
  actual = p;
  document.querySelectorAll<HTMLElement>('[data-pestana]').forEach((el) => {
    el.hidden = el.dataset.pestana !== p;
  });
  document.querySelectorAll<HTMLElement>('[data-ir-pestana]').forEach((el) => {
    const es = el.dataset.irPestana === p;
    if (es) el.setAttribute('aria-current', 'page');
    else el.removeAttribute('aria-current');
  });
  if (listo && !abiertas.has(p)) abrirPorPrimeraVez(p);
  document.dispatchEvent(new CustomEvent('panel:pestana', { detail: p }));
}

/** Cambia de pestaña desde otra (los atajos de «Hoy»). */
export function ir(p: Pestana, ancla?: string) {
  const hash = `#${p}${ancla ? `/${ancla}` : ''}`;
  if (location.hash !== hash) location.hash = hash;
  else mostrar(p);
}

/** Lo llama la consola cuando el portero deja pasar. */
export function arrancar(s: Session | null) {
  sesion = s;
  listo = true;
  if (actual && !abiertas.has(actual)) abrirPorPrimeraVez(actual);
}

/** `#cursos/<id>` → `['cursos', '<id>']`. */
export function leerHash(): [Pestana, string | null] {
  const [p, resto] = location.hash.replace(/^#/, '').split('/');
  const pest = (PESTANAS as string[]).includes(p) ? (p as Pestana) : 'inicio';
  return [pest, resto ? decodeURIComponent(resto) : null];
}

/* ==========================================================================
   El aviso de «guardado»
   ========================================================================== */

let reloj: number | undefined;

export function avisar(texto: string) {
  let el = document.querySelector<HTMLElement>('[data-toast]');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    el.dataset.toast = '';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
  }
  el.textContent = texto;
  el.classList.add('is-on');
  window.clearTimeout(reloj);
  reloj = window.setTimeout(() => el!.classList.remove('is-on'), 2800);
}

/* ==========================================================================
   Fechas — en la hora del navegador de Emi, que es la de Madrid
   ========================================================================== */

const pad = (n: number) => String(n).padStart(2, '0');

/** Para un `<input type="datetime-local">`. */
export const aInput = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

export const fecha = (iso: string) =>
  new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

export const fechaHora = (iso: string) =>
  new Date(iso).toLocaleString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

export const rango = (a: string, b: string) => {
  const o: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  return `${new Date(a).toLocaleDateString('es-ES', o)} – ${new Date(b).toLocaleDateString('es-ES', o)}`;
};

export function hace(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(s / 3600);
  const d = Math.floor(s / 86400);
  if (s < 60) return 'ahora';
  if (m < 60) return `hace ${m} min`;
  if (h < 24) return `hace ${h} h`;
  if (d === 1) return 'ayer';
  if (d < 30) return `hace ${d} días`;
  return fecha(iso);
}

/* ==========================================================================
   Pintar sin `innerHTML`
   ========================================================================== */

type Hijo = Node | string | null | undefined | false;

/**
 * Crea un elemento con sus clases, atributos e hijos. Todo lo que escribe Emi
 * o una alumna entra como texto, nunca como HTML: una pregunta con un `<script>`
 * dentro se lee como lo que es.
 */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | boolean | number | undefined | null> = {},
  ...hijos: Hijo[]
): HTMLElementTagNameMap[K] {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') n.className = String(v);
    else if (k === 'text') n.textContent = String(v);
    else if (v === true) n.setAttribute(k, '');
    else n.setAttribute(k, String(v));
  }
  for (const h of hijos) {
    if (h === null || h === undefined || h === false) continue;
    n.append(typeof h === 'string' ? document.createTextNode(h) : h);
  }
  return n;
}

/**
 * Un botón del sitio (`Boton.astro`) hecho en caliente. Después de pintar una
 * tanda, `document.dispatchEvent(new CustomEvent('botones:nuevos'))` le pone
 * el relleno, el imán y las notas.
 */
export function boton(
  texto: string,
  opts: { solido?: boolean; chico?: boolean; flecha?: boolean; tipo?: 'button' | 'submit' } = {},
): HTMLButtonElement {
  const b = el('button', {
    class: ['boton', opts.solido && 'boton--solid', opts.chico && 'boton--sm'].filter(Boolean).join(' '),
    type: opts.tipo ?? 'button',
    'data-boton': true,
  });
  b.append(
    el('span', { class: 'boton__fill', 'aria-hidden': 'true' }),
    el('span', { class: 'boton__label', text: texto }),
  );
  if (opts.flecha !== false) b.append(el('span', { class: 'boton__ar', 'aria-hidden': 'true', text: '→' }));
  return b;
}

/** Pone el rótulo de un botón (y lo apaga) mientras dura una promesa. */
export async function ocupado<T>(b: HTMLButtonElement, texto: string, trabajo: () => Promise<T>): Promise<T> {
  const rotulo = b.querySelector('.boton__label') ?? b;
  const antes = rotulo.textContent;
  b.disabled = true;
  rotulo.textContent = texto;
  try {
    return await trabajo();
  } finally {
    b.disabled = false;
    rotulo.textContent = antes;
  }
}

export const armarBotones = () => document.dispatchEvent(new CustomEvent('botones:nuevos'));

/* ==========================================================================
   Fotos: se achican en el navegador antes de subirlas
   ========================================================================== */

/**
 * Una foto lista para la web: como mucho `ancho` píxeles y en WebP. Lo que Emi
 * sube desde el teléfono pesa 5 MB y mide 4000 px; la ficha de Formaciones se
 * pinta a 520. Achicarla acá evita subir y servir lo que nadie ve. Si el
 * navegador no sabe hacerlo, se sube tal cual.
 */
export async function achicarFoto(fichero: Blob, ancho = 1600): Promise<Blob> {
  try {
    const img = await createImageBitmap(fichero);
    const escala = Math.min(1, ancho / img.width);
    const lienzo = document.createElement('canvas');
    lienzo.width = Math.round(img.width * escala);
    lienzo.height = Math.round(img.height * escala);
    lienzo.getContext('2d')!.drawImage(img, 0, 0, lienzo.width, lienzo.height);
    const blob = await new Promise<Blob | null>((ok) => lienzo.toBlob(ok, 'image/webp', 0.85));
    return blob ?? fichero;
  } catch {
    return fichero;
  }
}

/** «Todo el Diapasón!» → «todo-el-diapason». */
export const aSlug = (t: string) =>
  t
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Si el error dice que falta una tabla: la migración sin aplicar. */
export const faltaTabla = (msg: string) =>
  /does not exist|schema cache|Could not find the (table|function)|relation .* does not exist/i.test(msg);
