const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const { isUsuario } = require('../middleware/usuarioMiddleware');
const multer = require('multer');
const upload = multer();

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

//valida facebook y regresa token
router.post('/insertarFace',userController.authFacebook);
router.post('/regisUpFace', userController.registerUserFacebook);

router.post('/enviarcorreo', upload.single('ticket'), userController.enviarTicket);


module.exports = router;
