import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Reporte() {
  const [ests, setEsts] = useState([]), [sel, setSel] = useState(''), [filas, setFilas] = useState([]), [err, setErr] = useState(''), [carga, setCarga] = useState(true);
  useEffect(() => { api.estudiantes().then(setEsts).catch(e => setErr(e.message)); }, []);
  useEffect(() => {                                                    // RF-06 (GET) + RF-08 (filtro)
    let vigente = true; setCarga(true);
    api.reporte(sel).then(d => { if (vigente) { setFilas(d); setErr(''); } })
      .catch(e => vigente && setErr(e.message)).finally(() => vigente && setCarga(false));
    return () => { vigente = false; };
  }, [sel]);
  const pct = f => Math.round((f.puntaje / f.total) * 100);
  const prom = filas.length ? Math.round(filas.reduce((s, f) => s + pct(f), 0) / filas.length) : 0;
  return (
    <section className="panel ancho">
      <h1>Tablero de docentes</h1>
      <select className="campo" value={sel} onChange={e => setSel(e.target.value)} aria-label="Filtrar por estudiante">
        <option value="">Todos los estudiantes</option>
        {ests.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
      </select>
      {err && <p className="error">{err}</p>}
      {!err && !carga && <p className="marcador">Partidas: {filas.length} · Promedio: {prom}%</p>}
      <div className="scroll"><table>
        <thead><tr><th>Estudiante</th><th>Edad</th><th>Actividad</th><th>Puntaje</th><th>%</th><th>Fecha</th></tr></thead>
        <tbody>
          {filas.map(f => <tr key={f.id}><td>{f.estudiante}</td><td>{f.edad}</td><td>{f.actividad}</td><td>{f.puntaje}/{f.total}</td>
            <td><span className={'pill ' + (pct(f) >= 70 ? 'alto' : pct(f) >= 50 ? 'medio' : 'bajo')}>{pct(f)}%</span></td>
            <td>{new Date(f.fecha).toLocaleString()}</td></tr>)}
          {!filas.length && !carga && <tr><td colSpan="6">Aún no hay resultados. Juega una actividad para verlos aquí.</td></tr>}
        </tbody>
      </table></div>
    </section>
  );
}
