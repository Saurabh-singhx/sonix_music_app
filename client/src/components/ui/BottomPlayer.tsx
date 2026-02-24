import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayerStore } from '@/store/player/player.store';
import { useGlobalPlayer } from '@/hooks/usePlayer';

interface BottomPlayerProps {
    isPlaying: boolean;
    progress: number;
    onPlayPause: () => void;
    onNext: () => void;
    onPrevious: () => void;
    onExpand: () => void;
    onSeek: (value: number) => void;  // Single number, not array
    volume?: number;
    onVolumeChange?: (value: number) => void;
    setIsSeeking: (data: boolean) => void;
    setProgress: (data: number) => void;
}

export const BottomPlayer: React.FC<BottomPlayerProps> = ({
    isPlaying,
    progress,
    onPlayPause,
    onNext,
    onPrevious,
    onExpand,
    onSeek,
    volume = 1,
    onVolumeChange,
    setIsSeeking,
    setProgress

}) => {

    const { currentTrack } = usePlayerStore();
    const [isDragging, setIsDragging] = useState(false);
    const [localProgress, setLocalProgress] = useState(progress);
    const [showVolume, setShowVolume] = useState(false);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const { currentTime, duration } = useGlobalPlayer();

    // Sync local progress with global progress when not dragging
    useEffect(() => {
        if (!isDragging) {
            setLocalProgress(progress);
        }
    }, [progress, isDragging]);

    // Format time helper
    const formatTime = (seconds: number): string => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate progress from mouse/touch position
    const calculateProgress = useCallback((clientX: number): number => {
        if (!progressBarRef.current) return 0;
        const rect = progressBarRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        return Math.max(0, Math.min(100, percentage));
    }, []);

    // Mouse/Touch handlers for smooth seeking
    const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDragging(true);
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const newProgress = calculateProgress(clientX);
        setLocalProgress(newProgress);
        setIsSeeking(true)
    };

    const handleInteractionMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isDragging) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const newProgress = calculateProgress(clientX);
        setLocalProgress(newProgress);
    }, [isDragging, calculateProgress]);

    const handleInteractionEnd = useCallback(() => {
        if (isDragging) {
            setIsDragging(false);
            onSeek(localProgress);
            setIsSeeking(false)
            setProgress(localProgress);
        }
    }, [isDragging, localProgress, onSeek]);

    // Global event listeners for drag
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleInteractionMove);
            window.addEventListener('mouseup', handleInteractionEnd);
            window.addEventListener('touchmove', handleInteractionMove);
            window.addEventListener('touchend', handleInteractionEnd);

            return () => {
                window.removeEventListener('mousemove', handleInteractionMove);
                window.removeEventListener('mouseup', handleInteractionEnd);
                window.removeEventListener('touchmove', handleInteractionMove);
                window.removeEventListener('touchend', handleInteractionEnd);
            };
        }
    }, [isDragging, handleInteractionMove, handleInteractionEnd]);

    // Click to seek
    const handleClick = (e: React.MouseEvent) => {
        const newProgress = calculateProgress(e.clientX);
        setIsSeeking(true)
        onSeek(newProgress);
        setIsSeeking(false)
    };

    if (!currentTrack) return null;

    const displayProgress = isDragging ? localProgress : progress;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up cursor-pointer">
            {/* Glass morphism background */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border-t border-white/10" />

            {/* Progress bar section */}
            <div className="relative group/progress">
                {/* Time indicators - show on hover */}
                <div className="absolute -top-6 left-0 right-0 flex justify-between px-4 text-xs text-gray-400 font-mono opacity-0 group-hover/progress:opacity-100 transition-opacity duration-200">
                    <span>{currentTime}</span>
                    <span>{formatTime(duration)}</span>
                </div>

                {/* Interactive progress bar */}
                <div
                    ref={progressBarRef}
                    className="h-2 bg-white/10 cursor-pointer relative overflow-hidden"
                    onClick={handleClick}
                    onMouseDown={handleInteractionStart}
                    onTouchStart={handleInteractionStart}
                >
                    {/* Buffered progress (optional) */}
                    <div className="absolute inset-0 bg-white/5" />

                    {/* Current progress fill */}
                    <div
                        className={`h-full bg-white relative ${isDragging ? '' : 'transition-all duration-75 ease-out'}`}
                        style={{ width: `${displayProgress}%` }}
                    >
                        {/* Glow line at progress edge */}
                        <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,1)]" />
                    </div>

                    {/* Draggable handle - appears on hover/drag */}
                    <div
                        className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-200 -ml-2
                            ${isDragging ? 'opacity-100 scale-100' : 'opacity-0 scale-0 group-hover/progress:opacity-100 group-hover/progress:scale-100'}
                        `}
                        style={{ left: `${displayProgress}%` }}
                    />
                </div>
            </div>

            <div className="relative container max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between gap-4 py-3 sm:py-4">

                    {/* Track info - clickable to expand */}
                    <button
                        onClick={onExpand}
                        className="flex items-center gap-3 flex-1 min-w-0 text-left group/btn animate-fade-in"
                    >
                        {/* Album art with rotation animation when playing */}
                        <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 transition-all duration-500 ${isPlaying ? 'shadow-[0_0_20px_rgba(255,255,255,0.2)]' : ''}`}>
                            <div className={`w-full h-full ${isPlaying ? 'animate-spin-slow' : ''}`} style={{ animationDuration: '8s' }}>
                                <img
                                    src={currentTrack.cover_image_url}
                                    alt={currentTrack.song_title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-linear-to-tr from-black/40 to-transparent" />

                            {/* Playing indicator bars */}
                            {isPlaying && (
                                <div className="absolute bottom-1 right-1 flex gap-0.5 items-end h-3">
                                    <span className="w-0.5 bg-white animate-music-bar-1" />
                                    <span className="w-0.5 bg-white animate-music-bar-2" />
                                    <span className="w-0.5 bg-white animate-music-bar-3" />
                                </div>
                            )}
                        </div>

                        <div className="min-w-0 flex-1 space-y-0.5">
                            <p className="font-semibold text-sm text-white truncate group-hover/btn:text-gray-200 transition-colors">
                                {currentTrack.song_title}
                            </p>
                            <p className="text-xs text-gray-400 truncate group-hover/btn:text-gray-300 transition-colors">
                                {currentTrack.artist.artist_name}
                            </p>
                        </div>

                        {/* <ChevronUp className="w-5 h-5 text-gray-500 group-hover/btn:text-white transition-all duration-300 hidden sm:block group-hover/btn:-translate-y-1" /> */}
                    </button>

                    {/* Center Controls */}
                    <div className="flex items-center gap-2 sm:gap-4 animate-scale-in">
                        {/* Previous */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onPrevious}
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110 active:scale-95"
                        >
                            <SkipBack className="w-5 h-5 fill-current" />
                        </Button>

                        {/* Play/Pause */}
                        <div className="relative">
                            {isPlaying && (
                                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
                            )}
                            <Button
                                onClick={onPlayPause}
                                size="icon"
                                className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-black hover:bg-gray-200 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-white/20 ${isPlaying ? 'animate-pulse-subtle' : ''}`}
                            >
                                {isPlaying ? (
                                    <Pause className="w-6 h-6 fill-current" />
                                ) : (
                                    <Play className="w-6 h-6 fill-current ml-1" />
                                )}
                            </Button>
                        </div>

                        {/* Next */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onNext}
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110 active:scale-95"
                        >
                            <SkipForward className="w-5 h-5 fill-current" />
                        </Button>
                    </div>

                    {/* Right side - Time & Volume */}
                    <div className="hidden sm:flex items-center gap-4 min-w-35 justify-end">
                        {/* Time display - always visible */}
                        <div className="text-xs font-mono text-gray-400 tabular-nums">
                            <span className="text-white">{currentTime}</span>
                            <span className="mx-1 text-gray-600">/</span>
                            <span>{formatTime(duration)}</span>
                        </div>

                        {/* Volume control */}
                        {onVolumeChange && (
                            <div className="relative group/volume">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowVolume(!showVolume)}
                                    className="w-9 h-9 rounded-full text-gray-400 hover:text-white hover:bg-white/10"
                                >
                                    <Volume2 className="w-4 h-4" />
                                </Button>

                                {/* Volume slider popup */}
                                <div className={`absolute bottom-full right-0 mb-2 p-3 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl transition-all duration-300 w-32 ${showVolume ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                                    <div className="h-1 bg-white/20 rounded-full relative cursor-pointer group/volume-bar"
                                        onClick={(e) => {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const x = e.clientX - rect.left;
                                            const newVol = Math.max(0, Math.min(1, x / rect.width));
                                            onVolumeChange(newVol);
                                        }}
                                    >
                                        <div className="absolute inset-y-0 left-0 bg-white rounded-full transition-all duration-75" style={{ width: `${volume * 100}%` }} />
                                        <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover/volume-bar:opacity-100 transition-opacity" style={{ left: `${volume * 100}%`, marginLeft: '-6px' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scale-in {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes music-bar-1 { 0%, 100% { height: 4px; } 50% { height: 12px; } }
                @keyframes music-bar-2 { 0%, 100% { height: 8px; } 50% { height: 16px; } }
                @keyframes music-bar-3 { 0%, 100% { height: 6px; } 50% { height: 10px; } }
                @keyframes pulse-subtle { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.4); } 50% { box-shadow: 0 0 0 10px rgba(255,255,255,0); } }
                
                .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-fade-in { animation: fade-in 0.5s ease-out 0.2s forwards; opacity: 0; }
                .animate-scale-in { animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; opacity: 0; }
                .animate-spin-slow { animation: spin-slow linear infinite; }
                .animate-music-bar-1 { animation: music-bar-1 0.8s ease-in-out infinite; }
                .animate-music-bar-2 { animation: music-bar-2 0.9s ease-in-out infinite 0.1s; }
                .animate-music-bar-3 { animation: music-bar-3 0.7s ease-in-out infinite 0.2s; }
                .animate-pulse-subtle { animation: pulse-subtle 2s ease-in-out infinite; }
            `}</style>
        </div>
    );
};