#!/usr/bin/env python3
"""Descarga los clubs catalanes del listado de OWKLE (WKL España) a
data/fuentes/owkle.json. Fuente aceptada por Pol el 03-10-2026 (ver
data/INSTRUCCIONES-CENTROS.md).

Del listado se sacan nombre, localidad, provincia y dirección; de la ficha
de cada club, las disciplinas ("Disciplinas que realizan"). Nunca se guardan
teléfonos ni correos, aunque la ficha los publique.

Uso: python3 scripts/descargar-owkle.py
"""
import datetime, html, json, pathlib, re, time, urllib.request

RAIZ = pathlib.Path(__file__).resolve().parent.parent
LISTADO = 'https://www.owkle.es/clubs/'
PROVINCIAS = {'Barcelona', 'Girona', 'Gerona', 'Tarragona', 'Lleida', 'Lérida'}


def get(url: str) -> str:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (directorio artesmarciales.cat)'})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode('utf-8', 'ignore')


def texto(h: str) -> list[str]:
    h = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', h, flags=re.S)
    partes = [html.unescape(p).strip() for p in re.split(r'<[^>]+>', h)]
    return [p for p in partes if p]


def main():
    bruto = get(LISTADO)
    # En cada tarjeta del listado, nombre, (localidad), provincia y dirección
    # van justo antes del enlace a la ficha del club.
    marcas = [(m.start(), m.group(1)) for m in re.finditer(r'href="(https://www\.owkle\.es/clubs/[^"#?/]+/)"', bruto)]
    clubs, vistos, desde = [], set(), 0
    for ini, url in marcas:
        t = texto(bruto[desde:ini])
        desde = ini
        if url in vistos:
            continue
        hallado = None
        for i in range(len(t) - 3):
            loc = re.fullmatch(r'\((.+)\)', t[i + 1])
            if loc and t[i + 2] in PROVINCIAS:
                hallado = {'nombre': t[i], 'localidad': loc.group(1), 'provincia': t[i + 2],
                           'direccion': t[i + 3], 'url': url}
        if hallado:
            clubs.append(hallado)
            vistos.add(url)

    for c in clubs:
        if not c['url']:
            c['disciplinas_owkle'] = []
            continue
        time.sleep(0.5)
        h = get(c['url'])
        i = h.find('Disciplinas que realizan')
        bloque = h[i:i + 20000] if i >= 0 else ''
        c['disciplinas_owkle'] = [html.unescape(x).strip() for x in
                                  re.findall(r'jet-listing-dynamic-repeater__item"><div>([^<]+)</div>', bloque)]

    salida = {'fuente': LISTADO, 'generado': datetime.date.today().isoformat(), 'clubs': clubs}
    (RAIZ / 'data/fuentes/owkle.json').write_text(json.dumps(salida, ensure_ascii=False, indent=1) + '\n')
    print(f"{len(clubs)} clubs catalanes; {sum(1 for c in clubs if c['url'])} con ficha; "
          f"{sum(1 for c in clubs if c['disciplinas_owkle'])} con disciplinas")


if __name__ == '__main__':
    main()
