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
 * pedidas sin barra. Ver `astro.config.mjs` y `progreso.md`.
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

/** Una vuelta de enrutado: redirección, fichero, función o 404. */
function resolver(ruta) {
  for (const r of antes) {
    const m = new RegExp(r.src).exec(ruta);
    if (!m || !r.headers?.Location || !r.status) continue;
    const destino = r.headers.Location.replace(/\$(\d)/g, (_, n) => m[Number(n)] ?? '');
    return { tipo: 'redirige', status: r.status, destino };
  }
  if (fichero(ruta)) return { tipo: 'fichero', status: 200 };
  for (const r of despues) {
    if (!r.src || !new RegExp(r.src).test(ruta)) continue;
    if (r.status === 404) return { tipo: '404', status: 404 };
    if (r.dest) return { tipo: 'función', status: 200 };
  }
  return { tipo: '404', status: 404 };
}

/** Sigue las redirecciones hasta que la dirección aterriza. */
function recorrer(ruta) {
  const saltos = [ruta];
  for (let i = 0; i < 5; i++) {
    const r = resolver(saltos.at(-1));
    if (r.tipo !== 'redirige') return { ...r, saltos };
    saltos.push(r.destino);
  }
  return { tipo: 'bucle', status: 0, saltos };
}

/*
 * Qué se espera de cada dirección.
 *   · `llega`: termina en esa página, servida como fichero.
 *   · `queda`: NO se la lleva ninguna redirección — es una página de verdad.
 */
const casos = [];
const viejas = {
  '/aulavirtual/estudiemos-juntos': '/productos/estudiemos-juntos/',
  '/en/classroom/estudiemos-juntos': '/en/products/estudiemos-juntos/',
  '/aulavirtual/panel': '/aulavirtual/escritorio/',
  '/en/classroom/panel': '/en/classroom/desk/',
};
for (const [vieja, nueva] of Object.entries(viejas)) {
  casos.push({ ruta: vieja, llega: nueva }, { ruta: `${vieja}/`, llega: nueva });
}
const delAula = [
  'entrar', 'escritorio', 'nueva-clave', 'salir', 'pasar',
].map((p) => `/aulavirtual/${p}`).concat(
  ['signin', 'desk', 'new-password', 'signout', 'handoff'].map((p) => `/en/classroom/${p}`),
);
for (const pagina of delAula) {
  casos.push({ ruta: `${pagina}/`, llega: `${pagina}/` }, { ruta: pagina, queda: true });
}

let fallos = 0;
for (const caso of casos) {
  const r = recorrer(caso.ruta);
  const final = r.saltos.at(-1);
  let ok;
  if (caso.llega) ok = r.tipo === 'fichero' && final === caso.llega;
  else ok = r.saltos.length === 1 && r.tipo !== 'bucle';
  if (!ok) fallos++;
  const camino = r.saltos.join(' → ');
  console.log(`${ok ? '✓' : '✗'} ${camino}  [${r.tipo} ${r.status}]`);
}

console.log(fallos ? `\n${fallos} de ${casos.length} fallan.` : `\nLas ${casos.length} bien.`);
process.exit(fallos ? 1 : 0);
