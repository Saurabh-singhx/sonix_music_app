import { LimitReachedModal } from "@/components/LimitReached"
import { BottomPlayer } from "@/components/ui/BottomPlayer"
import { ExpandedPlayer } from "@/components/ui/ExpandedPlayer"
import Navbar from "@/components/ui/Navbar"
import { useGlobalPlayer } from "@/hooks/usePlayer"
import { useAuthStore } from "@/store/auth/auth.store"
import { useUserStore } from "@/store/user/user.store"
import { useCallback, useEffect, useState } from "react"
import { Outlet } from "react-router-dom"

const AppLayout = () => {

    const { playing, progress, toggle, next, prev, currentTrack, duration, seek, currentTime,setIsSeeking,setProgress } = useGlobalPlayer();
    const [isExpanded, setIsExpanded] = useState(false);
    const { isLimitReached, setisLimitReached, getRecentSongs, getArtistList, getRecommendedSongs, getTrendingSongs, } = useUserStore()
    const { authUser } = useAuthStore();
    const { logout } = useAuthStore();
    // const [songsDataLimit, setSongsDataLimit] = useState(10)
    const handleSeek = useCallback(
        (value: number) => {
            if (!duration) return;
            const newTime = (value / 100) * duration;
            seek(newTime);
        },
        [duration, seek]
    );

    const handleCreateAccount = () => {
        logout();
    }

    useEffect(() => {
        getRecentSongs(10);
        getArtistList();
        getRecommendedSongs(10);
        getTrendingSongs();
    }, [])

    return (
        <>
            {authUser?.role !== "ADMIN" && (<Navbar />)}
            <Outlet context={{ playing, progress, duration, currentTime }} />
            <BottomPlayer
                isPlaying={playing}
                progress={progress}
                onPlayPause={toggle}
                onNext={() => next(currentTrack!,
                    Math.floor(progress))}
                onExpand={() => setIsExpanded(true)}
                onPrevious={() => prev(currentTrack!, Math.floor(progress))}
                onSeek={handleSeek}
                setIsSeeking={setIsSeeking}
                setProgress={setProgress}
            />

            <ExpandedPlayer
                onClose={() => setIsExpanded(false)}
                isOpen={isExpanded}
                onPlayPause={toggle}
                onNext={() => next(currentTrack!, Math.floor(progress))}
                onPrevious={() => prev(currentTrack!, Math.floor(progress))}
                onSeek={handleSeek}
                progress={progress}
                duration={duration}
                currentTime={currentTime}
                playing={playing}
                setIsSeeking={setIsSeeking}
                setProgress={setProgress}
            />

            <LimitReachedModal
                isOpen={isLimitReached}
                onClose={() => setisLimitReached(false)}
                onCreateAccount={handleCreateAccount}
                limit={100}
            />
        </>
    )
}

export default AppLayout