import { usePlayerStore } from "@/store/player/player.store";
import { Play, TrendingUp } from "lucide-react";
import { motion } from 'framer-motion';
import { useUserStore } from "@/store/user/user.store";
import { cn } from "@/lib/utils";


export const TrendingSection = ({ fullPage = false }: { fullPage?: boolean }) => {
  const { setCurrent } = usePlayerStore();
  const { trendingSongs } = useUserStore();

  return (
    <section className={cn("mb-12", fullPage && "pt-8")}>
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-white" />
        <h2 className="text-2xl font-bold tracking-tighter text-white">TRENDING NOW</h2>
      </div>

      {
        trendingSongs?.length > 0 && (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingSongs?.map((song, index) => (
            <motion.div
              key={song.song_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group relative aspect-3/4 rounded-xl overflow-hidden cursor-pointer bg-zinc-900 border border-zinc-800"
              onClick={() => setCurrent(song)}
            >
              <img
                src={song.cover_image_url}
                alt={song.song_title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 p-4 w-full">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  className="flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-xl font-bold text-white leading-tight">{song.song_title}</h3>
                    <p className="text-zinc-400 text-sm">{song.artist.artist_name}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-5 h-5 fill-current" />
                  </div>
                </motion.div>
              </div>

              <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white border border-white/20">
                #{index + 1}
              </div>
            </motion.div>
          ))}
        </div>
        )
      }
      {(!trendingSongs || trendingSongs.length === 0) && (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full" />
            <div className="relative w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <TrendingUp className="w-10 h-10 text-zinc-500" />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">
            No Trending Songs Yet
          </h3>

          <p className="text-zinc-400 max-w-md">
            Once users start listening and interacting, trending tracks will appear here.
          </p>
        </div>
      )}

    </section>
  );
};