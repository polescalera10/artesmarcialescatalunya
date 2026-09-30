// Configuración global de Artes Marciales Catalunya.

export const SITE = {
  name: 'Artes Marciales Catalunya',
  nameCa: 'Arts Marcials Catalunya',
  url: 'https://artesmarciales.cat',
  email: 'contacto@artesmarciales.cat',
  // Fecha de la última revisión editorial real. Va a <lastmod> de las páginas
  // que no tienen fecha propia: no se cambia en cada despliegue.
  ultimaRevision: '2026-09-30',
  analytics: {
    // Público por diseño; el script solo se inserta con consentimiento.
    gaId: 'G-KFWCFQF466',
  },
  indexNowKey: '99700fb47e87c6e52c646cf63ea4c863',
} as const;

export const SCHEMA_IDS = {
  organization: `${SITE.url}/#organization`,
  website: `${SITE.url}/#website`,
} as const;

export const ORGANIZATION_SCHEMA = {
  '@type': 'Organization',
  '@id': SCHEMA_IDS.organization,
  name: SITE.name,
  alternateName: SITE.nameCa,
  url: `${SITE.url}/`,
  logo: { '@type': 'ImageObject', url: `${SITE.url}/logo.png`, width: 512, height: 512 },
  email: SITE.email,
  description:
    'Directorio independiente y verificado de centros de artes marciales de Cataluña, con la fuente pública de cada ficha.',
  areaServed: { '@type': 'AdministrativeArea', name: 'Catalunya' },
};

export const WEBSITE_SCHEMA = {
  '@type': 'WebSite',
  '@id': SCHEMA_IDS.website,
  name: SITE.name,
  url: `${SITE.url}/`,
  inLanguage: ['es', 'ca'],
  publisher: { '@id': SCHEMA_IDS.organization },
};
