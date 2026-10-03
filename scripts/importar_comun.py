"""Funciones compartidas por los importadores de fuentes estructuradas
(importar-registro.py; importar-owkle.py tiene su copia previa).

Deduplicación: mismo municipio y, o bien comparten una palabra distintiva del
nombre (sin genéricos ni el nombre del pueblo), o nombre compactado parecido
(difflib >= 0,85, o uno contiene al otro), o misma calle y número con alguna
disciplina en común (en un polideportivo conviven varios clubs).
"""
import difflib, json, pathlib, re, unicodedata

RAIZ = pathlib.Path(__file__).resolve().parent.parent
DATA = RAIZ / 'data'


def ascii_(s): return unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
def norm(s): return re.sub(r'[^a-z0-9]+', ' ', ascii_(s.replace('’', "'")).lower()).strip()
def slugify(s): return re.sub(r'[^a-z0-9]+', '-', ascii_(re.sub(r"['’´`]", '', s)).lower()).strip('-')


SIGLAS = {'MMA', 'BJJ', 'BCN', 'DYM', 'TMC', 'SRK', 'JK', 'K1', 'K2', 'TKD', 'AAMS', 'AAMV', 'CALG', 'DKSR', 'MT', 'XFIT', 'V20', 'CE', 'AE', 'CN', 'UE', 'ITF', 'WTF', 'AMPA', 'CEM', 'SCD', 'UEC'}
MINUSCULAS = {'de', 'del', 'la', 'el', 'les', 'els', 'i', 'y', 'en', 'a', 'per'}


# Acentos que el Registre d'Entitats Esportives pierde (escribe en mayúsculas sin tildes).
ACENTOS = {
    'Associacio': 'Associació', 'Asociacion': 'Asociación', 'Gimnas': 'Gimnàs', 'Valles': 'Vallès', 'Gava': 'Gavà',
    'Cervello': 'Cervelló', 'Mataro': 'Mataró', 'Sadurni': 'Sadurní', 'Barbera': 'Barberà', 'Palleja': 'Pallejà',
    'Cornella': 'Cornellà', 'Eulalia': 'Eulàlia', 'Natacio': 'Natació', 'Unio': 'Unió', 'Gimnastic': 'Gimnàstic',
    'Gimnastica': 'Gimnàstica', 'Fenix': 'Fènix', 'Sadurni': 'Sadurní', 'Iniciacio': 'Iniciació', 'Educacio': 'Educació',
    'Formacio': 'Formació', 'Agrupacio': 'Agrupació', 'Federacio': 'Federació', 'Seccio': 'Secció', 'Penedes': 'Penedès',
    'Emporda': 'Empordà', 'Girones': 'Gironès', 'Bages': 'Bages', 'Llucanes': 'Lluçanès', 'Ripolles': 'Ripollès',
    'Tarragones': 'Tarragonès', 'Barcelones': 'Barcelonès', 'Segria': 'Segrià', 'Montsia': 'Montsià', 'Sitges': 'Sitges',
    'Lleida': 'Lleida', 'Andreu': 'Andreu', 'Adria': 'Adrià', 'Llica': 'Lliçà', 'Martorelles': 'Martorelles',
    'Montcada': 'Montcada', 'Montmelo': 'Montmeló', 'Bisbal': 'Bisbal', 'Sallent': 'Sallent', 'Llinars': 'Llinars',
    'Celoni': 'Celoni', 'Calafell': 'Calafell', 'Vendrell': 'Vendrell', 'Ametlla': 'Ametlla', 'Sentmenat': 'Sentmenat',
    'Poliesportiu': 'Poliesportiu', 'Pavello': 'Pavelló', 'Olimpic': 'Olímpic', 'Olimpica': 'Olímpica', 'Atletic': 'Atlètic',
    'Tecnica': 'Tècnica', 'Esportiu': 'Esportiu', 'Diniciacio': "d'Iniciació", 'Dinciacio': "d'Iniciació",
}


def acentuar(nombre: str) -> str:
    return re.sub(r"[A-Za-z]+", lambda m: ACENTOS.get(m.group(0), m.group(0)), nombre)


