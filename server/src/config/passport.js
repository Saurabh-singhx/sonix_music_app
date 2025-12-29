import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.ts";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:
                process.env.GOOGLE_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {

                let googleUser = await prisma.user.findUnique({
                    where: { google_id: profile.id },
                    select: {
                        user_id: true,
                    }
                });

                if (googleUser) {
                    return done(null, googleUser);
                }


                let user = await prisma.user.findUnique({
                    where: {
                        user_email: profile.emails[0].value,
                    },
                });

                if (!user) {
                    const randomPassword = Math.random().toString(36).slice(-8);
                    const hashedPassword = await bcrypt.hash(randomPassword, 10);


                    user = await prisma.user.create({
                        data: {
                            user_email: profile.emails[0].value,
                            user_name: profile.displayName || "Google User",
                            user_password: hashedPassword,
                            user_profile_pic: profile.photos?.[0]?.value || "",
                            google_id: profile.id,
                        },
                        select: {
                            user_id: true,
                        }
                    })
                }


                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

export default passport;
