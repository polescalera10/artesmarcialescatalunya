// ────────────────────────────────────────────────────────────────────────────
// Cuerpos de contenido local (HTML) para hubs de municipio y páginas de perfil.
//
// Motivo: la auditoría SEO de 2026-08-14 detectó 187 pares de páginas con ≥50 %
// de solapamiento de texto. Estas páginas compartían plantilla y solo cambiaban
// el topónimo, que es el patrón que el Helpful Content System penaliza como
// doorway page. Aquí vive lo que hace única a cada página.
//
// Reglas, las mismas que en todo el sitio:
//   · Cero datos de negocio inventados (horarios, precios, instructores, reseñas).
//   · Cuando se habla de la oferta real de un municipio, la única fuente válida
//     es el directorio de src/data/centros.ts, que sí tiene fuente y fecha por
//     ficha. Si el directorio no lo recoge, aquí se dice que no consta.
//   · Los datos geográficos (carreteras, tiempos aproximados en coche) son
//     verificables en cualquier mapa y ya se usaban en el sitio.
// ────────────────────────────────────────────────────────────────────────────

/** Cuerpo largo de los hubs de municipio (/sitges/, /cubelles/, …). */
export const MUNICIPIO_BODIES: Record<string, string> = {
  'sitges': `
<h2>Qué se puede entrenar de verdad en Sitges</h2>
<p>Conviene separar lo que se anuncia de lo que consta. En nuestro <a href="/centros/">directorio de centros del Garraf</a>, Sitges aparece con tres centros con presencia pública verificable, y entre los tres cubren un abanico concreto: <a href="/kickboxing-en-sitges/">kickboxing</a>, <a href="/jiu-jitsu-brasileno-en-sitges/">jiu jitsu brasileño</a>, <a href="/karate-en-sitges/">karate</a>, <a href="/mma-en-sitges/">MMA</a>, <a href="/boxeo-en-sitges/">boxeo</a> y <a href="/defensa-personal-en-sitges/">defensa personal</a>. También aparecen actividades afines como el grappling, el K-1 y los grupos infantiles.</p>
<p>Lo que <strong>no</strong> nos consta en Sitges, a fecha de la última verificación, es oferta de <a href="/judo-en-sitges/">judo</a>, <a href="/taekwondo-en-sitges/">taekwondo</a>, <a href="/muay-thai-en-sitges/">muay thai</a> o <a href="/krav-maga-en-sitges/">krav maga</a> con fuente pública comprobable. Eso no significa que no exista (puede haber actividad en clubes, entidades o centros cívicos sin web), significa que nosotros no la hemos podido verificar y por eso no la publicamos como si estuviera confirmada. Para judo y taekwondo lo lógico es mirar hacia <a href="/vilanova-i-la-geltru/">Vilanova i la Geltrú</a>; el único krav maga verificado de la comarca está en <a href="/cubelles/">Cubelles</a>.</p>

<h2>Sitges tiene un problema de calendario que otros municipios no tienen</h2>
<p>Es el municipio más estacional de la comarca. Buena parte de su población es flotante o internacional, y eso se nota en las condiciones de contratación de las actividades deportivas: hay centros que trabajan con bonos y mensualidades sin permanencia porque saben que su público entra y sale. Si vas a estar unos meses, pregunta explícitamente por esa fórmula antes de firmar nada; si vives todo el año, pregunta lo contrario, porque las tarifas pensadas para estancias cortas suelen salir caras a largo plazo.</p>
<p>El segundo efecto del calendario es la ocupación: entre junio y septiembre el municipio se llena y en algunos grupos cuesta más encontrar plaza y aparcamiento cerca. Si tienes flexibilidad, las franjas de mañana y primera hora de tarde suelen estar menos saturadas que la franja de 19 a 21 h.</p>

<h2>Cuándo apuntarse</h2>
<p>El grueso de las altas del año se produce en septiembre, cuando arrancan las actividades de temporada y los grupos infantiles se forman por edades. Si tu hijo o hija va a empezar, esa es la ventana natural: entrar en octubre o noviembre significa incorporarse a un grupo ya rodado. Para adultos da bastante más igual, aunque enero y septiembre son los dos momentos en los que más grupos de iniciación se abren.</p>

<h2>Desplazarse desde Sitges</h2>
<p>Vilanova i la Geltrú está a unos 10-15 minutos en coche por la C-31 y a pocos minutos en tren por la línea de Rodalies que recorre la costa. Para dos entrenamientos semanales es una distancia perfectamente asumible, y multiplica las opciones disponibles: en el directorio, Vilanova reúne más del doble de centros que Sitges. Si el desplazamiento es con niños, ten en cuenta que el factor decisivo no es la distancia sino el horario: un grupo infantil a las 17:30 en Vilanova es incompatible con salir del colegio en Sitges a las 17:00.</p>

<h2>Antes de decidir</h2>
<p>Si aún no tienes claro qué disciplina encaja contigo o con tu hijo, empieza por la <a href="/iniciacion/">guía de iniciación</a>, que ordena las opciones por objetivo en lugar de por nombre. Y si prefieres que te orientemos directamente, <a href="/contacto/">escríbenos</a> contando qué buscas, para quién y en qué franja horaria: te respondemos sin coste y sin intermediar en tu alta.</p>
`,

  'vilanova-i-la-geltru': `
<h2>Por qué Vilanova concentra la oferta de la comarca</h2>
<p>Vilanova i la Geltrú es la capital del Garraf y el municipio más poblado, y eso tiene una traducción práctica: en nuestro <a href="/centros/">directorio</a> es el municipio con más centros verificados de toda la comarca, siete, frente a los cuatro de <a href="/sant-pere-de-ribes/">Sant Pere de Ribes</a> (todos de taekwondo) y los tres de <a href="/sitges/">Sitges</a>. Más centros significan más grupos, más franjas horarias y, lo más importante para quien empieza, más probabilidad de encontrar un grupo de iniciación de verdad en lugar de tener que colarse en uno mixto.</p>

<h2>Qué disciplinas cubre realmente Vilanova</h2>
<p>El abanico verificado es el más amplio de la comarca. Consta oferta de <a href="/boxeo-en-vilanova-i-la-geltru/">boxeo</a>, <a href="/kickboxing-en-vilanova-i-la-geltru/">kickboxing</a>, <a href="/mma-en-vilanova-i-la-geltru/">MMA</a>, <a href="/jiu-jitsu-brasileno-en-vilanova-i-la-geltru/">jiu jitsu brasileño</a>, <a href="/karate-en-vilanova-i-la-geltru/">karate</a>, <a href="/judo-en-vilanova-i-la-geltru/">judo</a>, <a href="/taekwondo-en-vilanova-i-la-geltru/">taekwondo</a> y <a href="/defensa-personal-en-vilanova-i-la-geltru/">defensa personal</a>.</p>
<p>Vilanova es además el único municipio del Garraf donde nos constan disciplinas que no tienen guía propia en esta web porque su presencia es minoritaria: aikido, wu shu y taijitsu en una de las escuelas de judo, karate kyokushin y K-1 en otro centro, y grappling y cross training en un tercero. Si buscas específicamente alguna de estas, el directorio es el sitio donde mirar, y conviene que llames antes: son actividades que se abren y se cierran según haya grupo.</p>
<p>La excepción destacable es el <a href="/krav-maga-en-vilanova-i-la-geltru/">krav maga</a>: es de las disciplinas más buscadas de la comarca y no nos consta ningún centro con fuente pública verificable que lo imparta en Vilanova. El único que lo anuncia en todo el Garraf está en <a href="/cubelles/">Cubelles</a>, a unos diez minutos por la C-31.</p>

<h2>Cómo aprovechar tener tanta oferta cerca</h2>
<p>Cuando hay muchos centros a mano, el error típico es elegir el más cercano y quedarse ahí. Merece más la pena hacer lo siguiente: quédate con dos o tres candidatos de tu disciplina, pide clase de prueba en todos, y ve a la misma franja horaria en la que entrenarías de verdad. Un martes a las 20 h y un sábado a las 10 h son gimnasios distintos aunque compartan dirección: cambia el grupo, el nivel y hasta el entrenador que imparte.</p>
<p>La segunda ventaja de Vilanova es que puedes combinar. Hay quien entrena una disciplina de golpeo dos días y una de suelo un tercer día, y varios centros del municipio cubren ambas cosas bajo el mismo techo. Si esa es tu idea, dilo en la primera visita y pregunta si hay cuota conjunta.</p>

<h2>Vilanova como destino de los municipios vecinos</h2>
<p>Si vives en <a href="/cubelles/">Cubelles</a>, <a href="/canyelles/">Canyelles</a> o <a href="/sant-pere-de-ribes/">Sant Pere de Ribes</a>, Vilanova es casi siempre la respuesta: está a menos de 10 minutos por la C-31 desde Cubelles, a unos 15 por la C-15 desde Canyelles y a 10-15 desde los núcleos de Ribes y Les Roquetes. Para dos sesiones semanales, esos trayectos son perfectamente sostenibles. Para tres o más, empieza a pesar: valóralo antes de comprometerte con una cuota anual.</p>

<h2>Por dónde empezar</h2>
<p>Si tienes claro qué quieres entrenar, ve directo a la guía de la disciplina desde el listado de arriba. Si no lo tienes claro, la <a href="/iniciacion/">guía de iniciación</a> ordena las opciones por objetivo (forma física, autodefensa, técnica, actividad para niños) en lugar de por nombre. Y si prefieres preguntar, <a href="/contacto/">escríbenos</a>: te orientamos sin coste.</p>
`,

  'sant-pere-de-ribes': `
<h2>La situación real de Sant Pere de Ribes</h2>
<p>Conviene decirlo sin rodeos: en nuestro <a href="/centros/">directorio de centros del Garraf</a>, Sant Pere de Ribes aparece con cuatro centros con fuente pública verificable, y los cuatro enseñan <a href="/taekwondo-en-sant-pere-de-ribes/">taekwondo</a>. Es el municipio con más clubs de esa disciplina de toda la comarca. Uno de ellos, Spartae, añade <a href="/defensa-personal-en-sant-pere-de-ribes/">defensa personal</a> y estilos poco habituales en el Garraf: Jeet Kune Do, kali filipino y wing chun.</p>
<p>Si lo que buscas es taekwondo, para ti o para tus hijos, estás en uno de los mejores sitios de la comarca y no necesitas moverte. Si buscas defensa personal, también tienes opción en el municipio. Si buscas <a href="/boxeo-en-sant-pere-de-ribes/">boxeo</a>, <a href="/karate-en-sant-pere-de-ribes/">karate</a>, <a href="/muay-thai-en-sant-pere-de-ribes/">muay thai</a> o cualquier disciplina de suelo, la respuesta honesta es que tendrás que desplazarte.</p>

<h2>Un municipio con dos núcleos, y eso cambia el cálculo</h2>
<p>Sant Pere de Ribes no es un núcleo compacto: Ribes y Les Roquetes están separados, y a efectos prácticos no es lo mismo salir de uno que del otro. Desde Les Roquetes, Sitges queda muy a mano; desde Ribes, la salida hacia Vilanova i la Geltrú es igual de cómoda. Antes de descartar un centro por lejano, mira la distancia desde tu núcleo concreto y no desde "Sant Pere de Ribes" como punto genérico en el mapa: la diferencia puede ser de cinco o seis minutos, que es exactamente lo que decide si un horario de 18:00 es viable o no.</p>
<p>En coche, tanto <a href="/sitges/">Sitges</a> como <a href="/vilanova-i-la-geltru/">Vilanova</a> están a 10-15 minutos. Vilanova concentra más oferta (siete centros verificados frente a tres), pero Sitges puede quedarte más cerca según el núcleo. Merece la pena comparar las dos antes de decidir.</p>

<h2>Antes de descartar la opción municipal</h2>
<p>Este directorio recoge centros con presencia pública verificable: web propia, registro federativo o directorio municipal de entidades. Hay actividad deportiva que no deja ese rastro (secciones de clubes, actividades de temporada en equipamientos municipales, grupos de entidades vecinales) y que puede existir perfectamente en Ribes o Les Roquetes sin que nosotros podamos confirmarla.</p>
<p>Por eso, si te importa entrenar en el municipio, vale la pena que preguntes directamente en el servicio de deportes del ayuntamiento o mires la programación de actividades de temporada antes de asumir que no hay nada. Y si encuentras algo que no está en nuestro directorio, <a href="/contacto/">dínoslo</a>: lo verificamos y lo añadimos.</p>

<h2>Cómo organizar el desplazamiento si hay niños de por medio</h2>
<p>Con adultos, desplazarse 12 minutos dos veces por semana no es problema. Con niños, el cuello de botella nunca es la distancia: es el encaje entre la salida del colegio y la hora del grupo infantil. Antes de enamorarte de un centro, pide el horario completo de los grupos por edad y haz el cálculo real con tráfico de tarde. Si no cuadra, es mejor un taekwondo en el municipio que un karate excelente al que llegaréis tarde y con prisas cada martes.</p>
<p>Si tienes dudas sobre qué disciplina encaja con tu hijo o hija, la <a href="/clases-para-ninos/">guía de artes marciales para niños del Garraf</a> las compara por edad y carácter.</p>
`,

  'cubelles': `
<h2>Qué hay en Cubelles y qué no</h2>
<p>En nuestro <a href="/centros/">directorio del Garraf</a>, Cubelles aparece con dos centros con fuente pública verificable. Los dos enseñan <a href="/taekwondo-en-cubelles/">taekwondo</a>, y uno de ellos, GYM FYS Fitness &amp; Defense, anuncia además <a href="/boxeo-en-cubelles/">boxeo</a>, MMA y <a href="/krav-maga/">krav maga</a>. Es el único centro de toda la comarca con krav maga en su oferta pública, un dato que sorprende a quien lo busca en Vilanova o en Sitges.</p>
<p>Lo que no nos consta dentro del municipio es un programa específico de <a href="/defensa-personal-en-cubelles/">defensa personal</a> ni disciplinas de suelo como el jiu-jitsu brasileño o el judo. Para eso tu centro estará en <a href="/vilanova-i-la-geltru/">Vilanova i la Geltrú</a>.</p>

<h2>¿Jiu-jitsu en Cubelles? Lo más cercano está a diez minutos</h2>
<p>Es, con diferencia, lo que más gente busca sobre Cubelles en esta guía, así que va la respuesta directa: <strong>ningún centro de Cubelles anuncia jiu-jitsu brasileño</strong> en su fuente pública a fecha de nuestra última verificación. Ni los dos del municipio ni ningún otro que hayamos podido comprobar.</p>
<p>Los tres más cercanos están en Vilanova i la Geltrú, a unos diez minutos por la C-31: Aranha VNG, Senshi No Michi y Zen Garraf, por orden alfabético. Los tres anuncian jiu-jitsu brasileño y cada uno lo combina con otras disciplinas; tienes qué ofrece cada uno, con su fuente, en la guía de <a href="/jiu-jitsu-brasileno-en-vilanova-i-la-geltru/">jiu-jitsu brasileño en Vilanova</a>. Si lo que te atrae es el trabajo de suelo pero te da igual el nombre, el MMA que se ofrece dentro de Cubelles incluye agarre y lucha, aunque no es lo mismo que una clase de jiu-jitsu con kimono: pregunta en la clase de prueba cuánto tiempo se dedica al suelo.</p>
<p>Si has visto jiu-jitsu anunciado en algún centro de Cubelles en un listado de internet y no lo encuentras aquí, es porque su propia web no lo menciona. <a href="/contacto/">Escríbenos</a> con el dato y lo verificamos.</p>

<h2>Vilanova está más cerca de lo que la gente cree</h2>
<p>Cubelles y Vilanova son municipios contiguos: por la C-31 el trayecto ronda los 10 minutos, y la línea de tren de la costa conecta ambos núcleos. En la práctica, un vecino de Cubelles tiene acceso a los siete centros verificados de Vilanova con un desplazamiento menor que el que hace mucha gente dentro de una ciudad grande para ir al gimnasio.</p>
<p>El matiz importante es el horario de vuelta, no el de ida. Salir de Cubelles a las 19:30 es fácil; volver de Vilanova a las 21:30 un martes de invierno se hace más cuesta arriba de lo que parece en septiembre, cuando uno se apunta con toda la motivación. Sé realista con la franja que eliges: la mayoría de abandonos en artes marciales no son por la disciplina, son por el horario.</p>

<h2>La otra dirección: Cunit y Calafell</h2>
<p>Cubelles está en el límite de la comarca, y hacia el suroeste tiene Cunit y Calafell, ya en el Baix Penedès, a pocos minutos. Nuestro directorio cubre únicamente los seis municipios del Garraf, así que esa oferta no está verificada aquí, pero si vives en la parte oeste del municipio puede quedarte igual de cerca o más que Vilanova. Vale la pena mirarla antes de decidir.</p>

<h2>Si es para tus hijos</h2>
<p>Con niños, la existencia de dos clubs de taekwondo dentro del municipio pesa mucho más de lo que parece sobre el papel. Un grupo infantil a diez minutos de casa se sostiene durante años; uno a veinticinco minutos con dos transbordos de coche se abandona en enero. Si tu hijo o hija no tiene una preferencia clara por otra disciplina, empezar por lo que hay cerca es casi siempre la decisión correcta, y siempre se puede cambiar más adelante.</p>
<p>Para comparar disciplinas por edad y carácter, tienes la <a href="/clases-para-ninos/">guía de artes marciales para niños del Garraf</a>. Y si quieres que te ayudemos a decidir, <a href="/contacto/">escríbenos</a>: te orientamos sin coste.</p>
`,

  'olivella': `
<h2>Qué hay en Olivella</h2>
<p>En nuestro <a href="/centros/">directorio de centros del Garraf</a>, Olivella aparece con una entidad: la Associació Esportiva Taekwondo Olivella, que consta en el directorio municipal de entidades deportivas del Ayuntamiento. Esa ficha da el nombre y la disciplina y nada más: ni dirección, ni horarios, ni web. No publicamos lo que no consta, así que si te interesa, el camino corto es preguntar en el propio ayuntamiento, que es quien la tiene registrada.</p>
<p>Para cualquier otra disciplina, entrenar viviendo en Olivella significa salir del municipio. No es un defecto de la guía: es la realidad de un término grande, con la población repartida entre el núcleo antiguo y urbanizaciones separadas entre sí.</p>

<h2>Hacia dónde mirar según dónde vivas</h2>
<p>En Olivella la pregunta útil no es "qué hay cerca de Olivella" sino "qué hay cerca de mi urbanización", porque de una punta a otra del término cambia bastante qué municipio te queda a mano.</p>
<ul>
<li><strong><a href="/sant-pere-de-ribes/">Sant Pere de Ribes</a></strong> suele ser lo más cercano desde buena parte del municipio. Tiene cuatro centros verificados, todos con taekwondo, y uno de ellos añade defensa personal y estilos poco habituales en la comarca.</li>
<li><strong><a href="/sitges/">Sitges</a></strong> tiene tres centros con kickboxing, jiu-jitsu brasileño, karate, MMA y defensa personal. Si trabajas en Barcelona y vuelves por la C-32, puede quedarte de camino.</li>
<li><strong><a href="/vilanova-i-la-geltru/">Vilanova i la Geltrú</a></strong> es la que más oferta concentra: siete centros y casi todas las disciplinas de la comarca, incluido el único <a href="/judo/">judo</a> verificado. Queda algo más lejos, pero si buscas algo concreto, es donde más probabilidades hay de encontrarlo.</li>
</ul>

<h2>El trayecto decide más que la disciplina</h2>
<p>Desde un municipio del interior, lo que suele hacer que alguien deje de entrenar no es la clase: es el coche. Diez o quince minutos de ida parecen poco en septiembre y pesan en enero, sobre todo de vuelta y de noche. Antes de apuntarte, haz el trayecto a la hora real de la clase un día laborable, y si es para un niño, cuenta que son dos viajes por sesión para quien le lleva.</p>
<p>Si en tu urbanización hay más familias con críos de la misma edad, organizar el coche entre dos o tres casas cambia por completo la sostenibilidad del plan. Pregunta en el centro si ya tienen alumnos de Olivella: casi siempre los hay.</p>

<h2>Si aún no sabes qué disciplina</h2>
<p>La <a href="/iniciacion/">guía de iniciación</a> las compara por objetivo, y la de <a href="/clases-para-ninos/">artes marciales para niños</a> por edad y carácter. Con la disciplina elegida, el <a href="/centros/">directorio</a> te dice en qué municipio está cada una.</p>
`,

  'canyelles': `
<h2>Canyelles: sin oferta local verificable, y conviene saberlo antes</h2>
<p>Somos una guía, no una agencia de publicidad, así que empezamos por el dato incómodo: en nuestro <a href="/centros/">directorio de centros del Garraf</a>, Canyelles es el único municipio de la comarca sin ningún centro de artes marciales con fuente pública verificable. Entrenar aquí significa, hoy por hoy, desplazarse. Si lo que buscas es taekwondo, el más cercano puede estar en la vecina <a href="/olivella/">Olivella</a>, que tiene un club en su directorio municipal.</p>
<p>Como en el resto de municipios pequeños, puede existir actividad que no deja rastro público (grupos de temporada, actividades de entidades locales) y que no podemos confirmar. Si conoces alguna, <a href="/contacto/">avísanos</a> y la verificamos.</p>

<h2>Vilanova, a un cuarto de hora por la C-15</h2>
<p>La referencia natural es <a href="/vilanova-i-la-geltru/">Vilanova i la Geltrú</a>: unos 15 minutos por la C-15 y siete centros verificados que cubren prácticamente todas las disciplinas de la comarca, desde <a href="/boxeo-en-vilanova-i-la-geltru/">boxeo</a> y <a href="/kickboxing-en-vilanova-i-la-geltru/">kickboxing</a> hasta <a href="/judo-en-vilanova-i-la-geltru/">judo</a>, <a href="/karate-en-vilanova-i-la-geltru/">karate</a> o <a href="/jiu-jitsu-brasileno-en-vilanova-i-la-geltru/">jiu jitsu brasileño</a>. <a href="/sitges/">Sitges</a> queda algo más lejos y con menos oferta, así que salvo motivo concreto, Vilanova gana casi siempre desde Canyelles.</p>

<h2>Cómo hacer que un desplazamiento de 15 minutos dure más de tres meses</h2>
<p>Este es el problema real de vivir en un municipio del interior, y merece la pena afrontarlo antes de pagar una cuota, no después:</p>
<ul>
<li><strong>Elige dos días, no tres.</strong> Con dos sesiones semanales se progresa perfectamente. Tres implica un tercer trayecto que es justo el que se cae cuando llega el mal tiempo o una semana complicada.</li>
<li><strong>Prioriza el horario por encima del centro.</strong> Un centro correcto en una franja que te encaja vence a un centro excelente en una franja imposible. Siempre.</li>
<li><strong>Busca a alguien del pueblo que vaya al mismo sitio.</strong> Compartir coche es el mejor sistema antiabandono que existe, y en un municipio pequeño es más fácil de lo que parece: pregunta en el propio centro si tienen alumnos de Canyelles.</li>
<li><strong>Si es para un niño, cuenta el trayecto como parte de la actividad.</strong> Media hora ida y vuelta, dos veces por semana, es una hora semanal de coche familiar. Con eso sobre la mesa la decisión se toma mejor.</li>
</ul>

<h2>Antes de decidir</h2>
<p>Si aún no sabes qué disciplina buscas, la <a href="/iniciacion/">guía de iniciación</a> las ordena por objetivo. Y si prefieres que te ayudemos a encontrar algo compatible con vivir en Canyelles (horarios, distancias y qué centros suelen tener alumnos de la zona), <a href="/contacto/">escríbenos</a> y te orientamos sin coste.</p>
`,
};

