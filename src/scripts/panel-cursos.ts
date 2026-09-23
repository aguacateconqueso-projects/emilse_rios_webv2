/**
 * El editor de cursos del panel — la lógica de `components/panel/Cursos.astro`.
 *
 * Habla directo con Supabase desde el navegador, como el resto del panel: la
 * clave `anon` es pública y quien decide es la RLS (`is_admin()`), así que no
 * hace falta ningún backend propio. La única excepción es la biblioteca de
 * Bunny, que pide una clave que no puede salir del servidor
 * (`/api/panel/bunny`).
 *
 * Tres vistas, por el `#hash`:
 *
 *   #cursos                   la lista
 *   #cursos/nuevo             la lista, con el formulario de «nuevo» abierto
 *   #cursos/<id>              el editor de ese curso
 *   #cursos/<id>/<clase>      …con esa clase abierta
 *
 * **Todo lo que escribe Emi entra como texto**, nunca como HTML (ver `el()` en
 * `lib/panel.ts`). Y los cambios de una clase se guardan con un botón —con
 * aviso si se sale sin guardar—, no solos: Emi escribe los dos idiomas a la
 * vez y un guardado a medias publicaría media clase.
 */
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { normalizeVideoUrl, videoEmbed, bunnyGuid, bunnyUrl } from '../lib/video';
import { reloj } from '../lib/aula-datos';
import { cursoHref } from '../i18n/aula';
import { alAbrir, armarBotones, avisar, boton, el, hace, ocupado } from '../lib/panel';

/* ==========================================================================
   Las formas
   ========================================================================== */

type Material = {
  id: string;
  nombre_es: string;
  nombre_en: string;
  path?: string;
  url?: string;
  lang: 'es' | 'en' | 'ambos';
  /** Solo en el navegador, hasta guardar: el fichero que hay que subir. */
  _fichero?: File;
};

type Clase = {
  id: string;
  course_id: string;
  unit_id: string;
  title_es: string;
  title_en: string;
  summary_es: string | null;
  summary_en: string | null;
  video_es: string | null;
  video_en: string | null;
  duration_s: number | null;
  materials: Material[];
  published: boolean;
  position: number;
  updated_at?: string;
};

type Unidad = { id: string; course_id: string; title_es: string; title_en: string; position: number; clases: Clase[] };

type Curso = {
  id: string;
  slug: string;
  title_es: string;
  title_en: string;
  summary_es: string | null;
  summary_en: string | null;
  published: boolean;
  position: number;
  updated_at?: string;
  unidades: Unidad[];
};

type Ficha = { slug: string; es: string; en: string };

type VideoBunny = { guid: string; titulo: string; segundos: number; coleccion: string | null; listo: boolean; miniatura: string | null };

/* ==========================================================================
   Lo de siempre
   ========================================================================== */

const raiz = document.querySelector<HTMLElement>('[data-cursos-raiz]')!;
const $ = <T extends HTMLElement = HTMLElement>(s: string, en: ParentNode = raiz) => en.querySelector<T>(s)!;
const $$ = <T extends HTMLElement = HTMLElement>(s: string, en: ParentNode = raiz) =>
  Array.from(en.querySelectorAll<T>(s));
const CATALOGO: Ficha[] = JSON.parse(document.getElementById('cursos-catalogo')!.textContent!);
const CON_PAGINA = CATALOGO.map((f) => f.slug);
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `m${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

/** «Todo el Diapasón!» → «todo-el-diapason». */
const aSlug = (t: string) =>
  t
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** «12:34» o «1:02:03» → segundos. Vacío → null. */
function aSegundos(t: string): number | null {
  const s = t.trim();
  if (!s) return null;
  if (/^\d+$/.test(s)) return Number(s) * 60;
  const partes = s.split(':').map((x) => Number(x));
  if (partes.some((x) => Number.isNaN(x))) return NaN;
  return partes.reduce((acc, x) => acc * 60 + x, 0);
}

const nombreCurso = (c: Pick<Curso, 'title_es' | 'slug'>) => c.title_es || c.slug;
const nombreClase = (l: Pick<Clase, 'title_es' | 'title_en'>) => l.title_es || l.title_en || '(sin título)';
const nombreUnidad = (u: Pick<Unidad, 'title_es' | 'title_en'>) => u.title_es || u.title_en || '(sin nombre)';

function faltanTablas(msg: string) {
  return /does not exist|schema cache|Could not find the table|relation .* does not exist/i.test(msg);
}

/* ==========================================================================
   El estado
   ========================================================================== */

let lista: (Curso & { n_clases: number; n_alumnas: number })[] = [];
let C: Curso | null = null;
let claseId: string | null = null;
let sucio = false;
let seccion: 'clases' | 'datos' | 'alumnas' = 'clases';

const todasLasClases = () => (C ? C.unidades.flatMap((u) => u.clases) : []);
const buscarClase = (id: string | null) => todasLasClases().find((l) => l.id === id) ?? null;

/* ==========================================================================
   Navegación
   ========================================================================== */

function leer(): { id: string | null; clase: string | null } {
  const [p, id, clase] = location.hash.replace(/^#/, '').split('/');
  if (p !== 'cursos') return { id: null, clase: null };
  return { id: id ? decodeURIComponent(id) : null, clase: clase ? decodeURIComponent(clase) : null };
}

function vista(v: 'lista' | 'editor') {
  $$('[data-vista]').forEach((x) => (x.hidden = x.dataset.vista !== v));
}

/**
 * Lo que se está enrutando ahora mismo. La primera vez que se abre la pestaña
 * llegan a la vez el arranque y el cambio de `#hash`, y sin esto el curso se
 * cargaría dos veces.
 */
let enrutando: string | null = null;

async function enrutar() {
  if (enrutando === location.hash) return;
  enrutando = location.hash;
  try {
    await enrutarYa();
  } finally {
    enrutando = null;
  }
}

async function enrutarYa() {
  const { id, clase } = leer();
  if (!id || id === 'nuevo') {
    C = null;
    claseId = null;
    vista('lista');
    await cargarLista();
    if (id === 'nuevo') abrirNuevo();
    return;
  }
  if (!C || C.id !== id) {
    const ok = await cargarCurso(id);
    if (!ok) return;
  }
  vista('editor');
  pintarCabecera();
  mostrarSeccion(seccion);
  pintarEsquema();
  if (clase && clase !== claseId) seleccionar(clase, false);
  else if (!clase && claseId) pintarClase();
  else if (!clase && !claseId) {
    const primera = todasLasClases()[0];
    if (primera) seleccionar(primera.id, true);
    else pintarClase();
  }
}

/** Cambiar de sitio con cambios sin guardar pregunta antes. */
function puedeSalir(): boolean {
  if (!sucio) return true;
  return window.confirm('Tienes cambios sin guardar en esta clase. ¿Los descartas?');
}

let ultimoHash = location.hash;
window.addEventListener('hashchange', () => {
  if (!raiz.dataset.arrancado) return;
  if (!location.hash.startsWith('#cursos')) {
    ultimoHash = location.hash;
    return;
  }
  if (sucio && location.hash !== ultimoHash) {
    const mismaClase = leer().clase === claseId && leer().id === C?.id;
    if (!mismaClase && !puedeSalir()) {
      history.replaceState(null, '', ultimoHash);
      return;
    }
    if (!mismaClase) marcarSucio(false);
  }
  ultimoHash = location.hash;
  void enrutar();
});

window.addEventListener('beforeunload', (e) => {
  if (sucio) {
    e.preventDefault();
    e.returnValue = '';
  }
});

