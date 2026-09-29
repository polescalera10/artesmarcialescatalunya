import { ALL_PAGES } from '../data/pages';
import { MUNICIPIS_CA_ORDRE, rutaCa } from '../data/ca';
import { SITE as SITE_DATA } from '../data/site';

const SITE = SITE_DATA.url;

// <lastmod> honesto: los artículos del blog llevan su fecha de publicación y el
// resto lleva la fecha de la última revisión editorial (SITE.ultimaRevision).
// Antes se emitía la fecha del build en las 66 URLs, lo que afirmaba que todo el
// sitio cambiaba cada vez que se desplegaba cualquier cosa. Google desconfía de
// los sitemaps cuyo lastmod es siempre "hoy" y acaba ignorando el campo entero,
// que es justo la señal que aquí interesa conservar.
const REVISION = SITE_DATA.ultimaRevision;

const staticPages = [
  { slug: '', priority: '1.0', changefreq: 'weekly' },
  { slug: 'centros', priority: '0.9', changefreq: 'weekly' },
  { slug: 'blog', priority: '0.7', changefreq: 'monthly' },
  // Mientras el canal de contacto está desactivado, /contacto/ es un aviso en
  // noindex: incluirlo aquí sería mandarle a Google una señal contradictoria.
  ...(SITE_DATA.contactoActivo
    ? [{ slug: 'contacto', priority: '0.9', changefreq: 'monthly' }]
    : []),
  { slug: 'sobre-nosotros', priority: '0.8', changefreq: 'monthly' },
];

function getPriority(type: string): string {
  if (type === 'money-page') return '0.9';
  if (type === 'hub-municipio') return '0.85';
  if (type === 'hub-disciplina') return '0.8';
  if (type === 'hub-perfil') return '0.75';
  if (type === 'blog') return '0.65';
  return '0.5';
}

function url(loc: string, lastmod: string, changefreq: string, priority: string): string {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export async function GET() {
  const staticUrls = staticPages.map(p =>
    url(`${SITE}/${p.slug ? p.slug + '/' : ''}`, REVISION, p.changefreq, p.priority),
  );

  const dynamicUrls = ALL_PAGES.map(p =>
    url(
      `${SITE}/${p.slug}/`,
      // Un artículo publicado en julio no debe decir que se modificó hoy.
      p.type === 'blog' ? (p.fecha ?? REVISION) : REVISION,
      p.type === 'blog' ? 'yearly' : 'monthly',
      getPriority(p.type),
    ),
  );

  // Piloto en catalán: el directorio y una guía por municipio.
  const catalanUrls = [
    url(`${SITE}/ca/`, REVISION, 'weekly', '0.8'),
    ...MUNICIPIS_CA_ORDRE.map(m => url(`${SITE}${rutaCa(m)}`, REVISION, 'monthly', '0.75')),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...dynamicUrls, ...catalanUrls].join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
