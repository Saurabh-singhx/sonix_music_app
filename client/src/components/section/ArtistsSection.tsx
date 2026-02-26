import React from 'react';
import { Users } from 'lucide-react';
import { useUserStore } from '@/store/user/user.store';
import type { artist } from '@/types/user.types';
import { useNavigate } from 'react-router-dom';

export const ArtistsSection: React.FC = () => {
  const navigate = useNavigate();
  const { artists,setCurrentArtist } = useUserStore();

  const handleArtistPageRedirect = (artist:artist)=>{
    setCurrentArtist(artist)
    navigate("/artist")
  }

  return (
    <section className="mb-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 px-2 sm:px-0">
        <Users className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Artists</h2>
      </div>

      {/* Scrollable Container */}
      <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide px-2 sm:px-0">
        {artists?.map((artist) => (
          <button
            onClick={()=>handleArtistPageRedirect(artist)}
            key={artist.artist_id}
            className="shrink-0 flex flex-col items-center group cursor-pointer p-1"
          >
            {/* Avatar Container */}
            <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-linear-to-br from-primary/40 to-secondary/40 mb-3 flex items-center justify-center overflow-hidden ring-2 ring-transparent group-hover:ring-primary transition-all duration-300 shadow-sm">
              {artist.artist_profilePic ? (
                <img 
                  src={artist.artist_profilePic} 
                  alt={artist.artist_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl sm:text-3xl font-bold text-primary/70 select-none">
                  {artist.artist_name?.charAt(0).toUpperCase() || '?'}
                </span>
              )}
            </div>

            {/* Name Label */}
            <p className="text-sm font-medium text-center truncate max-w-20 sm:max-w-28 px-1 text-foreground/90 group-hover:text-primary transition-colors">
              {artist.artist_name}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
};