import { usePlayerStore } from "@/store/player/player.store";
import { Play, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from 'framer-motion';
import { useUserStore } from "@/store/user/user.store";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface trendingSectionProps{
    progress:number,
}

export const TrendingSection : React.FC<trendingSectionProps>= ({progress}) =>{
  const { trendingSongs } = useUserStore();
    const { currentTrack,setQueue } = usePlayerStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleSongPLay = (index:number)=>{

        if(currentTrack){
            setQueue(trendingSongs,index,progress);
        }else{
            setQueue(trendingSongs,index);
        }
    }

  return (
    <section className={cn("mb-12")}>
      <div className="flex items-center justify-between mb-4 sm:mb-6 px-4 sm:px-0">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tighter text-white">
            TRENDING NOW
          </h2>
        </div>
        
        {/* Navigation arrows for desktop */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {trendingSongs?.length > 0 && (
        <div className="relative">
          {/* Single row horizontal scroll - all screen sizes */}
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-3 sm:gap-4 px-4 sm:px-0 pb-4"
          >
            {trendingSongs?.map((song, index) => (
              <motion.div
                key={song.song_id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="group relative shrink-0 w-40 sm:w-50 md:w-60 lg:w-70 aspect-3/4 rounded-xl overflow-hidden cursor-pointer bg-zinc-900 border border-zinc-800 snap-start"
                onClick={() => handleSongPLay(index)}
              >
                <img
                  src={song.cover_image_url}
                  alt={song.song_title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 p-3 sm:p-4 w-full">
                  <div className="flex items-end justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-white leading-tight truncate">
                        {song.song_title}
                      </h3>
                      <p className="text-zinc-400 text-xs sm:text-sm truncate">
                        {song.artist.artist_name}
                      </p>
                    </div>
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white text-black flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                    </div>
                  </div>
                </div>

                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/10 backdrop-blur-md px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs font-bold text-white border border-white/20">
                  #{index + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {(!trendingSongs || trendingSongs.length === 0) && (
        <div className="flex flex-col items-center justify-center text-center px-4">
          <div className="relative">
            <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full" />
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-500" />
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
            No Trending Songs Yet
          </h3>

          <p className="text-zinc-400 text-sm sm:text-base max-w-md">
            Once users start listening and interacting, trending tracks will appear here.
          </p>
        </div>
      )}
    </section>
  );
};