import { usePlayerStore } from "@/store/player/player.store";
import { useUserStore } from "@/store/user/user.store";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, MoreHorizontal, Play } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export const RecommendedSection = () => {
  const navigate = useNavigate();
  const { setCurrent } = usePlayerStore();
  const { recommendedSongs } = useUserStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleNavigate = () => {
    navigate("/recommended");
  };

  return (
    <section className="mb-12 group/section">
      <div className="flex items-center justify-between mb-6 pr-4">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-white" />
          <h2 className="text-2xl font-bold tracking-tighter text-white">RECOMMENDED FOR YOU</h2>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Navigation Arrows - Hidden on mobile, visible on sm+ */}
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
              className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
              className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* View All Button */}
          <button
            onClick={handleNavigate}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white text-black font-medium text-sm hover:bg-zinc-200 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <span className="hidden sm:inline">View All</span>
            <span className="sm:hidden">See All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {recommendedSongs?.length > 0 && (
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 pt-2 px-2 -mx-2 scrollbar-hide snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {recommendedSongs.map((song, index) => (
            <motion.div
              key={`${song.song_id}-rec-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="min-w-55 snap-start cursor-pointer group"
              onClick={() => setCurrent(song)}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 shadow-lg bg-zinc-900">
                <img
                  src={song.cover_image_url}
                  alt={song.song_title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                  <button className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-300 delay-75 hover:scale-110">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </button>
                  <button className="text-white hover:text-zinc-300 transition-colors">
                    <MoreHorizontal className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-white truncate text-lg">{song?.song_title}</h3>
              <p className="text-sm text-zinc-400 truncate">{song?.artist?.artist_name}</p>
            </motion.div>
          ))}
        </div>
      )}

      {recommendedSongs.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-pink-500/10 blur-3xl rounded-full" />
            <div className="relative w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <Heart className="w-10 h-10 text-zinc-500" />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">
            No Recommendations Yet
          </h3>

          <p className="text-zinc-400 max-w-md">
            Listen to more music and we'll suggest tracks tailored just for you.
          </p>
        </div>
      )}
    </section>
  );
};