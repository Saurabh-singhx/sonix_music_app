import {rateLimit} from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "../config/redis.js";



// auth routes ==----==>
/**
 * LOGIN rate limit
 * 5 attempts / 15 minutes
 */
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,

    keyGenerator: (req) => `${req.body?.email ?? "unknown"}`,


    store: new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
      prefix: "rl:login:", 
    }),

    handler: (_req, res) => {
      res.status(429).json({
        message: "Too many login requests. Try again after 15 minutes."
      });
    }
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

    keyGenerator: (req) => `${req.body?.email ?? "unknown"}`,

    store: new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
      prefix: "rl:signup:", 
    }),
    handler: (_req, res) => {
    res.status(429).json({
      message: "Too many signup requests. Try again after 1 hour."
    });
  },
});

// otp rate limit  5 request / 10 minutes

export const otpLimiter = rateLimit({
  windowMs:10 * 60 * 1000,
  max:5,
  standardHeaders:true,
  legacyHeaders:false,
  
  keyGenerator: (req) => `${req.body?.email ?? "unknown"}`,

  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: "rl:otp",
  }),

  handler: (_req, res) => {
    res.status(429).json({
      message: "Too many otp requests. Try again after 10 minutes."
    });
  },
});


export const logOutLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,

  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => `${req.ip}`,

  store: new RedisStore({
    prefix: "rl:logout:",
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),

  handler: (_req, res) => {
    res.status(429).json({
      message: "Too many logout requests. Try again later."
    });
  },
});


export const checkAuthLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) =>
    `${req.ip}:${req.cookies?.jwtauth ?? "anon"}`,

  store: new RedisStore({
    prefix: "rl:checkAuth:",
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),

  handler: (_req, res) => {
    res.status(429).json({
      message: "Too many checkAuth attempts. Try again later."
    });
  },
});