/** FAQ propias del hub de cada municipio, además de las genéricas. */
export const MUNICIPIO_FAQS: Record<string, { q: string; a: string }[]> = {
  'sitges': [
    { q: '¿Puedo entrenar en Sitges si solo estoy unos meses al año?', a: 'Sí, y es una situación habitual en el municipio por su población estacional. Algunos centros trabajan con bonos o mensualidades sin permanencia justamente por eso. Pregúntalo antes de apuntarte: la fórmula de estancia corta y la de residente tienen condiciones distintas.' },
    { q: '¿Qué disciplinas no encontraré fácilmente en Sitges?', a: 'A fecha de la última verificación de nuestro directorio, en Sitges no nos consta oferta pública comprobable de judo, taekwondo, muay thai ni krav maga. Para judo y taekwondo, la opción realista es Vilanova i la Geltrú, a 10-15 minutos; el krav maga solo consta en un centro de Cubelles y el muay thai en ninguno de la comarca.' },
    { q: '¿Merece la pena desplazarse de Sitges a Vilanova para entrenar?', a: 'Para dos sesiones semanales, sí: son 10-15 minutos en coche y Vilanova reúne más del doble de centros verificados. Con niños el factor decisivo no es la distancia sino el encaje entre la salida del colegio y el horario del grupo infantil.' },
  ],
  'vilanova-i-la-geltru': [
    { q: '¿Por qué hay más oferta en Vilanova que en el resto del Garraf?', a: 'Porque es la capital de la comarca y el municipio más poblado. En nuestro directorio reúne siete centros con fuente pública verificable, frente a cuatro en Sant Pere de Ribes (todos de taekwondo), tres en Sitges y dos en Cubelles.' },
    { q: '¿Puedo entrenar dos disciplinas distintas en Vilanova?', a: 'Es la única localidad de la comarca donde resulta fácil: varios de los centros verificados combinan disciplinas de golpeo y de suelo bajo el mismo techo. Si es tu plan, dilo en la primera visita y pregunta si existe cuota conjunta.' },
    { q: '¿Hay krav maga en Vilanova i la Geltrú?', a: 'No nos consta ningún centro con fuente pública verificable que lo imparta en el municipio, pese a ser una de las disciplinas más buscadas de la comarca. El único centro del Garraf que lo anuncia está en Cubelles, a unos diez minutos por la C-31. Si conoces alguno en Vilanova, escríbenos y lo verificamos.' },
  ],
  'sant-pere-de-ribes': [
    { q: '¿Qué artes marciales se pueden practicar en Sant Pere de Ribes?', a: 'En nuestro directorio, el municipio aparece con cuatro centros verificados y los cuatro enseñan taekwondo. Uno de ellos, Spartae, añade defensa personal, Jeet Kune Do, kali filipino y wing chun. Para el resto de disciplinas, lo habitual es desplazarse a Sitges o Vilanova i la Geltrú, a 10-15 minutos en coche.' },
    { q: '¿Es lo mismo salir desde Ribes que desde Les Roquetes?', a: 'No, y conviene tenerlo en cuenta: son dos núcleos separados y la diferencia hasta Sitges o Vilanova puede ser de cinco o seis minutos. Calcula la distancia desde tu núcleo concreto, no desde el municipio como punto genérico.' },
    { q: '¿Puede haber clases en el municipio que no aparezcan en el directorio?', a: 'Sí. Solo publicamos centros con presencia pública verificable (web propia, registro federativo o directorio municipal). Actividades de temporada o secciones de entidades locales pueden existir sin dejar ese rastro: consulta también la programación deportiva municipal.' },
  ],
  'cubelles': [
    { q: '¿Hay artes marciales en Cubelles?', a: 'Sí. En nuestro directorio constan dos centros con fuente pública verificable. Los dos enseñan taekwondo y uno de ellos, GYM FYS Fitness & Defense, anuncia además boxeo, MMA y krav maga. Para disciplinas de suelo, como el jiu-jitsu brasileño o el judo, la referencia es Vilanova i la Geltrú, municipio contiguo, a unos 10 minutos por la C-31.' },
    { q: '¿Hay jiu-jitsu brasileño en Cubelles?', a: 'Ningún centro de Cubelles lo anuncia en su fuente pública a fecha de nuestra última verificación. Los tres más cercanos están en Vilanova i la Geltrú, a unos diez minutos por la C-31: Aranha VNG, Senshi No Michi y Zen Garraf.' },
    { q: '¿Cubelles o Cunit y Calafell?', a: 'Depende de en qué parte del municipio vivas. Cubelles limita con el Baix Penedès y, desde la zona oeste, Cunit puede quedar tan cerca como Vilanova. Nuestro directorio cubre solo los seis municipios del Garraf, así que esa oferta no está verificada aquí.' },
    { q: '¿Vale la pena apuntar a un niño en Vilanova viviendo en Cubelles?', a: 'Se sostiene bien con dos sesiones semanales, pero si tu hijo no tiene preferencia clara por una disciplina concreta, empezar por lo que hay dentro del municipio suele funcionar mejor a largo plazo: la cercanía es el mejor antídoto contra el abandono.' },
  ],
  'olivella': [
    { q: '¿Hay artes marciales en Olivella?', a: 'En el directorio municipal de entidades deportivas consta la Associació Esportiva Taekwondo Olivella. Su ficha no da dirección ni horarios, así que para esos datos lo más directo es preguntar en el Ayuntamiento. Para otras disciplinas hay que desplazarse a Sant Pere de Ribes, Sitges o Vilanova i la Geltrú.' },
    { q: '¿Qué municipio me queda mejor desde Olivella para entrenar?', a: 'Depende de la urbanización. Sant Pere de Ribes suele ser lo más cercano y tiene cuatro centros de taekwondo; Sitges tiene más variedad de golpeo y jiu-jitsu; Vilanova i la Geltrú reúne siete centros y casi todas las disciplinas. Haz el trayecto a la hora real de la clase antes de decidir.' },
    { q: '¿Hay judo o jiu-jitsu cerca de Olivella?', a: 'El único judo verificado de la comarca está en Vilanova i la Geltrú. Jiu-jitsu brasileño consta en Sitges y en Vilanova. Ninguno de los dos en Olivella ni en Sant Pere de Ribes.' },
  ],
  'canyelles': [
    { q: '¿Hay algún centro de artes marciales en Canyelles?', a: 'A fecha de la última verificación, Canyelles es el único municipio del Garraf sin ningún centro con fuente pública comprobable en nuestro directorio. Entrenar implica desplazarse, normalmente a Vilanova i la Geltrú.' },
    { q: '¿Cuánto se tarda de Canyelles a Vilanova i la Geltrú?', a: 'Alrededor de 15 minutos en coche por la C-15. Es la referencia natural del municipio: reúne siete centros verificados y cubre prácticamente todas las disciplinas de la comarca.' },
    { q: '¿Cómo evito abandonar si tengo que desplazarme cada semana?', a: 'Tres cosas funcionan: elegir dos días en lugar de tres, priorizar el horario por encima del centro, y buscar a alguien de la zona que vaya al mismo sitio para compartir coche. Pregunta en el propio centro si tienen alumnos de Canyelles.' },
  ],
};

