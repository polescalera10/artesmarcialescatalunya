#!/usr/bin/env python3
"""Cruza data/fuentes/abiertos.json (Overture + OSM, ver descargar-abiertos.py)
con el directorio y genera los candidatos nuevos en data/candidatos/abiertos.json.

No escribe en data/centros/: solo descubre. Un candidato se considera de
CONFIANZA ALTA si aparece en 2 fuentes independientes o su web existe; el resto
es de confianza baja y no debe publicarse sin verificar (ver el plan en MEMORY.md).

Pasos:
 1. Asigna municipio (por localidad o por el municipio más cercano <= 6 km) y
    descarta lo que cae fuera de Cataluña (Andorra, Rosellón, Aragón, Valencia).
 2. Descarta lo evidentemente no marcial (tatuajes, tiendas, yoga...) y marca
    los dudosos (fitboxing, cardio box).
 3. Une duplicados entre Overture y OSM.
 4. Cruza con los centros que ya tenemos (mismo criterio de importar_comun.py,
    más web idéntica y cercanía <= 120 m con nombre parecido).
 5. Informa de cobertura por comarca (centros nuestros encontrados / candidatos).

Uso: python3 scripts/cruzar-abiertos.py
"""
import collections, difflib, json, math, re, sys
from urllib.parse import urlparse
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent))
from importar_comun import DATA, MUNICIPIOS, cargar_directorio, duplicado, municipio, norm, parecido, tokens

PREFIJOS_CAT = ('08', '17', '25', '43')
NO_MARCIAL = re.compile(r'(?i)tatu|tattoo|tienda|shop|store|botiga|fisio|physio|restaur|sushi|bar |hotel|peluquer|barber|'
                        r'inmobil|abogad|escuela de idiomas|autoescuela|farmac|clinic|dental|veterin|taller|supermerc|'
                        r'yoga|pilates|danza|dance|ballet|zumba|spa\b|masaj|massatge|escuela infantil|guarder')
DUDOSO_FIT = re.compile(r'(?i)fit ?box|body ?combat|cardio ?box|cross ?fit|brooklyn|ring ?fit|boxfit')
MAPA_CAT = {'karate_club': 'karate', 'taekwondo_club': 'taekwondo', 'boxing_gym': 'boxeo', 'boxing_class': 'boxeo',
            'tai_chi_studio': 'tai-chi'}
MAPA_SPORT = {'karate': 'karate', 'judo': 'judo', 'taekwondo': 'taekwondo', 'boxing': 'boxeo', 'kickboxing': 'kickboxing',
              'aikido': 'aikido', 'kung_fu': 'kung-fu', 'muay_thai': 'muay-thai', 'hapkido': 'hapkido', 'kendo': 'kendo',
              'capoeira': 'capoeira', 'krav_maga': 'krav-maga', 'mma': 'mma', 'mixed_martial_arts': 'mma', 'wrestling': 'lucha',
              'brazilian_jiu-jitsu': 'jiu-jitsu-brasileno', 'brazilian_jiu_jitsu': 'jiu-jitsu-brasileno', 'jiu-jitsu': 'jiu-jitsu-japones'}


def km(a, b):
    dx = (a[1] - b[1]) * math.cos(math.radians((a[0] + b[0]) / 2)) * 111.32
    dy = (a[0] - b[0]) * 110.57
    return math.hypot(dx, dy)


def mismo_centro(nombre, mun, existentes):
    """Reglas extra tras importar_comun.duplicado, sacadas de revisar a mano una muestra:
    nombre casi igual (>= 0,78) o una palabra distintiva que es prefijo de otra (Impactkd / Impact)."""
    n, tk = norm(nombre), tokens(nombre, mun['nombre'])
    for _, c in existentes:
        if c['municipio'] != mun['slug']:
            continue
        if difflib.SequenceMatcher(None, n, norm(c['nombre'])).ratio() >= 0.78:
            return c
        tc = tokens(c['nombre'], mun['nombre'])
        if any(len(a) >= 5 and len(b) >= 5 and (a.startswith(b) or b.startswith(a)) for a in tk for b in tc):
            return c
    return None


