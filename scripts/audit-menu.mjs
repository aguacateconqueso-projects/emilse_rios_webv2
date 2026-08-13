/**
 * Auditoría del menú de cristal.
 *
 * El panel del menú es translúcido: por detrás pasa la página, así que su
 * contraste depende de lo que haya debajo en cada momento. Las dos primeras
 * comprobaciones de `audit.mjs` no lo ven —miran el `background-color` de los
 * ancestros, y acá el fondo es lo ya pintado—, así que esto mide sobre los
 * píxeles de verdad, con el menú abierto, en los tres fondos que existen:
 * el bloque negro del cierre (el peor caso), una fotografía, y papel liso.
 *
 * Método, el mismo que la tercera comprobación de `audit.mjs`: se fotografía
 * cada renglón dos veces, con el texto y con el texto apagado, y solo se
 * juzgan los píxeles que el texto cambia. Sin eso no hay forma de separar los
 * glifos del menú de las letras de la página que se ven a través del cristal
 * — el primer intento midió lo segundo y dio 1,00:1 en sitios imposibles.
 *
 * Necesita `npm run preview` en marcha. Sale con código 1 si algo baja de AA.
 */
import { chromium } from 'playwright';
import sharp from 'sharp';

const L = (r, g, b) => {
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, c) => { const [hi, lo] = [a, c].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

async function medir(nombre, prepara) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await p.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(2600);
  await prepara(p);
  await p.locator('summary').click();
  await p.waitForTimeout(600);

  console.log(`\n── ${nombre} ──`);
  let peorGlobal = Infinity;
  const filas = await p.locator('.menu__panel .menu__item').count();
  for (let i = 0; i < filas; i++) {
    const fila = p.locator('.menu__panel .menu__item').nth(i);
    const texto = (await fila.innerText()).trim().replace(/\s+/g, ' ');
    const box = await fila.boundingBox();
    const conTexto = await p.screenshot({ clip: box });
    // apagar solo los glifos: todo lo demás (cristal, reglas, lo que pasa por detrás) queda igual
    await fila.evaluate((el) => {
      el.classList.add('sin-texto');
      if (!document.getElementById('sin-texto-css')) {
        const st = document.createElement('style');
        st.id = 'sin-texto-css';
        st.textContent = '.sin-texto, .sin-texto * { color: transparent !important; }';
        document.head.appendChild(st);
      }
    });
    await p.waitForTimeout(120);
    const sinTexto = await p.screenshot({ clip: box });
    await fila.evaluate((el) => el.classList.remove('sin-texto'));

    const a = await sharp(conTexto).raw().toBuffer({ resolveWithObject: true });
    const c = await sharp(sinTexto).raw().toBuffer({ resolveWithObject: true });
    const n = a.info.channels;
    let maxDif = 0;
    const pares = [];
    for (let k = 0; k < a.data.length; k += n) {
      const la = L(a.data[k], a.data[k + 1], a.data[k + 2]);
      const lc = L(c.data[k], c.data[k + 1], c.data[k + 2]);
      const d = Math.abs(la - lc);
      if (d > 0.002) { pares.push([d, la, lc]); if (d > maxDif) maxDif = d; }
    }
    // solo los píxeles que el texto cubre del todo: los del 90 % superior de cambio
    const plenos = pares.filter(([d]) => d >= maxDif * 0.9);
    const peor = plenos.reduce((m, [, la, lc]) => Math.min(m, ratio(la, lc)), Infinity);
    peorGlobal = Math.min(peorGlobal, peor);
    console.log(`  ${texto.padEnd(16)} ${peor.toFixed(2)}:1  ${peor >= 4.5 ? '✓' : '✗'}   (${plenos.length} px medidos)`);
  }
  console.log(`  peor de la pantalla: ${peorGlobal.toFixed(2)}:1 ${peorGlobal >= 4.5 ? '✓' : '✗'}`);
  await p.close();
  return peorGlobal;
}

const r1 = await medir('el cierre en negro por detrás', async (p) => {
  await p.evaluate(() => { document.querySelector('.closing').scrollIntoView(); window.scrollBy(0, 200); });
  await p.waitForTimeout(500);
});
const r2 = await medir('la lámina por detrás', async (p) => { await p.evaluate(() => window.scrollTo(0, 700)); await p.waitForTimeout(500); });
const r3 = await medir('papel liso por detrás', async (p) => { await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(400); });
await b.close();

const peor = Math.min(r1, r2, r3);
console.log(`\nPEOR CASO DE TODOS: ${peor.toFixed(2)}:1 ${peor >= 4.5 ? '✓' : '✗ por debajo de AA'}`);
if (peor < 4.5) process.exit(1);
