import { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../../generated/prisma/enums.js";
import { Request } from 'express';

// src/types/requests/auth.ts
export interface SignupBody {
  email: string;
  password: string;
  name: string;
  gender: string;
  otp: string;
  dob?: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface authUser {
    user_id:string;
    user_email: string;
    user_name: string;
    user_profile_pic: string;
    date_of_birth: Date | null;
    gender: string | null;
    role: UserRole;
}

export interface AuthPayload extends JwtPayload {
  userId: string;
}

export interface AuthenticatedRequest extends Request {
  user: authUser; 
}