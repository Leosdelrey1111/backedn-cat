/* 
const db = require('../config/database'); // Asume que tienes una configuración de base de datos

class GeolocationService {
  getPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    });
  }

  async getCurrentLocation() {
    try {
      const position = await this.getPosition();
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      return { latitude, longitude };
    } catch (error) {
      console.error('Error getting location:', error);
      throw error;
    }
  }

  // Método para calcular la distancia entre dos puntos usando la fórmula de Haversine
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distancia en km
    return distance;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  async findNearbyServices(latitude, longitude, radius = 5) {
    const query = `
      SELECT *, 
        (6371 * acos(cos(radians(?)) * cos(radians(latitude)) 
        * cos(radians(longitude) - radians(?)) + sin(radians(?)) 
        * sin(radians(latitude)))) AS distance 
      FROM (
        SELECT * FROM Hosteleria
        UNION ALL
        SELECT * FROM AtractivosTuristicos
      ) AS services
      HAVING distance < ?
      ORDER BY distance
      LIMIT 0, 20;
    `;

    try {
      const [results] = await db.query(query, [latitude, longitude, latitude, radius]);
      return results;
    } catch (error) {
      console.error('Error finding nearby services:', error);
      throw error;
    }
  }
}

module.exports = new GeolocationService();
 */

// services/geolocationService.js

const db = require('../config/database'); // Asume que tienes una configuración de base de datos

class GeolocationService {
  async findNearbyServices(latitude, longitude, radius = 5) {
    const query = `
      SELECT *, 
        (6371 * acos(cos(radians(?)) * cos(radians(latitud)) 
        * cos(radians(longitud) - radians(?)) + sin(radians(?)) 
        * sin(radians(latitud)))) AS distance 
      FROM (
        SELECT id_hosteleria AS id, nom_hs AS nombre, descripcion_hs AS descripcion, 
               tipologia_hs AS tipologia, costo_hs AS costo, servicios, tipo_hs AS tipo,
               img_hs AS imagen, latitud, longitud, 'Hosteleria' AS origen
        FROM Hosteleria
        UNION ALL
        SELECT id_atracTuris AS id, nom_actur AS nombre, descripcion_actur AS descripcion,
               tipologia_actur AS tipologia, costo_actur AS costo, servicios_actur AS servicios,
               tipo_actur AS tipo, NULL AS imagen, latitud, longitud, 'AtracTuristico' AS origen
        FROM AtracTuristico
      ) AS services
      HAVING distance < ?
      ORDER BY distance
      LIMIT 0, 20;
    `;

    try {
      const [results] = await db.query(query, [latitude, longitude, latitude, radius]);
      return results;
    } catch (error) {
      console.error('Error finding nearby services:', error);
      throw error;
    }
  }
}

module.exports = new GeolocationService();