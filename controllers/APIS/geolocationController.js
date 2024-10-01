const GeolocationService = require('../../services/geolocationService.js');

const GeolocationController = {
  getNearbyServices: async (req, res) => {
    try {
      const { latitude, longitude, radius = 5, paqueteId } = req.body; // Asegúrate de que `paqueteId` se reciba bien

      // Depuración: Verificar que los parámetros estén llegando
      console.log('Request body:', req.body);

      if (!latitude || !longitude || !paqueteId) {
        return res.status(400).json({ error: 'Latitude, longitude, and paqueteId are required' });
      }

      // Depuración: Llamada al servicio con los parámetros
      console.log('Calling GeolocationService with:', {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radius: parseFloat(radius),
        paqueteId
      });

      const services = await GeolocationService.findNearbyServices(
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(radius),
        paqueteId
      );

      // Depuración: Ver resultados
      console.log('Nearby services:', services);

      res.json(services);
    } catch (error) {
      console.error('Error in getNearbyServices:', error);
      res.status(500).json({ error: 'Error finding nearby services' });
    }
  }
};

module.exports = GeolocationController;