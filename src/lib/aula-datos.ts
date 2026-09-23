/**
 * Los datos del aula, del lado de la alumna: qué cursos tiene, qué hay dentro,
 * por dónde va y qué le preguntó a Emi.
 *
 * **Desde el 23 sep 2026 el contenido de los cursos vive en Supabase**, lo
 * carga Emi desde su panel (pestaña Cursos) y llega a la pantalla por consulta,
 * con la RLS decidiendo —ver `supabase/migrations/0009_cursos.sql`—. Hasta ese
 * día las clases iban escritas en el HTML (`src/data/cursos.ts`), y
 * `progreso.md` lo tenía marcado como lo que había que cerrar antes de que
 * entrara un curso de verdad: con el HTML, cualquiera con la consola abierta
 * veía el curso entero. Ahora una alumna sin el curso recibe una lista vacía,
 * porque la base de datos no se lo da.
 *
 * Hay dos maneras de contestar, con la misma forma:
 *
 *   · `supabase`: la de verdad.
 *   · `maqueta`: cuando faltan las variables de Supabase (en local, o en una
 *     vista previa sin ellas). Enseña el curso de muestra de `cursos.ts` y
 *     guarda el avance en este navegador, para que el aula se pueda mirar y
 *     probar entera. **No enseña nada real**: el contenido real solo existe en
 *     la base de datos.
 *
 * Las pantallas no saben cuál de las dos tienen delante. Es el mismo trato que
 * tenía `window.Aula` en la maqueta de septiembre, ya sin `window`.
 */
import { supabase, isSupabaseConfigured } from './supabase';
import { cursos as cursosDeMuestra } from '../data/cursos';

/* ==========================================================================
   Las formas — las filas de las tablas, tal cual
   ========================================================================== */

export type Material = {
  id: string;
  nombre_es: string;
  nombre_en: string;
  /** Ruta en el bucket privado «cursos». */
  path?: string;
  /** O un enlace de fuera (una partitura en Drive, una pista). */
  url?: string;
  /** Para qué idioma es. `ambos` sale en los dos. */
  lang: 'es' | 'en' | 'ambos';
};

export type Clase = {
  id: string;
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
};

export type Unidad = {
  id: string;
  title_es: string;
  title_en: string;
  position: number;
  clases: Clase[];
};

export type Curso = {
  id: string;
  slug: string;
  title_es: string;
  title_en: string;
  summary_es: string | null;
  summary_en: string | null;
  published: boolean;
  position: number;
  unidades: Unidad[];
};

/** El avance en una clase. `ts` es cuándo se tocó por última vez (ms). */
export type Avance = { s: number; d: number; hecho: boolean; ts: number };

export type Pregunta = {
  id: string;
  course_id: string;
  lesson_id: string | null;
  minute_s: number | null;
  body: string;
  answer: string | null;
  answered_at: string | null;
  /** Las respuestas en video y en audio de Emi (migración 0010). */
  answer_video?: string | null;
  answer_audio_path?: string | null;
  answer_seen_at?: string | null;
  created_at: string;
};

/** Lo que el portón necesita saber de quien entra. */
export type Acceso = {
  sesion: boolean;
  admin: boolean;
  /** Tiene la membresía al día (`has_active_sub()`). */
  membresia: boolean;
  /** Tiene al menos un curso. */
  cursos: boolean;
  /** La comprobación de la suscripción falló (red, Supabase…). */
  dudoso: boolean;
  nombre: string | null;
  uid: string | null;
};

const VACIO: Avance = { s: 0, d: 0, hecho: false, ts: 0 };

/** Pasado el 92 % la clase se da por vista sola: los créditos no los mira nadie. */
const UMBRAL_VISTA = 0.92;

/* ==========================================================================
   Utilidades que no dependen del modo
   ========================================================================== */

/** Todas las clases de un curso, en el orden en que se estudian. */
export const clasesDe = (c: Curso): Clase[] => c.unidades.flatMap((u) => u.clases);

/** `mm:ss` o `h:mm:ss`. Sin dato, cadena vacía; en el segundo cero, `0:00`. */
export function reloj(s?: number | null): string {
  if (s == null || Number.isNaN(s) || s < 0) return '';
  const seg = Math.floor(s % 60);
  const min = Math.floor((s / 60) % 60);
  const hor = Math.floor(s / 3600);
  const dos = (n: number) => String(n).padStart(2, '0');
  return hor > 0 ? `${hor}:${dos(min)}:${dos(seg)}` : `${min}:${dos(seg)}`;
}

