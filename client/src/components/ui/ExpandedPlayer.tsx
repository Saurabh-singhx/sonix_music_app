import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronDown,
  Shuffle,
  Repeat,
  Volume2,
  Heart,
  ListMusic,
  Share2,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent } from './SheetVariants';
import { ScrollArea } from './ScrollArea';
import type { Variants, Transition } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '@/store/player/player.store';

interface ExpandedPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (value: number) => void;
  progress:number;
  duration:number;
  currentTime:string;
  playing:boolean;
}

// FIX: Explicitly type the transition to satisfy TypeScript
const springTransition: Transition = {
  type: "spring", // Literal type "spring"
  stiffness: 100,
  damping: 20
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: springTransition
  }
};

const queueVariants: Variants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};


export const ExpandedPlayer: React.FC<ExpandedPlayerProps> = ({
  isOpen,
  onClose,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  currentTime,
  playing,
  progress,
  duration
}) => {
  const [showQueue, setShowQueue] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [isLiked, setIsLiked] = useState(false);
  const { queue, setCurrent, currentTrack, currentSongindex } = usePlayerStore();

  // Handle responsive queue visibility
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!currentTrack) return null;
  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="h-screen p-0 bg-background/95 backdrop-blur-xl border-none rounded-none overflow-hidden"
      >
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[100px]" />
        </div>

        <motion.div
          className="flex flex-col h-full relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between p-6"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-white/10"
            >
              <ChevronDown className="w-6 h-6" />
            </Button>

            <div className="flex flex-col items-center">
              <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Now Playing</span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowQueue(!showQueue)}
                className={`rounded-full transition-colors ${showQueue ? 'text-primary bg-primary/10' : 'hover:bg-white/10'}`}
              >
                <ListMusic className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>

          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

            {/* Main Player Area */}
            <motion.div
              className={`
                flex-1 flex flex-col items-center justify-center p-6 relative transition-all duration-500 ease-in-out
                ${showQueue && isMobile ? 'hidden' : 'flex'}
                lg:flex
              `}
            >
              {/* Album Art Container with Visualizer Rings */}
              <div className="relative mb-10 group">
                {/* Outer Glow Ring */}
                <motion.div
                  animate={playing ? {
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.6, 0.3],
                  } : {
                    scale: 1,
                    opacity: 0.1,
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -inset-4 rounded-3xl border-2 border-primary/30 blur-sm"
                />

                {/* Middle Ring */}
                <motion.div
                  animate={playing ? {
                    scale: [1, 1.08, 1],
                    rotate: [0, 90, 0],
                    opacity: [0.2, 0.5, 0.2]
                  } : {
                    scale: 1,
                    rotate: 0,
                    opacity: 0.05
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-8 rounded-[2rem] border border-dashed border-secondary/50"
                />

                {/* Inner Pulse Ring */}
                <motion.div
                  animate={playing ? {
                    scale: [1, 1.02, 1],
                    opacity: [0.5, 0.8, 0.5]
                  } : {
                    scale: 1,
                    opacity: 0.2
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -inset-1 rounded-2xl bg-linear-to-tr from-primary/20 to-secondary/20 blur-md -z-10"
                />

                {/* Main Album Art */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-2xl bg-linear-to-br from-card to-muted shadow-2xl flex items-center justify-center overflow-hidden relative border border-white/5"
                >
                  {/* Placeholder Art Content */}
                  <div className="absolute inset-0 bg-linear-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20" />
                  <motion.div
                    animate={playing ? { rotate: 360 } : { rotate: 0 }}
                    transition={playing ? { duration: 20, repeat: Infinity, ease: "linear" } : {}}
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-background/10 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-inner"
                  >
                    {/* <span className="text-6xl sm:text-7xl font-bold text-white/90 select-none">
                        
                      </span> */}

                    <img
                      src={currentTrack?.cover_image_url || "/placeholder-cover.png"}
                      alt={currentTrack?.song_title ?? "cover"}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/placeholder-cover.png";
                      }}
                    />

                  </motion.div>
                </motion.div>
              </div>

              {/* Track Info */}
              <motion.div variants={itemVariants} className="text-center mb-8 w-full max-w-md space-y-2">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight truncate text-transparent bg-clip-text bg-linear-to-r from-white to-white/70">
                  {currentTrack.song_title}
                </h2>
                <p className="text-lg text-muted-foreground font-medium truncate">
                  {currentTrack.artist.artist_name}
                </p>
              </motion.div>

              {/* Progress */}
              <motion.div variants={itemVariants} className="w-full max-w-md mb-8 space-y-2">
                <Slider
                  value={[progress]}
                  max={100}
                  step={0.1}
                  onValueChange={(val) => onSeek(val[0])}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-xs font-medium text-muted-foreground tabular-nums">
                  <span>{currentTime}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </motion.div>

              {/* Main Controls */}
              <motion.div variants={itemVariants} className="flex items-center justify-center gap-6 sm:gap-8 w-full max-w-md mb-8">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full w-12 h-12 transition-all">
                  <Shuffle className="w-5 h-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onPrevious}
                  className="text-foreground hover:text-primary hover:bg-primary/10 rounded-full w-14 h-14 transition-all"
                >
                  <SkipBack className="w-8 h-8 fill-current" />
                </Button>

                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button
                    onClick={onPlayPause}
                    size="icon"
                    className="w-20 h-20 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 flex items-center justify-center transition-all hover:scale-105"
                  >
                    {playing ? (
                      <Pause className="w-8 h-8 fill-current" />
                    ) : (
                      <Play className="w-8 h-8 fill-current ml-1" />
                    )}
                  </Button>
                </motion.div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onNext}
                  className="text-foreground hover:text-primary hover:bg-primary/10 rounded-full w-14 h-14 transition-all"
                >
                  <SkipForward className="w-8 h-8 fill-current" />
                </Button>

                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full w-12 h-12 transition-all">
                  <Repeat className="w-5 h-5" />
                </Button>
              </motion.div>

              {/* Bottom Actions (Like, Volume) */}
              <motion.div variants={itemVariants} className="flex items-center justify-between w-full max-w-md px-4">
                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsLiked(!isLiked)}
                    className={`rounded-full transition-colors ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-full">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex items-center gap-3 group">
                  <Volume2 className="w-5 h-5 text-muted-foreground" />
                  <div className="w-24 sm:w-32">
                    <Slider
                      value={volume}
                      max={100}
                      step={1}
                      onValueChange={setVolume}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Queue Sidebar */}
            <AnimatePresence>
              {(showQueue || !isMobile) && (
                <motion.div
                  variants={queueVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`
                    absolute inset-0 lg:static lg:inset-auto z-20
                    flex-col w-full lg:w-100 xl:w-112.5 
                    bg-background/80 backdrop-blur-2xl lg:bg-transparent lg:backdrop-blur-none
                    border-l border-border/50
                    ${showQueue ? 'flex' : 'hidden lg:flex'}
                  `}
                >
                  <div className="p-6 border-b border-border/50 flex items-center justify-between bg-background/50 lg:bg-transparent">
                    <div>
                      <h3 className="text-xl font-bold">Up Next</h3>
                      <p className="text-sm text-muted-foreground">{queue.length} tracks in queue</p>
                    </div>
                    {/* Mobile Close Queue Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="lg:hidden rounded-full"
                      onClick={() => setShowQueue(false)}
                    >
                      Close
                    </Button>
                  </div>

                  <ScrollArea className="flex-1 px-4 py-2">
                    <div className="space-y-1">
                      {queue?.map((track, index) => {
                        const isActive = currentSongindex === index;
                        return (
                          <motion.button
                            key={track.song_id}
                            layout
                            onClick={() => {
                              if (currentTrack) {
                                setCurrent(track, progress);
                              } else {
                                setCurrent(track)
                              }

                              if (isMobile) setShowQueue(false);
                            }}
                            className={`
                              w-full flex items-center gap-4 p-3 rounded-xl transition-all text-left group relative overflow-hidden
                              ${isActive
                                ? 'bg-primary/10 border border-primary/20'
                                : 'hover:bg-accent/50 border border-transparent'
                              }
                            `}
                          >
                            {/* Active Indicator Bar */}
                            {isActive && (
                              <motion.div
                                layoutId="activeIndicator"
                                className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                              />
                            )}

                            {/* Track Number / Visualizer */}
                            <div className={`
                              w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-medium text-sm
                              ${isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground group-hover:bg-background'
                              }
                            `}>
                              {isActive && playing ? (
                                <div className="flex gap-0.5 items-end h-4">
                                  {[1, 2, 3].map(i => (
                                    <motion.div
                                      key={i}
                                      animate={{ height: [4, 16, 8, 16, 4] }}
                                      transition={{
                                        duration: 0.5,
                                        repeat: Infinity,
                                        delay: i * 0.1,
                                        ease: "easeInOut"
                                      }}
                                      className="w-1 bg-current rounded-full"
                                    />
                                  ))}
                                </div>
                              ) : (
                                <span>{index + 1}</span>
                              )}
                            </div>

                            {/* Track Details */}
                            <div className="min-w-0 flex-1">
                              <p className={`font-semibold truncate ${isActive ? 'text-primary' : 'text-foreground'}`}>
                                {track.song_title}
                              </p>
                              <p className="text-sm text-muted-foreground truncate">
                                {track.artist.artist_name}
                              </p>
                            </div>

                            {/* Duration / Options */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground tabular-nums">
                                {track.duration || '0:00'}
                              </span>
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
};