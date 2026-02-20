import { cn } from "@/lib/utils";
import { usePlayerStore } from "@/store/player/player.store";
import { useUserStore } from "@/store/user/user.store";
import { Disc, Play } from "lucide-react";
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";

interface AllSongsPageProps{
    progress:number,
    playing:boolean
}
export const AllSongsSection : React.FC<AllSongsPageProps>= ({playing,progress}) => {
    const { recentSongs } = useUserStore();
    const { currentTrack,setQueue } = usePlayerStore();
    const navigate = useNavigate();
    const handleSongPLay = (index:number)=>{

        if(currentTrack){
            setQueue(recentSongs,index,progress);
        }else{
            setQueue(recentSongs,index);
        }
    }

    const navigation = ()=>{
        navigate("/allsongs")
    }
    return (
        <section className={cn("mb-12")}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Disc className="w-6 h-6 text-white" />
                    <h2 className="text-2xl font-bold tracking-tighter text-white">ALL SONGS</h2>
                </div>
                <button 
                onClick={navigation}
                className="text-xs text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">View All</button>
            </div>

            <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden">
                <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 p-4 text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-800 font-medium">
                    <div className="w-8 text-center">#</div>
                    <div>Title</div>
                    <div className="hidden md:block">Album</div>
                    <div className="text-right">Time</div>
                </div>

                <div className="flex flex-col">
                    {recentSongs?.map((song, index) => {
                        const isCurrent = currentTrack?.song_id === song.song_id;
                        return (
                            <motion.div
                                key={song.song_id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={()=>handleSongPLay(index)}
                                className={cn(
                                    "group grid grid-cols-[auto_1fr_1fr_auto] gap-4 p-3 items-center cursor-pointer transition-colors hover:bg-white/5 border-b border-zinc-800/50 last:border-0",
                                    isCurrent && "bg-white/10 hover:bg-white/10"
                                )}
                            >
                                <div className="w-8 text-center text-zinc-500 group-hover:text-white font-mono">
                                    {isCurrent && playing ? (
                                        <div className="flex gap-0.5 justify-center items-end h-4">
                                            <motion.div animate={{ height: [4, 12, 6] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-white" />
                                            <motion.div animate={{ height: [8, 4, 12] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-white" />
                                            <motion.div animate={{ height: [6, 10, 4] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-1 bg-white" />
                                        </div>
                                    ) : (
                                        <span className="group-hover:hidden">{index + 1}</span>
                                    )}
                                    <Play className={cn("w-4 h-4 mx-auto hidden", !isCurrent && "group-hover:block")} />
                                </div>

                                <div className="flex items-center gap-3 overflow-hidden">
                                    <img src={song.cover_image_url} alt={song.song_title} className="w-10 h-10 rounded object-cover" />
                                    <div className="min-w-0">
                                        <h4 className={cn("font-medium truncate", isCurrent ? "text-white" : "text-zinc-300 group-hover:text-white")}>
                                            {song.song_title}
                                        </h4>
                                        <p className="text-xs text-zinc-500 truncate">{song.artist.artist_name}</p>
                                    </div>
                                </div>

                                <div className="hidden md:block text-sm text-zinc-500 truncate">
                                    {song.duration}
                                </div>

                                <div className="text-right text-sm text-zinc-500 font-mono">
                                    {song.duration}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};