// Genera la imaginería original del sitio (C4 parte 2):
//
//   public/og/<clave>.png     1200x630  tarjeta social por página
//   public/img/<clave>.webp   1280x720  ilustración decorativa de cabecera
//
// Por qué ilustración y no fotografía: la web es una guía editorial sobre
// centros de terceros. Una foto genérica de un tatami sugiere instalaciones
// propias, y una foto generada por IA de un gimnasio del Garraf sería
// directamente identidad visual inventada de negocios reales — prohibido por
// la regla del proyecto. La geometría abstracta informa sin afirmar nada.
//
// Todo el trazado es original: reutiliza los glifos de src/components/LineIcon.astro
// (dibujados a mano para este proyecto) escalados como elemento gráfico.
//
// Uso: node scripts/gen-images.mjs
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const C = {
  dark: '#0A0A0A',
  gray: '#141414',
  border: '#1F1F1F',
  red: '#DC2626',
  muted: '#9CA3AF',
  dim: '#6B7280',
};
const FONT = 'Inter, Helvetica Neue, Helvetica, Arial, sans-serif';

// ── Datos: se leen de los mismos ficheros que renderiza el sitio, para que las
// imágenes no puedan quedar desincronizadas del contenido. ──────────────────
const read = p => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

const ICONS = Object.fromEntries(
  [...read('src/components/LineIcon.astro').matchAll(/'([a-z-]+)':\s*'(.+?)',\n/g)].map(m => [m[1], m[2]]),
);

const DISCIPLINES = [...read('src/data/disciplines.ts').matchAll(
  /slug:\s*'([a-z-]+)',\s*\n\s*name:\s*'[^']*',\s*\n\s*nameEs:\s*'([^']+)',[\s\S]*?shortDesc:\s*'([^']+)'/g,
)].map(m => ({ slug: m[1], name: m[2], sub: m[3] }));

const LOCATIONS = [...read('src/data/locations.ts').matchAll(
  /slug:\s*'([a-z-]+)',\s*\n\s*name:\s*'([^']+)',/g,
)].map(m => ({ slug: m[1], name: m[2] }));

if (DISCIPLINES.length !== 10) throw new Error(`Esperaba 10 disciplinas, extraje ${DISCIPLINES.length}`);
if (LOCATIONS.length !== 6) throw new Error(`Esperaba 6 municipios, extraje ${LOCATIONS.length}`);

// ── Piezas gráficas compartidas ─────────────────────────────────────────────

/** Retícula diagonal muy tenue: da textura sin competir con el texto. */
const grid = (id, angle) => `
  <pattern id="${id}" width="46" height="46" patternUnits="userSpaceOnUse"
           patternTransform="rotate(${angle})">
    <path d="M0 0H46" stroke="${C.border}" stroke-width="1"/>
    <path d="M0 0V46" stroke="${C.border}" stroke-width="1"/>
  </pattern>`;

/** Resplandor rojo de esquina, el mismo recurso que usa el hero del sitio. */
const glow = (id, cx, cy, r, op) => `
  <radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="${C.red}" stop-opacity="${op}"/>
    <stop offset="1" stop-color="${C.red}" stop-opacity="0"/>
  </radialGradient>`;

/**
 * Glifo del icono escalado. `strokePx` es el grosor final en píxeles de la
 * imagen: dentro del grupo hay que dividirlo por la escala, porque el trazo
 * se escala con la geometría.
 */
