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

/** Una ficha es indexable si aporta algo más que nombre, municipio y disciplina. */
export const fichaIndexable = (c: Centro) => Boolean(c.web || c.direccion || (c.otras && c.otras.length));

export { editorialMunicipio, editorialMunDisc };
