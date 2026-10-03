#!/usr/bin/env python3
"""Convierte data/fuentes/owkle.json (scripts/descargar-owkle.py) en fichas.

- Las disciplinas de OWKLE se traducen a la taxonomía (data/disciplinas.json);
  las que no tienen equivalente van a `otras`.
- Un club que marca casi todas las disciplinas de OWKLE no es creíble: va a
  data/candidatos/owkle.json en vez de al directorio.
- Si el club ya está en el directorio (mismo municipio y nombre parecido, o
  misma calle y número), no se toca la ficha: se lista para revisión.
- Nunca se guardan teléfonos ni correos.

Idempotente. Uso: python3 scripts/importar-owkle.py
"""
import json, pathlib, re, sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
DATA = RAIZ / 'data'
OWKLE = json.load(open(DATA / 'fuentes/owkle.json'))

MAPA = {
    'KICK BOXING / K1': ['kickboxing'], 'FULL CONTACT': ['kickboxing'], 'MUAY THAI': ['muay-thai'],
    'BOXEO': ['boxeo'], 'MMA PROFESIONAL': ['mma'], 'BJJ / GRAPPLING': ['grappling'],
    'DEFENSA PERSONAL': ['defensa-personal'], 'DEFENSA PERSONAL OPERATIVA': ['defensa-personal'],
    'KARATE': ['karate'], 'BYAKUREN KARATE KAIKAN': ['karate'], 'KRAV MAGA': ['krav-maga'],
    'TAEKWON DO': ['taekwondo'], 'KUNG FU': ['kung-fu'], 'LARAW KALI PAMUOK': ['kali'],
}
OTRAS = {'SAVATE': 'Savate', 'PANKRATION': 'Pankration', 'KUDO': 'Kudo', 'NIPPON KEMPO KYOKAI': 'Nippon kempo',
         'KAJUKENBO': 'Kajukenbo', 'TAI JITSU': 'Tai jitsu', 'XTREM': None, 'XTRIKE COMBAT SUPER LEAGUE': None,
         'DEFCON MUNGOT': None, 'CARDIO KICKBOXING': None}
MAX_CREIBLE = 12  # OWKLE ofrece 24; quien las marca todas no aporta información


sys.path.insert(0, str(pathlib.Path(__file__).parent))
from importar_comun import bonito, cargar_directorio, duplicado, guardar, insertar, municipio as municipio_comun, slugify

ALIAS = {'hospitalet de llobregat': "l'hospitalet de llobregat", 'l hospitalet': "l'hospitalet de llobregat",
         'gerona': 'girona', 'lerida': 'lleida', 'sant adria': 'sant adria de besos', 'sant adria del besos': 'sant adria de besos',
         'balafia': 'lleida', 'esparraguera': 'esparreguera', 'llica de munt': "llica d'amunt", 'sant marti de sarroca': 'sant marti sarroca',
         "castell d'aro": "platja d'aro i s'agaro castell d'aro", 'castell d aro': "platja d'aro i s'agaro castell d'aro",
         'san celoni': 'sant celoni', 'sant andres de la barca': 'sant andreu de la barca', 'la canya': "la vall d'en bas"}
municipio = lambda localidad: municipio_comun(localidad, ALIAS)


archivos, existentes = cargar_directorio()
slugs = {c['slug'] for _, c in existentes}

nuevos, ya, candidatos, sin_muni = [], [], [], []
for club in OWKLE['clubs']:
    if 'owkle.es' in club['url'] and any(c.get('fuente') == club['url'] for _, c in existentes):
        continue  # ya importado en otra pasada
    m = municipio(club['localidad'])
    # Correcciones comprobadas a mano: la localidad de OWKLE contradice la dirección
    if club['url'].endswith('/aranha-hospitalet/'): m = municipio('Barcelona')  # Constitució 169, 08014: Sants-Montjuïc
    if not m:
        sin_muni.append(club); continue
    disc_o = club['disciplinas_owkle']
    disc = sorted({d for x in disc_o for d in MAPA.get(x, [])})
    otras = [OTRAS[x] for x in disc_o if OTRAS.get(x)]
    nombre = bonito(club['nombre'])
    if len(disc_o) > MAX_CREIBLE or not disc:
        candidatos.append({'nombre': nombre, 'municipio': m['slug'], 'pista': club['url'],
                           'motivo': 'OWKLE: marca casi todas sus disciplinas' if disc else 'OWKLE: sin disciplina de la taxonomía (solo cardio o estilos sin equivalente)'})
        continue
    dup = duplicado(nombre, m, disc, club['direccion'], existentes)
    if dup:
        ya.append((nombre, dup['slug'])); continue
    slug = slugify(nombre)
    if slug in slugs: slug = f"{slug}-{m['slug']}"
    slugs.add(slug)
    ficha = {'slug': slug, 'nombre': nombre,
             'tipo': 'club' if re.search(r'(?i)\bclub\b', nombre) else 'gimnasio',
             'municipio': m['slug'], 'disciplinas': disc}
    if otras: ficha['otras'] = otras
    direccion = re.sub(r',\s*(España|Spain)\s*$', '', club['direccion']).strip()
    if direccion and '<' not in direccion and re.search(r'[A-Za-z]{3}.*\d', direccion) and not re.search(r'@|\d{3}\s?\d{3}\s?\d{3}', direccion):
        ficha['direccion'] = direccion
    ficha.update({'fuente': club['url'], 'fuenteTipo': 'federacion', 'verificado': OWKLE['generado']})
    insertar(archivos, m['comarca'], ficha)
    existentes.append((m['comarca'], ficha))
    nuevos.append(ficha)

guardar(archivos)
pc = DATA / 'candidatos/owkle.json'
previos = json.load(open(pc)) if pc.exists() else []
nombres = {c['nombre'] for c in previos}
pc.write_text(json.dumps(previos + [c for c in candidatos if c['nombre'] not in nombres], ensure_ascii=False, indent=1) + '\n')

print(f'nuevos: {len(nuevos)} | ya en el directorio: {len(ya)} | candidatos: {len(candidatos)} | sin municipio: {len(sin_muni)}')
for n, s in ya: print(f'  ya: {n} = {s}')
for c in sin_muni: print(f"  sin municipio: {c['nombre']} ({c['localidad']})")
