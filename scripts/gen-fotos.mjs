// Fotos de archivo de Pexels (licencia Pexels: uso comercial libre, sin
// atribución obligatoria). Lee data/fotos.json, descarga cada foto una sola vez
// (por id) y genera en public/fotos/ dos anchos en WebP:
//   <id>-640.webp   tarjetas y miniaturas
//   <id>-1280.webp  cabeceras
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

const ids = [...new Set(Object.values(manifiesto.fotos).map(f => f.id))];
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
  await base.clone().resize(1280).webp({ quality: 74 }).toFile(fileURLToPath(new URL(`${id}-1280.webp`, salida)));
  await base.clone().resize(640).webp({ quality: 72 }).toFile(fileURLToPath(new URL(`${id}-640.webp`, salida)));
  dims[id] = { w: 1280, h: h1280, w640: 640, h640 };
  console.log(id, width + 'x' + height);
}
writeFileSync(new URL('data/fotos-generadas.json', raiz), JSON.stringify(dims, null, 2) + '\n');
console.log(`${ids.length} fotos en public/fotos/`);
