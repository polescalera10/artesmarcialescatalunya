#!/usr/bin/env python3
"""Importa al directorio lo que scripts/cruzar-abiertos.py y
scripts/verificar-webs-abiertos.py han dejado verificable por la web del centro.

Las bases abiertas (Overture, OSM) solo sirven para DESCUBRIR. Lo que se publica
sale de la web oficial del centro, que este script vuelve a abrir:
- Candidatos nuevos: solo los de confianza V (la web carga y cita una disciplina).
  Ficha `web-oficial`. Una disciplina entra solo si la web la cita 2 o más veces
  (o consta en el nombre o en la categoría); si salen más de 5, es una web de
  cadena o de federación y se deja sin disciplinas. Sin dirección: la web no se
  ha comprobado para ese dato.
- Fichas que ya tenemos: si la web es del centro (su nombre aparece en la página y
  comparte alguna disciplina), se añade `web`. Las del registro oficial pasan a
  `web-oficial` con la fecha de hoy.

Sin --aplicar solo informa. Idempotente (no vuelve a crear lo que ya existe).
Uso: python3 scripts/importar-abiertos.py [--aplicar]
"""
import argparse, collections, concurrent.futures as cf, datetime, json, re, ssl, sys, unicodedata, urllib.request
from urllib.parse import urlparse
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent))
from importar_comun import DATA, MUNICIPIOS, bonito, cargar_directorio, duplicado, guardar, insertar, norm, slugify, tokens
MUN = {m['slug']: m for m in MUNICIPIOS}

HOY = datetime.date.today().isoformat()
UA = 'Mozilla/5.0 (compatible; artesmarciales.cat-verificacion/1.0; +https://artesmarciales.cat/sobre-nosotros/)'
CTX = ssl.create_default_context()
DISC = json.load(open(DATA / 'disciplinas.json'))
PATRONES = {d['slug']: re.compile(r'\b(' + '|'.join(re.escape(norm(n)) for n in {d['es'], d['ca'], *d.get('sinonimos', [])} if len(norm(n)) >= 4) + r')\b')
            for d in DISC}
PAT_NOMBRE = {d['slug']: re.compile(r'(?:^| )(' + '|'.join(re.escape(norm(n)) for n in {d['es'], d['ca'], *d.get('sinonimos', [])} if len(norm(n)) >= 3) + r')(?: |$)')
              for d in DISC}
DEBILES = {'defensa-personal', 'tai-chi'}
RED = re.compile(r'facebook|instagram|google|goo\.gl|linktr|wa\.me|business\.site|tiktok|youtube')
# Revisados a mano el 18-10: web de otro negocio o de otro municipio, perfil de red social o duplicado de otra ficha
EXCLUIR = {'Club Esportiu Popular La Turba', 'GODAN Karate-Do', 'Bujinkan Mataro', 'Ryushin Shouchi Ryu España',
           'Bujinkan Matsukaze Dojo', 'Marcos Campos - Taekwondo CHS', 'Kuksoolcervello', 'Karate - Aikido',
           "Academia d'Arts Marcials Gombau",  # misma web que A.E. Karate Kobudo Tradicional Pirineus (La Seu d'Urgell): posible duplicado
           'Wrestling Estornell', 'Centro de Deportes Alfa 5 del Barri de la Llacuna', 'Associació de Karate Jutsu Palautordera'}  # la web no parece la del centro
NOMBRES = {'dymsitges': 'DYM Sitges', 'AFL MMA': 'AFL MMA'}
DISCIPLINAS_POR_CATEGORIA = {'tai_chi_studio': 'tai-chi', 'karate_club': 'karate', 'taekwondo_club': 'taekwondo', 'boxing_gym': 'boxeo'}


def leer(url):
    for u in (url if url.startswith('http') else 'https://' + url, ):
        for intento in (u, u.replace('https://', 'http://')):
            try:
                r = urllib.request.urlopen(urllib.request.Request(intento, headers={'User-Agent': UA}), timeout=15, context=CTX)
                html = r.read(400_000).decode(r.headers.get_content_charset() or 'utf-8', 'ignore')
                texto = norm(re.sub(r'<(script|style).*?</\1>|<[^>]+>', ' ', html, flags=re.S))
                return r.geturl().split('#')[0].split('?')[0], texto
            except Exception:
                pass
    return None


def disciplinas(texto, nombre, cats=()):
    n = norm(nombre)
    pegado = n.replace(' ', '')  # «aikidosakaki»: la disciplina va pegada al nombre
    found = {s for s, p in PATRONES.items() if len(p.findall(texto)) >= (3 if s in DEBILES else 2)}
    found |= {s for s, p in PAT_NOMBRE.items() if p.search(n)}
    found |= {d['slug'] for d in DISC for x in (d['es'], d['ca']) if len(norm(x).replace(' ', '')) >= 6 and norm(x).replace(' ', '') in pegado}
    found |= {DISCIPLINAS_POR_CATEGORIA[c] for c in cats if c in DISCIPLINAS_POR_CATEGORIA}
    return sorted(found) if len(found) <= 5 else []


def limpiar(nombre):
    nombre = NOMBRES.get(nombre, nombre).split(' ✦')[0]
    nombre = ''.join(ch for ch in nombre if ord(ch) < 0x250 or ch in '’–—')
    nombre = re.sub(r'\s+', ' ', nombre).strip(' -–—|:')
    return nombre if nombre in NOMBRES.values() else bonito(nombre)


