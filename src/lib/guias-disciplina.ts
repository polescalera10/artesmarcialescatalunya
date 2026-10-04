export interface Discipline {
  slug: string;
  name: string;
  nameEs: string;
  emoji: string;
  color: string;
  shortDesc: string;
  benefits: string[];
  suitable: string[];
  /** Cómo suele ser una primera clase típica (genérico de la disciplina, no de ningún centro) */
  primeraClase: string[];
  /** Equipación habitual para empezar; sin marcas ni precios */
  equipacion: string[];
  faq: { q: string; a: string }[];
}

export const DISCIPLINES: Discipline[] = [
  {
    slug: 'boxeo',
    name: 'Boxeo',
    nameEs: 'Boxeo',
    emoji: '🥊',
    color: '#DC2626',
    shortDesc: 'El arte del puñetazo. Técnica, potencia y condición física de élite.',
    benefits: ['Mejora cardiovascular extrema', 'Coordinación y reflejos', 'Descarga de estrés', 'Tonificación muscular completa'],
    suitable: ['Principiantes', 'Adultos', 'Mujeres', 'Deportistas'],
    primeraClase: [
      'Calentamiento con cuerda, movilidad y sombra para soltar el cuerpo',
      'Posición de guardia, desplazamientos y los dos golpes básicos: jab y directo',
      'Trabajo en saco o manoplas aplicando lo aprendido, por rondas',
      'Abdominales y estiramientos para cerrar; el sparring nunca es el primer día',
    ],
    equipacion: [
      'Primeras clases: ropa deportiva, agua y toalla; muchos gimnasios prestan guantes',
      'Vendas de 3-4 metros para proteger las manos (lo primero que conviene comprar)',
      'Guantes propios de 12-14 oz cuando decidas continuar',
      'Protector bucal solo cuando empieces trabajo por parejas',
    ],
    faq: [
      { q: '¿Necesito equipación para empezar boxeo?', a: 'Para las primeras clases, en muchos gimnasios basta con ropa deportiva: es habitual que presten guantes y material básico al principio. Si decides continuar, el material propio esencial son guantes y vendas.' },
      { q: '¿El boxeo es peligroso para principiantes?', a: 'No. Las clases de iniciación son técnicas: aprendes a golpear correctamente sobre sacos y manoplas. El sparring libre es opcional y solo cuando el instructor lo considera apropiado según tu nivel.' },
      { q: '¿Cuántas veces por semana debo entrenar boxeo?', a: 'Dos sesiones semanales son suficientes para progresar de forma visible. Con tres, los resultados son notables en menos de dos meses.' },
      { q: '¿El boxeo sirve para adelgazar?', a: 'Es uno de los deportes más efectivos para perder peso. Una sesión de 60 minutos quema entre 500 y 800 kcal dependiendo de la intensidad.' },
      { q: '¿Puedo practicar boxeo sin querer competir?', a: 'Sí. La gran mayoría de quienes practican boxeo nunca compiten: entrenan para estar en forma, aprender técnica y disfrutar. En cualquier gimnasio serio la competición es siempre opcional.' },
    ],
  },
  {
    slug: 'karate',
    name: 'Karate',
    nameEs: 'Karate',
    emoji: '🥋',
    color: '#2563EB',
    shortDesc: 'Disciplina, respeto y técnica. El arte marcial más practicado del mundo.',
    benefits: ['Disciplina y concentración', 'Valores y respeto', 'Flexibilidad y coordinación', 'Defensa personal básica'],
    suitable: ['Niños desde 4 años', 'Adultos', 'Mayores', 'Principiantes'],
    primeraClase: [
      'Saludo y normas básicas de etiqueta del dojo (parte esencial del karate)',
      'Calentamiento y movilidad articular',
      'Kihon: posiciones, bloqueos y golpes básicos repetidos con corrección técnica',
      'En niños, juegos de coordinación; en adultos, primera toma de contacto con un kata sencillo',
    ],
    equipacion: [
      'Primeras clases: ropa deportiva cómoda y pies descalzos',
      'Karategi (kimono de karate) cuando confirmes que sigues; la escuela suele orientarte con la talla',
      'El cinturón blanco inicial suele venir con el karategi',
      'Protecciones (guantillas, bucal) solo al iniciar kumite, más adelante',
    ],
    faq: [
      { q: '¿Desde qué edad pueden empezar karate los niños?', a: 'Desde los 4 años. Las escuelas suelen organizar grupos por edades (prebenjamines (4-6 años), benjamines (7-9), alevines (10-12) y juveniles (13-15)) con metodología adaptada a cada franja.' },
      { q: '¿Cuánto tiempo se tarda en obtener el cinturón negro?', a: 'Depende del alumno, pero entre 5 y 8 años de entrenamiento regular es la media. El camino hasta el negro pasa por blanco, amarillo, naranja, verde, azul, marrón y negro.' },
      { q: '¿El karate sirve para la autodefensa real?', a: 'Sí. Las técnicas de karate son directamente aplicables en situaciones reales. Además, la conciencia situacional que desarrollas con el entrenamiento es igualmente valiosa.' },
      { q: '¿Cuántas veces a la semana se entrena karate?', a: 'Para niños, dos días semanales es el estándar. Para adultos que quieren progresar rápido, tres sesiones semanales.' },
      { q: '¿El karate es competitivo o solo recreativo?', a: 'Ambas cosas. Hay quien compite en el circuito catalán y quien practica exclusivamente por salud, disciplina y autodefensa. En una buena escuela, competir es una opción, nunca una obligación.' },
    ],
  },
  {
    slug: 'mma',
    name: 'MMA',
    nameEs: 'Artes Marciales Mixtas',
    emoji: '⚡',
    color: '#7C3AED',
    shortDesc: 'La evolución de las artes marciales. Golpeo + lucha en el sistema más completo.',
    benefits: ['Sistema de combate completo', 'Máxima condición física', 'Autoconfianza real', 'Adaptable a todos los niveles'],
    suitable: ['Adultos', 'Deportistas', 'Avanzados', 'Principiantes motivados'],
    primeraClase: [
      'Calentamiento intenso con movilidad y desplazamientos',
      'Técnica de striking básica: guardia, jab-directo y una patada baja',
      'Introducción al suelo: una posición de control y cómo levantarse con seguridad',
      'Trabajo por parejas con intensidad controlada; el sparring llega semanas después',
    ],
    equipacion: [
      'Primeras clases: ropa deportiva sin cremalleras ni bolsillos',
      'Protector bucal y coquilla en cuanto empiece el trabajo por parejas',
      'Guantillas de MMA y espinilleras cuando decidas continuar',
      'Rashguard (camiseta técnica ajustada) recomendable para el trabajo de suelo',
    ],
    faq: [
      { q: '¿Se puede empezar MMA desde cero?', a: 'Absolutamente. Un buen programa de iniciación al MMA empieza por los fundamentos de golpeo, derribo y suelo, sin exigir experiencia previa. Si un centro pide base marcial para entrar, busca otro para empezar.' },
      { q: '¿El MMA es peligroso?', a: 'El entrenamiento de MMA está muy controlado. Las técnicas se aprenden de forma progresiva y el sparring libre solo se realiza con protecciones y cuando el instructor lo autoriza.' },
      { q: '¿Qué disciplinas incluye el MMA?', a: 'El MMA combina striking (boxeo, kickboxing, muay thai), derribo (lucha, judo) y suelo (BJJ, grappling). Un buen programa trabaja las tres áreas de forma integrada, no como asignaturas sueltas.' },
      { q: '¿Cuántas veces por semana se entrena MMA?', a: 'Mínimo dos días para mantener nivel. Tres o cuatro para progresar de forma significativa. Las sesiones son de 90 minutos.' },
      { q: '¿El MMA sirve para la autodefensa?', a: 'Es uno de los sistemas más efectivos para la autodefensa real porque entrenas para defenderte en pie y en el suelo, que es donde acaban la mayoría de altercados.' },
    ],
  },
  {
    slug: 'kickboxing',
    name: 'Kickboxing',
    nameEs: 'Kickboxing',
    emoji: '🦵',
    color: '#D97706',
    shortDesc: 'Puños y patadas. La fusión perfecta entre boxeo y karate para ponerte en forma.',
    benefits: ['Quema calórica máxima', 'Técnica de piernas', 'Coordinación completa', 'Tono muscular global'],
    suitable: ['Todos los niveles', 'Adultos', 'Adolescentes', 'Mujeres'],
    primeraClase: [
      'Calentamiento cardio (cuerda o circuito) y movilidad de cadera',
      'Guardia, desplazamientos y golpes de puño básicos',
      'Primera patada: la circular baja o media, paso a paso',
      'Rondas de saco o paos y abdominales para terminar',
    ],
    equipacion: [
      'Primeras clases: ropa deportiva y agua; pregunta si prestan guantes',
      'Vendas y guantes de 10-12 oz al continuar',
      'Espinilleras para el trabajo por parejas',
      'Protector bucal cuando empiece el contacto controlado',
    ],
    faq: [
      { q: '¿El kickboxing es lo mismo que el muay thai?', a: 'Son similares pero diferentes. El kickboxing permite golpes de puño y patada. El muay thai añade codazos, rodillazos y clinch. Para iniciarse, el kickboxing suele ser más accesible.' },
      { q: '¿Qué equipación necesito para kickboxing?', a: 'Guantes de 10-12 oz, vendas, espinilleras y protector bucal. Para las primeras clases, muchos gimnasios prestan el material básico: pregúntalo antes de comprar nada.' },
      { q: '¿El kickboxing es bueno para las mujeres?', a: 'Es una de las disciplinas más elegidas por mujeres. La combinación de técnica y cardio lo hace ideal para ponerse en forma mientras aprendes a defenderte.' },
      { q: '¿Puedo combinar kickboxing con otra disciplina?', a: 'Sí y es muy recomendable. Kickboxing + BJJ es una combinación clásica que te da golpeo de pie y control en el suelo.' },
      { q: '¿Se compite en kickboxing?', a: 'Sí, hay un circuito catalán y nacional activo. Pero competir es completamente opcional: la mayoría de practicantes entrena por forma física y técnica.' },
    ],
  },
  {
    slug: 'muay-thai',
    name: 'Muay Thai',
    nameEs: 'Muay Thai',
    emoji: '🏆',
    color: '#059669',
    shortDesc: 'El arte de las ocho extremidades. Codos, rodillas, puños y patadas.',
    benefits: ['Potencia de golpeo máxima', 'Condición física de élite', 'Técnica de clinch', 'Confianza real'],
    suitable: ['Adultos', 'Deportistas', 'Todos los niveles'],
    primeraClase: [
      'Calentamiento con cuerda y movilidad específica de cadera',
      'Guardia tailandesa, desplazamientos y golpes de puño',
      'Patada circular y rodilla básica sobre paos, con técnica antes que potencia',
      'El clinch y los codos llegan más adelante, cuando hay base',
    ],
    equipacion: [
      'Primeras clases: ropa deportiva; muchos gimnasios prestan material básico',
      'Vendas y guantes de 12-16 oz al continuar',
      'Espinilleras y protector bucal para el trabajo por parejas',
      'Coquilla y pantalón corto de muay thai cuando ya entrenes en serio',
    ],
    faq: [
      { q: '¿El muay thai es demasiado duro para principiantes?', a: 'No. Las clases de iniciación son técnicas y se realizan con control. El contacto duro es progresivo y siempre opcional. Mucha gente practica muay thai exclusivamente por la técnica y el fitness.' },
      { q: '¿En qué se diferencia el muay thai del kickboxing?', a: 'El muay thai añade codazos, rodillazos y trabajo de clinch (agarre) al repertorio del kickboxing. Es considerado el arte de las ocho extremidades frente a las cuatro del kickboxing.' },
      { q: '¿Se puede aprender muay thai a los 40 años?', a: 'Sí. Es habitual empezar a los 35-45 años y progresar perfectamente: la intensidad se adapta y el muay thai mejora la condición física a cualquier edad.' },
      { q: '¿Qué material necesito para muay thai?', a: 'Guantes (12-16 oz), vendas, espinilleras, protector bucal y coquilla. Para las primeras clases, muchos gimnasios prestan el material básico: pregúntalo antes de invertir.' },
      { q: '¿Cuánto tiempo tarda en verse resultados físicos?', a: 'En 4-6 semanas entrenando dos días por semana notarás mejoras en resistencia y tono. En 3 meses, el cambio es visible para los demás.' },
    ],
  },
  {
    slug: 'jiu-jitsu-brasileno',
    name: 'BJJ',
    nameEs: 'Brazilian Jiu Jitsu',
    emoji: '🤼',
    color: '#1D4ED8',
    shortDesc: 'El arte del suelo. Domina a cualquier rival con técnica, sin fuerza bruta.',
    benefits: ['Defensa en el suelo', 'Resolución de problemas', 'Técnica sobre fuerza', 'Comunidad muy unida'],
    suitable: ['Todos los niveles', 'Adultos', 'Adolescentes'],
    primeraClase: [
      'Calentamiento con desplazamientos de suelo (el famoso "shrimping")',
      'Técnica del día explicada por pasos y practicada en parejas sin resistencia',
      'Repetición con resistencia progresiva para entender cuándo funciona',
      'Rolling suave y opcional al final; nadie te exige "sobrevivir" el primer día',
    ],
    equipacion: [
      'Primeras clases: ropa deportiva sin cremalleras, botones ni bolsillos',
      'Gi (kimono) cuando confirmes; pregunta al centro qué colores admite',
      'Rashguard y pantalón corto sin bolsillos para las clases de no-gi',
      'Protector bucal recomendable para el rolling',
    ],
    faq: [
      { q: '¿El BJJ es efectivo para la autodefensa?', a: 'Es posiblemente el arte marcial más validado en situaciones reales. El 90% de las peleas acaban en el suelo, y el BJJ es el sistema más completo para dominar esa posición.' },
      { q: '¿Necesito estar en forma para empezar BJJ?', a: 'No. El BJJ te pone en forma mientras lo practicas. La técnica permite que alguien más pequeño y menos fuerte controle a un rival mayor. El primer mes es de aprendizaje puro.' },
      { q: '¿Cuánto tiempo lleva conseguir la cinta azul?', a: 'Depende del alumno y la frecuencia de entrenamiento. La media es entre 1 y 2 años entrenando regularmente. No hay exámenes formales: el instructor decide según tu progresión real.' },
      { q: '¿El BJJ incluye golpes?', a: 'El BJJ deportivo no incluye golpes. Se centra en derribos, control y sumisiones (llaves articulares y estrangulamientos). Para el aspecto de golpeo puedes complementar con boxeo o MMA.' },
      { q: '¿Qué significa "rollar" en BJJ?', a: 'Rollar es el término para el sparring en BJJ. Es la práctica libre donde aplicas técnicas contra un compañero que también intenta aplicarlas. Es controlado, con respeto mutuo y siempre supervisado.' },
    ],
  },
  {
    slug: 'judo',
    name: 'Judo',
    nameEs: 'Judo',
    emoji: '🥋',
    color: '#0891B2',
    shortDesc: 'El arte suave del derribo. Usa la fuerza del rival para lanzarle al suelo.',
    benefits: ['Equilibrio y coordinación', 'Fuerza funcional', 'Caídas seguras', 'Valores olímpicos'],
    suitable: ['Niños desde 5 años', 'Adultos', 'Competidores', 'Principiantes'],
    primeraClase: [
      'Saludo (rei) y normas del tatami',
      'Ukemi: aprender a caer sin hacerse daño, la primera y más útil habilidad del judo',
      'Desplazamientos y primera técnica de proyección explicada por pasos (uchikomi)',
      'En niños, juegos de agarre y equilibrio; el randori (combate suave) llega con la base',
    ],
    equipacion: [
      'Primeras clases: ropa deportiva resistente; muchos clubes prestan judogi al inicio',
      'Judogi propio adecuado a tu talla cuando confirmes que sigues',
      'Zoris o chanclas para desplazarte fuera del tatami',
      'No se usan protecciones: la seguridad la da la técnica de caída',
    ],
    faq: [
      { q: '¿Es el judo seguro para los niños?', a: 'Es uno de los deportes más seguros para niños. La primera habilidad que se aprende es caer correctamente (ukemi), lo que evita lesiones dentro y fuera del tatami.' },
      { q: '¿Cuántos grados hay en judo antes del cinturón negro?', a: 'Los grados son: blanco, amarillo, naranja, verde, azul, marrón y negro. Para niños hay un sistema de grading más progresivo con cinturones intermedios.' },
      { q: '¿El judo sirve para la autodefensa?', a: 'Sí. Las técnicas de derribo y control del judo son muy efectivas. Además, la capacidad de caer sin hacerse daño es en sí misma una habilidad de autodefensa.' },
      { q: '¿Qué ropa se usa en judo?', a: 'El judogi (traje de judo). Muchos clubes tienen alguno para préstamo en las primeras sesiones; si continúas, necesitarás uno propio adecuado a tu talla y nivel.' },
      { q: '¿Puedo competir en judo?', a: 'Sí. Hay un circuito activo en Cataluña desde categoría benjamín. La competición siempre es voluntaria: si es tu objetivo, busca un club con experiencia preparando competidores.' },
    ],
  },
  {
    slug: 'taekwondo',
    name: 'Taekwondo',
    nameEs: 'Taekwondo',
    emoji: '🦶',
    color: '#BE185D',
    shortDesc: 'El arte de los pies. Patadas altas, velocidad y precisión. Deporte olímpico.',
    benefits: ['Flexibilidad extrema', 'Velocidad y reflejos', 'Disciplina mental', 'Deporte olímpico federado'],
    suitable: ['Niños desde 4 años', 'Adultos', 'Competidores'],
    primeraClase: [
      'Saludo y normas del dojang',
      'Calentamiento con mucho trabajo de flexibilidad y cadera',
      'Posiciones básicas y primeras patadas sobre paos, por pasos',
      'Según la escuela (WT u ITF), introducción a un poomsae/tul sencillo',
    ],
    equipacion: [
      'Primeras clases: ropa deportiva cómoda',
      'Dobok (uniforme) cuando confirmes; la escuela te orienta con talla y estilo',
      'Protecciones de combate (peto, casco, espinilleras) solo al iniciar el combate; muchas escuelas las prestan',
      'Protector bucal cuando empiece el contacto',
    ],
    faq: [
      { q: '¿El taekwondo es un deporte olímpico?', a: 'Sí, desde los Juegos de Seúl 1988. Es uno de los deportes de combate más practicados del mundo con presencia en más de 200 países.' },
      { q: '¿Qué diferencia hay entre WT e ITF?', a: 'WT (World Taekwondo) es el estilo olímpico, con petos electrónicos y competición de puntos. ITF (International Taekwondo Federation) tiene un enfoque más tradicional con patrones (tul). Pregunta a cada escuela qué estilo imparte antes de apuntarte.' },
      { q: '¿El taekwondo es bueno para la flexibilidad?', a: 'Es uno de los mejores deportes para desarrollar flexibilidad. Las patadas altas requieren y desarrollan una flexibilidad notable, especialmente en cadera y isquiotibiales.' },
      { q: '¿Desde qué edad pueden empezar los niños?', a: 'Desde los 4 años. A estas edades el foco está en coordinación, equilibrio y juego. El taekwondo como disciplina completa se introduce a partir de los 6-7 años.' },
      { q: '¿Cuánto tiempo tarda en obtenerse el cinturón negro?', a: 'Entre 3 y 5 años de entrenamiento regular es la media. El sistema de grados va del blanco al negro, pasando por amarillo, verde, azul y rojo.' },
    ],
  },
  {
    slug: 'defensa-personal',
    name: 'Defensa Personal',
    nameEs: 'Defensa Personal',
    emoji: '🛡️',
    color: '#DC2626',
    shortDesc: 'Técnicas reales para situaciones reales. Sin florituras, sin mitos.',
    benefits: ['Conciencia situacional', 'Técnicas aplicables inmediatamente', 'Confianza en situaciones de riesgo', 'Sin requisitos previos'],
    suitable: ['Mujeres', 'Todos los adultos', 'Adolescentes', 'Principiantes'],
    primeraClase: [
      'Breve parte teórica: prevención, distancia de seguridad y conciencia situacional',
      'Técnica ante las situaciones más comunes: agarres de muñeca, brazo o ropa',
      'Práctica por parejas con presión progresiva y roles alternos',
      'Puesta en común: qué hacer antes, durante y después de un incidente real',
    ],
    equipacion: [
      'Ropa cómoda tipo calle o deportiva: se entrena como vas vestido en tu día a día',
      'Sin material propio al principio; el centro aporta lo necesario para las simulaciones',
      'Protector bucal si el programa incluye trabajo con contacto',
    ],
    faq: [
      { q: '¿Cuánto tiempo se tarda en aprender defensa personal básica?', a: 'Con un curso intensivo de 8 horas tienes las técnicas fundamentales. Con un mes de clases regulares, las tienes interiorizadas. La defensa personal no requiere años de práctica para ser funcional.' },
      { q: '¿Es diferente la defensa personal para mujeres?', a: 'Los buenos programas femeninos abordan las situaciones de riesgo más comunes para mujeres (agresiones por detrás, agarres, situaciones de acoso) con un enfoque distinto al genérico. Si esto es lo que buscas, pregunta específicamente por ello al elegir centro.' },
      { q: '¿Necesito condición física para aprender defensa personal?', a: 'No. La defensa personal efectiva se basa en técnica y posicionamiento, no en fuerza. Una persona de 55 kg puede neutralizar a alguien de 100 kg con la técnica correcta.' },
      { q: '¿En qué artes marciales se basa la buena defensa personal?', a: 'Los programas serios integran técnicas de boxeo, BJJ, judo y krav maga, seleccionadas por efectividad demostrada y no por tradición. Desconfía de sistemas que prometen resultados sin contacto ni presión progresiva.' },
      { q: '¿Hay clases solo de defensa personal o hay que hacer un arte marcial completo?', a: 'Existen cursos específicos de defensa personal que no requieren practicar otro arte marcial. También puedes combinarla con una disciplina de base como boxeo o BJJ para consolidar lo aprendido.' },
    ],
  },
  {
    slug: 'krav-maga',
    name: 'Krav Maga',
    nameEs: 'Krav Maga',
    emoji: '⚔️',
    color: '#374151',
    shortDesc: 'Sistema de combate israelí. Brutalidad técnica para el mundo real.',
    benefits: ['Eficacia máxima en situación real', 'Sin reglas artificiales', 'Adrenalina y autocontrol', 'Técnicas de neutralización rápida'],
    suitable: ['Adultos', 'Deportistas', 'Seguridad privada'],
    primeraClase: [
      'Calentamiento intenso: el krav maga entrena también bajo fatiga',
      'Posición de guardia y golpes directos a puntos vulnerables',
      'Defensa ante un agarre o empujón común, con técnica simple y repetible',
      'Simulación con presión ligera para entender el enfoque del sistema',
    ],
    equipacion: [
      'Primeras clases: ropa deportiva resistente',
      'Coquilla y protector bucal en cuanto empiecen las simulaciones con contacto',
      'Guantillas cuando el programa incluya golpeo por parejas',
    ],
    faq: [
      { q: '¿Qué es el krav maga?', a: 'Es el sistema de combate cuerpo a cuerpo desarrollado por las Fuerzas de Defensa de Israel. A diferencia de las artes marciales deportivas, no tiene reglas: su único objetivo es neutralizar una amenaza de forma rápida y eficaz.' },
      { q: '¿El krav maga es demasiado violento?', a: 'El krav maga es directo y eficaz. En clase se trabaja de forma controlada, con el énfasis en la técnica y en entender las situaciones de riesgo. No es más violento que el MMA como deporte.' },
      { q: '¿Necesito experiencia marcial para empezar krav maga?', a: 'No. El krav maga está diseñado para aprenderse rápido. En pocas semanas tienes técnicas funcionales para situaciones reales.' },
      { q: '¿El krav maga sirve para mujeres?', a: 'Especialmente. Muchas técnicas de krav maga están diseñadas para que personas con menos masa muscular puedan neutralizar amenazas mayores. Es altamente recomendable como complemento de defensa personal femenina.' },
      { q: '¿En qué se diferencia el krav maga de la defensa personal?', a: 'La defensa personal es un paraguas que incluye técnicas de diversas artes marciales. El krav maga es un sistema específico con metodología y certificaciones propias. Ambos enfoques son complementarios.' },
    ],
  },
];

