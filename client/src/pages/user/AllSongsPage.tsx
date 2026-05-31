import AnimatedList from "@/components/ui/AnimatedList"
import { usePlayerStore } from "@/store/player/player.store";
import { useUserStore } from "@/store/user/user.store"
import type { song } from "@/types/user.types";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

interface LayoutContext{
  playing: boolean;
  currentTime:string;
  duration:number;
};

const AllSongsPage = () => {

    const { recentSongs,isGettingSongs,nextCursor,getRecentSongs} = useUserStore();
    const { setCurrent,setQueue} = usePlayerStore()
    const { playing,currentTime,duration} = useOutletContext<LayoutContext>();
    const handleplayer = (item: song) => {
        setCurrent(item)
        // console.log(currentSongindex,duration);
    }

    const handleLoadmore = async()=>{
        await getRecentSongs(10)
    }

    useEffect(() => {
      setQueue(recentSongs)
    }, [recentSongs])
    
    return (
        <div className="pt-20 h-screen overflow-y-hidden">

            <AnimatedList
                className=""
                itemClassName=""
                items={recentSongs}
                onItemSelect={(item) => handleplayer(item)}
                showGradients
                enableArrowNavigation
                displayScrollbar
                currentTime={currentTime}
                duration={duration}
                playing={playing}
                loadMore={handleLoadmore}
                loading={isGettingSongs}
                hasMore={nextCursor?.length ? true:false}
            />
        </div>
    )
}

export default AllSongsPage