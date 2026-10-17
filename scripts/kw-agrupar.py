#!/usr/bin/env python3
"""Agrupa las sugerencias de scripts/kw-autocompletado.py por intención y descarta ruido.
Uso: python3 scripts/kw-agrupar.py <raw.json> <salida.csv>
Salida: una fila por clúster (disciplinas + público + intención) con consultas, apoyo (nº de semillas
distintas que lo sugieren) e idioma. El apoyo es una señal de demanda, no un volumen."""
import csv, json, re, sys, collections, unicodedata

raw = json.load(open(sys.argv[1]))
import os
_RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')

def norm(s):
    return ''.join(c for c in unicodedata.normalize('NFD', s.lower()) if unicodedata.category(c) != 'Mn')

DISC = {
 'boxeo': r'\b(boxeo|boxa|boxing)\b', 'kickboxing': r'\bkick ?boxing\b|\bkickboxing\b', 'muay thai': r'\bmuay ?thai\b',
 'mma': r'\bmma\b|artes marciales mixtas|arts marcials mixtes', 'jiu-jitsu brasileno': r'\b(bjj|jiu ?jitsu|jiujitsu|jiu-jitsu)\b',
 'grappling': r'\bgrappling\b', 'judo': r'\bjudo\b', 'lucha': r'\blucha (libre|olimpica|grecorromana)\b|\blluita\b',
 'karate': r'\bkarate\b', 'taekwondo': r'\btaekwondo\b|\btae kwon do\b', 'aikido': r'\baikido\b|\baikido\b', 'kung fu': r'\bkung ?fu\b|\bwushu\b',
 'wing chun': r'\bwing ?chun\b', 'hapkido': r'\bhapkido\b', 'kendo': r'\bkendo\b|\biaido\b', 'capoeira': r'\bcapoeira\b', 'tai chi': r'\btai ?chi\b',
 'krav maga': r'\bkrav ?mag[aá]?\b|\bcran ?magan?\b', 'defensa personal': r'\bdefensa personal\b|\bautodefensa\b|\bdefensa femenina\b',
 'kali': r'\bkali (filipino|escrima|arnis)\b|\barnis\b|\bescrima\b', 'ninjutsu': r'\bninjutsu\b', 'sambo': r'\bsambo\b', 'kobudo': r'\bkobudo\b',
 'artes marciales': r'\b(artes marciales|arts marcials|arte marcial|art marcial|deportes de combate|esports de combat)\b',
}
AUD = {'ninos': r'\b(ninos|ninas|nino|nina|infantil|infantiles|nens|nenes|nen|nena|petits|criaturas|hijo|hija|fill|filla|peques)\b',
       'mujeres': r'\b(mujer|mujeres|femenin\w*|chicas|dones|dona|femeni\w*|senoras)\b', 'adultos': r'\b(adultos|adults|adulto|40 anos|50 anos|mayores|seniors|gent gran)\b',
       'adolescentes': r'\b(adolescentes|jovenes|adolescents)\b', 'embarazo': r'\bembaraz\w+\b'}
INT = [
 ('comparar', r'\b(vs|versus|diferencias?|diferencia entre|o|diferencies|mejor|millor|que es mejor|cual es mejor|comparativa|u)\b'),
 ('definir', r'\b(que es|que significa|significado|definicion|qu[eè] [eé]s|origen|historia|historic)\b'),
 ('edad', r'\b(\d+ anos|a partir de que edad|edad|edat|a que edad|a partir de quina edat|cuando empezar|de \d+ a \d+)\b'),
 ('empezar', r'\b(como empezar|empezar|principiantes|iniciacion|desde cero|com comencar|comencar|primera clase|primer dia|aprender)\b'),
 ('salud', r'\b(beneficios|beneficis|adelgazar|bajar de peso|perder peso|estres|ansiedad|tdah|autismo|timidez|timido|bullying|acoso|lesiones|peligros\w*|perillos|seguro|salud|obesidad|sobrepeso|disciplina|autoestima|concentracion|hiperactiv\w+)\b'),
 ('equipo', r'\b(ropa|kimono|guantes|protector\w*|material|equipamiento|equipament|casco|bolsa|guantillas|vendas|gi)\b'),
 ('grados', r'\b(cinturon\w*|cinturons|grados|niveles|nivells|colores)\b'),
 ('precio', r'\b(precio\w*|cuanto cuesta|tarifas?|cuota|preu\w*|quant costa|gratis|clase de prueba|classe de prova)\b'),
 ('local', r'\b(cerca de mi|a prop meu|cerca|zona|barrio)\b'),
 ('competir', r'\b(competicion|competir|campeonato|competicio|federacion|licencia|reglamento|reglas|normas)\b'),
 ('tecnica', r'\b(tecnicas?|ejercicios|entrenamiento|rutina|en casa|golpes|patadas|llaves|katas?|movimientos|combos)\b'),
]
RUIDO = re.compile(r'\b(xbox|gif|pelicula|film|serie|netflix|wikipedia|youtube|videojuego|juego|juegos|game|steam|ps4|ps5|android|uchis|concierto|letra|cancion|frases?|chiste|meme|dibujo|dibujos|wallpaper|fondos?|tattoo|tatuaje|simbolo|gun|hook|vuela|fraude|laboral|universitaria|upc|mundial|ufc|wwe|ring|fight night|tickets?|entradas?|resultados|clasificacion|en vivo|tv|live|online|gratis online|curso online|pdf|libro|libros|app|musica|stream|hindi|english|ingles|queens|koh tao|rotterdam|ushuaia|xalapa|mexico|argentina|chile|colombia|peru|bogota|lima|cdmx|madrid|valencia|sevilla|bilbao|malaga|zaragoza|murcia|alicante|valladolid|palma|canarias|galicia|vigo|coruna|usa|uk|londres|paris|new york|ny|buenos aires)\b')
CAT_PROV = re.compile(r'\b(barcelona|girona|tarragona|lleida|sabadell|terrassa|badalona|hospitalet|mataro|reus|sitges|vilanova|granollers|manresa|vic|figueres|lloret|blanes|cerdanyola|sant cugat|rubi|mollet|castelldefels|gava|viladecans|cornella|martorell|igualada|tortosa|salou|cambrils|calella|olot|banyoles|catalunya|cataluna|maresme|garraf|valles|baix llobregat|barcelones|montbau)\b')