/** Ordena unidades y clases por `position` y reparte las clases en su unidad. */
function armarCurso(fila: any): Curso {
  const unidades: Unidad[] = [...(fila.course_units ?? [])]
    .sort((a, b) => a.position - b.position)
    .map((u) => ({ ...u, clases: [] as Clase[] }));
  const porId = new Map(unidades.map((u) => [u.id, u]));
  [...(fila.course_lessons ?? [])]
    .sort((a, b) => a.position - b.position)
    .forEach((l) => {
      const u = porId.get(l.unit_id);
      if (u) u.clases.push({ ...l, materials: Array.isArray(l.materials) ? l.materials : [] });
    });
  const { course_units: _u, course_lessons: _l, ...resto } = fila;
  return { ...resto, unidades };
}

/* ==========================================================================
   El modo de verdad: Supabase
   ========================================================================== */

const CAMPOS_CURSO =
  'id, slug, title_es, title_en, summary_es, summary_en, published, position, ' +
  'course_units(id, title_es, title_en, position), ' +
  'course_lessons(id, unit_id, title_es, title_en, summary_es, summary_en, video_es, video_en, duration_s, materials, published, position)';

async function uid(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user.id ?? null;
}

const CAMPOS_PREGUNTA = 'id, course_id, lesson_id, minute_s, body, answer, answered_at, created_at';

