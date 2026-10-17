#!/usr/bin/env python3
"""Inventario del blog: un CSV con slug, idioma, palabras, h1, fecha, actualizado, enlaces internos y
solape de encabezados con el resto de artículos (para detectar canibalización).
Uso: python3 scripts/inventario-blog.py <salida.csv>"""
import csv, glob, os, re, sys

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
STOP = set('de la el los las para en y o un una con que por del al se es a como qué cómo cuál cuáles entre sobre mi tu su sus lo le les'.split())

def leer(ruta):
    t = open(ruta, encoding='utf-8').read()
    m = re.match(r'^---\n(.*?)\n---\n(.*)$', t, re.S)
    fm, cuerpo = m.groups()
    def campo(n):
        r = re.search(rf'^{n}:\s*"?(.*?)"?\s*$', fm, re.M)
        return r.group(1) if r else ''
    return fm, cuerpo, campo

def toks(s):
    return {w for w in re.findall(r'[a-záéíóúñüàèòçl·]+', s.lower()) if w not in STOP and len(w) > 3}

filas = []
for idioma, carpeta in (('es', 'blog'), ('ca', 'blog-ca')):
    for ruta in sorted(glob.glob(os.path.join(RAIZ, 'src/content', carpeta, '*.md'))):
        fm, cuerpo, campo = leer(ruta)
        h2 = re.findall(r'^## (.+)$', cuerpo, re.M)
        enl = re.findall(r'\]\((/[^)]+)\)', cuerpo)
        filas.append({
            'idioma': idioma, 'slug': os.path.basename(ruta)[:-3], 'original': campo('original'),
            'tipo': campo('tipo'), 'fecha': campo('fecha'), 'actualizado': campo('actualizado'),
            'palabras': len(cuerpo.split()), 'h1': campo('h1'), 'titulo': campo('titulo'),
            'n_h2': len(h2), 'enlaces_internos': len(enl),
            'a_blog': sum(1 for e in enl if e.startswith('/blog/')),
            '_t': toks(campo('titulo') + ' ' + campo('h1') + ' ' + ' '.join(h2)),
        })

es = [f for f in filas if f['idioma'] == 'es']
for f in es:
    mejor, mj = '', 0.0
    for g in es:
        if g is f: continue
        j = len(f['_t'] & g['_t']) / max(1, len(f['_t'] | g['_t']))
        if j > mj: mejor, mj = g['slug'], j
    f['mas_parecido'], f['solape'] = mejor, round(mj, 2)
ca_orig = {f['original'] for f in filas if f['idioma'] == 'ca'}
for f in filas:
    f['tiene_ca'] = 'si' if f['idioma'] == 'es' and f['slug'] in ca_orig else ''
    f.pop('_t')

cols = ['idioma', 'slug', 'original', 'tipo', 'fecha', 'actualizado', 'palabras', 'n_h2', 'enlaces_internos', 'a_blog', 'tiene_ca', 'mas_parecido', 'solape', 'titulo', 'h1']
with open(sys.argv[1], 'w', newline='', encoding='utf-8') as fh:
    w = csv.DictWriter(fh, fieldnames=cols, extrasaction='ignore')
    w.writeheader(); w.writerows(filas)
print(len(filas), 'filas')
