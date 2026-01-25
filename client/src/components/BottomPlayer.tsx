import React from 'react';
import { Play, Pause, SkipBack, SkipForward, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { usePlayerStore } from '@/store/player/player.store';

interface BottomPlayerProps {
    isPlaying: boolean;
    progress: number;
    onPlayPause: () => void;
    onNext: () => void;
    onPrevious: () => void;
    onExpand: () => void;
    onSeek: (value: number[]) => void;
}

export const BottomPlayer: React.FC<BottomPlayerProps> = ({
    isPlaying,
    progress,
    onPlayPause,
    onNext,
    onPrevious,
    onExpand,
    onSeek,
}) => {
    
    const { currentTrack } = usePlayerStore();

    if (!currentTrack) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border">
            {/* Progress bar on top */}
            <div className="absolute top-0 left-0 right-0 h-1 -translate-y-full">
                <Slider
                    value={[progress]}
                    max={100}
                    step={0.1}
                    onValueChange={onSeek}
                    className="h-1 cursor-pointer [&>span:first-child]:h-1 [&>span:first-child]:bg-muted [&_[role=slider]]:hidden [&>span:first-child>span]:bg-primary"
                />
            </div>

            <div className="container max-w-7xl mx-auto px-4">
                <div className="flex items-center gap-3 py-2 sm:py-3">
                    {/* Track info - clickable to expand */}
                    <button
                        onClick={onExpand}
                        className="flex items-center gap-3 flex-1 min-w-0 text-left group"
                    >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center flex-shrink-0 group-hover:ring-2 ring-primary/50 transition-all">
                            <span className="text-lg font-bold text-primary/70">
                                {currentTrack.song_title.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{currentTrack.song_title}</p>
                            <p className="text-xs text-muted-foreground truncate">{currentTrack.artist.artist_name}</p>
                        </div>
                        <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors hidden sm:block" />
                    </button>

                    {/* Controls */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onPrevious}
                            className="w-8 h-8 sm:w-10 sm:h-10 hidden sm:flex"
                        >
                            <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                        <Button
                            onClick={onPlayPause}
                            size="icon"
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary hover:bg-primary/90"
                        >
                            {isPlaying ? (
                                <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
                            ) : (
                                <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" />
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onNext}
                            className="w-8 h-8 sm:w-10 sm:h-10"
                        >
                            <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