/** Cuerpo de las páginas de perfil por municipio y de karate infantil. */
export const PERFIL_BODIES: Record<string, string> = {
  'clases-para-ninos': `
<h2>Las tres puertas de entrada, y dónde están en el Garraf</h2>
<p>Karate, judo y taekwondo son las disciplinas con más metodología rodada para edades tempranas, y no están repartidas por igual en la comarca. Según nuestro <a href="/centros/">directorio de centros verificados</a>, <a href="/vilanova-i-la-geltru/">Vilanova i la Geltrú</a> es el único municipio donde constan las tres a la vez. En <a href="/sitges/">Sitges</a> consta karate pero no judo ni taekwondo. En <a href="/sant-pere-de-ribes/">Sant Pere de Ribes</a> y <a href="/cubelles/">Cubelles</a>, de esas tres, solo consta taekwondo, eso sí, en todos sus centros. En <a href="/canyelles/">Canyelles</a> no consta ningún centro.</p>
<p>Ese mapa condiciona la decisión más de lo que a nadie le gustaría admitir: si vives en Cubelles, la elección real no es entre tres disciplinas, es entre el taekwondo de tu pueblo y desplazarte a Vilanova.</p>

<h2>Cómo elegir mirando a tu hijo, no a la disciplina</h2>
<ul>
<li><strong>Niño disperso, que necesita marco:</strong> karate. Es el más estructurado: etiqueta, formas y progresión pautada.</li>
<li><strong>Niño muy físico, que necesita descargar:</strong> judo. Contacto y caídas desde el primer día, muchísima actividad por sesión.</li>
<li><strong>Niño con mucha energía, flexible:</strong> taekwondo. Piernas, velocidad y movimiento rápido.</li>
<li><strong>Niño tímido o al que le cuesta el contacto:</strong> empieza por karate o taekwondo; el judo, más adelante.</li>
</ul>
<p>Y por encima de las cuatro: la calidad del monitor de infantil pesa más que la disciplina. Un buen instructor de taekwondo hará más por tu hijo que uno mediocre de la disciplina "ideal" sobre el papel.</p>

<h2>Qué aporta de verdad, y qué no</h2>
<p>Aporta capacidad de sostener la atención en una tarea repetitiva, tolerancia a la frustración, respeto por normas explícitas y una progresión (los cinturones) que da sensación de avance sin necesidad de ganar a nadie.</p>
<p>No convierte a un niño tímido en extrovertido, no arregla problemas de conducta por sí solo y no garantiza que sepa defenderse en el patio. Si un centro te vende estas tres cosas, desconfía: te está vendiendo lo que quieres oír.</p>

<h2>Las cinco preguntas de la visita</h2>
<ol>
<li>¿Cómo están separados los grupos por edad este curso? Un grupo de 4 a 12 años es una señal de alarma.</li>
<li>¿Quién imparte concretamente el grupo infantil? No siempre es quien da adultos, y en infantil la pedagogía pesa tanto como el grado.</li>
<li>¿Puedo ver una clase completa, en la franja real de entrenamiento?</li>
<li>¿Qué grado tiene el instructor y qué federación lo emite?</li>
<li>¿La competición es voluntaria? En un centro sano se plantea como opción, nunca como expectativa.</li>
</ol>
<p>Cuando veas la clase, fíjate sobre todo en cómo corrigen a un niño que lo hace mal. Es el mejor indicador de calidad y no necesitas saber nada de artes marciales para juzgarlo.</p>

<h2>Septiembre manda</h2>
<p>Los grupos por edad se forman con el curso escolar. Si estás decidiendo en verano, es el momento de visitar y reservar; a mitad de curso es posible entrar pero tu hijo se incorpora a un grupo ya cohesionado. Para profundizar: <a href="/blog/mejor-arte-marcial-para-ninos-garraf/">cuál es la mejor arte marcial para niños</a> y <a href="/blog/karate-vs-taekwondo-ninos-garraf/">karate o taekwondo</a>.</p>
`,

  'clases-para-mujeres': `
<h2>Qué disciplinas encajan con qué objetivo</h2>
<p>La pregunta útil no es "cuál es mejor para mujeres" (ninguna lo es en abstracto), sino qué buscas exactamente:</p>
<ul>
<li><strong>Forma física y descargar la semana:</strong> <a href="/kickboxing/">kickboxing</a> o <a href="/boxeo/">boxeo</a>. Curva de aprendizaje rápida, sesiones intensas, y en iniciación el contacto es siempre opcional. Son las que más gente engancha el primer mes.</li>
<li><strong>Técnica donde el tamaño importa poco:</strong> <a href="/jiu-jitsu-brasileno/">jiu jitsu brasileño</a>. Es la disciplina donde una persona más pequeña puede controlar de forma más fiable a una más grande, porque todo se resuelve con palanca y posición.</li>
<li><strong>Seguridad práctica:</strong> <a href="/defensa-personal/">defensa personal</a>, con el matiz de que la prevención pesa más que la técnica.</li>
<li><strong>Práctica tradicional y progresión pautada:</strong> <a href="/karate/">karate</a> o <a href="/judo/">judo</a>.</li>
</ul>

<h2>Dónde están, según el directorio</h2>
<p>En nuestro <a href="/centros/">directorio verificado</a>, kickboxing, boxeo, jiu jitsu brasileño y defensa personal constan tanto en <a href="/sitges/">Sitges</a> como en <a href="/vilanova-i-la-geltru/">Vilanova i la Geltrú</a>. Karate consta en ambos; judo, solo en Vilanova. Fuera de esos dos municipios la oferta es corta: en <a href="/sant-pere-de-ribes/">Sant Pere de Ribes</a> y <a href="/olivella/">Olivella</a> casi todo es taekwondo (en Ribes, un centro añade defensa personal), en <a href="/cubelles/">Cubelles</a> hay taekwondo y un centro con boxeo, MMA y krav maga, y en <a href="/canyelles/">Canyelles</a> no consta nada. Para casi cualquier otra cosa, lo habitual es desplazarse.</p>

<h2>Grupo femenino o grupo mixto</h2>
<p>Depende de qué te frene. Si lo que te da pereza es sentirte observada mientras aprendes, un grupo femenino elimina esa barrera de golpe y es una razón perfectamente válida. Si buscas autodefensa aplicable, entrenar tarde o temprano con personas más grandes forma parte del aprendizaje: un programa que nunca te expone a esa diferencia te da una falsa sensación de competencia.</p>
<p>Lo que ningún directorio puede garantizarte es si ahora mismo hay grupo femenino en un centro concreto: depende de que se junte gente y cambia cada temporada. Pregúntalo pidiendo día y hora concretos, y desde cuándo funciona ese grupo. Si no lo hay, pregunta en qué franja horaria entrenan más mujeres: no es lo mismo un mixto de las 19 h con diez personas que uno de las 21:30 con cuatro.</p>

<h2>Cuatro señales que se ven en una sola clase de prueba</h2>
<p>No hace falta entender de artes marciales para detectarlas, y predicen mejor que cualquier instalación si seguirás entrenando dentro de un año: si hay más de una mujer entrenando de forma habitual, si el instructor avisa antes de corregir con contacto, si la intensidad del trabajo por parejas sube de forma graduada y se puede parar, y si nadie hace comentarios sobre tu forma física.</p>
<p>Para ampliar, tienes la guía específica de <a href="/clases-para-mujeres-en-sitges/">Sitges</a>, la de <a href="/clases-para-mujeres-en-vilanova/">Vilanova</a> y el artículo <a href="/blog/defensa-personal-para-mujeres-garraf/">qué funciona de verdad en defensa personal para mujeres</a>.</p>
`,

  'clases-para-adultos': `
<h2>Los tres miedos, y qué hay de cierto en cada uno</h2>
<p><strong>"Estoy mayor."</strong> En cualquier grupo de adultos de la comarca hay gente de 35, 45 y 55 años. Lo que cambia con la edad no es la capacidad de aprender, es el tiempo de recuperación: entrenarás igual, pero necesitarás más descanso entre sesiones y menos empeño en seguir el ritmo del chaval de 22 que tienes al lado.</p>
<p><strong>"Primero me pongo en forma."</strong> Al revés: el entrenamiento es lo que te pone en forma, y las clases de iniciación asumen que llegas sin base. Esperar a estar en forma es la excusa más eficaz que existe para no empezar nunca.</p>
<p><strong>"Voy a hacer el ridículo."</strong> Todos los de esa sala fueron el nuevo torpe y lo recuerdan. En un sitio sano, al nuevo se le ayuda. Si percibes lo contrario en la clase de prueba, el problema es el centro.</p>

<h2>Elige por objetivo, no por lo que suene mejor</h2>
<ul>
<li><strong>Ponerte en forma y descargar estrés:</strong> <a href="/boxeo/">boxeo</a> o <a href="/kickboxing/">kickboxing</a>. Resultados visibles rápido y curva de aprendizaje amable.</li>
<li><strong>Técnica a largo plazo, poco impacto articular:</strong> <a href="/jiu-jitsu-brasileno/">jiu jitsu brasileño</a>. El que más engancha y el que menos depende de la potencia.</li>
<li><strong>Autodefensa práctica:</strong> <a href="/defensa-personal/">defensa personal</a>.</li>
<li><strong>Estructura, disciplina y práctica tradicional:</strong> <a href="/karate/">karate</a> o <a href="/judo/">judo</a>.</li>
<li><strong>El sistema más completo, si te atrae la variedad:</strong> <a href="/mma/">MMA</a>. Y sí, se puede empezar desde cero.</li>
</ul>

<h2>Un plan de tres semanas para no equivocarte</h2>
<ol>
<li><strong>Semana 1: define el objetivo, no la disciplina.</strong> Cada objetivo descarta la mitad de las opciones de golpe.</li>
<li><strong>Semana 2: dos clases de prueba</strong> de disciplinas distintas, en la franja horaria en la que entrenarías de verdad. Un martes a las 20 h y un sábado a las 10 h son grupos completamente diferentes.</li>
<li><strong>Semana 3: repite en el que más te gustó.</strong> La primera clase siempre impresiona; la segunda te dice si el ambiente aguanta. Solo entonces preguntas por cuotas, matrícula y permanencia.</li>
</ol>

<h2>Dónde tienes más margen para elegir</h2>
<p>Según nuestro <a href="/centros/">directorio</a>, <a href="/vilanova-i-la-geltru/">Vilanova i la Geltrú</a> reúne siete centros verificados y <a href="/sitges/">Sitges</a> tres; el resto de municipios de la comarca, uno o ninguno. Esto importa para un adulto que empieza más de lo que parece: en un municipio con varios centros puedes equivocarte de disciplina o de ambiente y cambiar sin replantearte los desplazamientos. Donde solo hay una opción, equivocarse suele significar abandonar.</p>
<p>Para profundizar: <a href="/blog/artes-marciales-adultos-principiantes-garraf/">cómo empezar artes marciales siendo adulto</a>, y las guías de <a href="/clases-para-adultos-en-sitges/">Sitges</a> y <a href="/clases-para-adultos-en-vilanova/">Vilanova</a>.</p>
`,

  'iniciacion': `
<h2>Empieza por la pregunta correcta</h2>
<p>Casi todo el mundo empieza preguntándose "¿qué arte marcial es mejor?". Es la pregunta equivocada, porque no tiene respuesta. La que sí funciona es: <strong>¿qué quiero que pase dentro de seis meses?</strong> Con eso decidido, la lista de opciones se reduce sola.</p>

<h2>Cuatro objetivos, cuatro caminos</h2>
<ul>
<li><strong>Ponerme en forma y descargar la cabeza.</strong> <a href="/boxeo/">Boxeo</a> o <a href="/kickboxing/">kickboxing</a>. Intensidad alta desde el primer día, técnica accesible, y en iniciación no hay contacto obligatorio.</li>
<li><strong>Aprender algo técnico que me enganche años.</strong> <a href="/jiu-jitsu-brasileno/">Jiu jitsu brasileño</a>. Es el que tiene la comunidad más fiel y el que menos depende de la fuerza. También <a href="/judo/">judo</a> si prefieres el trabajo de pie y las proyecciones.</li>
<li><strong>Saber defenderme.</strong> <a href="/defensa-personal/">Defensa personal</a> para lo específico, aunque cualquier disciplina entrenada de forma continuada aporta más de lo que la gente cree.</li>
<li><strong>Una actividad para mi hijo.</strong> <a href="/clases-para-ninos/">Karate, judo o taekwondo</a>, según carácter y edad.</li>
</ul>

<h2>Segunda pregunta: cuánto contacto quieres</h2>
<p>Es el filtro que más gente se salta y el que más abandonos causa. Ordenadas de menos a más contacto en las clases de iniciación: karate y taekwondo (contacto controlado y tardío), judo y jiu jitsu brasileño (contacto constante pero sin golpes), boxeo y kickboxing (golpeo, pero sobre saco y manoplas al principio), MMA (todo lo anterior).</p>
<p>En cualquier centro serio, el sparring es opcional, progresivo y nunca el primer día. Si en tu clase de prueba ves otra cosa, el problema es el centro, no la disciplina.</p>

<h2>Tercera pregunta: qué tienes cerca de verdad</h2>
<p>Aquí es donde muchos planes se rompen. Según nuestro <a href="/centros/">directorio verificado</a>, la oferta del Garraf está muy concentrada: <a href="/vilanova-i-la-geltru/">Vilanova i la Geltrú</a> reúne siete centros y cubre casi todas las disciplinas; <a href="/sitges/">Sitges</a> tiene tres, sin judo ni taekwondo verificados; <a href="/sant-pere-de-ribes/">Sant Pere de Ribes</a> tiene cuatro, todos de taekwondo (uno con defensa personal); <a href="/cubelles/">Cubelles</a> tiene dos, con taekwondo y un centro que suma boxeo, MMA y krav maga; en <a href="/canyelles/">Canyelles</a> no consta ningún centro. El <a href="/muay-thai/">muay thai</a>, pese a lo que se busca, no nos consta en ningún centro de la comarca.</p>
<p>Conviene cruzarlo con tu objetivo antes de ilusionarte con una disciplina concreta. Si vives en Canyelles y quieres muay thai, el plan realista pasa por kickboxing en Vilanova, no por buscar diez webs más.</p>

<h2>Y la regla que vale más que todas</h2>
<p>El horario decide más que la disciplina. La mayoría de la gente que abandona no lo hace porque la actividad no le gustara: lo hace porque la franja horaria era insostenible. Elige dos días que puedas cumplir en enero con lluvia, no los que te apetecen en septiembre con toda la motivación.</p>
<p>¿Sigues con dudas? <a href="/contacto/">Escríbenos</a> contando qué buscas, para quién y en qué franja: te orientamos sin coste y no gestionamos tu alta en ningún sitio.</p>
`,

  'clases-infantiles-en-sitges': `
<h2>Qué puede empezar un niño en Sitges sin salir del municipio</h2>
<p>De los tres centros de Sitges verificados en nuestro <a href="/centros/">directorio</a>, dos anuncian explícitamente grupos infantiles, y las disciplinas que cubren entre todos son <a href="/karate-en-sitges/">karate</a>, <a href="/kickboxing-en-sitges/">kickboxing</a>, <a href="/jiu-jitsu-brasileno-en-sitges/">jiu jitsu brasileño</a>, <a href="/mma-en-sitges/">MMA</a>, <a href="/boxeo-en-sitges/">boxeo</a> y <a href="/defensa-personal-en-sitges/">defensa personal</a>.</p>
<p>Aquí hay un detalle que a muchos padres les sorprende: las dos disciplinas más clásicas para niños pequeños en España (<a href="/judo/">judo</a> y <a href="/taekwondo/">taekwondo</a>) no nos constan con fuente verificable en Sitges. Si tenías el judo en la cabeza como primera opción, que es una elección excelente para los 4-7 años, tendrás que mirar hacia <a href="/vilanova-i-la-geltru/">Vilanova i la Geltrú</a>.</p>

<h2>La edad manda más que la disciplina</h2>
<p>Entre los 4 y los 6 años, lo que se trabaja realmente no es un arte marcial: es psicomotricidad, atención, seguir instrucciones y esperar el turno, envuelto en la estética de la disciplina. A esa edad, elegir entre karate y judo importa poco; importa muchísimo el monitor y el tamaño del grupo.</p>
<p>A partir de los 7-8 años sí empieza a haber diferencias reales que notarás en casa. El karate es más ordenado y estructurado, con progresión de cinturones muy pautada. El judo implica contacto y caídas desde el primer día, y suele encajar mejor con niños muy físicos. Las disciplinas de golpeo con contacto (kickboxing, boxeo) tienen sentido algo más tarde, y en cualquier centro serio el contacto real llega de forma muy progresiva.</p>

<h2>Las cinco preguntas que deberías hacer en la visita</h2>
<ol>
<li><strong>¿Cómo se separan los grupos por edad?</strong> Un grupo de 4 a 12 años es una señal de alarma: las necesidades de un niño de 5 y uno de 11 no tienen nada que ver.</li>
<li><strong>¿Cuántos niños hay por monitor?</strong> No hay número mágico, pero sí una prueba sencilla: si en la clase que observes el monitor no puede corregir individualmente a cada niño al menos una vez, el grupo es grande.</li>
<li><strong>¿Puedo ver una clase antes de apuntarle?</strong> La respuesta debe ser sí sin dudar. Y ve a verla en la franja real en la que entrenaría.</li>
<li><strong>¿Qué formación tiene quien imparte el grupo infantil?</strong> No siempre es la misma persona que da los grupos de adultos, y en infantil la pedagogía pesa tanto como el grado.</li>
<li><strong>¿Cómo se gestiona la competición?</strong> En un centro sano es voluntaria y se plantea como opción, nunca como expectativa.</li>
</ol>

<h2>El calendario en Sitges</h2>
<p>Los grupos infantiles se forman en septiembre, con el curso escolar, y esa es la ventana natural para empezar. Incorporarse en noviembre o enero es posible, pero tu hijo entra en un grupo ya cohesionado y con contenidos avanzados. Si estás leyendo esto en verano, es el momento de mirar y reservar; si es diciembre, pregunta igualmente si hay grupo con plazas o si conviene esperar a septiembre.</p>
<p>Para comparar disciplinas en detalle, tienes la <a href="/clases-para-ninos/">guía de artes marciales para niños del Garraf</a> y el artículo <a href="/blog/mejor-arte-marcial-para-ninos-garraf/">cuál es la mejor arte marcial para niños</a>. Si prefieres que te orientemos según la edad y el carácter de tu hijo, <a href="/contacto/">escríbenos</a>.</p>
`,

  'clases-infantiles-en-vilanova': `
<h2>Vilanova es el municipio con más opciones infantiles de la comarca</h2>
<p>Y no por poco. En nuestro <a href="/centros/">directorio</a>, Vilanova i la Geltrú reúne siete centros verificados frente a los tres de <a href="/sitges/">Sitges</a>, y entre ellos cubren las tres puertas de entrada clásicas para niños: <a href="/karate-en-vilanova-i-la-geltru/">karate</a>, <a href="/judo-en-vilanova-i-la-geltru/">judo</a> y <a href="/taekwondo-en-vilanova-i-la-geltru/">taekwondo</a>. Es el único municipio del Garraf donde puedes elegir entre las tres sin salir de casa.</p>
<p>Eso convierte a Vilanova en el destino natural también para familias de <a href="/cubelles/">Cubelles</a>, <a href="/canyelles/">Canyelles</a> y <a href="/sant-pere-de-ribes/">Sant Pere de Ribes</a> que buscan una disciplina concreta que no encuentran en su municipio.</p>

<h2>Karate, judo o taekwondo: cómo decidir sin volverte loco</h2>
<p>Las tres son excelentes y ninguna es "mejor" en abstracto. La forma práctica de decidir es mirar a tu hijo, no a la disciplina:</p>
<ul>
<li><strong>Niño disperso o que necesita marco.</strong> El karate es el más estructurado: etiqueta, formas, progresión muy pautada. Ese orden es justamente lo que le aporta.</li>
<li><strong>Niño muy físico, que necesita descargar.</strong> El judo. Contacto desde el primer día, agarres, caídas y una cantidad enorme de actividad por sesión.</li>
<li><strong>Niño con energía, flexible, que disfruta moviéndose rápido.</strong> El taekwondo, con su trabajo de piernas y velocidad, suele engancharles más.</li>
<li><strong>Niño tímido o al que le cuesta el contacto.</strong> Empieza por karate o taekwondo antes que por judo; el contacto llega después y mejor.</li>
</ul>
<p>Y una regla que vale más que las cuatro anteriores: la calidad del monitor de infantil pesa más que la disciplina elegida. Un buen instructor de taekwondo hará más por tu hijo que un instructor mediocre de la disciplina "ideal" sobre el papel.</p>

<h2>Aprovecha que hay competencia real</h2>
<p>En un municipio con siete centros puedes permitirte algo que en Canyelles o Cubelles no: comparar. Visita dos o tres, observa una clase completa en cada uno en la franja horaria real, y fíjate menos en las instalaciones y más en tres cosas concretas: cómo hablan los monitores a los niños cuando algo sale mal, si los grupos están separados por edad de verdad, y si los propios niños llegan contentos a clase.</p>
<p>Cuidado con el sesgo de las instalaciones: un tatami nuevo y un local grande impresionan en la visita, pero no es eso lo que hará que tu hijo siga entrenando en tres años.</p>

<h2>Horarios: el factor que decide de verdad</h2>
<p>En Vilanova hay oferta suficiente como para que puedas elegir horario en lugar de aceptar el que haya, y eso es más importante de lo que parece. La mayoría de abandonos infantiles no ocurren porque al niño deje de gustarle, sino porque el horario chocaba con la salida del colegio, con la cena o con la actividad de un hermano. Haz el cálculo real de la tarde antes de apuntarle, con tráfico y con margen.</p>
<p>Para profundizar, tienes la <a href="/clases-para-ninos/">guía comarcal para padres</a> y la comparativa <a href="/blog/karate-vs-taekwondo-ninos-garraf/">karate o taekwondo para niños</a>. Si quieres que te ayudemos a filtrar según edad, carácter y horario, <a href="/contacto/">escríbenos</a>: es gratis y no gestionamos altas.</p>
`,

  'clases-para-adultos-en-sitges': `
<h2>Empezar de adulto en Sitges: el mapa realista</h2>
<p>Los tres centros de Sitges verificados en nuestro <a href="/centros/">directorio</a> se concentran en un perfil bastante definido: disciplinas de golpeo y de suelo modernas (<a href="/kickboxing-en-sitges/">kickboxing</a>, <a href="/boxeo-en-sitges/">boxeo</a>, <a href="/mma-en-sitges/">MMA</a>, <a href="/jiu-jitsu-brasileno-en-sitges/">jiu jitsu brasileño</a>), más <a href="/karate-en-sitges/">karate</a> y <a href="/defensa-personal-en-sitges/">defensa personal</a>. Es una oferta orientada al adulto que quiere entrenar fuerte, más que a la práctica tradicional.</p>
<p>Si lo que buscas es precisamente lo contrario (una disciplina tradicional, de progresión lenta, tipo judo o taekwondo), no nos consta oferta verificable en Sitges y tendrás que mirar <a href="/vilanova-i-la-geltru/">Vilanova</a>.</p>

<h2>Los tres miedos del adulto que empieza, y qué hay de cierto</h2>
<p><strong>"Estoy mayor para esto."</strong> Es el más común y el menos fundado. En cualquier grupo de adultos de la comarca hay gente de 35, 45 y 55 años. Lo que cambia con la edad no es la capacidad de aprender, es el tiempo de recuperación: entrenarás igual, pero necesitarás más descanso entre sesiones y menos tolerancia a la estupidez de intentar seguir el ritmo del chaval de 22 años que tienes al lado.</p>
<p><strong>"Tengo que ponerme en forma antes de apuntarme."</strong> Al revés. El entrenamiento es lo que te pone en forma, y todas las clases de iniciación asumen que llegas sin base. Esperar a estar en forma para empezar es la excusa más eficaz que existe para no empezar nunca.</p>
<p><strong>"Voy a hacer el ridículo."</strong> Todos los que están en esa sala fueron el nuevo torpe en algún momento, y lo recuerdan perfectamente. En una sala sana, el nuevo recibe ayuda, no burlas. Si percibes lo contrario en la clase de prueba, el problema es el centro, no tú.</p>

<h2>Elige por objetivo, no por lo que suene mejor</h2>
<ul>
<li><strong>Ponerte en forma y descargar estrés:</strong> boxeo o kickboxing. Sesiones intensas, resultados visibles rápido, curva de aprendizaje amable.</li>
<li><strong>Técnica y progresión a largo plazo, con poco impacto articular:</strong> jiu jitsu brasileño. Es el que más engancha de todos y el que menos depende de la potencia física.</li>
<li><strong>Autodefensa práctica:</strong> <a href="/defensa-personal-en-sitges/">defensa personal</a>, y si quieres un sistema completo mira también <a href="/krav-maga/">krav maga</a>, aunque en la comarca solo consta en un centro de Cubelles. </li>
<li><strong>Disciplina, estructura y práctica tradicional:</strong> karate.</li>
</ul>

<h2>El factor Sitges: estacionalidad y compromiso</h2>
<p>Sitges tiene mucha población flotante, y eso afecta a cómo se contratan las actividades. Si vas a estar unos meses, pregunta por bonos o mensualidades sin permanencia: algunos centros los tienen precisamente por este perfil. Si vives todo el año, asegúrate de no acabar en una tarifa pensada para estancias cortas, que a doce meses vista suele salir más cara.</p>
<p>El otro efecto es la ocupación en verano: entre junio y septiembre los grupos de tarde-noche se llenan más. Si tienes flexibilidad horaria, prueba las franjas de mañana.</p>
<p>¿Sigues sin decidirte? La <a href="/iniciacion/">guía de iniciación</a> ordena las disciplinas por objetivo, y el artículo <a href="/blog/artes-marciales-adultos-principiantes-garraf/">cómo empezar siendo adulto</a> entra en detalle. O <a href="/contacto/">escríbenos</a> y te orientamos sin coste.</p>
`,

  'clases-para-adultos-en-vilanova': `
<h2>La ventaja de empezar en Vilanova: puedes equivocarte</h2>
<p>Suena raro como argumento, pero es el más útil. Con siete centros verificados en nuestro <a href="/centros/">directorio</a>, Vilanova i la Geltrú es el único municipio del Garraf donde, si eliges mal la disciplina o el ambiente no te convence, puedes cambiar sin tener que replantearte los desplazamientos. En un municipio con un solo centro, equivocarse significa abandonar.</p>
<p>La oferta verificada cubre <a href="/boxeo-en-vilanova-i-la-geltru/">boxeo</a>, <a href="/kickboxing-en-vilanova-i-la-geltru/">kickboxing</a>, <a href="/mma-en-vilanova-i-la-geltru/">MMA</a>, <a href="/jiu-jitsu-brasileno-en-vilanova-i-la-geltru/">jiu jitsu brasileño</a>, <a href="/karate-en-vilanova-i-la-geltru/">karate</a>, <a href="/judo-en-vilanova-i-la-geltru/">judo</a>, <a href="/taekwondo-en-vilanova-i-la-geltru/">taekwondo</a> y <a href="/defensa-personal-en-vilanova-i-la-geltru/">defensa personal</a>, además de actividades minoritarias como aikido, wu shu, kyokushin, K-1 o grappling que constan en centros concretos del directorio.</p>

<h2>Un plan de tres semanas para elegir bien</h2>
<p>En lugar de leer diez webs y apuntarte a ciegas, haz esto:</p>
<ol>
<li><strong>Semana 1: define el objetivo, no la disciplina.</strong> Forma física, autodefensa, técnica a largo plazo o comunidad. Cada objetivo descarta la mitad de las opciones de golpe.</li>
<li><strong>Semana 2: dos clases de prueba.</strong> De disciplinas distintas, en la franja horaria en la que entrenarías de verdad. Un martes a las 20 h y un sábado a las 10 h son grupos completamente diferentes.</li>
<li><strong>Semana 3: repite en el que más te gustó.</strong> La primera clase siempre impresiona; la segunda te dice si el ambiente aguanta. Solo entonces pregunta por cuotas, matrícula y permanencia.</li>
</ol>
<p>Tres semanas es poco tiempo comparado con el año que vas a pasar entrenando, y evita el error caro: pagar doce meses de algo que no te encaja.</p>

<h2>Qué mirar en la clase de prueba siendo principiante</h2>
<p>No sabrás juzgar la técnica (es normal, acabas de llegar), pero sí puedes juzgar cuatro cosas que no requieren experiencia: si el entrenador corrige individualmente o solo dirige, si existe un grupo o franja de iniciación real o te meten directamente con los veteranos, si el contacto con gente nueva es progresivo y opcional, y cómo tratan los alumnos veteranos al que acaba de entrar. Esa última señal es la que mejor predice si seguirás ahí dentro de un año.</p>

<h2>Combinar disciplinas: solo aquí es fácil</h2>
<p>Varios de los centros verificados de Vilanova cubren golpeo y suelo bajo el mismo techo, algo poco habitual en el resto de la comarca. Si te tienta entrenar dos cosas (por ejemplo kickboxing dos días y jiu jitsu uno), pregúntalo en la primera visita y consulta si existe cuota conjunta. Eso sí: espera unos meses antes de hacerlo. Empezar dos disciplinas a la vez desde cero suele acabar en avanzar poco en ambas.</p>
<p>Para profundizar, tienes la <a href="/clases-para-adultos/">guía comarcal para adultos</a>, la <a href="/iniciacion/">guía de iniciación</a> y el artículo <a href="/blog/artes-marciales-adultos-principiantes-garraf/">cómo empezar artes marciales siendo adulto</a>. Y si quieres que te orientemos, <a href="/contacto/">escríbenos</a>.</p>
`,

  'clases-para-mujeres-en-sitges': `
<h2>Qué hay en Sitges y qué implica para ti</h2>
<p>De los tres centros de Sitges verificados en nuestro <a href="/centros/">directorio</a>, las disciplinas que más demandan las mujeres que empiezan están todas cubiertas: <a href="/kickboxing-en-sitges/">kickboxing</a> y <a href="/boxeo-en-sitges/">boxeo</a> para forma física, <a href="/jiu-jitsu-brasileno-en-sitges/">jiu jitsu brasileño</a> para técnica pura, y <a href="/defensa-personal-en-sitges/">defensa personal</a> para seguridad práctica.</p>
<p>Lo que no podemos decirte (y ningún directorio honesto puede) es si en este momento hay grupos exclusivamente femeninos. Es un dato que cambia por temporadas y que depende de que se junte suficiente gente. Es la primera pregunta que deberías hacer si te importa, y merece una respuesta concreta: "sí, los martes y jueves a las 19 h" es una respuesta; "sí, claro, tenemos muchas chicas" no lo es.</p>

<h2>Grupo mixto o grupo femenino: no hay respuesta única</h2>
<p>Depende de qué te frene. Si lo que te da pereza es el ambiente de vestuario o sentirte observada mientras aprendes, un grupo femenino elimina esa barrera de golpe y es una razón perfectamente válida. Si lo que buscas es defensa personal aplicable, entrenar tarde o temprano con personas más grandes y más fuertes que tú forma parte del aprendizaje: un programa que nunca te expone a esa diferencia te está dando una falsa sensación de competencia.</p>
<p>La solución práctica que funciona para mucha gente es empezar en el entorno donde te sientas cómoda y ampliar después. Lo importante es empezar.</p>

<h2>Elegir según lo que buscas</h2>
<ul>
<li><strong>Forma física y descarga de estrés:</strong> kickboxing o boxeo. Curva de aprendizaje rápida, sesiones intensas y contacto siempre opcional en las clases de iniciación.</li>
<li><strong>Técnica donde el tamaño importa poco:</strong> jiu jitsu brasileño. Es, con diferencia, la disciplina donde una persona más pequeña puede controlar a una más grande, porque se basa en palancas y posición y no en fuerza.</li>
<li><strong>Autodefensa concreta:</strong> defensa personal, con las particularidades que explicamos en la <a href="/defensa-personal-femenina-en-sitges/">guía de defensa personal femenina en Sitges</a>.</li>
</ul>

<h2>Señales de que un centro es buen sitio para ti</h2>
<p>Más allá del cartel de la puerta, hay indicios que se ven en una sola clase de prueba: si hay más de una mujer entrenando de forma habitual (no una sola en toda la sala), si el instructor pregunta antes de corregir tocando, si el contacto en los ejercicios por parejas es graduado y no una prueba de resistencia, y si nadie hace comentarios sobre tu forma física. Ninguna de estas cosas requiere que entiendas de artes marciales para detectarla.</p>
<p>Si quieres profundizar antes de decidir, la <a href="/clases-para-mujeres/">guía comarcal para mujeres</a> compara las disciplinas y el artículo <a href="/blog/defensa-personal-para-mujeres-garraf/">qué funciona de verdad en defensa personal para mujeres</a> desmonta los mitos habituales. Y si prefieres preguntarnos directamente qué opciones hay en Sitges o cerca, <a href="/contacto/">escríbenos</a>: te orientamos sin coste y sin gestionar tu alta.</p>
`,

  'clases-para-mujeres-en-vilanova': `
<h2>Más oferta significa más probabilidad de encontrar tu sitio</h2>
<p>Vilanova i la Geltrú reúne siete centros verificados en nuestro <a href="/centros/">directorio</a>, más del doble que <a href="/sitges/">Sitges</a>, y eso importa especialmente si buscas algo concreto: un grupo femenino, un horario compatible con la jornada laboral o un ambiente determinado. Con una sola opción en el municipio, aceptas lo que hay; con siete, eliges.</p>
<p>Las disciplinas más demandadas están todas cubiertas: <a href="/kickboxing-en-vilanova-i-la-geltru/">kickboxing</a> y <a href="/boxeo-en-vilanova-i-la-geltru/">boxeo</a>, <a href="/jiu-jitsu-brasileno-en-vilanova-i-la-geltru/">jiu jitsu brasileño</a>, <a href="/defensa-personal-en-vilanova-i-la-geltru/">defensa personal</a>, y también las tradicionales <a href="/karate-en-vilanova-i-la-geltru/">karate</a>, <a href="/judo-en-vilanova-i-la-geltru/">judo</a> y <a href="/taekwondo-en-vilanova-i-la-geltru/">taekwondo</a>, que en Sitges no constan.</p>

<h2>Los grupos femeninos van y vienen: cómo preguntarlo bien</h2>
<p>La existencia de un grupo exclusivamente femenino depende de que se junte gente suficiente, así que cambia de temporada en temporada y ningún directorio puede garantizártelo. Lo que sí puedes hacer es preguntar de forma que la respuesta sea útil: pide día y hora concretos, y pregunta desde cuándo funciona ese grupo. Un grupo que lleva dos años en marcha seguirá ahí; uno que "estamos a punto de abrir" puede no llegar a existir.</p>
<p>Si en el centro que más te gusta no hay grupo femenino, hay una alternativa que funciona bien: pregunta en qué franja horaria entrenan más mujeres. No es lo mismo un grupo mixto de las 19 h con diez personas que uno de las 21:30 con cuatro.</p>

<h2>Qué disciplina encaja con qué objetivo</h2>
<ul>
<li><strong>Ponerte en forma y desconectar:</strong> kickboxing o boxeo. Son los que más gente engancha el primer mes, y en iniciación el contacto es siempre opcional.</li>
<li><strong>Técnica pura, sin depender de la fuerza:</strong> jiu jitsu brasileño. Es la disciplina donde el tamaño importa menos, porque todo se resuelve con palanca y posición.</li>
<li><strong>Autodefensa práctica:</strong> defensa personal, con el detalle específico en la <a href="/defensa-personal-femenina-en-vilanova/">guía de defensa personal femenina en Vilanova</a>.</li>
<li><strong>Práctica tradicional y progresión pautada:</strong> karate o judo, que en Vilanova sí tienes disponibles.</li>
</ul>

<h2>Aprovecha la competencia: prueba dos, no uno</h2>
<p>En un municipio con esta densidad de centros, apuntarse al primero que se visita es dejar valor sobre la mesa. Haz dos clases de prueba en centros distintos, en la franja en la que entrenarías de verdad, y compara cuatro señales concretas: cuántas mujeres entrenan de forma habitual, si el instructor avisa antes de corregir con contacto, si existe grupo de iniciación real, y cómo tratan los veteranos a quien acaba de llegar.</p>
<p>Esas cuatro cosas se detectan sin saber nada de artes marciales, y predicen mucho mejor que las instalaciones si seguirás entrenando dentro de un año.</p>
<p>Para ampliar, tienes la <a href="/clases-para-mujeres/">guía comarcal para mujeres</a> y el artículo <a href="/blog/defensa-personal-para-mujeres-garraf/">qué funciona de verdad en defensa personal para mujeres</a>. Si prefieres que te ayudemos a filtrar opciones, <a href="/contacto/">escríbenos</a>.</p>
`,

  'karate-infantil-en-sitges': `
<h2>Karate infantil en Sitges: dónde consta y dónde no</h2>
<p>En nuestro <a href="/centros/">directorio del Garraf</a>, el karate aparece en centros de Sitges con fuente pública verificable, y hay centros del municipio que anuncian explícitamente grupos infantiles. Lo que no podemos confirmarte desde aquí es qué franjas de edad tiene abierto cada uno este curso: eso cambia cada septiembre y solo el centro puede decírtelo.</p>
<p>Si además quieres comparar con otras disciplinas antes de decidir, ten en cuenta que en Sitges no nos constan judo ni taekwondo verificados; para esas dos, la referencia es <a href="/vilanova-i-la-geltru/">Vilanova i la Geltrú</a>, a 10-15 minutos.</p>

<h2>Desde qué edad tiene sentido de verdad</h2>
<p>La mayoría de escuelas aceptan niños desde los 4-6 años, pero conviene entender qué pasa a cada edad para no llevarte una decepción:</p>
<ul>
<li><strong>4-5 años:</strong> no es karate todavía, es psicomotricidad con estética de karate. Se trabaja equilibrio, lateralidad, seguir instrucciones y esperar el turno. Es valiosísimo, pero no esperes técnica.</li>
<li><strong>6-7 años:</strong> aparecen las posiciones básicas y los primeros katas sencillos. Empieza a haber karate reconocible y el niño ya percibe la progresión.</li>
<li><strong>8-11 años:</strong> la edad ideal. Hay capacidad de detalle técnico, memoria para los katas y madurez para el trabajo por parejas controlado. Aquí es cuando el karate engancha o no engancha.</li>
<li><strong>12 años en adelante:</strong> ya es una decisión del propio niño, y lo mejor que puedes hacer es respetarla.</li>
</ul>

<h2>Qué gana tu hijo, sin exagerar</h2>
<p>El karate infantil bien enseñado aporta cosas concretas: capacidad de sostener la atención en una tarea, tolerancia a la frustración (repetir un movimiento cien veces enseña eso mejor que cualquier charla), respeto por normas explícitas y una progresión de cinturones que da sensación de avance sin necesidad de ganar a nadie.</p>
<p>Lo que no aporta, pese a lo que se promete a veces: no convierte a un niño tímido en extrovertido, no soluciona problemas de conducta por sí solo, y no garantiza que sepa defenderse en el patio. Desconfía de cualquier centro que te venda estas tres cosas.</p>

<h2>Cómo elegir escuela: lo que sí puedes evaluar</h2>
<ol>
<li><strong>Grado y federación del instructor.</strong> Pregunta el grado y la federación que lo emite. Un cinturón negro reconocido es información verificable, y quien lo tiene lo dice sin problema.</li>
<li><strong>Quién imparte el grupo infantil.</strong> No siempre es el mismo que da adultos. Pregunta específicamente por esa persona: en infantil, la pedagogía pesa tanto como el grado.</li>
<li><strong>Separación por edades reales.</strong> Un grupo de 4 a 12 años no funciona. Busca franjas cerradas.</li>
<li><strong>Ver una clase entera.</strong> No cinco minutos: una clase completa, en la franja real. Fíjate en cómo se corrige a un niño que lo hace mal. Ahí se ve todo.</li>
<li><strong>Competición voluntaria.</strong> Debe presentarse como opción, nunca como expectativa.</li>
</ol>

<h2>El calendario manda</h2>
<p>Los grupos infantiles se forman en septiembre con el curso escolar. Si estás decidiendo en verano, es el momento perfecto para visitar y reservar plaza. Si estás a mitad de curso, pregunta si hay grupo con hueco: es posible, pero tu hijo entrará en un grupo ya rodado.</p>
<p>Antes de cerrar la decisión, échale un ojo a la comparativa <a href="/blog/karate-vs-taekwondo-ninos-garraf/">karate o taekwondo para niños</a> y a la <a href="/clases-para-ninos/">guía para padres del Garraf</a>. Si quieres que te orientemos según la edad y el carácter de tu hijo, <a href="/contacto/">escríbenos</a>: es gratis y no gestionamos altas.</p>
`,

  'karate-infantil-en-vilanova': `
<h2>Vilanova: el municipio donde puedes comparar antes de decidir</h2>
<p>En nuestro <a href="/centros/">directorio</a>, Vilanova i la Geltrú reúne siete centros verificados, y es el único municipio del Garraf donde constan a la vez las tres disciplinas clásicas para niños: karate, <a href="/judo-en-vilanova-i-la-geltru/">judo</a> y <a href="/taekwondo-en-vilanova-i-la-geltru/">taekwondo</a>. Antes de dar por hecho que el karate es la opción, vale la pena que sepas que aquí puedes ver las tres y decidir con criterio.</p>
<p>En el directorio consta además una escuela del municipio con karate kyokushin, un estilo de contacto pleno bastante distinto del karate más habitual en grupos infantiles. Si te lo encuentras, pregunta cómo adaptan el contacto en las edades tempranas: la respuesta te dirá mucho del centro.</p>

<h2>Qué edad, y qué esperar en cada una</h2>
<p>La franja de entrada habitual son los 4-6 años, pero el karate real llega después. Entre los 4 y 5 años lo que hay es trabajo psicomotriz vestido de karate: equilibrio, lateralidad, esperar turno, seguir instrucciones. A los 6-7 aparecen las posiciones y los primeros katas. Entre los 8 y los 11 está el punto dulce: hay capacidad técnica, memoria y madurez para el trabajo por parejas, y es la edad en la que el karate engancha de verdad o se abandona.</p>
<p>Si tu hijo tiene 4 años y esperas verle hacer katas en Navidad, la expectativa está mal calibrada, no el centro.</p>

<h2>Karate frente a las otras dos opciones que sí tienes en Vilanova</h2>
<ul>
<li><strong>Karate:</strong> el más estructurado de los tres. Etiqueta, formas, progresión muy pautada. Encaja especialmente bien con niños que necesitan marco y orden.</li>
<li><strong>Judo:</strong> contacto y caídas desde el primer día, muchísima actividad por sesión. Suele funcionar mejor con niños muy físicos que necesitan descargar.</li>
<li><strong>Taekwondo:</strong> velocidad, piernas y flexibilidad. Engancha a niños con mucha energía que disfrutan del movimiento rápido.</li>
</ul>
<p>Ninguna es superior a las otras. La comparativa detallada está en <a href="/blog/karate-vs-taekwondo-ninos-garraf/">karate o taekwondo para niños en el Garraf</a>.</p>

<h2>Cinco preguntas para la visita</h2>
<ol>
<li>¿Qué grado tiene el instructor y qué federación lo emite?</li>
<li>¿Quién imparte concretamente el grupo infantil, y qué formación pedagógica tiene?</li>
<li>¿Cómo están separados los grupos por edad este curso?</li>
<li>¿Puedo ver una clase completa en la franja en la que entrenaría mi hijo?</li>
<li>¿La competición es voluntaria, y cómo se plantea a las familias?</li>
</ol>
<p>Y una recomendación por encima de las cinco: ve a ver la clase y fíjate en cómo corrigen a un niño que lo hace mal. Es el mejor indicador de la calidad de un grupo infantil, y no necesitas saber nada de karate para juzgarlo.</p>

<h2>Septiembre es la ventana</h2>
<p>Los grupos por edad se forman con el curso escolar. Si decides en verano, visitas con calma y reservas; si decides en enero, tu hijo se incorpora a un grupo ya cohesionado, lo cual es posible pero más cuesta arriba. Para ampliar, tienes la <a href="/clases-para-ninos/">guía para padres del Garraf</a> y <a href="/blog/mejor-arte-marcial-para-ninos-garraf/">cuál es la mejor arte marcial para niños</a>. Si prefieres que te ayudemos a decidir, <a href="/contacto/">escríbenos</a>.</p>
`,
};

