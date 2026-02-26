import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import {
    Verified,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/user/user.store';
import AnimatedList from '@/components/ui/AnimatedList';
import type { song } from '@/types/user.types';
import { usePlayerStore } from '@/store/player/player.store';
import { useOutletContext } from 'react-router-dom';

/**
 * SpotlightCard: A wrapper that adds a dynamic spotlight effect on hover
 */
const SpotlightCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            className={cn(
                "relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm",
                className
            )}
        >
            {/* Spotlight Gradient */}
            <div
                className="pointer-events-none absolute -inset-px transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`,
                }}
            />
            {children}
        </div>
    );
};

/**
 * MagneticButton: A button that slightly moves towards the cursor
 */
const MagneticButton = ({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => {
    const ref = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 150 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        x.set((clientX - centerX) / 4);
        y.set((clientY - centerY) / 4);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{ x: springX, y: springY }}
            className={cn("relative group", className)}
        >
            {children}
        </motion.button>
    );
};

interface LayoutContext{
  playing: boolean;
  currentTime:string;
  duration:number;
};

export default function ArtistProfilePage() {
    const [isFollowing, setIsFollowing] = useState(false);
    const { currentArtist, getCurrentArtistSongs,currentArtistSongs} = useUserStore();
    const {setCurrent,setQueue} = usePlayerStore();
    const { playing,currentTime,duration} = useOutletContext<LayoutContext>();

    useEffect(() => {

        if (currentArtist?.artist_id) {
            getCurrentArtistSongs(currentArtist?.artist_id)
        }

    }, [currentArtist])

    const handleplayer = (item: song) => {
            setQueue(currentArtistSongs)
            setCurrent(item)
            // console.log(playing);
        }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 selection:text-white flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">

            {/* Background Ambience */}
            

            {/* Main Card Container - Full Width, 20-30% Height */}
            <div className="w-full z-10">
                <SpotlightCard className="w-full h-auto min-h-45 sm:h-[22vh] md:h-[25vh] max-h-75 flex flex-col sm:flex-row items-center p-4 sm:p-6 md:p-8 gap-4 sm:gap-6 md:gap-10 shadow-2xl">

                    {/* Left: Profile Image Section */}
                    <div className="relative shrink-0 group">
                        <div className="absolute -inset-1 bg-linear-to-r from-white/20 to-white/5 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-white/10 shadow-xl">
                            <img
                                src={currentArtist?.artist_profilePic}
                                alt={currentArtist?.artist_name}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out transform group-hover:scale-110"
                            />
                            {/* Verified Badge Overlay */}
                            <div className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 bg-black rounded-full p-0.5 sm:p-1 border border-white/20">
                                <Verified className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-white fill-white" />
                            </div>
                        </div>
                    </div>

                    {/* Middle: Info Section */}
                    <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left space-y-1 sm:space-y-2 min-w-0">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-center gap-2 sm:gap-3"
                        >
                            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-b from-white to-white/60 truncate">
                                {currentArtist?.artist_name}
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-neutral-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-2 md:line-clamp-3"
                        >
                            {currentArtist?.artist_bio}
                        </motion.p>
                    </div>

                    {/* Right: Follow Button Only */}
                    <div className="flex items-center justify-center sm:justify-end w-full sm:w-auto mt-2 sm:mt-0">
                        <MagneticButton
                            onClick={() => setIsFollowing(!isFollowing)}
                            className={cn(
                                "px-6 sm:px-8 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 border whitespace-nowrap",
                                isFollowing
                                    ? "bg-white text-black border-white hover:bg-neutral-200"
                                    : "bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/60"
                            )}
                        >
                            {isFollowing ? 'Following' : 'Follow'}
                        </MagneticButton>
                    </div>
                </SpotlightCard>
            </div>

            <AnimatedList
                className=""
                itemClassName=""
                items={currentArtistSongs}
                onItemSelect={(item) => handleplayer(item)}
                showGradients
                enableArrowNavigation
                displayScrollbar
                currentTime={currentTime}
                duration={duration}
                playing={playing}
            />
        </div>
    );
}