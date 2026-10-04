import { DISCIPLINES, getDisciplineBySlug } from '../lib/guias-disciplina';
import { LOCATIONS, getLocationBySlug } from './locations';
import { getCentros, getCentrosByDisciplina, getCentrosByMunicipio } from './centros';
import { conDatos } from './recuentos';
import { SITE } from './site-garraf';
import {
  MUNICIPIO_BODIES,
  MUNICIPIO_FAQS,
  MONEY_BODIES,
  MONEY_FAQS,
  PERFIL_BODIES,
  PERFIL_FAQS,
} from './local-content';

// ────────────────────────────────────────────────────────────────────────────
// Marca neutra honesta: todo el copy de este archivo está escrito desde la
// posición de GUÍA LOCAL INDEPENDIENTE, no de academia. Prohibido reintroducir
// datos de negocio inventados (instructores, alumnos, horarios de clase,
// precios, reseñas). Ver MEMORY.md del proyecto.
// ────────────────────────────────────────────────────────────────────────────

export type PageType =
  | 'home'
  | 'hub-municipio'
  | 'hub-disciplina'
  | 'hub-perfil'
  | 'money-page'
  | 'blog'
  | 'static';

export interface PageDef {
  slug: string;
  type: PageType;
  municipio?: string;
  disciplina?: string;
  meta: { title: string; description: string };
  h1: string;
  intro: string;
  body?: string;
  fecha?: string; // fecha de publicación (blog) — ISO yyyy-mm-dd
  localFaq?: { q: string; a: string }[];
  // Enlaces explícitos entre páginas de intención cercana (anti-canibalización):
  // cada anchor describe la intención de la página destino para diferenciar clusters.
  relacionadas?: { slug: string; label: string; nota: string }[];
  phase: 1 | 2 | 3 | 4;
}

function loc(slug: string) {
  return getLocationBySlug(slug)?.name ?? slug;
}
function disc(slug: string) {
  return getDisciplineBySlug(slug)?.nameEs ?? slug;
}

// ── Longitudes de metadatos ──────────────────────────────────────────────────
// Google recorta los títulos alrededor de los 60 caracteres y las descripciones
// alrededor de los 155-160. La auditoría de 2026-08-14 encontró 41 descripciones
// por encima de 160 (hasta 234) y 7 títulos por encima de 60, todos por culpa de
// plantillas que concatenaban texto de longitud variable. Estos límites se
// aplican a TODAS las páginas al compilar ALL_PAGES, así que ninguna plantilla
// nueva puede volver a pasarse sin que se note.
const MAX_TITLE = 60;
const MAX_DESC = 155;

/** Recorta a `max` sin partir palabras y sin dejar puntuación colgando. */
function clamp(text: string, max: number): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return cut.slice(0, lastSpace > 0 ? lastSpace : max).replace(/[\s,;:·—–-]+$/, '');
}

/**
 * Construye un título con el sufijo de marca más largo que quepa en MAX_TITLE.
 * Así los municipios de nombre largo (Sant Pere de Ribes) no pierden el sufijo
 * a medias: se les da uno más corto.
 */
function titleWithSuffix(base: string, suffixes: string[]): string {
  for (const suffix of suffixes) {
    const candidate = `${base} | ${suffix}`;
    if (candidate.length <= MAX_TITLE) return candidate;
  }
  return clamp(base, MAX_TITLE);
}

// ── Títulos que prometen lo que la página trae ───────────────────────────────
// El informe del 25-08-2026 encontró cuarenta money pages con el mismo título
// informacional ("Guía para Empezar a Entrenar") respondiendo a búsquedas
// transaccionales: quien busca "karate en Sitges" quiere dónde, cuándo y
// cuánto, no una guía. El título ahora declara cuántos centros verificados
// trae la página, que es lo que la diferencia de cualquier otro resultado.
//
// El número sale del directorio, nunca de una plantilla: si un municipio no
// tiene ni un centro para esa disciplina el título NO puede prometer ninguno,
// así que cambia de promesa y ofrece alternativas cerca. Prometer centros que
// no existen es la vía rápida a un CTR alto y un rebote inmediato, además de
// faltar a la verdad.
const ANIO_REVISION = SITE.ultimaRevision.slice(0, 4);

function contarCentros(n: number): string {
  return n === 1 ? '1 centro' : `${n} centros`;
}

/**
 * Disciplinas que constan en un municipio, de más a menos centros, en texto:
 * "taekwondo, boxeo, MMA y krav maga". Va en la descripción de los hubs porque
 * es lo que se busca ("jiu jitsu cubelles", "taekwondo sant pere de ribes") y
 * Google resalta en negrita la coincidencia. Sale del directorio, así que no
 * se queda desfasada cuando entra un centro.
 */
function disciplinasDe(municipio: string, max: number): string {
  const cuenta = new Map<string, number>();
  for (const c of getCentrosByMunicipio(municipio)) {
    for (const d of c.disciplinas) cuenta.set(d, (cuenta.get(d) ?? 0) + 1);
  }
  const nombres = [...cuenta.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([slug]) =>
      slug === 'mma' ? 'MMA'
      : slug === 'jiu-jitsu-brasileno' ? 'jiu-jitsu brasileño'
      : (getDisciplineBySlug(slug)?.nameEs ?? slug).toLowerCase());
  const lista = nombres.slice(0, max);
  const resto = nombres.length > max;
  if (lista.length <= 1) return lista.join('');
  return resto
    ? `${lista.join(', ')} y más`
    : `${lista.slice(0, -1).join(', ')} y ${lista[lista.length - 1]}`;
}

// ── Generates all money page slugs: [disciplina]-en-[municipio] ────────────
const MONEY_COMBOS: { disciplina: string; municipio: string; phase: 1|2|3|4 }[] = [
  // Sitges - P1
  { disciplina: 'boxeo',               municipio: 'sitges',                phase: 1 },
  { disciplina: 'karate',              municipio: 'sitges',                phase: 1 },
  { disciplina: 'mma',                 municipio: 'sitges',                phase: 1 },
  { disciplina: 'kickboxing',          municipio: 'sitges',                phase: 1 },
  { disciplina: 'muay-thai',           municipio: 'sitges',                phase: 1 },
  { disciplina: 'jiu-jitsu-brasileno', municipio: 'sitges',                phase: 1 },
  { disciplina: 'judo',                municipio: 'sitges',                phase: 1 },
  { disciplina: 'defensa-personal',    municipio: 'sitges',                phase: 1 },
  { disciplina: 'taekwondo',           municipio: 'sitges',                phase: 2 },
  { disciplina: 'krav-maga',           municipio: 'sitges',                phase: 3 },
  // Vilanova - P1
  { disciplina: 'boxeo',               municipio: 'vilanova-i-la-geltru',  phase: 1 },
  { disciplina: 'karate',              municipio: 'vilanova-i-la-geltru',  phase: 1 },
  { disciplina: 'mma',                 municipio: 'vilanova-i-la-geltru',  phase: 1 },
  { disciplina: 'kickboxing',          municipio: 'vilanova-i-la-geltru',  phase: 1 },
  { disciplina: 'muay-thai',           municipio: 'vilanova-i-la-geltru',  phase: 1 },
  { disciplina: 'jiu-jitsu-brasileno', municipio: 'vilanova-i-la-geltru',  phase: 1 },
  { disciplina: 'judo',                municipio: 'vilanova-i-la-geltru',  phase: 1 },
  { disciplina: 'defensa-personal',    municipio: 'vilanova-i-la-geltru',  phase: 1 },
  { disciplina: 'taekwondo',           municipio: 'vilanova-i-la-geltru',  phase: 1 },
  { disciplina: 'krav-maga',           municipio: 'vilanova-i-la-geltru',  phase: 2 },
  // Sant Pere de Ribes - P2
  { disciplina: 'karate',              municipio: 'sant-pere-de-ribes',    phase: 2 },
  { disciplina: 'defensa-personal',    municipio: 'sant-pere-de-ribes',    phase: 2 },
  { disciplina: 'muay-thai',           municipio: 'sant-pere-de-ribes',    phase: 2 },
  { disciplina: 'taekwondo',           municipio: 'sant-pere-de-ribes',    phase: 2 },
  { disciplina: 'boxeo',               municipio: 'sant-pere-de-ribes',    phase: 3 },
  // Cubelles - P3
  { disciplina: 'defensa-personal',    municipio: 'cubelles',              phase: 3 },
  { disciplina: 'taekwondo',           municipio: 'cubelles',              phase: 3 },
  { disciplina: 'boxeo',               municipio: 'cubelles',              phase: 4 },
];

