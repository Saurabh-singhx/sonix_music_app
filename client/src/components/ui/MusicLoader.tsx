import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Disc, Music, Play, Pause, SkipForward, Volume2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for cleaner tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

/**
 * GlitchText: A text component that simulates a digital glitch effect
 */
const GlitchText = ({ text, className }: { text: string; className?: string }) => {
  return (
    <div className={cn("relative inline-block group", className)}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-red-500 opacity-0 group-hover:opacity-70 animate-pulse translate-x-[2px]">
        {text}
      </span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-blue-500 opacity-0 group-hover:opacity-70 animate-pulse -translate-x-[2px]">
        {text}
      </span>
    </div>
  );
};

/**
 * VinylRecord: The spinning record animation
 */
const VinylRecord = ({ isPlaying }: { isPlaying: boolean }) => {
  return (
    <motion.div
      className="relative w-64 h-64 rounded-full bg-neutral-900 border-4 border-neutral-800 shadow-2xl flex items-center justify-center"
      animate={{ rotate: isPlaying ? 360 : 0 }}
      transition={{ 
        repeat: Infinity, 
        duration: 3, 
        ease: "linear",
        repeatType: "loop"
      }}
    >
      {/* Grooves */}
      <div className="absolute inset-2 rounded-full border border-neutral-800 opacity-50" />
      <div className="absolute inset-4 rounded-full border border-neutral-800 opacity-50" />
      <div className="absolute inset-8 rounded-full border border-neutral-800 opacity-50" />
      <div className="absolute inset-12 rounded-full border border-neutral-800 opacity-50" />
      <div className="absolute inset-16 rounded-full border border-neutral-800 opacity-50" />
      
      {/* Label */}
      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-neutral-200 to-white" />
        <Music className="w-8 h-8 text-black relative z-10" />
        <div className="absolute w-3 h-3 bg-black rounded-full z-20" />
      </div>
    </motion.div>
  );
};

/**
 * ToneArm: The swinging needle arm
 */
const ToneArm = ({ isPlaying }: { isPlaying: boolean }) => {
  return (
    <motion.div
      className="absolute -top-12 -right-12 w-4 h-48 bg-neutral-300 origin-top rounded-full shadow-lg z-20"
      initial={{ rotate: -45 }}
      animate={{ rotate: isPlaying ? -25 : -45 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {/* Pivot */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-neutral-400 rounded-full border-4 border-neutral-600 shadow-md z-30" />
      {/* Arm Body */}
      <div className="w-full h-full bg-gradient-to-b from-neutral-200 via-neutral-300 to-neutral-400 rounded-full" />
      {/* Needle Head */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-8 bg-neutral-800 rounded-sm" />
    </motion.div>
  );
};

/**
 * Visualizer: Audio wave simulation
 */
const Visualizer = ({ isPlaying }: { isPlaying: boolean }) => {
  const bars = [1, 2, 3, 4, 5, 6, 7, 8];
  
  return (
    <div className="flex items-end justify-center gap-1 h-12 mt-8">
      {bars.map((bar) => (
        <motion.div
          key={bar}
          className="w-2 bg-white rounded-t-sm"
          animate={{
            height: isPlaying ? [10, 40, 15, 50, 20] : 4,
            opacity: isPlaying ? 1 : 0.3
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: bar * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

/**
 * Main Loader Component
 */
export default function MusicLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Simulate loading progress
  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleRestart = () => {
    setProgress(0);
    setIsLoading(true);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-mono selection:bg-white selection:text-black">
      
      {/* Main Card Container */}
      <div className="relative w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-3xl p-8 shadow-2xl overflow-hidden">
        
        {/* Background Noise Texture (CSS Pattern) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
             style={{ 
               backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
             }}
        />

        {/* Header */}
        <div className="flex justify-between items-center mb-12 relative z-10">
          <div className="flex items-center gap-2">
            <Disc className="w-5 h-5 animate-spin-slow" />
            <span className="text-xs font-bold tracking-widest uppercase text-neutral-400">Sonic Void</span>
          </div>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
            <div className="w-1 h-1 bg-white rounded-full animate-pulse delay-75" />
            <div className="w-1 h-1 bg-white rounded-full animate-pulse delay-150" />
          </div>
        </div>

        {/* Record Player Area */}
        <div className="relative flex justify-center mb-10">
          <div className="relative">
            {/* Platter Base */}
            <div className="absolute -inset-4 bg-neutral-900 rounded-full border border-neutral-800 shadow-inner" />
            
            {/* The Record */}
            <VinylRecord isPlaying={isLoading && progress < 100} />
            
            {/* The Tone Arm */}
            <ToneArm isPlaying={isLoading && progress < 100} />
          </div>
        </div>

        {/* Status & Visuals */}
        <div className="space-y-6 relative z-10">
          <div className="text-center space-y-2">
            <motion.h2 
              className="text-2xl font-bold tracking-tighter"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {progress < 100 ? (
                <GlitchText text="BUFFERING AUDIO..." />
              ) : (
                <span className="text-white">READY TO PLAY</span>
              )}
            </motion.h2>
            <p className="text-neutral-500 text-sm">
              {progress < 100 ? `Syncing track data... ${progress}%` : "Track loaded successfully"}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.1 }}
            />
          </div>

          {/* Visualizer */}
          <Visualizer isPlaying={isLoading && progress < 100} />

          {/* Controls */}
          <div className="flex justify-center items-center gap-6 pt-4">
            <button className="p-3 rounded-full hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-white">
              <SkipForward className="w-5 h-5 rotate-180" />
            </button>
            
            <button 
              onClick={() => setIsLoading(!isLoading)}
              className="p-4 rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              {isLoading && progress < 100 ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-1" />
              )}
            </button>

            <button className="p-3 rounded-full hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-white">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 flex justify-between items-end text-[10px] text-neutral-600 uppercase tracking-widest">
          <div>
            <p>Bitrate: 320kbps</p>
            <p>Format: FLAC</p>
          </div>
          <div className="flex items-center gap-2">
            <Volume2 className="w-3 h-3" />
            <div className="w-16 h-1 bg-neutral-800 rounded-full overflow-hidden">
               <div className="w-2/3 h-full bg-neutral-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Restart Button (Demo Purposes) */}
      <button 
        onClick={handleRestart}
        className="mt-12 text-neutral-500 hover:text-white text-sm border-b border-transparent hover:border-white transition-all pb-1"
      >
        Restart Simulation
      </button>

    </div>
  );
}