// Fotos de archivo (Pexels) de data/fotos.json, ya procesadas en public/fotos/
// por scripts/gen-fotos.mjs. Son ilustrativas: nunca representan a un centro.
import manifiesto from '../../data/fotos.json';
import dims from '../../data/fotos-generadas.json';
import { DISCIPLINAS, getDisciplina } from './disciplinas';
import type { Lang } from './i18n';

interface Entrada { id: number; es: string; ca: string; pos?: string }
const FOTOS = manifiesto.fotos as Record<string, Entrada>;
const POSTS = manifiesto.posts as Record<string, string>;
const dimensiones = dims as Record<string, { nombre: string; w: number; h: number; w640: number; h640: number }>;

export interface Foto {
  clave: string;
  src640: string;
  src1280: string;
  w: number;
  h: number;
  alt: Record<Lang, string>;
  pos: string;
}

export function foto(clave: string): Foto {
  const f = FOTOS[clave] ?? FOTOS.home;
  const d = dimensiones[f.id];
  return {
    clave,
    src640: `/fotos/${d.nombre}-640.webp`,
    src1280: `/fotos/${d.nombre}-1280.webp`,
    w: d.w,
    h: d.h,
    alt: { es: f.es, ca: f.ca },
    pos: f.pos ?? '50% 35%',
  };
}

// Disciplina sin foto propia: la de su grupo.
const POR_GRUPO: Record<string, string> = {
  golpeo: 'boxeo', mixto: 'mma', agarre: 'judo', tradicional: 'karate', interno: 'tai-chi', autodefensa: 'defensa-personal',
};
export function claveDisciplina(slug: string): string {
  if (FOTOS[slug]) return slug;
  const g = getDisciplina(slug)?.grupo;
  return (g && POR_GRUPO[g]) || 'home';
}

// Artículo del blog: el mapa de data/fotos.json y, si es nuevo, la disciplina
// que nombra su slug; si no, una clase genérica de dojo.
export function clavePost(slug: string): string {
  if (POSTS[slug] && FOTOS[POSTS[slug]]) return POSTS[slug];
  const d = DISCIPLINAS.find(x => slug.includes(x.slug));
  return d ? claveDisciplina(d.slug) : 'dojo-clase';
}

// Artículo en castellano o su traducción catalana (que usa la foto del original).
export const clavePostDe = (p: { slug: string; original?: string }) => clavePost(p.original ?? p.slug);

// Foto de una comarca o municipio: la de la disciplina que más centros tiene.
export function claveTop(disciplinasOrdenadas: { slug: string }[]): string {
  return disciplinasOrdenadas[0] ? claveDisciplina(disciplinasOrdenadas[0].slug) : 'home';
}