// ── Special pages with custom slugs ──────────────────────────────────────────
const SPECIAL_PAGES: PageDef[] = [
  // Perfil pages - Sitges
  {
    slug: 'clases-infantiles-en-sitges',
    type: 'money-page',
    municipio: 'sitges',
    meta: {
      title: 'Artes Marciales para Niños en Sitges | Guía para Padres',
      description: 'Artes marciales infantiles en Sitges: qué disciplina elegir según la edad de tu hijo, qué preguntar al centro y cómo empezar. Guía local del Garraf.',
    },
    h1: 'Artes Marciales para Niños en Sitges',
    intro: 'Si buscas clases de artes marciales para tu hijo o hija en Sitges, esta guía te ayuda a decidir. Karate, judo y taekwondo son las disciplinas más habituales para empezar desde los 4-6 años: desarrollan coordinación, disciplina y confianza con metodologías adaptadas por edades. Aquí te explicamos qué aporta cada una, qué preguntar al centro antes de apuntarle y qué esperar de las primeras semanas. Y si tienes dudas, escríbenos y te orientamos sin coste.',
    phase: 1,
  },
  {
    slug: 'clases-para-mujeres-en-sitges',
    type: 'money-page',
    municipio: 'sitges',
    meta: {
      title: 'Artes Marciales para Mujeres en Sitges | Guía Local',
      description: 'Artes marciales y defensa personal para mujeres en Sitges: qué disciplinas encajan mejor, qué buscar en un centro y cómo empezar con confianza.',
    },
    h1: 'Artes Marciales y Defensa Personal para Mujeres en Sitges',
    intro: 'Cada vez más mujeres del Garraf entrenan artes marciales, y Sitges no es una excepción. Boxeo y kickboxing para ponerse en forma, BJJ por su eficacia técnica independiente de la fuerza, y defensa personal orientada a situaciones reales son las opciones más demandadas. En esta guía te contamos qué valorar al elegir centro (grupos femeninos o mixtos, ambiente, enfoque) y cómo dar el primer paso aunque nunca hayas entrenado.',
    relacionadas: [
      { slug: 'defensa-personal-femenina-en-sitges', label: 'Defensa personal femenina en Sitges', nota: 'Si tu objetivo concreto es la autodefensa: qué debe incluir un programa serio.' },
      { slug: 'blog/defensa-personal-para-mujeres-garraf', label: 'Qué funciona de verdad en defensa personal para mujeres', nota: 'Guía larga: mitos, técnicas que funcionan y cómo reconocer un programa serio.' },
      { slug: 'clases-para-mujeres', label: 'Artes marciales para mujeres en el Garraf', nota: 'La visión de toda la comarca, si te da igual desplazarte de municipio.' },
    ],
    phase: 1,
  },
  {
    slug: 'defensa-personal-femenina-en-sitges',
    type: 'money-page',
    municipio: 'sitges',
    disciplina: 'defensa-personal',
    meta: {
      title: 'Defensa Personal Femenina en Sitges | Qué Debes Saber',
      description: 'Defensa personal para mujeres en Sitges: qué técnicas funcionan de verdad, cómo distinguir un programa serio y cómo empezar. Guía local del Garraf.',
    },
    h1: 'Defensa Personal para Mujeres en Sitges',
    intro: 'La defensa personal femenina bien enseñada se centra en herramientas reales: gestión de la distancia, reacción ante agarres, uso del entorno y, sobre todo, prevención y conciencia situacional. En esta guía te explicamos qué debe incluir un buen programa de defensa personal para mujeres, qué señales indican seriedad en un centro de Sitges o alrededores, y qué esperar de las primeras sesiones.',
    localFaq: [
      { q: '¿En qué se diferencia la defensa personal femenina de la general?', a: 'En el enfoque, no en la seriedad: se priorizan los escenarios que más preocupan a las mujeres (agarres, tirones, acoso en espacios públicos), el trabajo de voz y límites, y la progresión del contacto se adapta al grupo. La base técnica es la misma que en cualquier buen programa.' },
      { q: '¿Necesito fuerza física para que funcione?', a: 'No. Un programa serio se construye sobre técnicas gruesas que no dependen de la fuerza: crear distancia, salir de agarres con palanca y no con músculo, y usar la voz y el entorno. Si un programa solo funciona siendo fuerte, es mal programa.' },
      { q: '¿Hay grupos solo de mujeres en Sitges?', a: 'No en todos los centros ni en todas las temporadas. Si es tu prioridad, pregúntalo directamente antes de apuntarte o escríbenos y te ayudamos a localizar opciones en Sitges o a pocos minutos.' },
    ],
    relacionadas: [
      { slug: 'clases-para-mujeres-en-sitges', label: 'Artes marciales para mujeres en Sitges', nota: 'Si además de autodefensa te interesa la forma física o una práctica continua: comparativa de disciplinas.' },
      { slug: 'defensa-personal-en-sitges', label: 'Defensa personal en Sitges (guía general)', nota: 'La guía de defensa personal sin enfoque de género: programas, criterios y oferta local.' },
      { slug: 'blog/defensa-personal-para-mujeres-garraf', label: 'Qué funciona de verdad en defensa personal para mujeres', nota: 'La guía larga con los mitos, las capas de la autodefensa y los errores al elegir programa.' },
    ],
    phase: 1,
  },
  {
    slug: 'clases-para-adultos-en-sitges',
    type: 'money-page',
    municipio: 'sitges',
    meta: {
      title: 'Artes Marciales para Adultos en Sitges | Empezar de Cero',
      description: 'Cómo empezar artes marciales siendo adulto en Sitges: qué disciplina elegir según tu objetivo, qué esperar y cómo dar el primer paso sin experiencia.',
    },
    h1: 'Artes Marciales para Adultos en Sitges',
    intro: 'Nunca es tarde para empezar artes marciales: hay quien empieza a los 20 y quien empieza a los 55. Lo que importa es elegir bien la disciplina según tu objetivo (forma física, técnica, autodefensa o comunidad) y un grupo de nivel adecuado. En esta guía repasamos las opciones para adultos en Sitges y su entorno, con consejos para elegir centro y evitar los errores típicos del principiante.',
    phase: 1,
  },
  // Perfil pages - Vilanova
  {
    slug: 'clases-infantiles-en-vilanova',
    type: 'money-page',
    municipio: 'vilanova-i-la-geltru',
    meta: {
      title: 'Artes Marciales Niños Vilanova i la Geltrú | Guía Padres',
      description: 'Artes marciales infantiles en Vilanova i la Geltrú: karate, judo o taekwondo según la edad, qué preguntar al centro y cómo empezar. Guía del Garraf.',
    },
    h1: 'Artes Marciales para Niños en Vilanova i la Geltrú',
    intro: 'Vilanova i la Geltrú, como capital de la comarca, concentra la mayor oferta de actividades infantiles del Garraf, y las artes marciales están entre las más valoradas por los padres. Karate, judo y taekwondo son las puertas de entrada clásicas desde los 4-6 años. En esta guía te explicamos qué aporta cada disciplina según la edad y el carácter de tu hijo, y qué criterios usar para elegir un buen centro en Vilanova.',
    phase: 1,
  },
  {
    slug: 'clases-para-mujeres-en-vilanova',
    type: 'money-page',
    municipio: 'vilanova-i-la-geltru',
    meta: {
      title: 'Artes Marciales para Mujeres en Vilanova | Guía Local',
      description: 'Artes marciales y defensa personal para mujeres en Vilanova i la Geltrú: disciplinas recomendadas, qué buscar en un centro y cómo empezar.',
    },
    h1: 'Artes Marciales y Defensa Personal para Mujeres en Vilanova',
    intro: 'Si eres mujer y quieres empezar a entrenar en Vilanova i la Geltrú, tienes opciones para todos los objetivos: boxeo y kickboxing para forma física y descarga de estrés, BJJ para técnica pura, defensa personal para seguridad práctica. En esta guía te contamos qué valorar al elegir (existencia de grupos femeninos, enfoque del centro, ambiente) y cómo probar sin comprometerte desde el primer día.',
    relacionadas: [
      { slug: 'defensa-personal-femenina-en-vilanova', label: 'Defensa personal femenina en Vilanova i la Geltrú', nota: 'Si tu objetivo concreto es la autodefensa: qué debe incluir un programa serio.' },
      { slug: 'blog/defensa-personal-para-mujeres-garraf', label: 'Qué funciona de verdad en defensa personal para mujeres', nota: 'Guía larga: mitos, técnicas que funcionan y cómo reconocer un programa serio.' },
      { slug: 'clases-para-mujeres', label: 'Artes marciales para mujeres en el Garraf', nota: 'La visión de toda la comarca, si te da igual desplazarte de municipio.' },
    ],
    phase: 1,
  },
  {
    slug: 'defensa-personal-femenina-en-vilanova',
    type: 'money-page',
    municipio: 'vilanova-i-la-geltru',
    disciplina: 'defensa-personal',
    meta: {
      title: 'Defensa Personal Femenina en Vilanova i la Geltrú | Guía',
      description: 'Defensa personal para mujeres en Vilanova: qué técnicas funcionan, cómo reconocer un programa serio y cómo dar el primer paso. Guía del Garraf.',
    },
    h1: 'Defensa Personal para Mujeres en Vilanova i la Geltrú',
    intro: 'Un buen programa de defensa personal femenina no vende movimientos espectaculares: enseña a reaccionar ante un agarre, a crear distancia, a usar la voz y el entorno, y a evitar el peligro antes de que ocurra. En esta guía te explicamos qué debe incluir un programa serio, cómo evaluar las opciones en Vilanova i la Geltrú y qué esperar de las primeras sesiones si nunca has entrenado nada parecido.',
    localFaq: [
      { q: '¿En qué se diferencia la defensa personal femenina de la general?', a: 'En el enfoque, no en la seriedad: se priorizan los escenarios que más preocupan a las mujeres (agarres, tirones, acoso en espacios públicos), el trabajo de voz y límites, y la progresión del contacto se adapta al grupo. La base técnica es la misma que en cualquier buen programa.' },
      { q: '¿Vilanova es el mejor sitio de la comarca para buscar este tipo de clases?', a: 'Es donde más oferta general hay, al ser la capital de la comarca, así que la probabilidad de encontrar grupo, femenino o mixto, es mayor. Aun así, la existencia de grupos exclusivamente femeninos cambia por temporadas: confírmalo siempre con el centro.' },
      { q: '¿Puedo empezar sin ninguna experiencia ni forma física?', a: 'Sí, es el caso más habitual. Un buen programa está diseñado para personas sin base marcial: técnicas simples que no dependen de la fuerza, progresión gradual del contacto y trabajo adaptado al nivel de cada alumna.' },
    ],
    relacionadas: [
      { slug: 'clases-para-mujeres-en-vilanova', label: 'Artes marciales para mujeres en Vilanova', nota: 'Si además de autodefensa te interesa la forma física o una práctica continua: comparativa de disciplinas.' },
      { slug: 'defensa-personal-en-vilanova-i-la-geltru', label: 'Defensa personal en Vilanova i la Geltrú (guía general)', nota: 'La guía de defensa personal sin enfoque de género: programas, criterios y oferta local.' },
      { slug: 'blog/defensa-personal-para-mujeres-garraf', label: 'Qué funciona de verdad en defensa personal para mujeres', nota: 'La guía larga con los mitos, las capas de la autodefensa y los errores al elegir programa.' },
    ],
    phase: 1,
  },
  {
    slug: 'clases-para-adultos-en-vilanova',
    type: 'money-page',
    municipio: 'vilanova-i-la-geltru',
    meta: {
      title: 'Artes Marciales para Adultos en Vilanova i la Geltrú',
      description: 'Cómo empezar artes marciales siendo adulto en Vilanova: qué disciplina va contigo, cómo elegir centro y qué esperar de las primeras semanas.',
    },
    h1: 'Artes Marciales para Adultos en Vilanova i la Geltrú',
    intro: 'Empezar artes marciales de adulto en Vilanova i la Geltrú es más fácil de lo que parece: al ser la ciudad con más oferta de la comarca, es donde más probabilidades tienes de encontrar grupos de iniciación y horarios compatibles con el trabajo. No hace falta estar en forma para empezar (el entrenamiento te pone en forma) ni tener experiencia previa. Esta guía te ayuda a elegir disciplina y centro con criterio.',
    phase: 1,
  },
  // Karate infantil
  {
    slug: 'karate-infantil-en-sitges',
    type: 'money-page',
    municipio: 'sitges',
    disciplina: 'karate',
    meta: {
      title: 'Karate Infantil en Sitges | Guía para Padres',
      description: 'Karate para niños en Sitges: desde qué edad empezar, qué aporta el karate infantil, qué preguntar al centro y cómo elegir bien. Guía del Garraf.',
    },
    h1: 'Karate Infantil en Sitges',
    intro: 'El karate es una de las actividades extraescolares más completas para niños: trabaja coordinación, disciplina, respeto y confianza con una progresión clara de cinturones que motiva sin presionar. En esta guía para padres de Sitges te explicamos desde qué edad tiene sentido empezar, cómo es una clase de karate infantil típica y qué criterios usar para elegir centro: titulación del instructor, grupos por edades y metodología pedagógica.',
    phase: 1,
  },
  {
    slug: 'karate-infantil-en-vilanova',
    type: 'money-page',
    municipio: 'vilanova-i-la-geltru',
    disciplina: 'karate',
    meta: {
      title: 'Karate Infantil en Vilanova i la Geltrú | Guía Padres',
      description: 'Karate para niños en Vilanova: desde qué edad, qué beneficios reales aporta y cómo elegir un buen centro. Guía local de la comarca del Garraf.',
    },
    h1: 'Karate Infantil en Vilanova i la Geltrú',
    intro: 'El karate infantil enseña mucho más que técnica: los niños aprenden a caer y levantarse, a respetar normas y compañeros, y a ganar confianza a través del esfuerzo. Vilanova i la Geltrú, por tamaño y tradición deportiva, es el municipio del Garraf donde más fácil resulta encontrar grupos de karate por franjas de edad. Esta guía te ayuda a valorar las opciones y a preparar la primera clase de tu hijo.',
    phase: 1,
  },
  // NOTA (2026-08-14): las tres páginas `artes-marciales-cerca-de-X` se
  // eliminaron tras la auditoría SEO. Duplicaban el hub de su propio municipio
  // (similitud de texto del 0,66-0,67) con la misma intención de búsqueda, y
  // además eran huérfanas: ningún enlace interno apuntaba a ellas. Su contenido
  // —cómo desplazarse desde el municipio— vive ahora en el cuerpo del hub
  // correspondiente (src/data/local-content.ts) y sus URLs redirigen con 301
  // desde vercel.json.
];

