import express from "express";
import { protectRoute, validate } from "../../middleware/auth.middleware.js";
import { getAllPlaylist, getAllRecentSongs, getArtists, getArtistsSongs, getMyPlaylists, getPlaylistsSongs, getPublicPlaylists, getRecommendedSongs, getTrendingSongs } from "./user.controllers.js";
import { createArtist } from "../admin/admin.controller.js";
import { createPlaylistValidator, getPlaylistsSongsValidator } from "./validations/user.validators.js";
import { createplaylistLimiter, getallplaylistsLimiter, getAllRecentSongsLimiter, getartistsByUserLimiter, getArtistsSongsByUserLimiter, getmyplaylistsLimiter, getplaylistsongsLimiter, getpublicplaylistsLimiter, getRecommendedSongsLimiter, getTrendingSongsLimiter } from "../../middleware/ratelimit.js";

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

// playlists routes ==----==>
router.post("createplaylist",
    createPlaylistValidator,validate,
    createplaylistLimiter,
    protectRoute,
    createArtist
);
router.get("/getmyplaylists",
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
    getPlaylistsSongs
);

// artist details routes ==----==>
router.get("/getartist",
    getartistsByUserLimiter,
    protectRoute,
    getArtists
);
router.get("/artistsongs",
    getArtistsSongsByUserLimiter,
    protectRoute,
    getArtistsSongs
);


export default router;