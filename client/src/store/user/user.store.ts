import { create } from "zustand";
import { axiosInstance } from "../../lib/axios";
import type { song, userStoreT } from "@/types/user.types";
import { useAuthStore } from "../auth/auth.store";
import { AxiosError } from "axios";
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
    isGettingArtistsList:false,
    AllSongs:[],
    artists:[],
    isLimitReached:false,

    getRecentSongs: async (limit) => {

        set({ isGettingSongs: true });
        const { authUser } = useAuthStore.getState();
        const { nextCursor, recentSongs } = get();
        const {setisLimitReached} = get();
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
                // console.log("recent:",res.data.songs)
            }
            
        } catch (error) {
            let errorMessage: string = "error while getting recent added songs"
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.message ?? error.message;
                if(error.status === 429 && authUser?.role === "guest"){
                    setisLimitReached(true)
                }else{
                    toast.error(errorMessage)
                }
            }
        } finally {
            set({ isGettingSongs: false })
        }
    },


    updateSongEvent: async (currentTrack, duration) => {
        const { recentlyPlayedSongs } = get();

        for (let i = recentlyPlayedSongs.length - 1; i >= 0; i--) {
            if (currentTrack.song_id === recentlyPlayedSongs[i].song_id) {
                recentlyPlayedSongs.splice(i, 1);
                if(recentlyPlayedSongs.length >= 4){
                    recentlyPlayedSongs.pop()
                }
                break;
            }
            
        }


        // recentlyPlayedSongs.push(currentTrack)
        set({ recentlyPlayedSongs: [currentTrack, ...recentlyPlayedSongs] })

        try {
            await axiosInstance.post("/api/v1/user/song-event", { songId: currentTrack.song_id, duration })
        } catch (error) {
            console.error(error)
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
        const {setisLimitReached} = get()
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
            if(error instanceof AxiosError){
                if(error.status === 429 && authUser?.role === "guest"){
                    setisLimitReached(true);
                }
            }
        } finally {
            set({ isGettingTrendingSongs: false })
        }
    },

    
    getArtistList:async()=>{

        set({isGettingArtistsList:true});
        const {authUser} = useAuthStore.getState();
        const {setisLimitReached} = get();
        try {
            
            if(authUser?.role === "guest"){
                const res = await axiosInstance.get("/api/v1/public/getartists")
                set({artists:res.data?.artists})
            }else{
                const res = await axiosInstance.get("/api/v1/user/getartists")
                set({artists:res.data?.artists})
            }
        } catch (error) {
            if(error instanceof AxiosError){
                if(error.status === 429 && authUser?.role === "guest"){
                    setisLimitReached(true);
                }
            }
        }finally{
            set({isGettingArtistsList:false})
        }
    },

    getAllSongs:()=>{
        const {recentSongs,trendingSongs,recommendedSongs} = get();
        const allSongsSet:Set<song> = new Set();

        for(const s of recentSongs){
            allSongsSet.add(s);
        }
        for(const s of trendingSongs){
            allSongsSet.add(s);
        }
        for(const s of recommendedSongs){
            allSongsSet.add(s);
        }

        const uniqueSongs:song[] = [];
        for(const s of allSongsSet){
            uniqueSongs.push(s)  
        }

        set({AllSongs:uniqueSongs})
    },

    setisLimitReached:(value)=>{
        set({isLimitReached:value})
    }
}));