// ── Local FAQ items specific to each discipline × municipality combination ────
// Preguntas informacionales honestas: geografía real, criterios de elección y
// contexto local verificable. Nada de horarios, grupos o instalaciones inventadas.
const LOCAL_FAQS: Record<string, Record<string, { q: string; a: string }[]>> = {
  'boxeo': {
    'sitges': [
      { q: '¿Es fácil encontrar clases de boxeo en Sitges?', a: 'Sitges tiene una vida deportiva activa y orientada también al público internacional, aunque su oferta es menor que la de Vilanova i la Geltrú, a 10-15 minutos. Si buscas boxeo en la zona, valora ambos municipios antes de decidir.' },
      { q: '¿Qué debo preguntar antes de apuntarme a boxeo en Sitges?', a: 'Tres cosas: si hay grupo específico de iniciación, si el sparring es opcional (en un buen gimnasio siempre lo es) y si puedes hacer una clase de prueba antes de comprometerte con una cuota.' },
    ],
    'vilanova-i-la-geltru': [
      { q: '¿Por qué Vilanova es buena opción para empezar boxeo?', a: 'Como capital de la comarca, Vilanova i la Geltrú concentra la mayor oferta deportiva del Garraf, lo que se traduce en más grupos, más franjas horarias y más probabilidad de encontrar un nivel de iniciación real.' },
      { q: '¿El boxeo es compatible con el trabajo a turnos?', a: 'Depende del centro, pero en municipios grandes como Vilanova es más habitual encontrar clases en varias franjas del día. Pregunta siempre por el horario completo antes de apuntarte.' },
    ],
    'sant-pere-de-ribes': [
      { q: '¿Dónde entrenan boxeo los vecinos de Sant Pere de Ribes?', a: 'La oferta dentro del municipio es limitada, así que lo más habitual es desplazarse a Sitges o Vilanova i la Geltrú, ambas a 10-15 minutos en coche desde Ribes o Les Roquetes.' },
    ],
  },
  'karate': {
    'sitges': [
      { q: '¿Desde qué edad puede empezar karate un niño en Sitges?', a: 'La mayoría de escuelas de karate aceptan niños desde los 4-6 años, con grupos separados por franjas de edad. A los 4-5 años el trabajo es sobre todo psicomotriz; el karate como disciplina completa llega más adelante.' },
      { q: '¿Cómo reconozco una buena escuela de karate en Sitges?', a: 'Fíjate en la titulación del instructor (cinturón negro con grado federativo), en que los grupos infantiles estén separados por edades y en que te dejen ver una clase antes de apuntarte.' },
    ],
    'vilanova-i-la-geltru': [
      { q: '¿Hay tradición de karate en Vilanova i la Geltrú?', a: 'El karate es una de las artes marciales con más implantación en Cataluña y los municipios grandes como Vilanova suelen tener escuelas consolidadas con grupos por edad y nivel. Es de las disciplinas más fáciles de encontrar en la comarca.' },
      { q: '¿Karate WKF o tradicional: qué me conviene?', a: 'El estilo WKF (olímpico) orienta más a la competición deportiva; los enfoques tradicionales priorizan kata y defensa personal. Para un niño o un principiante, importa más la calidad del instructor que el estilo.' },
    ],
  },
  'defensa-personal': {
    'sitges': [
      { q: '¿Hay defensa personal solo para mujeres en Sitges?', a: 'Los grupos exclusivamente femeninos existen pero no en todos los centros ni en todos los municipios. Si es tu prioridad, pregúntalo directamente antes de apuntarte, o escríbenos y te ayudamos a localizar opciones en la zona.' },
      { q: '¿Cuántas sesiones necesito para aprender lo básico?', a: 'Con 4-8 sesiones bien planteadas ya interiorizas las respuestas fundamentales ante los escenarios más comunes. La continuidad después marca la diferencia entre "haber hecho un curso" y saber reaccionar bajo estrés.' },
    ],
    'vilanova-i-la-geltru': [
      { q: '¿La defensa personal incluye defensa ante armas?', a: 'Los programas básicos se centran en agresiones sin armas, que son la gran mayoría de los casos reales. El trabajo ante objetos peligrosos es materia de niveles avanzados y no todos los centros lo imparten: pregúntalo si te interesa.' },
      { q: '¿Puedo empezar defensa personal sin experiencia marcial?', a: 'Sí, es el caso más habitual. Un buen programa de defensa personal está diseñado precisamente para personas sin base marcial: técnicas simples, funcionales y entrenadas bajo presión progresiva.' },
    ],
  },
  'muay-thai': {
    'sitges': [
      { q: '¿Puedo entrenar muay thai en Sitges si solo vengo en verano?', a: 'Sitges tiene mucha población estacional y algunos centros lo tienen en cuenta con fórmulas flexibles. Pregunta por bonos o mensualidades sin permanencia antes de apuntarte si tu estancia es temporal.' },
    ],
    'vilanova-i-la-geltru': [
      { q: '¿Cómo sé si un gimnasio de muay thai en Vilanova es serio?', a: 'Busca que separe claramente iniciación de niveles avanzados, que el contacto sea progresivo y opcional, y que el instructor tenga trayectoria verificable en la disciplina, sea competitiva o docente.' },
    ],
  },
  'jiu-jitsu-brasileno': {
    'sitges': [
      { q: '¿Qué debo buscar en una academia de BJJ en Sitges?', a: 'El linaje del instructor (quién le dio sus grados), la proporción entre técnica y sparring (rolling) en las clases, y el ambiente: el BJJ se aprende con compañeros, y una sala respetuosa acelera muchísimo el progreso.' },
    ],
    'vilanova-i-la-geltru': [
      { q: '¿El BJJ es apto para mujeres?', a: 'Es posiblemente el arte marcial donde el tamaño y la fuerza importan menos, porque se basa en palancas y posiciones. Cada vez hay más practicantes femeninas en Cataluña, también en la comarca del Garraf.' },
    ],
  },
  'mma': {
    'sitges': [
      { q: '¿Necesito base de boxeo o BJJ para empezar MMA en Sitges?', a: 'No. Un buen programa de MMA para principiantes cubre los fundamentos de golpeo, derribo y suelo desde cero. Si el centro exige experiencia previa para entrar, busca otro para empezar.' },
    ],
    'vilanova-i-la-geltru': [
      { q: '¿Qué instalaciones necesita un buen gimnasio de MMA?', a: 'Como mínimo, tatami o zona acolchada para el trabajo de suelo y material de golpeo (sacos, manoplas). La jaula u octógono es un plus para simular competición, pero no es imprescindible para aprender.' },
    ],
  },
  'kickboxing': {
    'sitges': [
      { q: '¿El kickboxing en Sitges sirve para ponerse en forma?', a: 'Es uno de los entrenamientos cardiovasculares más completos que existen: una sesión intensa puede quemar entre 600 y 900 kcal. Muchas personas lo eligen exactamente por eso, sin interés en competir.' },
    ],
    'vilanova-i-la-geltru': [
      { q: '¿Se puede competir en kickboxing desde la comarca?', a: 'Cataluña tiene circuito activo de kickboxing con competiciones regulares. Si te interesa competir, busca un centro cuyo instructor tenga experiencia llevando competidores; si no, cualquier buen grupo recreativo te vale.' },
    ],
  },
  'judo': {
    'sitges': [
      { q: '¿Por qué es importante el tatami en judo?', a: 'Porque el judo se basa en proyecciones y caídas: un tatami homologado y en buen estado es una cuestión de seguridad, no de comodidad. Al visitar un centro en Sitges o alrededores, fíjate en el estado del suelo antes que en cualquier otra cosa.' },
    ],
    'vilanova-i-la-geltru': [
      { q: '¿Hay competición de judo infantil en Cataluña?', a: 'Sí, la Federació Catalana de Judo organiza circuito desde categorías tempranas. La competición es siempre voluntaria: la mayoría de niños practica judo por los valores y la actividad física, sin competir.' },
    ],
  },
  'taekwondo': {
    'sitges': [
      { q: '¿Taekwondo o karate para mi hijo en Sitges?', a: 'Ambos son excelentes para niños. El taekwondo destaca por el trabajo de piernas, flexibilidad y velocidad; el karate por el equilibrio entre técnica de brazos y piernas y su enfoque en la disciplina. Lo decisivo es la calidad del instructor que tengas cerca.' },
    ],
    'vilanova-i-la-geltru': [
      { q: '¿Cuántos días a la semana se entrena taekwondo?', a: 'Para niños, dos días semanales es el estándar razonable. Para adultos con objetivos de progresión o competición, tres sesiones semanales aceleran claramente el avance.' },
    ],
    'sant-pere-de-ribes': [
      { q: '¿Hace falta salir de Sant Pere de Ribes para entrenar taekwondo?', a: 'No. En nuestro directorio constan {{dm:taekwondo:sant-pere-de-ribes}} centros del municipio que lo enseñan, entre Ribes y Les Roquetes. Vilanova, a 10-15 minutos en coche, tiene {{dm:taekwondo:vilanova-i-la-geltru}} más si quieres comparar.' },
    ],
  },
  'krav-maga': {
    'sitges': [
      { q: '¿El krav maga tiene edad mínima?', a: 'La mayoría de escuelas de krav maga trabajan con adultos a partir de 16 años, por la naturaleza del sistema: requiere madurez para entrenar escenarios de agresión de forma controlada.' },
    ],
    'vilanova-i-la-geltru': [
      { q: '¿Cómo distingo un instructor serio de krav maga?', a: 'Pregunta por su certificación y la organización que la emite (hay varias federaciones internacionales de krav maga), cuántos años lleva impartiendo y cómo estructura la progresión. Desconfía de quien promete resultados inmediatos sin trabajo.' },
    ],
  },
};