/* ==========================================================================
   LA LISTA
   ========================================================================== */

async function cargarLista() {
  const ul = $('[data-lista]');
  const [r, acc] = await Promise.all([
    supabase
      .from('courses')
      .select('*, course_units(id), course_lessons(id)')
      .order('position')
      .order('created_at'),
    supabase.from('course_access').select('course_id'),
  ]);
  ul.textContent = '';
  if (r.error) {
    if (faltanTablas(r.error.message)) {
      $('[data-sin-tablas]').hidden = false;
      nuevoBtn.disabled = true;
    } else {
      ul.append(el('li', { class: 'filas__vacio', text: `No se pudo cargar: ${r.error.message}` }));
    }
    return;
  }
  $('[data-sin-tablas]').hidden = true;
  nuevoBtn.disabled = false;
  const alumnas = new Map<string, number>();
  (acc.data ?? []).forEach((a) => alumnas.set(a.course_id, (alumnas.get(a.course_id) ?? 0) + 1));
  lista = (r.data ?? []).map((c: any) => ({
    ...c,
    unidades: [],
    n_clases: c.course_lessons?.length ?? 0,
    n_alumnas: alumnas.get(c.id) ?? 0,
  }));

  if (!lista.length) {
    ul.append(
      el('li', {
        class: 'filas__vacio soft',
        text: 'Todavía no hay ningún curso. Crea el primero con «Nuevo curso»: puedes armarlo entero en borrador y publicarlo cuando quieras.',
      }),
    );
    return;
  }
  lista.forEach((c) => {
    const abrir = boton('Abrir', { chico: true });
    abrir.addEventListener('click', () => (location.hash = `#cursos/${c.id}`));
    ul.append(
      el(
        'li',
        { class: 'fila' },
        el(
          'div',
          { class: 'fila__txt' },
          el('a', { class: 'fila__t', href: `#cursos/${c.id}`, text: nombreCurso(c) }),
          el(
            'p',
            { class: 'mono soft' },
            [`/${c.slug}/`, `${c.n_clases} clases`, `${c.n_alumnas} alumnas`, c.updated_at ? `editado ${hace(c.updated_at)}` : '']
              .filter(Boolean)
              .join(' · '),
          ),
        ),
        el('span', { class: c.published ? 'estado estado--vivo' : 'estado', text: c.published ? 'Publicado' : 'Borrador' }),
        el('div', { class: 'fila__actos' }, abrir),
      ),
    );
  });
  armarBotones();
}

/* --- Nuevo curso ------------------------------------------------------------ */

const nuevoForm = $<HTMLFormElement>('[data-nuevo-form]');
const nuevoBtn = boton('Nuevo curso', { solido: true });
$('[data-hueco-nuevo]').replaceWith(nuevoBtn);
nuevoBtn.addEventListener('click', () => (nuevoForm.hidden ? abrirNuevo() : (nuevoForm.hidden = true)));

const n = <T extends HTMLInputElement | HTMLSelectElement = HTMLInputElement>(k: string) =>
  $<T>(`[data-n="${k}"]`, nuevoForm);

function abrirNuevo() {
  nuevoForm.reset();
  $('[data-n-error]', nuevoForm).hidden = true;
  const sel = n<HTMLSelectElement>('ficha');
  sel.textContent = '';
  const ya = new Set(lista.map((c) => c.slug));
  CATALOGO.filter((f) => !ya.has(f.slug)).forEach((f) => sel.append(el('option', { value: f.slug, text: f.es })));
  sel.append(el('option', { value: '', text: 'Otro: un curso que todavía no está en Formaciones' }));
  rellenarDesdeFicha();
  nuevoForm.hidden = false;
  nuevoForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

let slugTocado = false;
function rellenarDesdeFicha() {
  const f = CATALOGO.find((x) => x.slug === n<HTMLSelectElement>('ficha').value);
  n('title_es').value = f?.es ?? '';
  n('title_en').value = f?.en ?? '';
  n('slug').value = f?.slug ?? '';
  slugTocado = false;
  ejemploSlug();
}
function ejemploSlug() {
  $('[data-n-ejemplo]', nuevoForm).textContent = `/aulavirtual/curso/${n('slug').value || '…'}/`;
}
n<HTMLSelectElement>('ficha').addEventListener('change', rellenarDesdeFicha);
n('title_es').addEventListener('input', () => {
  if (!slugTocado && !n<HTMLSelectElement>('ficha').value) {
    n('slug').value = aSlug(n('title_es').value);
    ejemploSlug();
  }
});
n('slug').addEventListener('input', () => {
  slugTocado = true;
  ejemploSlug();
});

const crearBtn = boton('Crear el curso', { solido: true, tipo: 'submit' });
const cancelarNuevo = el('button', { class: 'btn-text', type: 'button', text: 'Cancelar' });
cancelarNuevo.addEventListener('click', () => {
  nuevoForm.hidden = true;
  if (location.hash === '#cursos/nuevo') history.replaceState(null, '', '#cursos');
});
$('[data-n-actos]', nuevoForm).append(crearBtn, cancelarNuevo);

nuevoForm.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const err = $('[data-n-error]', nuevoForm);
  err.hidden = true;
  const falla = (t: string) => {
    err.textContent = t;
    err.hidden = false;
  };
  const title_es = n('title_es').value.trim();
  const title_en = n('title_en').value.trim();
  const slug = n('slug').value.trim();
  if (!title_es) return falla('Ponle nombre, por lo menos en español.');
  if (!SLUG_RE.test(slug)) return falla('El nombre corto solo puede llevar minúsculas, números y guiones: «todo-el-diapason».');
  if (lista.some((c) => c.slug === slug)) return falla('Ya hay un curso con ese nombre corto.');

  try {
    await ocupado(crearBtn, 'Creando…', async () => {
      const { data, error } = await supabase
        .from('courses')
        .insert({ slug, title_es, title_en: title_en || title_es, position: lista.length, published: false })
        .select()
        .single();
      if (error) throw error;
      /* Con un bloque ya puesto, para poder empezar a añadir clases sin un
         paso más. Se renombra como Emi quiera. */
      const u = await supabase
        .from('course_units')
        .insert({ course_id: data.id, title_es: 'Bloque 1', title_en: '', position: 0 });
      if (u.error) console.error('[cursos] no se pudo crear el primer bloque', u.error);
      nuevoForm.hidden = true;
      avisar('Curso creado, en borrador');
      location.hash = `#cursos/${data.id}`;
    });
  } catch (e: any) {
    falla(e?.code === '23505' ? 'Ya hay un curso con ese nombre corto.' : `No se pudo crear: ${e?.message ?? e}`);
  }
});

/* ==========================================================================
   EL EDITOR
   ========================================================================== */

async function cargarCurso(id: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('courses')
    .select('*, course_units(*), course_lessons(*)')
    .eq('id', id)
    .maybeSingle();
  if (error || !data) {
    avisar(error ? `No se pudo abrir: ${error.message}` : 'Ese curso no existe');
    location.hash = '#cursos';
    return false;
  }
  const unidades: Unidad[] = [...(data.course_units ?? [])]
    .sort((a: Unidad, b: Unidad) => a.position - b.position)
    .map((u: Unidad) => ({ ...u, clases: [] }));
  const porId = new Map(unidades.map((u) => [u.id, u]));
  [...(data.course_lessons ?? [])]
    .sort((a: Clase, b: Clase) => a.position - b.position)
    .forEach((l: Clase) =>
      porId.get(l.unit_id)?.clases.push({ ...l, materials: Array.isArray(l.materials) ? l.materials : [] }),
    );
  const { course_units: _u, course_lessons: _l, ...resto } = data;
  C = { ...resto, unidades };
  claseId = null;
  seccion = 'clases';
  marcarSucio(false);
  return true;
}

