// tailwind.config.js
import React from 'react';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ArtistsSkeletonProps {
  itemCount?: number;
}

export const ArtistsSkeleton: React.FC<ArtistsSkeletonProps> = ({ 
  itemCount = 8 
}) => {
  return (
    <section className="mb-8">
      {/* Header Skeleton */}
      <div className="flex items-center gap-2 mb-4 px-2 sm:px-0">
        <Users className="w-5 h-5 text-zinc-700" />
        <div className="h-6 w-20 bg-zinc-800 rounded animate-pulse" />
      </div>

      {/* Scrollable Container */}
      <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide px-2 sm:px-0">
        {Array.from({ length: itemCount }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="shrink-0 flex flex-col items-center p-1"
          >
            {/* Avatar Skeleton */}
            <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-zinc-800 animate-pulse mb-3" />

            {/* Name Skeleton */}
            <div className="h-4 w-16 sm:w-20 bg-zinc-800 rounded animate-pulse" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// Shimmer variant with gradient animation
export const ArtistsSkeletonShimmer: React.FC<ArtistsSkeletonProps> = ({ 
  itemCount = 8 
}) => {
  const shimmerClass = "relative overflow-hidden bg-zinc-800 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent";

  return (
    <section className="mb-8">
      {/* Header Skeleton */}
      <div className="flex items-center gap-2 mb-4 px-2 sm:px-0">
        <Users className="w-5 h-5 text-zinc-800" />
        <div className={cn("h-6 w-20 rounded", shimmerClass)} />
      </div>

      {/* Scrollable Container */}
      <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide px-2 sm:px-0">
        {Array.from({ length: itemCount }).map((_, index) => (
          <div
            key={index}
            className="shrink-0 flex flex-col items-center p-1"
          >
            {/* Avatar Skeleton */}
            <div className={cn(
              "w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full mb-3",
              shimmerClass
            )} />

            {/* Name Skeleton */}
            <div className={cn("h-4 w-16 sm:w-20 rounded", shimmerClass)} />
          </div>
        ))}
      </div>
    </section>
  );
};