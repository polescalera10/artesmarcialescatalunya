# Playbook del blog — instrucciones para el agente programado

> Este archivo es la única fuente de verdad para escribir entradas del blog. El agente que lo ejecuta arranca **sin contexto previo**: todo lo que necesita saber está aquí. Leerlo entero antes de tocar nada.

---

## 1. Qué es este sitio (y qué no es)

`artesmarcialesgarraf.es` es una **guía editorial independiente** sobre artes marciales en la comarca del Garraf (Barcelona): Sitges, Vilanova i la Geltrú, Sant Pere de Ribes, Cubelles y Canyelles.

**No es un gimnasio ni una academia.** No tiene instalaciones, ni instructores, ni alumnos, ni horarios propios. Es un recurso que explica cada disciplina y ayuda a la gente a dar el primer paso, y que mantiene un directorio verificado de los centros reales de la comarca.

El modelo de negocio es alquilar o vender la web a un centro real cuando genere tráfico y leads. Eso hace que la credibilidad del contenido **sea el activo**: un solo dato inventado que alguien detecte destruye lo que se está construyendo.

---

## 2. Reglas innegociables

Estas reglas están por encima de cualquier objetivo de tráfico. Si cumplirlas obliga a escribir un artículo peor, se escribe peor.

1. **Cero datos de negocio inventados.** Nunca inventar ni estimar: precios, cuotas, horarios, direcciones, teléfonos, nombres de instructores, número de alumnos, años de antigüedad, reseñas o testimonios. Si un dato no consta en una fuente pública verificable, no se publica.
2. **Nunca nombrar centros concretos en el cuerpo de un artículo.** Para hablar de la oferta real se enlaza a `/centros/`, que es la única página con verificación y fecha por ficha. Así el contenido no caduca y no se favorece a nadie.
3. **Cero afirmaciones de tráfico, resultados o eficacia.** Nada de "el 80 % de los alumnos", "está demostrado que", "en tres meses conseguirás". Si hay una afirmación general del ámbito, se formula como lo que es: lo habitual, lo típico, lo que suele pasar.
4. **Nada de consejo médico, legal ni terapéutico.** En temas de salud, lesiones, embarazo, TDAH o similares: describir el formato de la práctica y remitir explícitamente al profesional correspondiente.
5. **Neutralidad comercial.** Ningún centro recibe trato preferente. Si algún día alguno paga por aparecer, se declarará en su ficha y su enlace llevará `rel="sponsored"` — pero eso no lo decide este agente.
6. **Todo en español de España**, con la terminología marcial en su forma habitual (kata, randori, sparring, clinch, gi).
7. **Ancla local obligatoria. Sin ella, el artículo no se escribe.** El informe del 25-08-2026 encontró que 8 de los 12 artículos que había publicado esta rutina no llevaban el Garraf ni en el título ni en la intención: comparativas nacionales genéricas que compiten en España entera contra dominios de diez años. Resultado medido: impresiones subiendo y **cero clics**. Y aunque llegaran a rankear, no servirían al negocio, porque un gimnasio de Vilanova no paga por un lector de Sevilla. Este sitio es Rank2Rent: el KPI no es tráfico, es lead con código postal del Garraf.

   Un artículo cumple el ancla local si reúne las cuatro cosas:

   - el Garraf o uno de sus municipios aparece en el título o, como mínimo, en las primeras 100 palabras **y** en el H2 principal;
   - usa al menos un dato propio del directorio: cuántos centros constan, qué disciplina hay en qué municipio, o qué **no** existe en la comarca (que el muay thai no tenga ni un centro verificado es un dato tan bueno como cualquier otro). **Los recuentos se sacan siempre de `src/data/centros.ts` el día que se escribe, nunca de artículos anteriores ni del campo `ancla_local` de la cola**: el directorio cambia. El 29-09-2026 pasó de 13 a 17 centros y el krav maga dejó de ser un hueco (consta en un centro de Cubelles), y hubo que corregir unas cien frases publicadas. **Para el total de centros escribe `{{centros}}` (en letra) o `{{centros_num}}` (en cifra)**: se sustituye al compilar y no se desfasa;
   - enlaza como mínimo a una money page o a un hub de municipio, no solo a otros artículos del blog;
   - el campo `ancla_local` de su entrada en la cola dice cuál es ese ángulo. Si la entrada no lo trae, es que no se revisó: aplica el criterio y anótalo.

   Si un tema no admite ángulo local honesto, **no se fuerza**: se marca `"estado": "descartado"` con su `motivo_descarte` y se coge la siguiente.

