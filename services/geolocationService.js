const connection = require('../connection');

const getNearbyServices = {
  findNearbyServices: (latitude, longitude, radius = 5, paqueteId) => {
    return new Promise((resolve, reject) => {
      // Aseguramos que la consulta se define dentro del bloque de la promesa
      const query = `
SELECT s.* 
FROM (
  SELECT id_hosteleria AS id, nom_hs AS nombre, descripcion_hs AS descripcion, 
         tipologia_hs AS tipologia, costo_hs AS costo, servicios, tipo_hs AS tipo,
         img_hs AS imagen, latitud, longitud, 'Hotel' AS origen
  FROM hosteleria
  UNION ALL
  SELECT id_atracTuris AS id, nom_actur AS nombre, descripcion_actur AS descripcion,
         tipologia_actur AS tipologia, costo_actur AS costo, servicios_actur AS servicios,
         tipo_actur AS tipo, NULL AS imagen, latitud, longitud, 'Atractivo Turístico' AS origen
  FROM atracturistico
) AS s
INNER JOIN paquete_servicio ps ON ps.id_servicio = s.id AND ps.tipo_servicio = s.origen
WHERE ps.id_paquete = 15
ORDER BY s.nombre;


      `;

      // Depuramos para verificar que la consulta se está ejecutando
      console.log('Executing query:', query);
      console.log('Parameters:', [latitude, longitude, latitude, paqueteId, radius]);

      // Ejecutamos la consulta
      connection.query(query, [latitude, longitude, latitude, paqueteId, radius], (error, results) => {
        if (error) {
          console.error('Error finding nearby services:', error);
          reject(error);
        } else {
          console.log('Results:', results);
          resolve(results);
        }
      });
    });
  }
};

module.exports = getNearbyServices;