// ── Generate money pages from combos ─────────────────────────────────────────
function generateMoneyPage(combo: typeof MONEY_COMBOS[0]): PageDef {
  const dSlug = combo.disciplina;
  const mSlug = combo.municipio;
  const dName = disc(dSlug);
  const mName = loc(mSlug);
  const discipline = getDisciplineBySlug(dSlug);

  // Intros honestos por combinación: guía local, contexto geográfico real,
  // criterios de elección. Sin identidad de academia.
  const intros: Record<string, Record<string, string>> = {
    'boxeo': {
      'sitges': `¿Buscas clases de boxeo en Sitges? Esta guía te cuenta lo que debes saber antes de empezar: cómo son las clases de iniciación (técnica sobre saco y manoplas, sin contacto obligatorio), qué material necesitas y qué preguntar en cada gimnasio antes de apuntarte. Sitges tiene una vida deportiva activa, y a 10-15 minutos tienes también toda la oferta de Vilanova i la Geltrú. Si quieres, escríbenos y te orientamos sin coste.`,
      'vilanova-i-la-geltru': `El boxeo es una de las formas más completas de ponerse en forma: cardio, coordinación, descarga de estrés y técnica real. Vilanova i la Geltrú, como capital de la comarca del Garraf, es el municipio donde más fácil resulta encontrar clases de boxeo con grupos de iniciación de verdad. En esta guía te explicamos cómo funciona una clase típica, qué material hace falta y con qué criterios elegir gimnasio.`,
      'sant-pere-de-ribes': `Si buscas boxeo y vives en Sant Pere de Ribes, lo más práctico suele ser desplazarse: Sitges y Vilanova i la Geltrú están a 10-15 minutos en coche desde Ribes o Les Roquetes y concentran la mayor parte de la oferta de la comarca. En esta guía te contamos cómo empezar en el boxeo desde cero y qué valorar al elegir gimnasio en la zona.`,
      'cubelles': `En Cubelles consta un centro que anuncia boxeo, y si quieres comparar, Vilanova i la Geltrú queda a menos de 10 minutos por la C-31. En esta guía te explicamos cómo son las clases de boxeo para principiantes, qué necesitas para empezar y qué preguntar antes de apuntarte a cualquier gimnasio de la zona.`,
    },
    'karate': {
      'sitges': `El karate es el arte marcial más practicado del mundo y una de las mejores puertas de entrada a las artes marciales, tanto para niños como para adultos. Si buscas karate en Sitges, esta guía te explica qué estilos existen, cómo es la progresión de cinturones, desde qué edad pueden empezar los niños y qué criterios usar para elegir una buena escuela en el municipio o en la vecina Vilanova.`,
      'vilanova-i-la-geltru': `¿Karate en Vilanova i la Geltrú? Buena elección: es una de las disciplinas con más tradición e implantación en Cataluña, y en la capital del Garraf es donde más probabilidades tienes de encontrar escuelas con grupos por edad y nivel. En esta guía repasamos qué aporta el karate a niños y adultos, cómo funciona el sistema de grados y qué preguntar antes de apuntarte.`,
      'sant-pere-de-ribes': `Los vecinos de Sant Pere de Ribes que buscan karate tienen un centro en el propio municipio, y si quieren comparar, Sitges y Vilanova i la Geltrú están a 10-15 minutos en coche. En esta guía te contamos desde qué edad empezar, qué beneficios reales aporta el karate y cómo reconocer una buena escuela.`,
      'cubelles': `Si vives en Cubelles y te interesa el karate, para ti o para tus hijos, la oferta más amplia de la zona está en Vilanova i la Geltrú, a menos de 10 minutos. En esta guía te explicamos qué aporta el karate según la edad, cómo es la progresión de cinturones y qué criterios usar para elegir escuela.`,
    },
    'mma': {
      'sitges': `El MMA (artes marciales mixtas) integra golpeo, derribo y suelo en el sistema de combate más completo que existe. Si te interesa empezar MMA en Sitges o alrededores, esta guía te explica qué debe incluir un buen programa de iniciación (fundamentos técnicos antes que sparring), qué instalaciones importan de verdad y cómo evaluar la seriedad de un gimnasio.`,
      'vilanova-i-la-geltru': `El MMA ha pasado de nicho a fenómeno global, y cada vez más gente del Garraf quiere probarlo. En Vilanova i la Geltrú, el municipio con más oferta deportiva de la comarca, es donde más sentido tiene buscar. Esta guía te explica cómo se estructura el entrenamiento de MMA (striking, lucha, suelo), si se puede empezar desde cero (sí) y qué preguntar antes de apuntarte.`,
    },
    'kickboxing': {
      'sitges': `El kickboxing combina la técnica de puños del boxeo con las patadas, y es una de las opciones favoritas de quienes quieren ponerse en forma aprendiendo algo útil. Si buscas kickboxing en Sitges, esta guía te cuenta cómo son las clases, qué material necesitas, y cómo valorar la oferta del municipio y de Vilanova, a pocos minutos.`,
      'vilanova-i-la-geltru': `¿Kickboxing en Vilanova i la Geltrú? Es una disciplina en pleno crecimiento y la capital del Garraf es el mejor sitio de la comarca para buscar grupo. En esta guía te explicamos la diferencia entre kickboxing y muay thai, qué esperar de una clase de iniciación y qué señales indican que un gimnasio es serio.`,
    },
    'muay-thai': {
      'sitges': `El muay thai, el arte de las ocho extremidades, añade codos, rodillas y clinch al repertorio del kickboxing. Si buscas muay thai en Sitges, esta guía te explica cómo es el entrenamiento real (mucha técnica, contacto siempre progresivo y opcional), qué material necesitas y cómo valorar las opciones de la zona, incluida Vilanova a pocos minutos.`,
      'vilanova-i-la-geltru': `El muay thai es una de las disciplinas de striking más completas y exigentes, y su popularidad en Cataluña no deja de crecer. Si quieres empezar en Vilanova i la Geltrú, esta guía te cuenta qué esperar de las primeras semanas, la diferencia con el kickboxing y qué criterios usar para elegir un buen gimnasio en la capital del Garraf.`,
      'sant-pere-de-ribes': `Para entrenar muay thai desde Sant Pere de Ribes hay que salir de la comarca: en el Garraf no consta ningún centro que lo anuncie. Lo más parecido cerca es el K-1 y el kickboxing de Sitges y Vilanova i la Geltrú, a 10-15 minutos en coche. Esta guía te explica cómo empezar en el muay thai desde cero, qué material hace falta y qué preguntar en cualquier gimnasio de la zona antes de apuntarte.`,
    },
    'jiu-jitsu-brasileno': {
      'sitges': `El Brazilian Jiu Jitsu (BJJ) es el arte del suelo: control, palancas y estrangulamientos donde la técnica vence a la fuerza. Su comunidad crece cada año en Cataluña, también en el Garraf. Si buscas BJJ en Sitges, esta guía te explica cómo es una clase típica, qué significa "rollar", cuánto se tarda de verdad en progresar y cómo evaluar una academia.`,
      'vilanova-i-la-geltru': `El BJJ es posiblemente el arte marcial con la comunidad más fiel: quien lo prueba en serio, suele quedarse años. Si quieres empezar en Vilanova i la Geltrú, esta guía te cuenta qué esperar del primer mes, por qué el linaje del instructor importa y qué señales distinguen una buena academia de BJJ en la comarca del Garraf.`,
    },
    'judo': {
      'sitges': `El judo es deporte olímpico, escuela de valores y una de las artes marciales más seguras y completas para niños. Si buscas judo en Sitges, esta guía te explica desde qué edad empezar, por qué las caídas (ukemi) son la primera y más útil habilidad que se aprende, y qué debe tener una buena sala de judo, empezando por el tatami.`,
      'vilanova-i-la-geltru': `¿Judo en Vilanova i la Geltrú? Es una disciplina con fuerte tradición federativa en Cataluña y una elección excelente tanto para niños como para adultos. En esta guía repasamos los beneficios reales del judo, cómo funciona el sistema de cinturones, qué papel juega la competición (siempre opcional) y cómo elegir club en la capital del Garraf.`,
    },
    'taekwondo': {
      'sitges': `El taekwondo, deporte olímpico desde Seúl 1988, es el arte de las patadas: velocidad, flexibilidad y precisión. Si lo buscas en Sitges, para ti o para tus hijos, esta guía te explica desde qué edad empezar, la diferencia entre los enfoques olímpico (WT) y tradicional (ITF), y qué criterios usar para elegir escuela en la zona.`,
      'vilanova-i-la-geltru': `El taekwondo es una de las artes marciales más practicadas por niños en España, y Vilanova i la Geltrú, como capital de la comarca, es donde más fácil resulta encontrar grupos por edad y nivel. En esta guía te contamos qué aporta el taekwondo, cómo es la progresión de cinturones y qué preguntar antes de apuntarte o apuntar a tu hijo.`,
      'sant-pere-de-ribes': `Si buscas taekwondo en Sant Pere de Ribes, no necesitas salir del municipio: es el que más clubs de taekwondo reúne en todo el Garraf. Esta guía te explica los beneficios del taekwondo por edades y cómo reconocer una buena escuela, para que elijas con criterio entre los que tienes cerca.`,
      'cubelles': `Para practicar taekwondo en Cubelles no hace falta salir del municipio: los dos centros verificados lo enseñan, y Vilanova i la Geltrú queda a menos de 10 minutos si quieres comparar. En esta guía te contamos desde qué edad tiene sentido empezar, qué aporta el taekwondo a niños y adultos y qué criterios usar al elegir escuela en la zona.`,
    },
    'defensa-personal': {
      'sitges': `La defensa personal seria no es un cursillo de trucos: es un entrenamiento continuo de técnicas simples y funcionales, prevención y gestión del estrés. Si buscas defensa personal en Sitges, esta guía te explica qué debe incluir un buen programa, qué diferencias hay con disciplinas como el krav maga y qué preguntar antes de apuntarte en cualquier centro de la zona.`,
      'vilanova-i-la-geltru': `¿Defensa personal en Vilanova i la Geltrú? Antes de apuntarte a cualquier curso, conviene saber qué funciona de verdad: técnicas simples entrenadas bajo presión progresiva, trabajo de prevención y conciencia situacional, y un instructor con metodología clara. Esta guía te da los criterios para evaluar la oferta de la capital del Garraf con ojo crítico.`,
      'sant-pere-de-ribes': `Si buscas defensa personal en Sant Pere de Ribes, hay centros que la anuncian dentro del municipio, y a 10-15 minutos tienes además la oferta de Sitges y Vilanova. Esta guía te explica qué debe incluir un programa serio de defensa personal, cuántas sesiones hacen falta para interiorizar lo básico y qué señales distinguen la formación útil del marketing.`,
      'cubelles': `Para formarte en defensa personal desde Cubelles, la opción más práctica es Vilanova i la Geltrú, a menos de 10 minutos. En esta guía te contamos qué técnicas funcionan en situaciones reales, qué esperar de las primeras sesiones y cómo evaluar la seriedad de cualquier programa antes de pagar una cuota.`,
    },
    'krav-maga': {
      'sitges': `El krav maga es el sistema de defensa desarrollado para el ejército israelí: directo, sin reglas deportivas, orientado a neutralizar amenazas reales. Es una de las disciplinas más buscadas y con menos oferta de la comarca. Si te interesa practicarlo en Sitges o alrededores, esta guía te explica qué es exactamente, en qué se diferencia de la defensa personal genérica y cómo verificar la certificación de un instructor.`,
      'vilanova-i-la-geltru': `¿Krav maga en Vilanova i la Geltrú? Antes de buscar dónde, conviene entender qué es: un sistema de combate sin componente deportivo, pensado para resolver agresiones reales con técnicas simples y contundentes. En esta guía te contamos para quién es adecuado, qué exige el entrenamiento y cómo distinguir instructores certificados de imitaciones.`,
    },
  };

  const defaultIntro = `¿Buscas clases de ${dName.toLowerCase()} en ${mName}? Esta guía local te explica qué debes saber antes de empezar: cómo son las clases para principiantes, qué beneficios reales aporta la disciplina y con qué criterios elegir un buen centro en la comarca del Garraf. Si tienes dudas, escríbenos y te orientamos sin coste.`;

  const intro = intros[dSlug]?.[mSlug] ?? defaultIntro;

  const dTitle = dName;
  const mTitle = mName === 'Vilanova i la Geltrú' ? 'Vilanova' : mName;

  // Anti-canibalización: la guía general de defensa personal enlaza a su
  // variante femenina (donde existe) con anchor que diferencia la intención.
  const relacionadas =
    dSlug === 'defensa-personal' && (mSlug === 'sitges' || mSlug === 'vilanova-i-la-geltru')
      ? [
          {
            slug: `defensa-personal-femenina-en-${mSlug === 'sitges' ? 'sitges' : 'vilanova'}`,
            label: `Defensa personal femenina en ${mTitle}`,
            nota: 'Guía específica: escenarios, trabajo de voz y límites, y grupos femeninos o mixtos.',
          },
          {
            slug: 'krav-maga',
            label: 'Krav maga en el Garraf',
            nota: 'Si buscas un sistema de autodefensa con metodología propia y sin componente deportivo.',
          },
        ]
      : undefined;

  const nCentros = getCentros(mSlug, dSlug).length;

  return {
    slug: `${dSlug}-en-${mSlug}`,
    type: 'money-page',
    municipio: mSlug,
    disciplina: dSlug,
    meta: {
      title: nCentros > 0
        ? titleWithSuffix(`${dTitle} en ${mTitle}: ${contarCentros(nCentros)}`, [
            `Horarios y Qué Preguntar`,
            `Guía ${ANIO_REVISION}`,
            'Guía',
            'Garraf',
          ])
        : titleWithSuffix(`${dTitle} en ${mTitle}`, [
            'Dónde Entrenar y Qué Hay Cerca',
            'Dónde Entrenar Cerca',
            'Guía del Garraf',
            'Garraf',
          ]),
      description: nCentros > 0
        ? `${contarCentros(nCentros)} de ${dName.toLowerCase()} en ${mName} ${nCentros === 1 ? 'verificado' : 'verificados'} con fuente pública: ${nCentros === 1 ? 'dónde está' : 'dónde están'}, qué preguntar antes de apuntarte y cómo es la primera clase.`
        : `Ningún centro de ${mName} anuncia ${dName.toLowerCase()} hoy. Te decimos qué hay cerca, qué disciplina se le parece y con qué criterios elegir en el Garraf.`,
    },
    h1: `Clases de ${dTitle} en ${mName}`,
    intro,
    localFaq: LOCAL_FAQS[dSlug]?.[mSlug] ?? [],
    ...(relacionadas ? { relacionadas } : {}),
    phase: combo.phase,
  };
}

