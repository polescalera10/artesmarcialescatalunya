// Datos compactos del directorio para el filtro de /centros/ (y /ca/centres/).
// [slug, nombre, municipio, comarca, disciplinas, verificado]; los nombres de
// municipio, comarca y disciplina van en tablas aparte para no repetirlos.
import type { APIRoute } from 'astro';
import { CENTROS, esVerificado } from '../../lib/centros';
import { getComarca, getMunicipio } from '../../lib/geo';
import { DISCIPLINAS } from '../../lib/disciplinas';

export const GET: APIRoute = () => {
  const municipios: Record<string, string> = {};
  const comarcas: Record<string, string> = {};
  const filas = CENTROS.map(c => {
    municipios[c.municipio] ??= getMunicipio(c.municipio)!.nombre;
    comarcas[c.comarca] ??= getComarca(c.comarca)!.nombre;
    return [c.slug, c.nombre, c.municipio, c.comarca, c.disciplinas, esVerificado(c) ? 1 : 0];
  });
  const disciplinas = Object.fromEntries(DISCIPLINAS.map(d => [d.slug, [d.es, d.ca]]));
  return new Response(JSON.stringify({ municipios, comarcas, disciplinas, centros: filas }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
