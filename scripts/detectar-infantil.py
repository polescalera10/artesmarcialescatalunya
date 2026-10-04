"""Busca en la web oficial de cada centro verificado si anuncia clases para
niños (portada + hasta 4 páginas internas con pinta de horarios/clases).

No escribe en el directorio: deja candidatos con su frase de evidencia en
data/candidatos/infantil.json para revisarlos a mano y aplicar con --aplicar.

    python3 scripts/detectar-infantil.py            # rastrea y guarda candidatos
    python3 scripts/detectar-infantil.py --aplicar  # marca infantil=true en los aprobados
"""
import concurrent.futures as cf, html, json, re, sys, urllib.parse, urllib.request
from importar_comun import DATA, cargar_directorio, guardar

SALIDA = DATA / 'candidatos' / 'infantil.json'
UA = {'User-Agent': 'Mozilla/5.0 (compatible; ArtesMarcialesCatBot/1.0; +https://artesmarciales.cat)'}
INTERNAS = re.compile(r'infant|nens|ninos|niños|kids|nanos|petits|peques|junior|horari|horario|classes|clases|activitat|actividad|extraescolar|grups|grupos|tarif|precio|preus', re.I)
# Frases que anuncian clases para niños; las genéricas ("infantil" suelto) piden contexto de clase o edad.
FUERTE = re.compile(
    r"(classes?|clases?|grups?|grupos?|cursos?|horaris?|horarios?|seccio|sección|escola|escuela|karate|judo|taekwondo|kick ?boxing|boxe?[oa]|jiu|bjj|mma|muay|aikido|kung|lucha|lluita|arts? marcials|artes marciales)\s+(per a |para |de )?(infantils?|infantiles|nens|niños|niñas|nenes|kids|peques|petits)"
    r"|(infantils?|infantiles|kids|nens i nenes|niños y niñas)\s+(de|des de|a partir de|desde)?\s*\d{1,2}\s*(a|-|i)\s*\d{1,2}\s*(anys|años)"
    r"|a partir de\s+\d{1}\s*(anys|años)|des de(ls)?\s+\d{1}\s*anys|desde (los )?\d{1}\s*años"
    r"|(pre)?benjam[ií]n?s?|alev[ií]n(es|s)?|extraescolar(s|es)?|kids\s+(class|program|bjj|mma|boxing|muay)", re.I)


def get(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=12) as r:
        if 'html' not in (r.headers.get('Content-Type') or ''):
            return ''
        return r.read(600_000).decode(r.headers.get_content_charset() or 'utf-8', 'ignore')


def texto(h):
    h = re.sub(r'(?is)<(script|style|noscript)[^>]*>.*?</\1>', ' ', h)
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', h)))


def rastrear(c):
    base = c['web']
    try:
        h = get(base)
    except Exception as e:
        return c['slug'], None, f'error: {type(e).__name__}'
    host = urllib.parse.urlparse(base).netloc
    enlaces = []
    for href, txt in re.findall(r'(?is)<a[^>]+href=["\']([^"\'#]+)["\'][^>]*>(.*?)</a>', h):
        u = urllib.parse.urljoin(base, href)
        if urllib.parse.urlparse(u).netloc == host and (INTERNAS.search(href) or INTERNAS.search(texto(txt))) and u not in enlaces:
            enlaces.append(u)
    paginas = [(base, h)]
    for u in enlaces[:4]:
        try:
            paginas.append((u, get(u)))
        except Exception:
            pass
    for u, ph in paginas:
        t = texto(ph)
        m = FUERTE.search(t)
        if m:
            return c['slug'], u, t[max(0, m.start() - 90): m.end() + 90].strip()
    return c['slug'], None, ''


def main():
    archivos, existentes = cargar_directorio()
    if '--aplicar' in sys.argv:
        cand = json.load(open(SALIDA))
        ok = {x['slug'] for x in cand if x.get('aprobado')}
        n = 0
        for _, c in existentes:
            if c['slug'] in ok and not c.get('infantil'):
                # Mantener el orden de claves de la norma: infantil tras disciplinas/otras.
                items = list(c.items()); c.clear()
                for k, v in items:
                    c[k] = v
                    if k == ('otras' if 'otras' in dict(items) else 'disciplinas'):
                        c['infantil'] = True
                n += 1
        guardar(archivos)
        print(f'{n} centros marcados con clases para niños')
        return
    pend = [c for _, c in existentes if c['fuenteTipo'] != 'registro-oficial' and c.get('web') and not c.get('infantil')
            and not re.search(r'facebook|instagram|tiktok|youtube', c['web'])]
    with cf.ThreadPoolExecutor(16) as ex:
        res = list(ex.map(rastrear, pend))
    cand = [{'slug': s, 'pagina': u, 'evidencia': e, 'aprobado': None} for s, u, e in res if u]
    SALIDA.write_text(json.dumps(cand, ensure_ascii=False, indent=1) + '\n')
    errores = sum(1 for _, _, e in res if e.startswith('error'))
    print(f'{len(pend)} webs, {len(cand)} candidatos, {errores} sin respuesta → {SALIDA.relative_to(DATA.parent)}')


if __name__ == '__main__':
    main()
