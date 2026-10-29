const db = require('../db');

const wrap = f => (req, res) => f(req, res).catch(e => {
  if (e.code === 'ER_NO_REFERENCED_ROW_2')
    return res.status(404).json({ error: 'El estudiante o la actividad no existe' });
  console.error(e);
  res.status(500).json({ error: 'Error del servidor' });
});

exports.health = wrap(async (req, res) => {
  await db.query('SELECT 1');
  res.json({ ok: true, db: 'conectada' });
});

exports.actividades = wrap(async (req, res) => {           // RF-07
  const [rows] = await db.query('SELECT * FROM actividades ORDER BY nivel DESC, id');
  res.json(rows);
});

exports.estudiantes = wrap(async (req, res) => {
  const [rows] = await db.query('SELECT id, nombre, edad FROM estudiantes ORDER BY nombre');
  res.json(rows);
});

exports.crearEstudiante = wrap(async (req, res) => {       // RF-01
  const nombre = String((req.body || {}).nombre || '').trim().slice(0, 80);
  const edad = Number((req.body || {}).edad);
  if (!nombre || !Number.isInteger(edad) || edad < 3 || edad > 13)
    return res.status(400).json({ error: 'Escribe tu nombre y una edad entre 3 y 13' });
  const [r] = await db.query('INSERT INTO estudiantes (nombre, edad) VALUES (?,?)', [nombre, edad]);
  res.status(201).json({ id: r.insertId, nombre, edad });
});

exports.guardarProgreso = wrap(async (req, res) => {       // RF-05
  const { estudiante_id, actividad_id, puntaje, total } = req.body || {};
  const ints = [estudiante_id, actividad_id, puntaje, total];
  if (ints.some(v => !Number.isInteger(v)) || total <= 0 || puntaje < 0 || puntaje > total)
    return res.status(400).json({ error: 'Datos inválidos' });
  const [r] = await db.query(
    'INSERT INTO progreso (estudiante_id, actividad_id, puntaje, total) VALUES (?,?,?,?)',
    [estudiante_id, actividad_id, puntaje, total]);
  res.status(201).json({ id: r.insertId });
});

exports.reporte = wrap(async (req, res) => {               // RF-06 + RF-08
  const id = req.query.estudiante_id;
  if (id !== undefined && id !== '' && !/^\d+$/.test(id))
    return res.status(400).json({ error: 'estudiante_id inválido' });
  const filtrar = id !== undefined && id !== '';
  const sql = `SELECT p.id, e.nombre AS estudiante, e.edad, a.nombre AS actividad,
      p.puntaje, p.total, p.fecha
    FROM progreso p
    JOIN estudiantes e ON e.id = p.estudiante_id
    JOIN actividades a ON a.id = p.actividad_id
    ${filtrar ? 'WHERE e.id = ?' : ''}
    ORDER BY p.fecha DESC, p.id DESC LIMIT 500`;
  const [rows] = await db.query(sql, filtrar ? [Number(id)] : []);
  res.json(rows);
});
