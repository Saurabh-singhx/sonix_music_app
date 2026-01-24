// hooks/useGlobalPlayer.ts
import { usePlayerStore } from "@/store/player/player.store";
import { useEffect } from "react";
import { useAudioPlayer } from "react-use-audio-player";

export function useGlobalPlayer() {
  const {
    current,
    next,
    prev,
  } = usePlayerStore();

  const player = useAudioPlayer();

  // Load song when current changes
  useEffect(() => {
    if (!current?.song_url) return;

    player.stop();
    player.load(current.song_url, {
      autoplay: true,
      html5: true,
      onend: () => next(),
    });

  }, [current?.song_url]);

  return {
    /* state */
    current,
    playing: player.isPlaying,
    duration: player.duration,
    position: player.getPosition(),

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
