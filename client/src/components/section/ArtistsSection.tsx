import React from 'react';
import { Users } from 'lucide-react';

export const ArtistsSection: React.FC = () => {
//   const { artists, isLoading } = useArtists();


  if (isLoading || artists.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Artists</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {artists.map((artist) => (
          <div
            key={artist.id}
            className="shrink-0 group cursor-pointer"
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-linear-to-br from-primary/40 to-secondary/40 mb-2 flex items-center justify-center overflow-hidden ring-2 ring-transparent group-hover:ring-primary transition-all duration-300">
              {artist.image_url ? (
                <img 
                  src={artist.image_url} 
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-primary/70">
                  {artist.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-center truncate max-w-24 sm:max-w-32">
              {artist.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