// ── Hub pages ─────────────────────────────────────────────────────────────────
const HUB_MUNICIPIO_PAGES: PageDef[] = LOCATIONS.map(loc => ({
  slug: loc.slug,
  type: 'hub-municipio' as PageType,
  municipio: loc.slug,
  meta: {
    title: getCentrosByMunicipio(loc.slug).length > 0
      ? titleWithSuffix(
          `Artes Marciales en ${loc.name}: ${contarCentros(getCentrosByMunicipio(loc.slug).length)}`,
          ['Directorio Verificado', 'Directorio', `Guía ${ANIO_REVISION}`, 'Garraf'],
        )
      : titleWithSuffix(`Artes Marciales en ${loc.name}`, [
          'Dónde Entrenar Cerca del Municipio',
          'Dónde Entrenar Cerca',
          'Guía del Garraf',
          'Garraf',
        ]),
    description: getCentrosByMunicipio(loc.slug).length > 0
      ? [4, 3, 2]
          .map(n => `${contarCentros(getCentrosByMunicipio(loc.slug).length)} de artes marciales en ${loc.name} con fuente pública: ${disciplinasDe(loc.slug, n)}. ${getCentrosByMunicipio(loc.slug).length === 1 ? 'Qué se sabe de él' : 'Qué ofrece cada uno'} y qué tienes cerca.`)
          .find(d => d.length <= MAX_DESC)!
      : `Ningún centro de artes marciales de ${loc.name} consta con fuente pública verificable. Te decimos dónde entrenar cerca y qué disciplinas hay en cada municipio.`,
  },
  h1: `Clases de Artes Marciales en ${loc.name}`,
  intro: loc.desc,
  // Cuerpo propio por municipio: es lo que diferencia estos cinco hubs entre sí
  // (antes compartían plantilla y solo cambiaba el topónimo). Absorbe además el
  // contenido de las antiguas páginas `artes-marciales-cerca-de-X`.
  body: MUNICIPIO_BODIES[loc.slug],
  localFaq: MUNICIPIO_FAQS[loc.slug],
  phase: loc.priority as 1 | 2 | 3 | 4,
}));

const HUB_DISCIPLINA_PAGES: PageDef[] = DISCIPLINES.map(d => ({
  slug: d.slug,
  type: 'hub-disciplina' as PageType,
  disciplina: d.slug,
  meta: {
    title: getCentrosByDisciplina(d.slug).length > 0
      ? titleWithSuffix(
          `${d.nameEs} en el Garraf: ${contarCentros(getCentrosByDisciplina(d.slug).length)}`,
          ['Dónde Entrenar', `Guía ${ANIO_REVISION}`, 'Guía', 'Garraf'],
        )
      : titleWithSuffix(`${d.nameEs} en el Garraf`, [
          'Qué Hay y Qué Alternativas Tienes',
          'Qué Alternativas Tienes',
          'Guía Local',
        ]),
    description: getCentrosByDisciplina(d.slug).length > 0
      ? (getCentrosByDisciplina(d.slug).length === 1
        ? `1 centro de ${d.nameEs.toLowerCase()} en la comarca del Garraf verificado con fuente pública: en qué municipio está y para quién encaja.`
        : `${contarCentros(getCentrosByDisciplina(d.slug).length)} de ${d.nameEs.toLowerCase()} en la comarca del Garraf verificados con fuente pública: en qué municipio está cada uno y para quién encaja.`)
      : `Ningún centro del Garraf anuncia ${d.nameEs.toLowerCase()} con fuente pública verificable. Qué es, para quién encaja y qué disciplinas de la comarca se le parecen.`,
  },
  h1: `${d.nameEs} en el Garraf`,
  intro: `${d.shortDesc} En esta guía te explicamos qué aporta ${d.nameEs.toLowerCase() === 'artes marciales mixtas' ? 'el MMA' : `el ${d.nameEs.toLowerCase()}`}, para quién es adecuado, cómo son las clases de iniciación y con qué criterios elegir centro en Sitges, Vilanova i la Geltrú o el resto de la comarca del Garraf. Si tienes dudas sobre por dónde empezar, escríbenos y te orientamos sin coste.`,
  phase: 1,
}));

