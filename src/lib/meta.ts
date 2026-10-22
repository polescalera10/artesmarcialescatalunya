// Título y descripción escritos a mano para páginas concretas del directorio
// (solo castellano). Sustituyen a los de la fórmula de cada plantilla. Se
// eligen mirando Search Console: páginas con muchas impresiones y pocos clics.
// El recuento no se escribe nunca a mano: {n} y {total} los rellena la plantilla.
// Límites de Google que se comprueban al compilar: título 60, descripción 155.

export interface MetaPagina {
  titulo: string;
  descripcion: string;
}

const ES: Record<string, MetaPagina> = {
  '/': {
    titulo: 'Artes marciales en Cataluña: {total} centros verificados',
    descripcion: 'Directorio de {total} centros de artes marciales en Cataluña: boxeo, judo, karate, jiu-jitsu, MMA y más, por comarca y municipio. Cada ficha cita su fuente.',
  },
  '/barcelones/barcelona/': {
    titulo: 'Artes marciales en Barcelona: {n} y cómo elegir',
    descripcion: 'Karate, boxeo, judo, kickboxing y más: {n} en Barcelona con fuente pública y fecha de verificación. Entra por disciplina o por cercanía.',
  },
  '/barcelones/barcelona/karate/': {
    titulo: 'Escuelas de karate en Barcelona: {n} verificados',
    descripcion: 'Dónde entrenar karate en Barcelona: {n} con fuente pública y fecha de verificación. Si buscas para niños, empieza por la guía de karate infantil.',
  },
  '/girones/': {
    titulo: 'Artes marciales en el Gironès: {n} por municipio',
    descripcion: 'Dónde entrenar artes marciales en el Gironès: {n} con fuente pública. Mira por municipio, de Girona a los pueblos de alrededor, o por disciplina.',
  },
  '/segria/lleida/kickboxing/': {
    titulo: 'Kickboxing en Lleida: {n} con fuente verificada',
    descripcion: 'Dónde entrenar kickboxing en Lleida: {n} con fuente pública y fecha de verificación, y los más cercanos del Segrià. Sin valoraciones ni rankings.',
  },
};

export function metaPagina(lang: string, ruta: string, vars: Record<string, string | number> = {}): MetaPagina | null {
  if (lang !== 'es') return null;
  const m = ES[ruta];
  if (!m) return null;
  const rellenar = (t: string) => t.replace(/\{(\w+)\}/g, (_, k) => {
    if (!(k in vars)) throw new Error(`meta.ts: ${ruta} usa {${k}} y la plantilla no lo aporta`);
    return String(vars[k]);
  });
  const titulo = rellenar(m.titulo);
  const descripcion = rellenar(m.descripcion);
  if (titulo.length > 60) throw new Error(`meta.ts: título de ${ruta} con ${titulo.length} caracteres (máx. 60): ${titulo}`);
  if (descripcion.length > 155) throw new Error(`meta.ts: descripción de ${ruta} con ${descripcion.length} caracteres (máx. 155): ${descripcion}`);
  return { titulo, descripcion };
}
