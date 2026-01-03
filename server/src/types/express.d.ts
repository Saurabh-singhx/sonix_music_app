import { User as PrismaUser } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: Pick<PrismaUser, "user_id" | "role">;
      cookies: {
        jwtauth?: string;
      };
    }
  }
}

export {};
