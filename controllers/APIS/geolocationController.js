const GeolocationService = require('../../services/geolocationService.js');

const GeolocationController = {
  getNearbyServices: async (req, res) => {
    try {
      const { latitude, longitude, radius = 5, paquetesIds } = req.body; // Incluimos los paquetesIds
      
      if (!latitude || !longitude || !paquetesIds || paquetesIds.length === 0) {
        return res.status(400).json({ error: 'Latitude, longitude, and paquetesIds are required' });
      }

      const services = await GeolocationService.findNearbyServices(
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(radius),
        paquetesIds // Pasamos los paquetesIds
      );
      
      res.json(services);
    } catch (error) {
      console.error('Error in getNearbyServices:', error);
      res.status(500).json({ error: 'Error finding nearby services' });
    }
  }
};

module.exports = GeolocationController;


module.exports = GeolocationController;