import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { 
  Mail, 
  User, 
  Calendar, 
  Music, 
  ListMusic, 
  Heart,
  Edit3,
  Camera,
  Shield,
  MapPin,
  Link as LinkIcon,
  Twitter,
  Instagram,
  Github
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * SpotlightCard: A wrapper that adds a dynamic spotlight effect on hover
 */
const SpotlightCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -inset-px transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
};

/**
 * MagneticButton: A button that slightly moves towards the cursor
 */
const MagneticButton = ({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    x.set((clientX - centerX) / 4);
    y.set((clientY - centerY) / 4);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x: springX, y: springY }}
      className={cn("relative group", className)}
    >
      {children}
    </motion.button>
  );
};

/**
 * StatCard: Individual statistic display
 */
const StatCard = ({ icon: Icon, label, value, delay }: { icon: any, label: string, value: string | number, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
  >
    <div className="p-3 rounded-full bg-white/10">
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-neutral-400 uppercase tracking-wider">{label}</p>
    </div>
  </motion.div>
);

/**
 * InfoRow: Display label and value in a row
 */
const InfoRow = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
    <div className="p-2 rounded-lg bg-white/5">
      <Icon className="w-4 h-4 text-neutral-400" />
    </div>
    <div className="flex-1">
      <p className="text-xs text-neutral-500 uppercase tracking-wider">{label}</p>
      <p className="text-sm text-white font-medium">{value}</p>
    </div>
  </div>
);

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  // Default/mock data if user is not available
  const userData = {
    name: 'Alex Chen',
    email: 'alex.chen@example.com',
    profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop',
    gender: 'Male',
    dateOfBirth: '1995-08-15',
    role: 'Premium Member',
    totalSongsLiked: 2847,
    totalPlaylistsCreated: 42
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate age
  const calculateAge = (dateString: string) => {
    const birthDate = new Date(dateString);
    const diff = Date.now() - birthDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  const stats = [
    { icon: Heart, label: 'Songs Liked', value:10 },
    { icon: ListMusic, label: 'Playlists', value: 15 },
    { icon: Music, label: 'Hours Listened', value: '1,247' },
    { icon: Calendar, label: 'Member Since', value: '2021' }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 selection:text-white relative overflow-hidden mt-10">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neutral-800/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neutral-800/20 rounded-full blur-[150px]" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[60%] h-[60%] bg-neutral-900/30 rounded-full blur-[200px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 brightness-100 contrast-150 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
              Profile
            </h1>
            <p className="text-neutral-400 mt-1">Manage your account and preferences</p>
          </div>
          <MagneticButton 
            onClick={() => setIsEditing(!isEditing)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border",
              isEditing
                ? "bg-white text-black border-white hover:bg-neutral-200"
                : "bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/60"
            )}
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </MagneticButton>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-4 space-y-6">
            <SpotlightCard className="p-6 md:p-8">
              <div className="flex flex-col items-center text-center">
                {/* Profile Picture */}
                <div className="relative group mb-6">
                  <div className="absolute -inset-2 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl">
                    <img 
                      src={userData.profilePic} 
                      alt={userData.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-2 right-2 p-2.5 rounded-full bg-white text-black shadow-lg hover:scale-110 transition-transform">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                  {/* Role Badge */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-1.5">
                    <Shield className="w-3 h-3 text-white" />
                    <span className="text-xs font-medium text-white whitespace-nowrap">{userData.role}</span>
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{userData.name}</h2>
                <p className="text-neutral-400 text-sm mb-6">{userData.email}</p>

                {/* Social Links */}
                <div className="flex items-center gap-3">
                  {[Twitter, Instagram, Github, LinkIcon].map((Icon, i) => (
                    <MagneticButton 
                      key={i}
                      className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors text-neutral-400 hover:text-white"
                    >
                      <Icon className="w-4 h-4" />
                    </MagneticButton>
                  ))}
                </div>
              </div>
            </SpotlightCard>

            {/* Quick Stats */}
            <SpotlightCard className="p-6">
              <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">Activity Overview</h3>
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, i) => (
                  <StatCard key={i} {...stat} delay={0.1 + i * 0.1} />
                ))}
              </div>
            </SpotlightCard>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Personal Information */}
            <SpotlightCard className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-white/10">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow 
                  icon={User} 
                  label="Full Name" 
                  value={userData.name} 
                />
                <InfoRow 
                  icon={Mail} 
                  label="Email Address" 
                  value={userData.email} 
                />
                <InfoRow 
                  icon={User} 
                  label="Gender" 
                  value={userData.gender} 
                />
                <InfoRow 
                  icon={Calendar} 
                  label="Date of Birth" 
                  value={`${formatDate(userData.dateOfBirth)} (${calculateAge(userData.dateOfBirth)} years)`} 
                />
              </div>
            </SpotlightCard>

            {/* Account Details */}
            <SpotlightCard className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-white/10">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Account Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow 
                  icon={Shield} 
                  label="Account Role" 
                  value={userData.role} 
                />
                <InfoRow 
                  icon={Calendar} 
                  label="Member Since" 
                  value="March 15, 2021" 
                />
                <InfoRow 
                  icon={MapPin} 
                  label="Location" 
                  value="San Francisco, CA" 
                />
                <InfoRow 
                  icon={LinkIcon} 
                  label="Profile URL" 
                  value="@alexchen" 
                />
              </div>
            </SpotlightCard>

            {/* Music Preferences */}
            <SpotlightCard className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-white/10">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Music Statistics</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/10">
                  <Heart className="w-8 h-8 text-white mb-3" />
                  <p className="text-3xl font-bold text-white mb-1">{userData.totalSongsLiked.toLocaleString()}</p>
                  <p className="text-sm text-neutral-400">Songs Liked</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/10">
                  <ListMusic className="w-8 h-8 text-white mb-3" />
                  <p className="text-3xl font-bold text-white mb-1">{userData.totalPlaylistsCreated}</p>
                  <p className="text-sm text-neutral-400">Playlists Created</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/10">
                  <Music className="w-8 h-8 text-white mb-3" />
                  <p className="text-3xl font-bold text-white mb-1">1,247</p>
                  <p className="text-sm text-neutral-400">Hours Listened</p>
                </div>
              </div>

              {/* Top Genres */}
              <div className="mt-6">
                <p className="text-sm text-neutral-400 mb-3">Top Genres</p>
                <div className="flex flex-wrap gap-2">
                  {['Electronic', 'Ambient', 'Jazz', 'Classical', 'Lo-Fi'].map((genre) => (
                    <span 
                      key={genre}
                      className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-neutral-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </SpotlightCard>

          </div>
        </div>
      </div>
    </div>
  );
}