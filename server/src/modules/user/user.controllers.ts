import { Request, Response } from "express";
import prisma from "../../lib/prisma.js";
import { authUser } from "../../types/request/auth.js";
import { getFileUrl } from "../../services/s3.services.js";
import { plalistDetails, userSongEventPayload } from "../../types/request/user.types.js";
import redisClient from "../../config/redis.js";
import { verifyAddRecommendationQueue } from "../../services/recommendation.services.js";

export const getAllRecentSongs = async (req: Request, res: Response) => {

  const user = req.user as authUser | undefined;
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
        song_id: "desc",
      },
      select: {
        song_id: true,
        song_title: true,
        song_url: true,
        cover_image_url: true,
        release_date: true,
        size: true,
        artist: {
          select: {
            artist_id: true,
            artist_bio: true,
            artist_name: true,
            artist_profilePic: true,
          },
        },
        ...(user && {
          likedByUsers: {
            where: {
              user_id: user.user_id
            },
            select: {
              user_id: true
            }
          }
        })
      },
    });

    let nextCursor: string | null = null;

    if (songs.length > limit) {
      const nextItem = songs.pop();
      nextCursor = nextItem!.song_id;
    }

    const fixedRecentAllSongs = songs.map(song => {
      const { likedByUsers, ...restSong } = song;

      return {
        ...restSong,
        isLiked: likedByUsers.length > 0
      };
    });

    const songsWithUrls = await Promise.all(
      fixedRecentAllSongs.map(async (song) => {
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

export const getRecommendedSongs = async (req: Request, res: Response) => {

  const limit = Number(req.query.limit) || 10;
  const cursor = req.query.cursor as string | undefined;

  const user = req.user as authUser;

  try {

    const recommendedSongs = await prisma.recommendation.findMany({
      where: {
        user_id: user.user_id,
      },
      take: limit + 1,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      orderBy: {
        score: "desc"
      },

      select: {
        id: true,
        score: true,
        song: {
          select: {
            song_id: true,
            song_title: true,
            song_url: true,
            cover_image_url: true,
            release_date: true,
            size: true,
            artist: {
              select: {
                artist_id: true,
                artist_bio: true,
                artist_name: true,
                artist_profilePic: true,
              },
            },
            likedByUsers: {
              where: {
                user_id: user.user_id
              },
              select: {
                user_id: true
              }
            }
          },
        }
      }

    });

    let nextCursor: string | null = null;

    if (recommendedSongs.length > limit) {
      const nextItem = recommendedSongs.pop();
      nextCursor = nextItem!.id;
    }

    const fixedRecommendedSongs = recommendedSongs.map(song => {
      const { likedByUsers = [], ...restSong } = song.song;

      return {
        ...song,
        song: {
          ...restSong,
          isLiked: likedByUsers.length > 0
        }
      };
    });

    const songsWithUrls = await Promise.all(
      fixedRecommendedSongs.map(async (item) => {
        const songUrl = await getFileUrl(item.song.song_url);

        const coverUrl = item.song.cover_image_url
          ? await getFileUrl(item.song.cover_image_url)
          : null;

        const artistProfilePic = item.song.artist?.artist_profilePic
          ? await getFileUrl(item.song.artist.artist_profilePic)
          : null;

        return {
          ...item,
          ...item.song,
          song_url: songUrl,
          cover_image_url: coverUrl,
          artist: item.song.artist
            ? {
              ...item.song.artist,
              artist_profilePic: artistProfilePic,
            }
            : null,

        };
      })
    );


    return res.status(200).json({
      recommendedSongs: songsWithUrls,
      nextCursor,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const getTrendingSongs = async (req: Request, res: Response) => {

  const user = req.user as authUser | undefined;
  try {
    const trendingSongs = await prisma.trendingSongs.findMany({
      take: 10,
      orderBy: {
        rank: "asc"
      },
      select: {
        rank: true,
        score: true,
        song: {
          select: {
            song_id: true,
            song_title: true,
            song_url: true,
            cover_image_url: true,
            release_date: true,
            size: true,
            artist: {
              select: {
                artist_id: true,
                artist_bio: true,
                artist_name: true,
                artist_profilePic: true,
              },
            },
            ...(user && {
              likedByUsers: {
                where: {
                  user_id: user.user_id
                },
                select: {
                  user_id: true
                }
              }
            })
          },
        }
      }

    });

    const fixedTrendingSongs = trendingSongs.map(song => {
      const { likedByUsers, ...restSong } = song.song;

      return {
        ...song,
        song: {
          ...restSong,
          isLiked: likedByUsers.length > 0
        }
      };
    });

    const songsWithUrls = await Promise.all(
      fixedTrendingSongs.map(async (item) => {
        const songUrl = await getFileUrl(item.song.song_url);

        const coverUrl = item.song.cover_image_url
          ? await getFileUrl(item.song.cover_image_url)
          : null;

        const artistProfilePic = item.song.artist?.artist_profilePic
          ? await getFileUrl(item.song.artist.artist_profilePic)
          : null;

        return {
          ...item,
          ...item.song,
          song_url: songUrl,
          cover_image_url: coverUrl,
          artist: item.song.artist
            ? {
              ...item.song.artist,
              artist_profilePic: artistProfilePic,
            }
            : null,

        };
      })
    );


    res.status(200).json({ message: "trending song fetched successfully", trendingSongs: songsWithUrls });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }

}

// user-playlists controllers ==----==>
export const createPlaylist = async (req: Request<{}, {}, plalistDetails>, res: Response) => {

  const { name, description, isPublic } = req.body;
  const user = req.user as authUser;

  try {

    if (!name || !description) {
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
      return res.status(409).json({ message: `playlist named ${name} already exists` })
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
            size: true,
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


// user-artists-controllers ==----==>
export const getArtists = async (req: Request, res: Response) => {

  try {

    const artist = await prisma.artist.findMany({
      take: 5,
      orderBy: {
        createdAt: "asc"
      },
      select: {
        artist_id: true,
        artist_bio: true,
        artist_name: true,
        artist_profilePic: true
      }
    })

    const artistWithProficUrl = await Promise.all(
      artist.map(async (a) => {

        let artistProfilePic = ""

        if (a.artist_profilePic) {
          const ImageUrl = await getFileUrl(a.artist_profilePic);
          if (ImageUrl !== undefined) {
            artistProfilePic = ImageUrl
          }
        }
        return {
          artist_id: a.artist_id,
          artist_bio: a.artist_bio,
          artist_name: a.artist_name,
          artist_profilePic: artistProfilePic
        }

      })
    )

    res.status(200).json({ message: "artists details fetched successfully", artists: artistWithProficUrl })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }

}


export const getArtistsSongs = async (req: Request, res: Response) => {


  // add pagination ==----==>

  const { artistId } = req.params;

  try {

    if (!artistId) {
      return res.status(400).json({ message: "all field required" });
    }

    const artist = await prisma.artist.findUnique({
      where: {
        artist_id: artistId
      }
    });


    if (!artist) {
      return res.status(404).json({ message: "Invalid artistId" })
    }

    const songs = await prisma.song.findMany({
      where: {
        artist_id: artistId
      },
      select: {
        song_id: true,
        song_title: true,
        song_url: true,
        cover_image_url: true,
        release_date: true,
        size: true,
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


    res.status(200).json({ message: "artist's songs fetched successfully" })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const updateSongEvent = async (req: Request<{}, {}, userSongEventPayload>, res: Response) => {

  const { songId, duration } = req.body;
  const user = req.user as authUser;

  const PlayedDuration = Math.floor(duration)
  try {


    const checkInRedis = await redisClient.get(`${user.user_id}:${songId}`);

    if (checkInRedis) {

      await prisma.userSongEvent.create({
        data: {
          song_id: songId,
          event_type: "REPEAT",
          user_id: user.user_id,
          play_duration: PlayedDuration
        }
      });
      await verifyAddRecommendationQueue(user.user_id)
      return res.sendStatus(204);
    }

    const song = await prisma.song.findUnique({
      where: {
        song_id: songId
      },
      select: {
        song_id: true
      }
    });

    if (!song?.song_id) {
      return res.status(400).json({ message: "song not found" })
    }

    if (PlayedDuration <= 20) {
      await prisma.userSongEvent.create({
        data: {
          song_id: songId,
          user_id: user.user_id,
          event_type: "SKIP",
          play_duration: PlayedDuration
        }
      })
    } else if (PlayedDuration >= 80) {

      await prisma.userSongEvent.create({
        data: {
          song_id: songId,
          event_type: "COMPLETE",
          user_id: user.user_id,
          play_duration: PlayedDuration
        }
      });
    } else {
      await prisma.userSongEvent.create({
        data: {
          song_id: song.song_id,
          user_id: user.user_id,
          event_type: "PLAY",
          play_duration: PlayedDuration
        }
      });
    }

    if (PlayedDuration > 20) {
      await verifyAddRecommendationQueue(user.user_id)
    }

    await redisClient.set(`${user.user_id}:${song.song_id}`, 1, { expiration: { type: "EX", value: 86400 } })

    res.sendStatus(204);
  } catch (error) {
    console.error("error in songeventtype", error)
    return res.sendStatus(500);
  }

}

export const likeSong = async (req: Request, res: Response) => {
  const { songId } = req.params;
  const user = req.user as authUser;
  try {

    if (!songId) {
      return res.status(400).json({ messsage: "songid not found" })
    }

    const isSongExists = await prisma.song.findUnique({
      where: {
        song_id: songId
      }
    });

    if (!isSongExists) {
      return res.status(400).json({ message: "song does not exits" })
    }
    const checkLiked = await prisma.likedSong.findUnique({
      where: {
        user_id_song_id: {
          user_id: user.user_id,
          song_id: songId
        }
      }
    });

    if (checkLiked) {
      return res.status(204).json({ message: "already liked" })
    }

    await prisma.likedSong.create({
      data: {
        song_id: songId,
        user_id: user.user_id
      }
    })

    verifyAddRecommendationQueue(user.user_id)

    return res.status(201).json({ message: "liked successfully" });
  } catch (error) {
    console.error("error in songeventtype", error)
    return res.status(500).json({ message: "Internal server error" });
  }
}