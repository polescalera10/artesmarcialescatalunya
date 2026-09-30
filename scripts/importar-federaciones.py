"""Convierte data/fuentes/federaciones.json en fichas del directorio.

Los listados de clubs de las federaciones catalanas son fuente válida
(fuenteTipo "federacion", ver data/INSTRUCCIONES-CENTROS.md). Este script:
  - descarta entradas que no son clubs (patrocinadores, empresas de material);
  - pasa a formato normal los nombres escritos en mayúsculas;
  - fusiona el mismo club cuando aparece en varios listados (suma disciplinas);
  - si el club ya está en el directorio con verificación propia, no crea otra
    ficha: le añade las disciplinas de la federación y conserva su fuente.

Es idempotente: se puede volver a lanzar cuando se actualice federaciones.json.
Uso: python3 scripts/importar-federaciones.py
"""
import json, re, unicodedata, collections, pathlib

RAIZ = pathlib.Path(__file__).resolve().parent.parent
DATA = RAIZ / 'data'
fed = json.load(open(DATA / 'fuentes/federaciones.json'))
municipios = {m['slug']: m for m in json.load(open(DATA / 'geo/municipios.json'))}
disciplinas = {d['slug'] for d in json.load(open(DATA / 'disciplinas.json'))}
GENERADO = fed['generado']

NO_CLUBS = re.compile(r'(?i)^(la caixa|daedo s\.?l\.?)$')

def ascii_(s):
    return unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()

def slugify(s):
    # El acento agudo suelto (´) se descompone en espacio + tilde con NFKD:
    # hay que quitar los apóstrofos antes de pasar a ASCII.
    s = ascii_(re.sub(r"['´’‘`ʼ]", '', s)).lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')

MINUSCULAS = {'de', 'del', 'la', 'el', 'les', 'els', 'los', 'las', 'i', 'y', 'e', 'd', 'l', 'a', 'en', 'per', 'para'}
SIGLAS = {'CE', 'CN', 'AE', 'AEE', 'ADV', 'CEM', 'UE', 'TKD', 'MMA', 'BJJ', 'KO', 'KBMT', 'SAB', 'SL', 'DA', 'DP', 'JJ', 'CD', 'CC', 'CEE', 'AMPA', 'AE', 'UEC', 'ASD', 'SCD', 'GEM', 'ITF', 'WTF', 'CAE', 'EM', 'AAMM', 'KDT'}

def bonito(nombre: str) -> str:
    """Nombres en mayúsculas a formato normal; los demás se dejan como están."""
    nombre = re.sub(r"[´’‘`ʼ]", "'", nombre).strip()
    letras = [c for c in nombre if c.isalpha()]
    if not letras or sum(c.isupper() for c in letras) / len(letras) < 0.8:
        return nombre
    palabras = []
    for i, w in enumerate(re.split(r'(\s+)', nombre)):
        if w.isspace() or not w:
            palabras.append(w); continue
        base = w.strip('.,()"')
        if base.replace('.', '') in SIGLAS or re.fullmatch(r'([A-Z]\.){2,}', base):
            palabras.append(w); continue
        partes = []
        for p in re.split(r"(['\-])", w.lower()):
            if p in ("'", '-'):
                partes.append(p)
            elif partes and partes[-1] == "'" and len(partes) >= 2 and partes[-2] in ('d', 'l'):
                partes.append(p[:1].upper() + p[1:])
            elif partes and partes[-1] == "'":
                partes.append(p)  # genitivo inglés: Choi's, no Choi'S
            else:
                partes.append(p if (i > 0 and p in MINUSCULAS) else p[:1].upper() + p[1:])
        palabras.append(''.join(partes))
    return ''.join(palabras)

VACIAS = set('''club clubs esportiu esportiva esportius deportivo deportiva associacio asociacion associació asociación
escola escuela gimnas gimnasio gym dojo centre centro arts artes marcials marciales judo karate taekwondo taekwon do
boxa boxeo box kickboxing kick boxing muay thai jiu jitsu jiujitsu brasiler brasileno hapkido aikido kendo lluita lucha
de del la el les els los las i y d l team academia academy escola sport sports fight club ce cn ae ad s sl the and
seccio seccion tkd tae kwon wushu kung fu kyokushin shotokan'''.split())

def fichas_tokens(nombre: str, municipio: str) -> set:
    muni = set(slugify(municipios[municipio]['nombre']).split('-')) if municipio in municipios else set()
    return {t for t in slugify(nombre).split('-') if len(t) >= 3 and t not in VACIAS and t not in muni}

