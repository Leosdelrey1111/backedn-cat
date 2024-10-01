const connection = require('../connection');

const getNearbyServices = {
  findNearbyServices: (latitude, longitude, radius = 5, paqueteId) => {
    return new Promise((resolve, reject) => {
      // Consulta para verificar los servicios en paquete_servicio
      const verificarPaqueteServicio = `
        SELECT * FROM paquete_servicio WHERE id_paquete = ?
      `;

      // Consulta principal
      const query = `
        SELECT s.*, ps.tipo_servicio as tipo_servicio_paquete 
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
        INNER JOIN paquete_servicio ps ON ps.id_servicio = s.id
        WHERE ps.id_paquete = ?
        ORDER BY s.nombre;
      `;

      console.log('Verificando paquete_servicio...');
      connection.query(verificarPaqueteServicio, [paqueteId], (error, paqueteServicioResults) => {
        if (error) {
          console.error('Error verificando paquete_servicio:', error);
          reject(error);
        } else {
          console.log('Resultados de paquete_servicio:', paqueteServicioResults);
          
          console.log('Ejecutando consulta principal...');
          connection.query(query, [paqueteId], (error, results) => {
            if (error) {
              console.error('Error encontrando servicios cercanos:', error);
              reject(error);
            } else {
              console.log('Resultados de la consulta principal:', results);
              
              // Comparar resultados
              console.log('Comparación de resultados:');
              paqueteServicioResults.forEach(ps => {
                const encontrado = results.find(r => r.id === ps.id_servicio && r.tipo_servicio_paquete === ps.tipo_servicio);
                console.log(`Servicio ${ps.id_servicio} (${ps.tipo_servicio}): ${encontrado ? 'Encontrado' : 'No encontrado'}`);
              });
              
              resolve(results);
            }
          });
        }
      });
    });
  }
};

module.exports = getNearbyServices;