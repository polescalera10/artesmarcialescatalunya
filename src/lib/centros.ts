// Directorio de centros. Un JSON por comarca en data/centros/ (norma en
// data/INSTRUCCIONES-CENTROS.md). Se valida al compilar: un dato mal escrito
// rompe el build en vez de publicar una ficha rota.
import { getMunicipio, getComarca, distanciaKm, type Municipio } from './geo';
import { getDisciplina } from './disciplinas';
import promocionadosRaw from '../../data/promocionados.json';
import coordenadasRaw from '../../data/geo/coordenadas-centros.json';

export type FuenteTipo = 'web-oficial' | 'federacion' | 'directorio-municipal' | 'registro-oficial' | 'perfil-publico';

export interface Centro {
  slug: string;
  nombre: string;
  tipo: 'escuela' | 'club' | 'asociacion' | 'gimnasio';
  municipio: string;
  disciplinas: string[];
  otras?: string[];
  infantil?: boolean;
  direccion?: string;
  web?: string;
  /** Logo enviado por el propio centro: archivo en public/centros/ (webp cuadrado, 256 px). */
  logo?: string;
  fuente: string;
  fuenteTipo: FuenteTipo;
  verificado: string;
  /** Derivado: comarca del municipio */
  comarca: string;
}

export interface Promocion {
  slug: string;
  desde: string;
  hasta: string;
}

const archivos = import.meta.glob('../../data/centros/*.json', { eager: true, import: 'default' }) as Record<
  string,
  Omit<Centro, 'comarca'>[]
>;

function cargar(): Centro[] {
  const errores: string[] = [];
  const vistos = new Set<string>();
  const todos: Centro[] = [];
  for (const [ruta, lista] of Object.entries(archivos)) {
    const comarcaArchivo = ruta.split('/').pop()!.replace('.json', '');
    if (!getComarca(comarcaArchivo)) errores.push(`${ruta}: la comarca ${comarcaArchivo} no existe`);
    for (const c of lista) {
      const m = getMunicipio(c.municipio);
      if (!m) errores.push(`${c.slug}: municipio desconocido ${c.municipio}`);
      else if (m.comarca !== comarcaArchivo) errores.push(`${c.slug}: ${c.municipio} es de ${m.comarca}, no de ${comarcaArchivo}`);
      for (const d of c.disciplinas) if (!getDisciplina(d)) errores.push(`${c.slug}: disciplina desconocida ${d}`);
      if (vistos.has(c.slug)) errores.push(`slug duplicado: ${c.slug}`);
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(c.slug)) errores.push(`slug no válido: ${c.slug}`);
      if (!c.fuente || !c.fuenteTipo || !/^\d{4}-\d{2}-\d{2}$/.test(c.verificado)) errores.push(`${c.slug}: falta fuente o fecha`);
      if (c.logo && !/^[a-z0-9-]+\.webp$/.test(c.logo)) errores.push(`${c.slug}: logo no válido ${c.logo}`);
      vistos.add(c.slug);
      todos.push({ ...c, comarca: comarcaArchivo });
    }
  }
  if (errores.length) throw new Error(`Directorio con errores:\n- ${errores.join('\n- ')}`);
  return todos.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}

export const CENTROS: Centro[] = cargar();
const porSlug = new Map(CENTROS.map(c => [c.slug, c]));
export const getCentro = (slug: string) => porSlug.get(slug);

/** Verificado = con fuente que confirma actividad (web, federación, ayuntamiento).
 *  Los que solo constan en el Registre d'Entitats Esportives no lo están. */
export const esVerificado = (c: Centro) => c.fuenteTipo !== 'registro-oficial';
export const verificados = (lista: Centro[]) => lista.filter(esVerificado);
export const sinVerificar = (lista: Centro[]) => lista.filter(c => !esVerificado(c));

export const centrosDeComarca = (comarca: string) => CENTROS.filter(c => c.comarca === comarca);
export const centrosDeMunicipio = (municipio: string) => CENTROS.filter(c => c.municipio === municipio);
export const centrosConDisciplina = (disciplina: string, lista: Centro[] = CENTROS) =>
  lista.filter(c => c.disciplinas.includes(disciplina));

