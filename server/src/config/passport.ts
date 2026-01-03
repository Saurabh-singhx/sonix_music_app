import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";


type Done = (error: any, user?: Express.User | false, info?: any) => void;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: Done
    ) => {
      try {
        // Check if Google user exists
        let googleUser = await prisma.user.findUnique({
          where: { google_id: profile.id },
          select: { user_id: true },
        });

        if (googleUser) return done(null, googleUser);
        const email = profile.emails?.[0]?.value;
        if (!email) throw new Error(String("no email in google"));

        // Check if email already exists
        let user = await prisma.user.findUnique({
          where: { user_email: email },
          select: { user_id: true },
        });

        if (!user) {
          const randomPassword = Math.random().toString(36).slice(-8);
          const hashedPassword = await bcrypt.hash(randomPassword, 10);

          user = await prisma.user.create({
            data: {
              user_email: email || "",
              user_name: profile.displayName || "Google User",
              user_password: hashedPassword,
              user_profile_pic: profile.photos?.[0]?.value || "",
              google_id: profile.id,
            },
            select: { user_id: true },
          });
        }

        return done(null, user);
      } catch (err) {
        if (err instanceof Error) {
          return done(err);
        }
        return done(new Error("Unknown Google auth error"));
      }

    }
  )
);

export default passport;
