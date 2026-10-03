#!/usr/bin/env python3
"""Importa del Registre d'Entitats Esportives de la Generalitat (datos
abiertos, dataset qrgc-u7pk) los clubs con modalidades de artes marciales.
Fuente aceptada por Pol el 03-10-2026 (fuenteTipo "registro-oficial").

Reglas:
- Solo "Clubs i Associacions Esportives" con alguna modalidad marcial.
- Nunca se guardan teléfonos ni correos (el registro los publica).
- La dirección registrada de una asociación suele ser un domicilio
  particular: solo se guarda si es claramente una instalación deportiva.
  Sin dirección ni web, la ficha queda en noindex (src/lib/rutas.ts).
- Los clubs que ya están en el directorio no se tocan.
- `fuente` es la URL de la API que devuelve exactamente ese registro.

Idempotente. Uso: python3 scripts/importar-registro.py
"""
import datetime, json, re, sys, urllib.parse, urllib.request
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent))
from importar_comun import DATA, acentuar, bonito, cargar_directorio, duplicado, guardar, insertar, municipio, slugify

API = 'https://analisi.transparenciacatalunya.cat/resource/qrgc-u7pk.json'
HOY = datetime.date.today().isoformat()
# Municipios renombrados o fusionados respecto al nombre del registro
ALIAS = {'palamos': 'Palamós i Sant Joan', 'castell platja d aro': "Platja d'Aro i s'Agaró Castell d'Aro",
         'bigues i riells': 'Bigues i Riells del Fai', 'sant carles de la rapita': 'La Ràpita', 'roda de bara': 'Roda de Berà'}
# El registro escribe sin apóstrofo: "CLUB DARTS MARCIALS", "LESPORTIU"
APOSTROFO = [(re.compile(r"\bD(ARTS|AIKIDO|ESPORTS?|ATLETISME|ESGRIMA|ESCOLA|OLOT|IGUALADA|ALELLA|ARENYS|AMPOSTA|ANGLES|ARBUCIES|ESPLUGUES|EMPORDA|OSONA|URGELL|ANOIA|ESPARREGUERA|ARGENTONA)\b"), r"D'\1"),
             (re.compile(r"\bL(ESPORTIU|ESPORT|ESCOLA|HOSPITALET|AMETLLA|ARBOC|ESTARTIT|ESCALA|EMPORDA|URGELL|ANOIA|ALZINAR)\b"), r"L'\1")]

MAPA = {
    'judo': ['judo'], 'judo cecs': ['judo'], 'judo (sords)': ['judo'],
    'taekwon-do': ['taekwondo'], 'karate': ['karate'], 'karate (sords)': ['karate'], 'nanbudo (karate)': ['karate'],
    'kempo karate': ['karate'], 'boxa': ['boxeo'], 'kick boxing': ['kickboxing'], 'full contact': ['kickboxing'],
    'kick-boxing autoprotecció': ['kickboxing'], 'defensa personal': ['defensa-personal'], 'muay-thaï': ['muay-thai'],
    'jiu-jitsu': ['jiu-jitsu-japones'], 'jiujitsu brasiler': ['jiu-jitsu-brasileno'], 'aikido': ['aikido'],
    'hapkido': ['hapkido'], 'tai txi': ['tai-chi'], 'txikung (qigong)': ['tai-chi'], 'kung-fu': ['kung-fu'],
    'boxa xinesa': ['kung-fu'], 'lluita': ['lucha'], 'lluita lliure olímpica': ['lucha'], 'lluita greco-romana': ['lucha'],
    'lluita lliure americana': ['lucha'], 'sambo': ['lucha'], 'lluita grappling': ['grappling'], 'kendo': ['kendo'],
    'kobudo': ['kobudo'], 'mma (mixed martial arts)': ['mma'], 'capoeira': ['capoeira'],
}
OTRAS = {'boxkarate': 'Boxkarate', 'savate o boxa francesa': 'Savate', 'kempo (judo)': 'Kempo'}
INSTALACION = re.compile(r"(?i)pavell|poliesportiu|polideportiu|complex esportiu|zona esportiva|camp (municipal|d'esports)|"
                         r"piscina|gimn[aà]s|centre esportiu|centre cívic|instal·lacions|ciutat esportiva|dojo|nau ")
