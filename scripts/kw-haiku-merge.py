#!/usr/bin/env python3
"""Fusiona la clasificación hecha con Haiku (docs/blog-trafico/haiku/salida-N.json) con la de kw-agrupar.py.
Uso: python3 scripts/kw-haiku-merge.py <raw.json> <carpeta-haiku> <salida.csv>
Las consultas que kw-agrupar dejaba «sin clasificar» (salvo cabeza y ruido de letras) toman la intención y el
público de Haiku; las que Haiku marca util=false (fuera de Cataluña, entretenimiento, marcas) se descartan."""
import csv, collections, glob, json, os, re, sys
RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
raw_path, carpeta, salida = sys.argv[1:4]
src = open(os.path.join(RAIZ, 'scripts/kw-agrupar.py'), encoding='utf-8').read()
ns = {'__file__': os.path.join(RAIZ, 'scripts/kw-agrupar.py')}
sys.argv = ['x', raw_path, os.devnull]
exec(src[:src.index('filas = collections.defaultdict')], ns)
raw, clasifica = ns['raw'], ns['clasifica']
hk = {}
for f in glob.glob(os.path.join(carpeta, 'salida-*.json')):
    for r in json.load(open(f, encoding='utf-8')): hk[r['q']] = r
PUB = {'ninos': 'ninos', 'mujeres': 'mujeres', 'adultos': 'adultos', 'mayores': 'adultos', 'adolescentes': 'adolescentes', '-': '-'}
filas = collections.defaultdict(lambda: {'q': [], 'ap': 0, 'hk': 0})
desc = collections.Counter()
for q, v in raw.items():
    c = clasifica(q)
    if not c: desc['ruido o sin disciplina'] += 1; continue
    disc, aud, ints, loc = c
    intent = 'local' if loc else (ints[0] if ints else 'general')
    pub = '+'.join(sorted(aud)) or '-'
    via_hk = 0
    if intent == 'general' and q in hk:
        h = hk[q]
        if not h.get('util'): desc['descartada por Haiku (fuera de Cataluña, ficción, marcas...)'] += 1; continue
        intent = h['intent']; pub = PUB.get(h['publico'], '-') if pub == '-' else pub; via_hk = 1
    key = ('+'.join(sorted(disc)[:3]), pub, intent)
    f = filas[key]; f['q'].append(q); f['ap'] += len(v['semillas']); f['hk'] += via_hk
with open(salida, 'w', newline='', encoding='utf-8') as fh:
    w = csv.writer(fh); w.writerow(['disciplinas', 'publico', 'intencion', 'n_consultas', 'apoyo', 'n_haiku', 'ejemplos'])
    for (d, a, i), f in sorted(filas.items(), key=lambda kv: -kv[1]['ap']):
        w.writerow([d, a, i, len(f['q']), f['ap'], f['hk'], ' | '.join(sorted(f['q'], key=len)[:6])])
print(len(filas), 'clústeres;', dict(desc))
