// llms.txt: resumen del sitio para asistentes de IA.
import type { APIRoute } from 'astro';
import { SITE } from '../lib/site';
import { url } from '../lib/i18n';
import { CENTROS, comarcasConCentros, centrosDeComarca, disciplinasPresentes } from '../lib/centros';
import { getComarca } from '../lib/geo';
import { nombreDisciplina } from '../lib/disciplinas';
import { rutasDisciplina } from '../lib/rutas';
import { articulos } from '../lib/blog';

export const GET: APIRoute = async () => {
  const POSTS = await articulos();
  const disc = disciplinasPresentes(CENTROS);
  const conPagina = new Set(rutasDisciplina().map(r => r.disciplina));
  const txt = `# ${SITE.name}

> Directorio independiente de ${CENTROS.length} centros de artes marciales en ${comarcasConCentros().length} comarcas de Cataluña. Cada ficha procede de una fuente pública (web oficial del centro, registro de clubs de una federación catalana o directorio municipal) y lleva su fecha de verificación. Orden alfabético, sin valoraciones, precios ni horarios. Castellano en la raíz y catalán en /ca/.

## Directorio

- [Todos los centros](${SITE.url}${url.centros('es')}): listado completo filtrable.
- [Disciplinas](${SITE.url}${url.disciplinas('es')}): ${disc.length} disciplinas con centros verificados.
- [Cómo verificamos](${SITE.url}${url.sobre('es')}): reglas del directorio.
- [Para centros](${SITE.url}${url.paraCentros('es')}): alta y correcciones gratuitas; promoción etiquetada.

## Comarcas

${comarcasConCentros().map(c => `- [${getComarca(c)!.nombre}](${SITE.url}${url.comarca('es', c)}): ${centrosDeComarca(c).length} centros`).join('\n')}

## Disciplinas

${disc.filter(d => conPagina.has(d.slug)).map(d => `- [${nombreDisciplina(d.slug, 'es')}](${SITE.url}${url.disciplina('es', d.slug)}): ${d.n} centros`).join('\n')}

## Blog

${POSTS.filter(p => p.tipo === 'articulo').map(p => `- [${p.h1}](${SITE.url}${url.post(p.slug)})`).join('\n')}
`;
  return new Response(txt, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