CA_MARK = re.compile(r'\b(per a|què|com|quant|quan|arts marcials|art marcial|nens|nenes|dones|és|començar|diferències|classes|d\'|l\')\b|[àèòçíúï·]')

def _n(s):
    return ''.join(c for c in unicodedata.normalize('NFD', s.lower()) if unicodedata.category(c) != 'Mn')
_lugares = set()
for _m in json.load(open(os.path.join(_RAIZ, 'data/geo/municipios.json'))):
    _x = _n(_m['nombre'])
    if len(_x) >= 4 and _x not in ('sort', 'pals', 'vila', 'mont', 'ager', 'lles', 'riba', 'bot', 'font'): _lugares.add(_x)
for _c in json.load(open(os.path.join(_RAIZ, 'data/geo/comarcas.json'))): _lugares.add(_n(_c['nombre']))
_lugares |= {'vic', 'olot', 'reus', 'gava', 'rubi', 'salt', 'sitges', 'cardona', 'catalunya', 'cataluna'}
LUGAR = re.compile(r'(?:^|\s)(?:' + '|'.join(sorted((re.escape(x) for x in _lugares), key=len, reverse=True)) + r')(?=\s|$)')
CONECTOR = re.compile(r'\b(y|o|e|vs|versus|and|or|x|u|contra|i)\b')
BUSCAR = re.compile(r'\b(clases?|classes?|escuela|escola|academia|academies|gimnasio|gimnas|club|dojo|centros?|centres?|cerca de mi|a prop meu|near me|cerca)\b')

def clasifica(q):
    n = norm(q)
    if RUIDO.search(n): return None
    disc = [k for k, p in DISC.items() if k != 'artes marciales' and re.search(p, n)]
    gen = re.search(DISC['artes marciales'], n)
    if not disc and not gen: return None
    if not disc: disc = ['artes marciales']
    aud = [k for k, p in AUD.items() if re.search(p, n)]
    ints = [k for k, p in INT if re.search(p, n)]
    # «o» suelta es ruido si solo hay una disciplina y no hay otra a ambos lados
    if ints == ['comparar'] and len(disc) < 2 and not re.search(r'\b(vs|versus|diferenc\w+|mejor|millor)\b', n): ints = []
    loc = bool(CAT_PROV.search(n)) or bool(LUGAR.search(n))
    # dos disciplinas unidas por un conector, o «son lo mismo»: comparativa
    if len(disc) >= 2 and (CONECTOR.search(n) or re.search(r'\bson lo mismo\b|\bes lo mismo\b|\bdiferenc|\bmejor\b', n)) and not loc:
        ints = ['comparar'] + [i for i in ints if i != 'comparar']
    if not ints and BUSCAR.search(n) and not loc: ints = ['buscar-centro']
    return disc, aud, ints, loc

filas = collections.defaultdict(lambda: {'consultas': [], 'apoyo': 0, 'ca': 0, 'es': 0})
descartadas = 0
for q, v in raw.items():
    c = clasifica(q)
    if not c: descartadas += 1; continue
    disc, aud, ints, loc = c
    intent = ints[0] if ints else 'general'
    if loc: intent = 'local'
    key = ('+'.join(sorted(disc)[:3]), '+'.join(sorted(aud)) or '-', intent)
    f = filas[key]
    f['consultas'].append(q)
    f['apoyo'] += len(v['semillas'])
    f['ca' if (CA_MARK.search(q) and 'ca' in v['idiomas'] and 'es' not in v['idiomas']) else 'es'] += 1

with open(sys.argv[2], 'w', newline='', encoding='utf-8') as fh:
    w = csv.writer(fh)
    w.writerow(['disciplinas', 'publico', 'intencion', 'n_consultas', 'apoyo', 'n_ca', 'ejemplos'])
    for (d, a, i), f in sorted(filas.items(), key=lambda kv: -kv[1]['apoyo']):
        ej = sorted(f['consultas'], key=len)[:6]
        w.writerow([d, a, i, len(f['consultas']), f['apoyo'], f['ca'], ' | '.join(ej)])
print(len(filas), 'clústeres;', descartadas, 'descartadas de', len(raw))
