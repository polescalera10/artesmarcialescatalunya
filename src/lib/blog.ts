// Blog: artículos en Markdown (src/content/blog) más los heredados del sitio
// del Garraf que aún no se han reescrito. Un Markdown sustituye al heredado
// con su mismo slug o con su `slugAnterior`. Un heredado con un 301 en
// vercel.json (`/blog/<slug>/`) se da por retirado: ni página ni sitemap.
import { getCollection } from 'astro:content';
import { marked } from 'marked';
import { POSTS as HEREDADOS, type Post } from './editorial';
import { conRecuentos } from './recuentos';
import vercel from '../../vercel.json';

export interface Articulo extends Post {
  actualizado: string;
  reescrito: boolean;
  slugAnterior?: string;
  imagen?: string;
}

const redirigidos = new Set((vercel.redirects as { source: string }[]).map(r => r.source));
let cache: Articulo[] | undefined;

export async function articulos(): Promise<Articulo[]> {
  if (cache) return cache;
  const md = await getCollection('blog');
  const nuevos: Articulo[] = md.map(e => {
    const d = e.data;
    if (redirigidos.has(`/blog/${e.id}/`))
      throw new Error(`Blog: ${e.id} tiene un 301 en vercel.json que taparía el artículo`);
    if (d.slugAnterior && d.slugAnterior !== e.id && !redirigidos.has(`/blog/${d.slugAnterior}/`))
      throw new Error(`Blog: ${e.id} cambia de slug pero falta el 301 de /blog/${d.slugAnterior}/ en vercel.json`);
    return {
      slug: e.id,
      tipo: d.tipo,
      titulo: d.titulo,
      descripcion: d.descripcion,
      h1: d.h1,
      intro: conRecuentos(d.intro),
      body: marked.parse(conRecuentos(e.body ?? ''), { async: false }) as string,
      faq: d.faq?.map(f => ({ q: conRecuentos(f.q), a: conRecuentos(f.a) })),
      fecha: d.fecha,
      actualizado: d.actualizado,
      slugAnterior: d.slugAnterior,
      imagen: d.imagen,
      reescrito: true,
    };
  });
  const sustituidos = new Set(nuevos.flatMap(n => [n.slug, n.slugAnterior ?? n.slug]));
  const viejos: Articulo[] = HEREDADOS.filter(p => !sustituidos.has(p.slug) && !redirigidos.has(`/blog/${p.slug}/`)).map(p => ({ ...p, actualizado: p.fecha, reescrito: false }));
  cache = [...nuevos, ...viejos].sort((a, b) => b.fecha.localeCompare(a.fecha) || a.slug.localeCompare(b.slug));
  return cache;
}

// --- Blog en catalán -------------------------------------------------------
// Solo los artículos traducidos (src/content/blog-ca). Los enlaces internos se
// escriben en castellano en el Markdown y aquí se pasan a su ruta catalana.

export interface ArticuloCa extends Articulo {
  /** Slug del original en castellano */
  original: string;
}

let cacheCa: ArticuloCa[] | undefined;

export async function articulosCa(): Promise<ArticuloCa[]> {
  if (cacheCa) return cacheCa;
  const es = new Set((await articulos()).map(a => a.slug));
  const md = await getCollection('blog-ca');
  const aCa = new Map(md.map(e => [e.data.original, e.id]));
  const html = (s: string) => aCatalan(s, aCa);
  cacheCa = md.map(e => {
    const d = e.data;
    if (!es.has(d.original)) throw new Error(`Blog ca: ${e.id} traduce ${d.original}, que no existe en castellano`);
    return {
      slug: e.id,
      original: d.original,
      tipo: d.tipo,
      titulo: d.titulo,
      descripcion: d.descripcion,
      h1: d.h1,
      intro: html(conRecuentos(d.intro)),
      body: html(marked.parse(conRecuentos(e.body ?? ''), { async: false }) as string),
      faq: d.faq?.map(f => ({ q: conRecuentos(f.q), a: html(conRecuentos(f.a)) })),
      fecha: d.fecha,
      actualizado: d.actualizado,
      imagen: d.imagen,
      reescrito: true,
    };
  }).sort((a, b) => b.fecha.localeCompare(a.fecha) || a.slug.localeCompare(b.slug));
  return cacheCa;
}

/** Slug catalán de un artículo en castellano, si está traducido. */
export async function traduccionCa(slugEs: string): Promise<string | undefined> {
  return (await articulosCa()).find(a => a.original === slugEs)?.slug;
}

