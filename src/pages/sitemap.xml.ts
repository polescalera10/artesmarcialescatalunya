// Sitemap con alternativas hreflang. <lastmod>: fecha de verificación en las
// fichas, fecha de publicación en el blog y la última revisión editorial en el
// resto (no la fecha del build: Google ignora los lastmod que siempre son hoy).
import type { APIRoute } from 'astro';
import { SITE } from '../lib/site';
import { url, LANGS, type Lang } from '../lib/i18n';
import { CENTROS } from '../lib/centros';
import { POSTS } from '../lib/editorial';
import { rutasComarca, rutasMunicipio, rutasMunDisc, rutasDisciplina, rutasDiscComarca, fichaIndexable } from '../lib/rutas';

type Entrada = { por: (l: Lang) => string; lastmod: string; bilingue: boolean };
const R = SITE.ultimaRevision;
const entradas: Entrada[] = [
  { por: l => url.home(l), lastmod: R, bilingue: true },
  { por: l => url.centros(l), lastmod: R, bilingue: true },
  { por: l => url.disciplinas(l), lastmod: R, bilingue: true },
  { por: l => url.paraCentros(l), lastmod: R, bilingue: true },
  { por: l => url.sobre(l), lastmod: R, bilingue: true },
  { por: l => url.contacto(l), lastmod: R, bilingue: true },
  ...rutasComarca().map(r => ({ por: (l: Lang) => url.comarca(l, r.comarca), lastmod: R, bilingue: true })),
  ...rutasMunicipio().map(r => ({ por: (l: Lang) => url.municipio(l, r.comarca, r.municipio), lastmod: R, bilingue: true })),
  ...rutasMunDisc().map(r => ({ por: (l: Lang) => url.munDisc(l, r.comarca, r.municipio, r.disciplina), lastmod: R, bilingue: true })),
  ...rutasDisciplina().map(r => ({ por: (l: Lang) => url.disciplina(l, r.disciplina), lastmod: R, bilingue: true })),
  ...rutasDiscComarca().map(r => ({ por: (l: Lang) => url.discComarca(l, r.disciplina, r.comarca), lastmod: R, bilingue: true })),
  ...CENTROS.filter(fichaIndexable).map(c => ({ por: (l: Lang) => url.centro(l, c.slug), lastmod: c.verificado, bilingue: true })),
  { por: () => url.blog(), lastmod: POSTS[0]?.fecha ?? R, bilingue: false },
  ...POSTS.map(p => ({ por: () => url.post(p.slug), lastmod: p.fecha, bilingue: false })),
];

export const GET: APIRoute = () => {
  const urls: string[] = [];
  for (const e of entradas) {
    const langs = e.bilingue ? LANGS : (['es'] as Lang[]);
    for (const l of langs) {
      const alt = e.bilingue
        ? LANGS.map(x => `<xhtml:link rel="alternate" hreflang="${x}" href="${SITE.url}${e.por(x)}"/>`).join('') +
          `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE.url}${e.por('es')}"/>`
        : '';
      urls.push(`<url><loc>${SITE.url}${e.por(l)}</loc><lastmod>${e.lastmod}</lastmod>${alt}</url>`);
    }
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
