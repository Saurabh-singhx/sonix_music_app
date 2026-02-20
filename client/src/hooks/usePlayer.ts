// hooks/useGlobalPlayer.ts
import { usePlayerStore } from "@/store/player/player.store";
import { useEffect, useRef, useState } from "react";
import { useAudioPlayer } from "react-use-audio-player";

export function useGlobalPlayer() {
  const { currentTrack, next, prev } = usePlayerStore();
  const player = useAudioPlayer();
  const [progress, setProgress] = useState(0)

  const [currentTime, setCurrentTime] = useState('0:00');
  const [position, setPosition] = useState(0)
  const prevUrlRef = useRef<string | null>(null);
  // Load song
  useEffect(() => {
    if (!currentTrack?.song_url) return;
    if (prevUrlRef.current === currentTrack.song_id) return;

    prevUrlRef.current = currentTrack.song_id;
    player.stop();
    player.load(currentTrack.song_url, {
      html5: true,
      onend: () => {
        if (!player.duration) return;

        const percent = Math.floor(
          (player.getPosition() / player.duration) * 100
        );

        if (Number.isNaN(percent)) return;
        console.log(percent)
        next(currentTrack, percent);
      },

    });
    player.play()
  }, [currentTrack?.song_url, next]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (player.isPlaying) {
        setPosition(player.getPosition());
      }
    }, 200);

    return () => clearInterval(interval);
  }, [player.isPlaying]);


  useEffect(() => {
    const progressValue = (position / player.duration) * 100;
    setProgress(progressValue);

    const mins = Math.floor(position / 60);
    const secs = Math.floor(position % 60);

    setCurrentTime(`${mins}:${secs.toString().padStart(2, '0')}`);

  }, [position, player.duration, currentTrack]);

  return {
    /* state */
    currentTrack,
    playing: player.isPlaying,
    duration: player.duration,
    progress,
    currentTime,

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