/* --- La cabecera ------------------------------------------------------------- */

function pintarCabecera() {
  if (!C) return;
  $('[data-ed-titulo]').textContent = nombreCurso(C);
  $('[data-ed-slug]').textContent = `Curso · /${C.slug}/`;
  $$('[data-ed-estado] [data-valor]').forEach((b) =>
    b.setAttribute('aria-pressed', String(b.dataset.valor === String(C!.published))),
  );
  const ver = $<HTMLAnchorElement>('[data-ed-ver]');
  ver.href = cursoHref(C.slug, 'es', CON_PAGINA);
  const clases = todasLasClases();
  const sinVideo = clases.filter((l) => !l.video_es && !l.video_en).length;
  const borrador = clases.filter((l) => !l.published).length;
  const partes = [
    C.published
      ? 'Publicado: lo ven las alumnas que lo tienen.'
      : 'En borrador: solo lo ves tú (y Adrián). Las alumnas lo verán al publicarlo.',
    `${C.unidades.length} bloques, ${clases.length} clases`,
  ];
  if (sinVideo) partes.push(`${sinVideo} sin video`);
  if (borrador) partes.push(`${borrador} clases en borrador`);
  $('[data-ed-nota]').textContent = partes.join(' · ');
}

$$('[data-ed-estado] [data-valor]').forEach((b) =>
  b.addEventListener('click', async () => {
    if (!C) return;
    const publicar = b.dataset.valor === 'true';
    if (publicar === C.published) return;
    if (publicar) {
      const clases = todasLasClases();
      const vacias = clases.filter((l) => !l.video_es && !l.video_en && l.published).length;
      const aviso = !clases.length
        ? 'El curso no tiene ninguna clase todavía. ¿Publicarlo igual?'
        : vacias
          ? `Hay ${vacias} clases publicadas sin video. ¿Publicar el curso igual?`
          : '¿Publicar el curso? Lo verán en el aula todas las alumnas que lo tienen.';
      if (!window.confirm(aviso)) return;
    }
    const { error } = await supabase.from('courses').update({ published: publicar }).eq('id', C.id);
    if (error) return avisar(`No se pudo cambiar: ${error.message}`);
    C.published = publicar;
    pintarCabecera();
    avisar(publicar ? 'Curso publicado' : 'Curso en borrador');
  }),
);

/* --- Las secciones: clases, datos, alumnas --------------------------------- */

function mostrarSeccion(s: typeof seccion) {
  seccion = s;
  $$('[data-ed-secciones] [data-seccion]').forEach((b) =>
    b.setAttribute('aria-pressed', String(b.dataset.seccion === s)),
  );
  $$('[data-ed-seccion]').forEach((x) => (x.hidden = x.dataset.edSeccion !== s));
  if (s === 'datos') pintarDatos();
  if (s === 'alumnas') void cargarAlumnas();
}

$$('[data-ed-secciones] [data-seccion]').forEach((b) =>
  b.addEventListener('click', () => {
    if (b.dataset.seccion !== 'clases' && sucio && !puedeSalir()) return;
    if (b.dataset.seccion !== 'clases') marcarSucio(false);
    mostrarSeccion(b.dataset.seccion as typeof seccion);
  }),
);

/* ==========================================================================
   EL ÍNDICE: bloques y clases, ordenar y mover
   ========================================================================== */

async function guardarOrden() {
  if (!C) return;
  const orden = C.unidades.map((u) => ({ unit: u.id, lessons: u.clases.map((l) => l.id) }));
  const { error } = await supabase.rpc('course_reorder', { p_course: C.id, p_orden: orden });
  if (error) {
    avisar(`No se pudo guardar el orden: ${error.message}`);
    await cargarCurso(C.id);
  } else {
    C.unidades.forEach((u, i) => {
      u.position = i;
      u.clases.forEach((l, j) => {
        l.position = j;
        l.unit_id = u.id;
      });
    });
  }
  pintarEsquema();
  pintarCabecera();
  if (claseId) pintarDonde();
}

function mover<T>(arr: T[], de: number, a: number) {
  const [x] = arr.splice(de, 1);
  arr.splice(a, 0, x);
}

function flecha(texto: string, etiqueta: string, desactivado: boolean, fn: () => void) {
  const b = el('button', { class: 'esq-b', type: 'button', 'aria-label': etiqueta, title: etiqueta, text: texto });
  b.disabled = desactivado;
  b.addEventListener('click', (e) => {
    e.stopPropagation();
    fn();
  });
  return b;
}

let arrastre: { tipo: 'u' | 'l'; id: string } | null = null;

function limpiarMarcas() {
  $$('.is-antes, .is-despues, .is-destino, .is-arrastrando').forEach((x) =>
    x.classList.remove('is-antes', 'is-despues', 'is-destino', 'is-arrastrando'),
  );
}