DOMICILIO = re.compile(r"(?i)\b(pis|porta|esc\.|escala|[0-9]+\s*[ºª]|1r|2n|3r|4t|5è|àtic|entresol)\b")


def descargar():
    marcas = ' OR '.join(f"upper(modalitats) like '%{k.upper()}%'" for k in
                         ['JUDO', 'TAEKWON', 'KARATE', 'BOXA', 'KICK', 'DEFENSA PERSONAL', 'MUAY', 'JIU', 'AIKIDO', 'HAPKIDO',
                          'TAI TXI', 'TXIKUNG', 'KUNG', 'LLUITA', 'SAMBO', 'KENDO', 'KOBUDO', 'MMA', 'CAPOEIRA', 'KEMPO',
                          'FULL CONTACT', 'NANBUDO', 'SAVATE'])
    q = urllib.parse.urlencode({'$where': f"tipus_entitat='Clubs i Associacions Esportives' AND ({marcas})",
                                '$select': 'n_m_registre,nom_entitat,adre_a,municipi,modalitats', '$limit': 5000})
    with urllib.request.urlopen(f'{API}?{q}', timeout=120) as r:
        return json.load(r)


def main():
    filas = descargar()
    (DATA / 'fuentes').mkdir(exist_ok=True)
    (DATA / 'fuentes/registro-entitats.json').write_text(json.dumps(
        {'fuente': API, 'generado': HOY, 'entidades': filas}, ensure_ascii=False, indent=1) + '\n')

    archivos, existentes = cargar_directorio()
    slugs = {c['slug'] for _, c in existentes}
    nuevos, ya, sin_muni, sin_disc = [], [], [], 0
    for f in filas:
        url = f"{API}?n_m_registre={f['n_m_registre']}"
        if any(c.get('fuente') == url for _, c in existentes):
            continue
        mods = [m.strip().lower() for m in (f.get('modalitats') or '').split(',') if m.strip()]
        disc = sorted({d for m in mods for d in MAPA.get(m, [])})
        if not disc:
            sin_disc += 1
            continue
        mun = municipio(f.get('municipi', ''), ALIAS)
        if not mun:
            sin_muni.append(f); continue
        bruto = f['nom_entitat']
        for rx, sub in APOSTROFO:
            bruto = rx.sub(sub, bruto)
        nombre = acentuar(bonito(bruto))
        direccion = (f.get('adre_a') or '').strip()
        if not (INSTALACION.search(direccion) and not DOMICILIO.search(direccion)):
            direccion = ''
        dup = duplicado(nombre, mun, disc, direccion, existentes)
        if dup:
            ya.append((nombre, dup['slug'])); continue
        slug = slugify(nombre)
        if slug in slugs:
            slug = f"{slug}-{mun['slug']}"
        if slug in slugs:
            slug = f"{slug}-{f['n_m_registre']}"
        slugs.add(slug)
        ficha = {'slug': slug, 'nombre': nombre,
                 'tipo': 'asociacion' if re.search(r'(?i)^(associaci|asociaci|agrupaci)', nombre) else 'club',
                 'municipio': mun['slug'], 'disciplinas': disc}
        otras = [OTRAS[m] for m in mods if m in OTRAS]
        if otras:
            ficha['otras'] = otras
        if direccion:
            ficha['direccion'] = f"{direccion}, {mun['nombre']}"
        ficha.update({'fuente': url, 'fuenteTipo': 'registro-oficial', 'verificado': HOY})
        insertar(archivos, mun['comarca'], ficha)
        existentes.append((mun['comarca'], ficha))
        nuevos.append(ficha)

    guardar(archivos)
    con_dir = sum(1 for n in nuevos if 'direccion' in n)
    print(f'registro: {len(filas)} | nuevos: {len(nuevos)} ({con_dir} con dirección de instalación) | '
          f'ya en el directorio: {len(ya)} | sin disciplina mapeable: {sin_disc} | sin municipio: {len(sin_muni)}')
    for f in sin_muni[:20]:
        print(f"  sin municipio: {f['nom_entitat']} ({f.get('municipi')})")


if __name__ == '__main__':
    main()
