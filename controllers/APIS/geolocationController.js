
const geolocationService = require('../../services/geolocationService.js');

exports.getCurrentLocation = async (req, res) => {
  try {
    const location = await geolocationService.getCurrentLocation();
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: 'Error getting current location' });
  }
};

exports.getDistanceToPoint = async (req, res) => {
  try {
    const { targetLat, targetLon } = req.query;
    const currentLocation = await geolocationService.getCurrentLocation();
    const distance = geolocationService.calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      parseFloat(targetLat),
      parseFloat(targetLon)
    );
    res.json({ distance: distance });
  } catch (error) {
    res.status(500).json({ error: 'Error calculating distance' });
  }

  exports.getNearbyServices = async (req, res) => {
    try {
      const { latitude, longitude, radius = 5 } = req.query;
      
      if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
      }
  
      const services = await geolocationService.findNearbyServices(
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(radius)
      );
      
      res.json(services);
    } catch (error) {
      console.error('Error in getNearbyServices:', error);
      res.status(500).json({ error: 'Error finding nearby services' });
    }
  };

};