const connection = require('../connection');

const getNearbyServices = {
  findNearbyServices: (latitude, longitude, radius = 5, paquetesIds = []) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT s.*, 
          (6371 * acos(cos(radians(?)) * cos(radians(s.latitud)) 
          * cos(radians(s.longitud) - radians(?)) + sin(radians(?)) 
          * sin(radians(s.latitud)))) AS distance 
        FROM (
          SELECT id_hosteleria AS id, nom_hs AS nombre, descripcion_hs AS descripcion, 
                 tipologia_hs AS tipologia, costo_hs AS costo, servicios, tipo_hs AS tipo,
                 img_hs AS imagen, latitud, longitud, 'Hosteleria' AS origen
          FROM hosteleria
          UNION ALL
          SELECT id_atracTuris AS id, nom_actur AS nombre, descripcion_actur AS descripcion,
                 tipologia_actur AS tipologia, costo_actur AS costo, servicios_actur AS servicios,
                 tipo_actur AS tipo, NULL AS imagen, latitud, longitud, 'AtracTuristico' AS origen
          FROM atracturistico
        ) AS s
        INNER JOIN paquete_servicio ps ON ps.id_servicio = s.id AND ps.tipo_servicio = s.origen
        WHERE ps.id_paquete IN (?)
        HAVING distance < ?
        ORDER BY distance
        LIMIT 0, 20;
      `;

      connection.query(query, [latitude, longitude, latitude, paquetesIds, radius], (error, results) => {
        if (error) {
          console.error('Error finding nearby services:', error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
};

module.exports = getNearbyServices;