export function getDisciplineBySlug(slug: string): Discipline | undefined {
  return DISCIPLINES.find(d => d.slug === slug);
}

// ────────────────────────────────────────────────────────────────────────────
// Ficha comparativa por disciplina.
//
// Existe para resolver la canibalización que detectó la auditoría del
// 15-08-2026: `/judo/` y `/judo-en-sitges/` compartían el 48 % de su texto,
// porque el hub de disciplina y sus páginas de municipio contaban lo mismo con
// distinto topónimo. La solución no es vaciar las locales, sino darle al hub un
// trabajo que las locales no pueden hacer: comparar las diez disciplinas entre
// sí. Esta tabla solo se renderiza en los hubs.
//
// Todo son rasgos genéricos y verificables de cada disciplina —nada de datos
// de centros, precios ni horarios—, redactados para el criterio de alguien que
// aún no sabe cuál elegir.
// ────────────────────────────────────────────────────────────────────────────
export interface PerfilComparativo {
  /** Qué se hace, en una línea */
  enfoque: string;
  /** Contacto real en los grupos de iniciación */
  contacto: 'Bajo' | 'Medio' | 'Alto';
  /** Edad a la que suele haber grupo de entrada */
  edad: string;
  /** Lo primero que hay que comprar, si hay que comprar algo */
  equipacion: string;
  /** Papel de la competición en la práctica habitual */
  competicion: string;
}

