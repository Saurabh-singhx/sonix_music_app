import {useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingSection } from '@/components/section/TrendingSection';
import { RecommendedSection } from '@/components/section/RecommendedSection';
import { AllSongsSection } from '@/components/section/AllSongsSection';
import RecentlyPlayedSection from '@/components/section/RecentlyPlayedSection';
import Navbar from '@/components/ui/Navbar';
import { useUserStore } from '@/store/user/user.store';
import { ArtistsSection } from '@/components/section/ArtistsSection';
import { useOutletContext } from 'react-router-dom';

interface LayoutContext{
  playing: boolean;
  progress: number;
};

export default function UserPage() {

  const [songsDataLimit, setSongsDataLimit] = useState(10)
  const { playing, progress } = useOutletContext<LayoutContext>();

  const { getRecentSongs, getArtistList, getRecommendedSongs, getTrendingSongs, recommendedSongs } = useUserStore();


  useEffect(() => {
    getRecentSongs(songsDataLimit);
    getArtistList();
    getRecommendedSongs(songsDataLimit);
    getTrendingSongs();
  }, [])

  return (
    <div className="min-h-screen bg-card text-white selection:bg-white selection:text-black font-sans overflow-hidden">
      {/* Removed Next/Head import, using standard meta if needed, but not strictly required for this component */}
      <Navbar />

      <div className="relative z-10 max-w-8xl mx-auto px-10 sm:px-6 lg:px-8 py-8 pb-32 mt-20">

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
              <RecentlyPlayedSection />
              <TrendingSection />
              {
                recommendedSongs?.length > 0 && (
                  <RecommendedSection />
                )
              }

              <ArtistsSection />
              <AllSongsSection playing={playing} progress={progress}/>

            </motion.div>
          </AnimatePresence>
        </main>
      </div>


    </div>
  );
}