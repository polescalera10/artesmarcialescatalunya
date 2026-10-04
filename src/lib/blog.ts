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
    if (redirigidos.has(`/blog/${e.slug}/`))
      throw new Error(`Blog: ${e.slug} tiene un 301 en vercel.json que taparía el artículo`);
    if (d.slugAnterior && d.slugAnterior !== e.slug && !redirigidos.has(`/blog/${d.slugAnterior}/`))
      throw new Error(`Blog: ${e.slug} cambia de slug pero falta el 301 de /blog/${d.slugAnterior}/ en vercel.json`);
    return {
      slug: e.slug,
      tipo: d.tipo,
      titulo: d.titulo,
      descripcion: d.descripcion,
      h1: d.h1,
      intro: conRecuentos(d.intro),
      body: marked.parse(conRecuentos(e.body), { async: false }) as string,
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
  const aCa = new Map(md.map(e => [e.data.original, e.slug]));
  const html = (s: string) => aCatalan(s, aCa);
  cacheCa = md.map(e => {
    const d = e.data;
    if (!es.has(d.original)) throw new Error(`Blog ca: ${e.slug} traduce ${d.original}, que no existe en castellano`);
    return {
      slug: e.slug,
      original: d.original,
      tipo: d.tipo,
      titulo: d.titulo,
      descripcion: d.descripcion,
      h1: d.h1,
      intro: html(conRecuentos(d.intro)),
      body: html(marked.parse(conRecuentos(e.body), { async: false }) as string),
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