const HUB_PERFIL_PAGES: PageDef[] = [
  {
    slug: 'otras-artes-marciales',
    type: 'hub-perfil',
    meta: {
      title: 'Aikido, Kung Fu y Wing Chun en el Garraf | Dónde Constan',
      description: 'Aikido, wu shu (kung fu), wing chun, Jeet Kune Do, kali, kyokushin y grappling en el Garraf: qué centro verificado anuncia cada una y dónde está.',
    },
    h1: 'Aikido, Kung Fu y Otros Estilos en el Garraf',
    intro: 'Las diez disciplinas de esta guía son las que más se buscan, pero no son las únicas que se enseñan en la comarca. Varios centros del directorio anuncian estilos menos conocidos junto a su oferta principal: aikido y wu shu en Vilanova, wing chun, Jeet Kune Do y kali en Sant Pere de Ribes, kyokushin y K-1 en Vilanova y Sitges. Aquí tienes qué es cada uno, para quién encaja y dónde consta.',
    phase: 3,
  },
  {
    slug: 'clases-para-ninos',
    type: 'hub-perfil',
    meta: {
      title: 'Artes Marciales para Niños en el Garraf | Guía Padres',
      description: 'Artes marciales infantiles en el Garraf: karate, judo o taekwondo según la edad, beneficios reales y cómo elegir centro. Guía para padres de la comarca.',
    },
    h1: 'Artes Marciales para Niños en el Garraf',
    intro: 'Las artes marciales son de las actividades extraescolares más completas: disciplina, coordinación, respeto y confianza, con una progresión que motiva sin necesidad de pantallas ni competición obligatoria. En esta guía para padres del Garraf te explicamos qué disciplina encaja según la edad y el carácter de tu hijo (karate, judo o taekwondo son las puertas de entrada clásicas desde los 4-6 años) y qué preguntar en cualquier centro antes de apuntarle.',
    phase: 1,
  },
  {
    slug: 'clases-para-mujeres',
    type: 'hub-perfil',
    meta: {
      title: 'Artes Marciales para Mujeres en el Garraf | Guía Local',
      description: 'Artes marciales y defensa personal para mujeres en el Garraf: qué disciplinas encajan según tu objetivo y cómo elegir centro con buen ambiente.',
    },
    h1: 'Artes Marciales y Defensa Personal para Mujeres en el Garraf',
    intro: 'Cada vez más mujeres entrenan artes marciales, y por buenas razones: forma física real, confianza, comunidad y herramientas de autodefensa. En esta guía te explicamos qué disciplinas encajan mejor según tu objetivo (boxeo y kickboxing para fitness, BJJ para técnica, defensa personal para seguridad práctica), qué valorar en un centro (grupos femeninos, ambiente, enfoque) y cómo dar el primer paso en la comarca del Garraf.',
    phase: 1,
  },
  {
    slug: 'clases-para-adultos',
    type: 'hub-perfil',
    meta: {
      title: 'Artes Marciales para Adultos en el Garraf | Empezar de Cero',
      description: 'Cómo empezar artes marciales siendo adulto en el Garraf: qué disciplina elegir según tu objetivo, qué esperar y cómo dar el primer paso sin experiencia.',
    },
    h1: 'Artes Marciales para Adultos en el Garraf',
    intro: 'Las artes marciales no tienen fecha de caducidad: hay quien empieza a los 20 y quien empieza a los 55. Lo importante es elegir la disciplina adecuada a tu objetivo y un grupo de iniciación de verdad. En esta guía te ayudamos a decidir entre las opciones disponibles en la comarca del Garraf, te contamos qué esperar de las primeras semanas y desmontamos los miedos típicos del principiante adulto.',
    phase: 2,
  },
  {
    slug: 'iniciacion',
    type: 'hub-perfil',
    meta: {
      title: 'Iniciación a las Artes Marciales en el Garraf | Empieza Aquí',
      description: 'No sabes qué arte marcial elegir. Normal. Esta guía te ayuda a decidir según tu objetivo, edad y carácter, y te orientamos gratis si sigues con dudas.',
    },
    h1: 'Iniciación a las Artes Marciales en el Garraf',
    intro: '¿No sabes por dónde empezar? Es lo más normal del mundo: hay muchas disciplinas y cada una promete algo distinto. Esta guía te ayuda a decidir con una lógica simple: qué buscas (forma física, autodefensa, disciplina para tus hijos, comunidad), cuánto contacto quieres y qué hay cerca de ti en la comarca del Garraf. Y si después de leer sigues con dudas, escríbenos: te orientamos sin coste y sin compromiso.',
    phase: 2,
  },
];

