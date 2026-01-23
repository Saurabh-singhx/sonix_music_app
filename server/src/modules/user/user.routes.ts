import express from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import { getAllSongs } from "./user.controllers.js";

const router = express.Router();


router.get("/songs",protectRoute,getAllSongs);

export default router;