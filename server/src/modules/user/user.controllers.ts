import { Request, Response } from "express";
import prisma from "../../lib/prisma.js";
import { authUser } from "../../types/request/auth.js";
import { getFileUrl } from "../../services/s3.services.js";

export const getAllSongs = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const cursor = req.query.cursor as string | undefined;

    const songs = await prisma.song.findMany({
      take: limit + 1,
      ...(cursor && {
        skip: 1,
        cursor: { song_id: cursor },
      }),
      orderBy: {
        song_id: "asc",
      },
      select: {
        song_id: true,
        song_title: true,
        song_url: true,
        cover_image_url: true,
        release_date: true,
        artist: {
          select: {
            artist_id: true,
            artist_bio: true,
            artist_name: true,
            artist_profilePic: true,
          },
        },
      },
    });

    let nextCursor: string | null = null;

    if (songs.length > limit) {
      const nextItem = songs.pop();
      nextCursor = nextItem!.song_id;
    }

    const songsWithUrls = await Promise.all(
      songs.map(async (song) => {
        const songUrl = await getFileUrl(song.song_url);

        const coverUrl = song.cover_image_url
          ? await getFileUrl(song.cover_image_url)
          : null;

        const artistProfilePic = song.artist?.artist_profilePic
          ? await getFileUrl(song.artist.artist_profilePic)
          : null;

        return {
          ...song,
          song_url: songUrl,
          cover_image_url: coverUrl,
          artist: song.artist
            ? {
                ...song.artist,
                artist_profilePic: artistProfilePic,
              }
            : null,
        };
      })
    );

    return res.status(200).json({
      songs: songsWithUrls,
      nextCursor,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