// ── Blog pages ─────────────────────────────────────────────────────────────────
const BLOG_PAGES: PageDef[] = [
  {
    slug: 'blog/que-es-el-grappling-y-donde-se-practica',
    type: 'blog',
    meta: {
      title: 'Grappling en el Garraf: Qué Es y Dónde Consta',
      description: 'Qué es el grappling, en qué se diferencia del jiu-jitsu con kimono y del judo, y en cuántos centros del Garraf consta la palabra hoy.',
    },
    h1: 'Grappling en el Garraf: Qué Es y Dónde Consta',
    intro: 'Lucha de agarre sin kimono: ni golpes ni tela de la que tirar. La palabra aparece en el horario de {{d:grappling}} de los {{centros}} centros que constan en la comarca, casi siempre junto al MMA o al jiu-jitsu. Aquí va qué significa en cada caso y qué preguntar antes de apuntarte.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-09-25',
    phase: 2,
  },
  {
    slug: 'blog/fitboxing-o-boxeo-en-el-garraf',
    type: 'blog',
    meta: {
      title: 'Fitboxing en el Garraf: Qué Vas a Encontrar de Verdad',
      description: 'Ningún centro del Garraf anuncia fitboxing. Qué hay en su lugar, en qué se parece a lo que buscas y cómo preguntar para no equivocarte de clase.',
    },
    h1: 'Fitboxing en el Garraf: Qué Vas a Encontrar de Verdad',
    intro: 'Golpeo sin oponente, música y ritmo marcado: eso promete la palabra. Lo que consta en la comarca es otra cosa, {{d:boxeo}} centros con boxeo y {{d:kickboxing}} con kickboxing, y ni una sola clase anunciada con ese nombre. La distancia entre ambas cosas es más corta de lo que parece.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-09-25',
    phase: 2,
  },
  {
    slug: 'blog/horarios-tipicos-de-las-clases',
    type: 'blog',
    meta: {
      title: 'Horarios de las Clases de Artes Marciales en el Garraf',
      description: 'Cómo se reparten las franjas infantil y de adultos, cuántas opciones tienes según tu municipio del Garraf y las seis preguntas que lo resuelven.',
    },
    h1: 'Horarios de las Clases en el Garraf: Qué Preguntar Antes de Apuntarte',
    intro: 'Los grupos infantiles ocupan la media tarde y los de adultos arrancan a partir de las ocho. Con eso no has resuelto nada, porque lo que decide si encuentras un horario que te sirva no es la disciplina: es el municipio del Garraf en el que vivas y cuántos centros constan allí.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-09-21',
    phase: 2,
  },
  {
    slug: 'blog/artes-marciales-para-perder-peso',
    type: 'blog',
    meta: {
      title: 'Artes Marciales para Perder Peso en el Garraf',
      description: 'Qué esperar de verdad, por qué las calorías son el dato menos útil y qué disciplinas constan en cada municipio del Garraf para sostener el hábito.',
    },
    h1: 'Artes Marciales para Perder Peso: Qué Esperar de Verdad',
    intro: 'La tabla de calorías por hora es el dato menos útil de esta decisión. Lo que de verdad la ordena es cuánto te cuesta llegar a la sala un martes de enero, y eso en esta comarca depende de dónde vivas: las disciplinas de más cardio continuo se concentran en dos de los seis municipios.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-09-21',
    phase: 2,
  },
  {
    slug: 'blog/cursos-defensa-personal-fin-de-semana',
    type: 'blog',
    meta: {
      title: 'Curso de Defensa Personal de Fin de Semana en el Garraf',
      description: 'Qué da y qué no da un curso de defensa personal de fin de semana, qué se retiene de verdad y qué formatos hay en los centros del Garraf.',
    },
    h1: 'Cursos de Defensa Personal de un Fin de Semana: Qué Dan y Qué No',
    intro: 'Dos tardes dan para más de lo que mucha gente supone, y para bastante menos de lo que promete el cartel. La diferencia entre una cosa y otra se explica en cinco minutos, y explica también por qué en el Garraf este formato es la excepción y no la puerta de entrada habitual.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-09-17',
    phase: 2,
  },
  {
    slug: 'blog/artes-marciales-con-sobrepeso',
    type: 'blog',
    meta: {
      title: 'Empezar Artes Marciales con Sobrepeso en el Garraf',
      description: 'Empezar artes marciales con sobrepeso: qué formatos permiten regular la intensidad, qué preguntar al centro y qué disciplinas hay en el Garraf.',
    },
    h1: 'Empezar con Sobrepeso: Qué Disciplina y Cómo Plantearlo',
    intro: 'La duda casi nunca es karate o boxeo. Es si vas a poder seguir el ritmo de la clase y si vas a sentirte observado. El criterio que más ordena la elección es el impacto articular, y con ese criterio en la mano los números del directorio dicen bastante sobre qué se puede entrenar en la comarca del Garraf.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-09-17',
    phase: 2,
  },
  {
    slug: 'blog/mi-hijo-quiere-dejar-las-clases',
    type: 'blog',
    meta: {
      title: 'Mi Hijo Quiere Dejar las Clases: Qué Hacer en el Garraf',
      description: 'Distinguir el bajón normal del problema real, qué preguntar al niño y al centro, y qué se puede cambiar de grupo, disciplina o club en el Garraf.',
    },
    h1: 'Mi Hijo Quiere Dejar las Clases: Qué Hacer Antes de Darle de Baja',
    intro: 'Que lo diga una vez un martes de lluvia no significa nada. Que lo repita cada semana desde hace mes y medio sí, y entonces entre seguir y darle de baja hay tres movimientos intermedios que casi nadie se plantea. Cuáles tienes disponibles depende bastante del municipio del Garraf en el que viváis.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-09-13',
    phase: 2,
  },
  {
    slug: 'blog/clases-mixtas-o-solo-mujeres',
    type: 'blog',
    meta: {
      title: '¿Grupo Mixto o Solo Mujeres? La Oferta del Garraf',
      description: 'Qué aporta cada formato, por qué muchas acaban combinando los dos y qué grupos femeninos constan de verdad en los centros del Garraf.',
    },
    h1: '¿Grupo Mixto o Solo Mujeres? Ventajas de Cada Uno en el Garraf',
    intro: 'De los {{centros}} centros que constan en la comarca, uno solo anuncia un grupo femenino. Ese dato condiciona la decisión más de lo que nos gustaría, así que aquí va qué aporta cada formato, qué preguntar por teléfono y qué hacer si donde vives no hay ninguna de las dos cosas.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-09-13',
    phase: 2,
  },
  {
    slug: 'blog/artes-marciales-ninos-tdah',
    type: 'blog',
    meta: {
      title: 'Artes Marciales y TDAH en el Garraf: Qué Esperar',
      description: 'Qué aporta de verdad el formato de una clase infantil, qué no se puede prometer y qué preguntar en un centro del Garraf antes de apuntar al niño.',
    },
    h1: 'Artes Marciales y TDAH: Qué Esperar de un Centro del Garraf',
    intro: 'Ningún club sustituye a un profesional sanitario, y ninguna escuela seria vende su método como tratamiento. Dicho eso, el formato de una clase infantil tiene cosas que encajan bien con un niño que se dispersa. Aquí va cuáles son, qué no esperar y qué preguntar en los centros que constan en la comarca.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-09-09',
    phase: 2,
  },
  {
    slug: 'blog/cuantos-dias-semana-entrena-un-nino',
    type: 'blog',
    meta: {
      title: 'Cuántos Días a la Semana Entrena un Niño en el Garraf',
      description: 'Dos días es lo habitual, pero en el Garraf la cuenta que importa es la de trayectos. Cuándo subir a tres, cuándo bajar y qué preguntar al club.',
    },
    h1: 'Cuántos Días a la Semana Debería Entrenar un Niño en el Garraf',
    intro: 'Dos días a la semana es la respuesta, y sirve para casi cualquier niño que empieza. Lo que casi nadie calcula es la otra cifra: en una comarca donde {{m:vilanova-i-la-geltru}} de los {{centros}} centros verificados están en Vilanova, dos sesiones pueden significar cuatro trayectos en coche.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-09-09',
    phase: 2,
  },
  {
    slug: 'blog/clase-de-prueba-que-preguntar',
    type: 'blog',
    meta: {
      title: 'La Clase de Prueba en el Garraf: Qué Mirar y Preguntar',
      description: 'Una clase de prueba es una hora para inspeccionar el club sin pagar nada. El guion de la visita en el Garraf: qué preguntar antes, qué mirar dentro y qué firmar.',
    },
    h1: 'La Clase de Prueba en el Garraf: Qué Mirar y Qué Preguntar',
    intro: 'Vas convencido de que te examinan a ti, y es al revés. Aquí tienes el guion de la visita, desde las tres preguntas de la llamada previa hasta los cinco minutos de después, con la señal que justifica levantarse e irse a mitad.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-09-05',
    phase: 2,
  },
  {
    slug: 'blog/artes-marciales-y-estres',
    type: 'blog',
    meta: {
      title: 'Artes Marciales para el Estrés en el Garraf',
      description: 'Por qué una clase de combate desconecta la cabeza mejor que una cinta de correr, qué no se puede prometer y qué disciplinas constan de verdad en la comarca.',
    },
    h1: 'Artes Marciales y Estrés: por Qué Funciona, y Qué Hay en el Garraf',
    intro: 'Es el motivo que más gente mantiene entrenando pasado el primer trimestre, y casi nunca es el que se dice en voz alta. Qué tiene el formato que funciona tan bien, qué no se puede prometer y qué disciplinas de los {{centros}} centros de la comarca encajan mejor.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-09-05',
    phase: 2,
  },
  {
    slug: 'blog/empezar-artes-marciales-a-los-40',
    type: 'blog',
    meta: {
      title: 'Empezar Artes Marciales a los 40 en el Garraf',
      description: 'A los 40 no empiezas tarde, empiezas distinto. Qué disciplinas perdonan más al cuerpo, cuáles hay de verdad en el Garraf y qué decir el primer día.',
    },
    h1: 'Empezar Artes Marciales a los 40 en el Garraf',
    intro: 'El miedo no suele ser la edad, sino la rodilla vieja y el ridículo. Aquí va qué cambia de verdad respecto a los veinticinco, qué disciplinas aguantan mejor un cuerpo de cuarenta y cuáles constan en los {{centros}} centros de la comarca.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-09-01',
    phase: 2,
  },
  {
    slug: 'blog/entrenar-sin-querer-competir',
    type: 'blog',
    meta: {
      title: 'Entrenar Artes Marciales sin Competir en el Garraf',
      description: 'La mayoría de quien entrena en el Garraf no compite nunca. Cómo detectar un club donde competir es opcional de verdad, con dos preguntas de un minuto.',
    },
    h1: 'Entrenar sin Querer Competir Nunca: Es lo Normal',
    intro: 'Es el miedo silencioso que impide apuntarse a mucha gente que ya está convencida. Aquí va qué disciplinas de la comarca empujan más hacia el circuito, qué preguntar en la primera llamada y qué se pierde de verdad si nunca subes a un tatami de competición.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-09-01',
    phase: 2,
  },
  {
    slug: 'blog/se-hacen-dano-los-ninos-artes-marciales',
    type: 'blog',
    meta: {
      title: 'Niños y Artes Marciales en el Garraf: ¿Se Hacen Daño?',
      description: 'Qué se lesiona de verdad un niño en artes marciales, cómo se gradúa el contacto en cada disciplina y qué preguntar en un centro del Garraf.',
    },
    h1: '¿Se Hacen Daño los Niños en Artes Marciales?',
    intro: 'Es la objeción número uno de las familias y casi nunca se responde con datos, sino con marketing de escuela. Aquí va lo que se hace un niño de verdad en una clase, cómo se introduce el contacto en cada disciplina y qué se puede comprobar en una visita de veinte minutos.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-08-29',
    phase: 2,
  },
  {
    slug: 'blog/empezar-artes-marciales-siendo-mujer',
    type: 'blog',
    meta: {
      title: 'Empezar Artes Marciales Siendo Mujer en el Garraf',
      description: 'Cómo son de verdad los grupos, qué pasa en el trabajo por parejas y qué grupos femeninos constan en el Garraf. Con cinco preguntas para la primera llamada.',
    },
    h1: 'Empezar Artes Marciales Siendo Mujer: Qué Esperar de Verdad',
    intro: 'La duda real no suele ser si puedes, sino si vas a ser la única, si te van a tratar distinto y con quién vas a entrenar el primer día. Con el dato de cuántos centros de la comarca declaran grupo femenino, que es menos alentador de lo que te gustaría.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-08-29',
    phase: 2,
  },
  {
    slug: 'blog/krav-maga-o-defensa-personal',
    type: 'blog',
    meta: {
      title: 'Krav Maga o Defensa Personal: No Son lo Mismo',
      description: 'Krav maga o defensa personal: qué es cada cosa, en qué se diferencian dentro de una clase, cuál encaja con lo que buscas y qué preguntar antes de pagar.',
    },
    h1: 'Krav Maga o Defensa Personal: No Son lo Mismo',
    intro: 'La confusión es constante y tiene consecuencias: hay gente que acaba apuntada a lo que no buscaba. Uno es un sistema concreto, con currículo, niveles y certificación propia; la otra es una categoría que puede contener cosas muy distintas entre sí. Aquí está dónde se nota la diferencia dentro de una sala.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-08-25',
    phase: 2,
  },
  {
    slug: 'blog/golpeo-o-agarre-por-donde-empezar',
    type: 'blog',
    meta: {
      title: 'Golpeo o Agarre: la Primera Decisión al Empezar',
      description: 'Golpeo o agarre: la bifurcación que ordena las diez disciplinas. Qué se siente en cada una, cuatro preguntas para decidir y cómo se aplica en el Garraf.',
    },
    h1: '¿Golpeo o Agarre? La Primera Bifurcación de las Artes Marciales',
    intro: 'La mayoría empieza comparando karate contra boxeo contra judo y acaba mareada a los diez minutos. Hay un corte anterior que ordena las diez disciplinas de golpe: resolver a distancia o resolver pegado. Elegida la familia, el resto de la decisión se vuelve manejable.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-08-25',
    phase: 2,
  },
  {
    slug: 'blog/arte-marcial-para-nino-timido',
    type: 'blog',
    meta: {
      title: 'Mi Hijo es Tímido: Qué Arte Marcial le Encaja',
      description: 'Tu hijo es tímido y dudas si apuntarle: qué formato de clase protege a un niño reservado, qué mirar en la prueba y qué ayuda en casa el primer mes.',
    },
    h1: 'Mi Hijo es Tímido: Qué Arte Marcial le Encaja',
    intro: 'La duda de fondo no suele ser qué disciplina, sino si lo va a pasar mal. Para un niño reservado pesan mucho más el tamaño del grupo, cómo se forman las parejas y cómo trata el instructor al que peor lo hace. Esto es lo que conviene mirar antes de apuntarle.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-08-25',
    phase: 2,
  },
  {
    slug: 'blog/arte-marcial-para-nino-muy-nervioso',
    type: 'blog',
    meta: {
      title: 'Mi Hijo No Para Quieto: Qué Disciplina Encaja',
      description: 'Niño que no para quieto: por qué la estructura de la clase canaliza más que el desgaste, qué disciplinas la tienen y qué mirar en la clase de prueba.',
    },
    h1: 'Mi Hijo No Para Quieto: Qué Disciplina Canaliza Mejor',
    intro: 'Casi todos los padres llegan pidiendo algo donde queme energía, y esa es la premisa equivocada. Lo que hace el trabajo en un niño movido no es el gasto físico de la clase, sino su estructura: los turnos, las paradas y unas normas que no negocia él.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-08-25',
    phase: 2,
  },
  {
    slug: 'blog/primer-dia-clase-artes-marciales-nino',
    type: 'blog',
    meta: {
      title: 'El Primer Día de Clase: Qué Llevar y Qué Pasa',
      description: 'Primera clase de artes marciales de tu hijo: qué llevar, qué no comprar todavía, cómo son los primeros veinte minutos y qué hacer si no quiere entrar.',
    },
    h1: 'El Primer Día de Clase: Qué Llevar y Qué Va a Pasar',
    intro: 'La primera clase pone nerviosos a los dos, y casi todo lo que la complica se evita con quince minutos de margen y una mochila bien hecha. Esto es lo que hay que llevar, lo que conviene no comprar todavía y lo que va a pasar dentro de la sala.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-08-23',
    phase: 2,
  },
  {
    slug: 'blog/judo-o-jiu-jitsu-brasileno',
    type: 'blog',
    meta: {
      title: 'Judo o Jiu-Jitsu Brasileño: Diferencias Reales',
      description: 'Judo o jiu-jitsu brasileño: de pie o en el suelo, reglamento, cinturones, qué le pide cada uno al cuerpo y qué perfil encaja en cada disciplina.',
    },
    h1: 'Judo o Jiu-Jitsu Brasileño: en Qué se Diferencian de Verdad',
    intro: 'Las dos son disciplinas de agarre, las dos entrenan con kimono y las dos salen de la misma raíz japonesa, así que se confunden constantemente. Pero una empieza de pie y busca la proyección, y la otra vive en el suelo y busca la sumisión. Comparamos lo que de verdad cambia en una clase de martes.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-08-23',
    phase: 2,
  },
  {
    slug: 'blog/boxeo-o-kickboxing',
    type: 'blog',
    meta: {
      title: 'Boxeo o Kickboxing: Cuál Elegir si Empiezas',
      description: 'Boxeo o kickboxing empezando de cero: qué cambia en la clase, la curva de aprendizaje, qué le pide cada uno al cuerpo y qué material comprar primero.',
    },
    h1: 'Boxeo o Kickboxing: Cuál Elegir si Empiezas de Cero',
    intro: 'Solo puños contra puños y piernas. Suena a matiz y condiciona los tres primeros meses: lo que aprendes antes, lo que te duele, lo que acabas comprando y lo que puedes hacer un martes cansado. Aquí está la comparativa, con una recomendación clara de por dónde empezar si estás empatado.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-08-23',
    phase: 2,
  },
  {
    slug: 'blog/muay-thai-o-kickboxing',
    type: 'blog',
    meta: {
      title: 'Muay Thai o Kickboxing: Qué Cambia Realmente',
      description: 'Muay thai o kickboxing: codos, rodillas y clinch, cómo cambia el ritmo del combate, qué se siente en el cuerpo y qué perfil encaja en cada uno.',
    },
    h1: 'Muay Thai o Kickboxing: Qué Cambia Realmente',
    intro: 'Ocho extremidades contra cuatro es la respuesta rápida, y se queda corta: un principiante tardará meses en tocar un codo. Lo que separa las dos disciplinas en una clase cualquiera son el clinch, el ritmo del combate y lo que cada una le hace a tus tibias el primer mes.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-08-23',
    phase: 2,
  },
  {
    slug: 'blog/karate-o-judo-para-ninos',
    type: 'blog',
    meta: {
      title: 'Karate o Judo para Niños | Comparativa para Padres',
      description: 'Karate o judo para tu hijo: cuánto contacto hay en cada uno, cómo es la clase, qué carácter encaja y qué mirar antes de apuntarle en el Garraf.',
    },
    h1: 'Karate o Judo para Niños: la Comparativa que Falta',
    intro: 'Golpeo controlado a distancia contra agarre y contacto continuo. La diferencia técnica se cuenta en diez segundos, pero lo que decide a los seis o siete años es cómo está montada la clase y qué tipo de niño sale contento de ella. Comparamos las dos entradas infantiles más habituales sin quedarnos en el folleto.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-08-17',
    phase: 2,
  },
  {
    slug: 'blog/beneficios-artes-marciales-ninos',
    type: 'blog',
    meta: {
      title: 'Beneficios Reales de las Artes Marciales para Niños',
      description: 'Qué aportan de verdad las artes marciales a un niño y qué es marketing de escuela: coordinación, turnos, frustración y lo que no hay que esperar.',
    },
    h1: 'Beneficios Reales de las Artes Marciales para Niños',
    intro: 'Disciplina, valores, respeto, seguridad en uno mismo: la lista de siempre no ayuda a decidir nada. Aquí separamos lo que aporta el formato de una clase infantil, que es concreto y se ve en unos meses, de lo que se promete y depende del niño, de la familia y del grupo que le toque.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-08-17',
    phase: 2,
  },
  {
    slug: 'blog/artes-marciales-o-futbol-extraescolar',
    type: 'blog',
    meta: {
      title: 'Artes Marciales o Fútbol: Qué Extraescolar Elegir',
      description: 'Deporte de equipo o deporte individual en grupo: qué gana un niño en cada uno, cómo pesa el calendario familiar y qué perfil encaja en cada formato.',
    },
    h1: 'Artes Marciales o Fútbol: Elegir Extraescolar sin Arrepentirse',
    intro: 'La comparación útil no es fútbol contra artes marciales por sus virtudes, sino deporte de equipo contra deporte individual practicado en grupo. Cambia lo que el niño se lleva, cambia el compromiso de la familia y cambia qué pasa cuando no destaca. Aquí está la diferencia, con el contexto de la comarca.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-08-17',
    phase: 2,
  },
  {
    slug: 'blog/extraescolar-artes-marciales-vuelta-al-cole',
    type: 'blog',
    meta: {
      title: 'Vuelta al Cole: Extraescolar de Artes Marciales',
      description: 'Cómo elegir extraescolar de artes marciales en septiembre: cuadrar horarios con el curso, qué preguntar en la primera llamada y qué mirar al probar.',
    },
    h1: 'Vuelta al Cole: Cómo Elegir Extraescolar de Artes Marciales',
    intro: 'Los grupos infantiles se organizan a la vez que arranca el curso, y lo que se decide en esas dos semanas condiciona el año entero: la franja horaria, los compañeros y el instructor. Esta guía ordena la decisión, con las preguntas que conviene hacer por teléfono antes de pagar nada.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-08-17',
    phase: 2,
  },
  {
    slug: 'blog/a-que-edad-empezar-artes-marciales',
    type: 'blog',
    meta: {
      title: 'A Qué Edad Empezar Artes Marciales | Guía por Edades',
      description: 'Desde qué edad se empieza en cada arte marcial y qué esperar en cada tramo: de los 4 años a los 60. Guía por edades para el Garraf.',
    },
    h1: 'A Qué Edad Empezar Artes Marciales: Guía por Tramos',
    intro: 'Es la primera pregunta de casi todo el mundo, y tiene dos versiones: la del padre que no sabe si su hijo de cuatro años aprovechará algo, y la del adulto que teme haber llegado tarde. Esta guía recorre los tramos de edad uno a uno (qué aporta cada uno, qué disciplinas están abiertas y qué hay que mirar en el centro) con el contexto de la oferta del Garraf.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-08-15',
    phase: 2,
  },
  {
    slug: 'blog/como-elegir-centro-artes-marciales-garraf',
    type: 'blog',
    meta: {
      title: 'Cómo Elegir un Centro de Artes Marciales | Checklist',
      description: 'Las 8 preguntas que hay que hacer antes de apuntarse a un gimnasio de artes marciales: grupos, contacto, condiciones, seguro y señales de alarma.',
    },
    h1: 'Cómo Elegir un Centro de Artes Marciales en el Garraf',
    intro: 'Elegir bien el centro pesa más que elegir bien la disciplina: casi nadie abandona porque se equivocara de estilo, sino porque acabó en el grupo que no le tocaba o atado a unas condiciones que no entendió. Esta es la lista de ocho comprobaciones que se responden en una visita y una llamada, válida para cualquier disciplina y cualquier municipio de la comarca.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-08-15',
    phase: 2,
  },
  {
    slug: 'blog/donde-aprender-boxeo-en-el-garraf',
    type: 'blog',
    meta: {
      title: 'Dónde Aprender Boxeo en el Garraf [Guía 2026]',
      description: 'Guía completa sobre dónde aprender boxeo en la comarca del Garraf. Sitges, Vilanova i la Geltrú y alrededores. Cómo elegir gimnasio y empezar bien.',
    },
    h1: 'Dónde Aprender Boxeo en el Garraf',
    intro: 'El interés por el boxeo no deja de crecer, también en la comarca del Garraf. Si estás buscando dónde aprender boxeo en Sitges, Vilanova o cualquier municipio de la comarca, esta guía te explica qué opciones tienes, cómo evaluar un gimnasio y qué esperar de tus primeras clases.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-07-07',
    phase: 2,
  },
  {
    slug: 'blog/mejor-arte-marcial-para-ninos-garraf',
    type: 'blog',
    meta: {
      title: 'Mejor Arte Marcial para Niños en el Garraf [Guía 2026]',
      description: 'Cuál es la mejor arte marcial para niños en el Garraf. Comparativa de karate, judo y taekwondo. Recomendaciones por edad. Guía para padres.',
    },
    h1: 'Cuál es la Mejor Arte Marcial para Niños en el Garraf',
    intro: 'Como padre o madre, elegir la arte marcial adecuada para tu hijo puede ser confuso: hay muchas opciones y cada una tiene sus ventajas. En esta guía comparamos las disciplinas más habituales para niños (karate, judo y taekwondo) y te damos criterios claros por edad, carácter y objetivo para decidir con fundamento.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-07-07',
    phase: 2,
  },
  {
    slug: 'blog/defensa-personal-para-mujeres-garraf',
    type: 'blog',
    meta: {
      title: 'Defensa Personal para Mujeres en el Garraf [Guía 2026]',
      description: 'Guía completa de defensa personal para mujeres en el Garraf. Qué aprender, dónde, qué funciona de verdad. Técnicas reales para situaciones reales.',
    },
    h1: 'Defensa Personal para Mujeres en el Garraf: Guía Completa',
    intro: 'La defensa personal para mujeres es uno de los temas más importantes y peor abordados del mundo de las artes marciales: mucho mito, mucho marketing y poca sustancia. En esta guía te contamos qué técnicas funcionan realmente, cómo elegir un centro serio en la comarca del Garraf y qué esperar de las primeras semanas de entrenamiento.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-07-07',
    phase: 2,
  },
  {
    slug: 'blog/artes-marciales-adultos-principiantes-garraf',
    type: 'blog',
    meta: {
      title: 'Artes Marciales para Adultos Principiantes en el Garraf',
      description: 'Cómo empezar las artes marciales siendo adulto en el Garraf. Qué disciplina elegir, qué esperar, cómo progresar. Guía para principiantes sin experiencia.',
    },
    h1: 'Cómo Empezar las Artes Marciales en el Garraf Siendo Adulto',
    intro: '¿Tienes 30, 40 o 50 años y quieres empezar artes marciales pero no sabes por dónde? Eres exactamente la persona para quien está escrita esta guía. Vamos a desmontar los miedos más comunes y a darte un plan claro para empezar, con las opciones reales que tienes en la comarca del Garraf.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-07-07',
    phase: 2,
  },
  {
    slug: 'blog/karate-vs-taekwondo-ninos-garraf',
    type: 'blog',
    meta: {
      title: 'Karate vs Taekwondo para Niños en el Garraf | Cuál Elegir',
      description: 'Comparativa entre karate y taekwondo para niños en el Garraf. Diferencias, ventajas de cada uno y cómo elegir según la edad y el carácter de tu hijo.',
    },
    h1: 'Karate o Taekwondo para Niños en el Garraf: Cuál Elegir',
    intro: 'Es una de las dudas más frecuentes entre padres: ¿karate o taekwondo para mi hijo? Ambas son disciplinas excelentes, pero tienen diferencias importantes. Te explicamos cuáles son y cómo decidir en función de la edad, el carácter y los objetivos de tu hijo, con el contexto de la oferta disponible en el Garraf.',
    body: '', // artículo retirado: lo sustituye src/content/blog
    fecha: '2026-07-07',
    phase: 3,
  },
];

