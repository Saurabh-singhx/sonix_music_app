import { create } from "zustand";
import { axiosInstance } from "../../lib/axios";
import type { AuthStoreT } from "../../types/auth.types";



export const useAuthStore = create<AuthStoreT>((set) =>({

    authUser:null,
    isLoggingIn:false,

    login:async(data)=> {
        set({isLoggingIn:true});

        try {
            const res = await axiosInstance.post("/api/v1/auth/login",data);
            set({authUser: res.data?.userData});

        } catch (error) {
            console.log("error while logging in",error)
        }finally{
            set({isLoggingIn:false});
        }
    },

    checkAuth:async()=>{
        try {
            const res = await axiosInstance.get("/api/v1/auth/checkauth");
            set({authUser:res.data?.userData});
            console.log(res.data)
        } catch (error) {
            console.log("error while checking Auth",error);
        }
    },

    logout:async()=>{

        try {
            await axiosInstance.post("/api/v1/auth/logout");
        } catch (error) {
            console.log("error while logging out",error);
        }
    }


}));