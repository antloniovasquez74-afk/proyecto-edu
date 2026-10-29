import { useEffect, useState } from 'react';
import { api } from '../api.js';
export default function Menu({ est, onJugar }) {
  const [acts, setActs] = useState([]), [err, setErr] = useState('');
  useEffect(() => { api.actividades().then(setActs).catch(e => setErr(e.message)); }, []);
  const grupo = (nivel, titulo) => (
    <>
      <h2>{titulo}</h2>
      <div className="rejilla">
        {acts.filter(a => a.nivel === nivel).map(a => (
          <button key={a.id} className="tarjeta" onClick={() => onJugar(a)}><span>{a.icono}</span>{a.nombre}</button>
        ))}
      </div>
    </>
  );
  return (
    <section className="panel ancho">
      <h1>¡Hola, {est.nombre}! ¿A qué jugamos?</h1>
      {err && <p className="error">{err}</p>}
      {grupo('preprimario', 'Pre primario')}
      {grupo('primario', 'Primario')}
    </section>
  );
}
