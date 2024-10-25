// routes/apis/spotify.routes.js
const express = require('express');
const router = express.Router();
const spotifyController = require('../../controllers/apis/spotifyController');

router.get('/artist-tracks', spotifyController.getArtistTracks);
router.post('/add-to-playlist', spotifyController.addToPlaylist);

module.exports = router;