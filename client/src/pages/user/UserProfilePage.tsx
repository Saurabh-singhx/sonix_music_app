import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import {
  Mail,
  User,
  Calendar,
  Edit3,
  Camera,
  Shield,
  MapPin,
  Link as LinkIcon,
  Twitter,
  Instagram,
  Github,
  X,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/user/user.store';
import MusicLoader from '@/components/ui/Loader';
import profileImage from '@/assets/profile.jpeg'
import type { artistGetUrlPayload } from '@/types/admin.types';
import { useAuthStore } from '@/store/auth/auth.store';
import type { updateProfileDetailsBody } from '@/types/user.types';

export interface profileDetails {
  user_id: string,
  user_name: string,
  user_email: string,
  user_profile_pic: string,
  date_of_birth: string,
  gender: string,
  created_at: string,
  totalPlaylist: number,
  totalSongLiked: number,
  timeListened: number
}

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

/**
 * EditableRow: Input field for editing profile data
 */
const EditableRow = ({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  type = "text",
  options
}: {
  icon: any,
  label: string,
  name: string,
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
  type?: string,
  options?: string[]
}) => (
  <div className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
    <div className="p-2 rounded-lg bg-white/5">
      <Icon className="w-4 h-4 text-neutral-400" />
    </div>
    <div className="flex-1">
      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">{label}</p>
      {options ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
        />
      )}
    </div>
  </div>
);

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { myProfileDetails, getMyProfileDetails, isGettingMyProfileDetails, getProfileImageUploadUrl, updateMyProfilePic, updateMyProfileDetails } = useUserStore();
  const { authUser } = useAuthStore()
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local state for editing
  const [editForm, setEditForm] = useState<updateProfileDetailsBody>({
    name: "",
    gender: "",
    dateOfBirth: ""
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [changesInProfile, setChangesInProfile] = useState({
    profilePic: false,
    profileDetails: false
  });
  const [imageFile, setImageFile] = useState<File | null>()

  useEffect(() => {
    getMyProfileDetails()
  }, [])

  // Initialize edit form when entering edit mode
  useEffect(() => {
    if (isEditing && myProfileDetails) {
      setEditForm({
        name: myProfileDetails.user_name,
        dateOfBirth: myProfileDetails.date_of_birth,
        gender: myProfileDetails.gender,
      });
      setPreviewImage(myProfileDetails.user_profile_pic);
    }
  }, [isEditing, myProfileDetails]);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimeListen = (data: number | undefined) => {

    if (data) {
      return Math.floor((data / 60) / 60)
    }
  }

  // Format date for input type="date"
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  // Calculate age
  const calculateAge = (dateString: string) => {
    if (!dateString) return 0;
    const birthDate = new Date(dateString);
    const diff = Date.now() - birthDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
    setChangesInProfile(prev => ({ ...prev, profileDetails: true }))
  };

  // Handle profile picture change
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file)
      setChangesInProfile(prev => ({ ...prev, profilePic: true }))
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setEditForm(prev => ({ ...prev, user_profile_pic: imageUrl }));

      const uploadPicUrlData: artistGetUrlPayload = {
        fileSize: file.size,
        fileType: file.type,
        userId: authUser?.user_id,
        imageType: "profile",
      };
      getProfileImageUploadUrl(uploadPicUrlData);
    }
  };

  // Handle save
  const handleSave = () => {

    if (changesInProfile.profilePic) {
      if (imageFile) {
        updateMyProfilePic(imageFile)
        console.log("profile image uploaded")
      }
    }

    if (changesInProfile.profileDetails) {
      updateMyProfileDetails(editForm)
    }
    setIsEditing(false);
    setImageFile(null);
    
    setChangesInProfile({
      profileDetails:false,
      profilePic:false
    })
  };

  // Handle cancel
  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      name: "",
      gender: "",
      dateOfBirth: ""
    });
    setPreviewImage(null);
  };

  if (isGettingMyProfileDetails) {
    return <MusicLoader />
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 selection:text-white relative overflow-hidden mt-10">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neutral-800/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neutral-800/20 rounded-full blur-[150px]" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[60%] h-[60%] bg-neutral-900/30 rounded-full blur-[200px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 brightness-100 contrast-150 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[32px_32px]"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-b from-white to-white/60">
              Profile
            </h1>
            <p className="text-neutral-400 mt-1">Manage your account and preferences</p>
          </div>

          <div className="flex items-center gap-3">
            {isEditing && (
              <MagneticButton
                onClick={handleCancel}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border border-white/30 text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
                Cancel
              </MagneticButton>
            )}
            <MagneticButton
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border",
                isEditing
                  ? "bg-white text-black border-white hover:bg-neutral-200"
                  : "bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/60"
              )}
            >
              {isEditing ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </MagneticButton>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-4 space-y-6">
            <SpotlightCard className="p-6 md:p-8">
              <div className="flex flex-col items-center text-center">
                {/* Profile Picture */}
                <div className="relative group mb-6">
                  <div className="absolute -inset-2 bg-linear-to-r from-white/20 via-white/10 to-white/20 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl">
                    {isEditing ? (
                      <img
                        src={previewImage || profileImage}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      myProfileDetails?.user_profile_pic ? (
                        <img
                          src={myProfileDetails?.user_profile_pic}
                          alt={myProfileDetails?.user_name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                      ) : (
                        <img
                          src={profileImage}
                          alt="Default Profile"
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                      )
                    )}
                  </div>

                  {isEditing && (
                    <>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleProfilePicChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-2 right-2 p-2.5 rounded-full bg-white text-black shadow-lg hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {isEditing ? (
                  <div className="w-full mb-6">
                    <input
                      type="text"
                      name="name"
                      value={editForm.name || ''}
                      onChange={handleInputChange}
                      className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-2 text-xl font-bold text-white text-center focus:outline-none focus:border-white/30 transition-colors"
                      placeholder="Your Name"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{myProfileDetails?.user_name}</h2>
                    <p className="text-neutral-400 text-sm mb-6">{myProfileDetails?.user_email}</p>
                  </>
                )}

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

              {myProfileDetails && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isEditing ? (
                    <>
                      <EditableRow
                        icon={User}
                        label="Full Name"
                        name="name"
                        value={editForm.name || ''}
                        onChange={handleInputChange}
                      />
                      <EditableRow
                        icon={Mail}
                        label="Email Address"
                        name="user_email"
                        value={myProfileDetails.user_email}
                        onChange={() => { }}
                      />
                      <EditableRow
                        icon={User}
                        label="Gender"
                        name="gender"
                        value={editForm.gender || ''}
                        onChange={handleInputChange}
                        options={['Male', 'Female', 'Non-binary', 'Prefer not to say']}
                      />
                      <EditableRow
                        icon={Calendar}
                        label="Date of Birth"
                        name="dateOfBirth"
                        value={formatDateForInput(editForm.dateOfBirth || '')}
                        onChange={handleInputChange}
                        type="date"
                      />
                    </>
                  ) : (
                    <>
                      <InfoRow
                        icon={User}
                        label="Full Name"
                        value={myProfileDetails.user_name}
                      />
                      <InfoRow
                        icon={Mail}
                        label="Email Address"
                        value={myProfileDetails.user_email}
                      />
                      <InfoRow
                        icon={User}
                        label="Gender"
                        value={myProfileDetails.gender}
                      />
                      <InfoRow
                        icon={Calendar}
                        label="Date of Birth"
                        value={`${formatDate(myProfileDetails.date_of_birth)} (${calculateAge(myProfileDetails.date_of_birth)} years)`}
                      />
                    </>
                  )}
                </div>
              )}
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
                  icon={Calendar}
                  label="Member Since"
                  value={myProfileDetails?.created_at ? formatDate(myProfileDetails.created_at) : "March 15, 2021"}
                />
                <InfoRow
                  icon={MapPin}
                  label="Location"
                  value="San Francisco, CA"
                />
                <InfoRow
                  icon={LinkIcon}
                  label="Profile URL"
                  value={`@${myProfileDetails?.user_name?.toLowerCase().replace(/\s/g, '') || 'user'}`}
                />
                <InfoRow
                  icon={Shield}
                  label="Account Status"
                  value="Active"
                />
              </div>
            </SpotlightCard>

            {/* Stats Overview */}
            <SpotlightCard className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-white/10">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Activity Overview</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-2xl font-bold text-white">{myProfileDetails?.totalPlaylist || 0}</span>
                  <span className="text-xs text-neutral-400 uppercase tracking-wider mt-1">Playlists</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-2xl font-bold text-white">{myProfileDetails?.totalSongLiked || 0}</span>
                  <span className="text-xs text-neutral-400 uppercase tracking-wider mt-1">Liked Songs</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-2xl font-bold text-white">{formatTimeListen(myProfileDetails?.timeListened) || 0}h</span>
                  <span className="text-xs text-neutral-400 uppercase tracking-wider mt-1">Hours Listened</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-2xl font-bold text-white">
                    {myProfileDetails?.date_of_birth ? calculateAge(myProfileDetails.date_of_birth) : '-'}
                  </span>
                  <span className="text-xs text-neutral-400 uppercase tracking-wider mt-1">Years Old</span>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </div>
  );
}