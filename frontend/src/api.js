// Prioridad: public/config.js (runtime) > VITE_API_URL (build) > localhost
const URL = (window.APP_CONFIG && window.APP_CONFIG.API_URL)
  || import.meta.env.VITE_API_URL
  || 'http://localhost:4000/api';

const req = async (path, opts) => {
  let r;
  try { r = await fetch(URL + path, { headers: { 'Content-Type': 'application/json' }, ...opts }); }
  catch { throw new Error('No hay conexión con el servidor'); }
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || 'Error del servidor');
  return d;
};

export const api = {
  actividades: () => req('/actividades'),                                                   // RF-07
  estudiantes: () => req('/estudiantes'),
  crearEstudiante: b => req('/estudiantes', { method: 'POST', body: JSON.stringify(b) }),   // RF-01
  guardarProgreso: b => req('/progreso', { method: 'POST', body: JSON.stringify(b) }),      // RF-05
  reporte: id => req('/progreso' + (id ? `?estudiante_id=${id}` : ''))                      // RF-06 / RF-08
};
