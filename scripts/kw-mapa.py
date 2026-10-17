#!/usr/bin/env python3
"""Mapa de URLs nuevas del blog a partir de keywords-agrupadas.csv.
Uso: python3 scripts/kw-mapa.py <keywords-agrupadas.csv> <salida.csv>
Una fila = una URL (castellano; el catalán se traduce después). El «apoyo» es la suma de apoyo de los
clústeres que resuelve (señal de demanda en el autocompletado, no volumen). Las oleadas se reparten por
apoyo y por tipo de plantilla para poder medir qué tipo de página se indexa y recibe impresiones."""
import csv, glob, os, sys

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
cl = list(csv.DictReader(open(sys.argv[1], encoding='utf-8')))
existentes = {os.path.basename(p)[:-3] for p in glob.glob(os.path.join(RAIZ, 'src/content/blog/*.md'))}

def apoyo(discs, intent, aud=None):
    s = 0
    for c in cl:
        d = set(c['disciplinas'].split('+'))
        if aud is None and c['intencion'] != intent: continue
        if aud is not None and aud not in c['publico']: continue
        if aud is None and c['publico'] != '-' and intent != 'comparar': pass
        if set(discs) <= d and (len(discs) > 1 or len(d) == 1): s += int(c['apoyo'])
    return s

NOMBRE = {'jiu-jitsu brasileno': 'jiu-jitsu brasileño', 'mma': 'MMA'}
def n(d): return NOMBRE.get(d, d)
def sl(d): return d.replace(' ', '-').replace('jiu-jitsu-brasileno', 'jiu-jitsu-brasileno')

filas = []
def add(tipo, slug, consulta, discs, intent, aud=None, nota=''):
    filas.append({'tipo': tipo, 'slug': slug, 'consulta_principal': consulta, 'disciplinas': '+'.join(discs),
                  'intencion': intent, 'apoyo': apoyo(discs, intent, aud), 'existe': 'SI' if slug in existentes else '', 'nota': nota})

# 1. Comparativas que aún no existen como artículo
for a, b in [('muay thai', 'mma'), ('boxeo', 'mma'), ('kickboxing', 'mma'), ('boxeo', 'muay thai'), ('karate', 'kung fu'),
             ('judo', 'taekwondo'), ('aikido', 'judo'), ('aikido', 'hapkido'), ('hapkido', 'taekwondo'), ('jiu-jitsu brasileno', 'muay thai'),
             ('grappling', 'jiu-jitsu brasileno'), ('boxeo', 'karate'), ('kung fu', 'wing chun'), ('hapkido', 'jiu-jitsu brasileno'),
             ('judo', 'aikido')][:14]:
    add('comparativa', f'{sl(a)}-o-{sl(b)}', f'{n(a)} o {n(b)}', [a, b], 'comparar')
add('comparativa', 'jiu-jitsu-japones-o-brasileno', 'jiu jitsu japonés vs brasileño', ['jiu-jitsu brasileno'], 'comparar', nota='par japonés/brasileño; 24 de apoyo en el clúster general de jiu-jitsu')
add('comparativa', 'tai-chi-o-yoga', 'tai chi vs yoga y qigong', ['tai chi'], 'comparar')
add('comparativa', 'artes-marciales-o-deportes-de-combate', 'artes marciales vs deporte de combate', ['artes marciales'], 'comparar')
add('comparativa', 'que-arte-marcial-es-mejor', 'qué arte marcial es mejor', ['artes marciales'], 'comparar', nota='pilar; enlaza a todas las comparativas')

# 2. Por disciplina para niños (edad y cómo elegir)
for d in ['judo', 'taekwondo', 'boxeo', 'muay thai', 'kickboxing', 'mma', 'aikido', 'kung fu', 'capoeira', 'hapkido', 'defensa personal']:
    add('ninos', f'{sl(d)}-para-ninos', f'{n(d)} para niños', [d], 'general', 'ninos', 'edad mínima habitual, qué cambia por edades, cómo es la clase; sin promesas')

# 3. Cinturones
for d in ['judo', 'karate', 'taekwondo', 'jiu-jitsu brasileno', 'aikido', 'kung fu', 'hapkido']:
    add('cinturones', f'cinturones-de-{sl(d)}', f'cinturones de {n(d)}', [d], 'grados', None, 'verificar con la federación; los colores varían por escuela y federación')
add('cinturones', 'artes-marciales-con-y-sin-cinturones', 'qué artes marciales tienen cinturones', ['artes marciales'], 'grados', nota='pilar; boxeo, muay thai y kickboxing no usan cinturones (verificar)')

# 4. Qué es (solo donde la ficha de disciplina no lo resuelve)
for d in ['aikido', 'kung fu', 'wing chun', 'hapkido', 'kendo', 'capoeira', 'tai chi', 'ninjutsu', 'mma', 'artes marciales']:
    add('que-es', f'que-es-{sl(d)}', f'{n(d)} qué es', [d], 'definir', None, 'qué es, origen breve (fuente), cómo se entrena, para quién, dónde practicarlo en Cataluña con marcadores')

