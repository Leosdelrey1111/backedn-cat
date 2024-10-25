// services/spotifyService.js
const axios = require('axios');
require('dotenv').config();

class SpotifyService {
    constructor() {
        this.clientId = process.env.CLIENT_ID_A;
        this.clientSecret = process.env.CLIENT_SECRET_A;
        this.token = null;
        this.tokenExpirationTime = null;
    }

    async getAccessToken() {
        // Verificar si el token actual sigue siendo válido
        if (this.token && this.tokenExpirationTime > Date.now()) {
            return this.token;
        }

        try {
            const response = await axios({
                method: 'post',
                url: 'https://accounts.spotify.com/api/token',
                params: {
                    grant_type: 'client_credentials'
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')
                }
            });

            this.token = response.data.access_token;
            // Establecer tiempo de expiración (1 hora menos 5 minutos por seguridad)
            this.tokenExpirationTime = Date.now() + (response.data.expires_in - 300) * 1000;
            return this.token;
        } catch (error) {
            console.error('Error al obtener token de Spotify:', error);
            throw error;
        }
    }

    async getArtistInfo() {
        const artistId = '2T06whb4s6UiufL1j5Qtz9'; // José Alfredo Jiménez ID
        try {
            const token = await this.getAccessToken();
            const response = await axios.get(
                `https://api.spotify.com/v1/artists/${artistId}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            return {
                name: response.data.name,
                images: response.data.images,
                followers: response.data.followers.total,
                popularity: response.data.popularity,
                genres: response.data.genres
            };
        } catch (error) {
            console.error('Error al obtener información del artista:', error);
            throw error;
        }
    }

    async getTopTracks() {
        const artistId = '2T06whb4s6UiufL1j5Qtz9'; // José Alfredo Jiménez ID
        try {
            const token = await this.getAccessToken();
            const response = await axios.get(
                `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=MX`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            
            if (!response.data || !response.data.tracks) {
                throw new Error('No se encontraron tracks para el artista');
            }
    
            return response.data.tracks.slice(0, 10).map(track => ({
                id: track.id,
                name: track.name,
                duration_ms: track.duration_ms,
                preview_url: track.preview_url,
                external_url: track.external_urls.spotify,
                image: track.album.images[0]?.url,
                popularity: track.popularity,
                uri: track.uri // Importante para agregar a playlist
            }));
        } catch (error) {
            console.error('Error al obtener top tracks:', error);
            throw new Error(error.response?.data?.error?.message || 'Error al obtener las canciones del artista');
        }
    }

    async addToPlaylist(userId, trackUri) {
        try {
            const token = await this.getAccessToken();
            // Primero verificamos si ya existe una playlist para la aplicación
            let playlistId = await this.getOrCreatePlaylist(userId);
            
            await axios.post(
                `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
                {
                    uris: [trackUri]
                },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            
            return { success: true, message: 'Canción agregada a la playlist exitosamente' };
        } catch (error) {
            console.error('Error al agregar a playlist:', error);
            throw error;
        }
    }

    async getOrCreatePlaylist(userId) {
        try {
            const token = await this.getAccessToken();
            
            // Primero buscar si ya existe una playlist
            const playlistName = 'Mi Playlist de José Alfredo Jiménez';
            
            const response = await axios.get(
                `https://api.spotify.com/v1/users/${userId}/playlists`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
    
            const existingPlaylist = response.data.items.find(
                playlist => playlist.name === playlistName
            );
    
            if (existingPlaylist) {
                return existingPlaylist.id;
            }
    
            // Si no existe, crear una nueva playlist
            const createResponse = await axios.post(
                `https://api.spotify.com/v1/users/${userId}/playlists`,
                {
                    name: playlistName,
                    description: 'Playlist creada por la aplicación de Agencia de Viajes',
                    public: false
                },
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            return createResponse.data.id;
        } catch (error) {
            console.error('Error al obtener/crear playlist:', error);
            throw error;
        }
    }
}

module.exports = new SpotifyService();