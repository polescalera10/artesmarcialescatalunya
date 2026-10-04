// Idiomas y rutas. Castellano en la raíz, catalán en /ca/ (decisión de Pol,
// 29-09-2026). Todas las URLs se construyen aquí: ninguna plantilla escribe
// rutas a mano, así un cambio de estructura se hace en un solo sitio.

export type Lang = 'es' | 'ca';
export const LANGS: Lang[] = ['es', 'ca'];

/** Texto según idioma: L(lang, 'castellano', 'català'). */
export const L = (lang: Lang, es: string, ca: string) => (lang === 'ca' ? ca : es);

const P = (lang: Lang) => (lang === 'ca' ? '/ca' : '');
const SEG = {
  centros: { es: 'centros', ca: 'centres' },
  disciplinas: { es: 'disciplinas', ca: 'disciplines' },
  paraCentros: { es: 'para-centros', ca: 'per-a-centres' },
  sobre: { es: 'sobre-nosotros', ca: 'qui-som' },
  contacto: { es: 'contacto', ca: 'contacte' },
} as const;

export const url = {
  home: (lang: Lang) => `${P(lang)}/`,
  comarca: (lang: Lang, c: string) => `${P(lang)}/${c}/`,
  municipio: (lang: Lang, c: string, m: string) => `${P(lang)}/${c}/${m}/`,
  munDisc: (lang: Lang, c: string, m: string, d: string) => `${P(lang)}/${c}/${m}/${d}/`,
  disciplinas: (lang: Lang) => `${P(lang)}/${SEG.disciplinas[lang]}/`,
  disciplina: (lang: Lang, d: string) => `${P(lang)}/${SEG.disciplinas[lang]}/${d}/`,
  discComarca: (lang: Lang, d: string, c: string) => `${P(lang)}/${SEG.disciplinas[lang]}/${d}/${c}/`,
  centros: (lang: Lang) => `${P(lang)}/${SEG.centros[lang]}/`,
  centro: (lang: Lang, slug: string) => `${P(lang)}/${SEG.centros[lang]}/${slug}/`,
  paraCentros: (lang: Lang) => `${P(lang)}/${SEG.paraCentros[lang]}/`,
  sobre: (lang: Lang) => `${P(lang)}/${SEG.sobre[lang]}/`,
  contacto: (lang: Lang) => `${P(lang)}/${SEG.contacto[lang]}/`,
  blog: (lang: Lang = 'es') => `${P(lang)}/blog/`,
  post: (slug: string, lang: Lang = 'es') => `${P(lang)}/blog/${slug}/`,
  avisoLegal: () => '/aviso-legal/',
  privacidad: () => '/politica-privacidad/',
};

/** Número con su sustantivo: n(3,'centro','centros') → "3 centros". */
export const n = (k: number, uno: string, varios: string) => `${k} ${k === 1 ? uno : varios}`;

/** Lista natural: "a, b y c" / "a, b i c". */
export function lista(lang: Lang, xs: string[]): string {
  if (xs.length <= 1) return xs.join('');
  return `${xs.slice(0, -1).join(', ')} ${L(lang, 'y', 'i')} ${xs[xs.length - 1]}`;
}

/** Fecha legible: 2026-09-30 → "30 de septiembre de 2026". */
export function fecha(lang: Lang, iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString(lang === 'ca' ? 'ca-ES' : 'es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Recorte de metadatos sin partir palabras (Google corta hacia 60 y 155).
export function clamp(text: string, max: number): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const sp = cut.lastIndexOf(' ');
  return cut.slice(0, sp > 0 ? sp : max).replace(/[\s,;:·—–-]+$/, '');
}

/** Primera opción de título que cabe en 60 caracteres. */
export const titulo = (...opciones: string[]) => opciones.find(o => o.length <= 60) ?? clamp(opciones[opciones.length - 1], 60);
/** Primera opción de descripción que cabe en 155 caracteres. */
export const descripcion = (...opciones: string[]) => opciones.find(o => o.length <= 155) ?? clamp(opciones[opciones.length - 1], 155);
