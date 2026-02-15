import { create } from "zustand";
import type { AdminStoreT } from "../../types/admin.types";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import axios, { AxiosError, type AxiosProgressEvent } from "axios";


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
    artists: [],

    getImageUploadUrl: async (data) => {
        set({ isGettingUrloadImageUrl: true });
        try {
            const res = await axiosInstance.post("/api/v1/admin/getimageurl", data);

            set({ imageUrlKey: res.data.result?.key });
            set({ uploadUrl: res.data.result?.uploadUrl });

        } catch (error) {
            let errorMessage: string = "error while fetching uploaadurl"
            if (error instanceof AxiosError) {
                errorMessage =
                    error.response?.data?.message ?? error.message;
            }
            toast.error(errorMessage)
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

        } catch (error) {
            let errorMessage: string = "failed to create artist"
            if (error instanceof AxiosError) {
                errorMessage =
                    error.response?.data?.message ?? error.message;
            }
            toast.error(errorMessage)
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
        } catch (error) {
            let errorMessage: string = "error while uploading image"
            if (error instanceof AxiosError) {
                errorMessage =
                    error.response?.data?.message ?? error.message;
            }
            toast.error(errorMessage)
            set({ uploadProgress: 0 });
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
             let errorMessage: string = "error while fetching song upload url"
            if (error instanceof AxiosError) {
                errorMessage =
                    error.response?.data?.message ?? error.message;
            }
            toast.error(errorMessage)
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
             let errorMessage: string = "error while updating song details"
            if (error instanceof AxiosError) {
                errorMessage =
                    error.response?.data?.message ?? error.message;
            }
            toast.error(errorMessage)
            set({ uploadProgress: 0 })
            set({ songUploadProgress: 0 })
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

    getArtists: async () => {
        try {
            const res = await axiosInstance.get("/api/v1/admin/getartists");

            set({ artists: res.data.artists });
        } catch (error) {
             let errorMessage: string = "error while fetching artists"
            if (error instanceof AxiosError) {
                errorMessage =
                    error.response?.data?.message ?? error.message;
            }
            toast.error(errorMessage)
        }
    },

    cleanAfterLogOut: () => {
        set({ uploadUrl: "" });
        set({ createdArtistData: null });
        set({ imageUrlKey: "" });
        set({ songuploadUrl: "" });
        set({ songUrlKey: "" });
        set({ imageUrlKey: "" });
        set({ artists: [] });
    }

}));