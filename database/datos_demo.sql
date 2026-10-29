-- Datos de ejemplo para ver el tablero de docentes con información (ejecutar UNA sola vez)
USE aprendo_jugando;
INSERT INTO estudiantes (nombre, edad) VALUES ('Ana López',5),('Carlos Pérez',6),('María Gómez',8),('Luis Ramírez',9);
INSERT INTO progreso (estudiante_id, actividad_id, puntaje, total, fecha)
SELECT e.id, a.id, v.p, v.t, NOW() - INTERVAL v.d DAY
FROM (
  SELECT 'Ana López' n,'espacial' t_,40 p,50 t,3 d UNION ALL
  SELECT 'Ana López','figuras',50,50,2 UNION ALL
  SELECT 'Ana López','memoria',80,100,1 UNION ALL
  SELECT 'Carlos Pérez','espacial',30,50,3 UNION ALL
  SELECT 'Carlos Pérez','figuras',40,50,2 UNION ALL
  SELECT 'Carlos Pérez','memoria',60,100,0 UNION ALL
  SELECT 'María Gómez','tablas',40,50,4 UNION ALL
  SELECT 'María Gómez','quebrados',30,50,2 UNION ALL
  SELECT 'María Gómez','decimales',20,50,1 UNION ALL
  SELECT 'Luis Ramírez','tablas',50,50,3 UNION ALL
  SELECT 'Luis Ramírez','quebrados',40,50,1 UNION ALL
  SELECT 'Luis Ramírez','decimales',30,50,0
) v
JOIN estudiantes e ON e.nombre = v.n
JOIN actividades a ON a.tipo = v.t_;
