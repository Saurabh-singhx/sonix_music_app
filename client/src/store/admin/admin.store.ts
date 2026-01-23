import { create } from "zustand";
import type { AdminStoreT } from "../../types/admin.types";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import axios, { type AxiosProgressEvent } from "axios";


export const useAdminStore = create<AdminStoreT>((set, get) => ({

    uploadUrl: "",
    createdArtistData: null,
    isCreatingArtist: false,
    isGettingUrloadImageUrl: false,
    imageUrlKey: "",
    isUploadingImage: false,
    uploadProgress: 0,
    songuploadUrl: "",
    songUrlKey: "",
    songUploadProgress: 0,
    isUploadingSong: false,
    artists:[],

    getImageUploadUrl: async (data) => {
        set({ isGettingUrloadImageUrl: true });
        try {
            const res = await axiosInstance.post("/api/v1/admin/getimageurl", data);
            console.log(data);

            set({ imageUrlKey: res.data.result?.key });
            set({ uploadUrl: res.data.result?.uploadUrl });
            console.log(res.data.result.uploadUrl)

        } catch (error) {
            console.log(data);
            console.error(error);
            toast.error("error while getting imageurl");
        } finally {
            set({ isGettingUrloadImageUrl: false });
        }
    },

    createArtist: async (data) => {
        set({ isCreatingArtist: true })
        try {
            const res = await axiosInstance.post("/api/v1/admin/createartist", data);
            if (res.data.newArtist) {
                set({ createdArtistData: res.data.newArtist });
                toast.success('artist created successfully 💁')
            }

        } catch (error: unknown) {
            console.error(error);
            toast.error("error while creating artist");
        } finally {
            set({ isCreatingArtist: false })
        }
    },

    uploadArtistProfileImage: async (file: File) => {
        if (!file) {
            toast.error("No file selected");
            return;
        }

        const { uploadUrl, imageUrlKey, createdArtistData } = get();

        if (!uploadUrl) {
            toast.error("Upload URL missing");
            return;
        }

        if (!imageUrlKey || !createdArtistData?.artist_id) {
            toast.error("Artist data missing");
            return;
        }

        set({ isUploadingImage: true, uploadProgress: 0 });

        try {
            await axios.put(uploadUrl, file, {
                headers: { "Content-Type": file.type },
                onUploadProgress: (e: AxiosProgressEvent) => {
                    if (!e.total) return;
                    set({ uploadProgress: Math.round((e.loaded * 100) / e.total) });
                },
            });

            await axiosInstance.put("/api/v1/admin/updateimages3key", {
                profilePic: imageUrlKey,
                userId: createdArtistData.artist_id,
            });

            toast.success("Image uploaded successfully");
        } catch (err) {
            console.error(err);
            set({ uploadProgress: 0 });
            toast.error("Image upload failed");
        } finally {
            set({ isUploadingImage: false });
            set({ uploadUrl: "" });
            set({ imageUrlKey: "" });
            set({ createdArtistData: null });
            set({ uploadProgress: 0 })
        }
    },

    getSongUploadUrl: async (data) => {

        try {
            const res = await axiosInstance.post("/api/v1/admin/getsonguploadurl", data);
            set({ songuploadUrl: res.data.result?.uploadUrl });
            set({ songUrlKey: res.data.result?.key })

            console.log(res.data.result?.uploadUrl)
            console.log(res.data.result?.key)

        } catch (error) {
            console.log(data);
            console.error(error);
            toast.error("error while getting song url");
        }
    },

    songDataUpdate: async (data, song, image) => {

        const { uploadUrl, imageUrlKey, songuploadUrl, songUrlKey } = get();

        if (!uploadUrl) {
            toast.error("Upload URL missing");
            return;
        }

        if (!songuploadUrl) {
            toast.error("song url missing");
            return;
        }

        if (!song || !image) {
            toast.error("Song or image file missing");
            return;
        }

        set({ isUploadingSong: true });
        try {

            await axios.put(uploadUrl, image, {
                headers: { "Content-Type": image.type },
                onUploadProgress: (e: AxiosProgressEvent) => {
                    if (!e.total) return;
                    set({ uploadProgress: Math.round((e.loaded * 100) / e.total) });
                },
            });


            await axios.put(songuploadUrl, song, {
                headers: { "Content-Type": song.type },
                onUploadProgress: (e: AxiosProgressEvent) => {
                    if (!e.total) return;
                    set({ songUploadProgress: Math.round((e.loaded * 100) / e.total) });
                },
            });


            await axiosInstance.post("/api/v1/admin/addsongData", {
                song_title: data.song_title,
                song_url: songUrlKey,
                artist_id: data.artist_id,
                duration: data.duration,
                genre: data.genre,
                release_date: data.release_date,
                cover_image_url: imageUrlKey,
                tags: data.tags,
                mood: data.mood,
                energy_level: data.energy_level,
                language: data.language
            })

            toast.success("Song uploaded successfully");


        } catch (error) {
            console.log(data);
            console.error(error);
            set({ uploadProgress: 0 })
            set({ songUploadProgress: 0 })
            toast.error("error while uploading song");
        } finally {
            set({ isUploadingSong: false });
            set({ uploadUrl: "" });
            set({ imageUrlKey: "" });
            set({ songuploadUrl: "" });
            set({ songUrlKey: "" })
            set({ uploadProgress: 0 })
            set({ songUploadProgress: 0 })
        }
    },

    getArtists:async()=>{
        try {
            const res = await axiosInstance.get("/api/v1/admin/getartists");

           set({ artists: res.data.artists });
        } catch (error) {
            console.error(error);
            toast.error("error while getting artists data");
        }
    }

}));