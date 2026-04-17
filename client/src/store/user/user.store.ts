import { create } from "zustand";
import { axiosInstance } from "../../lib/axios";
import type { artist, song, userStoreT } from "@/types/user.types";
import { useAuthStore } from "../auth/auth.store";
import axios, { AxiosError, type AxiosProgressEvent } from "axios";
import { toast } from "react-toastify";
export const useUserStore = create<userStoreT>((set, get) => ({


    recentSongs: [],
    isGettingSongs: false,
    nextCursor: null,
    trendingSongs: [],
    recommendedSongs: [],
    recentlyPlayedSongs: [],
    recommendedNextCursor: null,
    isGettingRecommendedSongs: false,
    isGettingTrendingSongs: false,
    isGettingArtistsList: false,
    AllSongs: [],
    artists: [],
    isLimitReached: false,
    isLikingSong: false,
    likedSongsId: [],
    currentArtist: null,
    isGettingCurrentArtistSongs: false,
    currentArtistSongs: [],
    userPlaylists: [],
    isCreatingPlaylist: false,
    isgettingMyPlaylists: false,
    currentPlaylistSongs: [],
    currentPlaylistView: null,
    isGettingPlaylistSongs: false,
    isAddingPlaylistSongs: false,
    myProfileDetails: null,
    isGettingMyProfileDetails:false,
    isgettingProfileImageUploadUrl:false,
    profileImageUploadUrl:null,
    profileImageS3Key:null,
    isUploadingProfileImage:false,

    getRecentSongs: async (limit) => {

        set({ isGettingSongs: true });
        const { authUser } = useAuthStore.getState();
        const { nextCursor, recentSongs } = get();
        const { setisLimitReached } = get();
        try {

            if (authUser?.role === "guest") {
                const res = await axiosInstance.get("/api/v1/public/getsongs",
                    {
                        params: {
                            limit: limit,
                            ...(nextCursor && { cursor: nextCursor })
                        }
                    }
                )
                if (res.data?.songs) {
                    const newSong: song[] = res.data?.songs;
                    for (const s of recentSongs) {

                        if (newSong[0].song_id === s.song_id) {
                            return;
                        }
                    }
                }

                set({ recentSongs: [...recentSongs, ...res.data?.songs] })
            } else {

                const res = await axiosInstance.get("/api/v1/user/recent-songs",
                    {
                        params: {
                            limit: limit = 15,
                            ...(nextCursor && { cursor: nextCursor })
                        }
                    }
                )

                if (res.data?.songs) {
                    const newSong: song[] = res.data?.songs;
                    for (const s of recentSongs) {

                        if (newSong[0].song_id === s.song_id) {
                            return;
                        }
                    }
                }

                set({ recentSongs: [...recentSongs, ...res.data?.songs] })
                set({ nextCursor: res.data.nextCursor })
                // console.log("recent:",res.data.songs)
            }

        } catch (error) {
            let errorMessage: string = "error while getting recent added songs"
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.message ?? error.message;
                if (error.status === 429 && authUser?.role === "guest") {
                    setisLimitReached(true)
                } else {
                    toast.error(errorMessage)
                }
            }
        } finally {
            set({ isGettingSongs: false })
        }
    },


    updateSongEvent: async (currentTrack, duration) => {
        const { recentlyPlayedSongs } = get();
        const { authUser } = useAuthStore.getState();
        const MAX_RECENT = 4;
        // 1. Remove duplicate if it exists
        const filtered = recentlyPlayedSongs.filter(
            (song) => song.song_id !== currentTrack.song_id
        );

        const updated = [currentTrack, ...filtered];

        const trimmed = updated.slice(0, MAX_RECENT);

        set({ recentlyPlayedSongs: trimmed });

        try {
            if (authUser?.role !== "guest") {
                await axiosInstance.post("/api/v1/user/song-event", { songId: currentTrack.song_id, duration })
            }
        } catch (error) {
            // console.error(error)
        }
    },


    getRecommendedSongs: async (limit) => {

        const { recommendedNextCursor } = get();
        const { authUser } = useAuthStore.getState();
        const { recommendedSongs } = get();

        set({ isGettingRecommendedSongs: true })
        try {
            if (authUser?.role !== "guest") {
                const res = await axiosInstance.get("/api/v1/user/recommended-songs", {
                    params: {
                        limit,
                        ...(recommendedNextCursor && { cursor: recommendedNextCursor })
                    }
                })
                set({ recommendedSongs: [...recommendedSongs, ...res.data?.recommendedSongs] })
                // console.log("recommended:",res.data.recommendedSongs)
            }

        } catch (error) {
            console.error(error)
        } finally {
            set({ isGettingRecommendedSongs: false })
        }
    },

    getTrendingSongs: async () => {

        const { authUser } = useAuthStore.getState();
        const { setisLimitReached } = get()
        set({ isGettingTrendingSongs: true });

        try {

            if (authUser?.role === "guest") {

                const res = await axiosInstance.get("/api/v1/public/trending-songs");
                set({ trendingSongs: res.data?.trendingSongs })

            } else {
                const res = await axiosInstance.get("/api/v1/user/trending-songs");
                set({ trendingSongs: res.data?.trendingSongs })
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status === 429 && authUser?.role === "guest") {
                    setisLimitReached(true);
                }
            }
        } finally {
            set({ isGettingTrendingSongs: false })
        }
    },


    getArtistList: async () => {

        set({ isGettingArtistsList: true });
        const { authUser } = useAuthStore.getState();
        const { setisLimitReached } = get();
        try {

            if (authUser?.role === "guest") {
                const res = await axiosInstance.get("/api/v1/public/getartists")
                set({ artists: res.data?.artists })
            } else {
                const res = await axiosInstance.get("/api/v1/user/getartists")
                set({ artists: res.data?.artists })
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status === 429 && authUser?.role === "guest") {
                    setisLimitReached(true);
                }
            }
        } finally {
            set({ isGettingArtistsList: false })
        }
    },

    getAllSongs: () => {
        const { recentSongs, trendingSongs, recommendedSongs } = get();
        const allSongsSet: Set<song> = new Set();

        for (const s of recentSongs) {
            allSongsSet.add(s);
        }
        for (const s of trendingSongs) {
            allSongsSet.add(s);
        }
        for (const s of recommendedSongs) {
            allSongsSet.add(s);
        }

        const uniqueSongs: song[] = [];
        for (const s of allSongsSet) {
            uniqueSongs.push(s)
        }

        set({ AllSongs: uniqueSongs })
    },

    setisLimitReached: (value) => {
        set({ isLimitReached: value })
    },

    setSongLike: async (songId) => {

        set({ isLikingSong: true });
        const { likedSongsId } = get();
        try {
            const res = await axiosInstance.post(`/api/v1/user/like-song/${songId}`)
            // toast.success(res.data.message);
            if (res.status === 201) {
                set({ likedSongsId: [songId, ...likedSongsId] })
            }
            return res.status;
        } catch (error) {

        } finally {
            set({ isLikingSong: false })
        }
    },

    checkSongLiked: (songId: string) => {
        const { likedSongsId } = get();
        for (const s of likedSongsId) {
            if (s === songId) {
                return true;
            }
            break;
        }
        return false;
    },
    cleanupAfterLogoutUser: () => {
        set({
            nextCursor: null,
            likedSongsId: [],
            recentlyPlayedSongs: [],
            recentSongs: [],
            recommendedNextCursor: null,
            recommendedSongs: [],
            trendingSongs: [],
            AllSongs: [],
            artists: [],
            userPlaylists: [],
        })
    },

    setCurrentArtist: (artist: artist) => {
        set({ currentArtist: artist })
    },

    getCurrentArtistSongs: async (artistId: string) => {

        set({ isGettingCurrentArtistSongs: true })

        try {
            const res = await axiosInstance.get(`/api/v1/user/artistongs/${artistId}`)

            set({ currentArtistSongs: res.data.songs })
        } catch (error) {

        } finally {
            set({ isGettingCurrentArtistSongs: false })
        }
    },

    createPlalist: async (playlistName, description, isPublic) => {
        set({ isCreatingPlaylist: true })
        const { userPlaylists } = get();
        try {
            const res = await axiosInstance.post("/api/v1/user/create-playlist", { playlistName, description, isPublic })

            set({ userPlaylists: [res.data.playlist, ...userPlaylists] })
            toast.success("playlist created successfully")
        } catch (error) {
            let errorMessage: string = "error while creating playlist"
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.message ?? error.message;
                toast.error(errorMessage)
            }
        } finally {
            set({ isCreatingPlaylist: false })
        }

    },
    getMyPlaylist: async () => {
        set({ isgettingMyPlaylists: true });
        const { authUser } = useAuthStore.getState();
        try {
            if (authUser?.role === "USER") {
                const res = await axiosInstance.get(`/api/v1/user/getmy-playlists`);
                set({ userPlaylists: res.data.playlists })
            }
        } catch (error) {

        } finally {
            set({ isgettingMyPlaylists: false });
        }
    },

    setCurrentPlaylist: (playlist) => {
        set({ currentPlaylistView: playlist })
    },

    getCurrentPlaylistSongs: async (playlistId) => {
        set({ isGettingPlaylistSongs: true })
        try {
            const res = await axiosInstance.get(`/api/v1/user/getplaylistsongs/${playlistId}`)
            set({ currentPlaylistSongs: res.data.songs })
        } catch (error) {
            toast.error("error while fetching playlist songs")
        } finally {
            set({ isGettingPlaylistSongs: false })
        }

    },
    addPlaylistSongs: async (playlistId, song) => {
        const { AllSongs, currentPlaylistSongs } = get();

        if (currentPlaylistSongs.some((s) => s.song_id === song.song_id)) {
            toast.warn("Song is already in your playlist");
            set({ AllSongs: AllSongs.filter((s) => s.song_id !== song.song_id) });
            return;
        }

        set({ isAddingPlaylistSongs: true });

        try {
            await axiosInstance.post("/api/v1/user/addplaylist-songs", {
                playlistId,
                songId: song.song_id,
            });

            set({
                AllSongs: AllSongs.filter((s) => s.song_id !== song.song_id),
                currentPlaylistSongs: [...currentPlaylistSongs, song], // keep in sync
            });

            toast.success("Song added to playlist");

        } catch (error) {
            if (error instanceof AxiosError) {
                const message = error.response?.data?.message ?? "Error while adding song";
                toast.error(message);
            }
        } finally {
            set({ isAddingPlaylistSongs: false });
        }
    },
    getMyProfileDetails: async () => {
        set({isGettingMyProfileDetails:true})

        try {
            const res = await axiosInstance.get("/api/v1/user/profile-details");

            set({myProfileDetails:res.data.profileDetails})
        } catch (error) {
               if (error instanceof AxiosError) {
                const message = error.response?.data?.message ?? "Error while fetching profile details";
                toast.error(message);
            }
        }finally{
            set({isGettingMyProfileDetails:false})
        }
    },
    getProfileImageUploadUrl: async (data) => {
        set({ isgettingProfileImageUploadUrl: true });
        try {
            const res = await axiosInstance.post("/api/v1/user/getimageurl", data);

            set({ profileImageS3Key: res.data.result?.key });
            set({ profileImageUploadUrl: res.data.result?.uploadUrl });

        } catch (error) {
            let errorMessage: string = "error while fetching uploaadurl"
            if (error instanceof AxiosError) {
                errorMessage =
                    error.response?.data?.message ?? error.message;
            }
            toast.error(errorMessage)
        } finally {
            set({ isgettingProfileImageUploadUrl: false });
        }
    },

    updateMyProfilePic: async (file: File) => {
        if (!file) {
            toast.error("No file selected");
            return;
        }
        const { profileImageUploadUrl, profileImageS3Key } = get();

        if (!profileImageUploadUrl) {
            toast.error("Upload URL missing");
            return;
        }

        if (!profileImageS3Key ) {
            toast.error("image is missing");
            return;
        }

        set({ isUploadingProfileImage: true });

        try {
            await axios.put(profileImageUploadUrl, file, {
                headers: { "Content-Type": file.type },
                onUploadProgress: (e: AxiosProgressEvent) => {
                    if (!e.total) return;
                    // set({ uploadProgress: Math.round((e.loaded * 100) / e.total) });
                },
            });

            await axiosInstance.patch("/api/v1/user/update-profile-pic", {
                profilePic: profileImageS3Key,
            });

            toast.success("Image uploaded successfully");
        } catch (error) {
            let errorMessage: string = "error while uploading profile Image"
            if (error instanceof AxiosError) {
                errorMessage =
                    error.response?.data?.message ?? error.message;
            }
            toast.error(errorMessage)
        } finally {
            set({ isUploadingProfileImage: false });
            set({ profileImageUploadUrl: "" });
            set({ profileImageS3Key: "" });
        }
    },

}));