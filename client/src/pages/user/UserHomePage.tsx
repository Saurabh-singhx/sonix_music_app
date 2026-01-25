import AnimatedList from "@/components/AnimatedList";
import { BottomPlayer } from "@/components/BottomPlayer";
import PlayerBar from "@/components/Player";
import { useGlobalPlayer } from "@/hooks/usePlayer";
import { usePlayerStore } from "@/store/player/player.store";
import { useUserStore } from "@/store/user/user.store"
import type { song } from "@/types/user.types";
import { useEffect, useState } from "react"
const UserHomePage = () => {

  const [songsDataLimit, setSongsDataLimit] = useState(10)
  const { recentSongs, getRecentSongs, nextCursor } = useUserStore();
  const { setCurrent, next, prev } = usePlayerStore();

  const { toggle, playing, position, seek } = useGlobalPlayer();


  useEffect(() => {

    getRecentSongs(songsDataLimit, nextCursor);

  }, [])


  const handleplayer = (item: song) => {
    setCurrent(item)
    console.log(playing);
    toggle()
  }

  const handleSeek = (value: number[]) => {
    seek(value[0]);
  };

  const handleExpand = ()=>{

  }

  return (
    <div className="min-h-screen text-white w-full flex h-screen">

      <div className=" w-[50%] h-2/3 overflow-hidden">
        <AnimatedList
          className="h-full bg-amber-400"
          itemClassName="h-20"
          items={recentSongs}
          onItemSelect={(item, index) => handleplayer(item)}
          showGradients
          enableArrowNavigation
          displayScrollbar
        />
      </div>
      <div>
        <button type="button" onClick={toggle} className="bg-lime-300 p-4">play</button>

        <PlayerBar />
      </div>

      <BottomPlayer isPlaying={playing} progress={position} onPlayPause={toggle} onNext={next} onExpand={handleExpand} onPrevious={prev} onSeek={handleSeek} />
    </div>


  )
}

export default UserHomePage