def tipo(nombre):
    n = norm(nombre)
    if re.search(r'\b(associacio|asociacion)\b', n):
        return 'asociacion'
    if re.search(r'\b(club|cn|ce)\b', n):
        return 'club'
    if re.search(r'\b(gimnas|gimnasio|gym)\b', n):
        return 'gimnasio'
    return 'escuela'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--aplicar', action='store_true')
    a = ap.parse_args()
    archivos, existentes = cargar_directorio()
    por_slug = {c['slug']: c for _, c in existentes}
    slugs = set(por_slug)
    rev = (json.load(open(DATA / 'candidatos/abiertos-revision.json'))['candidatos']
           if (DATA / 'candidatos/abiertos-revision.json').exists() else {})
    # R/error de la primera pasada que la segunda lectura (revisar-dudosos-abiertos.py) ha dejado verificables
    nuevos = [c for c in json.load(open(DATA / 'candidatos/abiertos.json'))
              if (c.get('tier') == 'V verificable' or rev.get(c['nombre'], {}).get('tier') == 'V verificable') and c['nombre'] not in EXCLUIR]
    enr = [e for e in json.load(open(DATA / 'candidatos/abiertos-enriquecer.json')) if e.get('web')]
    with cf.ThreadPoolExecutor(12) as ex:
        pag_n = list(ex.map(lambda c: ('rev' in c and (c['rev']['url'], '')) or leer(c['web']), [dict(c, **({'rev': rev[c['nombre']]} if rev.get(c['nombre'], {}).get('tier') == 'V verificable' else {})) for c in nuevos]))
        pag_e = list(ex.map(lambda e: leer(e['web']), enr))

    saltos = collections.Counter()
    creadas = []
    for c, pag in zip(nuevos, pag_n):
        if not pag or RED.search(urlparse(pag[0]).netloc):
            saltos['web no carga o es una red social'] += 1; continue
        url, texto = pag
        mun = MUN[c['municipio']]
        nombre = limpiar(c['nombre'])
        disc = (rev[c['nombre']]['disciplinas'] if rev.get(c['nombre'], {}).get('tier') == 'V verificable'
                else disciplinas(texto, nombre, c.get('categorias', [])))
        if duplicado(nombre, mun, disc, '', [(k, v) for k, v in existentes]) or any(url.split('//')[1].removeprefix('www.').rstrip('/') == (x.get('web') or '').split('//')[-1].removeprefix('www.').rstrip('/') for _, x in existentes):
            saltos['ya existe (dedupe)'] += 1; continue
        slug = slugify(nombre)
        if slug in slugs:
            slug = f"{slug}-{c['municipio']}"
        if slug in slugs or not slug:
            saltos['slug repetido'] += 1; continue
        o, f_ = urlparse(c['web'] if '//' in c['web'] else '//' + c['web']), urlparse(url)
        path = o.path if o.netloc.removeprefix('www.') == f_.netloc.removeprefix('www.') and len(o.path) > 1 else ''
        if f_.netloc.endswith('wixsite.com') and len(f_.path) > 1:
            path = f_.path
        url = f"{f_.scheme}://{f_.netloc}{path or '/'}"
        ficha = {'slug': slug, 'nombre': nombre, 'tipo': tipo(nombre), 'municipio': c['municipio'], 'disciplinas': disc,
                 'web': url, 'fuente': url, 'fuenteTipo': 'web-oficial', 'verificado': HOY}
        slugs.add(slug)
        creadas.append((c['comarca'], ficha))
        existentes.append((c['comarca'], ficha))

    cambios = []
    for e, pag in zip(enr, pag_e):
        f = por_slug.get(e['slug'])
        if not f or f.get('web') or f['nombre'] in EXCLUIR:
            saltos['ficha ya con web o excluida'] += 1; continue
        if not pag or RED.search(urlparse(pag[0]).netloc):
            saltos['ficha: web no carga'] += 1; continue
        url, texto = pag
        mun = MUN[f['municipio']]
        palabras = set(texto.split()) | set(re.split(r'[^a-z0-9]+', urlparse(url).netloc))
        if not (tokens(f['nombre'], mun['nombre']) & palabras):
            saltos['ficha: la web no nombra al centro'] += 1; continue
        disc = disciplinas(texto, f['nombre'])
        if f.get('disciplinas') and not set(disc) & set(f['disciplinas']):
            saltos['ficha: la web no cita sus disciplinas'] += 1; continue
        cambios.append((f, url, disc))

    reg = 0
    for f, url, disc in cambios:
        f['web'] = url
        if f['fuenteTipo'] == 'registro-oficial':
            f.update(fuente=url, fuenteTipo='web-oficial', verificado=HOY)
            f['disciplinas'] = sorted(set(disc) & set(f.get('disciplinas', [])))  # solo lo que la web confirma de lo que ya constaba
            reg += 1
    for comarca, ficha in creadas:
        insertar(archivos, comarca, ficha)

    print(f'Nuevas fichas web-oficial: {len(creadas)}; fichas existentes con web nueva: {len(cambios)} (del registro a web-oficial: {reg})')
    print('Saltos:', dict(saltos))
    for comarca, f in creadas:
        print(f"  + {f['nombre']} | {f['municipio']} | {','.join(f['disciplinas']) or '-'} | {f['web']}")
    if a.aplicar:
        guardar(archivos)
        print('Guardado en data/centros/.')


if __name__ == '__main__':
    main()
