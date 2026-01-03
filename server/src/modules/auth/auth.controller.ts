import { generateToken } from "../../lib/jwt.js";
import bcrypt from "bcrypt";
import prisma from "../../lib/prisma.js";
import redisClient from "../../config/redis.js";
import nodemailer from "nodemailer"
import { Request, Response } from "express";
import { LoginBody, SignupBody } from "../../types/request/auth.js";
import { StoredOtp } from "../../types/redis/otp.js";

export const signup = async (req: Request<{}, {}, SignupBody>, res: Response) => {

    const { email, password, dob, gender, name, otp } = req.body;

    try {
        if (!email || !password || !gender || !name || !otp) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        const normEmail = email.trim().toLowerCase();

        const ifUserExists = await prisma.user.findUnique({
            where: { user_email: normEmail },
        });

        if (ifUserExists) {
            res.status(409).json({ message: "User already exists" });
            return;
        }

        const key = `otp:${normEmail}`;
        const storedOtp = await redisClient.get(key);

        if (!storedOtp) {
            res.status(400).json({ message: "OTP expired or invalid" });
            return;
        }

        const parsedOtp: StoredOtp = JSON.parse(storedOtp);

        if (parsedOtp.attempts >= 5) {
            await redisClient.del(key);
            res.status(429).json({ message: "Too many OTP attempts" });
            return;
        }

        const isValid = await bcrypt.compare(otp, parsedOtp.otp);

        if (!isValid) {
            parsedOtp.attempts += 1;

            const ttl = await redisClient.ttl(key);
            if (ttl > 0) {
                await redisClient.set(key, JSON.stringify(parsedOtp), { EX: ttl });
            }

            res.status(400).json({ message: "Invalid OTP" });
            return;
        }

        await redisClient.del(key);

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                user_email: normEmail,
                user_name: name,
                user_password: hashedPassword,
                gender,
                date_of_birth: dob ? new Date(dob) : null,
            },
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

        generateToken(newUser.user_id, res);

        res.status(201).json({
            message: "User successfully created",
            userData: newUser,
        });
    } catch (error) {
        const err = error as Error;
        console.error("error in signup controller:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const otpSend = async (req: Request<{}, {}, { email: string }>, res: Response) => {


    const { email } = req.body;
    try {

        if (!email) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const normEmail = email.trim().toLowerCase();
        const ifUserExists = await prisma.user.findUnique({
            where: {
                user_email: normEmail,
            },
        });

        if (ifUserExists) {
            return res.status(409).json({ message: "User already exists" })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();


        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"SONIX" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "🔐 Your OTP Code - Secure Login",
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>👋 Hello!</h2>
                <p>You're almost there. Use the OTP below to complete your sign-up process.</p>
                <h3 style="color: #ff9900;">🔢 Your OTP: <strong>${otp}</strong></h3>
                <p>⏳ This otp is valid for <strong>50 seconds</strong>.</p>
                <p>If you didn't request this, please ignore this email. 🔒</p>
                <br/>
                <p>Cheers,<br/>The SONIX Team 💛</p>
                </div>`,
        };
        const hashedOtp = await bcrypt.hash(otp, 10);

        const user_otp_data = JSON.stringify({
            otp: hashedOtp,
            attempts: 0
        });
        const key = `otp:${normEmail}`;

        const existingOtp = await redisClient.get(key);
        if (existingOtp) {
            return res.status(429).json({
                message: "OTP already sent. Please wait before requesting again."
            });
        }

        await redisClient.set(key, user_otp_data, { EX: 50 });

        await transporter.sendMail(mailOptions);

        return res.status(201).json({ message: "otp sent successfully" })


    } catch (error) {
        const err = error as Error;
        console.log("error in sendOtp controller", err.message);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const login = async (req: Request<{}, {}, LoginBody>, res: Response) => {

    const { email, password } = req.body;


    try {

        if (!email || !password) {
            return res.status(400).json({ message: "all fields are required" });
        }
        const normEmail = email.trim().toLowerCase();
        const user = await prisma.user.findUnique({
            where: {
                user_email: normEmail,
            },
        })

        if (!user) {
            return res.status(404).json({ message: "invalid email or password" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.user_password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "invalid credentials" })
        }

        generateToken(user.user_id, res);

        return res.status(200).json({
            message: "logged in successfully", userData: {
                user_id: user.user_id,
                user_name: user.user_name,
                user_email: user.user_email,
                user_profile_pic: user.user_profile_pic,
                date_of_birth: user.date_of_birth,
                gender: user.gender,
                role: user.role
            }
        })
    } catch (error) {
        const err = error as Error;
        console.log("error in login controller", err.message);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        res.cookie("jwtAuth", "", { maxAge: 0 })

        return res.status(200).json({ message: "logged out successfully" })
    } catch (error) {
        const err = error as Error;
        console.log("error in logout controller", err.message);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const checkAuth = async (req: Request, res: Response) => {

    const user = req.user;
    try {

        res.status(200).json({
            userData: user
        })
    } catch (error) {
        const err = error as Error;
        console.log("error in checkAuth controller", err.message);
        return res.status(500).json({ message: "Internal server error" })
    }
}


export const googleAuth = async (req: Request, res: Response) => {

    const user= req.user;
  try {

    if (!req.user) {
      throw new Error("No user in request");
    }

    // generateToken(user.user_id, res);

    const redirectUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:5173"
        : "";

    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Error in Google signup", error);

    res.redirect(
      process.env.NODE_ENV === "development"
        ? "http://localhost:5173/login?error=oauth_failed"
        : ""
    );
  }
};

