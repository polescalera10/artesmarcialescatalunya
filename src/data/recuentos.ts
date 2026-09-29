// ────────────────────────────────────────────────────────────────────────────
// Recuentos del directorio dentro de la prosa.
//
// El 29-09-2026 el directorio pasó de 13 a 22 centros en un día y hubo que
// corregir a mano más de cien frases con números escritos ("siete en Vilanova",
// "el boxeo consta en seis"). Desde entonces los textos llevan marcadores que
// se calculan al compilar a partir de centros.ts:
//
//   {{centros}}            total, en letra              → "veintidós"
//   {{centros#}}           total, en cifra              → "22"
//   {{m:vilanova-i-la-geltru}}   centros de un municipio, en letra
//   {{m#:sitges}}                ídem, en cifra
//   {{m:vilanova-i-la-geltru+sitges}}   suma de varios municipios
//   {{d:boxeo}}            centros que anuncian una disciplina, en letra
//   {{d#:karate}}          ídem, en cifra
//   {{dm:boxeo:vilanova-i-la-geltru}}   disciplina dentro de un municipio
//   {{infantil}}           centros cuya fuente anuncia grupo infantil
//   {{sin-infantil}}       el resto
//   {{registro}}           centros verificados por federación o directorio municipal
//
// En letra, la primera letra del nombre en mayúscula ({{D:boxeo}}) devuelve el
// número con mayúscula inicial, para principio de frase. `{{centros_num}}` se
// mantiene como alias de `{{centros#}}`.
//
// Lo que no se puede contar desde los datos (qué disciplina "domina", si algo
// es "el único") sigue escrito a mano: revisar al añadir centros.
// ────────────────────────────────────────────────────────────────────────────

import { CENTROS } from './centros';

const ES = [
  'cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve',
  'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete',
  'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés',
  'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho',
  'veintinueve', 'treinta', 'treinta y uno', 'treinta y dos', 'treinta y tres',
  'treinta y cuatro', 'treinta y cinco',
];
const CA = [
  'zero', 'un', 'dos', 'tres', 'quatre', 'cinc', 'sis', 'set', 'vuit', 'nou',
  'deu', 'onze', 'dotze', 'tretze', 'catorze', 'quinze', 'setze', 'disset',
  'divuit', 'dinou', 'vint', 'vint-i-un', 'vint-i-dos', 'vint-i-tres',
  'vint-i-quatre', 'vint-i-cinc', 'vint-i-sis', 'vint-i-set', 'vint-i-vuit',
  'vint-i-nou', 'trenta',
];

const INFANTIL = /infantil|kids|niñ|juvenil|desde \d+ años/i;

function contar(clave: string, arg?: string): number {
  const munis = (s: string) => s.split('+');
  switch (clave) {
    case 'centros':
      return CENTROS.length;
    case 'm':
      return CENTROS.filter(c => munis(arg!).includes(c.municipio)).length;
    case 'd':
      return CENTROS.filter(c => c.disciplinas.includes(arg!)).length;
    case 'dm': {
      const [disc, muni] = arg!.split(':');
      return CENTROS.filter(c => c.disciplinas.includes(disc) && munis(muni).includes(c.municipio)).length;
    }
    case 'infantil':
      return CENTROS.filter(c => (c.otras ?? []).some(o => INFANTIL.test(o))).length;
    case 'sin-infantil':
      return CENTROS.length - contar('infantil');
    case 'registro':
      return CENTROS.filter(c => c.fuenteTipo === 'federacion' || c.fuenteTipo === 'directorio-municipal').length;
    default:
      throw new Error(`Marcador de recuento desconocido: ${clave}`);
  }
}

/** Sustituye los marcadores de recuento. `lang` decide cómo se escriben en letra. */
export function conDatos(texto: string, lang: 'es' | 'ca' = 'es'): string {
  const palabras = lang === 'ca' ? CA : ES;
  return texto
    .replaceAll('{{centros_num}}', '{{centros#}}')
    .replace(/\{\{([a-zA-Z-]+)(#?)(?::([^}]+))?\}\}/g, (_m, nombre: string, cifra: string, arg?: string) => {
      const n = contar(nombre.toLowerCase(), arg);
      if (cifra) return String(n);
      const p = palabras[n] ?? String(n);
      return nombre[0] === nombre[0].toUpperCase() ? p[0].toUpperCase() + p.slice(1) : p;
    });
}
