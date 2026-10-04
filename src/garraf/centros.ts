// ────────────────────────────────────────────────────────────────────────────
// DIRECTORIO DE CENTROS REALES — comarca del Garraf
//
// Regla innegociable: aquí solo entran centros REALES con datos procedentes de
// fuentes públicas verificables (web oficial del centro, registro de federación
// o directorio municipal). Cada entrada lleva su fuente y la fecha en que se
// verificó. Prohibido añadir valoraciones, reseñas, precios u opiniones.
// Si un dato no se puede verificar, no se publica.
//
// Este directorio es informativo: no implica relación comercial con los centros
// listados ni recomendación de unos sobre otros (orden alfabético por municipio).
// ────────────────────────────────────────────────────────────────────────────

export type FuenteTipo = 'web-oficial' | 'federacion' | 'directorio-municipal' | 'perfil-publico';

export interface Centro {
  nombre: string;
  municipio: string; // slug de locations.ts
  /** Slugs de disciplines.ts que ofrece el centro según su fuente pública */
  disciplinas: string[];
  /** Actividades citadas por la fuente que no tienen página propia en la guía */
  otras?: string[];
  /** Solo si consta en la propia fuente verificada; nunca deducida */
  direccion?: string;
  /** Web pública del centro, si tiene */
  web?: string;
  /** URL de la fuente pública donde se verificaron los datos */
  fuente: string;
  fuenteTipo: FuenteTipo;
  /** Fecha de la última verificación de los datos (YYYY-MM-DD) */
  verificado: string;
}

export const FUENTE_LABELS: Record<FuenteTipo, string> = {
  'web-oficial': 'Web oficial del centro',
  'federacion': 'Registro de clubs de la federación',
  'directorio-municipal': 'Directorio municipal de entidades',
  'perfil-publico': 'Perfil público del centro',
};

// Adaptador: los centros del Garraf viven ahora en data/centros/garraf.json
// con el formato del directorio catalán. El contenido heredado del Garraf
// (textos, FAQ, recuentos) sigue leyéndolos con la forma antigua.
import garraf from '../../data/centros/garraf.json';

export const CENTROS: Centro[] = (garraf as any[]).map(c => ({
  nombre: c.nombre,
  municipio: c.municipio,
  disciplinas: c.disciplinas,
  otras: [...(c.otras ?? []), ...(c.infantil ? ['Clases infantiles'] : [])],
  direccion: c.direccion,
  web: c.web,
  fuente: c.fuente,
  fuenteTipo: c.fuenteTipo,
  verificado: c.verificado,
}));

export function getCentrosByMunicipio(municipio: string): Centro[] {
  return CENTROS.filter(c => c.municipio === municipio);
}

export function getCentrosByDisciplina(disciplina: string): Centro[] {
  return CENTROS.filter(c => c.disciplinas.includes(disciplina));
}

export function getCentros(municipio: string, disciplina: string): Centro[] {
  return CENTROS.filter(c => c.municipio === municipio && c.disciplinas.includes(disciplina));
}

/** Centros de la disciplina en el resto de la comarca (para municipios sin oferta local) */
export function getCentrosCercanos(municipio: string, disciplina: string): Centro[] {
  return CENTROS.filter(c => c.municipio !== municipio && c.disciplinas.includes(disciplina));
}