const deSupabase = {
  modo: 'supabase' as const,

  async acceso(): Promise<Acceso> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const base: Acceso = {
      sesion: false,
      admin: false,
      membresia: false,
      cursos: false,
      dudoso: false,
      nombre: null,
      uid: null,
    };
    if (!session) return base;

    const id = session.user.id;
    /* Las tres preguntas a la vez: en serie son tres viajes con el portón
       puesto delante, y eso se nota en una conexión lenta. */
    const [perfil, sub, cursos] = await Promise.all([
      supabase.from('profiles').select('role, full_name').eq('id', id).maybeSingle(),
      supabase.rpc('has_active_sub'),
      supabase
        .from('course_access')
        .select('course_id', { count: 'exact', head: true })
        .eq('user_id', id),
    ]);

    if (sub.error) console.error('[aula] no se pudo comprobar la suscripción', sub.error);
    if (cursos.error) console.error('[aula] no se pudo comprobar los cursos', cursos.error);

    return {
      sesion: true,
      admin: perfil.data?.role === 'admin',
      membresia: sub.data === true,
      cursos: (cursos.count ?? 0) > 0,
      dudoso: Boolean(sub.error),
      nombre: perfil.data?.full_name ?? null,
      uid: id,
    };
  },

  /** Los cursos que ve quien está dentro. La RLS decide cuáles son. */
  async misCursos(): Promise<Curso[]> {
    const { data, error } = await supabase.from('courses').select(CAMPOS_CURSO).order('position');
    if (error) throw error;
    return (data ?? []).map(armarCurso);
  },

  async curso(slug: string): Promise<Curso | null> {
    const { data, error } = await supabase
      .from('courses')
      .select(CAMPOS_CURSO)
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    return data ? armarCurso(data) : null;
  },

  /**
   * Todo el avance de quien está dentro, por clase.
   *
   * ⚠️ **Con el filtro por `user_id`, siempre.** La RLS deja a Emi leer el
   * avance de TODAS las alumnas —lo necesita el panel—, así que sin el filtro
   * su escritorio sumaría el de todo el mundo.
   */
  async avance(): Promise<Record<string, Avance & { curso: string }>> {
    const id = await uid();
    if (!id) return {};
    const { data, error } = await supabase
      .from('course_progress')
      .select('lesson_id, course_id, position_s, duration_s, completed, updated_at')
      .eq('user_id', id);
    if (error) throw error;
    const out: Record<string, Avance & { curso: string }> = {};
    (data ?? []).forEach((f) => {
      out[f.lesson_id] = {
        s: f.position_s,
        d: f.duration_s,
        hecho: f.completed,
        ts: Date.parse(f.updated_at),
        curso: f.course_id,
      };
    });
    return out;
  },

  async guardar(curso: string, clase: string, a: Avance): Promise<void> {
    const id = await uid();
    if (!id) return;
    const { error } = await supabase.from('course_progress').upsert(
      {
        user_id: id,
        lesson_id: clase,
        course_id: curso,
        position_s: Math.max(0, Math.floor(a.s)),
        duration_s: Math.max(0, Math.floor(a.d)),
        completed: a.hecho,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,lesson_id' },
    );
    if (error) console.error('[aula] no se pudo guardar el avance', error);
  },

  async preguntas(curso: string): Promise<Pregunta[]> {
    const id = await uid();
    if (!id) return [];
    const pedir = (campos: string) =>
      supabase
        .from('course_questions')
        .select(campos)
        .eq('course_id', curso)
        .eq('user_id', id)
        .order('created_at', { ascending: false });
    let r = await pedir(`${CAMPOS_PREGUNTA}, answer_video, answer_audio_path, answer_seen_at`);
    /* Sin la migración 0010 no existen las columnas del video y el audio: se
       piden las de siempre y el hilo sigue funcionando. */
    if (r.error && /answer_(video|audio_path|seen_at)/.test(r.error.message)) r = await pedir(CAMPOS_PREGUNTA);
    if (r.error) throw r.error;
    return (r.data ?? []) as unknown as Pregunta[];
  },

  /** La alumna leyó las respuestas de este curso: se apagan los avisos. */
  async marcarVistas(curso: string): Promise<void> {
    const { error } = await supabase.rpc('marcar_respuestas_vistas', { c: curso });
    if (error && !/marcar_respuestas_vistas|schema cache/.test(error.message))
      console.error('[aula] no se pudieron marcar las respuestas', error);
  },

  /** Los cursos donde Emi respondió algo que la alumna todavía no vio. */
  async respuestasNuevas(): Promise<Set<string>> {
    const id = await uid();
    if (!id) return new Set();
    const { data, error } = await supabase
      .from('course_questions')
      .select('course_id')
      .eq('user_id', id)
      .not('answered_at', 'is', null)
      .is('answer_seen_at', null);
    if (error) return new Set();
    return new Set((data ?? []).map((q) => q.course_id));
  },

  /** El audio de una respuesta: privado, con un enlace firmado de una hora. */
  async audio(ruta: string): Promise<string | null> {
    const { data, error } = await supabase.storage.from('cursos').createSignedUrl(ruta, 3600);
    if (error) {
      console.error('[aula] no se pudo abrir el audio', error);
      return null;
    }
    return data.signedUrl;
  },

  async preguntar(p: {
    curso: string;
    clase: string | null;
    minuto: number | null;
    texto: string;
    nombre: string | null;
  }): Promise<void> {
    const id = await uid();
    if (!id) throw new Error('sin sesión');
    const { error } = await supabase.from('course_questions').insert({
      course_id: p.curso,
      lesson_id: p.clase,
      user_id: id,
      author_name: p.nombre,
      minute_s: p.minuto,
      body: p.texto,
    });
    if (error) throw error;
  },

  async borrarPregunta(idPregunta: string): Promise<void> {
    const { error } = await supabase.from('course_questions').delete().eq('id', idPregunta);
    if (error) throw error;
  },

  /**
   * El enlace de un material. Los del bucket son privados: se pide un enlace
   * firmado que caduca en una hora, y Supabase solo lo da si la política dice
   * que esta persona tiene el curso.
   */
  async enlace(m: Material): Promise<string | null> {
    if (m.url) return m.url;
    if (!m.path) return null;
    const { data, error } = await supabase.storage.from('cursos').createSignedUrl(m.path, 3600);
    if (error) {
      console.error('[aula] no se pudo abrir el material', error);
      return null;
    }
    return data.signedUrl;
  },
};

/* ==========================================================================
   La maqueta: el curso de muestra y el avance en este navegador
   ========================================================================== */

const CLAVE = 'aula:v2:';

function leer<T>(caja: string, vacio: T): T {
  try {
    const crudo = localStorage.getItem(CLAVE + caja);
    return crudo ? (JSON.parse(crudo) as T) : vacio;
  } catch {
    return vacio;
  }
}

