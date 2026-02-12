import express from "express";
import { healthCheckPublic } from "./health.controllers.js";
import { healthCheckLimiter } from "../../middleware/ratelimit.js";

const router = express.Router();

router.get("/health",healthCheckLimiter,healthCheckPublic)

export default router;