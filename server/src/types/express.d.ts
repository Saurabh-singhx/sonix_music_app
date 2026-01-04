import { User as PrismaUser } from "@prisma/client";
import { authUser } from "./request/auth.ts";

declare global {
  namespace Express {
    interface Request {
      user:authUser,
      cookies: {
        jwtauth?: string;
      };
    }
  }
}
