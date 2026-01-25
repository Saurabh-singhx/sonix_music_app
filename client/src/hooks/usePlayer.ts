// hooks/useGlobalPlayer.ts
import { usePlayerStore } from "@/store/player/player.store";
import { useEffect, useRef, useState } from "react";
import { useAudioPlayer } from "react-use-audio-player";

export function useGlobalPlayer() {
  const { currentTrack, next, prev } = usePlayerStore();
  const player = useAudioPlayer();

  const [position, setPosition] = useState(0);
  const rafRef = useRef<number | null>(null);

  // Load song
  useEffect(() => {
    if (!currentTrack?.song_url) return;

    player.stop();
    player.load(currentTrack.song_url, {
      html5: true,
      onend: next,
      
    });
    player.play()
  }, [currentTrack?.song_url, next]);

  // Track playback position
  useEffect(() => {
    const update = () => {
      if (player.isPlaying) {
        setPosition(player.getPosition());
      }
      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [player.isPlaying]);

  return {
    /* state */
    currentTrack,
    playing: player.isPlaying,
    duration: player.duration,
    position, // ✅ now reactive

    /* controls */
    play: player.play,
    pause: player.pause,
    toggle: player.togglePlayPause,
    stop: player.stop,
    seek: player.seek,
    setVolume: player.setVolume,
    mute: player.mute,
    unmute: player.unmute,

    /* navigation */
    next,
    prev,
  };
}
