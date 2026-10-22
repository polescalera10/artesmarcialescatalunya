# Guías por perfil y ciudad: instrucciones para quien las escribe

Trabajas en `/Users/polescalera/Desktop/Cowork OS/artesmarcialescatalunya/web`. Vas a escribir guías del blog de https://artesmarciales.cat (directorio de centros de artes marciales de Cataluña). Todo en castellano de España.

## Lee primero, en este orden
1. `content/PLAYBOOK-BLOG.md`, entero. Es la fuente de verdad: reglas innegociables, estilo, marcadores de recuento, formato del Markdown, pasada anti-IA y puertas de calidad.
2. La guía modelo de tu perfil (mismo perfil, ciudad de referencia Barcelona), para el tono, la estructura y la sección de cierre. NO la copies: tus guías deben aportar contenido distinto.
   - niños: `src/content/blog/artes-marciales-para-ninos-en-barcelona.md`
   - mujeres: `src/content/blog/defensa-personal-para-mujeres-en-barcelona.md`
   - adultos: `src/content/blog/artes-marciales-para-adultos-en-barcelona.md`
3. `/private/tmp/claude-501/-Users-polescalera-Desktop-Cowork-OS-artesmarcialescatalunya/2e965333-75b1-45d5-a492-86c1ccd209be/scratchpad/guias-brief.json`: datos de cada ciudad (centros, centros con clases para niños, recuento por disciplina, municipios vecinos con más centros) y `rutas_existentes` (los únicos enlaces internos de ciudad que puedes usar).
4. `/private/tmp/claude-501/-Users-polescalera-Desktop-Cowork-OS-artesmarcialescatalunya/2e965333-75b1-45d5-a492-86c1ccd209be/scratchpad/blog-slugs.txt`: slugs de artículos existentes, para enlaces `/blog/<slug>/`.

## Qué escribes
Una guía por cada pareja (perfil, ciudad) que se te asigne. Archivo `src/content/blog/<slug>.md`, con estos slugs exactos:
- niños: `artes-marciales-para-ninos-en-<municipio>`
- mujeres: `defensa-personal-para-mujeres-en-<municipio>`
- adultos: `artes-marciales-para-adultos-en-<municipio>`
(`<municipio>` es el slug del municipio tal como sale en el brief, por ejemplo `girona` o `vilanova-i-la-geltru`.)

Frontmatter: `titulo` (máx. 60 caracteres, con la ciudad), `descripcion` (máx. 155), `h1`, `intro`, `tipo: guia`, `fecha: "2026-10-22"`, `actualizado: "2026-10-22"`, `faq` con 4 preguntas. Sin `slugAnterior`. Cuerpo de 1.000 a 1.400 palabras, 6 a 9 secciones `##` con frase de contenido.

## Que cada guía sea de verdad de su ciudad (esto es lo que más importa)
Las guías de distintas ciudades no pueden ser la misma plantilla con el nombre cambiado: Google las trataría como contenido en serie y a un padre o una madre de Girona no le sirve una guía que valdría para Lleida. Cada guía tiene que apoyarse en lo que el brief dice de SU ciudad:
- Abre con la pregunta real de quien busca eso en esa ciudad y con la cifra de la ciudad (marcadores: `{{m:<municipio>}}`, `{{im:<municipio>}}`, `{{dm:<disciplina>:<municipio>}}`).
- Cuenta lo que la distribución por disciplina de ESA ciudad implica para ESE perfil: qué hay mucho (y por tanto toca elegir con criterio), qué hay poco (y por tanto toca mirar los municipios vecinos), qué no consta. Usa solo marcadores para los números y construye la frase para que valga con cualquier cifra. No afirmes que algo "no existe" en la ciudad: di que en el directorio constan N.
- Usa los municipios vecinos del brief (con su recuento y su enlace) cuando tenga sentido ampliar la búsqueda.
- Los consejos prácticos pueden ser parecidos entre guías del mismo perfil (qué preguntar, señales de alarma), pero la redacción, el orden, los ejemplos y el ángulo deben cambiar. Evita abrir o cerrar dos guías con la misma frase.
- Si el brief muestra pocos centros para el perfil (por ejemplo 5 o 6 con clases para niños), dilo con naturalidad y no lo vendas como mucha oferta. Una guía honesta con poca oferta es mejor que una inflada.

## Reglas que más se rompen (revisa antes de guardar)
- Ningún nombre de centro, instructor, barrio con centros concretos, precio, horario, dirección, teléfono, reseña, año de antigüedad ni número de alumnos. Ningún dato que no salga del brief o de un marcador. No inventes datos de la ciudad (barrios, transporte, colegios): si no está en el brief, no lo escribas.
- Cero guiones largos (—) ni medios (–). Antes de guardar: `grep -c '—\|–' <archivo>` debe dar 0.
- Marcadores `{{...}}` solo con slugs que existan. Los slugs de disciplina son los del brief entre paréntesis (por ejemplo `defensa-personal`, `jiu-jitsu-brasileno`, `kickboxing`). Un slug mal escrito rompe el build de todo el sitio.
- Enlaces internos: solo los de `rutas_existentes` de tu ciudad, `/disciplinas/<d>/`, `/centros/`, `/centros/?comarca=<comarca>&disciplina=<d>`, `/blog/<slug>/` de `blog-slugs.txt`, `/sobre-nosotros/`. Rutas con barra final. Enlaza a la página del municipio y a 2 o 3 páginas de disciplina de la ciudad. La sección final «Cómo encontrarlo en tu zona» es obligatoria.
- Mujeres: nada de consejo médico, legal ni terapéutico. Incluye, con las mismas cautelas que la guía modelo, el apartado sobre qué hacer si hay violencia (una clase no es el primer recurso) y no te inventes recursos locales; si mencionas un teléfono, usa solo el 016 como hace la guía modelo.
- Niños: ni consejo médico (TDAH, sobrepeso...) ni afirmaciones de eficacia o de beneficios garantizados.
- Pasada anti-IA obligatoria (skill `blog`, `references/ai-slop-detection.md`, o el destilado del playbook): variar el ritmo, tomar partido, incluir el matiz incómodo y un detalle concreto verosímil que no sea un dato de negocio.

## Comprobaciones que SÍ ejecutas
- `python3 scripts/validar-articulo.py src/content/blog/<slug>.md` para cada guía (mínimo 60 en bruto, sin trucos).
- `grep -c '—\|–' src/content/blog/<slug>.md` = 0 y longitud de `titulo` y `descripcion`.
No ejecutes `npm run build` ni `npm run check`: otros agentes escriben a la vez y se pisarían. Tampoco toques otros archivos que no sean tus guías.

## Qué devuelves
Una línea por guía: slug, nota de validar-articulo, palabras, y cualquier duda (marcador dudoso, dato que no estabas seguro de poder afirmar). Sin resumen largo.
