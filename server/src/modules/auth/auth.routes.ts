import express from 'express';
import { checkSignupValidation } from './validators/signup.validators.js';

import { protectRoute, validate } from '../../middleware/auth.middleware.js';
import { checkLoginValidation } from './validators/login.validators.js';
import passport from 'passport';
import { checkEmailValidation } from './validators/email.validators.js';
import { checkAuth, googleAuth, login, logout, otpSend, signup } from './auth.controller.js';
import { checkAuthLimiter, googleAuthLimiter, loginLimiter, logOutLimiter, otpLimiter, signupLimiter } from '../../middleware/ratelimit.js';
import { switchToAdmin } from '../admin/admin.controller.js';


const router = express.Router();


router.post("/otp",checkEmailValidation,validate,otpLimiter, otpSend);
router.post("/signup", checkSignupValidation,validate,signupLimiter,signup);
router.post("/login", checkLoginValidation,validate,loginLimiter,login);
router.post("/logout",logOutLimiter,protectRoute,logout);
router.get("/google",googleAuthLimiter, passport.authenticate("google", { scope: ["profile", "email"],session: false }));
router.get("/google/callback",passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/login`, session: false }),googleAuth);
router.get("/checkauth",checkAuthLimiter, protectRoute,checkAuth);
router.post("/change-admin",protectRoute,switchToAdmin);

export default router;