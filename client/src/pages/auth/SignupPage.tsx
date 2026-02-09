import  { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import type { Variants } from "framer-motion"
import {
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  User,
  Calendar,
  Check,
  ShieldCheck,
  UserCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import AuthMusiCard from '@/components/AuthMusiCardAnimate';
import { BackgroundOrbs } from '@/components/BackgroundOrbs';
import { InputField } from '@/components/InputField';
import { GenderCard } from '@/components/GenderCard';
import { OTPInput } from '@/components/OtpInput';
import { useAuthStore } from '@/store/auth/auth.store';
import type { SignupPayload } from '@/types/auth.types';


export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()

  const { signup ,sendOtp,isSendingOtp,isSigningUp,constinueAsGuest,isCreatingGuest} = useAuthStore();

  const [formData, setFormData] = useState<SignupPayload>({
    email: '',
    password: '',
    name: '',
    dob: '',
    gender: '',
    otp: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (step === 3 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleResend = () => {
    setCountdown(60);
    setCanResend(false);
    sendOtp({
      email:formData.email
    })
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.password) newErrors.password = "Password is required";
      if (formData.password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
      if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    }

    if (step === 2) {
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.dob) newErrors.dob = "Date of birth is required";
      if (!formData.gender) newErrors.gender = "Please select a gender";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async() => {
    if (validateStep()) {
      if (step === 2) {
        const res = await sendOtp({
          email:formData.email
        });

        if(res === 200){
          
        }
      }
      setStep(step + 1);

    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {

    const res = await signup(formData);
    if (res === 201) {
      setFormData({
        email: '',
        password: '',
        name: '',
        dob: '',
        gender: '',
        otp: ''
      });
      setConfirmPassword("");
    }
  };

  const handleOtpComplete = (otp: string) => {
    setFormData({ ...formData, otp });
  };

  const handleGuestLogin = async() => {
    const res = await constinueAsGuest();
    if(res === 429){
      //add create account card
    }
  };

  const handleGoogleLogin = async()=>{
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/google`;
  }

  // Properly typed variants
  const containerVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-200 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-indigo-500/30">
      <BackgroundOrbs />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 z-10">

        {/* Left Side - Branding & Visuals */}
        {/* <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:flex flex-col justify-between p-8 bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-3xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Disc className="w-7 h-7 text-white animate-spin-slow" />
              </div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                SonicFlow
              </h1>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Join the ultimate music experience. Create your account today and unlock a world of high-fidelity sound.
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center py-12">
            <div className="relative w-64 h-64">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-full h-full rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center"
              >
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-sm flex items-center justify-center">
                  <Music className="w-16 h-16 text-indigo-400/50" />
                </div>
              </motion.div>
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 w-6 h-6 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50" />
              </motion.div>
            </div>
          </div>

          <div className="flex justify-center gap-2 h-16 items-end">
            {[...Array(8)].map((_, i) => (
              <VisualizerBar key={i} delay={i * 0.15} />
            ))}
          </div>
        </motion.div> */}
        <AuthMusiCard />

        {/* Right Side - Signup Form - Same size as LoginCard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md mx-auto lg:max-w-none flex flex-col justify-center"
        >
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-8 rounded-3xl shadow-2xl">
            {/* Header & Progress */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {step === 1 && "Create Account"}
                    {step === 2 && "Personal Details"}
                    {step === 3 && "Verify Email"}
                  </h2>
                  <p className="text-slate-400">
                    {step === 1 && "Start your journey with us"}
                    {step === 2 && "Tell us a bit about yourself"}
                    {step === 3 && `We sent a code to ${formData.email}`}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-indigo-400 font-bold">Step {step}</span>
                  <span className="text-slate-600"> / 3</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-linear-to-r from-indigo-500 to-purple-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(step / 3) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
            </div>

            {/* Form Content */}
            <div className="relative min-h-60">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-5"
                  >
                    <InputField
                      label="Email Address"
                      type="email"
                      icon={<Mail className="w-5 h-5" />}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      error={errors.email}
                    />
                    <div className="grid grid-cols-1 gap-5">
                      <InputField
                        label="Password"
                        type="password"
                        icon={<Lock className="w-5 h-5" />}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        error={errors.password}
                      />
                      <InputField
                        label="Confirm Password"
                        type="password"
                        icon={<Lock className="w-5 h-5" />}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={errors.confirmPassword}
                      />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <InputField
                      label="Full Name"
                      type="text"
                      icon={<User className="w-5 h-5" />}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      error={errors.name}
                    />

                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <Input
                        // label="Date of birth"
                        // icon={<User className="w-5 h-5" />}
                        type="date"
                        className="w-full border border-slate-700 rounded-xl py-4 pl-10 pr-4 text-slate-100 focus:outline-none transition-all scheme-dark"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      />
                      {!formData.dob && (
                        <span className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">Date of Birth</span>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm text-slate-400 ml-1">Gender</label>
                      <div className="grid grid-cols-3 gap-4">
                        <GenderCard
                          selected={formData.gender === 'male'}
                          label="Male"
                          icon={<User className="w-5 h-5" />}
                          onClick={() => setFormData({ ...formData, gender: 'male' })}
                        />
                        <GenderCard
                          selected={formData.gender === 'female'}
                          label="Female"
                          icon={<User className="w-5 h-5" />}
                          onClick={() => setFormData({ ...formData, gender: 'female' })}
                        />
                        <GenderCard
                          selected={formData.gender === 'other'}
                          label="Other"
                          icon={<User className="w-5 h-5" />}
                          onClick={() => setFormData({ ...formData, gender: 'other' })}
                        />
                      </div>
                      {errors.gender && <p className="text-red-500 text-xs ml-1">{errors.gender}</p>}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-8 py-4"
                  >
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="w-8 h-8 text-indigo-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">Enter Verification Code</h3>
                      <p className="text-slate-400 text-sm">
                        We've sent a 6-digit code to your email.
                      </p>
                    </div>

                    <OTPInput length={6} onComplete={handleOtpComplete} />

                    <div className="text-center">
                      {canResend ? (
                        <button
                          onClick={handleResend}
                          className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                        >
                          Didn't receive it? Resend Code
                        </button>
                      ) : (
                        <p className="text-slate-500 text-sm">
                          Resend code in <span className="text-indigo-400 font-mono">{countdown}s</span>
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-between items-center">
              {step > 1 ? (
                <motion.button
                  whileHover={{ x: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBack}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-slate-800"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </motion.button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  disabled={isSendingOtp}
                  className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 px-8 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all disabled:opacity-70"
                >
                  {isSendingOtp ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Next Step</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={isSigningUp || formData.otp.length < 6}
                  className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-3 px-8 rounded-xl shadow-lg shadow-green-500/25 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSigningUp ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <Check className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              )}
            </div>

            {/* Social Login & Guest Options - Only show on Step 1 */}
            {step === 1 && (
              <div className="mt-6 space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-900 text-slate-500">Or sign up with</span>
                  </div>
                </div>

                <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors w-full cursor-pointer"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
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
              </div>
            )}

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              {/* <a href="#" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                Log in
              </a> */}

              <button
                onClick={() => navigate("/login")}
                className='font-medium text-indigo-400 hover:text-indigo-300 transition-colors'>Log in</button>
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


/**
 * Input Field Component with Floating Label
 */
// interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
//   label: string;
//   icon: React.ReactNode;
//   error?: string;
// }

// const InputField = ({ label, icon, error, className, ...props }: InputFieldProps) => {
//   const [isFocused, setIsFocused] = useState(false);
//   const [hasValue, setHasValue] = useState(false);

//   const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
//     setIsFocused(true);
//     props.onFocus?.(e);
//   };

//   const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
//     setIsFocused(false);
//     setHasValue(e.target.value.length > 0);
//     props.onBlur?.(e);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setHasValue(e.target.value.length > 0);
//     props.onChange?.(e);
//   };

//   const isActive = isFocused || hasValue;

//   return (
//     <div className={cn("relative group", className)}>
//       <div className={cn(
//         "absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300",
//         isActive ? "text-indigo-400" : "text-slate-500"
//       )}>
//         {icon}
//       </div>

//       <input
//         {...props}
//         className={cn(
//           "w-full bg-slate-900/50 border border-slate-700 rounded-xl py-4 pl-10 pr-4 text-slate-100 placeholder-transparent focus:outline-none transition-all duration-300",
//           "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 focus:bg-slate-900/80",
//           error && "border-red-500 focus:border-red-500 focus:ring-red-500/50"
//         )}
//         onFocus={handleFocus}
//         onBlur={handleBlur}
//         onChange={handleChange}
//         placeholder={label}
//       />

//       <label
//         className={cn(
//           "absolute left-10 transition-all duration-300 pointer-events-none origin-left",
//           isActive
//             ? "-top-2.5 text-xs text-indigo-400 bg-slate-950 px-1 rounded"
//             : "top-1/2 -translate-y-1/2 text-slate-500 text-base"
//         )}
//       >
//         {label}
//       </label>

//       <motion.div
//         className="absolute bottom-0 left-0 h-0.5 bg-linear-to-r from-indigo-500 to-purple-500"
//         initial={{ width: "0%" }}
//         animate={{ width: isFocused ? "100%" : "0%" }}
//         transition={{ duration: 0.3 }}
//       />
//     </div>
//   );
// };