// ── Compile all pages ─────────────────────────────────────────────────────────

/**
 * Últimos retoques comunes a todas las páginas:
 *  1. Enchufa el cuerpo y las FAQ locales de las páginas de perfil y de karate
 *     infantil, que viven en `local-content.ts` para no engordar este archivo.
 *  2. Garantiza que ningún título ni descripción supere el límite que Google
 *     recorta en la SERP, pase lo que pase en las plantillas de arriba.
 */
// Recuentos del directorio en la prosa: ver src/data/recuentos.ts.

function finalize(p: PageDef): PageDef {
  const body = p.body ?? PERFIL_BODIES[p.slug] ?? MONEY_BODIES[p.slug];
  const extraFaq = PERFIL_FAQS[p.slug] ?? MONEY_FAQS[p.slug];
  const localFaq = extraFaq ? [...(p.localFaq ?? []), ...extraFaq] : p.localFaq;

  return {
    ...p,
    intro: conDatos(p.intro),
    ...(body ? { body: conDatos(body) } : {}),
    ...(localFaq ? { localFaq: localFaq.map(f => ({ q: conDatos(f.q), a: conDatos(f.a) })) } : {}),
    meta: {
      title: clamp(conDatos(p.meta.title), MAX_TITLE),
      description: clamp(conDatos(p.meta.description), MAX_DESC),
    },
  };
}

export const ALL_PAGES: PageDef[] = [
  ...MONEY_COMBOS.map(generateMoneyPage),
  ...SPECIAL_PAGES,
  ...HUB_MUNICIPIO_PAGES,
  ...HUB_DISCIPLINA_PAGES,
  ...HUB_PERFIL_PAGES,
  ...BLOG_PAGES,
].map(finalize);

export function getPageBySlug(slug: string): PageDef | undefined {
  return ALL_PAGES.find(p => p.slug === slug);
}

export function getStaticSlugs(): string[] {
  return ALL_PAGES.map(p => p.slug);
}
