export interface songDB {
    score?: number;
    rank?: number;
    song: {
        song_id: string;
        song_title: string;
        song_url: string;
        size: number;
        release_date: Date | null;
        cover_image_url: string;
        artist: {
            artist_id: string;
            artist_name: string;
            artist_bio: string | null;
            artist_profilePic: string | null;
        } | null;
        likedByUsers?: {
            user_id: string;
        }[];
    };
}

export interface songResponse {
    song_id: string;
    song_title: string;
    song_url: string;
    size: number;
    release_date: Date | null;
    cover_image_url: string;
    artist: {
        artist_id: string;
        artist_name: string;
        artist_bio: string | null;
        artist_profilePic: string | null;
    } | null;
}

export interface simpleSongDB {
    artist: {
        artist_id: string;
        artist_name: string;
        artist_bio: string | null;
        artist_profilePic: string | null;
    } | null;
    song_id: string;
    song_title: string;
    song_url: string;
    size: number;
    release_date: Date | null;
    cover_image_url: string;
    likedByUsers: {
        user_id: string;
    }[];
}[]