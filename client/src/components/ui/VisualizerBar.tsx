
import { motion} from 'framer-motion';

// --- Components ---

/**
 * Simulated Audio Visualizer Bar
 */
export const VisualizerBar = ({ delay }: { delay: number }) => {
  return (
    <motion.div
      className="w-1.5 bg-linear-to-t from-indigo-500 to-purple-400 rounded-full opacity-80"
      animate={{
        height: [10, 40, 15, 60, 20],
        opacity: [0.5, 1, 0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.2,
        repeat: Infinity,
        repeatType: "reverse",
        delay: delay,
        ease: "easeInOut",
      }}
    />
  );
};



