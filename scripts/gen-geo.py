"""Genera data/geo/comarcas.json y data/geo/municipios.json a partir del
dataset oficial de municipios de la Generalitat (analisi.transparenciacatalunya.cat,
recurso 9aju-tpwc). Se ejecuta a mano cuando cambie el mapa municipal."""
import json, re, unicodedata, collections

PROV = {'08': 'Barcelona', '17': 'Girona', '25': 'Lleida', '43': 'Tarragona'}

def slug(s: str) -> str:
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    s = s.lower().replace("'", '').replace('·', '')
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')

def natural(nom: str) -> str:
    # El dataset escribe "Hospitalet de Llobregat, L'" y "Llacuna, La".
    if ', ' in nom:
        base, art = nom.rsplit(', ', 1)
        art = art[0].upper() + art[1:]
        return f"{art}{base}" if art.endswith("'") else f"{art} {base}"
    return nom

raw = json.load(open('data/geo/municipis-raw.json'))
for m in raw:
    m['nom'] = natural(m['nom'])
raw = [m for m in raw if m['codi_comarca'] not in ('98', '99')]

munis, coms = [], collections.OrderedDict()
for m in sorted(raw, key=lambda x: slug(x['nom'])):
    cs = slug(m['nom_comarca'])
    coms.setdefault(cs, {'slug': cs, 'nombre': m['nom_comarca'], 'codigo': m['codi_comarca'], 'provincias': set(), 'municipios': 0})
    prov = PROV[m['codi'][:2]]
    coms[cs]['provincias'].add(prov); coms[cs]['municipios'] += 1
    munis.append({
        'slug': slug(m['nom']), 'nombre': m['nom'], 'comarca': cs, 'provincia': prov,
        'ine': m['codi'], 'lat': round(float(m['latitud']), 5), 'lon': round(float(m['longitud']), 5),
    })

dups = [s for s, c in collections.Counter(m['slug'] for m in munis).items() if c > 1]
assert not dups, dups
out = sorted(({**c, 'provincias': sorted(c['provincias'])} for c in coms.values()), key=lambda c: c['slug'])
json.dump(out, open('data/geo/comarcas.json', 'w'), ensure_ascii=False, indent=1)
json.dump(munis, open('data/geo/municipios.json', 'w'), ensure_ascii=False, indent=1)
print(len(out), 'comarcas;', len(munis), 'municipios')