/**
 * Cuerpos para las money pages de los municipios pequeños y para las variantes
 * femeninas. Sin esto, `defensa-personal-en-cubelles` y
 * `defensa-personal-en-sant-pere-de-ribes` compartían el 74 % del texto: mismos
 * bloques de disciplina, mismas FAQ, y solo cambiaba el topónimo. Lo que las
 * distingue de verdad es qué consta —y qué no— en el directorio de cada sitio.
 */
export const MONEY_BODIES: Record<string, string> = {
  'boxeo-en-sant-pere-de-ribes': `
<h2>Lo primero: en Sant Pere de Ribes no nos consta boxeo</h2>
<p>En nuestro <a href="/centros/">directorio del Garraf</a>, los cuatro centros verificados del municipio son de taekwondo, y uno añade defensa personal. Ningún centro de Sant Pere de Ribes con fuente pública comprobable anuncia boxeo. Puede existir actividad que no deje rastro público (un grupo de temporada, una sección de club), pero si buscas boxeo con garantías, la respuesta realista es desplazarte.</p>

<h2>Sitges o Vilanova: elige por núcleo, no por municipio</h2>
<p>Aquí Sant Pere de Ribes tiene una particularidad útil. Al ser un municipio de dos núcleos, desde Les Roquetes suele salir mejor tirar hacia <a href="/sitges/">Sitges</a>, y desde Ribes hacia <a href="/vilanova-i-la-geltru/">Vilanova i la Geltrú</a>. Ambos están en la horquilla de 10-15 minutos en coche, así que la decisión la marcan dos cosas: dónde vives exactamente y qué horarios encajan con tu tarde.</p>
<p>En oferta de boxeo, los dos municipios tienen centros verificados. Vilanova reúne más centros en total, siete frente a tres, lo que se traduce en más franjas horarias donde elegir. Si trabajas a turnos, esa diferencia importa más que los cinco minutos de coche.</p>

<h2>Qué preguntar cuando llames desde fuera del municipio</h2>
<p>Si vas a desplazarte, hay tres preguntas que conviene resolver por teléfono antes de perder un viaje: si hay grupo de iniciación real o te meten con los veteranos, el horario completo de esa franja (no solo el día que te interesa), y si puedes hacer una clase de prueba. Con esas tres respuestas ya sabes si merece la pena el trayecto.</p>
<p>Y una recomendación específica para quien se desplaza: elige dos días a la semana, no tres. El tercer trayecto es siempre el primero que se cae en noviembre.</p>
`,

  'karate-en-sant-pere-de-ribes': `
<h2>Qué consta en Sant Pere de Ribes y qué implica</h2>
<p>En nuestro <a href="/centros/">directorio</a>, los cuatro centros verificados del municipio son de taekwondo. No nos consta ningún centro de karate en Sant Pere de Ribes con fuente pública comprobable, así que si el karate es tu objetivo, o el de tu hijo, tendrás que mirar hacia <a href="/sitges/">Sitges</a> o <a href="/vilanova-i-la-geltru/">Vilanova i la Geltrú</a>, donde el karate sí aparece con centros verificados.</p>

<h2>Antes de descartarlo: taekwondo está aquí mismo</h2>
<p>Si lo que buscas es una disciplina tradicional para tu hijo, con cinturones, etiqueta y progresión pautada, merece la pena que consideres el <a href="/taekwondo-en-sant-pere-de-ribes/">taekwondo del propio municipio</a> antes de comprometerte a desplazarte dos veces por semana durante todo el curso.</p>
<p>Karate y taekwondo comparten mucho más de lo que la gente cree: ambos son artes marciales de golpeo con progresión de cinturones, trabajo de formas y una fuerte carga de disciplina. El karate equilibra brazos y piernas y es algo más estructurado; el taekwondo carga el peso en las piernas, la velocidad y la flexibilidad. Para un niño de 6 años, la diferencia entre las dos importa mucho menos que la calidad del monitor y que el horario encaje. La comparativa detallada está en <a href="/blog/karate-vs-taekwondo-ninos-garraf/">karate o taekwondo para niños</a>.</p>

<h2>Si aun así quieres karate</h2>
<p>La distancia desde Ribes o Les Roquetes hasta Sitges o Vilanova ronda los 10-15 minutos. Es asumible para dos sesiones semanales, y con niños el factor crítico no es la distancia sino el encaje con la salida del colegio: un grupo infantil a las 17:30 en otro municipio raramente funciona. Pide el horario completo de los grupos por edad antes de decidirte, y haz el cálculo real de la tarde con tráfico.</p>
`,

  'muay-thai-en-sant-pere-de-ribes': `
<h2>El muay thai es el gran hueco del Garraf</h2>
<p>Conviene decirlo abiertamente porque es información útil: en nuestro <a href="/centros/">directorio de la comarca</a> no nos consta <strong>ningún</strong> centro (ni en Sant Pere de Ribes ni en el resto del Garraf) que anuncie muay thai con fuente pública verificable. No es una laguna de este municipio: es un hueco de toda la comarca.</p>
<p>Eso no significa que no exista. Significa que, si lo hay, no deja rastro público comprobable, y nosotros no publicamos como verificado lo que no podemos verificar. Si conoces un centro que lo imparta, <a href="/contacto/">escríbenos</a> y lo comprobamos.</p>

<h2>Qué hacer mientras tanto: kickboxing es el pariente cercano</h2>
<p>El <a href="/kickboxing/">kickboxing</a> sí tiene oferta verificada en la comarca, en varios centros de Sitges y Vilanova. Comparte con el muay thai el trabajo de puños y patadas, el formato de clase y buena parte del acondicionamiento. Lo que no incluye son codos, rodillas y clinch (el agarre de pie característico del muay thai). </p>
<p>Para el 80 % de quien busca muay thai por forma física y descarga de estrés, el kickboxing cubre el objetivo perfectamente. Si lo que te atrae es específicamente el clinch y el trabajo de rodillas, entonces sí tendrás que salir de la comarca: Barcelona y el Baix Penedès tienen más oferta.</p>

<h2>Cómo preguntar en un centro de kickboxing</h2>
<p>Muchos gimnasios agrupan las disciplinas de golpeo bajo etiquetas laxas, así que pregunta concretamente: si trabajan clinch, si se permiten rodillas y codos en los ejercicios por parejas y bajo qué protecciones. La respuesta te dirá si ese centro está más cerca del kickboxing puro o del muay thai real, más allá de cómo lo llamen en la web.</p>
`,

  'taekwondo-en-sant-pere-de-ribes': `
<h2>Aquí sí: Sant Pere de Ribes es el municipio del taekwondo</h2>
<p>Es la excepción feliz de este municipio. En nuestro <a href="/centros/">directorio del Garraf</a>, los cuatro centros de Sant Pere de Ribes con fuente pública verificable enseñan taekwondo. Es decir: la disciplina que en otros municipios obliga a desplazarse, aquí la tienes en casa y con cuatro opciones entre Ribes y Les Roquetes.</p>
<p>Uno de los centros consta a través del registro de clubes de la federación catalana, lo que aporta una capa de verificación adicional: significa actividad federada, con acceso al circuito de competición oficial para quien lo quiera. Otros dos siguen la línea ITF del taekwon-do, distinta de la olímpica en reglamento y en formas: si tu objetivo es competir, pregunta en cuál compite cada club antes de elegir.</p>

<h2>Qué implica tener dos opciones en el municipio</h2>
<p>Más de lo que parece. Puedes hacer clase de prueba en los dos antes de decidir, comparar horarios y quedarte con el que encaje mejor con la tarde de tu familia, sin sumar un trayecto de 15 minutos. En artes marciales infantiles, esa comodidad es el mejor seguro contra el abandono: los grupos que sobreviven al invierno son los que están cerca de casa.</p>
<p>Aprovéchalo bien: visita los dos, observa una clase completa en la franja real de entrenamiento, y compara cómo separan los grupos por edad y cómo corrigen a un niño que lo hace mal.</p>

<h2>Federado o no federado: qué cambia</h2>
<p>Si el club está federado, tu hijo puede acceder al circuito de competición y a los exámenes de grado oficiales. Si no lo está, la práctica es exactamente igual de válida como actividad, pero los cinturones pueden no tener reconocimiento fuera de esa escuela. No es mejor ni peor: es una pregunta que conviene hacer al matricularse, especialmente si intuyes que a tu hijo le va a gustar competir.</p>
<p>Recuerda que la competición debe plantearse siempre como opción voluntaria. Si en la visita te la presentan como una expectativa, es una señal a tener en cuenta.</p>
`,

  'defensa-personal-en-sant-pere-de-ribes': `
<h2>Qué consta en el municipio</h2>
<p>En nuestro <a href="/centros/">directorio</a>, uno de los cuatro centros verificados de Sant Pere de Ribes anuncia defensa personal: Spartae, en la calle Lluís Companys, que la ofrece junto a taekwon-do ITF, Jeet Kune Do, kali filipino y wing chun. Es una combinación poco común y encaja con quien busca autodefensa con base técnica. Si prefieres comparar con más oferta, en <a href="/sitges/">Sitges</a> y <a href="/vilanova-i-la-geltru/">Vilanova i la Geltrú</a>, a 10-15 minutos, hay siete centros más que la anuncian.</p>

<h2>Cuidado con los cursos exprés</h2>
<p>La defensa personal es el terreno donde más marketing hay y donde más fácil resulta pagar por poco. Es habitual que aparezcan cursos puntuales de fin de semana, a veces organizados en equipamientos municipales o por entidades locales. Pueden estar bien como primera toma de contacto, pero conviene tener claras dos cosas.</p>
<p>La primera: un curso de cuatro horas no te enseña a defenderte. Te enseña a reconocer situaciones y te da un par de respuestas gruesas, lo cual ya es valioso, pero la capacidad de reaccionar bajo estrés se construye con repetición a lo largo de meses. La segunda: pregunta siempre quién imparte y qué formación tiene. En esta disciplina no hay una titulación única y reconocida, así que la trayectoria del instructor es lo único que puedes evaluar.</p>

<h2>Cómo se ve un programa serio, en cuatro señales</h2>
<ul>
<li><strong>Trabaja prevención, no solo técnica.</strong> La mayor parte de la autodefensa real ocurre antes del contacto físico: distancia, entorno, voz, evitación.</li>
<li><strong>Las técnicas son pocas y gruesas.</strong> Si el programa enseña veinte respuestas distintas, ninguna estará disponible bajo estrés. Cinco bien entrenadas valen más.</li>
<li><strong>Hay presión progresiva.</strong> Practicar con un compañero que colabora está bien para aprender el movimiento; si nunca se sube la intensidad, no sabes si funciona.</li>
<li><strong>No promete resultados rápidos.</strong> Quien te dice que en un fin de semana estarás preparada te está vendiendo tranquilidad, no capacidad.</li>
</ul>
<p>Si buscas específicamente un enfoque femenino, tienes más detalle en la <a href="/blog/defensa-personal-para-mujeres-garraf/">guía de defensa personal para mujeres del Garraf</a>.</p>
`,

  'taekwondo-en-cubelles': `
<h2>La disciplina que sí tienes en Cubelles</h2>
<p>El taekwondo es, según nuestro <a href="/centros/">directorio del Garraf</a>, la disciplina con más presencia en Cubelles: la enseñan los dos centros verificados del municipio. Para un municipio de este tamaño no es poca cosa: significa que puedes entrenar, o apuntar a tus hijos, sin sumar veinte minutos de coche a cada sesión.</p>
<p>Si tenías otra disciplina en mente pero no una preferencia muy marcada, merece la pena que valores esto con calma. La cercanía es, con diferencia, el factor que mejor predice si alguien sigue entrenando dentro de un año. Un taekwondo a cinco minutos de casa gana casi siempre a un karate excelente a veinte.</p>

<h2>Qué es realmente el taekwondo, sin el tópico de las patadas</h2>
<p>Sí, es el arte de las piernas: patadas altas, velocidad, flexibilidad. Pero lo que se lleva un niño a casa no son las patadas, sino tres cosas menos vistosas: capacidad de sostener la atención en una tarea repetitiva, tolerancia a la frustración, y un sistema de progreso (los cinturones) que da sensación de avance sin necesidad de ganar a nadie.</p>
<p>Es deporte olímpico desde Seúl 1988 y una de las artes marciales más practicadas por niños en España, lo que tiene una ventaja práctica: hay metodología muy rodada para las edades tempranas.</p>

<h2>Antes de matricularte, dos preguntas concretas</h2>
<p><strong>¿Está federado el club?</strong> Si lo está, hay acceso al circuito de competición catalán y a exámenes de grado oficiales. Si no, la práctica vale igual como actividad, pero los cinturones pueden no tener reconocimiento fuera de la escuela.</p>
<p><strong>¿Cómo se separan los grupos por edad este curso?</strong> Es la pregunta que más información da sobre la calidad de un grupo infantil. Un único grupo de 4 a 12 años no funciona por mucho que el instructor sea bueno.</p>
<p>Y si quieres comparar antes de decidir, en <a href="/vilanova-i-la-geltru/">Vilanova</a>, a diez minutos por la C-31, tienes también karate y judo verificados. La comparativa está en <a href="/blog/karate-vs-taekwondo-ninos-garraf/">karate o taekwondo para niños</a>.</p>
`,

  'boxeo-en-cubelles': `
<h2>Boxeo en Cubelles: hay una opción dentro, y más a diez minutos</h2>
<p>En nuestro <a href="/centros/">directorio</a> consta un centro de Cubelles que anuncia boxeo: GYM FYS Fitness &amp; Defense, en el Passatge Soletat, que lo ofrece junto a taekwondo, MMA y krav maga. Según su web, abre de lunes a viernes por la mañana y por la tarde; los horarios de cada grupo se preguntan en la primera llamada.</p>
<p>Si quieres comparar, <a href="/vilanova-i-la-geltru/">Vilanova i la Geltrú</a> es municipio contiguo: por la C-31 el trayecto ronda los diez minutos, y allí cuatro centros verificados anuncian boxeo. Más centros significan más franjas horarias, que es lo que de verdad determina si el plan aguanta más de tres meses.</p>

<h2>La otra dirección: Cunit y Calafell</h2>
<p>Cubelles está en el límite del Garraf, y hacia el suroeste tiene Cunit y Calafell a pocos minutos, ya en el Baix Penedès. Nuestro directorio cubre solo los seis municipios de la comarca, así que esa oferta no está verificada aquí, pero si vives en la zona oeste del municipio puede quedarte igual de cerca. Vale la pena mirar las dos direcciones antes de decidir.</p>

<h2>Qué necesitas para la primera clase (menos de lo que crees)</h2>
<p>Ropa deportiva, agua y toalla. En la mayoría de gimnasios prestan guantes las primeras sesiones, así que no compres nada hasta haber probado. Cuando decidas continuar, lo primero que conviene comprar son las vendas, protegen las manos y son baratas; los guantes propios vienen después.</p>
<p>Y el miedo más común: no, no te van a poner a pegarte con nadie el primer día. En un gimnasio serio las clases de iniciación son técnicas, sobre saco y manoplas, y el sparring llega mucho más tarde, es progresivo y siempre opcional. Si en tu clase de prueba ves lo contrario, cambia de gimnasio.</p>
`,

  'defensa-personal-en-cubelles': `
<h2>Qué hay en Cubelles</h2>
<p>En nuestro <a href="/centros/">directorio</a> constan dos centros en Cubelles y ninguno anuncia un programa con el nombre de defensa personal. Lo más parecido dentro del municipio es el <a href="/krav-maga/">krav maga</a> de GYM FYS Fitness &amp; Defense, que es un sistema de autodefensa y es el único de toda la comarca. Si buscas un programa de defensa personal propiamente dicho, la oferta verificada más cercana está en <a href="/vilanova-i-la-geltru/">Vilanova i la Geltrú</a>, a unos diez minutos por la C-31.</p>

<h2>Un arte marcial no es lo mismo que defensa personal (y a veces basta igual)</h2>
<p>Es una confusión habitual y merece la pena aclararla. Un arte marcial te da control corporal, distancia, capacidad de reaccionar bajo contacto y confianza física: todo eso transfiere a una situación real. Lo que no te da es lo específico de la autodefensa (prevención, gestión verbal, escenarios sin reglas, respuesta ante agarres inesperados). </p>
<p>En la práctica, para muchas personas entrenar una disciplina de forma continuada aporta más seguridad real que un curso de defensa personal de fin de semana, simplemente porque la repetición durante meses construye respuestas automáticas y el curso puntual no. Si en Cubelles la opción cómoda es el taekwondo del municipio, no es un mal punto de partida.</p>

<h2>Si buscas un programa específico, cómo evaluarlo</h2>
<ul>
<li><strong>Prevención antes que técnica.</strong> La mayor parte de la autodefensa ocurre antes del contacto: distancia, entorno, voz, salir de la situación.</li>
<li><strong>Pocas técnicas, bien entrenadas.</strong> Cinco respuestas gruesas disponibles bajo estrés valen más que veinte que no recordarás.</li>
<li><strong>Presión progresiva.</strong> Si el compañero siempre colabora, no sabes si lo que haces funciona.</li>
<li><strong>Sin promesas rápidas.</strong> Quien vende capacidad en un fin de semana está vendiendo tranquilidad.</li>
<li><strong>Instructor con trayectoria verificable.</strong> No hay titulación única en esta disciplina, así que su recorrido es lo único evaluable.</li>
</ul>
<p>Si buscas un enfoque femenino, la <a href="/blog/defensa-personal-para-mujeres-garraf/">guía de defensa personal para mujeres del Garraf</a> entra en el detalle.</p>
`,

  'muay-thai-en-sitges': `
<h2>Antes de buscar: el muay thai no consta en el Garraf</h2>
<p>Empezamos por lo importante. En nuestro <a href="/centros/">directorio de la comarca</a> no nos consta ningún centro (ni en Sitges ni en ningún otro municipio del Garraf) que anuncie muay thai con fuente pública verificable. Es un hueco de toda la comarca, no una carencia de Sitges.</p>
<p>Puede existir sin dejar rastro público comprobable, y por eso no afirmamos que no exista: afirmamos que no lo hemos podido verificar, que no es lo mismo. Si conoces un centro que lo imparta, <a href="/contacto/">dínoslo</a> y lo comprobamos.</p>

<h2>Qué sí tienes en Sitges dentro del mismo terreno</h2>
<p>De los tres centros de Sitges verificados en el directorio, varios anuncian <a href="/kickboxing-en-sitges/">kickboxing</a>, que es el pariente cercano del muay thai: mismo formato de clase, mismo trabajo de puños y patadas, mismo acondicionamiento. Lo que no incluye son codos, rodillas y clinch.</p>
<p>Para la mayoría de quien busca muay thai por forma física, técnica de golpeo y descarga de estrés, el kickboxing cubre el objetivo. Si lo que te atrae es específicamente el clinch (el agarre de pie con rodillas, que es la firma del muay thai), ahí sí notarás la diferencia y probablemente tendrás que salir de la comarca.</p>

<h2>Cómo saber qué imparte realmente un gimnasio</h2>
<p>Las etiquetas se usan con bastante alegría en el mundo del striking, así que pregunta cosas concretas en lugar de fiarte del nombre de la clase: si se trabaja clinch, si se permiten rodillas y codos en el trabajo por parejas, con qué protecciones, y qué trayectoria tiene el instructor en muay thai específicamente. Con esas cuatro respuestas sabes dónde estás, se llame como se llame la actividad.</p>

<h2>Si te desplazas fuera de la comarca</h2>
<p>Sitges está bien conectada con Barcelona, donde la oferta de muay thai es amplia. Antes de comprometerte, haz el cálculo realista: un trayecto largo dos veces por semana se sostiene unos meses; tres veces por semana, rara vez. Si tu objetivo principal es entrenar de forma continuada, un kickboxing en tu municipio suele ganarle a un muay thai excelente a cuarenta minutos.</p>
`,

  'muay-thai-en-vilanova-i-la-geltru': `
<h2>El hueco más claro del mercado local</h2>
<p>Vilanova i la Geltrú concentra siete de los centros verificados del Garraf en nuestro <a href="/centros/">directorio</a> y cubre casi todas las disciplinas de la comarca. Casi. El muay thai no aparece en ninguno de ellos con fuente pública comprobable, ni aquí ni en el resto del Garraf.</p>
<p>Resulta llamativo precisamente porque Vilanova tiene la mayor densidad de gimnasios de golpeo de la zona: hay boxeo, hay kickboxing, hay K-1 en un centro y hay MMA en varios. El muay thai como tal, no. Si eres dueño de un centro y estás leyendo esto, ahí tienes un dato de mercado gratis.</p>

<h2>Lo más parecido que sí tienes aquí</h2>
<ul>
<li><strong><a href="/kickboxing-en-vilanova-i-la-geltru/">Kickboxing</a>:</strong> puños y patadas, mismo formato de clase y acondicionamiento. Le faltan codos, rodillas y clinch.</li>
<li><strong>K-1:</strong> consta en un centro del directorio. Es un reglamento de striking que sí permite rodillas y un clinch muy breve, así que está a medio camino entre el kickboxing y el muay thai. Si buscas muay thai, es probablemente lo más cercano que vas a encontrar en la comarca.</li>
<li><strong><a href="/mma-en-vilanova-i-la-geltru/">MMA</a>:</strong> incorpora el trabajo de clinch y rodillas dentro de un sistema más amplio que además incluye derribo y suelo.</li>
</ul>

<h2>Cómo preguntar para no llevarte una sorpresa</h2>
<p>En striking, el nombre de la clase dice poco. Pregunta directamente: ¿se trabaja clinch? ¿Se permiten rodillas y codos en el trabajo por parejas, y con qué protecciones? ¿Qué recorrido tiene el instructor en muay thai concretamente? Un centro serio responde estas tres sin rodeos, y las respuestas te sitúan mucho mejor que cualquier web.</p>

<h2>Qué esperar del entrenamiento, si acabas encontrándolo</h2>
<p>El muay thai es de las disciplinas de golpeo más exigentes físicamente, y las primeras semanas duelen: espinillas, antebrazos y una sensación general de estar hecho polvo que se pasa hacia el segundo mes. A cambio, la progresión es rápida y muy visible. El contacto real llega de forma progresiva y, en cualquier centro serio, siempre es opcional.</p>
`,

  'krav-maga-en-sitges': `
<h2>En Sitges no consta krav maga, y en todo el Garraf solo un centro</h2>
<p>Es una de las disciplinas más buscadas de la comarca y una de las que menos existe en ella. En nuestro <a href="/centros/">directorio</a> no nos consta ningún centro en Sitges que imparta krav maga con fuente pública verificable. En toda la comarca solo lo anuncia uno: GYM FYS Fitness &amp; Defense, en <a href="/cubelles/">Cubelles</a>, a unos 20 minutos en coche.</p>
<p>Esto tiene una consecuencia práctica importante: si te encuentras otra oferta de krav maga en la zona, verifícala con más cuidado del habitual. Es un terreno donde la etiqueta se usa como reclamo comercial con bastante frecuencia.</p>

<h2>Qué es realmente el krav maga</h2>
<p>Un sistema de defensa desarrollado en el ámbito militar israelí, sin componente deportivo ni competición: no hay reglamento, no hay categorías de peso y el objetivo técnico es neutralizar una amenaza y salir. Se apoya en pocos movimientos, gruesos y basados en reacciones instintivas, entrenados bajo estrés creciente.</p>
<p>Eso lo hace muy eficaz para su propósito y bastante limitado para otros: si buscas una práctica que te acompañe años, con progresión técnica fina y comunidad, el krav maga no es lo que buscas. Si buscas herramientas de autodefensa en el menor tiempo posible, sí.</p>

<h2>Cómo verificar a un instructor, en tres pasos</h2>
<ol>
<li><strong>Pregunta por la certificación y quién la emite.</strong> Existen varias organizaciones internacionales de krav maga y ninguna tiene el monopolio, pero todas emiten credenciales verificables. "Me formé con un instructor israelí" no es una credencial.</li>
<li><strong>Pregunta cuántos años lleva impartiendo</strong> y cómo estructura la progresión. Un sistema serio tiene un programa por niveles, no una colección de técnicas sueltas.</li>
<li><strong>Desconfía de las promesas rápidas.</strong> Quien te garantiza que en un mes estarás preparado para una agresión real te está vendiendo tranquilidad, no capacidad.</li>
</ol>

<h2>Qué hacer mientras tanto en Sitges</h2>
<p>De los tres centros verificados del municipio, varios anuncian <a href="/defensa-personal-en-sitges/">defensa personal</a>, que persigue el mismo objetivo con un enfoque menos sistematizado pero perfectamente válido. Y si tu prioridad es la eficacia bajo presión con alguien más grande que tú, el <a href="/jiu-jitsu-brasileno-en-sitges/">jiu jitsu brasileño</a>, que sí tiene centros verificados en Sitges, entrena exactamente eso todos los días, aunque no se venda como autodefensa.</p>
`,

  'krav-maga-en-vilanova-i-la-geltru': `
<h2>En Vilanova no consta krav maga: el más cercano está en Cubelles</h2>
<p>Vilanova i la Geltrú reúne siete centros verificados en nuestro <a href="/centros/">directorio</a>, más que ningún otro municipio del Garraf, y cubre desde el boxeo hasta el judo pasando por el aikido o el kyokushin. Aun así, no nos consta ninguno que imparta krav maga con fuente pública comprobable.</p>
<p>El único centro de la comarca que lo anuncia es GYM FYS Fitness &amp; Defense, en <a href="/cubelles/">Cubelles</a>, municipio contiguo a unos diez minutos por la C-31. Para un vecino de Vilanova, sobre todo de la zona oeste, es un desplazamiento asumible dos veces por semana. Aparte de ese centro, es con el <a href="/muay-thai-en-vilanova-i-la-geltru/">muay thai</a> el hueco más claro del mercado local: mucha demanda de búsqueda y casi ninguna oferta verificable.</p>

<h2>Qué es y para quién tiene sentido</h2>
<p>El krav maga es un sistema de defensa de origen militar israelí, sin competición ni reglamento deportivo. Trabaja pocas técnicas, gruesas, apoyadas en reacciones instintivas y entrenadas bajo presión creciente, con un objetivo único: neutralizar la amenaza y salir.</p>
<p>Tiene sentido si tu prioridad es adquirir herramientas de autodefensa en poco tiempo. No lo tiene tanto si buscas una práctica de años con progresión técnica fina, comunidad y competición: para eso hay opciones mucho mejores, y varias sí existen en Vilanova.</p>

<h2>Si encuentras una oferta, verifícala así</h2>
<ul>
<li><strong>Certificación y organización emisora.</strong> Hay varias federaciones internacionales de krav maga; ninguna tiene el monopolio, pero todas emiten credenciales comprobables.</li>
<li><strong>Programa por niveles.</strong> Un sistema serio tiene progresión estructurada, no una lista de técnicas sueltas.</li>
<li><strong>Años impartiendo</strong>, no años practicando. Son cosas distintas.</li>
<li><strong>Ninguna promesa de resultados en semanas.</strong> Es la señal de alarma más fiable de todas.</li>
</ul>

<h2>Las alternativas que sí tienes en Vilanova</h2>
<p>La <a href="/defensa-personal-en-vilanova-i-la-geltru/">defensa personal</a> consta en varios centros verificados del municipio y persigue el mismo objetivo con un enfoque menos sistematizado. Si tu preocupación concreta es defenderte de alguien más grande y más fuerte, el <a href="/jiu-jitsu-brasileno-en-vilanova-i-la-geltru/">jiu jitsu brasileño</a> entrena precisamente esa situación en cada sesión, aunque no se venda con ese envoltorio. Y si buscas específicamente un enfoque femenino, tienes la <a href="/defensa-personal-femenina-en-vilanova/">guía de defensa personal femenina en Vilanova</a>.</p>
`,

  'defensa-personal-femenina-en-sitges': `
<h2>Por qué esta guía existe aparte de la general</h2>
<p>No porque las mujeres necesiten técnicas distintas (la base es la misma), sino porque los escenarios que más preocupan son otros y porque hay barreras de entrada que un hombre no se plantea: si habrá grupo femenino, si te sentirás observada aprendiendo, si te van a tocar sin avisar para corregirte. Todo eso condiciona qué centro elegir, y por eso merece una guía propia. La versión sin enfoque de género está en <a href="/defensa-personal-en-sitges/">defensa personal en Sitges</a>.</p>

<h2>Las cuatro capas de la autodefensa, por orden de utilidad real</h2>
<ol>
<li><strong>Prevención.</strong> Conciencia del entorno, evitar situaciones, no normalizar lo que incomoda. Es donde se resuelve la inmensa mayoría de los casos, y es lo que menos se entrena en los cursos que se anuncian.</li>
<li><strong>Límites verbales.</strong> Postura, tono, distancia y una frase clara. Suena poco marcial y es de lo más eficaz que existe.</li>
<li><strong>Salida física.</strong> Romper un agarre, crear distancia y correr. No "ganar": salir. Este es el objetivo técnico real.</li>
<li><strong>Última instancia.</strong> Golpes a zonas blandas cuando ya no hay alternativa.</li>
</ol>
<p>Un programa que dedica todo el tiempo a la capa cuatro y ninguno a la uno está mal ordenado, por espectacular que resulte.</p>

<h2>Qué preguntar en Sitges concretamente</h2>
<p>De los tres centros de Sitges verificados en nuestro <a href="/centros/">directorio</a>, varios anuncian defensa personal. Lo que ninguna web te va a decir (y cambia por temporadas) es si ahora mismo hay grupo exclusivamente femenino. Pregúntalo pidiendo día y hora concretos: "los martes y jueves a las 19 h" es una respuesta; "sí, tenemos muchas chicas" no lo es.</p>
<p>Si no hay grupo femenino, pregunta en qué franja horaria entrenan más mujeres. Un grupo mixto con ocho mujeres a las 19 h es una experiencia muy distinta de uno con una sola a las 21:30.</p>

<h2>Señales de un centro que te va a tratar bien</h2>
<p>Se detectan en una sola clase de prueba y no requieren saber nada de artes marciales: el instructor avisa antes de corregir con contacto, el trabajo por parejas sube de intensidad de forma graduada y se puede parar en cualquier momento, nadie comenta tu forma física, y hay más de una mujer entrenando de forma habitual.</p>
<p>Para ampliar, tienes <a href="/clases-para-mujeres-en-sitges/">artes marciales para mujeres en Sitges</a> (si además de autodefensa te interesa la forma física) y el artículo <a href="/blog/defensa-personal-para-mujeres-garraf/">qué funciona de verdad en defensa personal para mujeres</a>.</p>
`,

  'defensa-personal-femenina-en-vilanova': `
<h2>Vilanova te da algo que el resto de la comarca no: poder elegir</h2>
<p>Con siete centros verificados en nuestro <a href="/centros/">directorio</a>, Vilanova i la Geltrú es el municipio del Garraf donde más probabilidades tienes de encontrar lo que buscas exactamente: un grupo femenino, un horario compatible o simplemente un ambiente en el que te sientas cómoda. En un municipio con un solo centro, aceptas lo que hay. Aquí puedes comparar. La guía sin enfoque de género está en <a href="/defensa-personal-en-vilanova-i-la-geltru/">defensa personal en Vilanova i la Geltrú</a>.</p>

<h2>Lo que de verdad se entrena, por orden de importancia</h2>
<ol>
<li><strong>Prevención y lectura del entorno.</strong> Aquí se resuelve la mayoría de situaciones reales, y es lo que menos aparece en los anuncios porque no es vistoso.</li>
<li><strong>Límites verbales.</strong> Postura, tono, distancia, una frase clara. Extraordinariamente eficaz y muy poco entrenado.</li>
<li><strong>Salir, no ganar.</strong> Romper agarres, crear distancia, marcharse. El objetivo técnico no es vencer a nadie.</li>
<li><strong>Golpes como último recurso</strong>, a zonas blandas, cuando ya no queda alternativa.</li>
</ol>
<p>Si un programa dedica el 90 % del tiempo al punto cuatro, está mal ordenado, por mucho que las clases resulten intensas.</p>

<h2>Dos alternativas que quizá no has considerado</h2>
<p>El <a href="/jiu-jitsu-brasileno-en-vilanova-i-la-geltru/">jiu jitsu brasileño</a>, que sí tiene varios centros verificados en Vilanova, es probablemente la disciplina donde una persona más pequeña puede controlar a una más grande con más fiabilidad, porque se basa íntegramente en palanca y posición. Muchas mujeres llegan buscando defensa personal y se quedan años en BJJ.</p>
<p>El <a href="/krav-maga/">krav maga</a> es el sistema que más se busca en la comarca para autodefensa, pero conviene que lo sepas: no nos consta ningún centro con fuente pública verificable que lo imparta en Vilanova. El único del Garraf está en <a href="/cubelles/">Cubelles</a>, a unos diez minutos. Si te lo ofrecen en otro sitio, pide la certificación y la organización que la emite.</p>

<h2>Cómo saber si un centro te va a tratar bien</h2>
<p>Cuatro señales visibles en una clase de prueba, sin necesidad de entender de artes marciales: avisan antes de corregir con contacto, la intensidad del trabajo por parejas sube de forma graduada y se puede parar, nadie comenta tu forma física, y hay más de una mujer entrenando habitualmente.</p>
<p>Para ampliar: <a href="/clases-para-mujeres-en-vilanova/">artes marciales para mujeres en Vilanova</a> y el artículo <a href="/blog/defensa-personal-para-mujeres-garraf/">qué funciona de verdad en defensa personal para mujeres</a>.</p>
`,
};

