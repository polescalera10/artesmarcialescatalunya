#!/usr/bin/env python3
"""Primera oleada de verificación, sin agentes: abre la web de cada candidato de
data/candidatos/abiertos.json (nuevos) y de abiertos-enriquecer.json (fichas que
ya tenemos) y comprueba que carga y que cita alguna disciplina del catálogo.

Una web que carga y cita una disciplina cumple la regla de `web-oficial`
(INSTRUCCIONES-CENTROS.md): fuente pública del propio centro que dice qué enseña.
Una sola petición GET por web, con User-Agent identificable. No guarda texto de
las páginas, solo qué disciplinas cita. Resultado: data/candidatos/abiertos-webs.json

Uso: python3 scripts/verificar-webs-abiertos.py
"""
import concurrent.futures as cf, datetime, json, pathlib, re, ssl, sys, urllib.request
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from importar_comun import DATA, norm

UA = 'Mozilla/5.0 (compatible; artesmarciales.cat-verificacion/1.0; +https://artesmarciales.cat/sobre-nosotros/)'
CTX = ssl.create_default_context()
DISC = json.load(open(DATA / 'disciplinas.json'))
PATRONES = {}
for d in DISC:
    nombres = {d['es'], d['ca'], *d.get('sinonimos', [])}
    PATRONES[d['slug']] = re.compile(r'\b(' + '|'.join(re.escape(norm(n)) for n in nombres if len(norm(n)) >= 4) + r')\b')


def comprobar(url):
    if not url.startswith('http'):
        url = 'https://' + url
    for u in (url, url.replace('https://', 'http://')):
        try:
            r = urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': UA}), timeout=15, context=CTX)
            html = r.read(400_000).decode(r.headers.get_content_charset() or 'utf-8', 'ignore')
            texto = norm(re.sub(r'<(script|style).*?</\1>|<[^>]+>', ' ', html, flags=re.S))
            citadas = sorted(s for s, p in PATRONES.items() if p.search(texto))
            return dict(estado='ok', url_final=r.geturl(), disciplinas_citadas=citadas, chars=len(texto))
        except Exception as e:
            err = type(e).__name__ + (f' {e.code}' if hasattr(e, 'code') else '')
    return dict(estado='error', error=err)


def main():
    nuevos = json.load(open(DATA / 'candidatos/abiertos.json'))
    enr = json.load(open(DATA / 'candidatos/abiertos-enriquecer.json'))
    tareas = [('nuevo', c['nombre'], c['municipio'], c['web']) for c in nuevos if c.get('web')] + \
             [('ficha', e['slug'], e['municipio'], e['web']) for e in enr if e.get('web')]
    print(f'{len(tareas)} webs a comprobar')
    with cf.ThreadPoolExecutor(12) as ex:
        res = list(ex.map(lambda t: comprobar(t[3]), tareas))
    out = [dict(tipo=t[0], id=t[1], municipio=t[2], web=t[3], **r) for t, r in zip(tareas, res)]
    (DATA / 'candidatos/abiertos-webs.json').write_text(json.dumps(
        dict(generado=datetime.date.today().isoformat(), resultados=out), ensure_ascii=False, indent=1) + '\n')
    for tipo in ('nuevo', 'ficha'):
        sel = [o for o in out if o['tipo'] == tipo]
        ok = [o for o in sel if o['estado'] == 'ok']
        print(f'{tipo}: {len(sel)} webs; cargan {len(ok)}; citan alguna disciplina {sum(1 for o in ok if o["disciplinas_citadas"])}; error {len(sel) - len(ok)}')


if __name__ == '__main__':
    main()
