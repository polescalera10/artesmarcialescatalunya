# Cómo se añade un centro al directorio

Este archivo es la norma para cualquier persona o agente que añada o revise centros de Artes Marciales Catalunya. Se lee entero antes de empezar.

## La regla de oro

Solo entra un centro si **una fuente pública verificable dice que existe y qué enseña**, y solo se publica **lo que esa fuente dice**. Si un dato no consta, no se escribe. Nunca se deduce una disciplina por el nombre del centro ni por lo "habitual".

## Fuentes válidas (`fuenteTipo`)

| Tipo | Qué es | Ejemplo |
|---|---|---|
| `web-oficial` | Web propia del centro, que se ha abierto y leído | `https://dojocastaneda1976.com/` |
| `federacion` | Listado de clubs de una federación deportiva | fckarate.cat/clubs, fedecatjudo.cat/judo/clubs, taekwondocatala.com, famc.cat |
| `directorio-municipal` | Ficha en el directorio de entidades o equipamientos de un ayuntamiento | `vilanova.cat/directori/detall?id=…` |
| `perfil-publico` | Página pública de Facebook o Instagram **del propio centro**, solo si se ha podido leer y dice la disciplina | último recurso |

**No valen como fuente** (sí para descubrir candidatos): Google Maps, Yelp, Cylex, Páginas Amarillas, KO Directo, PortalFit, Maestros del Combate, ProntoPro, Superprof, gimnasios.com, Kickfit, cualquier "top 10". Nunca se copian reseñas, valoraciones, precios ni horarios de ningún sitio.

## Qué cuenta como centro

- Escuela, club, asociación o gimnasio que **anuncia al menos una disciplina de la taxonomía** (`data/disciplinas.json`) como clase propia.
- **No entran:** gimnasios que solo tienen fitboxing, body combat, cardio box o similares; entrenadores personales sin centro; tiendas; eventos.
- Cada sede de una cadena (Mugendo, Centros DYM…) es una ficha propia.

## Formato

Un archivo por comarca: `data/centros/<slug-comarca>.json`, con un array de fichas ordenado alfabéticamente por `nombre`. Los slugs de comarca y municipio salen de `data/geo/comarcas.json` y `data/geo/municipios.json` (usar exactamente esos).

```json
{
  "slug": "dojo-castaneda-1976",
  "nombre": "Dojo Castañeda 1976",
  "tipo": "escuela",
  "municipio": "vilanova-i-la-geltru",
  "disciplinas": ["karate", "kickboxing", "boxeo"],
  "otras": ["Karate full contact", "Entrenamiento personal"],
  "infantil": true,
  "direccion": "Carrer de Cuba, 22, 08800 Vilanova i la Geltrú",
  "web": "https://dojocastaneda1976.com/",
  "fuente": "https://dojocastaneda1976.com/",
  "fuenteTipo": "web-oficial",
  "verificado": "2026-09-30"
}
```

| Campo | Obligatorio | Regla |
|---|---|---|
| `slug` | sí | Único en toda Cataluña. Nombre en minúsculas sin acentos ni símbolos, con guiones. Si el nombre es genérico o de cadena, se añade el municipio: `mugendo-el-vendrell` |
| `nombre` | sí | Tal como aparece en la fuente |
| `tipo` | sí | `escuela`, `club`, `asociacion` o `gimnasio` |
| `municipio` | sí | Slug de `municipios.json` |
| `disciplinas` | sí | Slugs de `disciplinas.json` que la fuente anuncia. Usa los `sinonimos` para mapear (kyokushin → karate, wushu → kung-fu, K-1 → kickboxing, sambo → lucha). Puede ir vacío si la fuente solo dice "artes marciales" |
| `otras` | no | Actividades que la fuente cita y no son de la taxonomía, o matices útiles ("Taekwondo ITF", "Karate kyokushin", "Grupo femenino de jiu-jitsu") |
| `infantil` | no | `true` solo si la fuente anuncia clases para niños. Si no lo dice, **se omite** (no se pone `false`) |
| `direccion` | no | Solo si consta en la fuente |
| `web` | no | Web propia del centro, si existe y responde |
| `fuente` | sí | URL exacta donde se verificó |
| `fuenteTipo` | sí | Ver tabla de arriba |
| `verificado` | sí | Fecha (AAAA-MM-DD) en que se abrió la fuente |

**No se guardan** teléfonos, correos ni nombres de personas: son datos de contacto que a menudo son personales (RGPD) y la ficha ya enlaza a la fuente.

## Cómo verificar

1. Descubre candidatos: listados de federaciones, directorio municipal de entidades de cada ayuntamiento, búsquedas "<disciplina> <municipio>", redes de cadenas.
2. Abre la fuente con `curl -sL -A "Mozilla/5.0" <url>` o WebFetch y comprueba que el nombre y las disciplinas aparecen.
3. Si la web oficial no carga (dominio caído, 404), el centro **no entra** con esa fuente: busca otra válida o déjalo en candidatos.
4. Lo que no se pueda verificar va a `data/candidatos/<slug-comarca>.json` con `{ "nombre", "municipio", "pista": "<dónde lo viste>", "motivo": "<por qué no entra>" }`. Así nadie repite la búsqueda.

## Lo que no se hace

- No se tocan otros archivos del repo ni se ejecuta `git`.
- No se inventa nada para completar una ficha.
- No se ordena por "calidad" ni se destaca a nadie: el orden es alfabético y los promocionados los gestiona el código, no los datos.
