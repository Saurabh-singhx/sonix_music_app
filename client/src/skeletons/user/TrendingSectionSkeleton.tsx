import React from 'react';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-zinc-800" />
        <div className={cn("h-8 w-40 rounded", shimmerClass)} />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: itemCount }).map((_, index) => (
          <div
            key={index}
            className="relative aspect-3/4 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800"
          >
            {/* Cover Image Skeleton */}
            <div className={cn("absolute inset-0", shimmerClass)} />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />

            {/* Bottom Content Skeleton */}
            <div className="absolute bottom-0 left-0 p-4 w-full space-y-2">
              <div className={cn("h-6 w-3/4 rounded", shimmerClass)} />
              <div className={cn("h-4 w-1/2 rounded", shimmerClass)} />
            </div>

            {/* Rank Badge Skeleton */}
            <div className="absolute top-4 right-4">
              <div className={cn("h-6 w-8 rounded", shimmerClass)} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};