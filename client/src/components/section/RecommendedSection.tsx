import React from 'react';
import { Sparkles, Play, Pause } from 'lucide-react';
import type { song } from '@/types/user.types';

interface RecommendedSectionProps {
  tracks: song[];
  currentTrackIndex: number | null;
  isPlaying: boolean;
  onTrackSelect: (index: number) => void;
}

export const RecommendedSection: React.FC<RecommendedSectionProps> = ({
  tracks,
  currentTrackIndex,
  isPlaying,
  onTrackSelect,
}) => {
  // Use last tracks as "recommended" for demo
  const recommendedTracks = tracks.slice(-6);

  if (recommendedTracks.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Recommended For You</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {recommendedTracks.map((track) => {
          const originalIndex = tracks.findIndex(t => t.song_id === track.song_id);
          const isActive = currentTrackIndex === originalIndex;
          
          return (
            <button
              key={track.song_id}
              onClick={() => onTrackSelect(originalIndex)}
              className={`group relative p-3 rounded-xl transition-all duration-300 text-left
                ${isActive 
                  ? 'bg-primary/20 ring-1 ring-primary' 
                  : 'bg-card hover:bg-accent/50'
                }`}
            >
              <div className="aspect-square rounded-lg bg-linear-to-br from-purple-500/30 to-pink-500/30 mb-3 flex items-center justify-center overflow-hidden relative group">
                <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center`}>
                  {isActive && isPlaying ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" />
                  )}
                </div>
                <span className="text-3xl font-bold text-primary/30">
                  {track.song_title.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="font-medium text-sm truncate">{track.song_title}</p>
              <p className="text-xs text-muted-foreground truncate">{track.artist.artist_name}</p>
              {track.duration && (
                <p className="text-xs text-muted-foreground/70 mt-1">{track.duration}</p>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};
