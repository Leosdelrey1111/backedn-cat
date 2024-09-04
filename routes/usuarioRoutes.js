const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const { isUsuario } = require('../middleware/usuarioMiddleware');

// Rutas para registro, confirmación de correo, login, perfil y recuperación de contraseña
router.post('/registro', userController.registerUser);
router.get('/confirm/:token', userController.confirmEmail); //se usa automáticamente
router.post('/login', userController.loginUser); 
router.post('/request-password-reset', userController.requestPasswordReset);
router.post('/reset-password', userController.resetPassword);

//para capturar en el formulario 
router.get('/agencias', userController.getAllAgencias);
router.get('/hoteles', userController.getAllHoteles);
router.get('/restaurantes', userController.getAllRestaurantes);
router.get('/experiencias', userController.getAllAtracTuristico);

//manda la consulta
router.post('/consulta', authMiddleware.verifyToken, userController.mandarConsulta)


router.get('/profile', authMiddleware.verifyToken, userController.getProfile); //los datos del usuario los obtiene

// Obtiene los paquetes del turista
router.get('/mispaquetes', authMiddleware.verifyToken, isUsuario, userController.getMisPaquetesCompletos);

module.exports = router;

// id_consulta int AI PK 
// llegada_cons date 
// salida_cons date 
// adults_18_36 int 
// adults_37_64 int 
// ninos_0_8 int 
// ninos_9_8 int 
// travel_with varchar(200) 
// budget varchar(200) 
// actividades varchar(255) 
// lugar_deseado varchar(255) 
// hotel varchar(255) 
// Restaurante varchar(255) 
// Experiencia varchar(255) 
// id_agencia int 
// id_usr int
