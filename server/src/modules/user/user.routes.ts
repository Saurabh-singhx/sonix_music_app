import express from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import { getAllPlaylist, getAllSongs, getMyPlaylists, getPlaylistsSongs, getPublicPlaylists } from "./user.controllers.js";
import { createArtist } from "../admin/admin.controller.js";

const router = express.Router();

// add rate limit and validations ==----==>

router.get("/songs",protectRoute,getAllSongs);

// playlists routes ==----==>

router.post("createplaylist",protectRoute,createArtist);
router.get("/getmyplaylists",protectRoute,getMyPlaylists);
router.get("/getpublicplaylists",protectRoute,getPublicPlaylists);
router.get("/getallplaylists",protectRoute,getAllPlaylist)
router.get("/getplaylistsongs/:playlistId",protectRoute,getPlaylistsSongs)


export default router;