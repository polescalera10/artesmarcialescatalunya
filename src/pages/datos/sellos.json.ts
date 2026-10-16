// Datos mínimos para personalizar la guía del sello (/para-centros/sello/?ficha=slug):
// solo centros verificados, que son los que tienen sello. { slug: [nombre, municipio, verificado] }.
import type { APIRoute } from 'astro';
import { CENTROS, esVerificado } from '../../lib/centros';
import { getMunicipio } from '../../lib/geo';

export const GET: APIRoute = () => {
  const out: Record<string, [string, string, string]> = {};
  for (const c of CENTROS) {
    if (!esVerificado(c)) continue;
    out[c.slug] = [c.nombre, getMunicipio(c.municipio)!.nombre, c.verificado];
  }
  return new Response(JSON.stringify(out), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
