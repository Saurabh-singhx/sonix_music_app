import express from "express";
import { protectAdminRoute, protectRoute } from "../../middleware/auth.middleware.js";
import { uploadSong } from "./admin.controller.js";


const router = express.Router();


router.get("/a",protectAdminRoute,uploadSong);


export default router;