def tipo(nombre: str) -> str:
    n = ascii_(nombre).lower()
    if re.match(r'(associacio|asociacion|a\.?e\.?\b)', n): return 'asociacion'
    if re.match(r'(club|c\.?e\.?\b|c\.?d\.?\b|cn\b)', n): return 'club'
    if re.search(r'\b(gym|gimnas|gimnasio|fitness|sport center)\b', n): return 'gimnasio'
    return 'escuela'

# ── 1. Fusionar el mismo club entre listados ───────────────────────────────
grupos = collections.OrderedDict()
descartados = []
for c in fed['clubs']:
    if NO_CLUBS.match(c['nombre'].strip()):
        descartados.append(c['nombre']); continue
    if not c.get('municipio'):
        continue
    clave = (c['municipio'], slugify(c['nombre']))
    g = grupos.setdefault(clave, {'nombres': [], 'disciplinas': [], 'direccion': None, 'web': None, 'fuente': c['fuente'], 'municipio': c['municipio'], 'otras': []})
    g['nombres'].append(c['nombre'])
    for d in c.get('disciplinas', []):
        if d in disciplinas and d not in g['disciplinas']: g['disciplinas'].append(d)
    if not g['disciplinas'] and c.get('disciplinasTexto'):
        g['otras'].append(c['disciplinasTexto'])
    g['direccion'] = g['direccion'] or c.get('direccion')
    web = c.get('web')
    if web and (not g['web'] or ('facebook' in g['web'] and 'facebook' not in web)): g['web'] = web

# ── 2. Cargar el directorio actual ─────────────────────────────────────────
por_comarca = collections.defaultdict(list)
for f in sorted((DATA / 'centros').glob('*.json')):
    por_comarca[f.stem] = json.load(open(f))
existentes = [c for lista in por_comarca.values() for c in lista]
slugs = {c['slug'] for c in existentes}

def coincide(g):
    """Centro ya existente en el mismo municipio con nombre parecido."""
    tok = set().union(*(fichas_tokens(n, g['municipio']) for n in g['nombres']))
    for c in existentes:
        if c['municipio'] != g['municipio']: continue
        if slugify(c['nombre']) in {slugify(n) for n in g['nombres']}: return c
        suyo = fichas_tokens(c['nombre'], c['municipio'])
        if tok and tok & suyo: return c
        # Nombres genéricos ("TKD Cubelles", "Club Taekwondo Cubelles"): sin
        # palabras propias, se casan si comparten municipio y disciplina.
        if not tok and not suyo and set(g['disciplinas']) & set(c['disciplinas']): return c
    return None

nuevos = enriquecidos = 0
for g in grupos.values():
    previo = coincide(g)
    if previo:
        antes = len(previo['disciplinas'])
        previo['disciplinas'] += [d for d in g['disciplinas'] if d not in previo['disciplinas']]
        enriquecidos += len(previo['disciplinas']) > antes
        continue
    nombre = min((bonito(n) for n in g['nombres']), key=lambda n: (n.isupper(), len(n)))
    slug = slugify(nombre)
    if slug in slugs: slug = f'{slug}-{g["municipio"]}'
    i = 2
    while slug in slugs: slug = f'{slug}-{i}'; i += 1
    slugs.add(slug)
    ficha = {'slug': slug, 'nombre': nombre, 'tipo': tipo(nombre), 'municipio': g['municipio'], 'disciplinas': g['disciplinas']}
    if g['otras']: ficha['otras'] = sorted(set(g['otras']))
    if g['direccion']: ficha['direccion'] = bonito(g['direccion'])
    if g['web']: ficha['web'] = g['web']
    ficha.update({'fuente': g['fuente'], 'fuenteTipo': 'federacion', 'verificado': GENERADO})
    comarca = municipios[g['municipio']]['comarca']
    por_comarca[comarca].append(ficha)
    existentes.append(ficha)
    nuevos += 1

for comarca, lista in por_comarca.items():
    lista.sort(key=lambda c: ascii_(c['nombre']).lower())
    json.dump(lista, open(DATA / 'centros' / f'{comarca}.json', 'w'), ensure_ascii=False, indent=1)

print(f'{len(grupos)} clubs únicos; {nuevos} fichas nuevas; {enriquecidos} fichas existentes con disciplinas añadidas; descartados: {descartados}')
print(f'{sum(len(l) for l in por_comarca.values())} centros en {len(por_comarca)} comarcas')
