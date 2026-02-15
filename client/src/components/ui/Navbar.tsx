import { Disc3} from 'lucide-react'
import ProfileMenu from './ProfileMenu'
import { useAuthStore } from '@/store/auth/auth.store'

function Navbar() {

  const {logout,authUser}= useAuthStore();

  return (
    <div className='h-24 w-full border-b border-b-gray-600 flex items-center content-center justify-between px-28 text-white' >
        <div className='flex gap-4'><Disc3 className='text-white animate-spin animation-duration-[3s]' size={60}/> <span className='font-bold text-4xl mt-auto mb-auto'>SONIX</span></div>
         
        <div className=''> 
          <ProfileMenu onLogoutClick={logout} profileImageUrl={authUser?.user_profile_pic}/>
        </div>
    </div>
  ) 
}

export default Navbar