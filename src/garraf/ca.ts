// ────────────────────────────────────────────────────────────────────────────
// PILOT EN CATALÀ (2026-09-29)
//
// Al Garraf una part de la cerca local és en català ("arts marcials Vilanova",
// "classes de boxa Sitges") i cap competidor hi té pàgines pròpies. El pilot són
// set pàgines: el directori (/ca/) i una guia per municipi
// (/ca/arts-marcials-<municipi>/). Les fitxes dels centres surten de centros.ts,
// així que no es desfasen; el text de cada municipi és propi i s'ha de revisar
// quan canviï el directori d'aquell municipi.
//
// Les mateixes regles que la resta del lloc: cap dada que no consti en una font
// pública, cap valoració, ordre alfabètic.
// ────────────────────────────────────────────────────────────────────────────

import { LOCATIONS } from './locations';

/** Noms de les disciplines en català, per slug de disciplines.ts. */
export const DISCIPLINES_CA: Record<string, string> = {
  'boxeo': 'boxa',
  'karate': 'karate',
  'mma': 'arts marcials mixtes (MMA)',
  'kickboxing': 'kickboxing',
  'muay-thai': 'muay thai',
  'jiu-jitsu-brasileno': 'jiu-jitsu brasiler',
  'judo': 'judo',
  'taekwondo': 'taekwondo',
  'defensa-personal': 'defensa personal',
  'krav-maga': 'krav maga',
};

export const FUENTE_LABELS_CA: Record<string, string> = {
  'web-oficial': 'Web oficial del centre',
  'federacion': 'Registre de clubs de la federació',
  'directorio-municipal': "Directori municipal d'entitats",
  'perfil-publico': 'Perfil públic del centre',
};

export const rutaCa = (municipio: string) => `/ca/arts-marcials-${municipio}/`;

