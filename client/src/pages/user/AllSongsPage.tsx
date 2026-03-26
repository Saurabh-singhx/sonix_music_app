import AnimatedList from "@/components/ui/AnimatedList"
import { usePlayerStore } from "@/store/player/player.store";
import { useUserStore } from "@/store/user/user.store"
import type { song } from "@/types/user.types";
import { useOutletContext } from "react-router-dom";

interface LayoutContext{
  playing: boolean;
  currentTime:string;
  duration:number;
};

const AllSongsPage = () => {

    const { recentSongs,isGettingSongs,nextCursor,getRecentSongs} = useUserStore();
    const { setCurrent} = usePlayerStore()
    const { playing,currentTime,duration} = useOutletContext<LayoutContext>();
    const handleplayer = (item: song) => {
        setCurrent(item)
        // console.log(playing);
    }

    const handleLoadmore = ()=>{
        getRecentSongs(10)
    }
    return (
        <div className="pt-20">

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