// Fotos de archivo de Pexels (licencia Pexels: uso comercial libre, sin
// atribución obligatoria). Lee data/fotos.json, descarga cada foto una sola vez
// (por id) y genera en public/fotos/ dos anchos en WebP:
//   <nombre>-640.webp   tarjetas y miniaturas
//   <nombre>-1280.webp  cabeceras
// <nombre> sale del alt en castellano (palabras clave, sin acentos ni
// conectores): Google Imágenes lee el nombre del archivo como señal.
// Escribe data/fotos-generadas.json con el ancho y alto de cada foto, para que
// las plantillas declaren width/height y no haya saltos de maquetación (CLS).
// La caché de descargas va a node_modules/.cache/fotos. Uso: node scripts/gen-fotos.mjs
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const raiz = new URL('../', import.meta.url);
const manifiesto = JSON.parse(readFileSync(new URL('data/fotos.json', raiz), 'utf8'));
const cache = new URL('node_modules/.cache/fotos/', raiz);
const salida = new URL('public/fotos/', raiz);
mkdirSync(cache, { recursive: true });
mkdirSync(salida, { recursive: true });

const PARADAS = new Set('de del la el los las un una unos unas en con y a al se por para sobre ante antes que su sus lo'.split(' '));
const slug = t => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ')
  .split(/\s+/).filter(w => w && !PARADAS.has(w)).slice(0, 6).join('-');
// Primera clave que usa cada id da el nombre; si dos fotos distintas chocan, se añade el id.
const nombres = {};
for (const f of Object.values(manifiesto.fotos)) {
  if (nombres[f.id]) continue;
  let n = slug(f.es);
  if (Object.values(nombres).includes(n)) n += '-' + f.id;
  nombres[f.id] = n;
}
const ids = Object.keys(nombres).map(Number);
const dims = {};
for (const id of ids) {
  const crudo = new URL(`${id}.jpg`, cache);
  if (!existsSync(crudo)) {
    const r = await fetch(`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`);
    if (!r.ok) throw new Error(`Pexels ${id}: HTTP ${r.status}`);
    writeFileSync(crudo, Buffer.from(await r.arrayBuffer()));
  }
  const base = sharp(fileURLToPath(crudo)).rotate();
  const { width, height } = await base.metadata();
  const h1280 = Math.round((height * 1280) / width);
  const h640 = Math.round((height * 640) / width);
  await base.clone().resize(1280).webp({ quality: 74 }).toFile(fileURLToPath(new URL(`${nombres[id]}-1280.webp`, salida)));
  await base.clone().resize(640).webp({ quality: 72 }).toFile(fileURLToPath(new URL(`${nombres[id]}-640.webp`, salida)));
  dims[id] = { nombre: nombres[id], w: 1280, h: h1280, w640: 640, h640 };
  console.log(id, width + 'x' + height);
}
writeFileSync(new URL('data/fotos-generadas.json', raiz), JSON.stringify(dims, null, 2) + '\n');
console.log(`${ids.length} fotos en public/fotos/`);