---

## 3. Estilo

El estándar es el de los artículos ya publicados. Antes de escribir, **abre `src/data/blog-posts.ts` y lee entero uno de los últimos** (`blog/como-elegir-centro-artes-marciales-garraf` o `blog/a-que-edad-empezar-artes-marciales`) para calibrar el tono.

**Voz.** Directa, de igual a igual, con criterio propio. La guía toma partido cuando hay motivo ("nuestra recomendación es", "si ves esto, vete") pero nunca vende. Trata al lector como alguien con prisa y sin ganas de que le den la turra.

**Qué hace que estos artículos no sean genéricos:**
- Empiezan reconociendo la pregunta real que hay detrás de la búsqueda, que casi nunca es la literal.
- Dan la respuesta corta pronto y luego explican por qué la larga importa más.
- Incluyen el matiz incómodo: qué NO esperar, qué es marketing, dónde desconfiar.
- Aterrizan siempre en el Garraf: distancias reales entre municipios (Sitges–Vilanova, 10-15 min en coche; línea R2 Sud), oferta concentrada en Vilanova y Sitges, municipios pequeños que se desplazan.
- Cierran con una sección local que enlaza al directorio y a las guías de municipio, y un CTA a `/contacto/`.

**Estructura.**
- 1.000-1.400 palabras de cuerpo. Menos se queda corto; más se hace pesado.
- 6-9 secciones `<h2>`. `<h3>` solo si una sección lo pide de verdad.
- Los `<h2>` son frases con contenido, no etiquetas: "La respuesta corta, y por qué la larga importa más", no "Introducción".
- Párrafos de 2-4 frases. Listas `<ul>`/`<ol>` cuando hay enumeración real, no para trocear prosa.
- `<strong>` para la idea que el lector debe llevarse si solo lee en diagonal. Con moderación.
- Tablas solo si comparan de verdad (el CSS ya las hace desplazables en móvil).

**Formato del cuerpo.** HTML plano en una plantilla de string. Etiquetas permitidas: `<h2> <h3> <p> <ul> <ol> <li> <strong> <em> <a> <table> <thead> <tbody> <tr> <th> <td>`. Sin `<h1>` (lo pone la plantilla), sin clases CSS, sin `<div>`, sin `<img>`.

**Prohibido en la redacción:** emojis; signos de exclamación en prosa; "¡Descubre…!"; preguntas retóricas encadenadas; "en el mundo de las artes marciales"; "no es solo X, es Y"; "sumérgete", "adéntrate", "desata"; cualquier frase que podría estar en la web de cualquier gimnasio de España. Si una frase no aporta información, se borra.

**Enlazado interno.** Entre 6 y 12 enlaces internos por artículo, con anchor descriptivo (nunca "aquí" o "este enlace"). Usa los destinos que trae la entrada de la cola en `enlaces_internos`, más los que pidan el texto. Enlaza al menos a: una guía de disciplina, `/centros/`, un artículo del blog relacionado y `/contacto/` en el cierre.

---

## 3-bis. Pasada de humanización (obligatoria, antes de guardar)

Un texto que huele a IA le cuesta credibilidad a una guía que se vende como editorial independiente. Todo artículo pasa por esta revisión **antes** de escribirlo en `blog-posts.ts`.

