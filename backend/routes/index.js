const router = require('express').Router();
const c = require('../controllers');

router.get('/health', c.health);
router.get('/actividades', c.actividades);          // RF-07
router.get('/estudiantes', c.estudiantes);
router.post('/estudiantes', c.crearEstudiante);     // RF-01
router.post('/progreso', c.guardarProgreso);        // RF-05
router.get('/progreso', c.reporte);                 // RF-06 + RF-08

module.exports = router;