function pintarEsquema() {
  if (!C) return;
  const caja = $('[data-esquema]');
  caja.textContent = '';

  C.unidades.forEach((u, iu) => {
    const sec = el('section', { class: 'esq-u', 'data-u': u.id });

    /* --- La cabecera del bloque --------------------------------------- */
    const cab = el(
      'div',
      { class: 'esq-u__cab', draggable: 'true' },
      el('span', { class: 'mono soft', text: String(iu + 1).padStart(2, '0') }),
      el('span', { class: 'esq-u__t', text: nombreUnidad(u) }),
      el(
        'span',
        { class: 'esq-actos' },
        flecha('↑', 'Subir el bloque', iu === 0, () => {
          mover(C!.unidades, iu, iu - 1);
          void guardarOrden();
        }),
        flecha('↓', 'Bajar el bloque', iu === C.unidades.length - 1, () => {
          mover(C!.unidades, iu, iu + 1);
          void guardarOrden();
        }),
        flecha('Aa', 'Renombrar el bloque', false, () => renombrar.hidden = !renombrar.hidden),
        flecha('×', 'Borrar el bloque', false, () => void borrarUnidad(u)),
      ),
    );
    cab.addEventListener('dragstart', (e) => {
      arrastre = { tipo: 'u', id: u.id };
      sec.classList.add('is-arrastrando');
      e.dataTransfer?.setData('text/plain', u.id);
      if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
    });
    cab.addEventListener('dragend', () => {
      arrastre = null;
      limpiarMarcas();
    });

    /* --- Renombrar ---------------------------------------------------- */
    const inEs = el('input', { type: 'text', value: u.title_es, 'aria-label': 'Nombre del bloque en español', placeholder: 'Nombre · ES' });
    const inEn = el('input', { type: 'text', value: u.title_en, 'aria-label': 'Nombre del bloque en inglés', placeholder: 'Name · EN' });
    const ok = el('button', { class: 'btn-text', type: 'button', text: 'Guardar' });
    const no = el('button', { class: 'btn-text', type: 'button', text: 'Cancelar' });
    const renombrar = el('div', { class: 'esq-renombrar', hidden: true }, inEs, inEn, el('div', { class: 'esq-renombrar__actos' }, ok, no));
    no.addEventListener('click', () => (renombrar.hidden = true));
    const guardarNombre = async () => {
      const title_es = inEs.value.trim();
      const title_en = inEn.value.trim();
      const { error } = await supabase.from('course_units').update({ title_es, title_en }).eq('id', u.id);
      if (error) return avisar(`No se pudo renombrar: ${error.message}`);
      u.title_es = title_es;
      u.title_en = title_en;
      pintarEsquema();
      if (claseId) pintarDonde();
      avisar('Bloque renombrado');
    };
    ok.addEventListener('click', guardarNombre);
    [inEs, inEn].forEach((i) =>
      i.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          void guardarNombre();
        }
      }),
    );

    /* --- Las clases --------------------------------------------------- */
    const ol = el('ol', { class: 'esq-lista', role: 'list', 'data-lista-u': u.id });
    u.clases.forEach((l, il) => {
      const meta: string[] = [];
      if (l.duration_s) meta.push(reloj(l.duration_s));
      if (!l.video_es && !l.video_en) meta.push('sin video');
      else if (!l.video_es || !l.video_en) meta.push(`solo ${l.video_es ? 'ES' : 'EN'}`);
      if (!l.published) meta.push('borrador');
      if (l.materials.length) meta.push(`${l.materials.length} material${l.materials.length > 1 ? 'es' : ''}`);

      const li = el(
        'li',
        {
          class: ['esq-l', l.id === claseId && 'is-aqui', !l.published && 'is-borrador'].filter(Boolean).join(' '),
          draggable: 'true',
          'data-l': l.id,
        },
        el(
          'button',
          { class: 'esq-l__b', type: 'button' },
          el('span', { class: 'esq-l__t', text: nombreClase(l) }),
          meta.length ? el('span', { class: 'esq-l__meta', text: meta.join(' · ') }) : null,
        ),
        el(
          'span',
          { class: 'esq-actos' },
          flecha('↑', 'Subir la clase', iu === 0 && il === 0, () => subirBajar(u, il, -1)),
          flecha('↓', 'Bajar la clase', iu === C!.unidades.length - 1 && il === u.clases.length - 1, () =>
            subirBajar(u, il, 1),
          ),
        ),
      );
      li.querySelector('button')!.addEventListener('click', () => {
        if (l.id === claseId) return;
        location.hash = `#cursos/${C!.id}/${l.id}`;
      });
      li.addEventListener('dragstart', (e) => {
        e.stopPropagation();
        arrastre = { tipo: 'l', id: l.id };
        li.classList.add('is-arrastrando');
        e.dataTransfer?.setData('text/plain', l.id);
        if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
      });
      li.addEventListener('dragend', () => {
        arrastre = null;
        limpiarMarcas();
      });
      li.addEventListener('dragover', (e) => {
        if (arrastre?.tipo !== 'l' || arrastre.id === l.id) return;
        e.preventDefault();
        e.stopPropagation();
        const r = li.getBoundingClientRect();
        const antes = e.clientY < r.top + r.height / 2;
        limpiarMarcas();
        li.classList.add(antes ? 'is-antes' : 'is-despues');
      });
      li.addEventListener('drop', (e) => {
        if (arrastre?.tipo !== 'l') return;
        e.preventDefault();
        e.stopPropagation();
        const r = li.getBoundingClientRect();
        const antes = e.clientY < r.top + r.height / 2;
        soltarClase(arrastre.id, u.id, l.id, antes);
      });
      ol.append(li);
    });

    /* Soltar una clase en el hueco del bloque (vacío, o al final). */
    ol.addEventListener('dragover', (e) => {
      if (arrastre?.tipo !== 'l') return;
      e.preventDefault();
      if (!$$('.is-antes, .is-despues').length) ol.classList.add('is-destino');
    });
    ol.addEventListener('dragleave', () => ol.classList.remove('is-destino'));
    ol.addEventListener('drop', (e) => {
      if (arrastre?.tipo !== 'l') return;
      e.preventDefault();
      soltarClase(arrastre.id, u.id, null, false);
    });

    /* Soltar un bloque sobre otro: se pone delante. */
    sec.addEventListener('dragover', (e) => {
      if (arrastre?.tipo !== 'u' || arrastre.id === u.id) return;
      e.preventDefault();
    });
    sec.addEventListener('drop', (e) => {
      if (arrastre?.tipo !== 'u' || arrastre.id === u.id) return;
      e.preventDefault();
      const de = C!.unidades.findIndex((x) => x.id === arrastre!.id);
      const a = C!.unidades.findIndex((x) => x.id === u.id);
      mover(C!.unidades, de, a);
      arrastre = null;
      limpiarMarcas();
      void guardarOrden();
    });

    /* --- El pie del bloque: añadir ---------------------------------------- */
    const mas = el('button', { class: 'btn-text', type: 'button', text: '+ Clase' });
    mas.addEventListener('click', () => void nuevaClase(u));
    const desdeBunny = el('button', { class: 'btn-text', type: 'button', text: '+ Desde Bunny' });
    desdeBunny.addEventListener('click', () => abrirBunny({ modo: 'importar', unidad: u }));

    sec.append(cab, renombrar, ol, el('div', { class: 'esq-u__pie' }, mas, desdeBunny));
    caja.append(sec);
  });

  const pie = $('[data-esquema-pie]');
  pie.textContent = '';
  const nuevoBloque = el('button', { class: 'btn-text', type: 'button', text: '+ Añadir un bloque' });
  nuevoBloque.addEventListener('click', () => void nuevaUnidad());
  pie.append(nuevoBloque);
}

function subirBajar(u: Unidad, il: number, dir: -1 | 1) {
  if (!C) return;
  const iu = C.unidades.indexOf(u);
  const destino = il + dir;
  if (destino >= 0 && destino < u.clases.length) {
    mover(u.clases, il, destino);
  } else {
    /* Se sale del bloque: pasa al final del anterior o al principio del siguiente. */
    const otra = C.unidades[iu + dir];
    if (!otra) return;
    const [l] = u.clases.splice(il, 1);
    if (dir < 0) otra.clases.push(l);
    else otra.clases.unshift(l);
  }
  void guardarOrden();
}

function soltarClase(id: string, unidadDestino: string, junto: string | null, antes: boolean) {
  if (!C) return;
  arrastre = null;
  limpiarMarcas();
  const origen = C.unidades.find((u) => u.clases.some((l) => l.id === id));
  const destino = C.unidades.find((u) => u.id === unidadDestino);
  if (!origen || !destino) return;
  const [l] = origen.clases.splice(
    origen.clases.findIndex((x) => x.id === id),
    1,
  );
  let i = junto ? destino.clases.findIndex((x) => x.id === junto) : destino.clases.length;
  if (junto && !antes) i += 1;
  destino.clases.splice(Math.max(0, i), 0, l);
  void guardarOrden();
}

async function nuevaUnidad() {
  if (!C) return;
  const n = C.unidades.length + 1;
  const { data, error } = await supabase
    .from('course_units')
    .insert({ course_id: C.id, title_es: `Bloque ${n}`, title_en: '', position: C.unidades.length })
    .select()
    .single();
  if (error) return avisar(`No se pudo añadir: ${error.message}`);
  C.unidades.push({ ...data, clases: [] });
  pintarEsquema();
  pintarCabecera();
  avisar('Bloque añadido');
}

async function borrarUnidad(u: Unidad) {
  if (!C) return;
  const aviso = u.clases.length
    ? `¿Borrar «${nombreUnidad(u)}» y sus ${u.clases.length} clases?\n\nSe borra también el avance de las alumnas en esas clases. No se puede deshacer. Si quieres conservar alguna clase, muévela antes a otro bloque.`
    : `¿Borrar el bloque «${nombreUnidad(u)}»?`;
  if (!window.confirm(aviso)) return;
  const { error } = await supabase.from('course_units').delete().eq('id', u.id);
  if (error) return avisar(`No se pudo borrar: ${error.message}`);
  const ids = new Set(u.clases.map((l) => l.id));
  C.unidades = C.unidades.filter((x) => x.id !== u.id);
  if (claseId && ids.has(claseId)) {
    marcarSucio(false);
    claseId = null;
    history.replaceState(null, '', `#cursos/${C.id}`);
    pintarClase();
  }
  await guardarOrden();
  avisar('Bloque borrado');
}

