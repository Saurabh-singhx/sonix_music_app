import { Request, Response } from "express";
import prisma from "../../lib/prisma.js";
import { authUser } from "../../types/request/auth.js";
import { getFileUrl } from "../../services/s3.services.js";
import { plalistDetails } from "../../types/request/user.types.js";

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
        duration: true,
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


export const createPlaylist = async (req: Request<{}, {}, plalistDetails>, res: Response) => {

  const { name, description, isPublic } = req.body;
  const user = req.user as authUser;

  try {

    if (!name || !description || !isPublic) {
      return res.status(400).json({ message: "all fields required" })
    }

    const checkPlaylist = await prisma.playlist.findUnique({
      where: {
        user_id_playlist_name: {
          user_id: user.user_id,
          playlist_name: name,
        },
      }
    })

    if (checkPlaylist) {
      return res.status(400).json({ message: `playlist named ${name} already exists` })
    }

    const newPlaylist = await prisma.playlist.create({
      data: {
        playlist_name: name,
        user_id: user.user_id,
        description: description,
        is_public: isPublic
      },
    });

    res.status(201).json({ message: "playlist created successfully", newPlaylist })

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const getMyPlaylists = async (req: Request, res: Response) => {

  const user = req.user as authUser;

  try {

    const playlists = await prisma.playlist.findMany({
      where: {
        user_id: user.user_id
      }
    });

    if (playlists.length === 0) {
      return res.status(200).json({ message: "no playlist found for this user" })
    }

    res.status(200).json({ message: "playlists fetched successfully", playlists })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const getPublicPlaylists = async (req: Request, res: Response) => {

  const user = req.user as authUser;

  try {
    const playlists = await prisma.playlist.findMany({
      where: {
        is_public: true,

        user_id: {
          not: user.user_id,
        },

      }
    })

    if (playlists.length === 0) {
      return res.status(200).json({ message: "no public playlist found" })
    }

    res.status(200).json({ message: "public playlists fetched successfully", playlists })

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const getAllPlaylist = async (req: Request, res: Response) => {

  const user = req.user as authUser;

  try {
    const playlists = await prisma.playlist.findMany({
      where: {
        OR: [
          { user_id: user.user_id },
          { is_public: true },
        ],
      }
    })

    if (playlists.length === 0) {
      return res.status(200).json({ message: "no public playlist found" })
    }

    res.status(200).json({ message: "public playlists fetched successfully", playlists })

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const getPlaylistsSongs = async (req: Request, res: Response) => {

  const { playlistId } = req.params;
  const user = req.user as authUser;
  try {

    if (!playlistId) {
      return res.status(400).json({ message: "all fields required" });
    }

    // check playlist + access
    const playlist = await prisma.playlist.findFirst({
      where: {
        playlist_id: playlistId,
        OR: [
          { is_public: true },
          { user_id: user.user_id },
        ],
      },
    });

    if (!playlist) {
      return res.status(404).json({
        message: "playlist not found or access denied",
      });
    }

    const playlistSongs = await prisma.playlistSong.findMany({
      where: {
        playlist_id: playlistId,
      },
      orderBy: {
        added_at: "asc"
      },
      select: {
        song: {
          select: {
            song_id: true,
            song_title: true,
            song_url: true,
            cover_image_url: true,
            release_date: true,
            duration: true,
            artist: {
              select: {
                artist_id: true,
                artist_bio: true,
                artist_name: true,
                artist_profilePic: true,
              },
            },
          },
        }
      }
    })

    res.status(200).json({ message: "playlist song fetched successfully", playlistSongs })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}