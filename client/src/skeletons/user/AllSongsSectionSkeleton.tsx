import { cn } from "@/lib/utils";
import { Disc } from "lucide-react";
interface AllSongsSkeletonProps {
  rowCount?: number;
}
// Shimmer variant for more polished look
export const AllSongsSkeletonShimmer: React.FC<AllSongsSkeletonProps> = ({ 
  rowCount = 8 
}) => {
  const shimmerClass = "relative overflow-hidden bg-zinc-800 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent";

  return (
    <section className={cn("mb-12")}>
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Disc className="w-6 h-6 text-zinc-800" />
          <div className={cn("h-8 w-32 rounded", shimmerClass)} />
        </div>
        <div className={cn("h-4 w-16 rounded", shimmerClass)} />
      </div>

      {/* Table Container */}
      <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 p-4 border-b border-zinc-800">
          <div className={cn("w-8 h-4 rounded", shimmerClass)} />
          <div className={cn("h-4 w-16 rounded", shimmerClass)} />
          <div className={cn("hidden md:block h-4 w-16 rounded", shimmerClass)} />
          <div className={cn("h-4 w-12 rounded ml-auto", shimmerClass)} />
        </div>

        {/* Skeleton Rows */}
        <div className="flex flex-col">
          {Array.from({ length: rowCount }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 p-3 items-center border-b border-zinc-800/50 last:border-0"
            >
              {/* Index Number */}
              <div className="w-8 flex justify-center">
                <div className={cn("h-4 w-4 rounded", shimmerClass)} />
              </div>

              {/* Title & Artist */}
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={cn("w-10 h-10 rounded shrink-0", shimmerClass)} />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className={cn("h-4 w-3/4 rounded", shimmerClass)} />
                  <div className={cn("h-3 w-1/2 rounded", shimmerClass)} />
                </div>
              </div>

              {/* Album */}
              <div className="hidden md:block">
                <div className={cn("h-4 w-24 rounded", shimmerClass)} />
              </div>

              {/* Duration */}
              <div className="flex justify-end">
                <div className={cn("h-4 w-12 rounded", shimmerClass)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};