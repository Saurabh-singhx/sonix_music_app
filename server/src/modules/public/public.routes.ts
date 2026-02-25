import express from "express";
import {  getAllRecentSongs, getArtists, getTrendingSongs } from "../user/user.controllers.js";
import { guestCreateLimiter, publicLimiterAllRoutes } from "../../middleware/ratelimit.js";
import { createGuest } from "../auth/auth.controller.js";

const router = express.Router();

router.post("/ragister-guest",guestCreateLimiter,createGuest);
router.get("/getsongs",publicLimiterAllRoutes,getAllRecentSongs)
router.get("/trending-songs",publicLimiterAllRoutes,getTrendingSongs)
router.get("/getartists",publicLimiterAllRoutes,getArtists)

export default router;