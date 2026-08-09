import { chromium } from 'playwright';

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

  document.querySelectorAll('body *').forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;

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
console.log('\n=== ANIMACIONES declaradas ===\n ', report.animations);

await browser.close();
