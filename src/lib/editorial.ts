// Puente con el contenido heredado de artesmarcialesgarraf.es (src/garraf/).
//
// Aquel sitio tenía textos propios por municipio, por disciplina en cada
// municipio, guías de perfil y 35 artículos. Aquí se reutilizan tal cual y se
// les da su sitio en la estructura nueva:
//   - guía de municipio        → /garraf/<municipio>/
//   - disciplina en municipio  → /garraf/<municipio>/<disciplina>/
//   - guías de perfil y el resto de páginas editoriales → /blog/<slug>/
// `rutaNueva()` hace la misma traducción para los 301 y para reescribir los
// enlaces internos de esos textos.
import { ALL_PAGES, type PageDef } from '../garraf/pages';
import { url } from './i18n';

const COMARCA_LEGADO = 'garraf';

const esMunDisc = (p: PageDef) => p.type === 'money-page' && p.disciplina && p.municipio && p.slug === `${p.disciplina}-en-${p.municipio}`;
const aBlog = (p: PageDef) =>
  p.type === 'blog' || (p.type === 'money-page' && !esMunDisc(p)) || (p.type === 'hub-perfil' && p.slug !== 'otras-artes-marciales');

/** Ruta nueva (castellano) para una ruta antigua del sitio del Garraf. */
export function rutaNueva(vieja: string): string | null {
  const path = vieja.endsWith('/') ? vieja : `${vieja}/`;
  if (['/', '/centros/', '/blog/', '/contacto/', '/sobre-nosotros/', '/aviso-legal/', '/politica-privacidad/'].includes(path)) return path;
  if (path === '/ca/') return url.centros('ca');
  const ca = path.match(/^\/ca\/arts-marcials-([a-z0-9-]+)\/$/);
  if (ca) return url.municipio('ca', COMARCA_LEGADO, ca[1]);
  const cerca = path.match(/^\/artes-marciales-cerca-de-([a-z0-9-]+)\/$/);
  if (cerca) return url.municipio('es', COMARCA_LEGADO, cerca[1]);
  if (path === '/otras-artes-marciales/') return url.disciplinas('es');
  const slug = path.replace(/^\/|\/$/g, '');
  const p = ALL_PAGES.find(x => x.slug === slug);
  if (!p) return null;
  if (p.type === 'hub-municipio') return url.municipio('es', COMARCA_LEGADO, p.municipio!);
  if (p.type === 'hub-disciplina') return url.disciplina('es', p.disciplina!);
  if (esMunDisc(p)) return url.munDisc('es', COMARCA_LEGADO, p.municipio!, p.disciplina!);
  if (p.type === 'blog') return `/${p.slug}/`;
  if (aBlog(p)) return url.post(p.slug);
  return null;
}

/** Todas las rutas antiguas con su destino, para las redirecciones 301. */
export function mapaRedirecciones(): { de: string; a: string }[] {
  const viejas = [
    '/', '/centros/', '/blog/', '/contacto/', '/sobre-nosotros/', '/aviso-legal/', '/politica-privacidad/',
    '/ca/', '/otras-artes-marciales/',
    ...['sitges', 'vilanova-i-la-geltru', 'sant-pere-de-ribes', 'cubelles', 'canyelles', 'olivella'].map(m => `/ca/arts-marcials-${m}/`),
    ...['sant-pere-de-ribes', 'cubelles', 'canyelles'].map(m => `/artes-marciales-cerca-de-${m}/`),
    ...ALL_PAGES.map(p => `/${p.slug}/`),
  ];
  return [...new Set(viejas)].map(de => ({ de, a: rutaNueva(de)! })).filter(r => r.a);
}

/** Reescribe los enlaces internos antiguos de un HTML heredado. */
export function reescribirEnlaces(html: string): string {
  return html.replace(/href="(\/[^"#?]*)"/g, (m, path) => {
    const nueva = rutaNueva(path);
    return nueva ? `href="${nueva}"` : m;
  });
}

export interface Editorial {
  h1: string;
  intro: string;
  body?: string;
  faq?: { q: string; a: string }[];
  titulo: string;
  descripcion: string;
}

const aEditorial = (p: PageDef): Editorial => ({
  h1: p.h1,
  intro: reescribirEnlaces(p.intro),
  body: p.body ? reescribirEnlaces(p.body) : undefined,
  faq: p.localFaq?.map(f => ({ q: f.q, a: f.a })),
  titulo: p.meta.title,
  descripcion: p.meta.description,
});

export function editorialMunicipio(comarca: string, municipio: string): Editorial | null {
  if (comarca !== COMARCA_LEGADO) return null;
  const p = ALL_PAGES.find(x => x.type === 'hub-municipio' && x.municipio === municipio);
  return p ? aEditorial(p) : null;
}

export function editorialMunDisc(comarca: string, municipio: string, disciplina: string): Editorial | null {
  if (comarca !== COMARCA_LEGADO) return null;
  const p = ALL_PAGES.find(x => esMunDisc(x) && x.municipio === municipio && x.disciplina === disciplina);
  return p ? aEditorial(p) : null;
}

/** Combinaciones municipio × disciplina con texto heredado (existen aunque no haya centro local). */
export const MUNDISC_HEREDADAS = ALL_PAGES.filter(esMunDisc).map(p => ({
  comarca: COMARCA_LEGADO,
  municipio: p.municipio!,
  disciplina: p.disciplina!,
}));
export const MUNICIPIOS_HEREDADOS = ALL_PAGES.filter(p => p.type === 'hub-municipio').map(p => ({
  comarca: COMARCA_LEGADO,
  municipio: p.municipio!,
}));

// ── Blog ───────────────────────────────────────────────────────────────────
export interface Post extends Editorial {
  slug: string;
  fecha: string;
  tipo: 'articulo' | 'guia';
}

export const POSTS: Post[] = ALL_PAGES.filter(aBlog)
  .map(p => ({
    ...aEditorial(p),
    slug: p.slug.replace(/^blog\//, ''),
    fecha: p.fecha ?? '2026-09-29',
    tipo: (p.type === 'blog' ? 'articulo' : 'guia') as Post['tipo'],
  }))
  .sort((a, b) => b.fecha.localeCompare(a.fecha) || a.slug.localeCompare(b.slug));
