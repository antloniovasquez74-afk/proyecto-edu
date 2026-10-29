# Informe técnico – Aprendo Jugando
Proyecto de fin de curso · Desarrollo Web 2026

## 1. Descripción
Aplicación web interactiva de educación infantil. Los niños practican con juegos didácticos y sus resultados se guardan en una base de datos persistente; docentes y tutores consultan el rendimiento en un tablero filtrable.

## 2. Arquitectura (RNF-05)
```
┌──────────────────┐   HTTP + JSON (REST)   ┌──────────────────┐   SQL    ┌─────────┐
│ React + CSS      │ ─────────────────────▶ │ Express + Node   │ ───────▶ │  MySQL  │
│ (Vite, :5173)    │ ◀───────────────────── │ API REST (:4000) │ ◀─────── │         │
└──────────────────┘        CORS            └──────────────────┘ (mysql2)  └─────────┘
```
- **Frontend** y **backend** son proyectos independientes que sólo se comunican por la API.
- El frontend lee la URL de la API desde `config.js`, por lo que se puede apuntar a cualquier servidor sin recompilar.
- **Backend** (RNF-07): `routes/` define las rutas, `controllers/` contiene la lógica y `db.js` el acceso a datos.
- **Frontend** (RNF-07): un componente funcional por pantalla (`Registro`, `Menu`, `Juego`, `Memoria`, `Escena`, `Figura`, `Reporte`) y la lógica de preguntas aislada en `preguntas.js`.

## 3. Modelo de datos (RNF-04)
```
estudiantes (id PK, nombre, edad, creado_en)
     │ 1
     │
     ∞
progreso (id PK, estudiante_id FK, actividad_id FK, puntaje, total, fecha)
     ∞
     │
     │ 1
actividades (id PK, nombre, nivel, tipo UNIQUE, icono)
```
- `progreso.estudiante_id → estudiantes.id` y `progreso.actividad_id → actividades.id` son **FOREIGN KEY** con `ON DELETE CASCADE`.
- `CHECK (puntaje >= 0 AND total > 0 AND puntaje <= total)` evita datos incoherentes.
- Índice `idx_prog_fecha` y los índices automáticos de las FK aceleran el reporte (RNF-02).

## 4. API REST
| Método | Ruta | Cuerpo / parámetros | Respuesta |
|---|---|---|---|
| GET | /api/health | – | `{ok, db}` |
| GET | /api/actividades | – | Lista de actividades |
| GET | /api/estudiantes | – | Lista de estudiantes |
| POST | /api/estudiantes | `{nombre, edad(3-13)}` | 201 `{id,nombre,edad}` / 400 |
| POST | /api/progreso | `{estudiante_id, actividad_id, puntaje, total}` | 201 `{id}` / 400 / 404 |
| GET | /api/progreso | `?estudiante_id=ID` (opcional) | Historial con JOIN de estudiante y actividad |

Todas las consultas SQL usan parámetros (`?`), lo que evita inyección SQL. Los errores se devuelven siempre en JSON.

## 5. Matriz de requisitos
| Requisito | Dónde se cumple |
|---|---|
| **RF-01** Registro nombre y edad | `Registro.jsx` → `POST /api/estudiantes` |
| **RF-02** Interfaz de juego con operaciones y opciones dinámicas | `Juego.jsx`, `preguntas.js` (preguntas y opciones generadas al azar) |
| **RF-03** Evaluación visual inmediata | Botón verde/rojo + mensaje ✅/❌ en `Juego.jsx` y `Memoria.jsx` |
| **RF-04** Puntaje en tiempo real | Marcador “⭐ N puntos” (10 por acierto); memoria según intentos |
| **RF-05** Registro de progreso por HTTP POST | `api.guardarProgreso` → `POST /api/progreso` → tabla `progreso` |
| **RF-06** Reporte para docentes por HTTP GET | `Reporte.jsx` → `GET /api/progreso` |
| **RF-07** Catálogo desde MySQL | `Menu.jsx` → `GET /api/actividades` (tabla `actividades`) |
| **RF-08** Filtrado por estudiante | Selector en `Reporte.jsx` → `?estudiante_id=` |
| **RNF-01** Interfaz infantil | Fuente Baloo 2, botones ≥ 80 px, ilustraciones, lectura en voz alta (🔊), foco visible, `aria-label` |
| **RNF-02** < 500 ms | Consultas indexadas y con `LIMIT`; cabecera `X-Response-Time` (≈ 2–10 ms en pruebas locales) |
| **RNF-03** CORS | `cors()` con orígenes configurables en `server.js` (`CORS_ORIGIN`) |
| **RNF-04** Integridad referencial | FOREIGN KEY en `progreso` (ver `schema.sql`) |
| **RNF-05** Arquitectura desacoplada | Carpetas `frontend/` y `backend/` independientes; sólo comunican por API |
| **RNF-06** Portabilidad Node 18+ / MySQL 8+ | `engines: node>=18`; SQL estándar MySQL 8 |
| **RNF-07** Calidad de código | Componentes funcionales en React; rutas y controladores separados en Express |

### Contenidos pedagógicos (sección 4 del enunciado)
| Tema | Implementación |
|---|---|
| Adentro/Afuera, Arriba/Abajo, Cerca/Lejos, Encima/Debajo | `Escena.jsx` dibuja cada situación; en cada partida salen los 4 pares de conceptos |
| Círculo, Cuadrado, Triángulo, Rectángulo | `Figura.jsx` (SVG); modos “¿qué figura es?” y “toca el…” |
| Memoria: asociar pares | `Memoria.jsx`: 6 parejas relacionadas (🐶–🦴, 🐝–🍯…) |
| Tablas de multiplicar | `preguntas.js` → `tablas()` |
| Suma de quebrados | `quebrados()`: mismo y distinto denominador, sin opciones equivalentes |
| Multiplicación con decimales | `decimales()`: decimal × entero y decimal × decimal |

## 6. Pruebas realizadas
- **Generador de preguntas:** 75 000 preguntas generadas automáticamente; en todas la respuesta correcta está entre 4 opciones distintas y el resultado matemático es correcto.
- **API:** altas, validaciones (edad, puntaje), error 404 por llave foránea inexistente, filtro, protección ante parámetros maliciosos, preflight CORS y bloqueo de orígenes no permitidos.
- **Extremo a extremo:** la aplicación React completa contra la API y MySQL: registro → catálogo → las 6 actividades → guardado → tablero de docentes con filtro.

## 7. Publicación
Ver el apartado 6 del `README.md` (MySQL en la nube + backend Node + frontend estático con rutas relativas).
