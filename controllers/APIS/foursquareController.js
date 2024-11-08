const https = require('https');

const foursquareController = {
  buscarLugar: async (req, res) => {
    try {
      const options = {
        method: 'GET',
        hostname: 'api.foursquare.com',
        path: '/v3/places/search?ll=21.1561,-100.9319&query=restaurante&radius=5000&limit=50',
        headers: {
          accept: 'application/json',
          Authorization: 'fsq3zsmuEF2kL8pvUzYa06wskpwll/v+kKhij0vB0vS4N54='
        }
      };

      const request = https.request(options, (response) => {
        const chunks = [];

        response.on('data', (chunk) => {
          chunks.push(chunk);
        });

        response.on('end', async () => {
          const body = Buffer.concat(chunks).toString();
          const data = JSON.parse(body);

          if (data && data.results && data.results.length > 0) {
            for (let place of data.results) {
              const photos = await getPhotos(place.fsq_id);
              place.photos = photos; // Agregar las fotos al objeto del lugar
            }
            res.status(200).json({
              success: true,
              message: 'Lugares encontrados en Dolores Hidalgo',
              data: data.results
            });
          } else {
            res.status(404).json({
              success: false,
              message: 'No se encontraron lugares'
            });
          }
        });
      });

      request.on('error', (error) => {
        console.error('Error en la solicitud a Foursquare:', error);
        res.status(500).json({
          success: false,
          message: 'Error al realizar la búsqueda en Foursquare',
          error: error.message
        });
      });

      request.end();
    } catch (error) {
      console.error('Error en el controlador de búsqueda:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
};

// Función para obtener las fotos de un lugar dado su fsq_id
const getPhotos = (fsq_id) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      hostname: 'api.foursquare.com',
      path: `/v3/places/${fsq_id}/photos`,
      headers: {
        accept: 'application/json',
        Authorization: 'fsq3zsmuEF2kL8pvUzYa06wskpwll/v+kKhij0vB0vS4N54='
      }
    };

    const request = https.request(options, (response) => {
      const chunks = [];

      response.on('data', (chunk) => {
        chunks.push(chunk);
      });

      response.on('end', () => {
        const body = Buffer.concat(chunks).toString();
        const data = JSON.parse(body);

        if (data && data.length > 0) {
          // Construimos las URLs de las fotos correctamente
          const photos = data.map(photo => {
            return `${photo.prefix}original${photo.suffix}`;
          });
          resolve(photos);
        } else {
          resolve([]); // No hay fotos disponibles
        }
      });
    });

    request.on('error', (error) => {
      console.error('Error en la solicitud a Foursquare para fotos:', error);
      reject(error);
    });

    request.end();
  });
};

module.exports = foursquareController;
