import express from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import { switchToAdmin } from "./admin.controller.js";

const router = express.Router();


router.put("/switch",protectRoute,switchToAdmin);

export default router;