const glyph = (name, x, y, size, stroke, opacity, strokePx = 2) => {
  const paths = ICONS[name] ?? ICONS['check-circulo'];
  const s = size / 24;
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${stroke}"
             stroke-width="${(strokePx / s).toFixed(3)}" stroke-linecap="round" stroke-linejoin="round"
             opacity="${opacity}">${paths}</g>`;
};

/** El icono convertido en trama: repetido pequeño, lee como textura de marca. */
const iconPattern = (id, name, step, angle) => {
  const paths = ICONS[name] ?? ICONS['check-circulo'];
  const s = (step * 0.5) / 24;
  return `
  <pattern id="${id}" width="${step}" height="${step}" patternUnits="userSpaceOnUse"
           patternTransform="rotate(${angle})">
    <g transform="translate(${step * 0.25} ${step * 0.25}) scale(${s})" fill="none" stroke="${C.red}"
       stroke-width="${(1.6 / s).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round">${paths}</g>
  </pattern>`;
};

/** Curvas de nivel: abstracción del relieve costa-macizo del Garraf. */
const contours = (seed, w, h, n = 14) => {
  let out = '';
  for (let i = 0; i < n; i++) {
    const y = h * 0.12 + (i * h * 0.72) / (n - 1);
    const amp = 22 + ((seed * (i + 3)) % 46);
    const phase = (seed * (i + 1)) % 240;
    const acento = i === Math.floor(n / 2);
    out += `<path d="M-40 ${y.toFixed(1)}
      C ${w * 0.2} ${(y - amp).toFixed(1)}, ${(w * 0.32 + phase).toFixed(1)} ${(y + amp).toFixed(1)}, ${w * 0.55} ${(y - amp * 0.5).toFixed(1)}
      S ${w * 0.86} ${(y + amp * 0.9).toFixed(1)}, ${w + 40} ${(y - amp * 0.35).toFixed(1)}"
      fill="none" stroke="${acento ? C.red : '#3A3A3A'}"
      stroke-width="${acento ? 2.6 : 1.5}" opacity="${acento ? 0.9 : 0.55}"/>`;
  }
  return out;
};

/** Corta un título largo en un máximo de dos líneas sin partir palabras. */
const wrap = (text, max) => {
  const words = text.split(' ');
  const lines = [''];
  for (const w of words) {
    const candidate = lines.at(-1) ? `${lines.at(-1)} ${w}` : w;
    if (candidate.length > max && lines.at(-1)) lines.push(w);
    else lines[lines.length - 1] = candidate;
  }
  return lines.slice(0, 2);
};

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ── Tarjeta social 1200x630 ─────────────────────────────────────────────────
function ogCard({ titulo, kicker, sub, icon, variante = 'disciplina', seed = 7 }) {
  const lines = wrap(titulo, 17);
  const size = lines.length === 1 ? 92 : 78;
  const top = lines.length === 1 ? 352 : 306;

  // El arte vive siempre en la mitad derecha: el texto ocupa la izquierda y
  // cruzarlo con líneas destroza la legibilidad en la miniatura de un chat.
  const arte =
    variante === 'municipio'
      ? `<g clip-path="url(#mitad)" opacity="0.85">${contours(seed, 1200, 630)}</g>`
      : glyph(icon, 742, 96, 430, C.red, 0.16);

  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${grid('g', seed % 2 ? 24 : -18)}
    ${glow('gl', 180, 90, 780, 0.3)}
    <clipPath id="mitad"><rect x="640" y="26" width="534" height="578"/></clipPath>
  </defs>
  <rect width="1200" height="630" fill="${C.dark}"/>
  <rect width="1200" height="630" fill="url(#g)" opacity="0.55"/>
  <rect width="1200" height="630" fill="url(#gl)"/>
  ${arte}
  <rect x="24" y="24" width="1152" height="582" fill="none" stroke="${C.border}" stroke-width="2" rx="16"/>
  <text x="96" y="132" font-family="${FONT}" font-size="30" font-weight="900" fill="${C.red}" letter-spacing="-0.5">AM</text>
  <text x="150" y="132" font-family="${FONT}" font-size="21" font-weight="600" fill="${C.dim}" letter-spacing="3">${esc(kicker.toUpperCase())}</text>
  <rect x="96" y="168" width="76" height="8" fill="${C.red}" rx="4"/>
  ${lines
    .map(
      (l, i) =>
        `<text x="92" y="${top + i * (size + 12)}" font-family="${FONT}" font-size="${size}" font-weight="900" fill="#FFFFFF" letter-spacing="-3">${esc(l)}</text>`,
    )
    .join('\n  ')}
  <text x="96" y="522" font-family="${FONT}" font-size="30" font-weight="500" fill="${C.muted}">${esc(sub)}</text>
  <text x="96" y="574" font-family="${FONT}" font-size="24" font-weight="600" fill="${C.dim}">artesmarcialesgarraf.es</text>
</svg>`;
}

