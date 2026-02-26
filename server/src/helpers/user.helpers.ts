import { getFileUrl } from "../services/s3.services.js";
import { simpleSongDB, songDB, songResponse } from "../types/response/user.response.js";

export const songsWithUrl = async (song: songResponse[]) => {

    const withUrls = await Promise.all(
        song.map(async (song) => {
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
    return withUrls;
}

export const fixIsLikedInsong = (songs:songDB[])=>{

    const data = songs.map(song => {
      const { likedByUsers=[], ...restSong } = song.song;

      return {
        ...restSong,
        isLiked: likedByUsers.length > 0
      };
    });
    return data;
}

export const fixIsLikedInsongSimple = (songs:simpleSongDB[])=>{

    const data = songs.map(song => {
      const { likedByUsers=[], ...restSong } = song;

      return {
        ...restSong,
        isLiked: likedByUsers.length > 0
      };
    });
    return data;
}

