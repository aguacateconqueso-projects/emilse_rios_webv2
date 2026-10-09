/**
 * Comprueba las redirecciones contra lo que de verdad se despliega.
 *
 *   npm run build && npm run audit:redirecciones
 *
 * No hace falta servidor ni red: lee `.vercel/output/config.json` —las rutas
 * que Vercel aplica antes que nada— y `.vercel/output/static/` —los ficheros
 * que sirve— y recorre cada dirección como lo haría Vercel: primero las rutas
 * de antes de `{ handle: 'filesystem' }`, luego el fichero, luego el resto.
 * Sigue las redirecciones hasta que aterriza.
 *
 * Existe por el 23 sep 2026: las redirecciones que Astro le genera a Vercel no
 * aceptaban la barra final —`/aulavirtual/estudiemos-juntos/` daba 404— y el
 * patrón dinámico `/aulavirtual/[producto]` se comía páginas reales del aula
 * pedidas sin barra. Ver `astro.config.mjs` y `progreso.md`. Desde el 24 sep
 * 2026 comprueba también que `/productos/` y `/en/products/` lleven a
 * `/formaciones/` y `/en/courses/`, página por página. Y desde el 1 oct 2026,
 * que cada dirección vieja de la membresía llegue **en un solo salto** a la
 * nueva: `/formaciones/membresia-contrabajo/` y
 * `/en/programs/double-bass-membership/`. Y desde el 9 oct 2026, que todo el
 * inglés viva en `/en/programs/` con el slug en inglés: cada carta, desde
 * `/en/courses/` y `/en/products/`, en un salto.
 *
 * «Aterrizar» es llegar a una página que contesta: un fichero del build o una
 * función —Formaciones y las páginas de ventas se resuelven en el servidor
 * desde el 23 sep 2026—.
 *
 * Mira también **el dominio** de la petición (las rutas con `has: host`): desde
 * el 27 sep 2026 las primeras rutas son las de `emilseriosacademy.com`, que
 * solo valen para ese dominio. Hasta el 1 oct 2026 el script no lo miraba y
 * daba los 58 casos por fallidos —todo «redirigía a la Home»—. Por defecto
 * las direcciones se piden a `www.emilserios.com`; los casos con `host`, a
 * otro.
 *
 * Una simplificación, y es la única: una ruta con `dest` y sin `status` se da
 * por reescritura a una función (`_render`), que es lo único que el adaptador
 * genera así. Si algún día aparecen otras, esto hay que ampliarlo.
 */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SALIDA = '.vercel/output';
const config = JSON.parse(readFileSync(join(SALIDA, 'config.json'), 'utf8'));
const corte = config.routes.findIndex((r) => r.handle === 'filesystem');
const antes = config.routes.slice(0, corte);
const despues = config.routes.slice(corte + 1);

/** El fichero estático que sirve una dirección, si lo hay. */
function fichero(ruta) {
  const base = join(SALIDA, 'static', decodeURIComponent(ruta));
  if (existsSync(base) && statSync(base).isFile()) return base;
  const indice = join(base, 'index.html');
  return existsSync(indice) ? indice : null;
}

const CASA = 'www.emilserios.com';

/** ¿Vale la ruta para este dominio? Solo se miran las condiciones de `host`. */
const valeParaHost = (r, host) => !r.has || r.has.every((h) => h.type !== 'host' || h.value === host);

/** Una dirección absoluta de esta casa se sigue como ruta; de otro dominio, no. */
const local = (destino) => (destino.startsWith(`https://${CASA}/`) ? destino.slice(`https://${CASA}`.length) : destino);

/** Una vuelta de enrutado: redirección, fichero, función o 404. */
function resolver(ruta, host) {
  for (const r of antes) {
    if (!valeParaHost(r, host)) continue;
    const m = new RegExp(r.src).exec(ruta);
    if (!m || !r.headers?.Location || !r.status) continue;
    const destino = r.headers.Location.replace(/\$(\d)/g, (_, n) => m[Number(n)] ?? '');
    return { tipo: 'redirige', status: r.status, destino };
  }
  if (fichero(ruta)) return { tipo: 'fichero', status: 200 };
  for (const r of despues) {
    if (!valeParaHost(r, host) || !r.src || !new RegExp(r.src).test(ruta)) continue;
    if (r.status === 404) return { tipo: '404', status: 404 };
    if (r.dest) return { tipo: 'función', status: 200 };
  }
  return { tipo: '404', status: 404 };
}

/** Sigue las redirecciones hasta que la dirección aterriza. Después del
    primer salto se está siempre en esta casa. */
function recorrer(ruta, host = CASA) {
  const saltos = [ruta];
  for (let i = 0; i < 5; i++) {
    const r = resolver(saltos.at(-1), i === 0 ? host : CASA);
    if (r.tipo !== 'redirige') return { ...r, saltos };
    saltos.push(local(r.destino));
  }
  return { tipo: 'bucle', status: 0, saltos };
}

/*
 * Qué se espera de cada dirección.
 *   · `llega`: termina en esa página, servida como fichero.
 *   · `queda`: NO se la lleva ninguna redirección — es una página de verdad.
 *   · `directo`: además, llega en un solo salto, sin cadena.
 */