function escribir(caja: string, valor: unknown): void {
  try {
    localStorage.setItem(CLAVE + caja, JSON.stringify(valor));
  } catch {
    /* modo privado o lleno: el aula se usa igual, sin memoria */
  }
}

/** El curso de muestra de `cursos.ts`, con la forma de las filas. */
const MUESTRA: Curso[] = cursosDeMuestra.map((c, ic) => ({
  id: `muestra-${c.slug}`,
  slug: c.slug,
  title_es: '',
  title_en: '',
  summary_es: c.copia?.es.resumen ?? null,
  summary_en: c.copia?.en.resumen ?? null,
  published: true,
  position: ic,
  unidades: c.unidades.map((u, iu) => ({
    id: u.id,
    title_es: u.copia.es.titulo,
    title_en: u.copia.en.titulo,
    position: iu,
    clases: u.clases.map((l, il) => ({
      id: l.id,
      unit_id: u.id,
      title_es: l.copia.es.titulo,
      title_en: l.copia.en.titulo,
      summary_es: l.copia.es.resumen ?? null,
      summary_en: l.copia.en.resumen ?? null,
      video_es: null,
      video_en: null,
      duration_s: l.duracion ?? null,
      materials: [],
      published: true,
      position: il,
    })),
  })),
}));

const deMaqueta = {
  modo: 'maqueta' as const,

  async acceso(): Promise<Acceso> {
    return {
      sesion: true,
      admin: false,
      membresia: true,
      cursos: true,
      dudoso: false,
      nombre: null,
      uid: null,
    };
  },

  async misCursos(): Promise<Curso[]> {
    return MUESTRA;
  },

  async curso(slug: string): Promise<Curso | null> {
    return MUESTRA.find((c) => c.slug === slug) ?? null;
  },

  async avance(): Promise<Record<string, Avance & { curso: string }>> {
    return leer('avance', {});
  },

  async guardar(curso: string, clase: string, a: Avance): Promise<void> {
    const todo = leer<Record<string, Avance & { curso: string }>>('avance', {});
    todo[clase] = { ...a, curso };
    escribir('avance', todo);
  },

  async preguntas(curso: string): Promise<Pregunta[]> {
    return leer<Pregunta[]>('preguntas', []).filter((p) => p.course_id === curso);
  },

  async preguntar(p: { curso: string; clase: string | null; minuto: number | null; texto: string }) {
    const todas = leer<Pregunta[]>('preguntas', []);
    todas.unshift({
      id: 'q' + Date.now().toString(36),
      course_id: p.curso,
      lesson_id: p.clase,
      minute_s: p.minuto,
      body: p.texto,
      answer: null,
      answered_at: null,
      created_at: new Date().toISOString(),
    });
    escribir('preguntas', todas);
  },

  async marcarVistas(_curso: string): Promise<void> {},

  async respuestasNuevas(): Promise<Set<string>> {
    return new Set();
  },

  async audio(_ruta: string): Promise<string | null> {
    return null;
  },

  async borrarPregunta(id: string): Promise<void> {
    escribir(
      'preguntas',
      leer<Pregunta[]>('preguntas', []).filter((p) => p.id !== id),
    );
  },

  async enlace(m: Material): Promise<string | null> {
    return m.url ?? null;
  },
};

/** Borra el avance y las preguntas de prueba de la maqueta. */
export function limpiarMaqueta(): void {
  try {
    ['avance', 'preguntas'].forEach((c) => localStorage.removeItem(CLAVE + c));
  } catch {
    /* nada que borrar */
  }
}

/* ==========================================================================
   Lo que usan las pantallas
   ========================================================================== */

export const datos = isSupabaseConfigured ? deSupabase : deMaqueta;

/**
 * El avance de una clase cambiado de forma coherente: el segundo en el que va,
 * y si ya pasó el umbral, vista. Una clase vista no «se desmarca» por volver a
 * verla desde el principio.
 */
export function avanzar(antes: Avance | undefined, s: number, d: number): Avance {
  const a = antes ?? VACIO;
  const dur = d > 0 ? d : a.d;
  return {
    s: Math.max(0, Math.floor(s)),
    d: Math.floor(dur || 0),
    hecho: a.hecho || (dur > 0 && s / dur >= UMBRAL_VISTA),
    ts: Date.now(),
  };
}

export const avanceVacio = (): Avance => ({ ...VACIO });
