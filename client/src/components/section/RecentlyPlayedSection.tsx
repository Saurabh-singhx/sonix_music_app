import { cn } from "@/lib/utils";
import { usePlayerStore } from "@/store/player/player.store";
import { useUserStore } from "@/store/user/user.store";
import { Clock, MoreHorizontal, Play } from "lucide-react";
import { motion } from "framer-motion";



const RecentlyPlayedSection = () => {
  const { setCurrent } = usePlayerStore();
  const { recentlyPlayedSongs } = useUserStore();
  return (
    <section className={cn("mb-5", recentlyPlayedSongs.length > 0 && "pt-8")}>
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-6 h-6 text-white" />
        <h2 className="text-2xl font-bold tracking-tighter text-white">RECENTLY PLAYED</h2>
      </div>

      {
        recentlyPlayedSongs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(recentlyPlayedSongs).map((song, index) => (
              <motion.div
                key={`${song.song_id}-recent-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                onClick={() => setCurrent(song)}
                className="flex items-center gap-4 p-3 rounded-xl bg-zinc-900/30 border border-zinc-800 cursor-pointer group transition-all hover:border-zinc-700"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                  <img src={song.cover_image_url} alt={song.song_title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-6 h-6 text-white fill-current" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white truncate">{song.song_title}</h4>
                  <p className="text-sm text-zinc-400 truncate">{song.artist.artist_name}</p>
                  <p className="text-xs text-zinc-600 mt-1">2 hours ago</p>
                </div>
                <button className="text-zinc-600 hover:text-white transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </div>
        )
      }

      {recentlyPlayedSongs.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center text-zinc-500">
          <Clock className="w-12 h-12 mb-4 opacity-40" />
          <h3 className="text-lg font-semibold text-zinc-400">No Recently Played Songs</h3>
          <p className="text-sm text-zinc-600 mt-2">
            Start playing music and it will appear here.
          </p>
        </div>
      )}

    </section>
  );
};

export default RecentlyPlayedSection;