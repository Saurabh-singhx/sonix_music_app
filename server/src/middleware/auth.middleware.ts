import { FieldValidationError, validationResult } from "express-validator";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest, AuthPayload, authUser } from "../types/request/auth.js";

export const validate = (req: Request,res: Response,next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors: Record<string, string> = {};

    for (const err of errors.array()) {
      if ("path" in err) {
        const fieldError = err as FieldValidationError;

        if (!formattedErrors[fieldError.path]) {
          formattedErrors[fieldError.path] = fieldError.msg;
        }
      }
    }

    res.status(400).json({
      success: false,
      message: formattedErrors[0],
    });
    
    return;
  }

  next();
};

// fix it later checkAuth optimize ====>


export const protectRoute = async (req: Request,res: Response,next: NextFunction) => {

  try {
    const token : string = req.cookies?.jwtauth;

    if (!token) {
      res.status(401).json({ message: "Try logging in" });
      return;
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,{algorithms: ["HS256"],}
    ) as AuthPayload;

    if (!decoded.userId) {
      res.status(401).json({ message: "Unauthorized - Invalid Token" });
      return;
    }

    const user = await prisma.user.findUnique({

      where: { user_id: decoded.userId },
      select: {
        user_id: true,
        user_email: true,
        user_name: true,
        user_profile_pic: true,
        gender: true,
        date_of_birth: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    (req as AuthenticatedRequest).user = user;
    next();

  } catch (error) {

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }

    console.error("Admin auth error:", error);
    return res.status(500).json({ message: "Internal server error" });
  
  }
};


export const protectAdminRoute = async (req:Request,res : Response,next:NextFunction)=>{

  try {
    
    const token:string = req.cookies?.jwtauth;

    if (!token) {
      return res.status(401).json({ message: "no token provided" });
    }


    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }


    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as AuthPayload;

    if (!decoded.userId) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }


    const user = await prisma.user.findUnique({
      where: { user_id: decoded.userId },
      select: {
        user_id: true,
        user_email: true,
        user_name: true,
        user_profile_pic: true,
        gender: true,
        date_of_birth: true,
        role: true,
      },
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    (req as AuthenticatedRequest).user = user;
    next();

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }

    console.error("Admin auth error:", error);
    return res.status(500).json({ message: "Internal server error" });
  
  }
}