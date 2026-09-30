// Genera el mapa de 301 de artesmarcialesgarraf.es → artesmarciales.cat.
// Uso: npx tsx scripts/redirecciones.ts > redirecciones.json
import { mapaRedirecciones } from '../src/lib/editorial';
console.log(JSON.stringify(mapaRedirecciones(), null, 2));
