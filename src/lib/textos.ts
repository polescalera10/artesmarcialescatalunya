// Frases con nombres de comarca: cada una lleva su artículo y hay que
// escribirlo bien en los dos idiomas ("en el Garraf", "a l'Alt Penedès",
// "a les Garrigues", "a Osona").
import { getComarca, getMunicipio } from './geo';
import type { Lang } from './i18n';

// Artículo en catalán; el castellano se deriva (l' → el/la según el género).
const ARTICULO_CA: Record<string, string> = {
  'alt-camp': "l'", 'alt-emporda': "l'", 'alt-penedes': "l'", 'alt-urgell': "l'", 'alta-ribagorca': "l'",
  anoia: "l'", aran: '', bages: 'el', 'baix-camp': 'el', 'baix-ebre': 'el', 'baix-emporda': 'el',
  'baix-llobregat': 'el', 'baix-penedes': 'el', barcelones: 'el', bergueda: 'el', cerdanya: 'la',
  'conca-de-barbera': 'la', garraf: 'el', garrigues: 'les', garrotxa: 'la', girones: 'el', llucanes: 'el',
  maresme: 'el', moianes: 'el', montsia: 'el', noguera: 'la', osona: '', 'pallars-jussa': 'el',
  'pallars-sobira': 'el', 'pla-de-lestany': 'el', 'pla-durgell': 'el', priorat: 'el', 'ribera-debre': 'la',
  ripolles: 'el', segarra: 'la', segria: 'el', selva: 'la', solsones: 'el', tarragones: 'el',
  'terra-alta': 'la', urgell: "l'", 'valles-occidental': 'el', 'valles-oriental': 'el',
};
const FEMENINAS_L = new Set(['alta-ribagorca', 'anoia']);

function articuloEs(slug: string): string {
  const a = ARTICULO_CA[slug] ?? 'el';
  if (a === "l'") return FEMENINAS_L.has(slug) ? 'la' : 'el';
  return a;
}

/** "el Garraf" / "l'Alt Penedès" / "Osona" */
export function laComarca(lang: Lang, slug: string): string {
  const nombre = slug === 'aran' ? (lang === 'ca' ? "la Val d'Aran" : 'el Valle de Arán') : getComarca(slug)!.nombre;
  if (slug === 'aran') return nombre;
  const a = lang === 'ca' ? ARTICULO_CA[slug] ?? 'el' : articuloEs(slug);
  if (!a) return nombre;
  return a.endsWith("'") ? `${a}${nombre}` : `${a} ${nombre}`;
}

/** "en el Garraf" / "al Garraf" / "a l'Anoia" / "als Garrigues"… */
export function enComarca(lang: Lang, slug: string): string {
  const la = laComarca(lang, slug);
  if (lang === 'es') return `en ${la}`;
  if (la.startsWith('el ')) return `al ${la.slice(3)}`;
  if (la.startsWith('les ')) return `a ${la}`;
  return `a ${la}`;
}

/** "del Garraf" / "de l'Alt Penedès" / "de la Selva" / "d'Osona" */
export function deComarca(lang: Lang, slug: string): string {
  const la = laComarca(lang, slug);
  if (la.startsWith('el ')) return `del ${la.slice(3)}`;
  if (lang === 'ca' && /^[aeiouàèéíòóúAEIOUÀÈÉÍÒÓÚ]/.test(la)) return `d'${la}`;
  if (lang === 'ca' && la.startsWith('els ')) return `dels ${la.slice(4)}`;
  return `de ${la}`;
}

/** "en Vilanova i la Geltrú" / "a Vilanova i la Geltrú" / "a L'Hospitalet de Llobregat" */
export function enMunicipio(lang: Lang, slug: string): string {
  const nombre = getMunicipio(slug)!.nombre;
  return `${lang === 'ca' ? 'a' : 'en'} ${nombre}`;
}

/** Nombre de comarca sin artículo, para títulos cortos. */
export const nombreComarca = (slug: string) => getComarca(slug)!.nombre;
