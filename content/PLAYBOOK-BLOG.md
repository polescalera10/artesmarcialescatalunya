# Playbook del blog de Artes Marciales Catalunya

> Única fuente de verdad para escribir o reescribir artículos del blog de https://artesmarciales.cat. Quien lo ejecuta arranca sin contexto: todo lo que necesita está aquí. Se lee entero antes de tocar nada.

---

## 1. Qué es este sitio

Artes Marciales Catalunya es un **directorio independiente de centros de artes marciales de Cataluña**: {{centros}} centros en {{comarcas}} comarcas (cifras que se calculan solas, ver sección 4), cada uno con la fuente pública que lo confirma. Castellano en la raíz y catalán en `/ca/`. El blog está solo en castellano.

**No es un gimnasio ni una academia.** No tiene instalaciones, instructores ni alumnos. El blog existe para captar a quien está decidiendo **qué** practicar y **cómo** empezar, y llevarlo al directorio, donde encuentra **dónde**. El negocio es el directorio: fichas promocionadas, webs y SEO para centros. La credibilidad es el activo: un dato inventado que alguien detecte destruye lo construido.

El blog nació en 2026 como el de una guía del Garraf. En octubre de 2026 se reescribe para toda Cataluña: el Garraf pasa a ser una comarca más.

---

## 2. Reglas innegociables

1. **Cero datos de negocio inventados.** Nunca precios, cuotas, horarios, direcciones, teléfonos, nombres de instructores, número de alumnos, años de antigüedad, reseñas ni testimonios.
2. **Nunca nombrar centros concretos en el cuerpo.** Para la oferta real se enlaza al directorio (`/centros/` con filtros, páginas de comarca, municipio y disciplina). Así el texto no caduca y no se favorece a nadie.
3. **Cero afirmaciones de resultados o eficacia** ("el 80 % de los alumnos", "está demostrado"). Lo general se formula como lo que es: lo habitual, lo típico.
4. **Nada de consejo médico, legal ni terapéutico.** En salud, lesiones, embarazo, TDAH, sobrepeso o similares: describir el formato de la práctica y remitir al profesional.
5. **Neutralidad comercial.** Ningún centro recibe trato preferente en un artículo.
6. **Español de España**, con la terminología marcial habitual (kata, randori, sparring, clinch, gi).
7. **Anclaje en el directorio, obligatorio.** Un artículo cumple si reúne las tres cosas:
   - usa al menos un dato del directorio mediante marcadores de recuento (sección 4): cuántos centros anuncian una disciplina en Cataluña, en cuántas comarcas consta, cuántos hay en una comarca o ciudad de ejemplo;
   - enlaza al menos a una página de disciplina (`/disciplinas/<slug>/`) o al directorio filtrado (`/centros/?disciplina=<slug>`), no solo a otros artículos;
   - cierra con una sección práctica de **cómo encontrarlo en tu zona**: el directorio filtrable por comarca, municipio y disciplina, y alguna página de comarca o municipio de ejemplo.

   **El ámbito es Cataluña.** Se pueden usar comarcas o ciudades como ejemplo (Barcelonès, Vallès Occidental, Girona, Reus, Lleida…), siempre con su recuento por marcador y su enlace, y sin que el artículo se convierta en una guía de un solo sitio. Los detalles locales del Garraf (la R2 Sud, Sitges–Vilanova en 10-15 minutos) se quitan salvo que el artículo trate de ese sitio.

---

## 3. Estilo

**Voz.** Directa, de igual a igual, con criterio propio. Toma partido cuando hay motivo ("nuestra recomendación es", "si ves esto, vete") pero nunca vende. El lector tiene prisa.

**Qué hace que no sean genéricos:**
- Empiezan reconociendo la pregunta real que hay detrás de la búsqueda, que casi nunca es la literal.
- Dan la respuesta corta pronto y luego explican por qué la larga importa más.
- Incluyen el matiz incómodo: qué no esperar, qué es marketing, dónde desconfiar.
- Aterrizan en datos del directorio: qué disciplinas tienen mucha oferta y cuáles poca, dónde se concentra, qué no existe en una zona.
- Cierran con la sección práctica de la regla 7 y, si encaja, un enlace a `/para-centros/` **solo** cuando el artículo habla a dueños de centros (casi nunca).

**Estructura.**
- 1.000-1.400 palabras de cuerpo.
- 6-9 secciones `##`. `###` solo si una sección lo pide.
- Los `##` son frases con contenido, no etiquetas ("La respuesta corta, y por qué la larga importa más", no "Introducción").
- Párrafos de 2-4 frases. Listas cuando hay enumeración real. **Negrita** para la idea que se lleva quien lee en diagonal, con moderación.
- Tablas Markdown solo si comparan de verdad.
- 3-5 preguntas frecuentes en el frontmatter (`faq`), con respuestas de 2-4 frases que se entiendan solas.

### Pasada anti-IA (obligatoria antes de guardar)

Invoca la skill `blog` y aplica `references/ai-slop-detection.md` (dos niveles: vocabulario, luego estructura y ritmo). Si no está disponible, aplica este destilado, que además cubre lo específico del castellano:

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
- **Detalle concreto y difícil de fabricar.** El trayecto de vuelta del trabajo a la hora de la clase, el kimono que hay que lavar dos veces por semana, el martes de noviembre con lluvia. Los detalles específicos son la firma de que hay alguien detrás.
- **Alguna aparte o autocorrección.** Un inciso entre paréntesis, un "aunque aquí conviene matizar". La prosa perfectamente ordenada se lee como generada.

