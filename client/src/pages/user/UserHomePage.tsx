import AnimatedList from "@/components/ui/AnimatedList";
import { BottomPlayer } from "@/components/ui/BottomPlayer";
import CardNav, { type CardNavItem } from "@/components/CardNav";
import Navbar from "@/components/ui/Navbar";
import PlayerBar from "@/components/Player";
import RecentlyPlayedSection from "@/components/section/RecentlyPlayedSection";
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

  const items : CardNavItem [] = [{label: "string",
    bgColor: "black",
    textColor: "white",
    links:[]}]
  return (
    <div className="min-h-screen text-white w-full flex h-screen flex-col">
      <CardNav items={items} logo="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLW11c2ljNC1pY29uIGx1Y2lkZS1tdXNpYy00Ij48cGF0aCBkPSJNOSAxOFY1bDEyLTJ2MTMiLz48cGF0aCBkPSJtOSA5IDEyLTIiLz48Y2lyY2xlIGN4PSI2IiBjeT0iMTgiIHI9IjMiLz48Y2lyY2xlIGN4PSIxOCIgY3k9IjE2IiByPSIzIi8+PC9zdmc+"/>
      <div className=" w-[50%] h-2/3 overflow-hidden">
        {/* <AnimatedList
          className="h-full bg-amber-400"
          itemClassName="h-20"
          items={recentSongs}
          onItemSelect={(item, index) => handleplayer(item)}
          showGradients
          enableArrowNavigation
          displayScrollbar
        /> */}

      </div>
      <RecentlyPlayedSection/>
      <div>
        {/* <button type="button" onClick={toggle} className="bg-lime-300 p-4">play</button> */}

        {/* <PlayerBar /> */}
      </div>

      {/* <BottomPlayer isPlaying={playing} progress={position} onPlayPause={toggle} onNext={next} onExpand={handleExpand} onPrevious={prev} onSeek={handleSeek} />

       */}
    </div>


  )
}

export default UserHomePage