import { Request, Response } from "express";
import prisma from "../../lib/prisma.js";
import { authUser } from "../../types/request/auth.js";
import {createImageUploadUrl, getFileUrl } from "../../services/s3.services.js";
import { addPlaylistSongsBody, plalistDetails, updateMyProfileDetailsBody, userSongEventPayload } from "../../types/request/user.types.js";
import redisClient from "../../config/redis.js";
import { verifyAddRecommendationQueue } from "../../services/recommendation.services.js";
import { fixIsLikedInsong, fixIsLikedInsongSimple, songsWithUrl } from "../../helpers/user.helpers.js";
import { Prisma } from "../../generated/prisma/client.js";
import { getUserProfileImgUploadUrl } from "../../types/request/admin.types.js";

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

    const fixedAllRecentSongs = songs.map(song => {
      const { likedByUsers = [], ...restSong } = song;

      return {
        ...restSong,
        isLiked: likedByUsers.length > 0
      };
    });

    const allRecentSongsWithUrl = await songsWithUrl(fixedAllRecentSongs)

    return res.status(200).json({
      songs: allRecentSongsWithUrl,
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


    const fixedRecommendedSongs = fixIsLikedInsong(recommendedSongs)
    const recommendedSongsWithUrls = await songsWithUrl(fixedRecommendedSongs)


    return res.status(200).json({
      recommendedSongs: recommendedSongsWithUrls,
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

    const fixedTrendingSongs = fixIsLikedInsong(trendingSongs)

    const trendingSongsWithUrls = await songsWithUrl(fixedTrendingSongs)


    res.status(200).json({ message: "trending song fetched successfully", trendingSongs: trendingSongsWithUrls });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }

}

export const getMyProfileDetails = async (req: Request, res: Response) => {

  const user = req.user as authUser;
  try {

    const profileDetails = await prisma.user.findUnique({
      where: {
        user_id: user.user_id
      },
      select: {
        user_id: true,
        user_name: true,
        user_email: true,
        user_profile_pic: true,
        date_of_birth: true,
        gender: true,
        created_at: true,
        is_premium: true,
        _count: {
          select: {
            playlists: true,
            likedSongs: true,
          }
        }
      }
    });

    const playduration = await prisma.userSongEvent.aggregate({
      where: {
        user_id: user.user_id,
        event_type: {
          in: ["COMPLETE", "PLAY", "REPEAT"]
        },

      },
      _sum: {
        play_duration: true,
      }
    })

    let profileImageWithurl: string | undefined = "";
    if (profileDetails?.user_profile_pic) {
      profileImageWithurl = await getFileUrl(profileDetails?.user_profile_pic)
    }

    const fixedProfileDetails = {
      user_id: profileDetails?.user_id,
      user_name: profileDetails?.user_name,
      user_email: profileDetails?.user_email,
      user_profile_pic: profileImageWithurl,
      date_of_birth: profileDetails?.date_of_birth,
      gender: profileDetails?.gender,
      created_at: profileDetails?.created_at,
      totalPlaylist: profileDetails?._count.playlists,
      totalSongLiked: profileDetails?._count.likedSongs,
      timeListened: playduration._sum.play_duration
    }

    return res.status(200).json({ message: "success", profileDetails: fixedProfileDetails })

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const updateMyProfileDetails = async (req: Request<{}, {}, updateMyProfileDetailsBody>, res: Response) => {

  const { name, gender, dateOfBirth } = req.body;
  const user = req.user as authUser;

  try {

    if (!name && !gender && !dateOfBirth) {
      return res.status(400).json({ message: "no data to update" })
    }

    const updateData: any = {};

    if (name) updateData.user_name = name;
    if (gender) updateData.gender = gender;
    if (dateOfBirth) updateData.date_of_birth = new Date(dateOfBirth);

    const profileDetails = await prisma.user.update({
      where: {
        user_id: user.user_id
      },
      data: updateData,
       select: {
        user_id: true,
        user_name: true,
        user_email: true,
        user_profile_pic: true,
        date_of_birth: true,
        gender: true,
        created_at: true,
        is_premium: true,
        _count: {
          select: {
            playlists: true,
            likedSongs: true,
          }
        }
      }
    });

    const playduration = await prisma.userSongEvent.aggregate({
      where: {
        user_id: user.user_id,
        event_type: {
          in: ["COMPLETE", "PLAY", "REPEAT"]
        },

      },
      _sum: {
        play_duration: true,
      }
    })

    let profileImageWithurl: string | undefined = "";
    if (profileDetails?.user_profile_pic) {
      profileImageWithurl = await getFileUrl(profileDetails?.user_profile_pic)
    }

    const fixedProfileDetails = {
      user_id: profileDetails?.user_id,
      user_name: profileDetails?.user_name,
      user_email: profileDetails?.user_email,
      user_profile_pic: profileImageWithurl,
      date_of_birth: profileDetails?.date_of_birth,
      gender: profileDetails?.gender,
      created_at: profileDetails?.created_at,
      totalPlaylist: profileDetails?._count.playlists,
      totalSongLiked: profileDetails?._count.likedSongs,
      timeListened: playduration._sum.play_duration
    }

    const key = `userData:${user.user_id}`;
    await redisClient.del(key)

    return res.status(201).json({ message: "details updated successfully",profileDetails:fixedProfileDetails})
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const updateMyProfilePic = async (req: Request<{}, {}, { profilePic: string }>, res: Response) => {

  const { profilePic } = req.body;
  const user = req.user as authUser;
  try {

    if (!profilePic) {
      return res.status(400).json({ message: "profile pic not found" })
    }

    const profileDetails = await prisma.user.update({
      where: {
        user_id: user.user_id
      },
      data: {
        user_profile_pic: profilePic,
      },
      select: {
        user_id: true,
        user_name: true,
        user_email: true,
        user_profile_pic: true,
        date_of_birth: true,
        gender: true,
        created_at: true,
        is_premium: true,
        _count: {
          select: {
            playlists: true,
            likedSongs: true,
          }
        }
      }
    })
    const playduration = await prisma.userSongEvent.aggregate({
      where: {
        user_id: user.user_id,
        event_type: {
          in: ["COMPLETE", "PLAY", "REPEAT"]
        },

      },
      _sum: {
        play_duration: true,
      }
    })

    let profileImageWithurl: string | undefined = "";
    if (profileDetails?.user_profile_pic) {
      profileImageWithurl = await getFileUrl(profileDetails?.user_profile_pic)
    }

    const fixedProfileDetails = {
      user_id: profileDetails?.user_id,
      user_name: profileDetails?.user_name,
      user_email: profileDetails?.user_email,
      user_profile_pic: profileImageWithurl,
      date_of_birth: profileDetails?.date_of_birth,
      gender: profileDetails?.gender,
      created_at: profileDetails?.created_at,
      totalPlaylist: profileDetails?._count.playlists,
      totalSongLiked: profileDetails?._count.likedSongs,
      timeListened: playduration._sum.play_duration
    }
    const key = `userData:${user.user_id}`;
    await redisClient.del(key)

    return res.status(200).json({ message: "profile picture updated",profileDetails:fixedProfileDetails})
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const getImageUploadUrl = async (req: Request<{}, {}, getUserProfileImgUploadUrl>, res: Response) => {
  const {imageType, fileType, fileSize } = req.body;
  const user = req.user as authUser;
  try {

    
    if (!fileType.startsWith('image/')) {
      return res.status(400).json({ message: "Invalid file type" });
    }

    if (fileSize > 20 * 1024 * 1024) {
      return res.status(400).json({ message: "File too large" });
    }
    const refId = user.user_id;
    const result = await createImageUploadUrl(
      refId,
      imageType,
      fileType,
      refId
    );

    return res.status(201).json({ message: "url created", result })


  } catch (error) {
    const err = error as Error;
    console.log("error in getImageUploadUrl controller", err.message);
    return res.status(500).json({ message: "Internal server error" })
  }
}

// user-playlists controllers ==----==>
export const createPlaylist = async (req: Request<{}, {}, plalistDetails>, res: Response) => {

  const { playlistName, description, isPublic } = req.body;
  const user = req.user as authUser;

  try {

    if (!playlistName || !description) {
      return res.status(400).json({ message: "all fields are required" })
    }

    const checkPlaylist = await prisma.playlist.findUnique({
      where: {
        user_id_playlist_name: {
          user_id: user.user_id,
          playlist_name: playlistName,
        },
      }
    })

    if (checkPlaylist) {
      return res.status(409).json({ message: `playlist named ${playlistName} already exists` })
    }

    const newPlaylist = await prisma.playlist.create({
      data: {
        playlist_name: playlistName,
        user_id: user.user_id,
        description: description,
        is_public: isPublic
      },
      select: {
        playlist_id: true,
        playlist_name: true,
        description: true,
        is_public: true,
        created_at: true,
      }
    });

    const playlist = { ...newPlaylist, songCount: 0 }

    res.status(201).json({ message: "playlist created successfully", playlist })

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
        user_id: user.user_id,
      },
      select: {
        playlist_id: true,
        playlist_name: true,
        description: true,
        is_public: true,
        created_at: true,
        _count: {
          select: {
            songs: true
          }
        }
      }
    });

    if (playlists.length === 0) {
      return res.status(200).json({ message: "no playlist found for this user" });
    }

    const formattedPlaylists = playlists.map(p => ({
      playlist_id: p.playlist_id,
      playlist_name: p.playlist_name,
      description: p.description,
      is_public: p.is_public,
      created_at: p.created_at,
      songCount: p._count.songs
    }));

    return res.status(200).json({
      message: "playlists fetched successfully",
      playlists: formattedPlaylists
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

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

export const getPlaylistSongs = async (req: Request, res: Response) => {

  const { playlistId } = req.params;
  const user = req.user as authUser;
  try {

    if (!playlistId) {
      return res.status(400).json({ message: "all fields required" });
    }

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
    })

    const fixedPlaylistSongs = fixIsLikedInsong(playlistSongs);
    const PlaylistSongsWithurl = await songsWithUrl(fixedPlaylistSongs);

    res.status(200).json({ message: "playlist song fetched successfully", songs: PlaylistSongsWithurl })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const addPlaylistSongs = async (req: Request<{}, {}, addPlaylistSongsBody>, res: Response) => {
  const { playlistId, songId } = req.body;
  const user = req.user as authUser;

  if (!playlistId || !songId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Single query: checks existence + ownership together
      await tx.playlist.findUniqueOrThrow({
        where: { playlist_id: playlistId, user_id: user.user_id },
        select: { playlist_id: true } // fetch minimum data
      });

      const lastSong = await tx.playlistSong.aggregate({
        where: { playlist_id: playlistId },
        _max: { position: true }
      });

      await tx.playlistSong.create({
        data: {
          playlist_id: playlistId,
          song_id: songId,
          position: (lastSong._max.position ?? 0) + 1
        }
      });
    });

    return res.status(200).json({ message: "Song added successfully" });

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          return res.status(409).json({ message: "Song is already in playlist" });
        case 'P2025':
          // findUniqueOrThrow throws this when record not found
          return res.status(404).json({ message: "Playlist not found" });
      }
    }
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// user-artists-controllers ==----==>
export const getArtists = async (req: Request, res: Response) => {

  try {

    const artist = await prisma.artist.findMany({
      take: 10,
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
  const user = req.user as authUser | undefined;

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

    const fixSongs = fixIsLikedInsongSimple(songs)
    const artisSongsWithUrls = await songsWithUrl(fixSongs)


    res.status(200).json({ message: "artist's songs fetched successfully", songs: artisSongsWithUrls })
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