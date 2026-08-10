import { chromium } from 'playwright';
import sharp from 'sharp';

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const url = process.argv[2] ?? 'http://localhost:4321/';
const width = Number(process.argv[3] ?? 1440);
const page = await browser.newPage({ viewport: { width, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
await page.evaluate(() =>
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible')),
);

const report = await page.evaluate(() => {
  const parse = (c) => {
    const m = c.match(/[\d.]+/g).map(Number);
    return { r: m[0], g: m[1], b: m[2], a: m[3] ?? 1 };
  };
  const lum = ({ r, g, b }) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });
  const ratio = (a, b) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };

  // Fondo efectivo: sube por los ancestros hasta encontrar uno opaco.
  const bgOf = (el) => {
    let node = el;
    while (node) {
      const c = parse(getComputedStyle(node).backgroundColor);
      if (c.a === 1) return c;
      node = node.parentElement;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };

  const contrast = [];
  const grid = [];
  const SPACING = [
    'marginTop',
    'marginBottom',
    'paddingTop',
    'paddingBottom',
    'columnGap',
    'rowGap',
  ];

  /* Texto que existe solo para el lector de pantalla: recortado a 1 px y fuera
     de la vista. WCAG pide contraste a la «presentación visual del texto», y
     esto no lo es, así que no entra en la cuenta. */
  const soloLector = (el, cs) => {
    const r = el.getBoundingClientRect();
    return (r.width <= 1 && r.height <= 1) || cs.clipPath === 'inset(50%)';
  };

  document.querySelectorAll('body *').forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || soloLector(el, cs)) return;

    // --- contraste: solo elementos con texto propio ---
    const own = [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent.trim())
      .join('');
    if (own) {
      const size = parseFloat(cs.fontSize);
      const weight = parseInt(cs.fontWeight, 10) || 400;
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const need = large ? 3 : 4.5;
      const fg = parse(cs.color);
      const bg = bgOf(el);
      const r = ratio(over(fg, bg), bg);
      if (r < need) {
        contrast.push({
          text: own.slice(0, 46),
          sel: el.className || el.tagName,
          size: +size.toFixed(1),
          ratio: +r.toFixed(2),
          need,
        });
      }
    }

    // --- rejilla de 8 px ---
    for (const prop of SPACING) {
      const v = parseFloat(cs[prop]);
      if (!v || Number.isNaN(v)) continue;
      if (Math.abs(v % 8) > 0.5 && Math.abs((v % 8) - 8) > 0.5) {
        grid.push({ sel: el.className || el.tagName, prop, value: +v.toFixed(2) });
      }
    }
  });

  const anims = new Set();
  document.querySelectorAll('body *').forEach((el) => {
    const n = getComputedStyle(el).animationName;
    if (n && n !== 'none') anims.add(n);
  });

  return { contrast, grid, animations: [...anims] };
});

/**
 * Contraste contra lo que hay de verdad detrás del texto.
 *
 * La comprobación de arriba mira el `background-color` de los ancestros, y
 * eso deja fuera el fondo del contrabajo: no lo pinta ningún ancestro, sino
 * una capa fija por debajo de todo. Acá se mide sobre los píxeles ya pintados
 * — se apaga el texto, se fotografía la caja donde estaba y se busca el píxel
 * que menos contraste da contra el color con el que se iba a escribir.
 */
const cajas = await page.evaluate(() => {
  // Renglón a renglón, no la caja del bloque: así no entran las reglas de 1 px
  // del diseño, que no son fondo de nada — no se escribe encima de ellas.
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const out = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent.trim()) continue;
    const padre = n.parentElement;
    const cs = getComputedStyle(padre);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = padre.getBoundingClientRect();
    if (r.width <= 1 && r.height <= 1) continue; // solo para el lector de pantalla

    const rango = document.createRange();
    rango.selectNodeContents(n);
    for (const box of rango.getClientRects()) {
      if (box.width < 8 || box.height < 6) continue;
      out.push({
        y: box.top + window.scrollY,
        x: Math.floor(box.left),
        w: Math.ceil(box.width),
        h: Math.ceil(box.height),
        color: cs.color,
        sel: padre.className || padre.tagName,
      });
    }
  }
  return out;
});

