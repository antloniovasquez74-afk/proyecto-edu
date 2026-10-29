import { useState } from 'react';
import Registro from './components/Registro.jsx';
import Menu from './components/Menu.jsx';
import Juego from './components/Juego.jsx';
import Reporte from './components/Reporte.jsx';

const guardado = () => { try { return JSON.parse(localStorage.getItem('estudiante')); } catch { return null; } };

export default function App() {
  const [est, setEstado] = useState(guardado), [act, setAct] = useState(null), [docente, setDocente] = useState(false);
  const setEst = e => { setEstado(e); try { e ? localStorage.setItem('estudiante', JSON.stringify(e)) : localStorage.removeItem('estudiante'); } catch { /* sin almacenamiento */ } };
  let vista;
  if (docente) vista = <Reporte />;
  else if (!est) vista = <Registro onListo={setEst} />;
  else if (act) vista = <Juego key={act.id} est={est} act={act} onSalir={() => setAct(null)} />;
  else vista = <Menu est={est} onJugar={setAct} />;
  return (
    <>
      <header className="barra">
        <strong>🎈 Aprendo Jugando</strong>
        <span>
          {est && !docente && !act && <button className="btn chico" onClick={() => setEst(null)}>Cambiar de niño/a</button>}
          <button className="btn chico" onClick={() => { setDocente(d => !d); setAct(null); }}>{docente ? 'Volver a jugar' : 'Docentes'}</button>
        </span>
      </header>
      <main>{vista}</main>
    </>
  );
}
