import { useState, type ChangeEvent } from "react";
import { Mail, Lock, ArrowRight, UserCircle, } from 'lucide-react';
import { motion} from 'framer-motion';

import { BackgroundOrbs } from "@/components/ui/BackgroundOrbs";
import { InputField } from "@/components/ui/InputField";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth/auth.store";
import type { LoginPayload } from "@/types/auth.types";
import AuthMusiCard from "@/components/ui/AuthMusiCardAnimate";


export default function LoginPage() {
  const [loginForm, setLoginForm] = useState<LoginPayload>({
    email:'',
    password:''
  })
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const {login,isLoggingIn,constinueAsGuest,isCreatingGuest} = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!loginForm.email || !loginForm.password) {
      setError('Please fill in all fields');
      return;
    }

     const res = await login(loginForm);
     
     if(res === 200){
      setLoginForm({
        email:'',
        password:''
      })
     }
  };
  const SetFormData = (e: ChangeEvent<HTMLInputElement>)=>{
    setLoginForm((prev)=>({...prev,[e.target.name]:e.target.value}))
  }

  const handleSignupPageRedirect = ()=>{
    navigate("/signup")
  }

  const handleGuestLogin = async()=>{

    const res = await constinueAsGuest();
    
    if(res === 429){
      //add create account logic
    }
  }

  const handleGoogleLogin = ()=>{
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/google`;
  }

  return (
    <div className="min-h-screen bg-black text-slate-200 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-indigo-500/30">
      <BackgroundOrbs/>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 z-10">
        
        {/* Left Side - Branding & Visuals */}
        <AuthMusiCard/>

        {/* Right Side - Login Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-md mx-auto lg:max-w-none flex flex-col justify-center"
        >
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-8 rounded-3xl shadow-2xl">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-slate-400">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField 
                label="Email Address"
                name="email"
                type="email"
                icon={<Mail className="w-5 h-5" />}
                value={loginForm.email}
                onChange={SetFormData}
                error={error && !loginForm.email ? error : undefined}
              />

              <div className="space-y-2">
                <InputField 
                  label="Password"
                  name="password"
                  type="password"
                  icon={<Lock className="w-5 h-5" />}
                  value={loginForm.password}
                  onChange={SetFormData}
                  error={error && !loginForm.password ? error : undefined}
                />
                <div className="flex justify-end">
                  <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoggingIn || isCreatingGuest}
                className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoggingIn || isCreatingGuest? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  </motion.div>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-8 flex flex-col gap-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-900 text-slate-500">Or continue with</span>
                </div>
              </div>

              {/* <div className="mt-6 grid grid-cols-2 gap-4"> */}
                <motion.button
                  onClick={handleGoogleLogin}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors w-full cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-sm font-medium">Google</span>
                </motion.button>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGuestLogin}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl transition-colors text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  <UserCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Continue as Guest</span>
                </motion.button>
              {/* </div> */}
            </div>

            <p className="mt-8 text-center text-sm text-slate-500">
              Don't have an account?{' '}
              {/* <a href="#" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                Sign up for free
              </a> */}
              <button 
              onClick={handleSignupPageRedirect}
              className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer" >Sign up for free</button>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Footer / Decorative Elements */}
      <div className="fixed bottom-4 left-0 w-full flex justify-center gap-6 text-slate-600 text-xs z-10">
        <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
        <span>•</span>
        <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
        <span>•</span>
        <a href="#" className="hover:text-slate-400 transition-colors">Support</a>
      </div>
    </div>
  );
}