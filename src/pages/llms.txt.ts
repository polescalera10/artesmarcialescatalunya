import { ALL_PAGES } from '../data/pages';
import { SITE } from '../data/site';
import { CENTROS, FUENTE_LABELS } from '../data/centros';
import { LOCATIONS } from '../data/locations';
import { DISCIPLINES, getDisciplineBySlug } from '../data/disciplines';

// llms.txt generado desde los datos del sitio. Antes era un archivo estático en
// public/ que no mencionaba el directorio de centros, que es justo el dato
// propio que un buscador de IA puede citar. Al generarlo aquí, los recuentos y
// las fichas no se quedan desfasados cuando entra o sale un centro.

const url = (slug: string) => `${SITE.url}/${slug ? `${slug}/` : ''}`;
const nombre = (slug: string) => getDisciplineBySlug(slug)?.nameEs ?? slug;

function directorio(): string {
  const bloques = LOCATIONS.map(loc => {
    const centros = CENTROS.filter(c => c.municipio === loc.slug).sort((a, b) =>
      a.nombre.localeCompare(b.nombre, 'es'),
    );
    if (centros.length === 0) {
      return `### ${loc.name}\nNo verified martial arts centre as of the last review. Guide: ${url(loc.slug)}`;
    }
    const filas = centros.map(c => {
      const disc = c.disciplinas.map(nombre).join(', ');
      const otras = c.otras?.length ? `${disc ? '; also: ' : ''}${c.otras.join(', ')}` : '';
      const dir = c.direccion ? ` Address: ${c.direccion}.` : '';
      return `- ${c.nombre}: ${disc}${otras}.${dir} Source: ${FUENTE_LABELS[c.fuenteTipo]} (${c.fuente}), verified ${c.verificado}.`;
    });
    return `### ${loc.name} (${centros.length})\nGuide: ${url(loc.slug)}\n${filas.join('\n')}`;
  });
  return bloques.join('\n\n');
}

function coberturaPorDisciplina(): string {
  return DISCIPLINES.map(d => {
    const centros = CENTROS.filter(c => c.disciplinas.includes(d.slug));
    const munis = [...new Set(centros.map(c => LOCATIONS.find(l => l.slug === c.municipio)?.name))];
    return centros.length
      ? `- ${d.nameEs}: ${centros.length} centre(s) in ${munis.join(', ')}. Guide: ${url(d.slug)}`
      : `- ${d.nameEs}: no verified centre in the Garraf. Guide: ${url(d.slug)}`;
  }).join('\n');
}

export async function GET() {
  const blog = ALL_PAGES.filter(p => p.type === 'blog')
    .sort((a, b) => (b.fecha ?? '').localeCompare(a.fecha ?? ''))
    .map(p => `- [${p.h1}](${url(p.slug)})`)
    .join('\n');

  const body = `# Artes Marciales Garraf
# ${SITE.url}

## About
Artes Marciales Garraf is an independent local guide (in Spanish) about martial arts in the Garraf comarca (Barcelona, Spain). It is NOT a gym or academy: it is an editorial resource with a verified directory of the real martial arts centres of the comarca, guides per discipline and per municipality, and guides for children, women and adult beginners.

Last editorial review: ${SITE.ultimaRevision}.

## Verified directory of centres (${CENTROS.length} centres)
Every centre below is listed only with data taken from a public source (official website, federation register, municipal directory of entities or public profile), with the date it was checked. No ratings, reviews, rankings or prices are published. Order is alphabetical. Full directory: ${url('centros')}

${directorio()}

## Coverage by discipline
${coberturaPorDisciplina()}

## Region covered
Comarca del Garraf, province of Barcelona: ${LOCATIONS.map(l => l.name).join(', ')}. Vilanova i la Geltrú is the comarca capital and has the largest offer.

## Main pages
- Directory of centres: ${url('centros')} (Catalan version: ${SITE.url}/ca/)
- Where to start (comparison of all disciplines): ${url('iniciacion')}
- Children: ${url('clases-para-ninos')}
- Women: ${url('clases-para-mujeres')}
- Adults: ${url('clases-para-adultos')}
- Methodology and editorial principles: ${url('sobre-nosotros')}

## Blog
${blog}

## Contact
- Email: ${SITE.email}
- Contact form: ${url('contacto')}

## Editorial principles
1. Independent guide: this site does not operate a gym and does not publish reviews, ratings or business data it cannot verify.
2. Honest information only: no fabricated testimonials, instructors, schedules or prices.
3. If a commercial relationship with a listed centre ever exists, it is disclosed on that centre's listing.
4. Local focus: content written for the Garraf comarca and its real geography.
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
