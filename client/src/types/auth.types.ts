
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

export interface AuthStoreT {
    authUser: user | null,
    isLoggingIn: boolean,

    login: (data: LoginPayload) => Promise<void>;
    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;
}