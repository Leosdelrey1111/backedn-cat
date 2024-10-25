// controllers/apis/spotifyController.js
const spotifyService = require('../../services/spotifyService');

const spotifyController = {
    async getArtistTracks(req, res) {
        try {
            // Usamos getTopTracks en lugar de getArtistTracks
            const tracks = await spotifyService.getTopTracks();
            res.json({ 
                success: true, 
                data: tracks 
            });
        } catch (error) {
            console.error('Error en spotifyController:', error);
            res.status(500).json({ 
                success: false,
                error: 'Error al obtener las canciones del artista'
            });
        }
    },

    // Añadimos un nuevo método para agregar canciones a la playlist
    async addToPlaylist(req, res) {
        try {
            const { userId, trackUri } = req.body;
            
            if (!userId || !trackUri) {
                return res.status(400).json({
                    success: false,
                    error: 'Se requiere userId y trackUri'
                });
            }

            const result = await spotifyService.addToPlaylist(userId, trackUri);
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Error al agregar a playlist:', error);
            res.status(500).json({
                success: false,
                error: 'Error al agregar la canción a la playlist'
            });
        }
    }
};

module.exports = spotifyController;