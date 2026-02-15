import { create } from "zustand";
import { axiosInstance } from "../../lib/axios";
import type { userStoreT } from "@/types/user.types";
import { useAuthStore } from "../auth/auth.store";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export const useUserStore = create<userStoreT>((set, get) => ({


    recentSongs: [],
    isGettingSongs: false,
    nextCursor: null,
    trendingSongs:[],
    recommendedSongs:[],
    recentlyPlayedSongs:[],

    getRecentSongs: async (limit, cursor) => {

        set({ isGettingSongs: true });
        const { authUser } = useAuthStore.getState();
        const { nextCursor, recentSongs } = get();
        try {

            if (authUser?.role === "guest") {
                const res = await axiosInstance.get("/api/v1/public/getsongs",
                    {
                        params: {
                            limit: limit,
                            ...(nextCursor && { cursor: cursor })
                        }
                    }
                )

                set({ recentSongs: [...recentSongs, ...res.data?.songs] })
                console.log(res.data.songs)
            } else {
                const res = await axiosInstance.get("/api/v1/user/recent-songs",
                    {
                        params: {
                            limit: limit,
                            ...(nextCursor && { cursor: cursor })
                        }
                    }
                )

                set({ recentSongs: [...recentSongs, ...res.data?.songs] })
            }
        } catch (error) {
            let errorMessage: string = "error while getting recent added songs"
                       if (error instanceof AxiosError) {
                           errorMessage =
                               error.response?.data?.message ?? error.message;
                       }
                       toast.error(errorMessage)
        } finally {
            set({ isGettingSongs: false })
        }
    }

}));