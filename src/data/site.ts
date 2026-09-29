// Marca neutra honesta: Artes Marciales Garraf es una guía/portal independiente
// de artes marciales de la comarca del Garraf. NO es un gimnasio ni una academia.
// Regla innegociable: cero datos de negocio inventados (reseñas, direcciones,
// teléfonos, precios, instructores). Cuando haya un centro cliente real, su
// identidad verificada sustituirá a la marca neutra.
export const SITE = {
  name: 'Artes Marciales Garraf',
  shortName: 'AM Garraf',
  tagline: 'La guía de artes marciales de la comarca del Garraf',
  domain: 'artesmarcialesgarraf.es',
  url: 'https://artesmarcialesgarraf.es',
  // Buzón operativo desde 2026-08-15.
  email: 'contacto@artesmarcialesgarraf.es',
  // Interruptor del canal de contacto. En false, la web no ofrece ninguna vía
  // de contacto: /contacto/ muestra un aviso, desaparecen los enlaces de email
  // y los CTA dejan de prometer orientación. Se usó entre el 14 y el 15 de
  // agosto de 2026, mientras el buzón no existía.
  contactoActivo: true,
  // WhatsApp. En Rank2Rent el lead es el producto y el `mailto:` es fricción
  // alta en móvil: quien busca extraescolar para su hijo desde el sofá no abre
  // un cliente de correo. Este canal está implementado y apagado a la espera
  // del número: en cuanto `numero` tenga un valor aparece el botón en la
  // cabecera, en los CTA y en /contacto/, sin tocar nada más.
  //
  // Formato: internacional, solo dígitos, sin '+' ni espacios ('34600112233').
  // Debe ser una cuenta de WhatsApp Business real y atendida. Si no se va a
  // responder, es mejor dejarlo vacío: un canal muerto es peor que ninguno.
  //
  // Ojo legal: al activarlo hay que descomentar el punto de WhatsApp en la
  // sección 4 de /politica-privacidad/ (los mensajes pasan por Meta Platforms
  // Ireland, que es un destinatario más de los datos del visitante).
  whatsapp: {
    numero: '',
    horario: 'Respondemos de lunes a viernes, normalmente el mismo día.',
  },
  region: {
    comarca: 'Comarca del Garraf',
    province: 'Barcelona',
    country: 'España',
  },
  // Analítica. El ID de medición de GA4 es público por diseño (aparece en el
  // código fuente de cualquier página), así que va aquí y no en una variable de
  // entorno: una cosa menos que configurar en Vercel.
  //
  // IMPORTANTE: GA4 usa cookies y transfiere datos a Google, así que en España
  // requiere consentimiento previo (AEPD). El script NO se carga hasta que el
  // visitante acepta en el banner (src/components/CookieConsent.astro). Si algún
  // día se quita el banner, hay que quitar también esta línea.
  analytics: {
    gaId: 'G-B9YBBT41MM',
  },
  // Fecha de la última revisión editorial del contenido. Es la que se publica
  // como <lastmod> en el sitemap de todo lo que no es blog (los artículos usan
  // su propia fecha). Antes se emitía la fecha del build, lo que le decía a
  // Google que las 66 páginas cambiaban cada vez que se desplegaba un botón:
  // una señal falsa que los rastreadores acaban ignorando.
  //
  // ACTUALIZAR solo cuando se revise o reescriba contenido de verdad.
  ultimaRevision: '2026-09-29',
  defaultMeta: {
    description:
      'Guía de artes marciales en la comarca del Garraf: boxeo, karate, MMA, muay thai, BJJ, judo, taekwondo y defensa personal en Sitges, Vilanova i la Geltrú, Sant Pere de Ribes, Cubelles y Canyelles.',
  },
};

/** ¿Hay canal de WhatsApp configurado y activo? */
export const whatsappActivo = SITE.contactoActivo && SITE.whatsapp.numero.length > 0;

/**
 * Enlace wa.me con el mensaje ya redactado. El texto prerrellenado sube mucho
 * la tasa de respuesta y, sobre todo, hace que el lead llegue calificado: con
 * disciplina y municipio desde el primer mensaje, que es justo lo que un centro
 * comprador quiere recibir.
 */
export function whatsappLink(mensaje: string): string {
  return `https://wa.me/${SITE.whatsapp.numero}?text=${encodeURIComponent(mensaje)}`;
}

// ────────────────────────────────────────────────────────────────────────────
// Entidades base del grafo de datos estructurados.
//
// Se declaran una sola vez con @id estable, y el resto de páginas las
// referencian con {"@id": ...} en lugar de repetir el objeto entero. Así Google
// entiende que todas las páginas pertenecen al mismo sitio y al mismo editor,
// en vez de ver decenas de entidades sueltas sin relación.
//
// Regla del proyecto: Organization describe a la GUÍA como editor, nunca como
// gimnasio. Nada de LocalBusiness, dirección, teléfono ni valoraciones.
// ────────────────────────────────────────────────────────────────────────────
export const SCHEMA_IDS = {
  organization: `${SITE.url}/#organization`,
  website: `${SITE.url}/#website`,
} as const;

export const ORGANIZATION_SCHEMA = {
  '@type': 'Organization',
  '@id': SCHEMA_IDS.organization,
  name: SITE.name,
  url: `${SITE.url}/`,
  description:
    'Guía editorial independiente sobre artes marciales en la comarca del Garraf (Barcelona). No es un gimnasio ni una academia.',
  logo: {
    '@type': 'ImageObject',
    url: `${SITE.url}/logo.png`,
    width: 512,
    height: 512,
  },
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'Comarca del Garraf',
    containedInPlace: { '@type': 'AdministrativeArea', name: 'Barcelona, España' },
  },
};

export const WEBSITE_SCHEMA = {
  '@type': 'WebSite',
  '@id': SCHEMA_IDS.website,
  name: SITE.name,
  alternateName: SITE.tagline,
  url: `${SITE.url}/`,
  inLanguage: 'es',
  publisher: { '@id': SCHEMA_IDS.organization },
  about: {
    '@type': 'Thing',
    name: 'Artes marciales en la comarca del Garraf (Barcelona)',
  },
};
