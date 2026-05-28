import type { song } from "./user.types";

export interface PlayerState {
  currentTrack: song | null;
  queue: song[];
  currentSongindex: number;

  setQueue: (songs: song[], startIndex?: number,duration?:number) => void;
  setCurrent: (song: song,duration?:number) => void;
  next: (currentTrack:song,duration:number) => void;
  prev: (currentTrack:song,duration:number) => void;
  clear: () => void;
  clearQueue:()=>void;
}