/** Comarcas y municipios con al menos un centro, en orden alfabético. */
export const comarcasConCentros = () => [...new Set(CENTROS.map(c => c.comarca))].sort((a, b) => a.localeCompare(b));
export const municipiosConCentros = (comarca?: string) =>
  [...new Set(CENTROS.filter(c => !comarca || c.comarca === comarca).map(c => c.municipio))].sort((a, b) =>
    a.localeCompare(b),
  );

/** Disciplinas presentes en una lista, de más a menos centros. */
export function disciplinasPresentes(lista: Centro[]): { slug: string; n: number }[] {
  const cuenta = new Map<string, number>();
  for (const c of lista) for (const d of c.disciplinas) cuenta.set(d, (cuenta.get(d) ?? 0) + 1);
  return [...cuenta.entries()].map(([slug, n]) => ({ slug, n })).sort((a, b) => b.n - a.n || a.slug.localeCompare(b.slug));
}

/**
 * Centros más cercanos a un municipio que cumplen un filtro, fuera del propio
 * municipio. La distancia es entre centroides municipales: orientativa.
 */
export function cercanos(municipio: Municipio, filtro: (c: Centro) => boolean, max = 6, radioKm = 40) {
  return CENTROS.filter(c => c.municipio !== municipio.slug && filtro(c))
    .map(c => ({ centro: c, km: distanciaKm(municipio, getMunicipio(c.municipio)!) }))
    .filter(x => x.km <= radioKm)
    .sort((a, b) => a.km - b.km || a.centro.nombre.localeCompare(b.centro.nombre, 'es'))
    .slice(0, max);
}

// ── Promocionados ──────────────────────────────────────────────────────────
// Una promoción solo cuenta dentro de sus fechas. Las fichas promocionadas se
// muestran aparte y etiquetadas; el listado alfabético no cambia.
const HOY = new Date().toISOString().slice(0, 10);
export const PROMOCIONES: Promocion[] = (promocionadosRaw as Promocion[]).filter(
  p => p.desde <= HOY && HOY <= p.hasta && porSlug.has(p.slug),
);
export const esPromocionado = (slug: string) => PROMOCIONES.some(p => p.slug === slug);
export const promocionadosEn = (lista: Centro[]) => lista.filter(c => esPromocionado(c.slug));

const sinTildes = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const COORDENADAS = coordenadasRaw as Record<string, [number, number]>;

/**
 * URL del mapa incrustado de OpenStreetMap, o null si no hay coordenadas.
 * Las coordenadas (data/geo/coordenadas-centros.json) las genera
 * scripts/geocodificar-centros.py solo para direcciones con número de portal
 * dentro de su municipio; sin ellas la ficha no incrusta mapa (no se afirma una
 * ubicación dudosa). El visor de OSM no usa cookies ni requiere clave.
 */
/** Coordenadas del portal del centro, o null si no se pudo verificar. */
export const coordenadas = (slug: string): [number, number] | null => COORDENADAS[slug] ?? null;

export function mapaOsm(slug: string): string | null {
  const p = COORDENADAS[slug];
  if (!p) return null;
  const [lat, lon] = p;
  const dLat = 0.0016;
  const dLon = dLat / Math.cos((lat * Math.PI) / 180);
  const bbox = [lon - dLon, lat - dLat, lon + dLon, lat + dLat].map(n => n.toFixed(5)).join(',');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat},${lon}`;
}

/**
 * Consulta de dirección para el enlace «Ver en el mapa» (Google Maps). Las direcciones de las
 * fuentes llegan con ruido que despista al geocodificador y acaba mostrando el
 * mapa del mundo: paréntesis ("(Complex Esportiu)"), "s/n", "Nº", separadores
 * "–provincia". Se limpia eso y se usa solo la dirección + municipio, sin el
 * nombre del centro (un nombre que Google no conoce rompe la búsqueda entera).
 */
export function consultaMapa(c: Centro, municipio: string): string | null {
  if (!c.direccion) return null;
  let d = c.direccion
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\bs\/n\b\.?/gi, ' ')
    .replace(/\bn[ºo°]\.?\s*(?=\d)/gi, ' ')
    .replace(/\s*[–—]\s*[\p{L} ]+$/u, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+,/g, ',')
    .replace(/(\s*,)+\s*$/g, '')
    .replace(/^[\s,]+/, '')
    .trim();
  if (!d) return null;
  if (!sinTildes(d).includes(sinTildes(municipio))) d += `, ${municipio}`;
  return `${d}, Catalunya`;
}