**Primero, intenta usar la skill.** Invoca la skill `blog` (claude-blog) sobre el borrador completo y aplica su referencia de revisión editorial, `references/ai-slop-detection.md`, con su método de dos niveles: el reflejo de primer orden (vocabulario y muletillas) y el de segundo orden (estructura repetida, ritmo plano, relleno que sobrevive a una limpieza de palabras). Si el entorno la tiene disponible, es la versión canónica y manda sobre el resumen de abajo. Si no está disponible, no pasa nada: aplica esta lista, que es su destilado.

Sustituye a la antigua skill `humanizer`, que ya no se usa en este proyecto. La lista de abajo sigue siendo válida y es específica de esta web: la skill cubre el patrón general en inglés, y esta lista añade lo que aplica al castellano y al Garraf.

**El método:** escribe el borrador, luego pregúntate en frío *"¿qué delata que esto lo ha escrito una máquina?"*, y reescribe atacando lo que encuentres. Una sola pasada de revisión no basta si el borrador salió plano.

### Corta siempre

- **Guiones largos (—) y medios (–): cero, sin excepción.** Es el tell más fiable que existe. Sustituye por punto, coma, dos puntos o paréntesis, o reestructura la frase. Antes de guardar, busca `—` y `–` en tu texto: si hay uno, el borrador no está terminado. (Los artículos publicados antes del 15-08-2026 los usan; no son el modelo a seguir en esto.)
- **Vocabulario de IA:** crucial, clave (adjetivo), fundamental, pivotal, sumergirse, explorar, fomentar, potenciar, destacar (verbo), panorama, tapiz, testimonio de, subrayar, enriquecedor, vibrante, robusto, integral.
- **Inflar significados:** "marca un antes y un después", "juega un papel crucial", "refleja una tendencia más amplia", "deja una huella imborrable". Si una frase solo dice que algo es importante, se borra.
- **Participios de relleno** que fingen profundidad al final de una frase: "…, destacando su importancia", "…, reflejando la conexión con", "…, garantizando que", "…, fomentando la".
- **Lenguaje promocional:** "enclavado en", "en pleno corazón de", "impresionante", "de visita obligada", "cuenta con una amplia oferta".
- **Paralelismos negativos:** "no es solo X, es Y", "no se trata únicamente de…". Y las negaciones colgando al final: "sin sorpresas", "sin perder el tiempo".
- **Regla de tres automática.** Si cada enumeración tiene exactamente tres elementos, es una máquina. Que tengan dos, cuatro o cinco cuando toque.
- **Variación elegante:** no cicles sinónimos por miedo a repetir ("el practicante… el alumno… el deportista… el aprendiz"). Repite la palabra normal.
- **Rangos falsos:** "desde X hasta Y" cuando X e Y no están en la misma escala.
- **Atribuciones vagas:** "los expertos coinciden", "según diversos estudios", "está demostrado que". O hay fuente concreta o no se dice.
- **Negritas mecánicas** y listas con encabezado en negrita seguido de dos puntos. Negrita solo para la idea que el lector debe llevarse si lee en diagonal.
- **Señalizar en vez de hacer:** "vamos a ver", "aquí tienes lo que necesitas saber", "sin más preámbulos", "profundicemos en".
- **Aperturas de falsa confidencia:** "¿Honestamente?", "Mira", "La cosa es que", "Seamos sinceros", "La verdadera pregunta es", "en el fondo".
- **Cierres positivos genéricos:** "el futuro es prometedor", "un paso en la dirección correcta", "solo queda dar el primer paso".
- **Frases-eslogan y drama entrecortado.** Una frase corta para rematar está bien. Cuatro seguidas, no.
- **Encabezado seguido de una frase que repite el encabezado.** Entra directo en el contenido.
- **Comillas tipográficas** (" "): usa las rectas.
- **Hedging apilado:** "podría potencialmente llegar a ser". Dilo o no lo digas.

### Conserva y busca

