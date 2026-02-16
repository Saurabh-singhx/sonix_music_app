// hooks/useGlobalPlayer.ts
import { usePlayerStore } from "@/store/player/player.store";
import { useEffect, useState } from "react";
import { useAudioPlayer } from "react-use-audio-player";

export function useGlobalPlayer() {
  const { currentTrack, next, prev } = usePlayerStore();
  const player = useAudioPlayer();
  const [progress, setProgress] = useState(0)

  const [currentTime, setCurrentTime] = useState('0:00');
  const [position, setPosition] = useState(0)
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

   useEffect(() => {
    const interval = setInterval(() => {
      if (player.isPlaying) {
        setPosition(player.getPosition());
      }
    }, 200); 

    return () => clearInterval(interval);
  }, [player]);

  useEffect(() => {
      if (!currentTrack || !player.duration) return;
  
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
