
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
    recommendedNextCursor:string | null;
    isGettingRecommendedSongs:boolean;
    isGettingTrendingSongs:boolean;
    isGettingArtistsList:boolean;
    artists:artist[];
    AllSongs:song[];
    isLimitReached:boolean;

    getRecentSongs: (limit:number | null) => Promise<void>;
    updateSongEvent:(currentTrack:song,duration:number)=> Promise<void>;
    getRecommendedSongs:(limit:number | null) =>Promise<void>;
    getTrendingSongs:() =>Promise<void>;
    getArtistList:()=>Promise<void>;
    setisLimitReached:(value:boolean)=>void;
}