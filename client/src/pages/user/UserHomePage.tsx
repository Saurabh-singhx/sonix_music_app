import AnimatedList from "@/components/AnimatedList";
import { useUserStore } from "@/store/user/user.store"
import { useEffect, useState } from "react"
const UserHomePage = () => {

  const [songsDataLimit, setSongsDataLimit] = useState(10)
  const { recentSongs, getRecentSongs, nextCursor} = useUserStore();

  useEffect(() => {

    getRecentSongs(songsDataLimit, nextCursor);

  }, [])

  return (
    <div className="min-h-screen text-white w-full flex h-screen">

      <div className=" w-[50%] h-2/3 overflow-hidden">
        <AnimatedList
        className="h-full bg-amber-400"
        itemClassName="h-20"
        items={recentSongs}
        onItemSelect={(item, index) => console.log(item, index)}
        showGradients
        enableArrowNavigation
        displayScrollbar
      />
      </div>
      <div>

        items
      </div>
    </div>


  )
}

export default UserHomePage