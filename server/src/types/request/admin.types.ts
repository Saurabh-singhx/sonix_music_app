

export interface artistBody {
    artist_name: string;
    artist_bio: string;
}

export interface getSongUploadUrlBody {
    fileName: string,
    fileType: string,
    fileSize: number,
    userId:string
}

export interface getUserProfileImgUploadUrl {
    userId: string,
    imageType: "profile" | "gallery" | "cover",
    fileType: string,
    refId?: string,
    fileSize:number
}