def host(u):
    if not u:
        return None
    h = urlparse(u if '//' in u else '//' + u).netloc.lower().removeprefix('www.')
    return h if h and not re.search(r'facebook|instagram|google|linktr|wa\.me|business\.site', h) else None


def asignar_municipio(l):
    cp = (l.get('cp') or '').strip()
    if cp and re.fullmatch(r'\d{5}', cp) and cp[:2] not in PREFIJOS_CAT:
        return None
    if cp.upper().startswith('AD'):
        return None
    m = municipio(l['localidad']) if l.get('localidad') else None
    punto = (l['lat'], l['lon'])
    if m:
        return m if km(punto, (m['lat'], m['lon'])) <= 25 else None
    cerca = min(MUNICIPIOS, key=lambda x: km(punto, (x['lat'], x['lon'])))
    return cerca if km(punto, (cerca['lat'], cerca['lon'])) <= 6 else None


def disciplinas(l):
    cat = (l.get('categoria') or '').lower()
    if l['fuente'] == 'osm':
        return sorted({MAPA_SPORT[s] for s in re.split(r'[;,]', cat) if s.strip() in MAPA_SPORT})
    return [MAPA_CAT[cat]] if cat in MAPA_CAT else []


def main():
    lugares = json.load(open(DATA / 'fuentes/abiertos.json'))['lugares']
    archivos, existentes = cargar_directorio()
    coords = json.load(open(DATA / 'geo/coordenadas-centros.json'))
    por_slug = {c['slug']: (com, c) for com, c in existentes}
    hosts = {host(c.get('web')): c for _, c in existentes if host(c.get('web'))}

    descartes = collections.Counter()
    limpios = []
    for l in lugares:
        if l.get('estado') and l['estado'] != 'open':
            descartes['cerrado'] += 1; continue
        if not l.get('nombre') or NO_MARCIAL.search(l['nombre']):
            descartes['no marcial por nombre'] += 1; continue
        m = asignar_municipio(l)
        if not m:
            descartes['fuera de Cataluña'] += 1; continue
        l['mun'] = m
        l['disc'] = disciplinas(l)
        l['fit'] = bool(DUDOSO_FIT.search(l['nombre']))
        limpios.append(l)

    # Unir duplicados entre fuentes
    grupos = []
    for l in limpios:
        for g in grupos:
            p = g[0]
            if p['mun']['slug'] != l['mun']['slug'] or p['id'] == l['id']:
                continue
            cerca = km((p['lat'], p['lon']), (l['lat'], l['lon'])) <= 0.15
            if parecido(p['nombre'], l['nombre'], l['mun']['nombre']) or (cerca and (tokens(p['nombre'], l['mun']['nombre']) & tokens(l['nombre'], l['mun']['nombre'])
                                                                              or difflib.SequenceMatcher(None, norm(p['nombre']), norm(l['nombre'])).ratio() >= 0.5)):
                g.append(l); break
        else:
            grupos.append([l])

    cruce = []
    for g in grupos:
        base = max(g, key=lambda x: (bool(x.get('web')), bool(x.get('direccion'))))
        m = base['mun']
        disc = sorted({d for x in g for d in x['disc']})
        web = next((x['web'] for x in g if x.get('web')), None)
        redes = sorted({r for x in g for r in x.get('redes', [])})
        # ¿Ya lo tenemos?
        ya = None
        for x in g:
            ya = ya or duplicado(x['nombre'], m, disc, x.get('direccion') or '', existentes) or mismo_centro(x['nombre'], m, existentes)
        if not ya and host(web) in hosts:
            ya = hosts[host(web)]
        if not ya:
            for slug, (lat, lon) in coords.items():
                if slug in por_slug and km((lat, lon), (base['lat'], base['lon'])) <= 0.12 and \
                        difflib.SequenceMatcher(None, norm(base['nombre']), norm(por_slug[slug][1]['nombre'])).ratio() >= 0.45:
                    ya = por_slug[slug][1]; break
        cruce.append(dict(nombre=base['nombre'], municipio=m['slug'], comarca=m['comarca'], disciplinas=disc,
                          direccion=base.get('direccion'), web=web, redes=redes, lat=round(base['lat'], 5), lon=round(base['lon'], 5),
                          fuentes=sorted({x['fuente'] for x in g}), categorias=sorted({x['categoria'] for x in g if x.get('categoria')}),
                          dudoso_fit=all(x['fit'] for x in g), ya=ya['slug'] if ya else None,
                          ya_tipo=ya.get('fuenteTipo') if ya else None))

    nuevos = [dict(c) for c in cruce if not c['ya']]
    for c in nuevos:
        c['confianza'] = 'alta' if (len(c['fuentes']) > 1 or c['web']) and not c['dudoso_fit'] else 'baja'
        c.pop('ya'); c.pop('ya_tipo')
    nuevos.sort(key=lambda c: (c['comarca'], c['municipio'], c['nombre']))
    (DATA / 'candidatos/abiertos.json').write_text(json.dumps(nuevos, ensure_ascii=False, indent=1) + '\n')

    enc = [c for c in cruce if c['ya']]
    # Fichas que ya tenemos y a las que las bases abiertas pueden aportar una web o una dirección
    enriquecer = []
    for c in enc:
        _, ficha = por_slug[c['ya']]
        if (c['web'] and not ficha.get('web')) or (c['direccion'] and not ficha.get('direccion')):
            enriquecer.append(dict(slug=c['ya'], nombre=ficha['nombre'], fuenteTipo=ficha.get('fuenteTipo'), municipio=c['municipio'],
                                   web=c['web'] if not ficha.get('web') else None,
                                   direccion=c['direccion'] if not ficha.get('direccion') else None, redes=c['redes']))
    (DATA / 'candidatos/abiertos-enriquecer.json').write_text(json.dumps(enriquecer, ensure_ascii=False, indent=1) + '\n')
    print(f'Fichas existentes que ganarían web o dirección: {len(enriquecer)} '
          f'(con web nueva {sum(1 for e in enriquecer if e["web"])}, del registro {sum(1 for e in enriquecer if e["fuenteTipo"] == "registro-oficial" and e["web"])})')
    print(f'Lugares {len(lugares)} -> descartes {dict(descartes)}; tras unir fuentes {len(cruce)}')
    print(f'Ya los tenemos: {len(enc)} (verificados {sum(1 for c in enc if c["ya_tipo"] != "registro-oficial")}, '
          f'registro {sum(1 for c in enc if c["ya_tipo"] == "registro-oficial")}); candidatos nuevos: {len(nuevos)} '
          f'(alta {sum(1 for c in nuevos if c["confianza"] == "alta")}, baja {sum(1 for c in nuevos if c["confianza"] == "baja")}, '
          f'dudosos fitness {sum(1 for c in nuevos if c["dudoso_fit"])})')
    tot = collections.Counter(c['comarca'] for c in cruce); hit = collections.Counter(c['comarca'] for c in enc)
    nue = collections.Counter(c['comarca'] for c in nuevos)
    nuestros = collections.Counter(com for com, _ in existentes)
    print('comarca | nuestros | en bases abiertas | ya tenemos | nuevos | cobertura (ya/(ya+nuevos))')
    for com in sorted(nuestros | tot, key=lambda c: -nue[c]):
        if tot[com] or nuestros[com]:
            cob = f'{100 * hit[com] / tot[com]:.0f} %' if tot[com] else '-'
            print(f'{com:18}| {nuestros[com]:4} | {tot[com]:3} | {hit[com]:3} | {nue[com]:3} | {cob}')
    # Estimación Lincoln-Petersen: N = n1*n2/m (indicativa: las fuentes no son independientes del todo)
    n1, n2, m = sum(nuestros.values()), len(cruce), len(enc)
    if m:
        print(f'Estimación Lincoln-Petersen (nuestras fichas {n1}, bases abiertas {n2}, solapadas {m}): ≈ {round(n1 * n2 / m)} centros en total')


if __name__ == '__main__':
    main()