export const PERFIL_COMPARATIVO: Record<string, PerfilComparativo> = {
  'boxeo': {
    enfoque: 'Solo puños: distancia, defensa y juego de piernas',
    contacto: 'Bajo',
    edad: 'Desde 8-10 años; grupos adultos de iniciación todo el año',
    equipacion: 'Vendas primero; guantes propios si continúas',
    competicion: 'Opcional. La mayoría entrena sin competir nunca',
  },
  'kickboxing': {
    enfoque: 'Puños y patadas, con más variedad técnica que el boxeo',
    contacto: 'Bajo',
    edad: 'Desde 8-10 años; muy habitual empezar de adulto',
    equipacion: 'Vendas, guantes y espinilleras cuando haya parejas',
    competicion: 'Opcional. Hay circuito amateur si se busca',
  },
  'muay-thai': {
    enfoque: 'Ocho superficies: puños, patadas, codos, rodillas y clinch',
    contacto: 'Medio',
    edad: 'Desde 10-12 años; exigente físicamente desde el principio',
    equipacion: 'Vendas, guantes, espinilleras y bucal',
    competicion: 'Opcional, aunque la cultura del gimnasio la valora',
  },
  'mma': {
    enfoque: 'Combina golpeo, lucha y suelo en un mismo formato',
    contacto: 'Medio',
    edad: 'Desde 14-16 años; suele pedir base previa o grupo específico',
    equipacion: 'Guantillas, bucal y rashguard',
    competicion: 'Presente en la cultura del deporte, pero no obligatoria',
  },
  'jiu-jitsu-brasileno': {
    enfoque: 'Suelo y sumisiones: control, palancas y estrangulaciones',
    contacto: 'Medio',
    edad: 'Desde 4-6 años en grupos infantiles; entrada de adulto muy común',
    equipacion: 'Kimono (gi); rashguard si el grupo entrena sin gi',
    competicion: 'Circuito muy activo, pero participar es decisión tuya',
  },
  'judo': {
    enfoque: 'Proyecciones y control en el suelo, con reglamento olímpico',
    contacto: 'Bajo',
    edad: 'Desde 4-5 años; es de las puertas de entrada infantiles clásicas',
    equipacion: 'Judogi. Nada más para empezar',
    competicion: 'Federada y estructurada; en infantil es opcional',
  },
  'karate': {
    enfoque: 'Golpeo con técnica formal, kata y combate controlado',
    contacto: 'Bajo',
    edad: 'Desde 4-5 años; la entrada infantil más extendida',
    equipacion: 'Karategi; protecciones cuando llega el combate',
    competicion: 'Opcional, con circuito federado si interesa',
  },
  'taekwondo': {
    enfoque: 'Piernas y velocidad: patadas altas, agilidad y formas',
    contacto: 'Bajo',
    edad: 'Desde 4-5 años; muy rodado en grupos infantiles',
    equipacion: 'Dobok; peto y casco al empezar el combate',
    competicion: 'Deporte olímpico con circuito claro; participar es opcional',
  },
  'defensa-personal': {
    enfoque: 'Prevención, distancia y respuesta a agresiones reales',
    contacto: 'Bajo',
    edad: 'Adultos y adolescentes; hay programas específicos para mujeres',
    equipacion: 'Ropa deportiva; el material lo pone el centro',
    competicion: 'No compite: no es un deporte reglado',
  },
  'krav-maga': {
    enfoque: 'Sistema sin reglas orientado a neutralizar una amenaza',
    contacto: 'Medio',
    edad: 'Adultos, sobre todo; algunos centros tienen grupo juvenil',
    equipacion: 'Ropa resistente; coquilla y bucal en las simulaciones',
    competicion: 'No compite: su marco es la certificación, no el podio',
  },
};

// Las tres disciplinas con las que de verdad se duda al elegir esta. Se usan
// para que cada hub muestre una comparativa distinta (ver TablaComparativa).
export const ALTERNATIVAS: Record<string, string[]> = {
  'boxeo': ['kickboxing', 'muay-thai', 'mma'],
  'kickboxing': ['boxeo', 'muay-thai', 'taekwondo'],
  'muay-thai': ['kickboxing', 'boxeo', 'mma'],
  'mma': ['jiu-jitsu-brasileno', 'muay-thai', 'boxeo'],
  'jiu-jitsu-brasileno': ['judo', 'mma', 'defensa-personal'],
  'judo': ['jiu-jitsu-brasileno', 'karate', 'taekwondo'],
  'karate': ['taekwondo', 'judo', 'kickboxing'],
  'taekwondo': ['karate', 'kickboxing', 'judo'],
  'defensa-personal': ['krav-maga', 'jiu-jitsu-brasileno', 'boxeo'],
  'krav-maga': ['defensa-personal', 'mma', 'muay-thai'],
};
