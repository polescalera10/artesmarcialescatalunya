// ────────────────────────────────────────────────────────────────────────────
// DIRECTORIO DE CENTROS REALES — comarca del Garraf
//
// Regla innegociable: aquí solo entran centros REALES con datos procedentes de
// fuentes públicas verificables (web oficial del centro, registro de federación
// o directorio municipal). Cada entrada lleva su fuente y la fecha en que se
// verificó. Prohibido añadir valoraciones, reseñas, precios u opiniones.
// Si un dato no se puede verificar, no se publica.
//
// Este directorio es informativo: no implica relación comercial con los centros
// listados ni recomendación de unos sobre otros (orden alfabético por municipio).
// ────────────────────────────────────────────────────────────────────────────

export type FuenteTipo = 'web-oficial' | 'federacion' | 'directorio-municipal' | 'perfil-publico';

export interface Centro {
  nombre: string;
  municipio: string; // slug de locations.ts
  /** Slugs de disciplines.ts que ofrece el centro según su fuente pública */
  disciplinas: string[];
  /** Actividades citadas por la fuente que no tienen página propia en la guía */
  otras?: string[];
  /** Solo si consta en la propia fuente verificada; nunca deducida */
  direccion?: string;
  /** Web pública del centro, si tiene */
  web?: string;
  /** URL de la fuente pública donde se verificaron los datos */
  fuente: string;
  fuenteTipo: FuenteTipo;
  /** Fecha de la última verificación de los datos (YYYY-MM-DD) */
  verificado: string;
}

export const FUENTE_LABELS: Record<FuenteTipo, string> = {
  'web-oficial': 'Web oficial del centro',
  'federacion': 'Registro de clubs de la federación',
  'directorio-municipal': 'Directorio municipal de entidades',
  'perfil-publico': 'Perfil público del centro',
};