- **Ritmo variado.** Frases cortas. Y frases más largas que se toman su tiempo para llegar a donde van. La cadencia uniforme de longitud media es lo que suena a máquina.
- **Criterio propio.** Mojarse: "esto es marketing", "si ves esto, vete", "nuestra recomendación es". Un texto sin opinión es un texto sin autor.
- **El matiz incómodo.** Lo que no funciona, lo que no se puede prometer, la duda que queda. La IA tiende a resolverlo todo limpiamente.
- **Detalle concreto y difícil de fabricar.** Los 10-15 minutos entre Sitges y Vilanova, la R2 Sud, el martes de noviembre con lluvia. Los detalles específicos son la firma de que hay alguien detrás.
- **Alguna aparte o autocorrección.** Un inciso entre paréntesis, un "aunque aquí conviene matizar". La prosa perfectamente ordenada se lee como generada.

**No te pases.** Humanizar no es meter coloquialismos ni chistes. El objetivo es que suene a la persona que escribió los artículos de referencia: alguien con criterio, con prisa y sin ganas de vender nada.

---

## 3-ter. Puertas de calidad (skill `blog`, antes de guardar)

Si la skill `blog` está disponible, cada artículo pasa además por dos comprobaciones automáticas. No sustituyen al criterio de las secciones 2, 3 y 3-bis: son la red de seguridad.

**Cómo se ejecutan.** El cuerpo del artículo vive dentro de una plantilla de string en `blog-posts.ts`, así que primero se vuelca el borrador a un archivo temporal y se analiza ahí:

```bash
# El borrador, tal cual, en un temporal fuera del repo
cat > /tmp/borrador-<slug>.html <<'EOF'
<h2>…</h2>
EOF

python3 ~/.claude/scripts/analyze_blog.py /tmp/borrador-<slug>.html
```

**Puerta 1, calidad (`blog-analyze`).** Score sobre 100 en cinco categorías: contenido, SEO, E-E-A-T, elementos técnicos y preparación para citas en buscadores de IA. **Mínimo para guardar: 90.** Por debajo, se lee la lista de recomendaciones (vienen priorizadas como Critical / High / Medium / Low), se corrige lo Critical y High, y se vuelve a puntuar. Si tras dos iteraciones sigue por debajo de 90, se deja la entrada pendiente y se dice en el resumen. No se baja el listón para cerrar la tanda.

Ojo con dos cosas al leer el score: las categorías técnicas y de schema puntúan sobre el artículo aislado, sin la plantilla del sitio, así que penalizaciones por falta de JSON-LD, canonical u Open Graph son falsos positivos aquí (los pone la plantilla, y la verificación sobre `dist/` del paso 5 ya los cubre). Lo que sí manda es la parte de contenido, E-E-A-T y citabilidad.

**Puerta 2, SEO on-page (`blog-seo-check`).** Checklist de pass/fail sobre título, meta descripción, jerarquía de encabezados, enlaces internos y externos con su anchor, y texto alternativo de imágenes. Todo lo que salga en fail se corrige antes de guardar, salvo lo que dependa de la plantilla.

**Puerta 3, la de siempre.** `grep -c '—\|–'` sobre el cuerpo nuevo tiene que dar 0. Esta no la delega la skill: es regla dura del proyecto y se comprueba a mano.

**Si la skill no está disponible**, no se aborta la tanda: se aplica el destilado de la sección 3-bis, se cumple la puerta 3 igualmente, y el resumen final dice que se trabajó sin skill.

---

## 4. Mecánica: cómo se añade una entrada

Cuatro archivos, en este orden. Todos bajo `src/`.

### 4.1 `src/data/blog-posts.ts` — el cuerpo

Añadir dentro de `BLOG_BODIES`, con la clave `'blog/<slug>'`:

```ts
  'blog/<slug>': `
<h2>Primer titular</h2>
<p>…</p>
`,
```

Cuidado con las comillas invertidas y con `${` dentro del texto: es una plantilla de string, hay que escaparlos (`\``, `\${`).

### 4.2 `src/data/pages.ts` — la definición de página

Añadir al principio del array `BLOG_PAGES`:

```ts
  {
    slug: 'blog/<slug>',
    type: 'blog',
    meta: {
      title: '…',        // máximo 60 caracteres, sin excepción
      description: '…',  // entre 120 y 158 caracteres
    },
    h1: '…',
    intro: '…',          // 2-3 frases; es el párrafo del hero, no repite el h1
    body: BLOG_BODIES['blog/<slug>'],
    fecha: 'YYYY-MM-DD', // la fecha real de publicación
    phase: 2,
  },
```

