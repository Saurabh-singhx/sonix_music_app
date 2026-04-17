export interface plalistDetails {
    playlistName:string,
    description:string,
    isPublic:boolean
}

export interface userSongEventPayload{
    songId:string,
    duration:number
}

export  interface addPlaylistSongsBody{
    songId:string,
    playlistId:string
}

export interface updateMyProfileDetailsBody{
    name:string;
    gender:string;
    dateOfBirth:string;
}