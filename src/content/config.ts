// Colección del blog: un Markdown por artículo en src/content/blog/<slug>.md.
// Norma de redacción en content/PLAYBOOK-BLOG.md.
import { defineCollection, z } from 'astro:content';

const fecha = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const blog = defineCollection({
  type: 'content',
  schema: z.object({
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
  }),
});

export const collections = { blog };
