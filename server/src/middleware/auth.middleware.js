import { validationResult } from "express-validator";
import jwt from "jsonwebtoken"
import prisma from "../lib/prisma.ts";

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = {};

    for (const err of errors.array()) {
      if (!formattedErrors[err.path]) {
        formattedErrors[err.path] = err.msg;
      }
    }

    return res.status(400).json({
      success: false,
      errors: formattedErrors,
    });
  }

  next();
};



export const protectRoute = async (req, res, next) => {

    try {

        const token = req.cookies.jwtauth;

        if (!token) {
            return res.status(401).json({ message: "Try loging in" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "unauthorize - Invalid Token" });
        }
        
        const user = await prisma.user.findUnique({
            where: {
                user_id: decoded.userId,
            },
            select: {
                user_id: true,
                user_email: true,
                user_name: true,
                user_profile_pic: true,
                gender: true,
                date_of_birth: true,
                role:true
            }

        })

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;

        next();
    } catch (error) {
        console.log("error in protectRoute",error.message);
        return res.status(500).json({ message: "User not found" });
    }
}