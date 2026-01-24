
export interface song{
    song_id:string,
    song_title:string,
    song_url:string,
    artist:artist,
    cover_image_url:string,
    release_date:string,
}

interface artist{
    artist_id:string,
    artist_bio:string,
    artist_name:string,
    artist_profilePic:string
}

export interface userStoreT {
    recentSongs:  song[],
    isGettingSongs: boolean,
    nextCursor:string|null,

    getRecentSongs: (limit:number | null,cursor:string | null) => Promise<void>;

}