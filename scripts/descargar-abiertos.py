#!/usr/bin/env python3
"""Descarga de bases abiertas de lugares los centros de artes marciales de
Cataluña que todavía podrían faltar en el directorio. Sirve solo para
DESCUBRIR candidatos: ninguna de estas bases es fuente válida para publicar
datos de un centro (ver data/INSTRUCCIONES-CENTROS.md).

Fuentes:
- Overture Maps, tema places (licencia CDLA Permissive 2.0, atribución a
  Overture Maps Foundation). Se lee por DuckDB filtrando por caja de Cataluña y
  categorías marciales. Hace falta `pip install duckdb`.
- OpenStreetMap vía Overpass (ODbL, atribución © OpenStreetMap contributors).

No se guardan teléfonos ni correos aunque la fuente los traiga.
Resultado: data/fuentes/abiertos.json. Idempotente.

Uso: python3 scripts/descargar-abiertos.py [--overture 2026-09-23.1]
"""
import argparse, datetime, json, pathlib, time, urllib.parse, urllib.request

RAIZ = pathlib.Path(__file__).resolve().parent.parent
SALIDA = RAIZ / 'data/fuentes/abiertos.json'
# Caja de Cataluña con margen; el filtro fino por municipio se hace al cruzar.
BBOX = dict(xmin=0.15, xmax=3.35, ymin=40.5, ymax=42.9)
CATEGORIAS = ('martial|boxing|judo|karate|taekwondo|jiu|kickbox|muay|wrestling|self_defense|dojo|aikido|kung|'
              'tai_chi|capoeira|krav|fight')


def overture(release):
    import duckdb
    con = duckdb.connect()
    con.execute("INSTALL httpfs; LOAD httpfs; SET s3_region='us-west-2';")
    base = f's3://overturemaps-us-west-2/release/{release}/theme=places/type=place/*'
    filas = con.execute(f"""
        SELECT id, names.primary, taxonomy.primary, addresses[1].freeform, addresses[1].locality, addresses[1].postcode,
               websites[1], socials, bbox.xmin, bbox.ymin, confidence, operating_status
        FROM read_parquet('{base}', hive_partitioning=1)
        WHERE bbox.xmin BETWEEN {BBOX['xmin']} AND {BBOX['xmax']} AND bbox.ymin BETWEEN {BBOX['ymin']} AND {BBOX['ymax']}
          AND regexp_matches(lower(coalesce(taxonomy.primary,'')||','||coalesce(array_to_string(taxonomy.hierarchy,','),'')
              ||','||coalesce(array_to_string(taxonomy.alternates,','),'')||','||coalesce(basic_category,'')), '{CATEGORIAS}')
    """).fetchall()
    return [dict(fuente='overture', id=f[0], nombre=f[1], categoria=f[2], direccion=f[3], localidad=f[4], cp=f[5],
                 web=f[6], redes=f[7] or [], lon=f[8], lat=f[9], confianza=f[10], estado=f[11]) for f in filas]


OVERPASS = '''[out:json][timeout:180];
area["ISO3166-2"="ES-CT"]->.cat;
(
 nwr["sport"~"karate|judo|taekwondo|boxing|kickboxing|martial_arts|aikido|kung_fu|brazilian_jiu_jitsu|jiu_jitsu|ju_jitsu|muay_thai|wrestling|krav_maga|self_defence|self_defense|capoeira|taichi|tai_chi|mma|hapkido|kendo|wushu|sambo|grappling"](area.cat);
 nwr["amenity"="dojo"](area.cat);
 nwr["leisure"="sports_centre"]["name"~"[Kk]arate|[Jj]udo|[Tt]aekwondo|[Bb]ox|[Kk]ick|[Mm]uay|[Dd]ojo|[Aa]rts? [Mm]arcial|[Aa]ikido|[Jj]iu|[Gg]rappling|MMA|[Ff]ight"](area.cat);
);
out center tags;'''


SERVIDORES = ('https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter')


def osm():
    d, error = None, None
    for intento in range(6):
        url = SERVIDORES[intento % len(SERVIDORES)]
        req = urllib.request.Request(url, data=urllib.parse.urlencode({'data': OVERPASS}).encode(),
                                     headers={'User-Agent': 'artesmarciales.cat-research/1.0 (contacto@artesmarciales.cat)'})
        try:
            d = json.load(urllib.request.urlopen(req, timeout=240))
            break
        except Exception as e:  # 502/504 de Overpass son habituales y pasajeros
            error = e
            time.sleep(10 * (intento + 1))
    if d is None:
        raise SystemExit(f'Overpass no responde: {error}')
    out = []
    for e in d['elements']:
        t = e['tags']
        c = e.get('center') or e
        if 'lat' not in c or not t.get('name'):
            continue
        calle = ' '.join(x for x in (t.get('addr:street'), t.get('addr:housenumber')) if x)
        out.append(dict(fuente='osm', id=f"{e['type']}/{e['id']}", nombre=t['name'], categoria=t.get('sport') or t.get('amenity') or t.get('leisure'),
                        direccion=calle or None, localidad=t.get('addr:city'), cp=t.get('addr:postcode'),
                        web=t.get('website') or t.get('contact:website'), redes=[], lon=c['lon'], lat=c['lat'], confianza=None, estado=None))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--overture', default='2026-09-23.1')
    a = ap.parse_args()
    ov, om = overture(a.overture), osm()
    SALIDA.write_text(json.dumps({'generado': datetime.date.today().isoformat(), 'overture_release': a.overture,
                                  'atribucion': 'Overture Maps Foundation (CDLA Permissive 2.0); © OpenStreetMap contributors (ODbL)',
                                  'lugares': ov + om}, ensure_ascii=False, indent=1) + '\n')
    print(f'Overture {len(ov)}, OSM {len(om)} -> {SALIDA.relative_to(RAIZ)}')


if __name__ == '__main__':
    main()