**No te pases.** Humanizar no es meter coloquialismos ni chistes. El objetivo es que suene a la persona que escribió los artículos de referencia: alguien con criterio, con prisa y sin ganas de vender nada.

**No te pases.** Humanizar no es meter coloquialismos ni chistes: tiene que sonar a alguien con criterio, con prisa y sin ganas de vender.

---

## 4. Formato: un Markdown por artículo

Cada artículo es `src/content/blog/<slug>.md`:

```markdown
---
titulo: "Karate o Judo para Niños: Cuál Elegir"        # <= 60 caracteres (lo valida el build)
descripcion: "Qué cambia entre karate y judo para un niño, ..."   # <= 155
h1: "Karate o judo para niños: cuál elegir y por qué"
intro: "Entradilla de 2-3 frases. Admite marcadores y <a href>."
tipo: articulo            # articulo | guia
fecha: "2026-09-02"       # publicación original: se conserva al reescribir
actualizado: "2026-10-03" # día de esta revisión
slugAnterior: "karate-vs-taekwondo-ninos-garraf"   # solo si el slug cambia
faq:
  - q: "¿Pregunta?"
    a: "Respuesta."
---

## Primer H2 con contenido

Cuerpo en Markdown...
```

**Slugs.** Sin topónimos salvo que el artículo trate de un sitio. Si un artículo heredado tenía el Garraf o un municipio en el slug, se le da uno nuevo, se pone el viejo en `slugAnterior` y se añaden a `vercel.json` (array `redirects`) **dos** reglas: `/blog/<viejo>/` → `/blog/<nuevo>/` con `"permanent": true`. Sin ese 301 el build falla. Si el slug no cambia, no se pone `slugAnterior` y el Markdown sustituye al heredado.

**Recuentos (`src/lib/recuentos.ts`).** Ningún número del directorio se escribe a mano. Siempre en cifra:

| Marcador | Qué cuenta |
|---|---|
| `{{centros}}` | centros del directorio |
| `{{comarcas}}` | comarcas con algún centro |
| `{{d:boxeo}}` | centros que anuncian la disciplina |
| `{{dmun:boxeo}}` / `{{dcom:boxeo}}` | municipios / comarcas donde consta |
| `{{c:barcelones}}` / `{{m:sabadell}}` | centros de una comarca / municipio |
| `{{dc:boxeo:barcelones}}` / `{{dm:boxeo:sabadell}}` | disciplina en una comarca / municipio |
| `{{infantil}}` | centros cuya fuente anuncia clases para niños |

Slugs de disciplina en `data/disciplinas.json`; de comarca y municipio en `data/geo/comarcas.json` y `data/geo/municipios.json`. Un slug mal escrito rompe el build. Escribe la frase de modo que funcione con cualquier cifra ("constan {{d:judo}} centros con judo"), porque cambiará.

**Enlaces internos válidos** (rutas absolutas, con barra final):
- `/disciplinas/<d>/`, `/disciplinas/<d>/<comarca>/` (si existe), `/disciplinas/`
- `/<comarca>/`, `/<comarca>/<municipio>/`, `/<comarca>/<municipio>/<d>/` (solo si existen: compruébalo en `dist/` tras compilar)
- `/centros/`, con filtros: `/centros/?disciplina=judo`, `/centros/?comarca=barcelones&disciplina=judo`
- `/blog/<slug>/` de otros artículos
- `/para-centros/`, `/sobre-nosotros/`

Enlaces externos solo a fuentes de autoridad cuando aportan (federaciones catalanas, organismos públicos), con el anchor descriptivo.

---

## 5. Puertas de calidad (antes de dar un artículo por terminado)

1. **Calidad:** `python3 scripts/validar-articulo.py src/content/blog/<slug>.md` (pasa el artículo a `analyze_blog.py` con el frontmatter traducido). **Mínimo 60 en bruto** (decisión de Pol, 03-10-2026): el analizador está calibrado para inglés (legibilidad Flesch, definiciones, ejemplos y resúmenes solo con patrones ingleses) y no puntúa lo que pone la plantilla (JSON-LD, Open Graph, imagen), así que en castellano el techo real ronda 70. La nota es una red de seguridad; lo que manda es la revisión humana de las reglas 1-7 y la pasada anti-IA. **Prohibido subir la nota con trucos**: comentarios `<!-- ORIGINAL DATA -->`, `TL;DR`, relleno en inglés o fechas fijas junto a marcadores.
2. **SEO on-page** (skill `blog-seo-check` si está): título, descripción, jerarquía, enlaces y anchors.
3. **Guiones:** `grep -c '—\|–' src/content/blog/<slug>.md` tiene que dar 0.
4. **Build y enlaces:** `npm run build` (debe acabar en "Complete!") y `python3 scripts/enlaces.py` (debe dar OK).

---

## 6. Contexto técnico mínimo

- Astro estático; Vercel despliega al hacer push a `main`.
- Los artículos heredados (sin Markdown todavía) viven en `src/legacy/` y se sirven igual; un Markdown con el mismo slug o con `slugAnterior` los sustituye. No se editan los heredados: se reescriben en Markdown.
- Plantilla del artículo: `src/templates/Post.astro`. Cargador: `src/lib/blog.ts`.
- Los agentes que reescriben no ejecutan git: lo hace quien coordina, tras revisar.
