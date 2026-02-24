// store/playerStore.ts
import type { PlayerState } from "@/types/player.types";
import { create } from "zustand";
import { useUserStore } from "../user/user.store";

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  currentSongindex: 0,

  setQueue: (songs, startIndex=undefined, duration) => {
    
    const { currentTrack } = get();
    const { currentSongindex } = get();
    if (duration && currentTrack && (currentSongindex !== startIndex)) {
      useUserStore.getState().updateSongEvent(currentTrack, duration);
    }

    if (startIndex !== undefined) {
      set({
        queue: songs,
        currentSongindex: startIndex,
        currentTrack: songs[startIndex || 0] ?? null,
      })
    }else{
      set({
        queue: songs
      })
    }

  },


  setCurrent: (song, duration) => {
    const { queue } = get();
    const { currentTrack } = get();
    const { currentSongindex } = get();
    set({ currentTrack: song })
    if (queue.length >= 1) {
      for (let s = 0; s < queue.length; s++) {
        if (song?.song_id === queue[s].song_id) {

          if (duration && currentTrack && (currentSongindex !== s)) {
            useUserStore.getState().updateSongEvent(currentTrack, duration);
          }
          set({ currentSongindex: s });
          break;
        }
      }
    }
  },

  next: (currentTrack, duration) => {
    const { queue, currentSongindex } = get();
    const nextIndex = (currentSongindex || 0) + 1;
    if (!queue[nextIndex]) return;
    set({
      currentSongindex: nextIndex,
      currentTrack: queue[nextIndex],
    });
    if (currentTrack) {
      useUserStore.getState().updateSongEvent(currentTrack, duration)
    }
  },

  prev: (currentTrack, duration) => {
    const { queue, currentSongindex } = get();
    const prevIndex = (currentSongindex || 0) - 1;
    if (!queue[prevIndex]) return;
    set({
      currentSongindex: prevIndex,
      currentTrack: queue[prevIndex],
    });
    if (currentTrack) {
      useUserStore.getState().updateSongEvent(currentTrack, duration)
    }
  },

  clear: () => set({ currentTrack: null, queue: [], currentSongindex: 0 }),
}));
