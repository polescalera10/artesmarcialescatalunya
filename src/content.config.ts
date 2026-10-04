// Colección del blog: un Markdown por artículo en src/content/blog/<slug>.md.
// Norma de redacción en content/PLAYBOOK-BLOG.md.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const fecha = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const esquema = z.object({
  titulo: z.string().max(60),
  descripcion: z.string().max(155),
  h1: z.string(),
  /** Entradilla en texto plano (admite marcadores de recuento y <a>). */
  intro: z.string(),
  tipo: z.enum(['articulo', 'guia']),
  /** Publicación original (se conserva al reescribir). */
  fecha,
  /** Última revisión real del contenido. */
  actualizado: fecha,
  /** Slug que tenía en el sitio del Garraf, si ha cambiado. Exige un 301 en vercel.json. */
  slugAnterior: z.string().optional(),
  /** Clave de la ilustración en public/img y public/og, si no coincide con el slug. */
  imagen: z.string().optional(),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
});

const blog = defineCollection({ loader: glob({ pattern: '*.md', base: './src/content/blog' }), schema: esquema });
// Traducciones al catalán (src/content/blog-ca/<slug-catalán>.md). `original`
// es el slug del artículo en castellano: da el hreflang y la ilustración.
const blogCa = defineCollection({ loader: glob({ pattern: '*.md', base: './src/content/blog-ca' }), schema: esquema.extend({ original: z.string() }) });

export const collections = { blog, 'blog-ca': blogCa };
