CREATE DATABASE IF NOT EXISTS aprendo_jugando CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE aprendo_jugando;

CREATE TABLE IF NOT EXISTS estudiantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  edad TINYINT UNSIGNED NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS actividades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  nivel ENUM('preprimario','primario') NOT NULL,
  tipo VARCHAR(30) NOT NULL UNIQUE,
  icono VARCHAR(10) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS progreso (
  id INT AUTO_INCREMENT PRIMARY KEY,
  estudiante_id INT NOT NULL,
  actividad_id INT NOT NULL,
  puntaje INT NOT NULL,
  total INT NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_prog_fecha (fecha),                       -- RNF-02: consultas rápidas del reporte
  CONSTRAINT fk_prog_est FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE,
  CONSTRAINT fk_prog_act FOREIGN KEY (actividad_id) REFERENCES actividades(id) ON DELETE CASCADE,
  CONSTRAINT ck_prog_puntaje CHECK (puntaje >= 0 AND total > 0 AND puntaje <= total)
) ENGINE=InnoDB;

INSERT IGNORE INTO actividades (nombre,nivel,tipo,icono) VALUES
('Conocimientos espaciales','preprimario','espacial','📍'),
('Figuras geométricas','preprimario','figuras','🔺'),
('Juego de memoria','preprimario','memoria','🧠'),
('Tablas de multiplicar','primario','tablas','✖️'),
('Suma de quebrados','primario','quebrados','🍕'),
('Multiplicación con decimales','primario','decimales','🔢');