/** La clase nueva nace publicada si el curso está en borrador (se verá al
    publicarlo), y en borrador si el curso ya está publicado: así no les
    aparece a las alumnas una clase vacía a medio escribir. */
async function nuevaClase(u: Unidad, datos: Partial<Clase> = {}) {
  if (!C) return null;
  if (!puedeSalir()) return null;
  const { data, error } = await supabase
    .from('course_lessons')
    .insert({
      course_id: C.id,
      unit_id: u.id,
      title_es: 'Clase nueva',
      /* Vacío y no «New class»: en el aula en inglés, un título vacío se lee
         en español, que es mejor que un marcador en inglés. */
      title_en: '',
      position: u.clases.length,
      published: !C.published,
      ...datos,
    })
    .select()
    .single();
  if (error) {
    avisar(`No se pudo añadir: ${error.message}`);
    return null;
  }
  const l: Clase = { ...data, materials: [] };
  u.clases.push(l);
  marcarSucio(false);
  pintarEsquema();
  pintarCabecera();
  location.hash = `#cursos/${C.id}/${l.id}`;
  return l;
}

/* ==========================================================================
   LA CLASE
   ========================================================================== */

const form = $<HTMLFormElement>('[data-clase-form]');
const c = <T extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement>(k: string) =>
  $<T>(`[data-c="${k}"]`, form);
let materiales: Material[] = [];
let quitados: string[] = [];
let publicada = true;

function marcarSucio(s: boolean) {
  sucio = s;
  const t = $('[data-clase-sucio]');
  t.textContent = s ? 'Cambios sin guardar' : '';
}

form.addEventListener('input', () => marcarSucio(true));

function pintarDonde() {
  const l = buscarClase(claseId);
  if (!l || !C) return;
  const iu = C.unidades.findIndex((u) => u.id === l.unit_id);
  const u = C.unidades[iu];
  const il = u ? u.clases.findIndex((x) => x.id === l.id) : -1;
  $('[data-clase-donde]').textContent = u
    ? `${nombreUnidad(u)} · Clase ${il + 1}${l.updated_at ? ` · editada ${hace(l.updated_at)}` : ''}`
    : '';
}

function seleccionar(id: string, mueveHash: boolean) {
  const l = buscarClase(id);
  if (!l || !C) return;
  claseId = id;
  if (mueveHash) history.replaceState(null, '', `#cursos/${C.id}/${id}`);
  ultimoHash = location.hash;
  pintarEsquema();
  pintarClase();
}

function estadoClase(p: boolean) {
  publicada = p;
  $$('[data-clase-estado] [data-valor]', form).forEach((b) =>
    b.setAttribute('aria-pressed', String(b.dataset.valor === String(p))),
  );
}

$$('[data-clase-estado] [data-valor]', form).forEach((b) =>
  b.addEventListener('click', () => {
    estadoClase(b.dataset.valor === 'true');
    marcarSucio(true);
  }),
);

function pintarClase() {
  const l = buscarClase(claseId);
  $('[data-clase-vacia]').hidden = Boolean(l);
  form.hidden = !l;
  if (!l) return;
  pintarDonde();
  (['title_es', 'title_en', 'summary_es', 'summary_en', 'video_es', 'video_en'] as const).forEach(
    (k) => (c(k).value = (l[k] as string | null) ?? ''),
  );
  c('duracion').value = l.duration_s ? reloj(l.duration_s) : '';
  estadoClase(l.published);
  materiales = l.materials.map((m) => ({ ...m }));
  quitados = [];
  pintarMateriales();
  (['es', 'en'] as const).forEach((x) => {
    estadoVideo(x);
    const p = $(`[data-video-prueba="${x}"]`, form);
    p.hidden = true;
    p.textContent = '';
  });
  $('[data-clase-error]').hidden = true;
  marcarSucio(false);
}

/* --- El video ------------------------------------------------------------------ */

function estadoVideo(l: 'es' | 'en') {
  const v = c(`video_${l}`).value.trim();
  const e = videoEmbed(v);
  const t = $(`[data-video-estado="${l}"]`, form);
  if (!v) t.textContent = l === 'es' ? 'Sin video todavía.' : 'Sin video en inglés: en el aula en inglés se verá el de español.';
  else if (e.ok) t.textContent = e.provider === 'bunny' ? `Bunny · ${bunnyGuid(v)}` : 'Vimeo (contenido antiguo)';
  else t.textContent = 'No reconozco ese enlace. Pega el «Embed» del video en Bunny.';
}

(['es', 'en'] as const).forEach((l) => {
  c(`video_${l}`).addEventListener('input', () => estadoVideo(l));
  $(`[data-probar="${l}"]`, form).addEventListener('click', () => {
    const caja = $(`[data-video-prueba="${l}"]`, form);
    if (!caja.hidden) {
      caja.hidden = true;
      caja.textContent = '';
      return;
    }
    const e = videoEmbed(c(`video_${l}`).value);
    if (!e.ok) return avisar('No hay un video que probar');
    caja.textContent = '';
    caja.append(el('iframe', { src: e.src, allow: e.allow, allowfullscreen: true, title: 'Prueba del video', loading: 'lazy' }));
    caja.hidden = false;
  });
  $(`[data-elegir="${l}"]`, form).addEventListener('click', () => abrirBunny({ modo: 'elegir', lang: l }));
});

/* --- Los materiales ------------------------------------------------------------ */

function pintarMateriales() {
  const ul = $('[data-materiales]', form);
  ul.textContent = '';
  if (!materiales.length) {
    ul.append(el('li', { class: 'soft', text: 'Esta clase no tiene material.' }));
    return;
  }
  materiales.forEach((m) => {
    const es = el('input', { type: 'text', value: m.nombre_es, placeholder: 'Nombre · ES', 'aria-label': 'Nombre en español' });
    const en = el('input', { type: 'text', value: m.nombre_en, placeholder: 'Name · EN', 'aria-label': 'Nombre en inglés' });
    const lang = el(
      'select',
      { 'aria-label': 'Para qué idioma' },
      el('option', { value: 'ambos', text: 'Los dos' }),
      el('option', { value: 'es', text: 'Solo ES' }),
      el('option', { value: 'en', text: 'Solo EN' }),
    );
    lang.value = m.lang;
    const quitar = el('button', { class: 'btn-text', type: 'button', text: 'Quitar' });
    es.addEventListener('input', () => (m.nombre_es = es.value));
    en.addEventListener('input', () => (m.nombre_en = en.value));
    lang.addEventListener('change', () => {
      m.lang = lang.value as Material['lang'];
      marcarSucio(true);
    });
    quitar.addEventListener('click', () => {
      if (m.path) quitados.push(m.path);
      materiales = materiales.filter((x) => x !== m);
      marcarSucio(true);
      pintarMateriales();
    });
    const fuente = m._fichero
      ? `Se sube al guardar: ${m._fichero.name}`
      : m.path
        ? `Archivo: ${m.path.split('/').pop()}`
        : `Enlace: ${m.url}`;
    ul.append(el('li', { class: 'mat' }, es, en, lang, quitar, el('span', { class: 'mat__fuente', text: fuente })));
  });
}

