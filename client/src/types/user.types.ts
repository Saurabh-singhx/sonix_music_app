import type { artistGetUrlPayload } from "./admin.types";

export interface song {
    isLiked: boolean;
    song_id: string;
    song_title: string;
    song_url: string;
    artist: artist;
    cover_image_url: string;
    release_date: string;
    size: number;
}

export interface artist {
    artist_id: string;
    artist_bio: string;
    artist_name: string;
    artist_profilePic: string;
}

export interface playlist {
    playlist_id: string;
    playlist_name: string;
    description: string | null | undefined;
    created_at: string;
    is_public: boolean;
    songCount: number;
}

export interface profileDetails {
    user_id: string,
    user_name: string,
    user_email: string,
    user_profile_pic: string,
    date_of_birth: string,
    gender: string,
    created_at: string,
    totalPlaylist: number,
    totalSongLiked: number,
    timeListened: number
}


export interface userStoreT {
    recentSongs: song[];
    isGettingSongs: boolean;
    nextCursor: string | null;
    trendingSongs: song[];
    recommendedSongs: song[];
    recentlyPlayedSongs: song[];
    recommendedNextCursor: string | null;
    isGettingRecommendedSongs: boolean;
    isGettingTrendingSongs: boolean;
    isGettingArtistsList: boolean;
    artists: artist[];
    AllSongs: song[];
    isLimitReached: boolean;
    isLikingSong: boolean;
    likedSongsId: string[];
    currentArtist: artist | null;
    isGettingCurrentArtistSongs: boolean;
    currentArtistSongs: song[];
    userPlaylists: playlist[];
    isCreatingPlaylist: boolean;
    isgettingMyPlaylists: boolean;
    currentPlaylistView: playlist | null | undefined;
    currentPlaylistSongs: song[];
    isGettingPlaylistSongs: boolean;
    isAddingPlaylistSongs: boolean;
    myProfileDetails:profileDetails|null;
    isGettingMyProfileDetails:boolean;
    profileImageUploadUrl:string | null | undefined;
    isgettingProfileImageUploadUrl:boolean;
    profileImageS3Key:string|null;
    isUploadingProfileImage:boolean,

    getRecentSongs: (limit: number | null) => Promise<void>;
    updateSongEvent: (currentTrack: song, duration: number) => Promise<void>;
    getRecommendedSongs: (limit: number | null) => Promise<void>;
    getTrendingSongs: () => Promise<void>;
    getArtistList: () => Promise<void>;
    setisLimitReached: (value: boolean) => void;
    setSongLike: (songId: string) => Promise<number | undefined>;
    checkSongLiked: (songId: string) => boolean;
    cleanupAfterLogoutUser: () => void;
    setCurrentArtist: (artist: artist) => void;
    getCurrentArtistSongs: (artistId: string) => Promise<void>;
    createPlalist: (playlistName: string, description: string, isPublic: boolean) => Promise<void>;
    getMyPlaylist: () => Promise<void>;
    setCurrentPlaylist: (data: playlist) => void;
    getCurrentPlaylistSongs: (playlistId: string) => Promise<void>;
    getAllSongs: () => void;
    addPlaylistSongs: (playlistId: string, song: song) => Promise<void>;
    getMyProfileDetails: () => Promise<void>;
    getProfileImageUploadUrl: (data:artistGetUrlPayload) => Promise<void>;
    updateMyProfilePic:(data:File) => Promise<void>;
}