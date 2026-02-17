import { motion } from 'framer-motion';

const SimpleMusicFlowLoader = () => {
  // Configuration for the bars
  const barCount = 5;
  const bars = Array.from({ length: barCount }, (_, i) => i);

  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {bars.map((index) => (
        <motion.div
          key={index}
          className="w-2 bg-white rounded-full"
          animate={{
            height: [12, 48, 12], // Min, Max, Min height in pixels
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
            // Stagger the animation for each bar to create the "flow" effect
            delay: index * 0.15,
          }}
        />
      ))}
    </div>
  );
};

// Wrapper component to demonstrate the loader in a dark context
export default function MusicLoaderDemo() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-12 p-8">
      
      {/* Main Loader Display */}
      <div className="flex flex-col items-center gap-6">
        <SimpleMusicFlowLoader />
        <p className="text-neutral-500 text-sm font-medium tracking-widest uppercase animate-pulse">
          Loading Music
        </p>
      </div>

      {/* Alternative Size Variation (Small) */}
      {/* <div className="flex items-center gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={`small-${i}`}
            className="w-1.5 bg-neutral-400 rounded-full"
            animate={{
              height: [4, 16, 4],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div> */}

      {/* Alternative Size Variation (Large) */}
      {/* <div className="flex items-center gap-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <motion.div
            key={`large-${i}`}
            className="w-3 bg-white rounded-full"
            animate={{
              height: [20, 80, 20],
              backgroundColor: ["#ffffff", "#a3a3a3", "#ffffff"]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.1,
            }}
          />
        ))}
      </div> */}

    </div>
  );
}