El `title` y la `description` se recortan automáticamente si se pasan, pero un recorte automático queda feo: escríbelos ya dentro del límite.

### 4.3 `src/data/blog-posts.ts` — enlazado entrante

En el mapa `BLOG_POR_TEMA`, añadir el nuevo artículo a la clave o claves que le correspondan (slug de disciplina, o `clases-para-ninos` / `clases-para-mujeres` / `clases-para-adultos` / `iniciacion`). Máximo dos artículos por clave: si la clave ya tiene dos, sustituye el menos relevante. **Sin este paso el artículo nace con 1 enlace entrante en lugar de 15-20.**

### 4.4 `scripts/gen-images.mjs` — tarjeta social e ilustración

En el array `BLOG`, añadir una fila:

```js
  ['<slug>', '<Título corto>', '<icono>', '<subtítulo de una línea>'],
```

- `<Título corto>`: cabe en dos líneas de 17 caracteres. No es el `h1` completo.
- `<icono>`: uno de los nombres de `src/components/LineIcon.astro` — los diez slugs de disciplina, o `brujula`, `mapa-pin`, `personas`, `check-circulo`, `sobre`, `balanza`.

Después, ejecutar `npm run images`. Regenera todo y actualiza `src/data/imagenes-generadas.json`.

---

## 5. Procedimiento de cada tanda

1. `npm install` si hace falta.
2. Leer `content/cola-blog.json`. Coger las **2 primeras entradas con `"estado": "pendiente"`** (bajado de 4 a 2 el 25-08-2026: cuatro artículos cada cuatro días sobre un dominio de junio sin un solo backlink es el perfil que Google describe como *scaled content abuse*). Ordenar por **`intencion_comercial`** (`alta` antes que `media`), luego por `prioridad` (1 antes que 2 antes que 3) y, dentro del mismo nivel, por el orden del archivo.
   - **Estacionalidad:** si estamos en agosto o septiembre, adelantar las entradas con `"estacionalidad": "septiembre"`. En diciembre y enero, las de `"enero"`.
   - **Entradas con `requiere_datos`:** leer ese campo y cumplirlo. Si el dato no existe, **saltar la entrada, dejarla pendiente** y coger la siguiente. No inventar nunca para desbloquearla.
3. Escribir los 2 artículos siguiendo las secciones 2, 3 y 4. **Comprobar la regla 7 (ancla local) antes de dar por bueno cada uno.**
3-bis. **Pasar cada artículo por la humanización de la sección 3-bis y por las puertas de calidad de la 3-ter** antes de guardarlo. Incluye la comprobación mecánica: `grep -c '—' ` sobre el texto nuevo tiene que dar 0, y el score de `analyze_blog.py` tiene que llegar a 90.
4. `npm run images` y `npm run build`. **El build tiene que quedar en verde.**
5. Verificar sobre `dist/`, y no dar por bueno nada que falle:
   - las 2 páginas nuevas existen en `dist/blog/<slug>/index.html`;
   - `<title>` ≤ 60 caracteres y `meta description` ≤ 160 en las 2;
   - **cada artículo enlaza al menos a una money page o hub de municipio** (regla 7);
   - exactamente un `<h1>` por página;
   - el `og:image` de cada una apunta a `/og/blog-<slug>.png` y ese archivo existe;
   - todos los enlaces internos del cuerpo resuelven a una página que existe en `dist/`;
   - `sitemap.xml` incluye las 2 URLs nuevas;
   - **cero guiones largos o medios** en el cuerpo de los 2 artículos nuevos (`grep -c '—\|–'` sobre las claves nuevas de `BLOG_BODIES` debe dar 0).
