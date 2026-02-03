import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from 'framer-motion';

/**
 * Input Field Component with Floating Label
 */
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
  error?: string;
}

export const InputField = ({ label, icon, error, className, ...props }: InputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(e.target.value.length > 0);
    props.onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    props.onChange?.(e);
  };

  const isActive = isFocused || hasValue;

  return (
    <div className={cn("relative group", className)}>
      <div className={cn(
        "absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300",
        isActive ? "text-indigo-400" : "text-slate-500"
      )}>
        {icon}
      </div>
      
      <input
        {...props}
        className={cn(
          "w-full bg-slate-900/50 border border-slate-700 rounded-xl py-4 pl-10 pr-4 text-slate-100 placeholder-transparent focus:outline-none transition-all duration-300",
          "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 focus:bg-slate-900/80",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/50"
        )}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder={label} // Used for accessibility, visually hidden by CSS if needed or just placeholder logic
      />

      <label
        className={cn(
          "absolute left-10 transition-all duration-300 pointer-events-none origin-left",
          isActive 
            ? "-top-2.5 text-xs text-indigo-400 bg-slate-950 px-1 rounded" 
            : "top-1/2 -translate-y-1/2 text-slate-500 text-base"
        )}
      >
        {label}
      </label>

      {/* Animated underline/border effect */}
      <motion.div 
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500"
        initial={{ width: "0%" }}
        animate={{ width: isFocused ? "100%" : "0%" }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
};