import React from 'react';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TrendingSkeletonProps {
  itemCount?: number;
  fullPage?: boolean;
}

// Shimmer variant with gradient animation
export const TrendingSkeletonShimmer: React.FC<TrendingSkeletonProps> = ({ 
  itemCount = 8,
  fullPage = false 
}) => {
  const shimmerClass = "relative overflow-hidden bg-zinc-800 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent";

  return (
    <section className={cn("mb-12", fullPage && "pt-8")}>
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 px-4 sm:px-0">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-800" />
          <div className={cn("h-6 sm:h-8 w-32 sm:w-40 rounded", shimmerClass)} />
        </div>
        
        {/* Navigation arrows placeholder for desktop */}
        <div className="hidden sm:flex items-center gap-2">
          <div className={cn("h-9 w-9 rounded-full", shimmerClass)} />
          <div className={cn("h-9 w-9 rounded-full", shimmerClass)} />
        </div>
      </div>

      {/* Single row horizontal scroll - all screen sizes */}
      <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-3 sm:gap-4 px-4 sm:px-0 pb-4">
        {Array.from({ length: itemCount }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative shrink-0 w-40 sm:w-50 md:w-60 lg:w-70 aspect-3/4 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 snap-start"
          >
            {/* Cover Image Skeleton */}
            <div className={cn("absolute inset-0", shimmerClass)} />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />

            {/* Bottom Content Skeleton */}
            <div className="absolute bottom-0 left-0 p-3 sm:p-4 w-full space-y-2">
              <div className={cn("h-4 sm:h-5 w-3/4 rounded", shimmerClass)} />
              <div className={cn("h-3 sm:h-4 w-1/2 rounded", shimmerClass)} />
            </div>

            {/* Rank Badge Skeleton */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
              <div className={cn("h-5 sm:h-6 w-6 sm:w-8 rounded", shimmerClass)} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};