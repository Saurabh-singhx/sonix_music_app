
import express, { Application } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import prisma from "./lib/prisma.js";
import authRoutes from "./modules/auth/auth.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import userRoutes from "./modules/user/user.routes.js"
import redisClient from "./config/redis.js";
import publicRoutes from "./modules/public/public.routes.js"
import healthCheckRoute from "./modules/health/health.routes.js"
// import "./cron/updateTrending.js"
// import "./cron/updateRecommendations.cron.js"

import "./config/passport.js"
import { Server } from "http";

const app: Application = express();

const PORT: number = Number(process.env.PORT) || 4000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());
app.set('trust proxy', 1);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/public",publicRoutes);
app.use(healthCheckRoute);


const startServer = async (): Promise<void> => {
  let server: Server;

  try {
    await prisma.$connect();
    console.log("✅ Prisma connected");

    server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    const shutdown = async (): Promise<void> => {
      console.log("🛑 Shutting down server...");

      if (redisClient.isOpen) {
        await redisClient.quit();
        console.log("✅ Redis disconnected");
      }

      await prisma.$disconnect();
      server.close(() => process.exit(0));
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error: unknown) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
