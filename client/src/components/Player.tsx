// components/Player.tsx
import { useGlobalPlayer } from "@/hooks/usePlayer";

 function PlayerBar() {
  const {
    currentTrack,
    playing,
    toggle,
    seek,
    duration,
    position,
    next,
    prev,
  } = useGlobalPlayer();

  if (!currentTrack) return null;

  return (
    <div>
      <button onClick={prev}>⏮</button>
      <button onClick={toggle}>{playing ? "⏸" : "▶️"}</button>
      <button onClick={next}>⏭</button>

      <input
        type="range"
        min={0}
        max={duration ?? 0}
        value={position}
        onChange={(e) => seek(Number(e.target.value))}
      />
    </div>
  );
}

export default PlayerBar;