// ── Ilustración de cabecera 1280x720, sin texto ─────────────────────────────
// Sin texto a propósito: el H1 ya dice de qué va la página y repetirlo dentro de
// una imagen es contenido que ni Google ni un lector de pantalla aprovechan.
function heroArt({ icon, variante = 'disciplina', seed = 7 }) {
  // Formato 4:1: la ilustración se sirve como banda ancha entre la cabecera y
  // el contenido, así que se compone ya con esa proporción. Renderizarla en
  // 16:9 y recortarla por CSS dejaba la figura partida por la mitad.
  const W = 1600, H = 400;
  const ang = ((seed * 37) % 24) - 12;          // inclinación de la banda
  const px = 260 + ((seed * 53) % 700);         // foco del resplandor

  const arte =
    variante === 'municipio'
      ? // Municipio: curvas de nivel (costa + macizo del Garraf) y un punto de
        // situación. Abstracción honesta: no dibuja ningún lugar concreto.
        `<g opacity="0.9">${contours(seed, W, H, 11)}</g>
         <g transform="translate(${360 + (seed % 5) * 150} ${188 + (seed % 3) * 26})">
           <circle r="8" fill="${C.red}"/>
           <circle r="26" fill="none" stroke="${C.red}" stroke-width="2" opacity="0.6"/>
           <circle r="50" fill="none" stroke="${C.red}" stroke-width="1.5" opacity="0.3"/>
           <circle r="80" fill="none" stroke="${C.red}" stroke-width="1.2" opacity="0.15"/>
         </g>`
      : // Disciplina: el icono como trama diagonal (textura de marca) y un
        // ejemplar sobre una placa, que le da sitio en la composición en lugar
        // de dejarlo flotando.
        `<g transform="rotate(${ang} ${W / 2} ${H / 2})">
           <rect x="-300" y="96" width="${W + 600}" height="208" fill="url(#trama)" opacity="0.28"/>
           <path d="M-300 96H${W + 300}M-300 304H${W + 300}" stroke="${C.red}" stroke-width="1.5" opacity="0.3"/>
         </g>
         <g>
           <rect x="1188" y="88" width="224" height="224" rx="26" fill="${C.dark}" opacity="0.85"/>
           <rect x="1188" y="88" width="224" height="224" rx="26" fill="none" stroke="${C.red}" stroke-width="2" opacity="0.5"/>
           ${glyph(icon, 1236, 136, 128, C.red, 0.95, 2.8)}
         </g>`;

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${grid('g', seed % 2 ? 24 : -18)}
    ${glow('gl', px, 60, 720, 0.16)}
    ${iconPattern('trama', icon, 62, ang)}
    <linearGradient id="fade" x1="0" y1="0" x2="0.25" y2="1">
      <stop offset="0.45" stop-color="${C.dark}" stop-opacity="0"/>
      <stop offset="1" stop-color="${C.dark}" stop-opacity="0.7"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${C.gray}"/>
  <rect width="${W}" height="${H}" fill="url(#g)" opacity="0.6"/>
  <rect width="${W}" height="${H}" fill="url(#gl)"/>
  ${arte}
  <rect width="${W}" height="${H}" fill="url(#fade)"/>
  <rect x="0" y="394" width="${W}" height="6" fill="${C.red}" opacity="0.9"/>
</svg>`;
}

// ── Manifiesto de salida ────────────────────────────────────────────────────
const ogJobs = [];
const artJobs = [];

for (const [i, d] of DISCIPLINES.entries()) {
  ogJobs.push([`og/${d.slug}`, ogCard({ titulo: d.name, kicker: 'Guía del Garraf', sub: d.sub, icon: d.slug, seed: i + 3 })]);
  artJobs.push([`img/${d.slug}`, heroArt({ icon: d.slug, seed: i + 3 })]);
}

for (const [i, l] of LOCATIONS.entries()) {
  ogJobs.push([
    `og/${l.slug}`,
    ogCard({ titulo: `Artes marciales en ${l.name}`, kicker: 'Municipio del Garraf', sub: 'Qué se practica y dónde, con fuente pública', variante: 'municipio', seed: i + 11 }),
  ]);
  artJobs.push([`img/${l.slug}`, heroArt({ variante: 'municipio', seed: i + 11 })]);
}

const PERFILES = [
  ['clases-para-ninos', 'Artes marciales para niños', 'personas', 'Qué disciplina según la edad, y qué mirar antes de apuntarle'],
  ['clases-para-mujeres', 'Artes marciales para mujeres', 'personas', 'Grupos, defensa personal femenina y cómo empezar'],
  ['clases-para-adultos', 'Empezar de adulto', 'personas', 'Sin condición previa, sin ridículo y sin competir'],
  ['iniciacion', 'No sé por dónde empezar', 'brujula', 'Elige disciplina según objetivo, edad y carácter'],
  ['otras-artes-marciales', 'Aikido, kung fu y otras', 'brujula', 'Los estilos menos conocidos y dónde constan'],
  ['centros', 'Directorio de centros', 'mapa-pin', 'Centros del Garraf con fuente pública y fecha'],
  ['blog', 'Guías y comparativas', 'balanza', 'Artículos para decidir con criterio'],
  ['sobre-nosotros', 'Sobre esta guía', 'check-circulo', 'Quién la hace, cómo se verifica y cómo se financia'],
  ['contacto', 'Pedir orientación', 'sobre', 'Te decimos qué encaja contigo, sin coste'],
];

for (const [i, [slug, titulo, icon, sub]] of PERFILES.entries()) {
  ogJobs.push([`og/${slug}`, ogCard({ titulo, kicker: 'Artes Marciales Garraf', sub, icon, seed: i + 21 })]);
  artJobs.push([`img/${slug}`, heroArt({ icon, seed: i + 21 })]);
}

const BLOG = [
  ['que-es-el-grappling-y-donde-se-practica', 'Qué es el grappling', 'jiu-jitsu-brasileno', 'Lucha de agarre sin kimono: dónde consta en la comarca'],
  ['fitboxing-o-boxeo-en-el-garraf', 'Fitboxing en el Garraf', 'boxeo', 'Nadie lo anuncia aquí: qué hay en su lugar'],
  ['horarios-tipicos-de-las-clases', 'Horarios de clase', 'brujula', 'Qué franjas hay y cuántas opciones según tu municipio'],
  ['artes-marciales-para-perder-peso', 'Entrenar y perder peso', 'boxeo', 'Adherencia, trayecto y qué esperar de verdad'],
  ['mi-hijo-quiere-dejar-las-clases', 'Quiere dejarlo', 'personas', 'El bajón normal, el problema real y qué mover primero'],
  ['clases-mixtas-o-solo-mujeres', 'Mixto o femenino', 'personas', 'Qué aporta cada formato y qué consta en la comarca'],
  ['donde-aprender-boxeo-en-el-garraf', 'Dónde aprender boxeo', 'boxeo', 'Opciones reales en la comarca, con criterio para elegir'],
  ['mejor-arte-marcial-para-ninos-garraf', 'Qué arte marcial para un niño', 'personas', 'Karate, judo o taekwondo según la edad y el carácter'],
  ['defensa-personal-para-mujeres-garraf', 'Defensa personal para mujeres', 'defensa-personal', 'Qué enseña de verdad y qué buscar en un curso'],
  ['artes-marciales-adultos-principiantes-garraf', 'Empezar de adulto', 'brujula', 'Cómo es el primer mes cuando hace años que no entrenas'],
  ['karate-vs-taekwondo-ninos-garraf', 'Karate o taekwondo', 'balanza', 'La comparativa para padres, sin marketing de escuela'],
  ['a-que-edad-empezar-artes-marciales', 'A qué edad empezar', 'personas', 'De los 4 a los 60: qué aporta cada tramo de edad'],
  ['como-elegir-centro-artes-marciales-garraf', 'Cómo elegir centro', 'check-circulo', 'Las ocho comprobaciones antes de apuntarte'],
  ['karate-o-judo-para-ninos', 'Karate o judo', 'balanza', 'Golpeo o agarre a los siete años: qué cambia'],
  ['beneficios-artes-marciales-ninos', 'Beneficios reales', 'personas', 'Lo que aporta a un niño y lo que es marketing'],
  ['artes-marciales-o-futbol-extraescolar', 'Artes marciales o fútbol', 'balanza', 'Qué extraescolar encaja con cada niño'],
  ['extraescolar-artes-marciales-vuelta-al-cole', 'Vuelta al cole', 'brujula', 'Cuadrar la extraescolar con el curso escolar'],
  ['primer-dia-clase-artes-marciales-nino', 'El primer día', 'check-circulo', 'Qué llevar, qué pasa y qué no comprar todavía'],
  ['judo-o-jiu-jitsu-brasileno', 'Judo o jiu-jitsu', 'balanza', 'De pie o en el suelo: en qué se diferencian'],
  ['boxeo-o-kickboxing', 'Boxeo o kickboxing', 'balanza', 'Solo puños o puños y piernas: qué cambia'],
  ['muay-thai-o-kickboxing', 'Muay thai o kickboxing', 'balanza', 'Codos, rodillas y clinch: qué añade el muay thai'],
  ['krav-maga-o-defensa-personal', 'Krav maga o defensa personal', 'balanza', 'Un sistema concreto frente a una categoría entera'],
  ['golpeo-o-agarre-por-donde-empezar', 'Golpeo o agarre', 'brujula', 'La bifurcación que ordena las diez disciplinas'],
  ['arte-marcial-para-nino-timido', 'Mi hijo es tímido', 'personas', 'Qué formato protege a un niño reservado'],
  ['arte-marcial-para-nino-muy-nervioso', 'Mi hijo no para quieto', 'personas', 'Estructura antes que desgaste: qué canaliza'],
  ['se-hacen-dano-los-ninos-artes-marciales', '¿Se hacen daño?', 'check-circulo', 'Cómo se gradúa el contacto en cada disciplina'],
  ['empezar-artes-marciales-siendo-mujer', 'Empezar siendo mujer', 'personas', 'Cómo son los grupos y qué preguntar antes de ir'],
  ['empezar-artes-marciales-a-los-40', 'Empezar a los 40', 'brujula', 'Qué cambia, qué perdona el cuerpo y qué hay cerca'],
  ['entrenar-sin-querer-competir', 'Entrenar sin competir', 'personas', 'La mayoría no compite nunca, y no pasa nada'],
  ['clase-de-prueba-que-preguntar', 'La clase de prueba', 'check-circulo', 'Qué mirar y qué preguntar el día que vas'],
  ['artes-marciales-y-estres', 'Entrenar y estrés', 'brujula', 'Por qué desconecta más que una cinta de correr'],
  ['artes-marciales-ninos-tdah', 'Artes marciales y TDAH', 'personas', 'Qué aporta el formato y qué no se puede prometer'],
  ['cuantos-dias-semana-entrena-un-nino', 'Cuántos días entrenar', 'brujula', 'Dos a la semana, y la cuenta de los trayectos'],
  ['cursos-defensa-personal-fin-de-semana', 'Curso de fin de semana', 'defensa-personal', 'Qué se aprende en dos días y qué exige continuidad'],
  ['artes-marciales-con-sobrepeso', 'Empezar con sobrepeso', 'brujula', 'Impacto, ritmo propio y qué preguntar antes de ir'],
];

for (const [i, [slug, titulo, icon, sub]] of BLOG.entries()) {
  ogJobs.push([`og/blog-${slug}`, ogCard({ titulo, kicker: 'Blog · Artes Marciales Garraf', sub, icon, seed: i + 31 })]);
  artJobs.push([`img/blog-${slug}`, heroArt({ icon, seed: i + 31 })]);
}

// La portada conserva og-default.png, que ya existe y funciona.

// ── Render ──────────────────────────────────────────────────────────────────
mkdirSync(new URL('../public/og/', import.meta.url), { recursive: true });
mkdirSync(new URL('../public/img/', import.meta.url), { recursive: true });

const out = p => fileURLToPath(new URL(`../public/${p}`, import.meta.url));
let bytes = 0;

for (const [name, svg] of ogJobs) {
  const info = await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toFile(out(`${name}.png`));
  bytes += info.size;
}
for (const [name, svg] of artJobs) {
  const info = await sharp(Buffer.from(svg)).webp({ quality: 82 }).toFile(out(`${name}.webp`));
  bytes += info.size;
}

// Manifiesto: la web no puede adivinar qué imágenes existen, y enlazar una que
// falta produce un 404 en la tarjeta social (peor que no poner ninguna). El
// generador declara lo que ha creado y `src/data/imagenes.ts` resuelve contra
// esta lista, así que ambos lados no pueden desincronizarse.
const manifiesto = {
  _nota: 'Generado por scripts/gen-images.mjs. No editar a mano.',
  generado: new Date().toISOString().slice(0, 10),
  og: ogJobs.map(([n]) => n.replace('og/', '')).sort(),
  img: artJobs.map(([n]) => n.replace('img/', '')).sort(),
};
writeFileSync(
  fileURLToPath(new URL('../src/data/imagenes-generadas.json', import.meta.url)),
  JSON.stringify(manifiesto, null, 2) + '\n',
);

console.log(`OK  ${ogJobs.length} tarjetas OG + ${artJobs.length} ilustraciones — ${(bytes / 1024).toFixed(0)} KB en total`);