6. Marcar en `content/cola-blog.json` cada entrada publicada: `"estado": "publicado"` y `"publicado_en": "YYYY-MM-DD"`. Añadir su slug al array `publicados`.
7. Actualizar `SITE.ultimaRevision` en `src/data/site.ts` a la fecha de hoy.
8. Un solo commit con los 2 artículos y `git push origin main`. Vercel despliega solo.
9. Cuando el despliegue esté en producción (la URL nueva responde 200), `npm run indexnow -- /blog/<slug-1>/ /blog/<slug-2>/` para avisar a Bing. Si falla, dilo en el resumen; no bloquea la tanda.

**Mensaje de commit:**

```
Blog: <título 1> y <título 2>

Tanda programada de la cola editorial (content/cola-blog.json).
<Una línea por artículo: a qué búsqueda responde.>

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Si algo falla** (build en rojo, verificación que no pasa, una entrada que no se puede escribir sin inventar datos): **no publicar esa entrada**. Publicar las que sí estén bien, dejar la otra pendiente y decirlo con claridad en el resumen final. Es preferible una tanda de uno que un artículo con datos inventados o sin ancla local.

---

## 6. La revisión de la cola (rutina de cada 20 días)

Objetivo: que la cola no se agote y que no se repita lo ya publicado.

1. Leer `content/cola-blog.json` entero y listar `src/data/pages.ts` para ver qué hay publicado de verdad.
2. Revisar también las 62 páginas de disciplina, municipio y perfil (`ALL_PAGES` en `src/data/pages.ts`): una entrada de blog **no puede duplicar la intención** de una money page.
3. Proponer **20 entradas nuevas** y añadirlas al final de `cola`, con `"estado": "pendiente"` y el mismo esquema de campos que las existentes (`id` correlativo, `slug`, `h1`, `keyword_principal`, `keywords_secundarias`, `cluster`, `prioridad`, `angulo`, `enlaces_internos`; `estacionalidad` y `requiere_datos` si aplican).
   - Criterio: intención **informacional**, cola larga, con **ancla local que cumpla la regla 7** (no vale "con ángulo local" en abstracto: hay que poder escribir el campo `ancla_local` de forma concreta), y que no canibalice ni un artículo publicado ni una money page.
   - Campos obligatorios añadidos el 25-08-2026: **`ancla_local`** (qué dato propio del Garraf sostiene el artículo) e **`intencion_comercial`** (`alta` si quien busca eso está a un paso de apuntarse a algo, `media` si es objeción o comparación previa a la decisión). **No se admiten entradas de intención `baja`:** si la búsqueda no lleva a ningún centro, es tráfico que no se puede vender.
   - **Prohibido reponer comparativas nacionales genéricas** del tipo "boxeo o kickboxing", "diferencia judo y jiu jitsu": son el error que se corrigió el 25-08-2026 y ya hay doce publicadas.
   - Fuentes de ideas: preguntas que aparecen en los `faq` de `src/data/disciplines.ts` y en los `localFaq` de `src/data/local-content.ts` que aún no tengan artículo; huecos de cobertura conocidos (fitboxing, kung fu, aikido, grappling); estacionalidad del calendario; y variantes de las entradas que mejor encajen con lo ya publicado.
4. Marcar como `"estado": "descartado"` (con `"motivo_descarte"`) cualquier entrada pendiente que haya quedado obsoleta o que se solape con algo publicado desde entonces. No borrarlas: el histórico importa.
5. Commit y push solo de `content/cola-blog.json`, con un resumen de qué se ha añadido y por qué.

Esta rutina **no escribe artículos**. Solo mantiene la cola.

---

## 7. Contexto técnico mínimo

- Astro 4 + Tailwind + TypeScript, salida estática, desplegado en Vercel con auto-deploy desde `main`.
- El contenido vive en `src/data/*.ts`; las páginas se generan en `src/pages/[...slug].astro`.
- `npm run build` genera `dist/`. `npm run images` regenera la imaginería.
- No instalar dependencias nuevas. No tocar la maquetación, los componentes ni la configuración: este agente escribe contenido.
- No reintroducir el plugin `@astrojs/sitemap` (dio problemas de compatibilidad; el sitemap es propio, en `src/pages/sitemap.xml.ts`).
