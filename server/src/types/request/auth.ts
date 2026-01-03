// src/types/requests/auth.ts
export interface SignupBody {
  email: string;
  password: string;
  name: string;
  gender: string;
  otp: string;
  dob?: string;
}

export interface LoginBody{
  email:string;
  password:string;
}