/** Text propi de cada municipi. HTML senzill: es pinta amb set:html. */
export const MUNICIPIS_CA: Record<string, { intro: string; cos: string }> = {
  'vilanova-i-la-geltru': {
    intro:
      "Vilanova i la Geltrú és la capital del Garraf i el municipi amb més oferta d'arts marcials de la comarca. Si busques una disciplina concreta, és on hi ha més probabilitats de trobar-la i de poder triar horari.",
    cos: `
<h2>Què hi ha a Vilanova</h2>
<p>Al nostre directori hi consten {{m:vilanova-i-la-geltru}} centres de Vilanova, més que a cap altre municipi del Garraf. Hi ha boxa, kickboxing, jiu-jitsu brasiler, karate, arts marcials mixtes, defensa personal, taekwondo i l'únic judo verificat de la comarca. El Club Judo Vilafranca-Vilanova anuncia també aikido i wu shu (el que molta gent en diu kung fu), i altres centres hi afegeixen kobudo, hapkido, K-1, kyokushin i tai-txi.</p>
<p>El que no hi consta és krav maga. L'únic centre del Garraf que l'anuncia és a <a href="/ca/arts-marcials-cubelles/">Cubelles</a>, a uns deu minuts per la C-31. Tampoc hi ha muay thai en cap centre de la comarca.</p>
<h2>Si véns de fora</h2>
<p>Per a qui viu a Cubelles, Canyelles, Olivella o Sant Pere de Ribes, Vilanova és sovint la destinació natural. Abans d'apuntar-te, fes el trajecte a l'hora real de la classe un dia feiner: deu minuts d'anada semblen poc al setembre i pesen al gener.</p>`,
  },
  'sitges': {
    intro:
      "A Sitges hi ha una oferta curta però variada, concentrada en disciplines de cop i de lluita. Per a judo o taekwondo, el més habitual és anar a Vilanova o a Sant Pere de Ribes.",
    cos: `
<h2>Què hi ha a Sitges</h2>
<p>Al nostre directori hi consten {{m:sitges}} centres de Sitges. Entre tots anuncien kickboxing, jiu-jitsu brasiler, karate, arts marcials mixtes, boxa i defensa personal; {{dm:grappling:sitges}} d'ells també anuncien grappling, i un, K-1.</p>
<p>No hi consta judo ni taekwondo. El taekwondo més a prop és a <a href="/ca/arts-marcials-sant-pere-de-ribes/">Sant Pere de Ribes</a>, amb {{dm:taekwondo:sant-pere-de-ribes}} clubs, i el judo, a <a href="/ca/arts-marcials-vilanova-i-la-geltru/">Vilanova i la Geltrú</a>, a 10-15 minuts en cotxe.</p>
<h2>Si només hi ets uns mesos</h2>
<p>Sitges té molta població de temporada. Si et quedes poc temps, pregunta si treballen amb bons de classes o mensualitats sense permanència abans de pagar matrícula.</p>`,
  },
  'sant-pere-de-ribes': {
    intro:
      "Sant Pere de Ribes és el municipi del Garraf amb més clubs de taekwondo, i també hi consten karate, jiu-jitsu japonès, defensa personal, arts marcials mixtes i grappling. Per a la boxa, el judo o el jiu-jitsu brasiler, cal mirar cap a Sitges o Vilanova.",
    cos: `
<h2>Què hi ha a Sant Pere de Ribes</h2>
<p>Al nostre directori hi consten {{m:sant-pere-de-ribes}} centres entre Ribes i les Roquetes, i {{dm:taekwondo:sant-pere-de-ribes}} ensenyen taekwondo. Un d'ells, Spartae, hi afegeix defensa personal i estils poc habituals a la comarca: Jeet Kune Do, kali filipí i wing chun. La resta no són clubs de taekwondo: M&amp;G - Ryu ensenya karate; Club Jitsu, jiu-jitsu japonès i defensa personal, i Art of Fighting, arts marcials mixtes, grappling i lluita.</p>
<p>No hi consta boxa, judo, jiu-jitsu brasiler ni muay thai. Per a això, <a href="/ca/arts-marcials-sitges/">Sitges</a> i <a href="/ca/arts-marcials-vilanova-i-la-geltru/">Vilanova i la Geltrú</a> són a 10-15 minuts en cotxe.</p>
<h2>Dos nuclis, dos càlculs</h2>
<p>Ribes i les Roquetes estan separats, i no és el mateix sortir d'un que de l'altre. Des de les Roquetes, Sitges queda molt a mà; des de Ribes, Vilanova és igual de còmoda. Mira la distància des del teu nucli, no des del nom del municipi.</p>`,
  },
  'cubelles': {
    intro:
      "Cubelles té més oferta del que sembla: taekwondo en dos centres i l'únic krav maga verificat de tot el Garraf. Per a les disciplines de terra, Vilanova és a deu minuts.",
    cos: `
<h2>Què hi ha a Cubelles</h2>
<p>Al nostre directori hi consten dos centres de Cubelles. Tots dos ensenyen taekwondo, i un d'ells, GYM FYS Fitness &amp; Defense, anuncia també boxa, arts marcials mixtes i krav maga. És l'únic centre de la comarca amb krav maga a la seva oferta pública.</p>
<h2>I el jiu-jitsu?</h2>
<p>És el que més es busca de Cubelles en aquesta guia, així que la resposta directa: cap centre de Cubelles anuncia jiu-jitsu brasiler a la seva font pública. Els tres més propers són a <a href="/ca/arts-marcials-vilanova-i-la-geltru/">Vilanova i la Geltrú</a>, a uns deu minuts per la C-31: Aranha VNG, Senshi No Michi i Zen Garraf, per ordre alfabètic.</p>
<p>Cap al sud-oest hi ha Cunit i Calafell, ja al Baix Penedès. El nostre directori només cobreix els sis municipis del Garraf, així que aquella oferta no està verificada aquí.</p>`,
  },
  'canyelles': {
    intro:
      "A Canyelles hi consta un sol centre d'arts marcials amb font pública verificable, un club de taekwondo. Per a qualsevol altra disciplina, entrenar-hi vol dir, avui per avui, desplaçar-se.",
    cos: `
<h2>Què hi ha a Canyelles, i on anar</h2>
<p>Al nostre directori hi consta Choi's Canyelles, que figura al registre de clubs de la federació com a club de taekwondo. Per a la resta de disciplines, la referència natural és <a href="/ca/arts-marcials-vilanova-i-la-geltru/">Vilanova i la Geltrú</a>, a uns quinze minuts per la C-15, amb {{m:vilanova-i-la-geltru}} centres i gairebé totes les disciplines.</p>
<h2>Com fer que el trajecte aguanti</h2>
<p>Tria dos dies, no tres: el tercer trajecte és el primer que cau quan arriba el mal temps. Prioritza l'horari per sobre del centre. I pregunta al centre si ja té alumnes de Canyelles: compartir cotxe és el millor sistema per no deixar-ho.</p>`,
  },
  'olivella': {
    intro:
      "Olivella té una entitat de taekwondo al seu directori municipal. Per a la resta de disciplines, Sant Pere de Ribes, Sitges i Vilanova queden a 10-20 minuts en cotxe segons la urbanització.",
    cos: `
<h2>Què hi ha a Olivella</h2>
<p>Al nostre directori hi consta l'Associació Esportiva Taekwondo Olivella, que figura al directori municipal d'entitats esportives de l'Ajuntament. Aquella fitxa només en dona el nom i la disciplina: ni adreça, ni horaris, ni web. No publiquem el que no hi consta, així que el camí més curt és preguntar-ho al mateix Ajuntament.</p>
<h2>Cap on mirar</h2>
<p><a href="/ca/arts-marcials-sant-pere-de-ribes/">Sant Pere de Ribes</a> sol ser el més proper des de bona part del terme, amb {{m:sant-pere-de-ribes}} centres, {{dm:taekwondo:sant-pere-de-ribes}} d'ells de taekwondo. <a href="/ca/arts-marcials-sitges/">Sitges</a> té més varietat de disciplines de cop i jiu-jitsu. <a href="/ca/arts-marcials-vilanova-i-la-geltru/">Vilanova i la Geltrú</a> és on més oferta hi ha, inclòs l'únic judo verificat del Garraf.</p>`,
  },
};

export const MUNICIPIS_CA_ORDRE = LOCATIONS.map(l => l.slug).filter(s => MUNICIPIS_CA[s]);
