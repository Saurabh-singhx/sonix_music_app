import {rateLimit} from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "../config/redis.js";

/**
 * LOGIN rate limit
 * 5 attempts / 15 minutes
 */
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: "rl:login:", 
  }),
    message: {
        message: "Too many login attempts. Try again later.",
    },
});

/**
 * SIGNUP rate limit
 * 10 requests / 1 hour
 */
export const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10, 
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: "rl:signup:", 
  }),
    message: {
        message: "Too many signup attempts. Try again later.",
    },
});

// otp rate limit  5 request / 10 minutes

export const otpLimiter = rateLimit({
  windowMs:10 * 60 * 1000,
  max:5,
  standardHeaders:true,
  legacyHeaders:false,
  store: new RedisStore({
    sendCommand :(...args) => redisClient.sendCommand(args),
    prefix: "rl:otp",
  }),
  message:{
    message:"Too many attempts. "
  }
});


