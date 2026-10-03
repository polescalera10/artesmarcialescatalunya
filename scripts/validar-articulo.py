#!/usr/bin/env python3
"""Comprueba un artículo del blog sin compilar el sitio.
Uso: python3 scripts/validar-articulo.py src/content/blog/<slug>.md

Revisa: frontmatter (campos y longitudes), marcadores de recuento con slugs
reales, enlaces internos (contra dist/ del último build y vercel.json),
guiones largos, y la nota de analyze_blog.py (mínimo 60 en castellano, ver CLAUDE.md)."""
import json, os, re, subprocess, sys

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
ruta = sys.argv[1]
texto = open(ruta, encoding='utf-8').read()
errores, avisos = [], []

m = re.match(r'^---\n(.*?)\n---\n(.*)$', texto, re.S)
if not m:
    sys.exit('Sin frontmatter delimitado por ---')
fm_txt, cuerpo = m.groups()

def campo(nombre):
    r = re.search(rf'^{nombre}:\s*"?(.*?)"?\s*$', fm_txt, re.M)
    return r.group(1) if r else None

for c in ['titulo', 'descripcion', 'h1', 'intro', 'tipo', 'fecha', 'actualizado']:
    if not campo(c):
        errores.append(f'falta {c} en el frontmatter')
if (t := campo('titulo')) and len(t) > 60: errores.append(f'titulo de {len(t)} caracteres (máx. 60)')
if (d := campo('descripcion')) and len(d) > 155: errores.append(f'descripcion de {len(d)} caracteres (máx. 155)')
if campo('tipo') not in ('articulo', 'guia'): errores.append('tipo debe ser articulo o guia')
for c in ['fecha', 'actualizado']:
    if campo(c) and not re.fullmatch(r'\d{4}-\d{2}-\d{2}', campo(c)): errores.append(f'{c} no es AAAA-MM-DD')
if 'faq:' not in fm_txt: avisos.append('sin faq en el frontmatter')

slug = os.path.basename(ruta)[:-3]
vercel = {r['source'] for r in json.load(open(os.path.join(RAIZ, 'vercel.json')))['redirects']}
if (ant := campo('slugAnterior')) and ant != slug and f'/blog/{ant}/' not in vercel:
    errores.append(f'slugAnterior {ant}: falta el 301 /blog/{ant}/ en vercel.json')

disc = {d['slug'] for d in json.load(open(os.path.join(RAIZ, 'data/disciplinas.json')))}
com = {c['slug'] for c in json.load(open(os.path.join(RAIZ, 'data/geo/comarcas.json')))}
mun = {x['slug'] for x in json.load(open(os.path.join(RAIZ, 'data/geo/municipios.json')))}
TIPOS = {'centros': [], 'comarcas': [], 'infantil': [], 'd': [disc], 'dmun': [disc], 'dcom': [disc], 'c': [com], 'm': [mun], 'dc': [disc, com], 'dm': [disc, mun], 'im': [mun], 'ic': [com]}
for k, *args in re.findall(r'\{\{([a-z]+)(?::([a-z0-9-]+))?(?::([a-z0-9-]+))?\}\}', texto):
    args = [a for a in args if a]
    if k not in TIPOS: errores.append(f'marcador desconocido {{{{{k}}}}}'); continue
    if len(args) != len(TIPOS[k]): errores.append(f'{{{{{k}}}}} lleva {len(TIPOS[k])} argumento(s)'); continue
    for a, conj in zip(args, TIPOS[k]):
        if a not in conj: errores.append(f'{{{{{k}:...}}}}: slug desconocido {a}')
if re.search(r'\{\{[^}]*[A-Z#][^}]*\}\}', texto): errores.append('marcadores antiguos del Garraf ({{M:..}}, {{x#}}): usa los de la sección 4 del playbook')

dist = os.path.join(RAIZ, 'dist')
for h in set(re.findall(r'\]\((/[^)\s#?]*)', texto) + re.findall(r'href="(/[^"#?]*)', texto)):
    p = h if h.endswith('/') else h + '/'
    if p.startswith('/blog/') and os.path.exists(os.path.join(RAIZ, 'src/content/blog', p.split('/')[2] + '.md')):
        continue
    if not (os.path.exists(os.path.join(dist, p.lstrip('/'), 'index.html')) or p in vercel):
        errores.append(f'enlace interno inexistente: {h}')
if not re.search(r'\]\(/(disciplinas|centros)/', texto) and not re.search(r'href="/(disciplinas|centros)/', texto):
    errores.append('no enlaza a ninguna página de disciplina ni al directorio (regla 7)')
if not re.search(r'\{\{', cuerpo + (campo('intro') or '')):
    errores.append('no usa ningún marcador de recuento (regla 7)')

if (n := len(re.findall('[—–]', texto))): errores.append(f'{n} guiones largos o medios')
if 'Garraf' in texto and 'garraf' not in slug: avisos.append('menciona el Garraf: comprueba que sea solo como ejemplo')
palabras = len(re.sub(r'[#*_>\[\]()`|-]', ' ', cuerpo).split())
if not 1000 <= palabras <= 1600: avisos.append(f'cuerpo de {palabras} palabras (objetivo 1.000-1.400)')

# analyze_blog.py espera frontmatter en inglés: se le pasa una copia traducida,
# con los marcadores sustituidos por una cifra de ejemplo y el HTML final de la
# plantilla (autor y fechas que pone Post.astro).
import tempfile
fm_en = f"""---
title: "{campo('titulo')}"
description: "{campo('descripcion')}"
author: "Redacción de Artes Marciales Catalunya"
date: "{campo('fecha')}"
lastUpdated: "{campo('actualizado')}"
---
"""
cuerpo_ej = re.sub(r'\{\{[^}]+\}\}', '42', cuerpo)
intro_ej = re.sub(r'\{\{[^}]+\}\}', '42', campo('intro') or '')
faq = re.findall(r'-\s*q:\s*"?(.*?)"?\s*\n\s*a:\s*"?(.*?)"?\s*$', fm_txt, re.M)
faq_md = ('\n\n## Preguntas frecuentes\n\n' + '\n\n'.join(f'### {q}\n\n{r}' for q, r in faq)) if faq else ''
with tempfile.NamedTemporaryFile('w', suffix='.md', delete=False, encoding='utf-8') as tmp:
    tmp.write(fm_en + f"# {campo('h1')}\n\n{intro_ej}\n\n" + cuerpo_ej + faq_md)
try:
    out = subprocess.run(['python3', os.path.expanduser('~/.claude/scripts/analyze_blog.py'), tmp.name, '--format', 'json'], capture_output=True, text=True, timeout=120).stdout
    sc = json.loads(out)['score']
    n = sc['total']
    (errores if n < 60 else avisos).append(f'analyze_blog: {n}/100' + (' (mínimo 60)' if n < 60 else ''))
    for i in sc.get('issues', []):
        if i['severity'] in ('critical', 'high') and not any(k in i['issue'] for k in ('JSON-LD', 'schema', 'Open Graph', 'canonical')):
            avisos.append(f"analyze_blog [{i['severity']}] {i['issue']}")
except Exception as e:
    avisos.append(f'analyze_blog no se pudo ejecutar: {e}')
finally:
    os.unlink(tmp.name)

for a in avisos: print('aviso:', a)
for e in errores: print('ERROR:', e)
print('OK' if not errores else f'{len(errores)} error(es)')
sys.exit(1 if errores else 0)
