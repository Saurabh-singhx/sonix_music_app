import { useState} from "react";
import {
  Play,
  MoreHorizontal,
  Heart,
  Share2,
  Edit3,
  Trash2,
  ChevronLeft,
  Search,
  ListMusic,

  X,
  Globe,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/user/user.store";
import AnimatedList from "@/components/ui/AnimatedList";
import { useOutletContext } from "react-router-dom";
import type { song } from "@/types/user.types";
import { usePlayerStore } from "@/store/player/player.store";
import { useAuthStore } from "@/store/auth/auth.store";


// Utility functions
// const formatDuration = (seconds: number) => {
//   const mins = Math.floor(seconds / 60);
//   const secs = seconds % 60;
//   return `${mins}:${secs.toString().padStart(2, "0")}`;
// };

interface LayoutContext{
  playing: boolean;
  currentTime:string;
  duration:number;
};

export const PlaylistViewPage = () => {
  const [liked, setLiked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [songAdd, setSongAdd] = useState(false)
  const { currentPlaylistView, currentPlaylistSongs,isGettingPlaylistSongs,AllSongs,addPlaylistSongs} = useUserStore();
  const {authUser} = useAuthStore();
  const {setCurrent} = usePlayerStore();
  const { playing,currentTime,duration} = useOutletContext<LayoutContext>();

  const [editForm, setEditForm] = useState({
    name: currentPlaylistView?.playlist_name,
    description: currentPlaylistView?.description || "",
    isPublic: currentPlaylistView?.is_public,
  });

  const handlePlayAll = () => {

  };


  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowEditModal(false);
  };

  const handleDeletePlaylist = () => {
    if (confirm("Are you sure you want to delete this playlist?")) {
      // Handle delete logic
      console.log("Delete playlist");
    }
  };
  const handleplayer= (item:song)=>{
    setCurrent(item)
  }

  const handleAddPlaylistSongs = (item:song)=>{
    if(!currentPlaylistView){
      return;
    }
    addPlaylistSongs(currentPlaylistView?.playlist_id,item)
  }

  return (
    <div className="min-h-screen bg-black pb-32">
      {/* Sticky Header - appears on scroll */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-white truncate max-w-md">
                {currentPlaylistView?.playlist_name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <input
                    type="text"
                    placeholder="Search songs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 sm:w-64 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-full text-white text-sm focus:outline-none focus:border-zinc-500"
                    autoFocus
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => {
                setShowSearch(!showSearch);
                if (showSearch) setSearchQuery("");
              }}
              className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
            >
              {showSearch ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Search className="w-5 h-5 text-white" />
              )}
            </button>

            <button
              onClick={() => setShowEditModal(true)}
              className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
            >
              <MoreHorizontal className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            {/* Cover Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative shrink-0 mx-auto sm:mx-0"
            >
              <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-72 lg:h-72 rounded-2xl overflow-hidden shadow-2xl bg-linear-to-br from-zinc-800 to-zinc-900">
                 <div className="w-full h-full flex items-center justify-center">
                    <ListMusic className="w-24 h-24 text-zinc-600" />
                  </div>
              </div>

              {/* Floating play button on mobile */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlayAll}
                className="absolute -bottom-4 right-4 sm:hidden w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <Play className="w-6 h-6 text-black fill-current ml-1" />
              </motion.button>
            </motion.div>

            {/* Playlist Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col justify-end text-center sm:text-left"
            >
              <span className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">
                Playlist
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
                {currentPlaylistView?.playlist_name}
              </h1>

              {currentPlaylistView?.description && (
                <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mb-4 line-clamp-2 sm:line-clamp-none">
                  {currentPlaylistView?.description}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm text-zinc-400">
                <span className="font-semibold text-white">{authUser?.user_name}</span>
                <span>•</span>
                <span>{currentPlaylistSongs.length} songs</span>
                <span>•</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Action Bar */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between py-6 border-t border-zinc-800/50"
        >
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlayAll}
              className="hidden sm:flex w-14 h-14 lg:w-16 lg:h-16 bg-green-500 hover:bg-green-400 rounded-full items-center justify-center shadow-lg transition-colors"
            >
              <Play className="w-7 h-7 lg:w-8 lg:h-8 text-black fill-current ml-1" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setLiked(!liked)}
              className={cn(
                "p-3 rounded-full transition-colors",
                liked ? "text-green-500" : "text-zinc-400 hover:text-white"
              )}
            >
              <Heart className={cn("w-7 h-7", liked && "fill-current")} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full text-zinc-400 hover:text-white transition-colors"
            >
              <Share2 className="w-6 h-6" />
            </motion.button>

            <div className="relative group">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-full text-zinc-400 hover:text-white transition-colors"
              >
                <MoreHorizontal className="w-6 h-6" />
              </motion.button>

              {/* Dropdown Menu */}
              <div className="absolute left-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="w-full px-4 py-3 flex items-center gap-3 text-zinc-300 hover:text-white hover:bg-zinc-800 first:rounded-t-xl transition-colors text-left text-sm"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit details
                </button>
                <button
                  onClick={handleDeletePlaylist}
                  className="w-full px-4 py-3 flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-zinc-800 last:rounded-b-xl transition-colors text-left text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {
              !songAdd ? (
                <button
                onClick={()=>setSongAdd(true)}
                className="bg-white text-primary-foreground border-2 border-white px-4 py-2 rounded-3xl">Add Songs</button>
              ):(<button 
                onClick={()=>setSongAdd(false)}
                className="bg-white text-primary-foreground border-2 border-white px-4 py-2 rounded-3xl">Save</button>)
            }
            
          </div>
        </motion.section>

        {/* Songs List */}
        

        {
          songAdd ? (
            <AnimatedList
          items={AllSongs}
          onItemSelect={(item) => handleplayer(item)}
          showGradients
          enableArrowNavigation
          currentTime={currentTime}
          duration={duration}
          playing={playing}
          loading={isGettingPlaylistSongs}
          playlistSelect={true}
          onPlaylistSongAdd={(item)=>handleAddPlaylistSongs(item)}
        />
          ):(
            <AnimatedList
          items={currentPlaylistSongs}
          onItemSelect={(item) => handleplayer(item)}
          showGradients
          enableArrowNavigation
          currentTime={currentTime}
          duration={duration}
          playing={playing}
          loading={isGettingPlaylistSongs}
        />
          )
        }

      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
            >
              <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 pointer-events-auto shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Edit Details
                  </h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleEditSave} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-zinc-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Description
                    </label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({ ...editForm, description: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-zinc-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-3">
                      Privacy
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setEditForm({ ...editForm, isPublic: true })}
                        className={cn(
                          "flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all",
                          editForm.isPublic
                            ? "bg-green-500/10 border-green-500/50 text-green-400"
                            : "bg-zinc-800 border-zinc-700 text-zinc-400"
                        )}
                      >
                        <Globe className="w-4 h-4" />
                        Public
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditForm({ ...editForm, isPublic: false })}
                        className={cn(
                          "flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all",
                          !editForm.isPublic
                            ? "bg-zinc-700/50 border-zinc-500 text-white"
                            : "bg-zinc-800 border-zinc-700 text-zinc-400"
                        )}
                      >
                        <Lock className="w-4 h-4" />
                        Private
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 px-4 py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 rounded-xl bg-white text-black font-medium hover:bg-zinc-200"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};