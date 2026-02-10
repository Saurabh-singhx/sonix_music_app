
export interface song{
    song_id:string,
    song_title:string,
    song_url:string,
    artist:artist,
    cover_image_url:string,
    release_date:string,
    duration:number
}

interface artist{
    artist_id:string,
    artist_bio:string,
    artist_name:string,
    artist_profilePic:string
}

export interface userStoreT {
    recentSongs:  song[];
    isGettingSongs: boolean;
    nextCursor:string|null;
    trendingSongs:song[];
    recommendedSongs:song[];
    recentlyPlayedSongs:song[];

    getRecentSongs: (limit:number | null,cursor:string | null) => Promise<void>;

}