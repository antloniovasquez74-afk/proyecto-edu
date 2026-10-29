import { useMemo, useState } from 'react';
import { api } from '../api.js';
import { generar } from '../preguntas.js';
import Figura from './Figura.jsx';
import Escena from './Escena.jsx';
import Memoria from './Memoria.jsx';

// Lee la pregunta en voz alta (ayuda a niños que aún no leen bien)
const hablar = t => {
  if (!('speechSynthesis' in window)) return;
  const limpio = t.replace(/×/g, ' por ').replace(/\+/g, ' más ').replace(/=/g, ' igual a ')
    .replace(/(\d+)\/(\d+)/g, '$1 sobre $2').replace(/[^\p{L}\p{N}\s¿?¡!.,]/gu, ' ');
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(limpio); u.lang = 'es-ES'; u.rate = 0.9;
  speechSynthesis.speak(u);
};

export default function Juego({ est, act, onSalir }) {
  const qs = useMemo(() => generar(act.tipo), [act]);
  const [i, setI] = useState(0), [punt, setPunt] = useState(0), [resp, setResp] = useState(null);
  const [fin, setFin] = useState(null), [msg, setMsg] = useState(''), [guardado, setGuardado] = useState(false);

  const guardar = async (puntaje, total) => {                          // RF-05 (HTTP POST)
    setFin({ puntaje, total }); setMsg('Guardando…'); setGuardado(false);
    try {
      await api.guardarProgreso({ estudiante_id: est.id, actividad_id: act.id, puntaje, total });
      setMsg('✅ Resultado guardado'); setGuardado(true);
    } catch { setMsg('⚠️ No se pudo guardar el resultado'); }
  };

  const elegir = o => {                                                // RF-03 + RF-04
    if (resp) return;
    const bien = o === qs[i].ok, nuevo = punt + (bien ? 10 : 0);
    setResp({ o, bien }); setPunt(nuevo);
    setTimeout(() => { setResp(null); i + 1 < qs.length ? setI(i + 1) : guardar(nuevo, qs.length * 10); }, 1300);
  };

  if (fin) return (
    <section className="panel">
      <h1>{fin.puntaje >= fin.total / 2 ? '🌟 ¡Excelente!' : '💪 ¡Sigue practicando!'}</h1>
      <p className="grande-txt">Puntaje: {fin.puntaje} / {fin.total}</p>
      <p className={guardado ? 'ok' : 'error'}>{msg}</p>
      {!guardado && msg.startsWith('⚠️') && <button className="btn chico" onClick={() => guardar(fin.puntaje, fin.total)}>Reintentar guardar</button>}
      <div><button className="btn grande" onClick={onSalir}>Volver al menú</button></div>
    </section>
  );
  if (act.tipo === 'memoria') return <Memoria onFin={guardar} onSalir={onSalir} />;

  const q = qs[i];
  return (
    <section className="panel">
      <p className="marcador">Pregunta {i + 1}/{qs.length} · ⭐ {punt} puntos</p>
      <div className="progreso" aria-hidden="true"><div style={{ width: `${(i / qs.length) * 100}%` }} /></div>
      <h1>{q.texto} <button className="btn chico" onClick={() => hablar(q.texto)} aria-label="Escuchar la pregunta">🔊</button></h1>
      {q.escena && <Escena e={q.escena} />}
      {q.figura && <Figura tipo={q.figura} />}
      <div className={'rejilla' + (q.figurasOpts ? ' figuras' : '')}>
        {q.opts.map(o => (
          <button key={o} aria-label={o}
            className={'btn grande' + (resp && o === q.ok ? ' bien' : '') + (resp && resp.o === o && !resp.bien ? ' mal' : '')}
            onClick={() => elegir(o)}>{q.figurasOpts ? <Figura tipo={o} chica /> : o}</button>
        ))}
      </div>
      {resp && <p className={resp.bien ? 'ok' : 'error'}>{resp.bien ? '🎉 ¡Muy bien! +10' : `❌ Casi. La respuesta era: ${q.ok}`}</p>}
      <button className="btn chico" onClick={onSalir}>Salir</button>
    </section>
  );
}
