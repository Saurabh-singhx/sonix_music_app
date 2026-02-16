import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "../config/redis.js";
import {Request} from "express"
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

  // keyGenerator: (req:Request) => {
  //   const user = req.body?.email ?? "anon";
  //   return `${ipKeyGenerator(req.ip!)}:${user}`;
  // },
  keyGenerator:(req)=>{return ipKeyGenerator(req.ip!)},

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

  // keyGenerator: (req:Request) => {
  //   const ip = ipKeyGenerator(req.ip!);
  //   const user = req.body?.email ?? "anon";
  //   return `${ip}:${user}`;
  // },
  keyGenerator:(req)=>{return ipKeyGenerator(req.ip!)},

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

export const googleAuthLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator:(req)=>{return ipKeyGenerator(req.ip!)},

  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: "rl:googleAuth:",
  }),
  handler: (_req, res) => {
    res.status(429).json({
      message: "Too many requests. Try again after 1 hour."
    });
  },
});

// otp rate limit  5 request / 10 minutes

export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,

  // keyGenerator: (req:Request) => {
  //   const ip = ipKeyGenerator(req.ip!);
  //   const user = req.body?.email ?? "anon";
  //   return `${ip}:${user}`;
  // },
  keyGenerator:(req)=>{return ipKeyGenerator(req.ip!)},

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

  // keyGenerator: (req:Request) => {
  //   const ip = ipKeyGenerator(req.ip!);
  //   return ip;
  // },
  keyGenerator:(req)=>{return ipKeyGenerator(req.ip!)},

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

  // keyGenerator: (req:Request) => {
  //   const ip = ipKeyGenerator(req.ip!);
  //   return ip;
  // },
  keyGenerator:(req)=>{return ipKeyGenerator(req.ip!)},

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



// Admin rate limit form here ==----==>

export const getUploadSongUrlLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,

  // keyGenerator: (req:Request) => {
  //   const ip = ipKeyGenerator(req.ip!);
  //   return ip;
  // },
  keyGenerator:(req)=>{return ipKeyGenerator(req.ip!)},

  store: new RedisStore({
    prefix: "rl:getUploadSongUrl:",
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),

  handler: (_req, res) => {
    res.status(429).json({
      message: "Too many uploadsongurl requests. Try again later."
    });
  },
});

export const createArtistLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,

  // keyGenerator: (req:Request) => {
  //   const ip = ipKeyGenerator(req.ip!);
  //   return ip;
  // },
  keyGenerator:(req)=>{return ipKeyGenerator(req.ip!)},

  store: new RedisStore({
    prefix: "rl:createArtist:",
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),

  handler: (_req, res) => {
    res.status(429).json({
      message: "Too many create artist requests. Try again later."
    });
  },
});

export const getUploadImageUrlLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,

  // keyGenerator: (req:Request) => {
  //   const ip = ipKeyGenerator(req.ip!);
  //   return ip;
  // },
keyGenerator:(req)=>{return ipKeyGenerator(req.ip!)},

  store: new RedisStore({
    prefix: "rl:getUploadImageUrl:",
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),

  handler: (_req, res) => {
    res.status(429).json({
      message: "Too many uploadimageurl requests. Try again later."
    });
  },
});

export const updateImages3keyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,

  // keyGenerator: (req:Request) => {
  //   const ip = ipKeyGenerator(req.ip!);
  //   return ip;
  // },
  keyGenerator:(req)=>{return ipKeyGenerator(req.ip!)},

  store: new RedisStore({
    prefix: "rl:updateImages3key:",
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),

  handler: (_req, res) => {
    res.status(429).json({
      message: "Too many update image key requests. Try again later."
    });
  },

});

export const updateSongs3keyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,

//  keyGenerator: (req:Request) => {
//     const ip = ipKeyGenerator(req.ip!);
//     return ip;
//   },
keyGenerator:(req)=>{return ipKeyGenerator(req.ip!)},

  store: new RedisStore({
    prefix: "rl:updateSongs3key:",
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),

  handler: (_req, res) => {
    res.status(429).json({
      message: "Too many update song key requests. Try again later."
    });
  },

});

export const getArtistsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,

 keyGenerator:(req)=>{return ipKeyGenerator(req.ip!)},

  store: new RedisStore({
    prefix: "rl:getArtists:",
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),

  handler: (_req, res) => {
    res.status(429).json({
      message: "Too many update artists data requests. Try again later."
    });
  },

});

// public limiters ==----==>

export const publicLimiterAllRoutes = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 100, //fix here --------------------<<<
  standardHeaders: true,
  legacyHeaders: false,

 keyGenerator:(req)=>{return ipKeyGenerator(req.ip!)},

  store: new RedisStore({
    prefix: "rl:public:",
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),

  handler: (_req, res) => {
    res.status(429).json({
      message: "Too many requests. Try again after 24 hour."
    });
  },

});

