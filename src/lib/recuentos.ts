// Recuentos del directorio dentro de los textos del blog (toda Cataluña).
// Se sustituyen al compilar, así que nunca se desfasan:
//
//   {{centros}}               centros del directorio
//   {{comarcas}}              comarcas con algún centro
//   {{d:boxeo}}               centros que anuncian una disciplina
//   {{dmun:boxeo}}            municipios donde consta esa disciplina
//   {{dcom:boxeo}}            comarcas donde consta esa disciplina
//   {{c:barcelones}}          centros de una comarca
//   {{m:sabadell}}            centros de un municipio
//   {{dc:boxeo:barcelones}}   disciplina en una comarca
//   {{dm:boxeo:sabadell}}     disciplina en un municipio
//   {{infantil}}              centros cuya fuente anuncia clases para niños
//
// Siempre en cifra. Un marcador o un slug desconocido rompe el build.
import { CENTROS, centrosConDisciplina } from './centros';
import { getComarca, getMunicipio } from './geo';
import { getDisciplina } from './disciplinas';

const disc = (s: string) => { if (!getDisciplina(s)) throw new Error(`Recuento: disciplina desconocida ${s}`); return centrosConDisciplina(s); };
const com = (s: string) => { if (!getComarca(s)) throw new Error(`Recuento: comarca desconocida ${s}`); return s; };
const mun = (s: string) => { if (!getMunicipio(s)) throw new Error(`Recuento: municipio desconocido ${s}`); return s; };

function contar(clave: string, a?: string, b?: string): number {
  switch (clave) {
    case 'centros': return CENTROS.length;
    case 'comarcas': return new Set(CENTROS.map(c => c.comarca)).size;
    case 'infantil': return CENTROS.filter(c => c.infantil).length;
    case 'd': return disc(a!).length;
    case 'dmun': return new Set(disc(a!).map(c => c.municipio)).size;
    case 'dcom': return new Set(disc(a!).map(c => c.comarca)).size;
    case 'c': return CENTROS.filter(c => c.comarca === com(a!)).length;
    case 'm': return CENTROS.filter(c => c.municipio === mun(a!)).length;
    case 'dc': return disc(a!).filter(c => c.comarca === com(b!)).length;
    case 'dm': return disc(a!).filter(c => c.municipio === mun(b!)).length;
    default: throw new Error(`Recuento: marcador desconocido {{${clave}}}`);
  }
}

export function conRecuentos(texto: string): string {
  return texto.replace(/\{\{([a-z]+)(?::([a-z0-9-]+))?(?::([a-z0-9-]+))?\}\}/g, (_m, k, a, b) =>
    contar(k, a, b).toLocaleString('es-ES'),
  );
}