# 5. Ropa y material
for d in ['karate', 'judo', 'taekwondo', 'jiu-jitsu brasileno', 'grappling', 'mma', 'muay thai', 'kickboxing', 'aikido', 'kung fu']:
    add('equipo', f'ropa-y-material-{sl(d)}', f'{n(d)} ropa y material', [d], 'equipo', None, 'qué hace falta el primer día y qué después; sin marcas ni precios')
add('equipo', 'gi-o-no-gi', 'gi o no gi', ['grappling'], 'equipo', nota='diferencia entre modalidades con y sin kimono')

# 6. Públicos
add('publico', 'boxeo-para-mujeres', 'boxeo para mujeres', ['boxeo'], 'general', 'mujeres')
add('publico', 'mma-para-mujeres', 'MMA para mujeres', ['mma'], 'general', 'mujeres')
add('publico', 'artes-marciales-para-mayores', 'artes marciales para mayores de 50 y 60', ['artes marciales'], 'edad', 'adultos', 'remitir al médico; formato de la práctica')
add('publico', 'judo-para-adultos', 'judo para adultos', ['judo'], 'general', 'adultos')
add('publico', 'karate-para-adultos', 'karate para adultos', ['karate'], 'general', 'adultos')
add('publico', 'defensa-personal-para-adultos', 'defensa personal adultos', ['defensa personal'], 'general', 'adultos')
add('publico', 'defensa-personal-para-adolescentes', 'defensa personal adolescentes', ['defensa personal'], 'general', 'adolescentes')

# 7. Empezar
for d in ['mma', 'karate', 'taekwondo', 'tai chi', 'defensa personal', 'muay thai', 'judo', 'jiu-jitsu brasileno']:
    add('empezar', f'como-empezar-{sl(d)}', f'{n(d)} cómo empezar', [d], 'empezar', None, 'primera clase, qué esperar, errores de principiante; sin promesas')

# 8. Dudas y miedos (sin consejo médico)
add('dudas', 'son-peligrosas-las-artes-marciales', '¿son peligrosas las artes marciales?', ['artes marciales'], 'salud', nota='formato de la práctica por disciplina; lesiones habituales sin cifras; remitir al profesional')
add('dudas', 'artes-marciales-y-bullying', 'artes marciales y bullying', ['artes marciales'], 'salud', nota='qué pueden y qué no aportar; recursos oficiales verificados')

# 9. Competir (reglamento, campeonatos, licencia): solo con fuente federativa verificable
for d in ['boxeo', 'kickboxing', 'muay thai', 'judo', 'karate', 'taekwondo', 'jiu-jitsu brasileno', 'mma', 'grappling', 'lucha']:
    add('competir', f'competir-en-{sl(d)}', f'{n(d)} competición', [d], 'competir', None, 'cómo se compite, categorías y licencia según la federación; sin promesas ni resultados')

# deduplicar por slug y repartir en oleadas
vistos, util = set(), []
for f in filas:
    if f['slug'] in vistos or f['existe']: continue
    vistos.add(f['slug']); util.append(f)
tipos = {}
for f in sorted(util, key=lambda f: -f['apoyo']): tipos.setdefault(f['tipo'], []).append(f)
# Las olas ya publicadas se excluyen (existe=SI). La primera ola nueva (2) se reparte con cupo por tipo, para medir
# qué plantilla se indexa; el resto por apoyo: ola 3 (28 URLs) y ola 4 (lo demás).
CUPO = {'comparativa': 7, 'que-es': 5, 'ninos': 4, 'cinturones': 3, 'equipo': 4, 'empezar': 3, 'publico': 2, 'competir': 3}
orden = []
for t_, c in CUPO.items():
    for _ in range(c):
        if tipos.get(t_): orden.append(tipos[t_].pop(0))
n1 = len(orden)
resto = sorted([f for lista in tipos.values() for f in lista], key=lambda f: -f['apoyo'])
orden += resto
for i, f in enumerate(orden): f['ola'] = 2 if i < n1 else 3 if i < n1 + 28 else 4
cols = ['ola', 'tipo', 'slug', 'consulta_principal', 'disciplinas', 'intencion', 'apoyo', 'nota']
with open(sys.argv[2], 'w', newline='', encoding='utf-8') as fh:
    w = csv.DictWriter(fh, fieldnames=cols, extrasaction='ignore'); w.writeheader()
    for f in sorted(orden, key=lambda f: (f['ola'], -f['apoyo'])): w.writerow(f)
print(len(orden), 'URLs;', {o: sum(1 for f in orden if f['ola'] == o) for o in (2, 3, 4)})
