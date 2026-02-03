import React from 'react';
import { TrendingUp, Play, Pause } from 'lucide-react';
import { AddToPlaylistButton } from '@/components/AddToPlaylistButton';
import type { song } from '@/types/user.types';

interface TrendingSectionProps {
  tracks: song[];
  currentTrackIndex: number | null;
  isPlaying: boolean;
  onTrackSelect: (index: number) => void;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  tracks,
  currentTrackIndex,
  isPlaying,
  onTrackSelect,
}) => {
  // Use middle tracks as "trending" for demo
  const trendingTracks = tracks.slice(Math.floor(tracks.length / 4), Math.floor(tracks.length / 4) + 6);

  if (trendingTracks.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Trending Now</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {trendingTracks.map((track, idx) => {
          const originalIndex = tracks.findIndex(t => t.song_id === track.song_id);
          const isActive = currentTrackIndex === originalIndex;
          
          return (
            <div
              key={track.song_id}
              className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-300
                ${isActive 
                  ? 'bg-primary/20 ring-1 ring-primary' 
                  : 'bg-card hover:bg-accent/50'
                }`}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/30 to-red-500/30 flex items-center justify-center">
                <span className="text-sm font-bold text-orange-400">#{idx + 1}</span>
              </div>
              <button
                onClick={() => onTrackSelect(originalIndex)}
                className="flex-1 min-w-0 text-left"
              >
                <p className="font-medium text-sm truncate">{track.song_title}</p>
                <p className="text-xs text-muted-foreground truncate">{track.artist.artist_name}</p>
              </button>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <AddToPlaylistButton trackId={track.song_id} />
              </div>
              <button
                onClick={() => onTrackSelect(originalIndex)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all
                  ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted group-hover:bg-primary/20'}`}
              >
                {isActive && isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
