import { useState } from 'react';

// Pares que se ASOCIAN (cada carta tiene su pareja relacionada)
const PAREJAS = [['🐶', '🦴'], ['🐱', '🐟'], ['🐝', '🍯'], ['🐵', '🍌'], ['🐰', '🥕'], ['🐄', '🥛'], ['🐓', '🥚'], ['☀️', '🌙']];
const mix = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const nuevo = () => mix(mix(PAREJAS).slice(0, 6).flatMap(([a, b], p) => [{ p, e: a }, { p, e: b }])).map((c, i) => ({ ...c, id: i }));

export default function Memoria({ onFin, onSalir }) {
  const [cartas] = useState(nuevo);
  const [abiertas, setAb] = useState([]), [pares, setPares] = useState([]), [mov, setMov] = useState(0), [bloqueo, setBloqueo] = useState(false), [aviso, setAviso] = useState('');
  const total = cartas.length / 2;
  const puntaje = Math.max(10, 100 - Math.max(0, mov - 6) * 10);       // RF-04: puntaje en tiempo real

  const voltear = i => {
    if (bloqueo || abiertas.includes(i) || pares.includes(cartas[i].p)) return;
    const nuevas = [...abiertas, i];
    setAb(nuevas);
    if (nuevas.length < 2) return;
    setMov(m => m + 1); setBloqueo(true);
    const [a, b] = nuevas.map(k => cartas[k]);
    const bien = a.p === b.p;                                           // RF-03: aviso visual inmediato
    setAviso(bien ? '🎉 ¡Pareja encontrada!' : '🤔 No son pareja, ¡intenta otra vez!');
    setTimeout(() => { if (bien) setPares(p => [...p, a.p]); setAb([]); setBloqueo(false); setAviso(''); }, 1000);
  };

  const fin = pares.length === total;
  return (
    <section className="panel ancho">
      <h2>Une cada cosa con su pareja · Intentos: {mov} · ⭐ {fin ? puntaje : '…'}</h2>
      <p className="marcador">Parejas: {pares.length}/{total}</p>
      <div className="memoria">
        {cartas.map((c, i) => {
          const hecho = pares.includes(c.p), visible = abiertas.includes(i) || hecho;
          return (
            <button key={c.id} className={'carta' + (hecho ? ' par' : '')} disabled={visible || bloqueo}
              aria-label={visible ? c.e : 'carta oculta'} onClick={() => voltear(i)}>{visible ? c.e : '❓'}</button>
          );
        })}
      </div>
      {aviso && <p className={aviso.startsWith('🎉') ? 'ok' : 'error'}>{aviso}</p>}
      {fin
        ? <><p className="ok">🌟 ¡Encontraste todas! Puntaje: {puntaje}/100</p><button className="btn grande" onClick={() => onFin(puntaje, 100)}>Guardar mi resultado</button></>
        : <button className="btn chico" onClick={onSalir}>Salir</button>}
    </section>
  );
}
