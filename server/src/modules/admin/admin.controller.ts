import prisma from "../../lib/prisma.js";
import { Request, Response } from "express";
import { createImageUploadUrl, createUploadUrl } from "../../services/s3.services.js";
import { authUser } from "../../types/request/auth.js";
import { artistBody, getSongUploadUrlBody, getUserProfileImgUploadUrl } from "../../types/request/admin.types.js";
import { songBody } from "../../types/request/song.types.js";

// export const switchToAdmin = async (req : Request< {},{},{secret_key:string}>, res : Response) => {

//     const { secret_key }  = req.body;
//     const email = req.user.user_email;
//     try {
//         if (!secret_key) {
//             return res.status(400).json({ message: "fill all feilds" })
//         }

//         const stored_key = process.env.ADMIN_SECRET_KEY;

//         if (stored_key !== secret_key) {
//             return res.status(400).json({ message: "invalid key" });
//         }

//         const newUser = await prisma.user.update({
//             where: {
//                 user_email: email
//             },
//             data: {
//                 role: "ADMIN",
//             },

//             select: {
//                 user_id: true,
//                 user_email: true,
//                 user_name: true,
//                 user_profile_pic: true,
//                 gender: true,
//                 date_of_birth: true,
//                 role: true
//             }
//         })

//         return res.status(200).json({ message: "successfull" ,newUser})
//     } catch (error) {
//         console.log("error in signup controller", error.message);
//         return res.status(500).json({ message: "Internal server error" })
//     }
// }

// export const uploadSong = (req: Request, res: Response) => {

//     const user = req.user;

//     try {
//         return res.status(200).json({ message: "everything ok ", user })
//     } catch (error) {
//         const err = error as Error;
//         console.log("error in signup controller", err.message);
//         return res.status(500).json({ message: "Internal server error" })
//     }
// }


export const getUploadUrl = async (req: Request<{}, {}, getSongUploadUrlBody>, res: Response) => {
    const { fileName, fileType, fileSize } = req.body;


    const user = req.user as authUser;


    try {

        if (!fileName || !fileSize || !fileType) {
            return res.status(400).json({ message: "all field required" });
        }
        if (!fileType.startsWith('audio/')) {
            return res.status(400).json({ message: "Invalid file type" });
        }

        if (fileSize > 20 * 1024 * 1024) {
            return res.status(400).json({ message: "File too large" });
        }

        if (!user.user_id) {
            return res.status(400).json({ message: "userId not found" });
        }

        const userId = user.user_id;

        const result = await createUploadUrl(
            userId,
            fileName,
            fileType
        );
        return res.status(200).json({ result });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }

}


export const addSongDetails = async (req: Request<{}, {}, songBody>, res: Response) => {
    const {
        song_title,
        song_url,
        artist_id,
        duration,
        genre,
        release_date,
        cover_image_url,
        tags,
        mood,
        energy_level,
        language
    } = req.body;

    try {


        const newTags = Array.isArray(tags)
            ? tags
            : typeof tags === "string"
                ? tags.split(',').map(t => t.trim()).filter(Boolean)
                : [];


        const artist = await prisma.artist.findUnique({
            where: {
                artist_id: artist_id
            },
            select: {
                artist_name: true
            }
        })

        if (!artist) {
            return res.status(400).json({ message: "artist not found" })
        }

        const releaseDate =
            release_date ? new Date(release_date):new Date(Date.now());

        const song = await prisma.song.create({
            data: {
                song_url,
                song_title,
                artist_name: artist.artist_name,
                artist_id,
                duration,
                genre,
                release_date: releaseDate,
                cover_image_url,
                tags: newTags,
            }
        });


        if (!song) {
            return res.status(400).json({ message: "error while creating song-profile" })
        }

        const songAI = await prisma.songAIProfile.create({
            data: {
                song_id: song.song_id,
                mood, energy_level,
                language, vibe_tags: newTags,
                updated_at: new Date()
            }
        });

        if (!songAI) {
            return res.status(400).json({ message: "error while creating song-ai-profile" })
        }

        return res.status(201).json({ message: "song details added", song, songAI })
    } catch (error) {
        const err = error as Error;
        console.log("error in addSongDetails controller", err.message);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const createArtist = async (req: Request<{}, {}, artistBody>, res: Response) => {

    const { artist_name, artist_bio } = req.body;

    try {

        if (!artist_name || !artist_bio) {
            return res.status(400).json({ message: "all fields are required" });
        }

        const artist = await prisma.artist.findUnique({
            where: { artist_name: artist_name }
        });

        if (artist) {
            return res.status(400).json({ message: "artist already exists" });
        }

        const newArtist = await prisma.artist.create({
            data: {
                artist_name: artist_name,
                artist_bio: artist_bio,
                isVerified: true
            },
            select: {
                artist_id: true,
                artist_bio: true,
                artist_profilePic: true,
                artist_name: true,
                isVerified: true
            }
        })

        if (!newArtist) {
            return res.status(400).json({ message: "error while creating newArtist" });
        }

        res.status(200).json({ message: "artist created", newArtist });


    } catch (error) {
        const err = error as Error;
        console.log("error in createArtist controller", err.message);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getArtistImageUploadUrl = async (req: Request<{}, {}, getUserProfileImgUploadUrl>, res: Response) => {

    // add validation ==----==>

    const { userId, imageType, fileType, fileSize } = req.body;

    try {

        if (!userId || !imageType || !fileType) {
            return res.status(400).json({ message: "all fields reqired" })
        }

        if (!fileType.startsWith('image/')) {
            return res.status(400).json({ message: "Invalid file type" });
        }

        if (fileSize > 20 * 1024 * 1024) {
            return res.status(400).json({ message: "File too large" });
        }
        const refId = userId;
        const result = await createImageUploadUrl(
            userId,
            imageType,
            fileType,
            refId
        );

        return res.status(201).json({ message: "url created", result })


    } catch (error) {
        const err = error as Error;
        console.log("error in getArtistImageUploadUrl controller", err.message);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const setImages3Key = async (req: Request<{}, {}, { userId: string, profilePic: string }>, res: Response) => {
    const { userId, profilePic } = req.body;

    try {
        if (!userId || !profilePic) {
            return res.status(400).json({ message: "all feilds required" });
        }

        const artist = await prisma.artist.findUnique({
            where: { artist_id: userId }
        });

        if (!artist) {
            return res.status(400).json({ message: "user not exists" });
        }

        const updatedArtist = await prisma.artist.update({
            where: { artist_id: userId },
            data: { artist_profilePic: profilePic },
            select: {
                artist_id: true,
                artist_bio: true,
                artist_name: true,
            }
        });

        if (!updatedArtist) {
            return res.status(200).json({ message: "error while updating artist", updatedArtist })
        }
        return res.status(200).json({ message: "artist pic updated", updatedArtist });

    } catch (error) {
        const err = error as Error;
        console.log("error in setImages3Key controller", err.message);
        return res.status(500).json({ message: "Internal server error" })
    }
}


export const getArtists = async (req: Request, res: Response) => {
    try {
        const artists = await prisma.artist.findMany({
            select: {
                artist_id: true,
                artist_name: true,
                artist_bio: true,
                artist_profilePic: true, //fix presigned url <<<<<<
                isVerified: true,
            }
        })
        return res.status(200).json({ artists });
    } catch (error) {
        const err = error as Error;
        console.log("error in getArtists controller", err.message);
        return res.status(500).json({ message: "Internal server error" })
    }
}