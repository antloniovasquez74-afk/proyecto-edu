import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Registro({ onListo }) {
  const [nombre, setNombre] = useState(''), [edad, setEdad] = useState(''), [lista, setLista] = useState([]), [err, setErr] = useState('');
  useEffect(() => { api.estudiantes().then(setLista).catch(e => setErr(e.message)); }, []);
  const crear = async e => {                                           // RF-01
    e.preventDefault(); setErr('');
    const n = Number(edad);
    if (!nombre.trim()) return setErr('Escribe tu nombre');
    if (!Number.isInteger(n) || n < 3 || n > 13) return setErr('La edad debe estar entre 3 y 13 años');
    try { onListo(await api.crearEstudiante({ nombre: nombre.trim(), edad: n })); } catch (x) { setErr(x.message); }
  };
  return (
    <section className="panel">
      <h1>¡Hola! ¿Cómo te llamas?</h1>
      <form onSubmit={crear}>
        <input className="campo" placeholder="Tu nombre" maxLength={80} value={nombre} onChange={e => setNombre(e.target.value)} aria-label="Tu nombre" />
        <input className="campo" type="number" min="3" max="13" placeholder="Tu edad" value={edad} onChange={e => setEdad(e.target.value)} aria-label="Tu edad" />
        <button className="btn grande" type="submit">¡Empezar a jugar!</button>
      </form>
      {err && <p className="error">{err}</p>}
      {lista.length > 0 && <>
        <h2>¿Ya jugaste antes?</h2>
        <div className="fila">{lista.map(e => <button key={e.id} className="btn chico" onClick={() => onListo(e)}>{e.nombre}</button>)}</div>
      </>}
    </section>
  );
}
