import raw from '../../data/disciplinas.json';
import type { Lang } from './i18n';

export interface Disciplina {
  slug: string;
  es: string;
  ca: string;
  grupo: 'golpeo' | 'mixto' | 'agarre' | 'tradicional' | 'interno' | 'autodefensa';
  principal: boolean;
  sinonimos: string[];
}

export const DISCIPLINAS: Disciplina[] = raw as Disciplina[];
const porSlug = new Map(DISCIPLINAS.map(d => [d.slug, d]));

export const getDisciplina = (slug: string) => porSlug.get(slug);
export const nombreDisciplina = (slug: string, lang: Lang = 'es') => porSlug.get(slug)?.[lang] ?? slug;

export const GRUPOS: Record<Disciplina['grupo'], { es: string; ca: string }> = {
  golpeo: { es: 'Golpeo', ca: 'Cop' },
  mixto: { es: 'Mixtas', ca: 'Mixtes' },
  agarre: { es: 'Agarre y suelo', ca: 'Agafada i terra' },
  tradicional: { es: 'Tradicionales', ca: 'Tradicionals' },
  interno: { es: 'Internas', ca: 'Internes' },
  autodefensa: { es: 'Autodefensa', ca: 'Autodefensa' },
};
