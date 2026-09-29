// Avisa a los buscadores que usan IndexNow (Bing, que alimenta ChatGPT Search y
// Copilot, además de Yandex, Seznam y Naver) de las URLs del sitemap de
// producción. No necesita cuenta: la propiedad se demuestra con el archivo
// público /<clave>.txt, que contiene la propia clave.
//
// Uso, después de que Vercel haya desplegado:
//   npm run indexnow                  → envía todas las URLs del sitemap
//   npm run indexnow -- /cubelles/ …  → envía solo esas rutas
//
// La clave no es secreta (tiene que ser pública para que funcione); lo único
// que permite es notificar URLs de este dominio.
const HOST = 'artesmarcialesgarraf.es';
const KEY = '99700fb47e87c6e52c646cf63ea4c863';
const SITE = `https://${HOST}`;

const rutas = process.argv.slice(2);
let urls;
if (rutas.length) {
  urls = rutas.map(r => new URL(r, SITE).href);
} else {
  const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
}

const clave = await fetch(`${SITE}/${KEY}.txt`);
if (!clave.ok || (await clave.text()).trim() !== KEY) {
  console.error(`La clave no está publicada en ${SITE}/${KEY}.txt: despliega antes de avisar.`);
  process.exit(1);
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls }),
});
// 200 = recibido, 202 = recibido y pendiente de validar la clave.
console.log(`IndexNow: ${res.status} ${res.statusText} · ${urls.length} URLs`);
if (res.status >= 400) {
  console.error(await res.text());
  process.exit(1);
}