export const guestCreateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 5, //fix here --------------------<<<
  standardHeaders: true,
  legacyHeaders: false,

 keyGenerator:(req)=>{return ipKeyGenerator(req.ip!)},

  store: new RedisStore({
    prefix: "rl:createguest:",
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),

  handler: (_req, res) => {
    res.status(429).json({
      message: "Too many requests. Try again after 24 hour."
    });
  },

});


//health check ==-----==>

export const healthCheckLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30, 
  standardHeaders: true,
  legacyHeaders: false,

 keyGenerator:(req)=>{return ipKeyGenerator(req.ip!)},

  store: new RedisStore({
    prefix: "rl:healthcheck:",
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),

  handler: (_req, res) => {
    res.status(429).json({
      message: "Too many requests. Try again after 1 minute."
    });
  },

});

//user rate limiter ==----==>

export const getAllRecentSongsLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,

 keyGenerator:(req)=>{return ipKeyGenerator(req.ip!)},

  store: new RedisStore({
    prefix: "rl:getAllRecentSongs:",
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),

  handler: (_req, res) => {
    res.status(429).json({
      message: "Too many requests. Try again after 5 minute."
    });
  },

});

export const getRecommendedSongsLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,

 keyGenerator:(req)=>{return ipKeyGenerator(req.ip!)},

  store: new RedisStore({
    prefix: "rl:getRecommendedSongs:",
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),

  handler: (_req, res) => {
    res.status(429).json({
      message: "Too many requests. Try again after 5 minute."
    });
  },

});

export const getTrendingSongsLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,

 keyGenerator:(req)=>{return ipKeyGenerator(req.ip!)},

  store: new RedisStore({
    prefix: "rl:getTrendingSongs:",
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),

  handler: (_req, res) => {
    res.status(429).json({
      message: "Too many requests. Try again after 5 minute."
    });
  },

});

export const createplaylistLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,

 keyGenerator:(req)=>{return ipKeyGenerator(req.ip!)},

  store: new RedisStore({
    prefix: "rl:createplaylist:",
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),

  handler: (_req, res) => {
    res.status(429).json({
      message: "Too many requests. Try again after 5 minute."
    });
  },

});

export const getmyplaylistsLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,

 keyGenerator:(req)=>{return ipKeyGenerator(req.ip!)},

  store: new RedisStore({
    prefix: "rl:getmyplaylists:",
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),

  handler: (_req, res) => {
    res.status(429).json({
      message: "Too many requests. Try again after 5 minute."
    });
  },

});

export const getpublicplaylistsLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,

 keyGenerator:(req)=>{return ipKeyGenerator(req.ip!)},

  store: new RedisStore({
    prefix: "rl:getpublicplaylists:",
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),

  handler: (_req, res) => {
    res.status(429).json({
      message: "Too many requests. Try again after 5 minute."
    });
  },

});

export const getallplaylistsLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,

 keyGenerator:(req)=>{return ipKeyGenerator(req.ip!)},

  store: new RedisStore({
    prefix: "rl:getallplaylists:",
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),

  handler: (_req, res) => {
    res.status(429).json({
      message: "Too many requests. Try again after 5 minute."
    });
  },

});

export const getplaylistsongsLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,

 keyGenerator:(req)=>{return ipKeyGenerator(req.ip!)},

  store: new RedisStore({
    prefix: "rl:getplaylistsongs:",
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),

  handler: (_req, res) => {
    res.status(429).json({
      message: "Too many requests. Try again after 5 minute."
    });
  },

});

export const getartistsByUserLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,

 keyGenerator:(req)=>{return ipKeyGenerator(req.ip!)},

  store: new RedisStore({
    prefix: "rl:getartistsByUser:",
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),

  handler: (_req, res) => {
    res.status(429).json({
      message: "Too many requests. Try again after 5 minute."
    });
  },

});

export const getArtistsSongsByUserLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,

 keyGenerator:(req)=>{return ipKeyGenerator(req.ip!)},

  store: new RedisStore({
    prefix: "rl:getArtistsSongsByUser:",
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),

  handler: (_req, res) => {
    res.status(429).json({
      message: "Too many requests. Try again after 5 minute."
    });
  },

});

export const updateSongEventLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,

 keyGenerator:(req)=>{return ipKeyGenerator(req.ip!)},

  store: new RedisStore({
    prefix: "rl:updateSongEvent:",
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),

  handler: (_req, res) => {
    res.status(429).json({
      message: "Too many requests..."
    });
  },

});

