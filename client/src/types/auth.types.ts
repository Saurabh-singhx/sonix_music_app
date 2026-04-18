
export interface user {
    user_id: string,
    user_email: string,
    user_name: string,
    user_profile_pic: string,
    gender: string,
    date_of_birth: Date,
    role: string,
}

export interface LoginPayload {
    email: string,
    password: string
}

export interface SignupPayload {
    email: string;
    password: string;
    name: string;
    gender: string;
    otp: string;
    dob: string;
}

export interface otpPayload{
    email:string
}

export interface AuthStoreT {
    authUser: user | null;
    isLoggingIn: boolean;
    isLoggingOut: boolean;
    isSigningUp:boolean;
    isSendingOtp:boolean;
    isCreatingGuest:boolean;
    isCheckingAuth:boolean;

    login: (data: LoginPayload) => Promise<number | undefined>;
    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;
    signup: (data:SignupPayload) => Promise<number | undefined>;
    sendOtp: (data:otpPayload) => Promise<number | undefined>;
    constinueAsGuest: () => Promise<number | undefined>;
    setAuthUser:(data:user)=>void;
}