import { create } from "zustand";
import { axiosInstance } from "../../lib/axios";
import type { AuthStoreT } from "../../types/auth.types";
import { toast } from "react-toastify";
import { useAdminStore } from "../admin/admin.store";
import { AxiosError } from "axios";
import { useUserStore } from "../user/user.store";



export const useAuthStore = create<AuthStoreT>((set,get) => ({

    authUser: null,
    isLoggingIn: false,
    isLoggingOut: false,
    isSigningUp: false,
    isSendingOtp: false,
    isCreatingGuest: false,
    isCheckingAuth:false,

    login: async (data) => {
        set({ isLoggingIn: true });

        try {
            const res = await axiosInstance.post("/api/v1/auth/login", data);
            set({ authUser: res.data?.userData });
            toast.success(res.data.message);
            return res.status;
        } catch (error) {
            let errorMessage: string = "login failed try again later"
            if (error instanceof AxiosError) {
                errorMessage =
                    error.response?.data?.message ?? error.message;
            }
            toast.error(errorMessage)
        } finally {
            set({ isLoggingIn: false });
        }
    },

    checkAuth: async () => {
        set({isCheckingAuth:true})
        const {authUser} = get();
        const {setisLimitReached} = useUserStore.getState();
        try {
            const res = await axiosInstance.get("/api/v1/auth/checkauth");
            set({ authUser: res.data?.userData });
        } catch (error) {
            if(error instanceof AxiosError){
                if(error.status === 429 && authUser?.role === "guest"){
                    setisLimitReached(true);
                }
            }
        }finally{
            set({isCheckingAuth:false})
        }
    },

    logout: async () => {

        set({ isLoggingOut: true })
        const {authUser} = get();
        try {
            
            if(authUser?.role === "guest"){
                set({authUser:null})
                return;
            }
            await axiosInstance.post("/api/v1/auth/logout");
            useAdminStore.getState().cleanAfterLogOut();
            set({ authUser: null })
        } catch (error) {
             let errorMessage: string = "logout failed try again later"
            if (error instanceof AxiosError) {
                errorMessage =
                    error.response?.data?.message ?? error.message;
            }
            toast.error(errorMessage)
        } finally {
            set({ isLoggingOut: false })
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });

        try {
            const res = await axiosInstance.post("/api/v1/auth/signup", data);

            set({ authUser: res.data.userData });
            toast.success(res.data.message);
            return res.status;
        } catch (error) {
             let errorMessage: string = "signup failed try again later"
            if (error instanceof AxiosError) {
                errorMessage =
                    error.response?.data?.message ?? error.message;
            }
            toast.error(errorMessage)
        } finally {
            set({ isSigningUp: false })
        }
    },

    sendOtp: async (data) => {
        set({ isSendingOtp: true });
        try {
            const res = await axiosInstance.post("/api/v1/auth/otp", data);
            toast.success(res.data.message);
            return res.status;
        } catch (error) {
             let errorMessage: string = "failed to send otp try again later"
            if (error instanceof AxiosError) {
                errorMessage =
                    error.response?.data?.message ?? error.message;
            }
            toast.error(errorMessage)
        } finally {
            set({ isSendingOtp: false })
        }
    },

    constinueAsGuest: async () => {
        set({ isCreatingGuest: true });

        try {
            const res = await axiosInstance.post("/api/v1/public/ragister-guest");
            set({ authUser: res.data?.userData });
            toast.success(res.data.message);
            return res.status;
        } catch (error) {
            let errorMessage: string = "failed to create guest try again later"
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.message ?? error.message;
                if(error.status === 429){
                    toast.error("you have reached your limit for creating guest accounts")
                }
                return error.status;
            }else{
                toast.error(errorMessage);
            }
            
        }finally{
            set({isCreatingGuest:false})
        }
    }

}));