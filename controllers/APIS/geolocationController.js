const GeolocationService = require('../../services/geolocationService.js');

const GeolocationController = {
  getNearbyServices: async (req, res) => {
    try {
      const { latitude, longitude, radius = 5 } = req.body;
      
      if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
      }

      const services = await GeolocationService.findNearbyServices(
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(radius)
      );
      
      res.json(services);
    } catch (error) {
      console.error('Error in getNearbyServices:', error);
      res.status(500).json({ error: 'Error finding nearby services' });
    }
  }
};

module.exports = GeolocationController;