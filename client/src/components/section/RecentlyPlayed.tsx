import React from 'react';
import { Clock } from 'lucide-react';
// import { Track } from '@/hooks/useTracks';
import type { song } from '@/types/user.types';

interface RecentlyPlayedProps {
  tracks: song[];
  currentTrackIndex: number | null;
  isPlaying: boolean;
  onTrackSelect: (index: number) => void;
}

export const RecentlyPlayed: React.FC<RecentlyPlayedProps> = ({
  tracks,
  currentTrackIndex,
  isPlaying,
  onTrackSelect,
}) => {
  // Show last 5 tracks as "recently played" for demo
  const recentTracks = tracks.slice(0, 5);

  if (recentTracks.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Recently Played</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {recentTracks.map((track, idx) => {
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
              <div className="aspect-square rounded-lg bg-linear-to-br from-primary/30 to-secondary/30 mb-3 flex items-center justify-center overflow-hidden">
                <div className={`w-8 h-8 rounded-full bg-primary/50 flex items-center justify-center
                  ${isActive && isPlaying ? 'animate-pulse' : ''}`}>
                  <span className="text-xs font-mono">{idx + 1}</span>
                </div>
              </div>
              <p className="font-medium text-sm truncate">{track.song_title}</p>
              <p className="text-xs text-muted-foreground truncate">{track.artist.artist_name}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
};
