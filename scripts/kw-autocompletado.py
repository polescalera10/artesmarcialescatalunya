#!/usr/bin/env python3
"""Keyword research gratuito: sugerencias de autocompletado de Google (es y ca).
Uso: python3 scripts/kw-autocompletado.py <salida.json>
Siembra con las disciplinas del directorio + temas genéricos, las combina con
modificadores de intención y con a-z, y guarda {consulta: {fuentes, idiomas}}.
Sin volúmenes: sirve para descubrir demanda y agrupar intención, no para medirla."""
import json, os, sys, time, string, urllib.parse, urllib.request

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
salida = sys.argv[1]
disc = [d['slug'].replace('-', ' ') for d in json.load(open(os.path.join(RAIZ, 'data/disciplinas.json')))]
disc = [d.replace('brasileno', 'brasileño').replace('japones', 'japonés') for d in disc]

GENERICOS = {
    'es': ['artes marciales', 'defensa personal', 'arte marcial', 'deportes de combate', 'clases de artes marciales',
           'artes marciales para niños', 'artes marciales para mujeres', 'artes marciales para adultos'],
    'ca': ['arts marcials', 'defensa personal', 'art marcial', 'esports de combat', 'classes d\'arts marcials',
           'arts marcials per a nens', 'arts marcials per a dones', 'arts marcials per a adults'],
}
MOD = {
    'es': ['para niños', 'para niñas', 'para mujeres', 'para adultos', 'para principiantes', 'cerca de mí', 'barcelona',
           'girona', 'tarragona', 'lleida', 'diferencias', 'o', 'vs', 'beneficios', 'qué es', 'cómo empezar', 'a partir de qué edad',
           'cuántos días a la semana', 'cinturones', 'peligroso', 'sirve para defensa personal', 'ropa', 'equipamiento',
           'gratis clase de prueba', 'a los 40', 'para adelgazar', 'para el estrés', 'tdah', 'timidez', 'bullying'],
    'ca': ['per a nens', 'per a nenes', 'per a dones', 'per a adults', 'per a principiants', 'a prop meu', 'barcelona',
           'girona', 'tarragona', 'lleida', 'diferències', 'o', 'què és', 'com començar', 'a partir de quina edat',
           'quants dies a la setmana', 'cinturons', 'perillós', 'a Catalunya', 'classe de prova'],
}
UA = {'User-Agent': 'Mozilla/5.0'}

def sugerir(q, hl):
    url = 'https://suggestqueries.google.com/complete/search?client=firefox&hl=%s&gl=es&q=%s' % (hl, urllib.parse.quote(q))
    for intento in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=10) as r:
                return json.loads(r.read().decode('utf-8', 'replace'))[1]
        except Exception:
            time.sleep(1.5 * (intento + 1))
    return []

res = {}
def anotar(q, semilla, hl):
    r = res.setdefault(q, {'semillas': [], 'idiomas': []})
    if semilla not in r['semillas']: r['semillas'].append(semilla)
    if hl not in r['idiomas']: r['idiomas'].append(hl)

for hl in ('es', 'ca'):
    bases = list(GENERICOS[hl]) + disc
    for base in bases:
        consultas = [base] + ['%s %s' % (base, m) for m in MOD[hl]]
        for q in consultas:
            for s in sugerir(q, hl): anotar(s, q, hl)
            time.sleep(0.15)
        # a-z solo para temas de cabeza y disciplinas principales
        if base in GENERICOS[hl] or base in disc[:14]:
            for ch in string.ascii_lowercase:
                for s in sugerir('%s %s' % (base, ch), hl): anotar(s, base + ' ' + ch, hl)
                time.sleep(0.15)
    print(hl, len(res), file=sys.stderr, flush=True)

json.dump(res, open(salida, 'w'), ensure_ascii=False, indent=0)
print('total', len(res))
