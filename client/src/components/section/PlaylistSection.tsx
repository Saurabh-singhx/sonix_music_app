import { useState, useRef } from "react";
import { ListMusic, Plus, Lock, Globe, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/user/user.store";
import { useNavigate } from "react-router-dom";
import type { playlist } from "@/types/user.types";


interface CreatePlaylistForm {
  name: string;
  description: string;
  isPublic: boolean;
}

export const PlaylistSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<CreatePlaylistForm>({
    name: "",
    description: "",
    isPublic: true,
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const { createPlalist, userPlaylists, setCurrentPlaylist,getCurrentPlaylistSongs,getAllSongs } = useUserStore();
  const navigate = useNavigate();

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    createPlalist(formData.name, formData.description, formData.isPublic);

    setFormData({ name: "", description: "", isPublic: true });
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: "", description: "", isPublic: true });
  };

  const handlePlaylistView = (data: playlist) => {
    getCurrentPlaylistSongs(data.playlist_id)
    setCurrentPlaylist(data)
    getAllSongs();
    navigate("/playlistview")
  }

  return (
    <>
      <section className="mb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 px-4 sm:px-0">
          <div className="flex items-center gap-2">
            <ListMusic className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tighter text-white">
              YOUR PLAYLISTS
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Navigation arrows - desktop only */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* View All & Create */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="hidden sm:block px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                View All
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white text-black rounded-full font-medium text-sm hover:bg-zinc-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Playlists Row - All playlists, horizontally scrollable */}
        {userPlaylists?.length > 0 ? (
          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-3 sm:gap-4 px-4 sm:px-0 pb-4"
          >
            {userPlaylists.map((playlist, index) => (
              <motion.div
                onClick={()=>handlePlaylistView(playlist)}
                key={playlist.playlist_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="group relative flex-shrink-0 w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] aspect-square rounded-xl overflow-hidden cursor-pointer bg-zinc-900 border border-zinc-800 snap-start"
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                {/* Content */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between">
                  {/* Top - Privacy Badge */}
                  <div className="flex justify-end">
                    <div className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-md border",
                      playlist.is_public
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
                    )}>
                      {playlist.is_public ? (
                        <Globe className="w-3 h-3" />
                      ) : (
                        <Lock className="w-3 h-3" />
                      )}
                      <span className="hidden sm:inline">
                        {playlist.is_public ? "Public" : "Private"}
                      </span>
                    </div>
                  </div>

                  {/* Bottom - Info */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-tight truncate mb-1">
                      {playlist.playlist_name}
                    </h3>
                    {playlist.description && (
                      <p className="text-zinc-400 text-xs sm:text-sm line-clamp-2 mb-2">
                        {playlist.description}
                      </p>
                    )}
                    <p className="text-zinc-500 text-xs">
                      {playlist.songCount} {playlist.songCount === 1 ? "song" : "songs"}
                    </p>
                  </div>
                </div>

                {/* Play Icon on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-black flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <ListMusic className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full" />
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <ListMusic className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-500" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              No Playlists Yet
            </h3>
            <p className="text-zinc-400 text-sm sm:text-base max-w-md mb-4">
              Create your first playlist to organize your favorite tracks
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-zinc-200 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Playlist
            </motion.button>
          </div>
        )}
      </section>

      {/* Create Playlist Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
            >
              <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 pointer-events-auto shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Create Playlist
                  </h3>
                  <button
                    onClick={closeModal}
                    className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleCreatePlaylist} className="space-y-5">
                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="My Awesome Playlist"
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all"
                      required
                    />
                  </div>

                  {/* Description Input */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Description <span className="text-zinc-600">(optional)</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Add a description..."
                      rows={3}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all resize-none"
                    />
                  </div>

                  {/* Privacy Toggle */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-3">
                      Privacy
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isPublic: true })}
                        className={cn(
                          "flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200",
                          formData.isPublic
                            ? "bg-green-500/10 border-green-500/50 text-green-400"
                            : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                        )}
                      >
                        <Globe className="w-4 h-4" />
                        <span className="font-medium">Public</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isPublic: false })}
                        className={cn(
                          "flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200",
                          !formData.isPublic
                            ? "bg-zinc-700/50 border-zinc-500 text-white"
                            : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                        )}
                      >
                        <Lock className="w-4 h-4" />
                        <span className="font-medium">Private</span>
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-4 py-3 rounded-xl border border-zinc-700 text-zinc-300 font-medium hover:bg-zinc-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!formData.name.trim()}
                      className="flex-1 px-4 py-3 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};