$<HTMLInputElement>('[data-material-archivo]', form).addEventListener('change', (e) => {
  const input = e.target as HTMLInputElement;
  Array.from(input.files ?? []).forEach((f) => {
    const nombre = f.name.replace(/\.[^.]+$/, '');
    materiales.push({ id: uid(), nombre_es: nombre, nombre_en: nombre, lang: 'ambos', _fichero: f });
  });
  input.value = '';
  marcarSucio(true);
  pintarMateriales();
});

$('[data-material-enlace]', form).addEventListener('click', () => {
  const url = window.prompt('Pega el enlace (una partitura en Drive, una pista…):');
  if (!url) return;
  if (!/^https?:\/\//i.test(url.trim())) return avisar('El enlace tiene que empezar por https://');
  materiales.push({ id: uid(), nombre_es: 'Material', nombre_en: 'Material', lang: 'ambos', url: url.trim() });
  marcarSucio(true);
  pintarMateriales();
});

/* --- Guardar, duplicar, borrar ------------------------------------------------ */

const guardarBtn = boton('Guardar la clase', { solido: true, tipo: 'submit' });
const duplicarBtn = el('button', { class: 'btn-text', type: 'button', text: 'Duplicar' });
const borrarBtn = el('button', { class: 'btn-text', type: 'button', text: 'Borrar la clase' });
$('[data-clase-actos]', form).append(guardarBtn, duplicarBtn, borrarBtn);
armarBotones();

async function guardarClase(): Promise<boolean> {
  const l = buscarClase(claseId);
  if (!l || !C) return false;
  const err = $('[data-clase-error]');
  err.hidden = true;
  const falla = (t: string) => {
    err.textContent = t;
    err.hidden = false;
    return false;
  };
  const title_es = c('title_es').value.trim();
  const title_en = c('title_en').value.trim();
  if (!title_es && !title_en) return falla('La clase necesita un título, por lo menos en un idioma.');
  const dur = aSegundos(c('duracion').value);
  if (dur !== null && (Number.isNaN(dur) || dur < 0)) return falla('La duración va en minutos y segundos: «12:34».');

  let ok = false;
  await ocupado(guardarBtn, 'Guardando…', async () => {
    try {
      /* Primero los ficheros nuevos, a su carpeta: `<curso>/<clase>/…`. La
         política del bucket lee la primera carpeta para saber de qué curso es. */
      for (const m of materiales) {
        if (!m._fichero) continue;
        const limpio = m._fichero.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w.-]+/g, '_');
        const ruta = `${C!.id}/${l.id}/${Date.now()}_${limpio}`;
        const up = await supabase.storage.from('cursos').upload(ruta, m._fichero, {
          contentType: m._fichero.type || undefined,
          upsert: false,
        });
        if (up.error) throw new Error(`«${m._fichero.name}»: ${up.error.message}`);
        m.path = ruta;
        delete m._fichero;
      }
      const fila = {
        title_es,
        title_en,
        summary_es: c<HTMLTextAreaElement>('summary_es').value.trim() || null,
        summary_en: c<HTMLTextAreaElement>('summary_en').value.trim() || null,
        video_es: normalizeVideoUrl(c('video_es').value),
        video_en: normalizeVideoUrl(c('video_en').value),
        duration_s: dur,
        published: publicada,
        materials: materiales.map(({ _fichero, ...m }) => m),
      };
      const { data, error } = await supabase.from('course_lessons').update(fila).eq('id', l.id).select().single();
      if (error) throw error;
      Object.assign(l, data, { materials: Array.isArray(data.materials) ? data.materials : [] });
      /* Los ficheros quitados se borran después de guardar, no antes: si el
         guardado fallara, la clase seguiría apuntando a ellos. */
      if (quitados.length) {
        const q = await supabase.storage.from('cursos').remove(quitados);
        if (q.error) console.error('[cursos] no se pudieron borrar ficheros', q.error);
      }
      ok = true;
    } catch (e: any) {
      falla(`No se pudo guardar: ${e?.message ?? e}`);
    }
  });
  if (!ok) return false;
  marcarSucio(false);
  pintarClase();
  pintarEsquema();
  pintarCabecera();
  avisar('Clase guardada');
  return true;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  void guardarClase();
});

/* Cmd/Ctrl + S guarda la clase abierta. */
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's' && !form.hidden && raiz.offsetParent !== null) {
    e.preventDefault();
    void guardarClase();
  }
});

duplicarBtn.addEventListener('click', async () => {
  const l = buscarClase(claseId);
  if (!l || !C) return;
  if (sucio && !window.confirm('La copia se hace de lo último guardado, sin los cambios de ahora. ¿Seguir?')) return;
  const u = C.unidades.find((x) => x.id === l.unit_id);
  if (!u) return;
  const { id: _id, updated_at: _up, position: _pos, ...resto } = l as Clase & { created_at?: string };
  delete (resto as any).created_at;
  const { data, error } = await supabase
    .from('course_lessons')
    .insert({
      ...resto,
      title_es: l.title_es ? `${l.title_es} (copia)` : '',
      title_en: l.title_en ? `${l.title_en} (copy)` : '',
      published: false,
      /* Los materiales de archivo no se duplican: los ficheros viven en la
         carpeta de la clase original. Los enlaces sí. */
      materials: l.materials.filter((m) => m.url && !m.path),
      position: u.clases.length,
    })
    .select()
    .single();
  if (error) return avisar(`No se pudo duplicar: ${error.message}`);
  const copia: Clase = { ...data, materials: Array.isArray(data.materials) ? data.materials : [] };
  u.clases.splice(u.clases.indexOf(l) + 1, 0, copia);
  marcarSucio(false);
  await guardarOrden();
  location.hash = `#cursos/${C.id}/${copia.id}`;
  avisar('Copia creada, en borrador');
});

borrarBtn.addEventListener('click', async () => {
  const l = buscarClase(claseId);
  if (!l || !C) return;
  if (
    !window.confirm(
      `¿Borrar «${nombreClase(l)}» para siempre?\n\nSe borran también su material y el avance de las alumnas en esta clase. No se puede deshacer. Si solo quieres esconderla, ponla en borrador.`,
    )
  )
    return;
  const { error } = await supabase.from('course_lessons').delete().eq('id', l.id);
  if (error) return avisar(`No se pudo borrar: ${error.message}`);
  const rutas = l.materials.map((m) => m.path).filter(Boolean) as string[];
  if (rutas.length) void supabase.storage.from('cursos').remove(rutas);
  C.unidades.forEach((u) => (u.clases = u.clases.filter((x) => x.id !== l.id)));
  marcarSucio(false);
  claseId = null;
  await guardarOrden();
  const primera = todasLasClases()[0];
  if (primera) location.hash = `#cursos/${C.id}/${primera.id}`;
  else {
    history.replaceState(null, '', `#cursos/${C.id}`);
    pintarClase();
  }
  avisar('Clase borrada');
});

/* ==========================================================================
   DATOS DEL CURSO
   ========================================================================== */

const datosForm = $<HTMLFormElement>('[data-datos-form]');
const d = <T extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement>(k: string) =>
  $<T>(`[data-d="${k}"]`, datosForm);

function pintarDatos() {
  if (!C) return;
  (['title_es', 'title_en', 'summary_es', 'summary_en', 'slug'] as const).forEach(
    (k) => (d(k).value = (C![k] as string | null) ?? ''),
  );
  $('[data-datos-error]').hidden = true;
}

