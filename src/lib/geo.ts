// Geografía oficial de Cataluña (dataset de la Generalitat, ver scripts/gen-geo.py).
import comarcasRaw from '../../data/geo/comarcas.json';
import municipiosRaw from '../../data/geo/municipios.json';

export interface Comarca {
  slug: string;
  nombre: string;
  codigo: string;
  provincias: string[];
  municipios: number;
}

export interface Municipio {
  slug: string;
  nombre: string;
  comarca: string;
  provincia: string;
  ine: string;
  lat: number;
  lon: number;
}

export const COMARCAS: Comarca[] = comarcasRaw as Comarca[];
export const MUNICIPIOS: Municipio[] = municipiosRaw as Municipio[];

const comarcaPorSlug = new Map(COMARCAS.map(c => [c.slug, c]));
const municipioPorSlug = new Map(MUNICIPIOS.map(m => [m.slug, m]));

export const getComarca = (slug: string) => comarcaPorSlug.get(slug);
export const getMunicipio = (slug: string) => municipioPorSlug.get(slug);
export const municipiosDe = (comarca: string) => MUNICIPIOS.filter(m => m.comarca === comarca);

/** Distancia en km entre dos municipios (haversine sobre el centroide). */
export function distanciaKm(a: Municipio, b: Municipio): number {
  const R = 6371;
  const rad = (x: number) => (x * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
