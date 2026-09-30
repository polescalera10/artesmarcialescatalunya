// Formularios de /para-centros/ y /contacto/ → correo a SITE.email vía Resend.
//
// Sin RESEND_API_KEY responde 503 y el navegador cae al plan B (abrir el
// cliente de correo con el mensaje ya redactado), así que el formulario
// funciona desde el primer despliegue aunque la clave no esté puesta.
//
// Datos personales: solo se reenvían por correo, no se guardan en ningún sitio.

const DESTINO = 'contacto@artesmarciales.cat';
const REMITENTE = 'Artes Marciales Catalunya <formulario@artesmarciales.cat>';
const MAX = { nombre: 120, email: 160, centro: 160, municipio: 120, web: 300, tipo: 40, mensaje: 4000, pagina: 300 };
const TIPOS = new Set(['alta', 'correccion', 'promocion', 'web', 'seo', 'otro', 'consulta']);

const limpiar = (v, max) => String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method' });
  }

  const origen = req.headers.origin || '';
  if (origen && !/^https:\/\/(www\.)?artesmarciales\.cat$|^https:\/\/[a-z0-9-]+\.vercel\.app$|^http:\/\/localhost(:\d+)?$/.test(origen)) {
    return res.status(403).json({ ok: false, error: 'origin' });
  }

  const b = typeof req.body === 'string' ? safeJson(req.body) : req.body || {};
  // Trampa para bots: campo invisible que una persona deja vacío.
  if (b.empresa_web) return res.status(200).json({ ok: true });

  const d = Object.fromEntries(Object.entries(MAX).map(([k, max]) => [k, limpiar(b[k], max)]));
  if (!TIPOS.has(d.tipo)) d.tipo = 'otro';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return res.status(400).json({ ok: false, error: 'email' });
  if (!d.mensaje && !d.centro) return res.status(400).json({ ok: false, error: 'vacio' });
  if (b.acepto !== true && b.acepto !== 'on' && b.acepto !== 'true') return res.status(400).json({ ok: false, error: 'privacidad' });

  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(503).json({ ok: false, error: 'sin-envio' });

  const filas = [
    ['Tipo', d.tipo], ['Nombre', d.nombre], ['Email', d.email], ['Centro', d.centro],
    ['Municipio', d.municipio], ['Web', d.web], ['Página', d.pagina],
  ].filter(([, v]) => v);
  const html = `<table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">${filas
    .map(([k, v]) => `<tr><td style="color:#666">${k}</td><td>${esc(v)}</td></tr>`)
    .join('')}</table><p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${esc(d.mensaje)}</p>`;
  const text = `${filas.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${d.mensaje}`;

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: REMITENTE,
      to: [DESTINO],
      reply_to: d.email,
      subject: `[${d.tipo}] ${d.centro || d.nombre || d.email}`.slice(0, 150),
      html,
      text,
    }),
  });
  if (!r.ok) return res.status(502).json({ ok: false, error: 'envio' });
  return res.status(200).json({ ok: true });
}

function safeJson(s) {
  try { return JSON.parse(s); } catch { return {}; }
}
