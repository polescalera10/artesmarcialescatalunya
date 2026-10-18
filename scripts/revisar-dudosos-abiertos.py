#!/usr/bin/env python3
"""Segunda lectura, sin agentes, de los candidatos de data/candidatos/abiertos.json que la
primera pasada (verificar-webs-abiertos.py) dejó en «R revisar» o «web con error».

Para cada uno:
 - reintenta la web con otras cabeceras (Chrome), con y sin www, https/http y un
   contexto TLS que acepta certificados caducados (solo para LEER una página pública);
 - si carga pero no cita disciplina, abre hasta 4 enlaces internos (clases,
   disciplinas, actividades, sobre nosotros…) y suma su texto, porque muchas webs
   cuentan lo que enseñan en otra página;
 - comprueba que la web es del centro (alguna palabra distintiva de su nombre aparece
   en la página o en el dominio).
Resultado: data/candidatos/abiertos-revision.json. importar-abiertos.py lo usa en lugar
de volver a leer la web de estos candidatos.

Uso: python3 scripts/revisar-dudosos-abiertos.py
"""
import concurrent.futures as cf, datetime, json, re, ssl, sys
from urllib.parse import urljoin, urlparse
import urllib.request
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent))
from importar_comun import DATA, MUNICIPIOS, norm, tokens

MUN = {m['slug']: m for m in MUNICIPIOS}
UA_CHROME = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) '
             'Chrome/124.0 Safari/537.36')
CTX = ssl.create_default_context()
CTX_LAXO = ssl.create_default_context(); CTX_LAXO.check_hostname = False; CTX_LAXO.verify_mode = ssl.CERT_NONE
DISC = json.load(open(DATA / 'disciplinas.json'))
PATRONES = {d['slug']: re.compile(r'\b(' + '|'.join(re.escape(norm(n)) for n in {d['es'], d['ca'], *d.get('sinonimos', [])} if len(norm(n)) >= 4) + r')\b')
            for d in DISC}
PAT_NOMBRE = {d['slug']: re.compile(r'(?:^| )(' + '|'.join(re.escape(norm(n)) for n in {d['es'], d['ca'], *d.get('sinonimos', [])} if len(norm(n)) >= 3) + r')(?: |$)')
              for d in DISC}
DEBILES = {'defensa-personal', 'tai-chi'}
FITNESS = re.compile(r'(?i)fit ?box|power[_ ]?fit|brooklyn|kickfit|crossbox|crossfit|training|fitclub|fitco|9round|body ?combat')
RED = re.compile(r'facebook|instagram|google|goo\.gl|linktr|wa\.me|business\.site|tiktok|youtube')
ENLACES = re.compile(r'(?i)disciplin|classe|clase|activitat|actividad|curs|horari|horario|sobre|qui-?som|nosotros|dojo|escola|escuela|arts?-?marcial|karate|judo|taekwondo|aikido|boxe|box|jiu|kick|muay|defensa')


def pedir(url, ua, ctx):
    r = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': ua, 'Accept-Language': 'es-ES,es;q=0.9,ca;q=0.8',
                                                                    'Accept': 'text/html,application/xhtml+xml'}), timeout=25, context=ctx)
    return r.geturl(), r.read(500_000).decode(r.headers.get_content_charset() or 'utf-8', 'ignore')


def variantes(url):
    u = url if url.startswith('http') else 'https://' + url
    p = urlparse(u)
    host = p.netloc.removeprefix('www.')
    vistos, out = set(), []
    for esquema in ('https', 'http'):
        for h in (p.netloc, host, 'www.' + host):
            v = f'{esquema}://{h}{p.path or "/"}'
            if v not in vistos:
                vistos.add(v); out.append(v)
    return out


def leer(url):
    ultimo = 'sin respuesta'
    for v in variantes(url):
        for ua in (UA_CHROME,):
            for ctx in (CTX, CTX_LAXO):
                try:
                    return pedir(v, ua, ctx), None
                except urllib.error.HTTPError as e:
                    ultimo = f'HTTP {e.code}'
                    break
                except Exception as e:
                    ultimo = type(e).__name__ + (f': {e.reason}' if getattr(e, 'reason', None) else '')
    return None, ultimo


def texto(html):
    return norm(re.sub(r'<(script|style).*?</\1>|<[^>]+>', ' ', html, flags=re.S))


def contar(t, nombre):
    n = norm(nombre)
    found = {s for s, p in PATRONES.items() if len(p.findall(t)) >= (3 if s in DEBILES else 2)}
    found |= {s for s, p in PAT_NOMBRE.items() if p.search(n)}
    return found


def revisar(c):
    (res, error) = leer(c['web'])
    if not res:
        return dict(estado='caida', error=error)
    url, html = res
    host = urlparse(url).netloc.removeprefix('www.')
    if RED.search(host):
        return dict(estado='red-social', url=url)
    t = texto(html)
    paginas = 1
    if len(contar(t, c['nombre']) - DEBILES) == 0:
        enlaces = []
        for h in re.findall(r'href=["\']([^"\'#]+)', html):
            absu = urljoin(url, h)
            pu = urlparse(absu)
            if pu.netloc.removeprefix('www.') == host and ENLACES.search(pu.path) and absu not in enlaces and not re.search(r'\.(jpg|png|pdf|css|js)$', pu.path):
                enlaces.append(absu)
        for e in enlaces[:4]:
            try:
                _, h2 = pedir(e, UA_CHROME, CTX_LAXO)
                t += ' ' + texto(h2); paginas += 1
            except Exception:
                pass
    mun = MUN[c['municipio']]['nombre']
    palabras = set(t.split()) | set(re.split(r'[^a-z0-9]+', host))
    nombre_ok = bool(tokens(c['nombre'], mun) & palabras) or bool(re.search(r'[a-z]{5,}', ''.join(sorted(tokens(c['nombre'], mun)))) and any(tk in host for tk in tokens(c['nombre'], mun)))
    disc = sorted(contar(t, c['nombre']))
    return dict(estado='ok', url=url.split('#')[0].split('?')[0], paginas=paginas, chars=len(t), disciplinas=disc if len(disc) <= 5 else [],
                muchas=len(disc) > 5, nombre_ok=nombre_ok, municipio_en_web=norm(mun) in t)


def main():
    nuevos = json.load(open(DATA / 'candidatos/abiertos.json'))
    objetivo = [c for c in nuevos if c.get('tier') in ('R revisar', 'web con error') and c.get('web')]
    print(f'{len(objetivo)} candidatos a revisar')
    with cf.ThreadPoolExecutor(8) as ex:
        res = list(ex.map(revisar, objetivo))
    out = {c['nombre']: dict(tier_antes=c['tier'], municipio=c['municipio'], web_original=c['web'], **r) for c, r in zip(objetivo, res)}
    for nom, r in out.items():
        fuertes = [d for d in r.get('disciplinas', []) if d not in DEBILES]
        fit = bool(FITNESS.search(nom))
        r['tier'] = ('V verificable' if r['estado'] == 'ok' and fuertes and r['nombre_ok'] and not fit else
                     'caida' if r['estado'] == 'caida' else 'R revisar')
    (DATA / 'candidatos/abiertos-revision.json').write_text(json.dumps(
        dict(generado=datetime.date.today().isoformat(), candidatos=out), ensure_ascii=False, indent=1) + '\n')
    import collections
    print(collections.Counter((r['tier_antes'], r['tier']) for r in out.values()))
    print(collections.Counter(r.get('error', '').split(':')[0] for r in out.values() if r['estado'] == 'caida'))


if __name__ == '__main__':
    main()
