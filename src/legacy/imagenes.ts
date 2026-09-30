// Resolución de imaginería por página (C4 parte 2).
//
// Dos piezas por página, ambas generadas por `node scripts/gen-images.mjs`:
//
//   · tarjeta social (og:image, 1200x630) — antes las 67 páginas compartían
//     og-default.png, así que cualquier enlace compartido en WhatsApp, Slack o
//     X salía con la misma imagen genérica.
//   · ilustración de cabecera (1280x720) — la web no tenía ni una sola <img>.
//
// Son ilustraciones geométricas, no fotografías: la guía habla de centros de
// terceros y no tiene instalaciones propias que fotografiar. El texto alternativo
// lo dice explícitamente para no sugerir lo contrario a quien usa lector de
// pantalla.
import manifiesto from './imagenes-generadas.json';
import { getDisciplineBySlug } from './disciplines';
import { getLocationBySlug } from './locations';
import type { PageDef } from './pages';

const OG = new Set<string>(manifiesto.og);
const IMG = new Set<string>(manifiesto.img);

export interface ImagenesDePagina {
  /** URL absoluta de la tarjeta social. Siempre existe (cae en og-default.png). */
  og: string;
  /** Ruta de la ilustración de cabecera, o null si esta página no tiene. */
  hero: string | null;
  /** Texto alternativo de la ilustración. */
  alt: string;
}

/**
 * Claves candidatas, de la más específica a la más general. La primera que
 * exista en el manifiesto gana; si no existe ninguna, se cae al genérico.
 */
function claves(page: Pick<PageDef, 'slug' | 'type' | 'disciplina' | 'municipio'>): string[] {
  if (page.type === 'blog') return [`blog-${page.slug.replace('blog/', '')}`, 'blog'];
  return [
    page.slug,                    // páginas con arte propio (perfiles, estáticas)
    page.disciplina ?? '',        // money pages y hubs de disciplina
    page.municipio ?? '',         // hubs de municipio
  ].filter(Boolean);
}

function alt(page: Pick<PageDef, 'type' | 'disciplina' | 'municipio' | 'h1'>): string {
  const d = page.disciplina ? getDisciplineBySlug(page.disciplina)?.nameEs : null;
  const m = page.municipio ? getLocationBySlug(page.municipio)?.name : null;

  if (m && !d) {
    return `Ilustración de la guía: curvas de nivel del relieve del Garraf con la posición de ${m} marcada`;
  }
  if (d) {
    return `Ilustración de la guía: símbolo de ${d} sobre una trama de la misma figura${m ? `, sección de ${m}` : ''}`;
  }
  return `Ilustración de la guía: ${page.h1.toLowerCase()}`;
}

export function imagenesDe(
  page: Pick<PageDef, 'slug' | 'type' | 'disciplina' | 'municipio' | 'h1'>,
  siteUrl: string,
): ImagenesDePagina {
  const cs = claves(page);
  const og = cs.find(c => OG.has(c));
  const hero = cs.find(c => IMG.has(c));
  return {
    og: `${siteUrl}${og ? `/og/${og}.png` : '/og-default.png'}`,
    hero: hero ? `/img/${hero}.webp` : null,
    alt: alt(page),
  };
}

/** Para las páginas sueltas (portada, contacto…), que no son PageDef. */
export function imagenesDeSlug(slug: string, h1: string, siteUrl: string): ImagenesDePagina {
  return imagenesDe({ slug, type: 'static', h1 }, siteUrl);
}
