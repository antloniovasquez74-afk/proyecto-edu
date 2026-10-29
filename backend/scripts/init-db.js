// Crea las tablas (y opcionalmente datos de demostración) usando las credenciales del .env.
// Útil en hostings de MySQL donde no hay consola `mysql` o no se permite CREATE DATABASE.
//   npm run db:init           -> tablas + catálogo de actividades
//   npm run db:init -- --demo -> además, estudiantes y resultados de ejemplo
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Quita CREATE DATABASE / USE: se usa la base indicada en DB_NAME
const limpiar = sql => sql.replace(/^\s*(CREATE DATABASE|USE)\b[^;]*;\s*$/gim, '');
const leer = f => limpiar(fs.readFileSync(path.join(__dirname, '..', '..', 'database', f), 'utf8'));

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'aprendo_jugando',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    multipleStatements: true
  });
  await conn.query(leer('schema.sql'));
  console.log('✔ Tablas y catálogo de actividades creados');
  if (process.argv.includes('--demo')) {
    await conn.query(leer('datos_demo.sql'));
    console.log('✔ Datos de demostración cargados');
  }
  await conn.end();
})().catch(e => { console.error('✘ Error:', e.message); process.exit(1); });
