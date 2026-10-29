require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// RNF-03: CORS explícito entre el puerto de React (5173) y Express (4000)
const origins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim().replace(/\/$/, '')).filter(Boolean)
  : true;
app.use(cors({
  origin: origins,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  exposedHeaders: ['X-Response-Time']
}));
app.use(express.json({ limit: '10kb' }));

// RNF-02: mide el tiempo de respuesta de cada consulta (cabecera X-Response-Time)
app.use((req, res, next) => {
  const t0 = process.hrtime.bigint();
  const writeHead = res.writeHead;
  res.writeHead = function (...args) {
    const ms = Number(process.hrtime.bigint() - t0) / 1e6;
    res.setHeader('X-Response-Time', ms.toFixed(1) + 'ms');
    return writeHead.apply(this, args);
  };
  next();
});

app.get('/', (req, res) => res.json({ ok: true, api: 'Aprendo Jugando' }));
app.use('/api', require('./routes'));

// 404 y errores (p. ej. JSON mal formado) siempre en formato JSON
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
app.use((err, req, res, next) => {          // eslint-disable-line no-unused-vars
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON inválido' });
  console.error(err);
  res.status(500).json({ error: 'Error del servidor' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('API lista en puerto', PORT));
