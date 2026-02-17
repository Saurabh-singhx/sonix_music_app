import {motion} from "framer-motion"
import { Disc } from 'lucide-react'
import { VisualizerBar } from "./VisualizerBar"

function AuthMusiCard() {
  return (
    <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:flex flex-col justify-between p-8 bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-3xl shadow-2xl relative overflow-hidden"
        >
          {/* Decorative top gradient line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Disc className="w-7 h-7 text-white animate-spin-slow" />
              </div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
                Sonix
              </h1>
            </div>

            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Experience music like never before. Dive into a world of high-fidelity sound, curated playlists, and seamless connectivity.
            </p>
          </div>

          {/* Interactive Visualizer Area */}
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="relative">
              {/* Album Art Placeholder */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-64 h-64 rounded-full bg-linear-to-tr from-slate-800 to-slate-900 border-4 border-slate-800 shadow-2xl flex items-center justify-center relative z-10"
              >
                <div className="w-56 h-56 rounded-full bg-linear-to-br from-indigo-900/50 to-purple-900/50 flex items-center justify-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop"
                    alt="Album Art"
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
                <div className="absolute inset-0 rounded-full border border-white/5" />
              </motion.div>

              {/* Visualizer Bars around the disc */}
              <div className="absolute inset-0 flex items-center justify-center -z-10">
                <div className="flex gap-1 items-end h-80">
                  {[...Array(12)].map((_, i) => (
                    <VisualizerBar key={i} delay={i * 0.1} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full" />
                </div>
              ))}
            </div>
            <p>Join 10,000+ listeners today</p>
          </div>
        </motion.div>
  )
}

export default AuthMusiCard