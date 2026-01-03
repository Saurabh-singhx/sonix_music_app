import jwt from "jsonwebtoken";
import { Response } from "express";
import { JwtPayload } from "jsonwebtoken";

interface AuthPayload extends JwtPayload {
  userId: string;
}

export const generateToken = (userId: string, res: Response): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env");
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.cookie("jwtauth", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
