// Generadores de preguntas de cada actividad (lógica separada de la interfaz).
const r = n => Math.floor(Math.random() * n);
const pick = a => a[r(a.length)];
const mix = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = r(i + 1); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const lcm = (a, b) => (a * b) / gcd(a, b);

// 4 opciones únicas que incluyen la correcta (primero se usan errores "típicos")
// `clave` permite considerar iguales opciones equivalentes (p. ej. 1/2 y 2/4)
const opciones = (ok, candidatos, relleno, clave = x => x) => {
  const vistos = new Set([clave(ok)]), lista = [ok];
  const meter = c => { const k = clave(c); if (lista.length < 4 && !vistos.has(k)) { vistos.add(k); lista.push(c); } };
  candidatos.forEach(meter);
  for (let g = 0; lista.length < 4 && g < 300; g++) meter(relleno());
  return mix(lista);
};

/* ---------- Conocimientos espaciales (pre primario) ---------- */
export const FIGURAS = ['Círculo', 'Cuadrado', 'Triángulo', 'Rectángulo'];

const ESPACIAL = [
  { par: ['Adentro', 'Afuera'], objs: ['⚽', '🐱', '🍎', '🧸', '🐶'] },
  { par: ['Arriba', 'Abajo'], objs: ['🐦', '🎈', '🦋', '🪁', '🐶', '🧸'], ref: { Arriba: ['🏠', '🌳'], Abajo: ['☁️', '🎈'] } },
  { par: ['Cerca', 'Lejos'], dobles: [['🐶', '🦴'], ['🐱', '🐟'], ['🐵', '🍌'], ['🐰', '🥕']] },
  { par: ['Encima', 'Debajo'], objs: ['⚽', '🐱', '🍎', '🧸', '🐶'] }
];

function espacial() {
  const una = (g, palabra) => {
    const [a, b] = g.par;
    const e = { tipo: palabra.toLowerCase() };
    let texto;
    if (g.dobles) { e.par = pick(g.dobles); texto = `Mira la imagen: ¿cómo están ${e.par[0]} y ${e.par[1]}?`; }
    else {
      e.objeto = pick(g.objs);
      if (g.ref) e.ref = pick(g.ref[palabra]);
      texto = `Mira la imagen: ¿dónde está ${e.objeto}?`;
    }
    return { texto, escena: e, ok: palabra, opts: mix([a, b]) };
  };
  // Las 4 parejas de conceptos aparecen siempre + 1 pregunta extra al azar
  const qs = ESPACIAL.map(g => una(g, pick(g.par)));
  const g = pick(ESPACIAL);
  qs.push(una(g, pick(g.par)));
  return mix(qs);
}

/* ---------- Figuras geométricas (pre primario) ---------- */
function figuras() {
  const orden = [...mix(FIGURAS), pick(FIGURAS)];
  return orden.map((f, i) => i % 2 === 0
    ? { texto: '¿Qué figura es esta?', figura: f, ok: f, opts: mix(FIGURAS) }
    : { texto: `Toca el ${f.toLowerCase()}`, ok: f, opts: mix(FIGURAS), figurasOpts: true });
}

/* ---------- Tablas de multiplicar ---------- */
function tablas() {
  return Array.from({ length: 5 }, () => {
    const a = 2 + r(9), b = 1 + r(10), ok = a * b;
    const cand = [a * (b + 1), a * (b - 1), (a + 1) * b, (a - 1) * b, ok + 10, ok - 10].filter(n => n > 0).map(String);
    return { texto: `${a} × ${b} = ?`, ok: String(ok), opts: opciones(String(ok), mix(cand), () => String(Math.max(1, ok + r(21) - 10))) };
  });
}

/* ---------- Suma de quebrados (mismo y distinto denominador) ---------- */
function quebrados() {
  return Array.from({ length: 5 }, () => {
    let d1, d2;
    if (r(2)) { d1 = d2 = pick([2, 3, 4, 5, 6, 8, 10]); }
    else { d1 = pick([2, 3, 4, 5]); d2 = d1 * pick([2, 3]); if (r(2)) [d1, d2] = [d2, d1]; }
    const a = 1 + r(d1 - 1), b = 1 + r(d2 - 1);
    const den = lcm(d1, d2), num = a * (den / d1) + b * (den / d2), ok = `${num}/${den}`;
    const cand = [`${a + b}/${d1 + d2}`, `${num + 1}/${den}`, `${Math.max(1, num - 1)}/${den}`, `${num + 2}/${den}`];
    const valor = f => { const [x, y] = f.split('/').map(Number), g = gcd(x, y); return `${x / g}/${y / g}`; };
    return { texto: `${a}/${d1} + ${b}/${d2} = ?`, ok, opts: opciones(ok, cand, () => `${1 + r(den * 2)}/${den}`, valor) };
  });
}

/* ---------- Multiplicación con decimales ---------- */
function decimales() {
  return Array.from({ length: 5 }, (_, i) => {
    if (i % 2 === 0) {                                  // decimal × entero  (1.1 – 9.9) × (2 – 9)
      const n = 11 + r(89), c = 2 + r(8), p = n * c, f = x => (x / 10).toFixed(1), ok = f(p);
      const cand = [(p / 100).toFixed(1), p.toFixed(1), f(p + 10), f(p - 10), f(p + c)].filter(s => parseFloat(s) > 0);
      return { texto: `${f(n)} × ${c} = ?`, ok, opts: opciones(ok, mix(cand), () => f(Math.max(1, p + r(41) - 20))) };
    }
    const A = 12 + r(38), B = 2 + r(8), p = A * B, f = x => (x / 100).toFixed(2), ok = f(p);   // decimal × decimal
    const cand = [(p / 10).toFixed(2), f(p + 10), f(p - 10), f(p + 1), f(p * 10)].filter(s => parseFloat(s) > 0);
    return { texto: `${(A / 10).toFixed(1)} × ${(B / 10).toFixed(1)} = ?`, ok, opts: opciones(ok, mix(cand), () => f(Math.max(1, p + r(41) - 20))) };
  });
}

export function generar(tipo) {
  switch (tipo) {
    case 'espacial': return espacial();
    case 'figuras': return figuras();
    case 'tablas': return tablas();
    case 'quebrados': return quebrados();
    case 'decimales': return decimales();
    default: return [];        // 'memoria' tiene su propio componente
  }
}