def bonito(nombre: str) -> str:
    """Nombres en mayúsculas a formato normal; el resto se deja igual."""
    nombre = re.sub(r'\s+', ' ', nombre.replace('’', "'")).strip()
    letras = [c for c in nombre if c.isalpha()]
    if not letras or sum(c.isupper() for c in letras) < 0.8 * len(letras):
        return nombre
    out = []
    for i, w in enumerate(nombre.split(' ')):
        base = re.sub(r'[^\w]', '', w)
        if base in SIGLAS or re.fullmatch(r'([A-Z]\.)+', w):
            out.append(w)
        elif i and w.lower() in MINUSCULAS:
            out.append(w.lower())
        else:
            w2 = re.sub(r"(^|['\-(])(\w)", lambda m: m.group(1) + m.group(2).upper(), w.lower())
            w2 = re.sub(r"\b([DL])'(\w)", lambda m: m.group(1).lower() + "'" + m.group(2).upper(), w2) if i else w2
            out.append(re.sub(r"'S\b", "'s", w2))
    return ' '.join(out)


MUNICIPIOS = json.load(open(DATA / 'geo/municipios.json'))
_por_nombre = {norm(m['nombre']): m for m in MUNICIPIOS}


def municipio(nombre: str, alias: dict | None = None):
    k = norm(nombre)
    # Formato de registro: "Papiol, el" / "Hospitalet de Llobregat, l'"
    m = re.match(r"^(.*?)\s*,\s*(el|la|les|els|l')$", nombre.strip(), re.I)
    if m:
        k = norm(f"{m.group(2)} {m.group(1)}" if not m.group(2).endswith("'") else f"{m.group(2)}{m.group(1)}")
    if alias and k in alias:
        k = norm(alias[k])
    if k in _por_nombre:
        return _por_nombre[k]
    for pref in ('el ', 'la ', 'les ', 'els ', 'l '):
        if k.startswith(pref) and k[len(pref):] in _por_nombre:
            return _por_nombre[k[len(pref):]]
        if pref + k in _por_nombre:
            return _por_nombre[pref + k]
    return None


VACIAS = set('''club clubs esportiu esportiva esportius deportivo deportiva associacio asociacion asociacio agrupacio
gimnas gimnasio gym team escola escuela academia academy de del la el les els i y d l fight fighters fighting training
camp center centre boxing boxa box boxeo muay thai kick kickboxing mma bjj arts artes marcials marciales marcial the
fitness sport sports esport esports dojo karate taekwondo taekwon judo crew bcn barcelona kai ryu top valles eixample
gracia seccio secció'''.split())


def tokens(s, mun=''):
    fuera = VACIAS | set(norm(mun).split())
    return {t for t in norm(s).split() if t not in fuera and len(t) > 2}


def compacto(s, mun=''):
    c = re.sub(r'[^a-z0-9]', '', norm(s))
    for t in sorted(norm(mun).split(), key=len, reverse=True):
        if len(t) > 3:
            c = c.replace(t, '')
    return c


def parecido(a, b, mun):
    x, y = compacto(a, mun), compacto(b, mun)
    return bool(x and y) and (x == y or (min(len(x), len(y)) >= 5 and (x in y or y in x))
                               or difflib.SequenceMatcher(None, x, y).ratio() >= 0.85)


def calle(s):
    m = re.match(r'\s*([^,]+?),?\s*(\d+)', norm(s) if s else '')
    return (m.group(1).split()[-1], m.group(2)) if m else None


def duplicado(nombre, mun, disc, direccion, existentes):
    t, cl = tokens(nombre, mun['nombre']), calle(direccion)
    return next((c for _, c in existentes if c['municipio'] == mun['slug'] and
                 ((t and t & tokens(c['nombre'], mun['nombre'])) or parecido(nombre, c['nombre'], mun['nombre']) or
                  (cl and calle(c.get('direccion', '')) == cl and set(disc) & set(c['disciplinas'])))), None)


def cargar_directorio():
    archivos = {p.stem: json.load(open(p)) for p in sorted((DATA / 'centros').glob('*.json'))}
    existentes = [(com, c) for com, l in archivos.items() for c in l]
    return archivos, existentes


def insertar(archivos, comarca, ficha):
    """Inserta en su sitio alfabético sin reordenar el resto del archivo."""
    lista = archivos.setdefault(comarca, [])
    pos = next((i for i, x in enumerate(lista) if x['nombre'].lower() > ficha['nombre'].lower()), len(lista))
    lista.insert(pos, ficha)


def guardar(archivos):
    for com, l in archivos.items():
        texto = json.dumps(l, ensure_ascii=False, indent=1) + '\n'
        p = DATA / 'centros' / f'{com}.json'
        if not p.exists() or p.read_text() != texto:
            p.write_text(texto)