const guardarDatos = boton('Guardar los datos', { solido: true, tipo: 'submit' });
$('[data-datos-actos]', datosForm).append(guardarDatos);

datosForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!C) return;
  const err = $('[data-datos-error]');
  err.hidden = true;
  const slug = d('slug').value.trim();
  if (!d('title_es').value.trim()) {
    err.textContent = 'El curso necesita nombre, por lo menos en español.';
    err.hidden = false;
    return;
  }
  if (!SLUG_RE.test(slug)) {
    err.textContent = 'El nombre corto solo puede llevar minúsculas, números y guiones.';
    err.hidden = false;
    return;
  }
  if (slug !== C.slug && !window.confirm('Cambiar el nombre corto cambia la dirección del curso en el aula. ¿Seguir?')) return;
  await ocupado(guardarDatos, 'Guardando…', async () => {
    const fila = {
      title_es: d('title_es').value.trim(),
      title_en: d('title_en').value.trim(),
      summary_es: d<HTMLTextAreaElement>('summary_es').value.trim() || null,
      summary_en: d<HTMLTextAreaElement>('summary_en').value.trim() || null,
      slug,
    };
    const { error } = await supabase.from('courses').update(fila).eq('id', C!.id);
    if (error) {
      err.textContent = error.code === '23505' ? 'Ya hay otro curso con ese nombre corto.' : `No se pudo guardar: ${error.message}`;
      err.hidden = false;
      return;
    }
    Object.assign(C!, fila);
    pintarCabecera();
    avisar('Datos guardados');
  });
});

$('[data-borrar-curso]', datosForm).addEventListener('click', async () => {
  if (!C) return;
  const escrito = window.prompt(
    `Esto borra «${nombreCurso(C)}» con todas sus clases, sus materiales, el avance de las alumnas y quién lo tiene.\n\nPara confirmarlo, escribe su nombre corto: ${C.slug}`,
  );
  if (escrito === null) return;
  if (escrito.trim() !== C.slug) return avisar('No coincide: no se borró nada');
  const rutas = todasLasClases().flatMap((l) => l.materials.map((m) => m.path).filter(Boolean) as string[]);
  const { error } = await supabase.from('courses').delete().eq('id', C.id);
  if (error) return avisar(`No se pudo borrar: ${error.message}`);
  if (rutas.length) void supabase.storage.from('cursos').remove(rutas);
  C = null;
  marcarSucio(false);
  avisar('Curso borrado');
  location.hash = '#cursos';
});

/* ==========================================================================
   ALUMNAS
   ========================================================================== */

const accesoForm = $<HTMLFormElement>('[data-acceso-form]');
const darBtn = boton('Dar acceso', { tipo: 'submit' });
$('[data-acceso-actos]', accesoForm).append(darBtn);

async function cargarAlumnas() {
  if (!C) return;
  const ul = $('[data-alumnas]');
  ul.textContent = '';
  ul.append(el('li', { class: 'filas__vacio soft', text: 'Cargando…' }));
  const [acc, prog] = await Promise.all([
    supabase
      .from('course_access')
      .select('user_id, source, granted_at, profiles(email, full_name)')
      .eq('course_id', C.id)
      .order('granted_at', { ascending: false }),
    supabase.from('course_progress').select('user_id, completed, updated_at').eq('course_id', C.id),
  ]);
  ul.textContent = '';
  if (acc.error) {
    ul.append(el('li', { class: 'filas__vacio', text: `No se pudo cargar: ${acc.error.message}` }));
    return;
  }
  const total = todasLasClases().filter((l) => l.published).length;
  const avance = new Map<string, { hechas: number; ultima: string | null }>();
  (prog.data ?? []).forEach((p) => {
    const a = avance.get(p.user_id) ?? { hechas: 0, ultima: null };
    if (p.completed) a.hechas++;
    if (!a.ultima || p.updated_at > a.ultima) a.ultima = p.updated_at;
    avance.set(p.user_id, a);
  });
  if (!acc.data?.length) {
    ul.append(el('li', { class: 'filas__vacio soft', text: 'Nadie tiene este curso todavía.' }));
    return;
  }
  const FUENTE: Record<string, string> = { manual: 'a mano', stripe: 'Stripe', paypal: 'PayPal' };
  acc.data.forEach((a: any) => {
    const p = a.profiles ?? {};
    const av = avance.get(a.user_id);
    const quitar = el('button', { class: 'btn-text', type: 'button', text: 'Quitar acceso' });
    quitar.addEventListener('click', async () => {
      if (!window.confirm(`¿Quitarle el curso a ${p.email ?? 'esta persona'}? Deja de verlo en el acto. Su avance se conserva por si se lo vuelves a dar.`))
        return;
      const { error } = await supabase.from('course_access').delete().eq('course_id', C!.id).eq('user_id', a.user_id);
      if (error) return avisar(`No se pudo quitar: ${error.message}`);
      avisar('Acceso quitado');
      void cargarAlumnas();
    });
    ul.append(
      el(
        'li',
        { class: 'fila' },
        el(
          'div',
          { class: 'fila__txt' },
          el('p', { class: 'fila__t', text: p.full_name || p.email || '(sin nombre)' }),
          el(
            'p',
            { class: 'mono-plain soft' },
            [
              p.full_name ? p.email : '',
              `${FUENTE[a.source] ?? a.source} · desde el ${new Date(a.granted_at).toLocaleDateString('es-ES')}`,
              av?.ultima ? `última vez ${hace(av.ultima)}` : 'todavía no ha entrado',
            ]
              .filter(Boolean)
              .join(' · '),
          ),
        ),
        el('span', { class: 'mono tnum', text: `${av?.hechas ?? 0} / ${total} clases` }),
        el('div', { class: 'fila__actos' }, quitar),
      ),
    );
  });
}

accesoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!C) return;
  const err = $('[data-acceso-error]');
  err.hidden = true;
  const correo = $<HTMLInputElement>('[data-acceso-email]', accesoForm).value.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) {
    err.textContent = 'Escribe un correo válido.';
    err.hidden = false;
    return;
  }
  await ocupado(darBtn, 'Dando acceso…', async () => {
    const { data: perfil, error } = await supabase.from('profiles').select('id').eq('email', correo).maybeSingle();
    if (error || !perfil) {
      err.textContent = error
        ? `No se pudo buscar: ${error.message}`
        : 'No hay ninguna cuenta con ese correo. Tiene que entrar una vez por la pantalla de acceso del aula (pidiendo el enlace de «primera vez») y después se lo das.';
      err.hidden = false;
      return;
    }
    const r = await supabase
      .from('course_access')
      .upsert({ user_id: perfil.id, course_id: C!.id, source: 'manual' }, { onConflict: 'user_id,course_id', ignoreDuplicates: true });
    if (r.error) {
      err.textContent = `No se pudo dar acceso: ${r.error.message}`;
      err.hidden = false;
      return;
    }
    accesoForm.reset();
    avisar('Acceso dado');
    await cargarAlumnas();
  });
});

/* ==========================================================================
   BUNNY: elegir un video, o crear clases a partir de varios
   ========================================================================== */

const dlg = $<HTMLDialogElement>('[data-bunny]');
let bunnyModo: { modo: 'elegir'; lang: 'es' | 'en' } | { modo: 'importar'; unidad: Unidad } | null = null;
let bunnyVideos: VideoBunny[] = [];
let bunnyCargado = false;
const elegidos = new Set<string>();
const importarBtn = boton('Crear las clases', { solido: true });
$('[data-bunny-hueco]', dlg).replaceWith(importarBtn);