const casos = [];
const viejas = {
  // Formaciones se llamó `/productos/` (y `/en/products/`) hasta el 24 sep 2026.
  '/productos': '/formaciones/',
  '/productos/todo-el-diapason': '/formaciones/todo-el-diapason/',
  '/en/products': '/en/programs/',
  // Y del 24 sep al 9 oct 2026, `/en/courses/`: desde entonces, `/en/programs/`.
  '/en/courses': '/en/programs/',
  // Una carta que no está en `SLUGS_EN` —una nueva del panel— va igual.
  '/en/courses/curso-nuevo': '/en/programs/curso-nuevo/',
  '/aulavirtual/panel': '/aulavirtual/escritorio/',
  '/en/classroom/panel': '/en/classroom/desk/',
  // Desde el 23 sep 2026 el aula no tiene portada: se entra por el acceso.
  '/aulavirtual': '/aulavirtual/entrar/',
  '/en/classroom': '/en/classroom/signin/',
};
for (const [vieja, nueva] of Object.entries(viejas)) {
  casos.push({ ruta: vieja, llega: nueva }, { ruta: `${vieja}/`, llega: nueva });
}
// La membresía, en su dirección propia desde el 1 oct 2026: todas las de antes
// llevan directo, en un salto.
const MEMB_ES = '/formaciones/membresia-contrabajo/';
const MEMB_EN = '/en/programs/double-bass-membership/';
const membresia = {
  '/formaciones/estudiemos-juntos': MEMB_ES,
  '/productos/estudiemos-juntos': MEMB_ES,
  '/aulavirtual/estudiemos-juntos': MEMB_ES,
  '/en/classroom/estudiemos-juntos': MEMB_EN,
};
// Los slugs en inglés (9 oct 2026): lo mismo que `slugsIngles` en
// `src/i18n/ui.ts` y `SLUGS_EN` en `astro.config.mjs`.
const SLUGS_EN = {
  'estudiemos-juntos': 'double-bass-membership',
  'todo-el-diapason': 'fingerboard',
  'todas-las-escalas': 'all-the-scales',
  'contrabajo-desde-cero': 'double-bass-from-scratch',
  'tu-vibrato-como-un-cantante': 'vibrato-like-a-singer',
  'clases-online': 'online-lessons',
};
for (const [es, en] of Object.entries(SLUGS_EN)) {
  membresia[`/en/courses/${es}`] = `/en/programs/${en}/`;
  membresia[`/en/products/${es}`] = `/en/programs/${en}/`;
}
for (const [vieja, nueva] of Object.entries(membresia)) {
  casos.push({ ruta: vieja, llega: nueva, directo: true }, { ruta: `${vieja}/`, llega: nueva, directo: true });
}
const delAula = [
  'entrar', 'escritorio', 'nueva-clave', 'salir', 'pasar',
].map((p) => `/aulavirtual/${p}`).concat(
  ['signin', 'desk', 'new-password', 'signout', 'handoff'].map((p) => `/en/classroom/${p}`),
);
for (const pagina of delAula) {
  casos.push({ ruta: `${pagina}/`, llega: `${pagina}/` }, { ruta: pagina, queda: true });
}
// Las direcciones nuevas de Formaciones son páginas de verdad: nada se las lleva.
const nuevas = ['/formaciones/', MEMB_ES, '/formaciones/todo-el-diapason/', '/en/programs/'].concat(
  Object.values(SLUGS_EN).map((en) => `/en/programs/${en}/`),
);
for (const pagina of nuevas) casos.push({ ruta: pagina, llega: pagina });
for (const pagina of [MEMB_ES, MEMB_EN, '/en/programs/fingerboard/']) casos.push({ ruta: pagina.slice(0, -1), queda: true });

// `emilseriosacademy.com` redirige entero (27 sep 2026): su portada, a la carta
// de la membresía, directo; `/api/` no se toca —lo contesta este proyecto—.
for (const host of ['www.emilseriosacademy.com', 'emilseriosacademy.com']) {
  casos.push(
    { ruta: '/', host, llega: MEMB_ES, directo: true },
    { ruta: '/en', host, llega: MEMB_EN, directo: true },
    { ruta: '/aula', host, llega: '/aulavirtual/membresia/', directo: true },
    { ruta: '/api/stripe-webhook', host, queda: true },
  );
}

let fallos = 0;
for (const caso of casos) {
  const r = recorrer(caso.ruta, caso.host);
  const final = r.saltos.at(-1);
  let ok;
  if (caso.llega) ok = (r.tipo === 'fichero' || r.tipo === 'función') && final === caso.llega && (!caso.directo || r.saltos.length === 2);
  else ok = r.saltos.length === 1 && r.tipo !== 'bucle';
  if (!ok) fallos++;
  const camino = r.saltos.join(' → ');
  console.log(`${ok ? '✓' : '✗'} ${caso.host ? `${caso.host} ` : ''}${camino}  [${r.tipo} ${r.status}]`);
}

console.log(fallos ? `\n${fallos} de ${casos.length} fallan.` : `\nLas ${casos.length} bien.`);
process.exit(fallos ? 1 : 0);
