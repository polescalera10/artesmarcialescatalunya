// Qué páginas existen. Reglas contra el contenido fino (scaled content abuse):
// - Comarca: si tiene al menos un centro.
// - Municipio: si tiene 2+ centros, o texto editorial propio (heredado del Garraf).
//   Los municipios con un solo centro se listan en su comarca y en la ficha.
// - Municipio × disciplina: si el municipio tiene página y hay 2+ centros de
//   esa disciplina en él, o texto editorial propio.
// - Disciplina × comarca: si la disciplina está en 2+ municipios de la comarca.
// - Ficha de centro: siempre (es la página que busca quien conoce el nombre),
//   pero en noindex si solo tiene nombre, municipio y disciplina.
// Los clubs que solo constan en el Registre d'Entitats Esportives (registro-oficial)
// salen en fichas y listados, pero no cuentan para crear páginas de municipio,
// municipio × disciplina ni disciplina × comarca: el registro no confirma que
// sigan activos y esas páginas tienen que sostenerse con centros verificados.
import { CENTROS, centrosDeMunicipio, centrosConDisciplina, comarcasConCentros, type Centro } from './centros';
import { getMunicipio } from './geo';
import { DISCIPLINAS } from './disciplinas';
import { MUNDISC_HEREDADAS, MUNICIPIOS_HEREDADOS, editorialMunicipio, editorialMunDisc } from './editorial';

const MIN_CENTROS_MUNICIPIO = 2;
const verificado = (c: Centro) => c.fuenteTipo !== 'registro-oficial';

// Las rutas se consultan cientos de veces por build: se calculan una vez.
const once = <T,>(f: () => T) => { let v: T | undefined; return () => (v ??= f()); };
const MIN_CENTROS_MUNDISC = 2;

export const rutasComarca = () => comarcasConCentros().map(comarca => ({ comarca }));

export const rutasMunicipio = once((): { comarca: string; municipio: string }[] => {
  const porMunicipio = new Map<string, number>();
  for (const c of CENTROS.filter(verificado)) porMunicipio.set(c.municipio, (porMunicipio.get(c.municipio) ?? 0) + 1);
  const conPagina = new Set<string>(
    [...porMunicipio.entries()].filter(([, k]) => k >= MIN_CENTROS_MUNICIPIO).map(([m]) => m),
  );
  for (const h of MUNICIPIOS_HEREDADOS) conPagina.add(h.municipio);
  return [...conPagina].sort().map(municipio => ({ comarca: getMunicipio(municipio)!.comarca, municipio }));
});

const municipiosConPagina = once(() => new Set(rutasMunicipio().map(r => r.municipio)));
export const tienePaginaMunicipio = (m: string) => municipiosConPagina().has(m);

export const rutasMunDisc = once((): { comarca: string; municipio: string; disciplina: string }[] => {
  const out = new Map<string, { comarca: string; municipio: string; disciplina: string }>();
  for (const { comarca, municipio } of rutasMunicipio()) {
    const locales = centrosDeMunicipio(municipio).filter(verificado);
    for (const d of DISCIPLINAS) {
      if (centrosConDisciplina(d.slug, locales).length >= MIN_CENTROS_MUNDISC)
        out.set(`${municipio}/${d.slug}`, { comarca, municipio, disciplina: d.slug });
    }
  }
  for (const h of MUNDISC_HEREDADAS) out.set(`${h.municipio}/${h.disciplina}`, h);
  return [...out.values()];
});

export const tienePaginaMunDisc = (m: string, d: string) =>
  rutasMunDisc().some(r => r.municipio === m && r.disciplina === d);

export const rutasDiscComarca = once((): { disciplina: string; comarca: string }[] => {
  const out: { disciplina: string; comarca: string }[] = [];
  for (const comarca of comarcasConCentros()) {
    const deComarca = CENTROS.filter(c => c.comarca === comarca && verificado(c));
    for (const d of DISCIPLINAS) {
      const munis = new Set(centrosConDisciplina(d.slug, deComarca).map(c => c.municipio));
      if (munis.size >= 2) out.push({ disciplina: d.slug, comarca });
    }
  }
  return out;
});

export const rutasDisciplina = () =>
  DISCIPLINAS.filter(d => d.principal || centrosConDisciplina(d.slug).length > 0).map(d => ({ disciplina: d.slug }));

export const rutasCentro = () => CENTROS.map(c => ({ slug: c.slug }));

/**
 * Una ficha es indexable si es un centro verificado (no solo registro oficial)
 * y aporta dirección postal, web oficial o imagen propia confirmada por el centro.
 * Los centros verificados con dirección pero sin web propia son los que mejor
 * posicionan en Google (no compiten con una web oficial) y son prospectos clave.
 */
export const fichaIndexable = (c: Centro) =>
  verificado(c) && Boolean(c.direccion || c.web || c.logo || c.foto);

// Páginas de listado que existen pero quedan en noindex y fuera del sitemap
// cuando no alcanzan masa crítica de centros verificados. Siguen enlazadas para quien navega.
const MIN_VERIFICADOS_COMARCA = 2;
const MIN_VERIFICADOS_MUNICIPIO = 3;
const MIN_VERIFICADOS_MUNDISC = 3;
const MIN_VERIFICADOS_DISCCOMARCA = 4;
const MIN_MUNICIPIOS_DISCCOMARCA = 3;
const MIN_VERIFICADOS_DISCIPLINA = 2;

const contarVerificados = (lista: Centro[]) => lista.filter(verificado).length;

export const comarcaIndexable = (comarca: string) =>
  contarVerificados(CENTROS.filter(c => c.comarca === comarca)) >= MIN_VERIFICADOS_COMARCA;
export const municipioIndexable = (municipio: string) =>
  contarVerificados(centrosDeMunicipio(municipio)) >= MIN_VERIFICADOS_MUNICIPIO;
export const munDiscIndexable = (municipio: string, disciplina: string) =>
  contarVerificados(centrosConDisciplina(disciplina, centrosDeMunicipio(municipio))) >= MIN_VERIFICADOS_MUNDISC;
export const discComarcaIndexable = (disciplina: string, comarca: string) => {
  const deComarca = centrosConDisciplina(disciplina, CENTROS.filter(c => c.comarca === comarca && verificado(c)));
  const munis = new Set(deComarca.map(c => c.municipio));
  return deComarca.length >= MIN_VERIFICADOS_DISCCOMARCA && munis.size >= MIN_MUNICIPIOS_DISCCOMARCA;
};
export const disciplinaIndexable = (disciplina: string) =>
  contarVerificados(centrosConDisciplina(disciplina)) >= MIN_VERIFICADOS_DISCIPLINA;

export { editorialMunicipio, editorialMunDisc };
