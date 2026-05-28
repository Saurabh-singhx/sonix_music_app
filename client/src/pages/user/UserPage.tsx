import { motion, AnimatePresence } from 'framer-motion';
import { TrendingSection } from '@/components/section/TrendingSection';
import { RecommendedSection } from '@/components/section/RecommendedSection';
import { AllSongsSection } from '@/components/section/AllSongsSection';
import RecentlyPlayedSection from '@/components/section/RecentlyPlayedSection';
import { useUserStore } from '@/store/user/user.store';
import { ArtistsSection } from '@/components/section/ArtistsSection';
import { useOutletContext } from 'react-router-dom';
import { AllSongsSkeletonShimmer } from '@/skeletons/user/AllSongsSectionSkeleton';
import { ArtistsSkeletonShimmer } from '@/skeletons/user/ArtistSectionSkeleton';
import { TrendingSkeletonShimmer } from '@/skeletons/user/TrendingSectionSkeleton';
import { PlaylistSection } from '@/components/section/PlaylistSection';
import { useAuthStore } from '@/store/auth/auth.store';
interface LayoutContext{
  playing: boolean;
  progress: number;
};

export default function UserPage() {

  
  const { playing, progress } = useOutletContext<LayoutContext>();
  const {authUser} = useAuthStore();
  const { recommendedSongs,isGettingSongs,isGettingArtistsList,isGettingTrendingSongs,recentlyPlayedSongs} = useUserStore();

  return (
    <div className="min-h-screen bg-card text-white selection:bg-white selection:text-black font-sans overflow-hidden">

      <div className="relative z-10 max-w-8xl mx-auto px-5 sm:px-4 lg:px-8 py-8 pb-10 mt-20">

        {/* Main Content - Routed Views */}
        <main className="min-h-[60vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              
              {
                authUser?.role === "USER" &&(
                  <PlaylistSection/>
                )
              }
              {
                recentlyPlayedSongs?.length >= 1 &&(<RecentlyPlayedSection />)
              }

              {
                isGettingTrendingSongs? (<TrendingSkeletonShimmer itemCount={4}/>):(<TrendingSection progress={progress}/>)
              }

              {
                recommendedSongs?.length > 0 && (
                  <RecommendedSection progress={progress}/>
                )
              }
              {
                isGettingArtistsList?(<ArtistsSkeletonShimmer itemCount={5}/>):(<ArtistsSection />)
              }
              
              {
                isGettingSongs ? (<AllSongsSkeletonShimmer rowCount={5}/>):(<AllSongsSection playing={playing} progress={progress}/>)
              }
            </motion.div>
          </AnimatePresence>
        </main>
      </div>


    </div>
  );
}