await page.addStyleTag({ content: '*,*::before,*::after{color:transparent !important}' });

const relativa = (r, g, b) => {
  const f = (v) => (v / 255 <= 0.03928 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

const crudo = async (clip) =>
  sharp(await page.screenshot({ clip })).raw().toBuffer({ resolveWithObject: true });

const ocultarFondo = (si) =>
  page.evaluate((s) => {
    const el = document.querySelector('.backdrop');
    if (el) el.style.display = s ? 'none' : '';
  }, si);

const fondo = [];
let peorGlobal = { ratio: Infinity, sel: '—' };

for (const b of cajas) {
  await page.evaluate((y) => window.scrollTo(0, Math.max(0, y - 200)), b.y);
  await page.waitForTimeout(120);
  const top = await page.evaluate((y) => y - window.scrollY, b.y);
  if (top < 0 || top + b.h > 900) continue;
  // El carrusel de correos se desborda a lo ancho: hay renglones que quedan
  // fuera de la ventana y no se pueden fotografiar.
  const x = Math.max(0, b.x);
  const w = Math.min(b.w, width - x);
  if (w < 8) continue;
  const clip = { x, y: top, width: w, height: b.h };

  // Dos veces la misma caja: sin el fondo y con él. Solo interesan los píxeles
  // que el fondo cambia — las reglas de 1 px del diseño salen iguales en las
  // dos y no cuentan.
  await ocultarFondo(true);
  const sin = await crudo(clip);
  await ocultarFondo(false);
  const con = await crudo(clip);

  const [tr, tg, tb] = b.color.match(/[\d.]+/g).map(Number);
  const lt = relativa(tr, tg, tb);
  let peor = Infinity;
  let culpable = null;

  for (let i = 0; i < con.data.length; i += con.info.channels) {
    const la = relativa(sin.data[i], sin.data[i + 1], sin.data[i + 2]);
    const lb = relativa(con.data[i], con.data[i + 1], con.data[i + 2]);
    if (Math.abs(la - lb) < 0.002) continue; // el fondo no toca este píxel
    const [hi, lo] = lt > lb ? [lt, lb] : [lb, lt];
    const r = (hi + 0.05) / (lo + 0.05);
    if (r < peor) {
      peor = r;
      culpable = [con.data[i], con.data[i + 1], con.data[i + 2]];
    }
  }

  if (peor < peorGlobal.ratio) peorGlobal = { ratio: peor, sel: b.sel };
  if (peor < 4.5) {
    fondo.push({ sel: b.sel, ratio: +peor.toFixed(2), pixel: `rgb(${culpable})`, need: 4.5 });
  }
}

const show = (title, rows) => {
  console.log(`\n=== ${title} (${rows.length}) ===`);
  const seen = new Set();
  for (const r of rows) {
    const key = JSON.stringify(r);
    if (seen.has(key)) continue;
    seen.add(key);
    console.log(' ', JSON.stringify(r));
  }
};

console.log(`\n############ ${url} @ ${width}px ############`);
show('CONTRASTE por debajo de AA', report.contrast);
show('ESPACIADOS fuera de la rejilla de 8 px', report.grid);
show('CONTRASTE contra el fondo ya pintado', fondo);
console.log(
  `  peor caso medido: ${peorGlobal.ratio === Infinity ? 'sin fondo detrás de ningún texto' : `${peorGlobal.ratio.toFixed(1)}:1 en .${peorGlobal.sel}`}`,
);
console.log('\n=== ANIMACIONES declaradas ===\n ', report.animations);

await browser.close();
