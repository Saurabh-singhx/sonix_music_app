import express from 'express';
import { checkSignupValidation } from './validators/signup.validators.js';

import { protectRoute, validate } from '../../middleware/auth.middleware.js';
import { checkLoginValidation } from './validators/login.validators.js';
import passport from 'passport';
import { checkEmailValidation } from './validators/email.validators.js';
import { checkAuth, googleAuth, login, otpSend, signup } from './auth.controller.js';
import { otpLimiter, signupLimiter } from '../../middleware/rateLimit.js';


const router = express.Router();
router.post("/otp", checkEmailValidation,validate,otpSend);
router.post("/signup", checkSignupValidation,validate,signup);
router.post("/login",checkLoginValidation,validate,login);
router.get("/google",passport.authenticate("google", { scope: ["profile", "email"],session: false }));
router.get("/google/callback",passport.authenticate("google", { failureMessage: true, session: false }),googleAuth);
router.get("/checkauth",protectRoute,checkAuth);

export default router;