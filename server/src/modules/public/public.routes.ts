import express from "express";
import { getAllSongs, getTrendingSongs } from "../user/user.controllers.js";
import { guestCreateLimiter, publicLimiterAllRoutes } from "../../middleware/ratelimit.js";
import { createGuest } from "../auth/auth.controller.js";

const router = express.Router();

router.post("/ragister-guest",guestCreateLimiter,createGuest);
router.get("/getsongs",publicLimiterAllRoutes,getAllSongs)
router.get("/trending-songs",publicLimiterAllRoutes,getTrendingSongs)

export default router;