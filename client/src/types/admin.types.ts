
export interface artistPayload {
    artist_bio: string;
    artist_name: string;
}

export interface artist {
    artist_id: string;
    artist_bio: string;
    artist_profilePic: string;
    artist_name: string;
    isVerified: boolean;
}

export interface artistGetUrlPayload {
    fileType: string;
    fileSize: number;
    userId: string | undefined;
    imageType: string;
}

export interface songGetUrlPayload {
    fileName: string;
    fileType: string;
    fileSize: number;
}


export interface songDataUpdatePayload {
    song_title: string,
    artist_id: string,
    duration: number,
    genre: string,
    release_date: string,
    tags: string,
    mood: string,
    energy_level: string,
    language: string
}


export interface AdminStoreT {

    uploadUrl: string;
    createdArtistData: artist | null;
    isCreatingArtist: boolean;
    isGettingUrloadImageUrl: boolean;
    imageUrlKey: string;
    isUploadingImage: boolean;
    uploadProgress: number;
    songuploadUrl: string;
    songUrlKey: string;
    songUploadProgress:number;
    isUploadingSong:boolean;
    artists:artist[];

    getImageUploadUrl: (data: artistGetUrlPayload) => Promise<void>;
    createArtist: (data: artistPayload) => Promise<void>;
    uploadArtistProfileImage: (file: File) => Promise<void>;
    getSongUploadUrl: (data: songGetUrlPayload) => Promise<void>;
    songDataUpdate:(data:songDataUpdatePayload,song:File,image:File) => Promise<void>;
    getArtists:() => Promise<void>;
}