/** FAQ propias de las money pages con cuerpo específico. */
export const MONEY_FAQS: Record<string, { q: string; a: string }[]> = {
  'boxeo-en-sant-pere-de-ribes': [
    { q: '¿Hay boxeo en Sant Pere de Ribes?', a: 'No nos consta. Los cuatro centros del municipio verificados en nuestro directorio son de taekwondo. Para boxeo, la oferta verificada más cercana está en Sitges y en Vilanova i la Geltrú, a 10-15 minutos en coche.' },
    { q: '¿Me conviene más Sitges o Vilanova?', a: 'Depende del núcleo desde el que salgas: desde Les Roquetes suele salir mejor Sitges y desde Ribes, Vilanova. En oferta, Vilanova reúne siete centros verificados frente a tres de Sitges, lo que se traduce en más franjas horarias.' },
  ],
  'karate-en-sant-pere-de-ribes': [
    { q: '¿Hay karate en Sant Pere de Ribes?', a: 'No nos consta ningún centro de karate en el municipio con fuente pública verificable. Los cuatro centros verificados son de taekwondo. Para karate, las opciones más cercanas están en Sitges y Vilanova i la Geltrú.' },
    { q: '¿Es muy distinto el taekwondo del municipio para un niño?', a: 'Menos de lo que parece: ambos son artes marciales de golpeo con cinturones, formas y fuerte carga de disciplina. El karate equilibra brazos y piernas; el taekwondo carga en piernas, velocidad y flexibilidad. A los 6 años pesa mucho más el monitor y el horario.' },
  ],
  'muay-thai-en-sant-pere-de-ribes': [
    { q: '¿Hay muay thai en el Garraf?', a: 'A fecha de la última verificación, no nos consta ningún centro de la comarca (tampoco en Sant Pere de Ribes) que anuncie muay thai con fuente pública comprobable. Es un hueco de todo el Garraf, no solo de este municipio.' },
    { q: '¿El kickboxing me sirve si buscaba muay thai?', a: 'Para la mayoría de objetivos, sí: comparten puños, patadas, formato de clase y acondicionamiento. Lo que no incluye son codos, rodillas y clinch. Si te interesa específicamente eso, tendrás que salir de la comarca.' },
  ],
  'taekwondo-en-sant-pere-de-ribes': [
    { q: '¿Cuántos centros de taekwondo hay en Sant Pere de Ribes?', a: 'En nuestro directorio constan cuatro, y son los cuatro centros del municipio con fuente pública verificable: Associació de Taekwondo SANPO (Les Roquetes), Esportiu TKD Ribes, Spartae y Taekwon-do Club Taijitu. Es el municipio del Garraf con más clubs de taekwondo.' },
    { q: '¿Qué cambia si el club está federado?', a: 'Da acceso al circuito de competición catalán y a exámenes de grado oficiales. Si no lo está, la práctica es igual de válida como actividad, pero los cinturones pueden no tener reconocimiento fuera de esa escuela. Pregúntalo al matricularte.' },
  ],
  'defensa-personal-en-sant-pere-de-ribes': [
    { q: '¿Hay defensa personal en Sant Pere de Ribes?', a: 'Sí. En nuestro directorio consta un centro que la anuncia: Spartae, en la calle Lluís Companys, que la combina con taekwon-do ITF, Jeet Kune Do, kali filipino y wing chun. Para comparar con más opciones, Sitges y Vilanova están a 10-15 minutos.' },
    { q: '¿Sirve un curso de defensa personal de fin de semana?', a: 'Como primera toma de contacto puede estar bien: te enseña a reconocer situaciones y te da un par de respuestas gruesas. Pero reaccionar bajo estrés se construye con repetición durante meses. Desconfía de quien prometa capacidad real en un fin de semana.' },
  ],
  'taekwondo-en-cubelles': [
    { q: '¿Hay taekwondo en Cubelles?', a: 'Sí. Es la única disciplina con centro verificado dentro del municipio en nuestro directorio, lo que permite entrenar sin sumar desplazamiento. Confirma horarios y grupos por edad directamente con el centro.' },
    { q: '¿Debería apuntar a mi hijo aquí o buscar en Vilanova?', a: 'Si no tiene una preferencia clara por otra disciplina, la cercanía gana casi siempre: es el factor que mejor predice que siga entrenando dentro de un año. En Vilanova, a diez minutos, tienes además karate y judo verificados si quieres comparar.' },
  ],
  'boxeo-en-cubelles': [
    { q: '¿Hay boxeo en Cubelles?', a: 'Sí. GYM FYS Fitness & Defense, en el Passatge Soletat, anuncia boxeo junto a taekwondo, MMA y krav maga. Si quieres más horarios donde elegir, Vilanova i la Geltrú es municipio contiguo, a unos diez minutos por la C-31, con cuatro centros verificados que anuncian boxeo.' },
    { q: '¿Qué necesito comprar para empezar?', a: 'Nada al principio. Ropa deportiva, agua y toalla; en la mayoría de gimnasios prestan guantes las primeras sesiones. Cuando decidas continuar, lo primero son las vendas; los guantes propios vienen después.' },
  ],
  'muay-thai-en-sitges': [
    { q: '¿Hay muay thai en Sitges?', a: 'No nos consta ningún centro de Sitges (ni del resto del Garraf) que lo anuncie con fuente pública verificable. Es un hueco de toda la comarca. Lo más cercano disponible en el municipio es el kickboxing.' },
    { q: '¿Cómo sé si una clase es muay thai o kickboxing en realidad?', a: 'Pregunta si se trabaja clinch, si se permiten rodillas y codos en el trabajo por parejas y con qué protecciones, y qué trayectoria tiene el instructor en muay thai concretamente. Las etiquetas de las clases dicen poco.' },
  ],
  'muay-thai-en-vilanova-i-la-geltru': [
    { q: '¿Hay muay thai en Vilanova i la Geltrú?', a: 'No nos consta, pese a que Vilanova reúne siete centros verificados y la mayor densidad de gimnasios de golpeo de la comarca. Hay boxeo, kickboxing, K-1 y MMA verificados, pero no muay thai con fuente pública comprobable.' },
    { q: '¿El K-1 se parece al muay thai?', a: 'Bastante: es un reglamento de striking que permite rodillas y un clinch muy breve, así que queda a medio camino entre el kickboxing y el muay thai. En el directorio consta un centro del municipio que lo imparte.' },
  ],
  'krav-maga-en-sitges': [
    { q: '¿Hay krav maga en Sitges?', a: 'No nos consta ningún centro en Sitges que lo imparta con fuente pública verificable. En todo el Garraf solo lo anuncia uno, GYM FYS Fitness & Defense, en Cubelles. Si encuentras otra oferta en la zona, verifica la certificación del instructor y la organización que la emite antes de pagar.' },
    { q: '¿Qué diferencia hay entre krav maga y defensa personal?', a: 'El krav maga es un sistema concreto de origen militar israelí, con programa por niveles y sin componente deportivo. "Defensa personal" es una categoría más amplia que agrupa enfoques distintos. Ambas persiguen lo mismo; el krav maga está más sistematizado.' },
  ],
  'krav-maga-en-vilanova-i-la-geltru': [
    { q: '¿Hay krav maga cerca de Vilanova i la Geltrú?', a: 'En Vilanova no nos consta, y es llamativo porque reúne siete centros verificados que cubren desde el boxeo hasta el aikido. El más cercano está en Cubelles, municipio contiguo: GYM FYS Fitness & Defense, a unos diez minutos por la C-31, es el único centro del Garraf que anuncia krav maga.' },
    { q: '¿Qué alternativas tengo en el municipio?', a: 'La defensa personal consta en varios centros verificados de Vilanova. Y si tu preocupación es defenderte de alguien más grande, el jiu jitsu brasileño entrena exactamente esa situación en cada sesión, aunque no se venda como autodefensa.' },
  ],
  'defensa-personal-en-cubelles': [
    { q: '¿Hay defensa personal en Cubelles?', a: 'Con ese nombre, no nos consta ningún programa en el municipio. Lo más cercano es el krav maga de GYM FYS Fitness & Defense, que es un sistema de autodefensa. Para un programa de defensa personal propiamente dicho, la oferta más cercana está en Vilanova i la Geltrú, a unos diez minutos por la C-31.' },
    { q: '¿Un arte marcial me sirve como defensa personal?', a: 'Parcialmente, y a veces basta: aporta control corporal, distancia, reacción bajo contacto y confianza. Lo que no cubre es lo específico (prevención, gestión verbal, escenarios sin reglas). Entrenar de forma continuada suele dar más seguridad real que un curso puntual.' },
  ],
};