const SEG_CA: Record<string, string> = {
  centros: 'centres', disciplinas: 'disciplines', 'para-centros': 'per-a-centres', contacto: 'contacte', 'sobre-nosotros': 'qui-som',
};
const SOLO_ES = /^\/(aviso-legal|politica-privacidad|img|og|datos|ca)(\/|$)/;

/** Reescribe href="/..." a la versión catalana: directorio bajo /ca/ y artículos traducidos a /ca/blog/. */
function aCatalan(html: string, aCa: Map<string, string>) {
  return html.replace(/href="(\/[^"#?]*)([#?][^"]*)?"/g, (m, ruta: string, resto = '') => {
    if (SOLO_ES.test(ruta)) return m;
    const b = ruta.match(/^\/blog\/([^/]+)\/$/);
    if (b) return aCa.has(b[1]) ? `href="/ca/blog/${aCa.get(b[1])}/${resto}"` : m;
    if (ruta === '/blog/') return `href="/ca/blog/${resto}"`;
    const [, primero = '', resto2 = ''] = ruta.match(/^\/([^/]*)(.*)$/)!;
    return `href="/ca/${SEG_CA[primero] ?? primero}${resto2}${resto}"`.replace('/ca/"', '/ca/"');
  });
}

// --- Relevancia entre artículos y disciplinas ---------------------------------
// Se deduce del contenido (enlaces a /disciplinas/<d>/ y filtros ?disciplina=<d>) y del slug,
// para que cada artículo nuevo entre solo en las guías y en «Sigue leyendo».

const RE_DISC = /(?:\/disciplin(?:as|es)\/|[?&]disciplina=)([a-z0-9-]+)/g;
const ALIAS_DISC: Record<string, string[]> = {
  'jiu-jitsu-brasileno': ['jiu-jitsu', 'bjj'], 'jiu-jitsu-japones': ['jiu-jitsu'], 'kung-fu': ['kung-fu', 'wing-chun'],
};
const PARADA = new Set('para como cual cuales entre sobre ninos nino artes marciales arte marcial mejor empezar'.split(' '));

function disciplinasDe(a: { body?: string; intro: string }): Map<string, number> {
  const m = new Map<string, number>();
  for (const x of ((a.body ?? '') + a.intro).matchAll(RE_DISC)) m.set(x[1], (m.get(x[1]) ?? 0) + 1);
  return m;
}
const eslug = (a: Articulo | ArticuloCa) => ('original' in a ? (a as ArticuloCa).original : a.slug);

/** Qué tanto trata un artículo de una disciplina: enlaces a ella y, sobre todo, que esté en el slug. */
export function relevanciaDisciplina(a: Articulo | ArticuloCa, d: string): number {
  const tokens = ALIAS_DISC[d] ?? [d];
  return (disciplinasDe(a).get(d) ?? 0) + (tokens.some(t => eslug(a).includes(t)) ? 10 : 0);
}

/** Slugs en castellano de los artículos que más tratan de una disciplina (solo los traducidos si lang es ca). */
export async function guiasDeDisciplina(d: string, lang: 'es' | 'ca', max: number): Promise<string[]> {
  const pool: (Articulo | ArticuloCa)[] = lang === 'ca' ? await articulosCa() : await articulos();
  return pool
    .map(a => ({ a, s: relevanciaDisciplina(a, d) }))
    .filter(x => x.s >= 3)
    .sort((x, y) => y.s - x.s || y.a.fecha.localeCompare(x.a.fecha) || x.a.slug.localeCompare(y.a.slug))
    .slice(0, max)
    .map(x => eslug(x.a));
}

const palabras = (s: string) => new Set(s.split('-').filter(w => w.length > 3 && !PARADA.has(w)));

/** Artículos más próximos a uno dado (disciplinas compartidas y palabras del slug); rellena con los más recientes. */
export async function relacionados(post: Articulo | ArticuloCa, lang: 'es' | 'ca', n: number): Promise<(Articulo | ArticuloCa)[]> {
  const pool: (Articulo | ArticuloCa)[] = (lang === 'ca' ? await articulosCa() : await articulos()).filter(p => p.slug !== post.slug);
  const dp = disciplinasDe(post);
  const wp = palabras(eslug(post));
  const puntuados = pool.map(p => {
    let s = 0;
    for (const [d, c] of disciplinasDe(p)) if (dp.has(d)) s += Math.min(c, dp.get(d)!);
    for (const w of palabras(eslug(p))) if (wp.has(w)) s += 3;
    return { p, s };
  }).sort((x, y) => y.s - x.s || y.p.fecha.localeCompare(x.p.fecha) || x.p.slug.localeCompare(y.p.slug));
  return puntuados.slice(0, n).map(x => x.p);
}
