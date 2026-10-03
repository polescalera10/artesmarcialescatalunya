#!/usr/bin/env python3
"""Busca enlaces internos rotos en dist/ (ejecutar después de `npm run build`).
Uso: python3 scripts/enlaces.py"""
import glob, os, re, sys, json
from collections import Counter

RAIZ = os.path.join(os.path.dirname(__file__), '..')
DIST = os.path.join(RAIZ, 'dist')
existentes = set()
for f in glob.glob(f'{DIST}/**/*', recursive=True):
    rel = f[len(DIST):]
    existentes.add(rel)
    if rel.endswith('/index.html'):
        existentes.add(rel[:-len('index.html')])
redirigidos = {r['source'] for r in json.load(open(os.path.join(RAIZ, 'vercel.json')))['redirects']}

rotos = Counter()
for f in glob.glob(f'{DIST}/**/*.html', recursive=True):
    for h in re.findall(r'href="(/[^"#?]*)', open(f, encoding='utf-8').read()):
        if h not in existentes and h not in redirigidos:
            rotos[(h, f[len(DIST):])] += 1
if rotos:
    for (h, pagina), n in sorted(rotos.items()):
        print(f'{h}  (en {pagina})')
    sys.exit(1)
print(f'OK: sin enlaces internos rotos ({len(existentes)} rutas)')
