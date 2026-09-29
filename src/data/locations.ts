export interface Location {
  slug: string;
  name: string;
  nameShort: string;
  comarca: string;
  province: string;
  priority: 1 | 2 | 3;
  desc: string;
  nearbyTowns?: string[];
  mapEmbed?: string;
}

export const LOCATIONS: Location[] = [
  {
    slug: 'sitges',
    name: 'Sitges',
    nameShort: 'Sitges',
    comarca: 'Garraf',
    province: 'Barcelona',
    priority: 1,
    desc: 'Sitges es uno de los municipios más dinámicos de la comarca del Garraf, con carácter cosmopolita, mucha población internacional y una vida deportiva activa durante todo el año. En esta guía te explicamos qué disciplinas puedes practicar en Sitges y cómo empezar.',
    nearbyTowns: ['Castelldefels', 'Gavà', 'Begues'],
    mapEmbed: 'https://maps.google.com/maps?q=Sitges,+Barcelona&output=embed',
  },
  {
    slug: 'vilanova-i-la-geltru',
    name: 'Vilanova i la Geltrú',
    nameShort: 'Vilanova',
    comarca: 'Garraf',
    province: 'Barcelona',
    priority: 1,
    desc: 'Vilanova i la Geltrú es la capital de la comarca del Garraf y el municipio con mayor población, por lo que concentra la mayor oferta deportiva de la zona. Si buscas artes marciales en el Garraf, Vilanova es el punto de partida natural.',
    nearbyTowns: ['Cubelles', 'Cunit', 'Calafell'],
    mapEmbed: 'https://maps.google.com/maps?q=Vilanova+i+la+Geltrú,+Barcelona&output=embed',
  },
  {
    slug: 'sant-pere-de-ribes',
    name: 'Sant Pere de Ribes',
    nameShort: 'Sant Pere de Ribes',
    comarca: 'Garraf',
    province: 'Barcelona',
    priority: 2,
    desc: 'Sant Pere de Ribes incluye núcleos como Les Roquetes y Ribes. Aunque la oferta local es más limitada, Sitges y Vilanova i la Geltrú quedan a menos de 10-15 minutos en coche, con muchas más opciones para entrenar.',
    nearbyTowns: ['Les Roquetes', 'Olivella', 'Canyelles'],
  },
  {
    slug: 'cubelles',
    name: 'Cubelles',
    nameShort: 'Cubelles',
    comarca: 'Garraf',
    province: 'Barcelona',
    priority: 3,
    desc: 'Cubelles es un municipio costero entre Vilanova i la Geltrú y Cunit. Vilanova, con la mayor oferta deportiva de la comarca, queda a menos de 10 minutos en coche por la C-31.',
    nearbyTowns: ['Cunit', 'Calafell', 'Segur de Calafell'],
  },
  {
    slug: 'canyelles',
    name: 'Canyelles',
    nameShort: 'Canyelles',
    comarca: 'Garraf',
    province: 'Barcelona',
    priority: 3,
    desc: 'Canyelles es un municipio del interior del Garraf. Para entrenar artes marciales, la opción más habitual de sus vecinos es desplazarse a Vilanova i la Geltrú, a unos 15 minutos por la C-15.',
    nearbyTowns: ['Olivella', 'Begues'],
  },
  {
    slug: 'olivella',
    name: 'Olivella',
    nameShort: 'Olivella',
    comarca: 'Garraf',
    province: 'Barcelona',
    priority: 3,
    desc: 'Olivella es el municipio del Garraf con el término más extenso y la población más repartida: el núcleo antiguo y urbanizaciones como Can Surià o Mas Milà. Tiene un club de taekwondo en su directorio municipal; para el resto, Sant Pere de Ribes, Vilanova i la Geltrú y Sitges quedan a 10-20 minutos en coche.',
    nearbyTowns: ['Canyelles', 'Sant Pere de Ribes', 'Begues'],
  },
];

export function getLocationBySlug(slug: string): Location | undefined {
  return LOCATIONS.find(l => l.slug === slug);
}

export const LOCATION_NAMES: Record<string, string> = {
  'sitges': 'Sitges',
  'vilanova-i-la-geltru': 'Vilanova i la Geltrú',
  'sant-pere-de-ribes': 'Sant Pere de Ribes',
  'cubelles': 'Cubelles',
  'canyelles': 'Canyelles',
  'olivella': 'Olivella',
};
