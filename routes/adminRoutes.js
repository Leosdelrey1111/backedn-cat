const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

// Rutas para registro, confirmación de correo, login, perfil y recuperación de contraseña

router.get('/confirm', authMiddleware.verifyToken, adminMiddleware.isAdmin, (req, res) => {
    return res.status(200).json({ message: 'Permiso de admin' });
  });

//Crud de transportista
router.post('/transportista',adminController.createTransportista);
router.get('/transportistas',adminController.getAllTransportistas);
router.get('/transportista/:id_trans',adminController.getTransportistaById);
router.put('/transportista',adminController.updateTransportista);
router.delete('/transportista/:id_trans',adminController.deleteTransportista);


router.post('/guia',adminController.createGuia); //jala
router.get('/guias',adminController.getAllGuia); //jala
router.put('/guia',adminController.updateGuia);  //jala
router.get('/guia/:id_guia',adminController.getGuiaById); //jala
router.delete('/guia/:id_guia',adminController.deleteGuia); //jala

router.post('/hosteleria',adminController.createHosteleria); //jala
router.get('/hostelerias',adminController.getAllHosteleria); //jala
router.get('/hosteleria/:id_hosteleria',adminController.getHosteleriaById); //jala
router.put('/hosteleria',adminController.updateHosteleria); //jala
router.delete('/hosteleria/:id_hosteleria',adminController.deleteHosteleria); //Jala

router.post('/atractivo',adminController.createAtracTuristico); //jala
router.get('/atractivos',adminController.getAllAtracTuristico); //Jala
router.get('/atractivo/:id_atracTuris',adminController.getAtracTuristiconById); //Jala
router.put('/atractivo',adminController.updateAtracTuristico); //Jala
router.delete('/atractivo/:id_atracTuris',adminController.deleteAtracTuristico); //Jala

//Usuarios registrados
router.get('/usuario',adminController.getTodosUsuarios); //Marco
router.get('/usuario/:id_usr',adminController.getUsuarioById); //Este no se usa


// Rutas para el manejo de paquetes 
router.get('/paquete', verifyToken, adminController.getAllPaquetes);

router.get('/paquete/:id/completo', adminController.getPaqueteCompleto);
router.post('/paquete', verifyToken, adminController.createPaquete);
router.put('/paquete/:id', adminController.updatePaquete);
router.delete('/paquete/:id', adminController.deletePaquete);

// Para asignar el paquete al turista
router.post('/paquete/asignar-usuario', adminController.assignUserToPaquete);

router.get('/usuarios',adminController.getAllUsuarios);
router.get('/paquete/:id/usuarios-asignados', adminController.getUsuariosAsignados);

router.delete('/paquete/desasignar-paquete/:idPaquete/:idUsuario', adminController.desasignarUsuarioPaquete);

//Para observar las consultas realizadas por parte del usario
router.get('/consultas', verifyToken, isAdmin , adminController.getAllConsultas) 

//Para obtener paquetes de agencias
router.get('/agencia/paquetes-completos', adminController.getPaquetesCompletosByAgencia);

module.exports = router;