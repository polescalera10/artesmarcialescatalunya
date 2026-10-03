#!/usr/bin/env python3
"""Valida data/centros/*.json con las mismas reglas que src/lib/centros.ts,
sin compilar el sitio. Uso: python3 scripts/validar-centros.py"""
import json, re, sys, glob, os

RAIZ = os.path.join(os.path.dirname(__file__), '..')
municipios = {m['slug']: m for m in json.load(open(os.path.join(RAIZ, 'data/geo/municipios.json')))}
comarcas = {c['slug'] for c in json.load(open(os.path.join(RAIZ, 'data/geo/comarcas.json')))}
disciplinas = {d['slug'] for d in json.load(open(os.path.join(RAIZ, 'data/disciplinas.json')))}
TIPOS = {'escuela', 'club', 'asociacion', 'gimnasio'}
FUENTES = {'web-oficial', 'federacion', 'directorio-municipal', 'registro-oficial', 'perfil-publico'}

errores, vistos, total = [], set(), 0
for ruta in sorted(glob.glob(os.path.join(RAIZ, 'data/centros/*.json'))):
    comarca = os.path.basename(ruta)[:-5]
    if comarca not in comarcas:
        errores.append(f'{ruta}: comarca {comarca} no existe')
    try:
        lista = json.load(open(ruta))
    except json.JSONDecodeError as e:
        errores.append(f'{ruta}: JSON inválido ({e})')
        continue
    for c in lista:
        total += 1
        s = c.get('slug', '?')
        m = municipios.get(c.get('municipio'))
        if not m:
            errores.append(f'{s}: municipio desconocido {c.get("municipio")}')
        elif m['comarca'] != comarca:
            errores.append(f'{s}: {c["municipio"]} es de {m["comarca"]}, no de {comarca}')
        for d in c.get('disciplinas', []):
            if d not in disciplinas:
                errores.append(f'{s}: disciplina desconocida {d}')
        if s in vistos:
            errores.append(f'slug duplicado: {s}')
        vistos.add(s)
        if not re.fullmatch(r'[a-z0-9]+(-[a-z0-9]+)*', s):
            errores.append(f'slug no válido: {s}')
        if c.get('tipo') not in TIPOS:
            errores.append(f'{s}: tipo no válido {c.get("tipo")}')
        if c.get('fuenteTipo') not in FUENTES or not c.get('fuente') or not re.fullmatch(r'\d{4}-\d{2}-\d{2}', c.get('verificado', '')):
            errores.append(f'{s}: falta fuente, fuenteTipo o fecha')
        if c.get('web') and not c['web'].startswith(('http://', 'https://')):
            errores.append(f'{s}: web sin protocolo')

if errores:
    print('\n'.join(errores))
    sys.exit(1)
print(f'OK: {total} centros')
