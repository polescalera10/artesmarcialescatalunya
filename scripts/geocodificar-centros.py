#!/usr/bin/env python3
"""Geocodifica las direcciones de data/centros/*.json con CartoCiudad (IGN, CC BY 4.0)
y escribe data/geo/coordenadas-centros.json ({slug: [lat, lon]}).

Solo se guarda un punto cuando el geocodificador devuelve un PORTAL (número de
calle concreto) dentro del municipio del centro: una ficha no puede afirmar una
ubicación dudosa, así que las calles sin número o las coincidencias de otro
municipio se descartan (la ficha se queda sin mapa, como antes sin dirección).

Es incremental: reutiliza lo ya resuelto salvo con --rehacer.
Uso: python3 scripts/geocodificar-centros.py [--rehacer]
"""
import glob, json, math, os, re, sys, time, unicodedata, urllib.parse, urllib.request

RAIZ = os.path.join(os.path.dirname(__file__), '..')
SALIDA = os.path.join(RAIZ, 'data/geo/coordenadas-centros.json')
URL = 'https://www.cartociudad.es/geocoder/api/geocoder/findJsonp?'
MAX_KM = 20  # un portal a más de esto del centro del municipio es un error de geocodificación

municipios = {m['slug']: m for m in json.load(open(os.path.join(RAIZ, 'data/geo/municipios.json')))}


def sin_tildes(t):
    return unicodedata.normalize('NFD', t).encode('ascii', 'ignore').decode().lower()


def consulta(direccion, municipio):
    """Variantes de consulta, de más a menos completa. CartoCiudad no devuelve nada
    si la consulta lleva código postal o provincia, así que se quitan."""
    d = re.sub(r'\([^)]*\)', ' ', direccion)
    d = re.sub(r'\bs/n\b\.?', ' ', d, flags=re.I)
    d = re.sub(r'\bn[ºo°]\.?\s*(?=\d)|\bnúm\.?\s*|\bnum\.?\s*', ' ', d, flags=re.I)
    d = re.sub(r'\b\d{5}\b', ' ', d)
    d = re.sub(r'\b(barcelona|girona|gerona|lleida|lérida|tarragona|catalunya|cataluña|españa|espanya)\b', ' ', d, flags=re.I)
    d = re.sub(r'[–—-]{1,2}(?=\s)|(?<=\s)[–—-]{1,2}', ',', d)
    d = re.sub(r'(?i)\bc/\s*', 'Carrer ', d)
    d = re.sub(r'(?i)\bpç/?\s*', 'Plaça ', d)
    d = re.sub(r'(?i)\b(?:av|avda)\.?(?=\s)', 'Avinguda', d)
    d = re.sub(r'(?i)\bpza\.?(?=\s)', 'Plaza', d)
    d = re.sub(r'\s+', ' ', d)
    d = re.sub(r'\s*,(\s*,)+', ',', d)
    d = re.sub(r'(\s*,)+\s*$', '', d)
    d = re.sub(r'^[\s,]+', '', d).strip()
    if not d:
        return []
    # Quita el municipio si ya viene (se añade al final una sola vez).
    base = re.sub(re.escape(municipio), ' ', d, flags=re.I).strip(' ,')
    base = re.sub(r'\s+', ' ', base)
    variantes = [f'{base}, {municipio}']
    # Calle + primer número: descarta "baixos", "local", "1r 2a", etc.
    m = re.match(r'^(.*?\D)[\s,]*(\d+)(?:\s*[-–]\s*\d+)?\s*[A-Za-z]?\b', base)
    if m and m.group(1).strip(' ,'):
        v = f"{m.group(1).strip(' ,')} {m.group(2)}, {municipio}"
        if v not in variantes:
            variantes.append(v)
    return variantes


def km(a, b):
    r = math.radians
    dlat, dlon = r(b[0] - a[0]), r(b[1] - a[1])
    h = math.sin(dlat / 2) ** 2 + math.cos(r(a[0])) * math.cos(r(b[0])) * math.sin(dlon / 2) ** 2
    return 12742 * math.asin(math.sqrt(h))


def buscar(q):
    url = URL + urllib.parse.urlencode({'q': q, 'outputformat': 'json', 'limit': 1})
    req = urllib.request.Request(url, headers={'User-Agent': 'artesmarciales.cat-geocoder'})
    txt = urllib.request.urlopen(req, timeout=20).read().decode()
    m = re.fullmatch(r'\s*callback\((.*)\)\s*;?\s*', txt, re.S)
    return json.loads(m.group(1)) if m else None


previo = {} if '--rehacer' in sys.argv else (json.load(open(SALIDA)) if os.path.exists(SALIDA) else {})
coords, descartados, errores, nuevos = {}, [], [], 0

centros = [c for f in sorted(glob.glob(os.path.join(RAIZ, 'data/centros/*.json'))) for c in json.load(open(f)) if c.get('direccion')]
for i, c in enumerate(centros, 1):
    if c['slug'] in previo:
        coords[c['slug']] = previo[c['slug']]
        continue
    mun = municipios[c['municipio']]
    variantes = consulta(c['direccion'], mun['nombre'])
    if not variantes:
        descartados.append((c['slug'], 'dirección vacía tras limpiar'))
        continue
    r, fallo = None, None
    try:
        for q in variantes:
            r = buscar(q)
            time.sleep(0.25)
            if r and isinstance(r, dict) and r.get('type') == 'portal':
                break
    except Exception as e:  # red o JSON roto: se reintenta en la siguiente pasada
        errores.append((c['slug'], str(e)))
        continue
    nuevos += 1
    if not isinstance(r, dict) or r.get('type') != 'portal':
        descartados.append((c['slug'], f"{r.get('type', 'sin resultado') if isinstance(r, dict) else 'sin resultado'}: {variantes[-1]}"))
        continue
    if r.get('muniCode') != mun['ine'][:5]:
        descartados.append((c['slug'], f"otro municipio ({r.get('muni')}): {q}"))
        continue
    cp = re.search(r'\b(\d{5})\b', c['direccion'])
    if cp and r.get('postalCode') and cp.group(1) != r['postalCode']:
        descartados.append((c['slug'], f"código postal distinto ({cp.group(1)} vs {r['postalCode']}): {q}"))
        continue
    p = (r['lat'], r['lng'])
    if km(p, (mun['lat'], mun['lon'])) > MAX_KM:
        descartados.append((c['slug'], f'a más de {MAX_KM} km del municipio: {q}'))
        continue
    coords[c['slug']] = [round(p[0], 5), round(p[1], 5)]
    if nuevos % 50 == 0:
        print(f'{i}/{len(centros)}…', flush=True)

json.dump(dict(sorted(coords.items())), open(SALIDA, 'w'), ensure_ascii=False, indent=0)
print(f'{len(coords)} con portal de {len(centros)} con dirección; {len(descartados)} descartados; {len(errores)} errores de red')
for s, m in descartados[:40]:
    print('  ·', s, '—', m)
for s, m in errores[:10]:
    print('  ! ', s, '—', m)
