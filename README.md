# 🎈 Aprendo Jugando – Proyecto fin de curso · Desarrollo Web 2026

Aplicación web educativa para niños de **pre primario y primario**.
**Frontend:** React + CSS (Vite) · **Backend:** Node.js + Express · **Base de datos:** MySQL · **Comunicación:** API REST + CORS.

## 1. Contenido de la entrega

```
proyecto-edu/
├── database/
│   ├── schema.sql          Tablas, llaves foráneas y catálogo de actividades
│   └── datos_demo.sql      (opcional) estudiantes y resultados de ejemplo
├── backend/                API REST (Express)
│   ├── server.js           CORS, JSON, medición de tiempos, errores
│   ├── routes/index.js     Rutas
│   ├── controllers/index.js  Lógica de cada endpoint + validaciones
│   ├── db.js               Pool de conexiones MySQL
│   ├── scripts/init-db.js  Crea tablas desde Node (útil en hostings)
│   └── .env.example
├── frontend/               Aplicación React
│   ├── src/components/     Registro, Menu, Juego, Memoria, Escena, Figura, Reporte
│   ├── src/preguntas.js    Generador de preguntas de cada actividad
│   ├── public/config.js    URL de la API (editable sin recompilar)
│   └── dist/               Versión ya compilada (rutas relativas) lista para subir
├── docs/INFORME.md         Informe técnico: arquitectura, modelo de datos, matriz de requisitos
└── render.yaml             (opcional) configuración para publicar el backend en Render
```

## 2. Requisitos
- **Node.js v18 o superior** (RNF-06) – https://nodejs.org
- **MySQL 8.0 o superior** (RNF-06) – cualquier servidor local (MySQL Server, XAMPP, WAMP, Docker…)

## 3. Instalación local (paso a paso)

### 3.1 Base de datos
Con la consola de MySQL:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/datos_demo.sql     # opcional: datos de ejemplo para ver el tablero
```
*(Si no tienes consola `mysql`, ve al punto 3.2 y usa `npm run db:init` después de crear una base vacía llamada `aprendo_jugando`.)*

### 3.2 Backend (terminal 1)
```bash
cd backend
cp .env.example .env          # en Windows: copy .env.example .env
# Edita .env con tu usuario/contraseña de MySQL
npm install
npm start                     # http://localhost:4000
```
Prueba rápida: abre http://localhost:4000/api/health → `{"ok":true,"db":"conectada"}`

Alternativa para crear las tablas desde Node (con la base ya creada y el `.env` listo):
`npm run db:init` (o `npm run db:init -- --demo` para incluir datos de ejemplo).

### 3.3 Frontend (terminal 2)
```bash
cd frontend
npm install
npm run dev                   # http://localhost:5173
```
Abre http://localhost:5173. La URL de la API está en `frontend/public/config.js` (por defecto `http://localhost:4000/api`).

## 4. Cómo se usa
1. El niño escribe **nombre y edad** (o elige su nombre si ya jugó antes).
2. Elige una actividad (el catálogo viene de MySQL).
3. Responde 5 preguntas; cada respuesta muestra **al instante** un mensaje visual (✅/❌) y suma **10 puntos** por acierto. El botón 🔊 lee la pregunta en voz alta.
4. Al terminar, el resultado se envía por **HTTP POST** y se guarda en MySQL.
5. El botón **Docentes** abre el tablero (HTTP GET) con el historial, promedio y **filtro por estudiante**.

### Actividades
| Nivel | Actividad | Contenido |
|---|---|---|
| Pre primario | Conocimientos espaciales | Adentro/Afuera, Arriba/Abajo, Cerca/Lejos, Encima/Debajo (con ilustraciones) |
| Pre primario | Figuras geométricas | Círculo, Cuadrado, Triángulo, Rectángulo |
| Pre primario | Juego de memoria | Asociar pares (animal–comida, sol–luna…) |
| Primario | Tablas de multiplicar | Tablas del 2 al 10 |
| Primario | Suma de quebrados | Mismo y distinto denominador |
| Primario | Multiplicación con decimales | Decimal × entero y decimal × decimal |

## 5. Endpoints de la API
| Método | Ruta | Descripción | RF |
|---|---|---|---|
| GET | `/api/health` | Estado del servidor y la BD | – |
| GET | `/api/actividades` | Catálogo de actividades | RF-07 |
| GET | `/api/estudiantes` | Lista de estudiantes | – |
| POST | `/api/estudiantes` | Registra `{nombre, edad}` | RF-01 |
| POST | `/api/progreso` | Guarda `{estudiante_id, actividad_id, puntaje, total}` | RF-05 |
| GET | `/api/progreso[?estudiante_id=ID]` | Historial (filtrable) | RF-06, RF-08 |

Cada respuesta incluye la cabecera `X-Response-Time` para comprobar el RNF-02 (< 500 ms).

## 6. Publicación en un webhosting (entrega: publicado el 03/11/2026)

La aplicación está desacoplada (RNF-05): se publican **3 piezas** gratuitas.

**① MySQL en la nube** (elige una): Aiven for MySQL, Railway, TiDB Cloud, FreeSQLDatabase…
Crea una base de datos y anota host, puerto, usuario, contraseña y nombre. Luego, desde tu PC, pon esos datos en `backend/.env` (con `DB_SSL=true` si el proveedor lo exige) y ejecuta:
```bash
cd backend && npm install && npm run db:init -- --demo
```

**② Backend Node.js** (Render, Railway, Koyeb…):
- Repositorio/carpeta raíz: `backend` · Build: `npm install` · Start: `npm start`
- Variables de entorno: `DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_SSL, CORS_ORIGIN`
- `CORS_ORIGIN` = URL del frontend publicado (ej. `https://mi-proyecto.netlify.app`, sin `/` final).
- Verifica abriendo `https://TU-API/api/health`.
- *(Render: también puedes usar el `render.yaml` incluido.)*

**③ Frontend estático** (Netlify, Vercel, GitHub Pages, Cloudflare Pages):
1. Edita `frontend/dist/config.js` y pon la URL de tu API: `window.APP_CONFIG = { API_URL: 'https://TU-API/api' };`
2. Sube la carpeta **`frontend/dist`** (en Netlify basta arrastrarla a https://app.netlify.com/drop).
   *(Si prefieres recompilar: edita `frontend/public/config.js` y ejecuta `npm run build`.)*

Todos los enlaces son **relativos** (`base: './'`), por lo que la carpeta `dist` funciona en cualquier ruta o servidor.

## 7. Solución de problemas
| Síntoma | Causa / solución |
|---|---|
| “No hay conexión con el servidor” | El backend no está corriendo o `API_URL` (config.js) es incorrecta. |
| Error CORS en la consola del navegador | `CORS_ORIGIN` del backend debe ser exactamente la URL del frontend (sin `/` final). |
| `ECONNREFUSED` / `Access denied` en el backend | Revisa las credenciales de MySQL en `backend/.env`. |
| `Unknown database 'aprendo_jugando'` | Ejecuta `database/schema.sql` o crea la base y corre `npm run db:init`. |
| El hosting de MySQL exige SSL | Pon `DB_SSL=true` en el `.env` del backend. |
