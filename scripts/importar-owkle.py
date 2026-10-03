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
import json, pathlib, re, unicodedata, datetime, difflib

RAIZ = pathlib.Path(__file__).resolve().parent.parent
DATA = RAIZ / 'data'
OWKLE = json.load(open(DATA / 'fuentes/owkle.json'))
MUNICIPIOS = json.load(open(DATA / 'geo/municipios.json'))
HOY = datetime.date.today().isoformat()

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


def ascii_(s): return unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
def norm(s): return re.sub(r'[^a-z0-9]+', ' ', ascii_(s.replace('’', "'")).lower()).strip()
def slugify(s): return re.sub(r'[^a-z0-9]+', '-', ascii_(re.sub(r"['’´`]", '', s)).lower()).strip('-')


def bonito(nombre):
    nombre = re.sub(r'\s+', ' ', nombre.replace('’', "'")).strip()
    if sum(c.isupper() for c in nombre if c.isalpha()) < 0.8 * max(1, sum(c.isalpha() for c in nombre)):
        return nombre
    SIGLAS = {'MMA', 'BJJ', 'BCN', 'DYM', 'TMC', 'SRK', 'JK', 'K1', 'K2', 'V20', 'AAMS', 'AAMV', 'CALG', 'DKSR', 'MT', 'XFIT'}
    MIN = {'de', 'del', 'la', 'el', 'les', 'els', 'i', 'y', 'en'}
    out = []
    for i, w in enumerate(nombre.split(' ')):
        base = re.sub(r'[^\w]', '', w)
        if base in SIGLAS or re.fullmatch(r'([A-Z]\.)+', w):
            out.append(w)
        elif i and w.lower() in MIN:
            out.append(w.lower())
        else:
            w2 = re.sub(r"(^|['\-(])(\w)", lambda m: m.group(1) + m.group(2).upper(), w.lower())
            out.append(re.sub(r"'S\b", "'s", w2))
    return ' '.join(out).replace("D'a", "d'A").replace("L'h", "L'H")


# Municipio por nombre (con alias de grafías castellanas o abreviadas)
por_nombre = {norm(m['nombre']): m for m in MUNICIPIOS}
ALIAS = {'hospitalet de llobregat': "l'hospitalet de llobregat", 'l hospitalet': "l'hospitalet de llobregat",
         'gerona': 'girona', 'lerida': 'lleida', 'sant adria': 'sant adria de besos', 'sant adria del besos': 'sant adria de besos',
         'balafia': 'lleida', 'esparraguera': 'esparreguera', 'llica de munt': "llica d'amunt", 'sant marti de sarroca': 'sant marti sarroca',
         "castell d'aro": "platja d'aro i s'agaro castell d'aro", 'castell d aro': "platja d'aro i s'agaro castell d'aro",
         'san celoni': 'sant celoni', 'sant andres de la barca': 'sant andreu de la barca', 'la canya': "la vall d'en bas"}
def municipio(localidad):
    k = norm(localidad)
    k = norm(ALIAS.get(k, k))
    if k in por_nombre: return por_nombre[k]
    for pref in ('el ', 'la ', 'les ', 'l '):
        if k.startswith(pref) and k[len(pref):] in por_nombre: return por_nombre[k[len(pref):]]
        if pref + k in por_nombre: return por_nombre[pref + k]
    return None


VACIAS = set('club clubs esportiu esportiva deportivo deportiva associacio asociacion asociacio gimnas gimnasio gym team escola escuela academia academy de del la el i y fight fighters fighting training camp center centre boxing boxa box boxeo muay thai kick kickboxing mma bjj arts artes marcials marciales the fitness sport sports dojo karate taekwondo judo crew bcn barcelona kai ryu top valles eixample gracia'.split())
def tokens(s, mun=''):
    fuera = VACIAS | set(norm(mun).split())
    return {t for t in norm(s).split() if t not in fuera and len(t) > 2}
def compacto(s, mun=''):
    # Nombre sin espacios ni símbolos ni el nombre del pueblo: "Nacional Fitness" = "Nacionalfitness", "K1" = "K-1"
    c = re.sub(r'[^a-z0-9]', '', norm(s))
    for t in sorted(norm(mun).split(), key=len, reverse=True):
        if len(t) > 3: c = c.replace(t, '')
    return c
def parecido(a, b, mun):
    x, y = compacto(a, mun), compacto(b, mun)
    return bool(x and y) and (x == y or (min(len(x), len(y)) >= 5 and (x in y or y in x))
                               or difflib.SequenceMatcher(None, x, y).ratio() >= 0.85)
def calle(s):
    m = re.match(r'\s*([^,]+?),?\s*(\d+)', norm(s) if s else '')
    return (m.group(1).split()[-1], m.group(2)) if m else None


archivos = {p.stem: json.load(open(p)) for p in sorted((DATA / 'centros').glob('*.json'))}
existentes = [(com, c) for com, l in archivos.items() for c in l]
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
    # Mismo club: mismo municipio y, o bien comparten una palabra distintiva del
    # nombre (sin genéricos ni el nombre del pueblo), o bien misma calle y número
    # y alguna disciplina en común (en un polideportivo conviven varios clubs).
    t, cl = tokens(nombre, m['nombre']), calle(club['direccion'])
    dup = next((c for _, c in existentes if c['municipio'] == m['slug'] and
                ((t and t & tokens(c['nombre'], m['nombre'])) or parecido(nombre, c['nombre'], m['nombre']) or
                 (cl and calle(c.get('direccion', '')) == cl and set(disc) & set(c['disciplinas'])))), None)
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
    # Se inserta en su sitio alfabético sin reordenar el resto del archivo
    lista = archivos[m['comarca']]
    pos = next((i for i, x in enumerate(lista) if x['nombre'].lower() > nombre.lower()), len(lista))
    lista.insert(pos, ficha)
    existentes.append((m['comarca'], ficha))
    nuevos.append(ficha)

for com, l in archivos.items():
    texto = json.dumps(l, ensure_ascii=False, indent=1) + '\n'
    p = DATA / 'centros' / f'{com}.json'
    if p.read_text() != texto: p.write_text(texto)
pc = DATA / 'candidatos/owkle.json'
previos = json.load(open(pc)) if pc.exists() else []
nombres = {c['nombre'] for c in previos}
pc.write_text(json.dumps(previos + [c for c in candidatos if c['nombre'] not in nombres], ensure_ascii=False, indent=1) + '\n')

print(f'nuevos: {len(nuevos)} | ya en el directorio: {len(ya)} | candidatos: {len(candidatos)} | sin municipio: {len(sin_muni)}')
for n, s in ya: print(f'  ya: {n} = {s}')
for c in sin_muni: print(f"  sin municipio: {c['nombre']} ({c['localidad']})")
