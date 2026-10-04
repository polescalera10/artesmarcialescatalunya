// Tests del endpoint /api/contacto sin red: Resend se sustituye por un fetch
// simulado. Se ejecutan con `node --test tests/` (npm test).
import { test } from 'node:test';
import assert from 'node:assert/strict';

const enviados = [];
globalThis.fetch = async (url, opts) => {
  enviados.push(JSON.parse(opts.body));
  return { ok: true, status: 200, text: async () => '' };
};
process.env.RESEND_API_KEY = 'test';
const { default: handler } = await import('../api/contacto.js');

let ip = 0;
function llamar({ method = 'POST', origin = 'https://artesmarciales.cat', body = {}, mismaIp } = {}) {
  const req = { method, headers: { origin, 'x-forwarded-for': mismaIp ?? `10.0.0.${++ip}` }, body };
  const res = { code: 0, json: null, headers: {}, status(c) { this.code = c; return this; }, json(j) { this.json = j; return this; }, setHeader(k, v) { this.headers[k] = v; } };
  return handler(req, res).then(() => res);
}
const valido = { email: 'ana@example.com', mensaje: 'Hola', acepto: true, tipo: 'consulta' };

test('solo POST', async () => assert.equal((await llamar({ method: 'GET' })).code, 405));
test('rechaza otros orígenes, también *.vercel.app ajenos', async () => {
  assert.equal((await llamar({ origin: 'https://evil.vercel.app', body: valido })).code, 403);
});
test('trampa anti-bots: responde ok sin enviar', async () => {
  const n = enviados.length;
  assert.equal((await llamar({ body: { ...valido, empresa_web: 'x' } })).code, 200);
  assert.equal(enviados.length, n);
});
test('valida email y privacidad', async () => {
  assert.equal((await llamar({ body: { ...valido, email: 'no' } })).code, 400);
  assert.equal((await llamar({ body: { ...valido, acepto: false } })).code, 400);
});
test('envío correcto: aviso a contacto@ y acuse fijo al usuario', async () => {
  const n = enviados.length;
  const r = await llamar({ body: { ...valido, mensaje: 'Texto <script>' } });
  assert.equal(r.code, 200);
  const [aviso, acuse] = enviados.slice(n);
  assert.deepEqual(aviso.to, ['contacto@artesmarciales.cat']);
  assert.equal(aviso.reply_to, 'ana@example.com');
  assert.ok(!aviso.html.includes('<script>'), 'escapa HTML');
  assert.deepEqual(acuse.to, ['ana@example.com']);
  assert.ok(!acuse.text.includes('Texto'), 'el acuse no repite lo escrito');
});
test('límite: 5 envíos por IP, el 6.º devuelve 429', async () => {
  const codigos = [];
  for (let i = 0; i < 6; i++) codigos.push((await llamar({ body: valido, mismaIp: '192.168.1.1' })).code);
  assert.deepEqual(codigos, [200, 200, 200, 200, 200, 429]);
});
