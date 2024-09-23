const express = require('express');
const router = express.Router();

const geolocationController = require('../../controllers/Apis/geolocationController');

router.post('/servicios-cercanos', geolocationController.getNearbyServices);

module.exports = router;