// Tarjetas sociales (Open Graph, 1200x630) de Artes Marciales Catalunya:
//   public/og/c/<comarca>-<lang>.jpg     una por comarca con centros
//   public/og/d/<disciplina>-<lang>.jpg  una por disciplina
//   public/og/home-<lang>.jpg            portada y páginas generales
// Sin cifras (caducarían) ni fotos (sugerirían instalaciones propias).
// Se generan en local y se suben al repo. Uso: node scripts/gen-tarjetas.mjs
import sharp from 'sharp';
import { readFileSync, mkdirSync, readdirSync } from 'node:fs';

const raiz = new URL('../', import.meta.url);
const leer = p => JSON.parse(readFileSync(new URL(p, raiz), 'utf8'));
const comarcas = Object.fromEntries(leer('data/geo/comarcas.json').map(c => [c.slug, c.nombre]));
const disciplinas = leer('data/disciplinas.json');
const conCentros = readdirSync(new URL('data/centros/', raiz)).map(f => f.replace('.json', ''));
const FONT = 'Inter, Helvetica Neue, Helvetica, Arial, sans-serif';
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function tarjeta({ antetitulo, titulo, subtitulo, marca }) {
  const lineas = [];
  for (const palabra of titulo.split(' ')) {
    const ult = lineas[lineas.length - 1];
    if (ult && (ult + ' ' + palabra).length <= 22) lineas[lineas.length - 1] = ult + ' ' + palabra;
    else lineas.push(palabra);
  }
  const tam = lineas.length > 2 ? 72 : 88;
  const y0 = 300 - ((lineas.length - 1) * tam * 1.05) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <radialGradient id="g" cx="1" cy="0" r="0.9"><stop offset="0" stop-color="#DC2626" stop-opacity="0.35"/><stop offset="1" stop-color="#DC2626" stop-opacity="0"/></radialGradient>
    <pattern id="p" width="46" height="46" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><path d="M0 0H46M0 0V46" stroke="#1F1F1F" stroke-width="1"/></pattern>
  </defs>
  <rect width="1200" height="630" fill="#0A0A0A"/><rect width="1200" height="630" fill="url(#p)"/><rect width="1200" height="630" fill="url(#g)"/>
  <rect x="80" y="96" width="64" height="6" fill="#DC2626"/>
  <text x="80" y="150" font-family="${FONT}" font-size="26" font-weight="700" fill="#DC2626" letter-spacing="3">${esc(antetitulo.toUpperCase())}</text>
  ${lineas.map((l, i) => `<text x="80" y="${y0 + 40 + i * tam * 1.05}" font-family="${FONT}" font-size="${tam}" font-weight="900" fill="#FFFFFF">${esc(l)}</text>`).join('\n  ')}
  <text x="80" y="520" font-family="${FONT}" font-size="30" fill="#9CA3AF">${esc(subtitulo)}</text>
  <g transform="translate(80 540) scale(1.5)"><rect width="32" height="32" rx="8" fill="#DC2626"/><rect x="4" y="12" width="24" height="5" rx="1.5" fill="#fff"/><path d="M14.2 17.2 11 26.5M17.8 17.2 21 26.5" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><rect x="12.5" y="10" width="7" height="9" rx="2" fill="#991B1B" stroke="#fff" stroke-width="1.6"/></g>
  <text x="144" y="574" font-family="${FONT}" font-size="26" font-weight="800" fill="#FFFFFF">${esc(marca)} <tspan fill="#F87171">Catalunya</tspan></text>
</svg>`;
}

const T = {
  es: { marca: 'Artes Marciales', sub: 'Directorio verificado, con la fuente de cada centro', com: 'Comarca', dis: 'Disciplina',
        tc: n => `Artes marciales en ${n}`, td: n => `${n} en Cataluña`, home: 'Encuentra dónde entrenar artes marciales', ante: 'Directorio independiente' },
  ca: { marca: 'Arts Marcials', sub: 'Directori verificat, amb la font de cada centre', com: 'Comarca', dis: 'Disciplina',
        tc: n => `Arts marcials: ${n}`, td: n => `${n} a Catalunya`, home: 'Troba on entrenar arts marcials', ante: 'Directori independent' },
};
const png = async (svg, ruta) => {
  mkdirSync(new URL(ruta.replace(/[^/]+$/, ''), raiz), { recursive: true });
  await sharp(Buffer.from(svg)).jpeg({ quality: 82, mozjpeg: true }).toFile(decodeURIComponent(new URL(ruta, raiz).pathname));
};
let n = 0;
for (const lang of ['es', 'ca']) {
  const t = T[lang];
  await png(tarjeta({ antetitulo: t.ante, titulo: t.home, subtitulo: t.sub, marca: t.marca }), `public/og/home-${lang}.jpg`); n++;
  for (const c of conCentros) { await png(tarjeta({ antetitulo: t.com, titulo: t.tc(comarcas[c]), subtitulo: t.sub, marca: t.marca }), `public/og/c/${c}-${lang}.jpg`); n++; }
  for (const d of disciplinas) { await png(tarjeta({ antetitulo: t.dis, titulo: t.td(d[lang]), subtitulo: t.sub, marca: t.marca }), `public/og/d/${d.slug}-${lang}.jpg`); n++; }
}
console.log(`${n} tarjetas generadas`);
