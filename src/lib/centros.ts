// Directorio de centros. Un JSON por comarca en data/centros/ (norma en
// data/INSTRUCCIONES-CENTROS.md). Se valida al compilar: un dato mal escrito
// rompe el build en vez de publicar una ficha rota.
import { getMunicipio, getComarca, distanciaKm, type Municipio } from './geo';
import { getDisciplina } from './disciplinas';
import promocionadosRaw from '../../data/promocionados.json';

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