export const CENTROS: Centro[] = [
  // ── Vilanova i la Geltrú ────────────────────────────────────────────────
  {
    nombre: 'Aranha VNG',
    municipio: 'vilanova-i-la-geltru',
    // Reverificado el 2026-08-15 sobre el dominio definitivo: la web anuncia
    // estas cinco disciplinas en su sección "Disciplinas" y en el pie.
    disciplinas: ['jiu-jitsu-brasileno', 'kickboxing', 'mma', 'boxeo', 'defensa-personal'],
    otras: ['Clases infantiles y juveniles', 'Grupo femenino de jiu-jitsu'],
    direccion: 'Rambla del Garraf, 32, 08800 Vilanova i la Geltrú',
    web: 'https://www.aranhavng.es',
    fuente: 'https://www.aranhavng.es',
    fuenteTipo: 'web-oficial',
    verificado: '2026-08-15',
  },
  {
    nombre: 'Centros DYM — Escuela de Vilanova',
    municipio: 'vilanova-i-la-geltru',
    disciplinas: ['boxeo', 'kickboxing', 'defensa-personal'],
    otras: ['Clases infantiles', 'Entrenador personal'],
    direccion: "Carrer de l'Havana, 17, 08800 Vilanova i la Geltrú",
    web: 'https://centrosdym.com/escuela-de-vilanova/',
    fuente: 'https://centrosdym.com/escuela-de-vilanova/',
    fuenteTipo: 'web-oficial',
    verificado: '2026-07-07',
  },
  {
    nombre: "Choi's Vilanova",
    municipio: 'vilanova-i-la-geltru',
    disciplinas: ['taekwondo'],
    fuente: 'https://taekwondocatala.com',
    fuenteTipo: 'federacion',
    verificado: '2026-07-07',
  },
  {
    nombre: 'Escola de Judo Vilafranca-Vilanova',
    municipio: 'vilanova-i-la-geltru',
    disciplinas: ['judo', 'defensa-personal'],
    otras: ['Aikido', 'Wu shu', 'Taijitsu'],
    fuente: 'https://www.vilanova.cat/directori/detall?id=49964',
    fuenteTipo: 'directorio-municipal',
    verificado: '2026-07-07',
  },
  {
    nombre: 'Mugendo Vilanova',
    municipio: 'vilanova-i-la-geltru',
    disciplinas: ['kickboxing', 'defensa-personal'],
    web: 'https://vilanova.mugendo.es',
    fuente: 'https://vilanova.mugendo.es',
    fuenteTipo: 'web-oficial',
    verificado: '2026-07-07',
  },
  {
    nombre: 'Senshi No Michi',
    municipio: 'vilanova-i-la-geltru',
    disciplinas: ['karate', 'jiu-jitsu-brasileno', 'boxeo', 'kickboxing', 'defensa-personal'],
    otras: ['Karate Kyokushin', 'K-1'],
    web: 'https://www.senshinomichi.com',
    fuente: 'https://www.senshinomichi.com',
    fuenteTipo: 'web-oficial',
    verificado: '2026-07-07',
  },
  {
    nombre: 'Zen Garraf',
    municipio: 'vilanova-i-la-geltru',
    disciplinas: ['jiu-jitsu-brasileno', 'boxeo'],
    otras: ['Grappling', 'Cross training'],
    web: 'https://www.zengarraf.com',
    fuente: 'https://www.zengarraf.com',
    fuenteTipo: 'web-oficial',
    verificado: '2026-07-07',
  },

  // ── Sitges ──────────────────────────────────────────────────────────────
  {
    nombre: 'AAMS — Academia Artes Marciales Sitges',
    municipio: 'sitges',
    disciplinas: ['kickboxing', 'jiu-jitsu-brasileno', 'karate', 'mma', 'defensa-personal'],
    otras: ['Grappling', 'K-1', 'Clases infantiles'],
    web: 'https://www.instagram.com/artes_marciales_sitges/',
    fuente: 'https://www.instagram.com/artes_marciales_sitges/',
    fuenteTipo: 'perfil-publico',
    verificado: '2026-07-07',
  },
  {
    nombre: 'Centros DYM — Escuela de Sitges',
    municipio: 'sitges',
    disciplinas: ['boxeo', 'kickboxing', 'defensa-personal'],
    otras: ['Clases infantiles', 'Área fitness'],
    direccion: 'Carrer Samuel Barrachina, 10, 08870 Sitges',
    web: 'https://centrosdym.com/escuela-de-sitges/',
    fuente: 'https://centrosdym.com/escuela-de-sitges/',
    fuenteTipo: 'web-oficial',
    verificado: '2026-07-07',
  },
  {
    nombre: 'SitgesFit',
    municipio: 'sitges',
    disciplinas: ['mma', 'kickboxing', 'boxeo', 'jiu-jitsu-brasileno', 'karate'],
    otras: ['Grappling', 'Karate Kids'],
    direccion: 'Avinguda Camí Pla 31, 08870 Sitges',
    web: 'https://sitgesfit.com/artes-marciales/',
    fuente: 'https://sitgesfit.com/artes-marciales/',
    fuenteTipo: 'web-oficial',
    verificado: '2026-07-07',
  },

  // ── Sant Pere de Ribes ──────────────────────────────────────────────────
  {
    nombre: 'Esportiu TKD Ribes',
    municipio: 'sant-pere-de-ribes',
    disciplinas: ['taekwondo'],
    direccion: 'Carrer de Sitges, 85, 08810 Sant Pere de Ribes',
    fuente: 'https://taekwondocatala.com',
    fuenteTipo: 'federacion',
    verificado: '2026-07-07',
  },
  {
    nombre: 'Associació de Taekwondo SANPO',
    municipio: 'sant-pere-de-ribes',
    disciplinas: ['taekwondo'],
    direccion: 'Pavelló poliesportiu, Rambla Rafael Alberti, s/n, 08812 Les Roquetes',
    fuente: 'https://www.santperederibes.cat/en/municipi/esports/entitats-esportives',
    fuenteTipo: 'directorio-municipal',
    verificado: '2026-09-29',
  },
  {
    nombre: 'Spartae',
    municipio: 'sant-pere-de-ribes',
    // Disciplinas: menú "Estilos" de su web. Dirección: directorio municipal de
    // entidades de Sant Pere de Ribes, donde consta como Associació Taekwondo
    // ITF Spartae con esta misma web.
    disciplinas: ['taekwondo', 'defensa-personal'],
    otras: ['Jeet Kune Do', 'Kali filipino', 'Wing chun'],
    direccion: 'Carrer Lluís Companys, 50, 08810 Sant Pere de Ribes',
    web: 'https://www.spartae.es',
    fuente: 'https://www.spartae.es',
    fuenteTipo: 'web-oficial',
    verificado: '2026-09-29',
  },
  {
    nombre: 'Taekwon-do Club Taijitu Sant Pere de Ribes',
    municipio: 'sant-pere-de-ribes',
    disciplinas: ['taekwondo'],
    direccion: 'Carrer Jaume Balmes, 25, 08810 Sant Pere de Ribes',
    web: 'https://www.taekwon-do-itf-club-taijitu.org/',
    fuente: 'https://www.santperederibes.cat/en/municipi/esports/entitats-esportives',
    fuenteTipo: 'directorio-municipal',
    verificado: '2026-09-29',
  },

  // ── Cubelles ────────────────────────────────────────────────────────────
  {
    nombre: 'Club Taekwondo Cubelles',
    municipio: 'cubelles',
    disciplinas: ['taekwondo'],
    fuente: 'https://www.facebook.com/p/Club-taekwondo-Cubelles-100057026816192/',
    fuenteTipo: 'perfil-publico',
    verificado: '2026-07-07',
  },
  {
    nombre: 'GYM FYS Fitness & Defense',
    municipio: 'cubelles',
    // Su web enumera "TAEKWONDO, BOXING, MMA, KRAV MAGA, FITNESS". Es el primer
    // centro del directorio con krav maga: hasta el 2026-09-29 la guía decía
    // que no constaba ninguno en la comarca.
    disciplinas: ['taekwondo', 'boxeo', 'mma', 'krav-maga'],
    otras: ['Fitness'],
    direccion: 'Passatge Soletat, 14, 08880 Cubelles',
    web: 'https://www.gymfysgarraf.com',
    fuente: 'https://www.gymfysgarraf.com',
    fuenteTipo: 'web-oficial',
    verificado: '2026-09-29',
  },

  // ── Olivella ────────────────────────────────────────────────────────────
  {
    nombre: 'Associació Esportiva Taekwondo Olivella',
    municipio: 'olivella',
    // La ficha municipal solo da el nombre de la entidad: ni dirección ni web.
    // No se publica nada que no conste en ella.
    disciplinas: ['taekwondo'],
    fuente: 'https://www.olivella.cat/el-municipi/entitats-esportives-/associacio-esportiva-taekwondo-olivella-.html',
    fuenteTipo: 'directorio-municipal',
    verificado: '2026-09-29',
  },

  // Canyelles: a fecha de la última verificación no consta ningún centro de
  // artes marciales con fuente pública verificable en el municipio.
];

export function getCentrosByMunicipio(municipio: string): Centro[] {
  return CENTROS.filter(c => c.municipio === municipio);
}

export function getCentrosByDisciplina(disciplina: string): Centro[] {
  return CENTROS.filter(c => c.disciplinas.includes(disciplina));
}

export function getCentros(municipio: string, disciplina: string): Centro[] {
  return CENTROS.filter(c => c.municipio === municipio && c.disciplinas.includes(disciplina));
}

/** Centros de la disciplina en el resto de la comarca (para municipios sin oferta local) */
export function getCentrosCercanos(municipio: string, disciplina: string): Centro[] {
  return CENTROS.filter(c => c.municipio !== municipio && c.disciplinas.includes(disciplina));
}
