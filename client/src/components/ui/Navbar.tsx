import { Disc3 } from 'lucide-react';
import ProfileMenu from './ProfileMenu';
import { useAuthStore } from '@/store/auth/auth.store';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const { logout, authUser } = useAuthStore();

  const handleNavigation =()=>{
    navigate("/")
  }

  const handleNavigateToProfile=()=>{
    navigate("/profile")
  }
  return (
    <div className='fixed top-0 left-0 right-0 z-50 h-20 w-full border-b border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-between px-6 md:px-12 lg:px-28 text-white shadow-2xl shadow-primary/5'>
      
      {/* Logo Section */}
      <div 
      onClick={handleNavigation}
      className='flex items-center gap-4 group cursor-pointer'>
        <div className="relative">
          {/* Glow effect behind the disc */}
          <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <Disc3 
            className='text-primary relative z-10 animate-[spin_4s_linear_infinite] group-hover:text-white transition-colors duration-300' 
            size={50} 
          />
        </div>
        
        <span className='font-black text-3xl tracking-tighter group-hover:tracking-wide transition-all duration-300 bg-clip-text text-transparent bg-linear-to-r from-white to-white/50 group-hover:bg-linear-to-r group-hover:from-primary group-hover:to-white'>
          SONIX
        </span>
      </div>

      {/* Profile Section */}
      <div className='transform hover:scale-105 transition-transform duration-200 ease-out'>
        <ProfileMenu 
          onLogoutClick={logout} 
          onProfileClick={handleNavigateToProfile}
          profileImageUrl={authUser?.user_profile_pic} 
        />
      </div>
    </div>
  );
}

export default Navbar;