/** FAQ propias de las páginas de perfil, además de las genéricas. */
export const PERFIL_FAQS: Record<string, { q: string; a: string }[]> = {
  'clases-infantiles-en-sitges': [
    { q: '¿Hay judo para niños en Sitges?', a: 'A fecha de la última verificación de nuestro directorio, no nos consta ningún centro de judo en Sitges con fuente pública comprobable. Para judo infantil, la referencia de la comarca es Vilanova i la Geltrú, a 10-15 minutos en coche.' },
    { q: '¿Qué disciplinas infantiles sí constan en Sitges?', a: 'Entre los centros verificados del municipio hay karate, kickboxing, jiu jitsu brasileño, MMA, boxeo y defensa personal, y dos de los tres centros anuncian explícitamente grupos infantiles. Confirma siempre las franjas de edad directamente con el centro.' },
    { q: '¿Cuándo debo apuntar a mi hijo?', a: 'En septiembre, con el inicio del curso: es cuando se forman los grupos por edad. Incorporarse a mitad de curso es posible, pero el niño entra en un grupo ya cohesionado y con contenidos avanzados.' },
  ],
  'clases-infantiles-en-vilanova': [
    { q: '¿Puedo elegir entre karate, judo y taekwondo en Vilanova?', a: 'Sí, y es el único municipio del Garraf donde las tres constan con fuente pública verificable en nuestro directorio. Eso te permite visitar las tres antes de decidir, algo que en el resto de la comarca no es posible.' },
    { q: '¿Cuál de las tres es mejor para mi hijo?', a: 'Ninguna en abstracto. Como orientación: karate si necesita marco y estructura, judo si es muy físico y necesita descargar, taekwondo si tiene mucha energía y disfruta del movimiento rápido. La calidad del monitor pesa más que la disciplina.' },
    { q: '¿Vale la pena venir desde Cubelles o Canyelles?', a: 'Es lo que hacen muchas familias, porque Vilanova concentra la oferta de la comarca. Con dos sesiones semanales se sostiene bien; el factor crítico no es la distancia sino que el horario del grupo infantil encaje con la salida del colegio.' },
  ],
  'clases-para-adultos-en-sitges': [
    { q: '¿Soy mayor para empezar artes marciales?', a: 'No. En cualquier grupo de adultos de la comarca hay gente de 35, 45 y 55 años. Lo que cambia con la edad no es la capacidad de aprender, sino el tiempo de recuperación entre sesiones.' },
    { q: '¿Tengo que estar en forma antes de apuntarme?', a: 'Al revés: el entrenamiento es lo que te pone en forma. Todas las clases de iniciación asumen que llegas sin base física ni experiencia previa.' },
    { q: '¿Qué disciplinas para adultos constan en Sitges?', a: 'Los centros verificados del municipio cubren kickboxing, boxeo, MMA, jiu jitsu brasileño, karate y defensa personal. Si buscas disciplinas tradicionales como judo o taekwondo, no nos constan en Sitges: la referencia es Vilanova.' },
  ],
  'clases-para-adultos-en-vilanova': [
    { q: '¿Por qué empezar en Vilanova y no en otro municipio?', a: 'Porque con siete centros verificados puedes cambiar de disciplina o de centro si te equivocas, sin replantearte los desplazamientos. En un municipio con un solo centro, equivocarse suele significar abandonar.' },
    { q: '¿Puedo entrenar dos disciplinas a la vez?', a: 'Varios centros verificados de Vilanova cubren golpeo y suelo bajo el mismo techo, así que es el municipio donde más fácil resulta. Aun así, conviene esperar unos meses: empezar dos disciplinas desde cero a la vez suele acabar en avanzar poco en ambas.' },
    { q: '¿Cuántas clases de prueba debería hacer antes de decidir?', a: 'Al menos dos, en centros distintos y en la franja horaria en la que entrenarías de verdad. Un martes a las 20 h y un sábado a las 10 h son grupos diferentes aunque compartan dirección.' },
  ],
  'clases-para-mujeres-en-sitges': [
    { q: '¿Hay grupos solo de mujeres en Sitges?', a: 'Es un dato que cambia por temporadas y ningún directorio puede garantizarlo. Pregúntalo directamente al centro y pide día y hora concretos: "los martes y jueves a las 19 h" es una respuesta útil; "tenemos muchas chicas" no lo es.' },
    { q: '¿Grupo mixto o grupo femenino?', a: 'Depende de qué te frene. Si es la incomodidad al aprender, un grupo femenino elimina esa barrera. Si buscas autodefensa aplicable, entrenar con personas más grandes forma parte del aprendizaje. Muchas empiezan donde se sienten cómodas y amplían después.' },
    { q: '¿Qué disciplina encaja si busco forma física?', a: 'Kickboxing o boxeo: curva de aprendizaje rápida, sesiones intensas y contacto siempre opcional en iniciación. Si prefieres técnica donde el tamaño importa poco, el jiu jitsu brasileño es la opción clara.' },
  ],
  'clases-para-mujeres-en-vilanova': [
    { q: '¿Cómo pregunto por un grupo femenino de forma útil?', a: 'Pide día y hora concretos y desde cuándo funciona ese grupo. Un grupo con dos años de recorrido seguirá ahí; uno que "está a punto de abrir" puede no llegar a existir. Si no hay, pregunta en qué franja horaria entrenan más mujeres.' },
    { q: '¿Qué ventaja tiene Vilanova sobre Sitges para mujeres que empiezan?', a: 'Más opciones: siete centros verificados frente a tres, lo que aumenta la probabilidad de encontrar un grupo, un horario o un ambiente concretos. Además, en Vilanova constan karate, judo y taekwondo, que en Sitges no.' },
    { q: '¿En qué me fijo en la clase de prueba?', a: 'En cuatro cosas que no requieren saber de artes marciales: cuántas mujeres entrenan de forma habitual, si el instructor avisa antes de corregir con contacto, si hay grupo de iniciación real, y cómo tratan los veteranos a quien acaba de llegar.' },
  ],
  'karate-infantil-en-sitges': [
    { q: '¿Desde qué edad puede empezar karate mi hijo?', a: 'La mayoría de escuelas aceptan desde los 4-6 años, pero conviene calibrar la expectativa: entre los 4 y 5 años se trabaja psicomotricidad con estética de karate. El karate reconocible aparece hacia los 6-7 y el punto dulce está entre los 8 y los 11.' },
    { q: '¿El karate hará que mi hijo sepa defenderse en el colegio?', a: 'No de forma directa, y desconfía de quien te lo prometa. Lo que sí aporta de manera consistente es atención sostenida, tolerancia a la frustración, respeto por normas explícitas y sensación de progreso con los cinturones.' },
    { q: '¿Qué pregunto en la visita al centro?', a: 'Grado del instructor y federación que lo emite, quién imparte concretamente el grupo infantil, cómo están separadas las edades este curso, si puedes ver una clase completa y si la competición es voluntaria. Fíjate sobre todo en cómo corrigen a un niño que lo hace mal.' },
  ],
  'karate-infantil-en-vilanova': [
    { q: '¿Karate, judo o taekwondo para mi hijo en Vilanova?', a: 'Vilanova es el único municipio del Garraf donde constan las tres, así que puedes visitarlas antes de decidir. Karate si necesita marco y estructura, judo si es muy físico, taekwondo si tiene mucha energía y disfruta del movimiento rápido.' },
    { q: '¿Qué es el karate kyokushin y le conviene a un niño?', a: 'Es un estilo de contacto pleno, bastante distinto del karate más habitual en grupos infantiles. En el directorio consta una escuela del municipio que lo imparte. Si te lo encuentras, pregunta cómo adaptan el contacto en edades tempranas: la respuesta te dirá mucho del centro.' },
    { q: '¿Puedo apuntarle a mitad de curso?', a: 'Suele ser posible si queda plaza, pero los grupos por edad se forman en septiembre con el curso escolar. Incorporarse en enero significa entrar en un grupo ya cohesionado y con contenidos avanzados.' },
  ],
};
