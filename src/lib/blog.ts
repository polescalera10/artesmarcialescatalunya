// Blog: artículos en Markdown (src/content/blog) más los heredados del sitio
// del Garraf que aún no se han reescrito. Un Markdown sustituye al heredado
// con su mismo slug o con su `slugAnterior`.
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
  const viejos: Articulo[] = HEREDADOS.filter(p => !sustituidos.has(p.slug)).map(p => ({ ...p, actualizado: p.fecha, reescrito: false }));
  cache = [...nuevos, ...viejos].sort((a, b) => b.fecha.localeCompare(a.fecha) || a.slug.localeCompare(b.slug));
  return cache;
}
