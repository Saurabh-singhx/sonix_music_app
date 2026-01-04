import express from 'express';
import { checkSignupValidation } from './validators/signup.validators.js';

import { protectRoute, validate } from '../../middleware/auth.middleware.js';
import { checkLoginValidation } from './validators/login.validators.js';
import passport from 'passport';
import { checkEmailValidation } from './validators/email.validators.js';
import { checkAuth, login, logout, otpSend, signup } from './auth.controller.js';
import { loginLimiter, otpLimiter, signupLimiter } from '../../middleware/ratelimit.js';


const router = express.Router();


// rate limiting is not added fix ----->--->

router.post("/otp",otpLimiter, checkEmailValidation,validate, otpSend);
router.post("/signup",signupLimiter, checkSignupValidation,validate,signup);
router.post("/login",loginLimiter, checkLoginValidation,validate,login);
router.post("/logout", logout);
// router.get("/google",passport.authenticate("google", { scope: ["profile", "email"],session: false }));
// router.get("/google/callback",passport.authenticate("google", { failureMessage: true, session: false }),googleAuth);
router.get("/checkauth",protectRoute,checkAuth);

export default router;