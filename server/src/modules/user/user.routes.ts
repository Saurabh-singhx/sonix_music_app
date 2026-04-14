import express from "express";
import { protectRoute, validate } from "../../middleware/auth.middleware.js";
import { createPlaylist, getAllPlaylist, getAllRecentSongs, getArtists, getArtistsSongs, getMyPlaylists, getPlaylistSongs, getPublicPlaylists, getRecommendedSongs, getTrendingSongs, likeSong, updateSongEvent } from "./user.controllers.js";
import { createPlaylistValidator, getPlaylistsSongsValidator, validateSongEvent } from "./validations/user.validators.js";
import { createplaylistLimiter, getallplaylistsLimiter, getAllRecentSongsLimiter, getartistsByUserLimiter, getArtistsSongsByUserLimiter, getmyplaylistsLimiter, getplaylistsongsLimiter, getpublicplaylistsLimiter, getRecommendedSongsLimiter, getTrendingSongsLimiter, likedSongLimiter, updateSongEventLimiter } from "../../middleware/ratelimit.js";

const router = express.Router();

// add rate limit and validations ==----==>
router.get("/recent-songs",
    getAllRecentSongsLimiter,
    protectRoute,
    getAllRecentSongs
);
router.get("/recommended-songs",
    getRecommendedSongsLimiter,
    protectRoute,
    getRecommendedSongs
);
router.get("/trending-songs",
    getTrendingSongsLimiter,
    protectRoute,
    getTrendingSongs
);

router.post("/song-event",
    validateSongEvent,validate,
    updateSongEventLimiter,
    protectRoute,
    updateSongEvent
)

// playlists routes ==----==>
router.post("/create-playlist",
    createPlaylistValidator,validate,
    createplaylistLimiter,
    protectRoute,
    createPlaylist
);
router.get("/getmy-playlists",
    getmyplaylistsLimiter,
    protectRoute,
    getMyPlaylists
);
router.get("/getpublicplaylists",
    getpublicplaylistsLimiter,
    protectRoute,
    getPublicPlaylists
);
router.get("/getallplaylists",
    getallplaylistsLimiter,
    protectRoute,
    getAllPlaylist
);
router.get("/getplaylistsongs/:playlistId",
    getPlaylistsSongsValidator,validate,
    getplaylistsongsLimiter,
    protectRoute,
    getPlaylistSongs
);

// artist details routes ==----==>
router.get("/getartists",
    getartistsByUserLimiter,
    protectRoute,
    getArtists
);
router.get("/artistongs/:artistId",
    getArtistsSongsByUserLimiter,
    protectRoute,
    getArtistsSongs
);

router.post("/like-song/:songId",
    likedSongLimiter,
    protectRoute,
    likeSong
)


export default router;