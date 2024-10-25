// routes/apis/spotify.routes.js
const express = require('express');
const router = express.Router();
const spotifyController = require('../../controllers/apis/spotifyController');
const spotifyAuthService = require('../../services/spotifyAuthService');

// Rutas de autenticación
router.get('/auth/login', (req, res) => {
    const authUrl = spotifyAuthService.getAuthUrl();
    res.redirect(authUrl);
});

router.get('/auth/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const tokens = await spotifyAuthService.getAccessTokenFromCode(code);
        // Almacena los tokens o envíalos al frontend
        res.redirect(`${process.env.FRONTEND_URL}/success?access_token=${tokens.access_token}`);
    } catch (error) {
        console.error('Auth callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/error`);
    }
});

//Rutas principales de la API
router.get('/tracks', spotifyController.getArtistTracks);
router.post('/playlist/add', spotifyController.addToPlaylist);


// Nueva ruta para verificar el estado de autenticación
router.get('/auth/status', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ authenticated: false });
    }
    res.json({ authenticated: true });
});

module.exports = router;