// routes/apis/weatherRoutes.js
const express = require('express');
const router = express.Router();
const { getForecastData } = require('../../controllers/apis/openWeatherController');

router.get('/forecast', getForecastData);

module.exports = router;