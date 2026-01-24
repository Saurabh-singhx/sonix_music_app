// store/playerStore.ts
import type { song } from "@/types/user.types";
import { create } from "zustand";


interface PlayerState {
  current: song | null;
  queue: song[];
  index: number;

  setQueue: (songs: song[], startIndex?: number) => void;
  setCurrent: (song: song) => void;
  next: () => void;
  prev: () => void;
  clear: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  current: null,
  queue: [],
  index: 0,

  setQueue: (songs, startIndex = 0) =>
    set({
      queue: songs,
      index: startIndex,
      current: songs[startIndex] ?? null,
    }),

  setCurrent: (song) => set({ current: song }),

  next: () => {
    const { queue, index } = get();
    const nextIndex = index + 1;
    if (!queue[nextIndex]) return;
    set({
      index: nextIndex,
      current: queue[nextIndex],
    });
  },

  prev: () => {
    const { queue, index } = get();
    const prevIndex = index - 1;
    if (!queue[prevIndex]) return;
    set({
      index: prevIndex,
      current: queue[prevIndex],
    });
  },

  clear: () => set({ current: null, queue: [], index: 0 }),
}));