async function token() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? '';
}

async function cargarBunny() {
  const estado = $('[data-bunny-estado]', dlg);
  estado.textContent = 'Leyendo tu biblioteca…';
  try {
    const r = await fetch('/api/panel/bunny', { headers: { Authorization: `Bearer ${await token()}` } });
    const j = await r.json().catch(() => ({}));
    if (r.status === 401) throw new Error('El servidor no reconoce tu sesión de admin.');
    if (j.configurado === false) {
      estado.textContent =
        'Falta la clave de la biblioteca de Bunny en Vercel (BUNNY_STREAM_API_KEY). Mientras tanto, pega el «Embed» de cada video a mano: funciona igual.';
      return;
    }
    if (!r.ok || j.error) throw new Error(j.error || `Error ${r.status}`);
    bunnyVideos = j.videos ?? [];
    const sel = $<HTMLSelectElement>('[data-bunny-coleccion]', dlg);
    sel.textContent = '';
    sel.append(el('option', { value: '', text: `Todas (${bunnyVideos.length})` }));
    (j.colecciones ?? []).forEach((col: { guid: string; nombre: string; videos: number }) =>
      sel.append(el('option', { value: col.guid, text: `${col.nombre} (${col.videos})` })),
    );
    bunnyCargado = true;
    pintarBunny();
  } catch (e) {
    estado.textContent = `No se pudo leer la biblioteca: ${(e as Error).message}`;
  }
}

function pintarBunny() {
  const ul = $('[data-bunny-lista]', dlg);
  ul.textContent = '';
  const col = $<HTMLSelectElement>('[data-bunny-coleccion]', dlg).value;
  const q = $<HTMLInputElement>('[data-bunny-buscar]', dlg).value.trim().toLowerCase();
  const usados = new Set(todasLasClases().flatMap((l) => [bunnyGuid(l.video_es), bunnyGuid(l.video_en)]).filter(Boolean));
  const vistos = bunnyVideos.filter((v) => (!col || v.coleccion === col) && (!q || v.titulo.toLowerCase().includes(q)));
  const multi = bunnyModo?.modo === 'importar';
  $('[data-bunny-estado]', dlg).textContent = vistos.length
    ? multi
      ? 'Marca los videos: se crea una clase por cada uno, en este orden, con su título y su duración.'
      : 'Pulsa un video para ponerlo en la clase.'
    : 'No hay videos que coincidan.';
  vistos.forEach((v) => {
    const meta = [reloj(v.segundos), v.listo ? '' : 'todavía procesándose', usados.has(v.guid) ? 'ya está en este curso' : '']
      .filter(Boolean)
      .join(' · ');
    const li = el(
      'li',
      { class: 'bv', tabindex: multi ? undefined : '0', role: multi ? undefined : 'button' },
      multi ? el('input', { type: 'checkbox', 'aria-label': v.titulo, checked: elegidos.has(v.guid) }) : v.miniatura ? el('img', { src: v.miniatura, alt: '' }) : el('span'),
      el('span', {}, el('span', { class: 'bv__t', text: v.titulo }), el('br'), el('span', { class: 'mono soft', text: meta })),
      multi && v.miniatura ? el('img', { src: v.miniatura, alt: '' }) : el('span'),
    );
    const alternar = () => {
      if (multi) {
        const cb = li.querySelector('input')!;
        if (elegidos.has(v.guid)) elegidos.delete(v.guid);
        else elegidos.add(v.guid);
        cb.checked = elegidos.has(v.guid);
        contarElegidos();
      } else elegirVideo(v);
    };
    li.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') {
        e.stopPropagation();
        if (elegidos.has(v.guid)) elegidos.delete(v.guid);
        else elegidos.add(v.guid);
        contarElegidos();
        return;
      }
      alternar();
    });
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        alternar();
      }
    });
    ul.append(li);
  });
}

function contarElegidos() {
  const lbl = importarBtn.querySelector('.boton__label')!;
  lbl.textContent = elegidos.size ? `Crear ${elegidos.size} ${elegidos.size === 1 ? 'clase' : 'clases'}` : 'Crear las clases';
  importarBtn.disabled = elegidos.size === 0;
}

function abrirBunny(m: NonNullable<typeof bunnyModo>) {
  if (m.modo === 'importar' && !puedeSalir()) return;
  bunnyModo = m;
  elegidos.clear();
  contarElegidos();
  importarBtn.hidden = m.modo !== 'importar';
  $('[data-bunny-para]', dlg).textContent =
    m.modo === 'elegir'
      ? `Video en ${m.lang === 'es' ? 'español' : 'inglés'} · ${nombreClase(buscarClase(claseId) ?? { title_es: '', title_en: '' })}`
      : `Clases nuevas en «${nombreUnidad(m.unidad)}»`;
  dlg.showModal();
  armarBotones();
  if (!bunnyCargado) void cargarBunny();
  else pintarBunny();
}

function elegirVideo(v: VideoBunny) {
  if (bunnyModo?.modo !== 'elegir') return;
  const l = bunnyModo.lang;
  c(`video_${l}`).value = bunnyUrl(v.guid) ?? v.guid;
  if (!c('duracion').value && v.segundos) c('duracion').value = reloj(v.segundos);
  const titulo = c(`title_${l}`);
  if (l === 'es' && (!titulo.value.trim() || titulo.value.trim() === 'Clase nueva')) titulo.value = v.titulo;
  estadoVideo(l);
  marcarSucio(true);
  dlg.close();
  avisar('Video puesto: falta guardar la clase');
}

importarBtn.addEventListener('click', async () => {
  if (bunnyModo?.modo !== 'importar' || !C || !elegidos.size) return;
  const u = bunnyModo.unidad;
  /* En el orden de la lista (el de los títulos en Bunny), no en el del clic. */
  const videos = bunnyVideos.filter((v) => elegidos.has(v.guid));
  await ocupado(importarBtn, 'Creando…', async () => {
    const filas = videos.map((v, i) => ({
      course_id: C!.id,
      unit_id: u.id,
      title_es: v.titulo,
      title_en: '',
      video_es: bunnyUrl(v.guid),
      duration_s: v.segundos || null,
      position: u.clases.length + i,
      published: !C!.published,
    }));
    const { data, error } = await supabase.from('course_lessons').insert(filas).select();
    if (error) return avisar(`No se pudieron crear: ${error.message}`);
    (data ?? [])
      .sort((a: Clase, b: Clase) => a.position - b.position)
      .forEach((l: Clase) => u.clases.push({ ...l, materials: [] }));
    dlg.close();
    pintarEsquema();
    pintarCabecera();
    avisar(`${data?.length ?? 0} clases creadas: faltan los títulos en inglés`);
    const primera = data?.[0];
    if (primera) location.hash = `#cursos/${C!.id}/${primera.id}`;
  });
});

$('[data-bunny-cerrar]', dlg).addEventListener('click', () => dlg.close());
$('[data-bunny-coleccion]', dlg).addEventListener('change', pintarBunny);
$('[data-bunny-buscar]', dlg).addEventListener('input', pintarBunny);

/* ==========================================================================
   Arranque
   ========================================================================== */

alAbrir('cursos', async () => {
  raiz.dataset.arrancado = '1';
  if (!isSupabaseConfigured) {
    const ul = $('[data-lista]');
    ul.textContent = '';
    ul.append(el('li', { class: 'filas__vacio soft', text: 'Sin conectar: no hay de dónde leer los cursos.' }));
    nuevoBtn.disabled = true;
    return;
  }
  await enrutar();
});
