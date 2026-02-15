import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MessageCircle, LogOut } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

interface ProfileMenuProps {
  profileImageUrl?: string;
  onProfileClick?: () => void;
  onContactClick?: () => void;
  onLogoutClick?: () => void;
}

export function ProfileMenu({
  profileImageUrl,
  onProfileClick,
  onContactClick,
  onLogoutClick,
}: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-4 h-4" />,
      onClick: onProfileClick,
    },
    {
      id: 'contact',
      label: 'Contact Us',
      icon: <MessageCircle className="w-4 h-4" />,
      onClick: onContactClick,
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: <LogOut className="w-4 h-4" />,
      onClick: onLogoutClick,
    },
  ];

  const handleItemClick = (item: MenuItem) => {
    item.onClick?.();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {isOpen && (
          <div className="absolute top-full right-0 flex flex-col items-end gap-2 mt-3 z-11">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 20,
                  delay: isOpen ? index * 0.08 : (menuItems.length - 1 - index) * 0.05,
                }}
                onClick={() => handleItemClick(item)}
                className="flex items-center justify-end gap-3 px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-full
                         text-zinc-100 text-sm font-medium shadow-lg shadow-black/30
                         hover:bg-zinc-800 hover:border-zinc-500 hover:scale-105
                         active:scale-95 transition-colors duration-200
                         whitespace-nowrap w-full"
              >
                <span>{item.label}</span>
                <span className="text-zinc-400">{item.icon}</span>
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Profile Picture Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative w-12 h-12 rounded-full overflow-hidden border-2 
                   ${isOpen ? 'border-white' : 'border-zinc-600'}
                   hover:border-zinc-400 transition-colors duration-300
                   shadow-lg shadow-black/40 bg-zinc-800`}
      >
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-800">
            <User className="w-6 h-6 text-zinc-400" />
          </div>
        )}

        {/* Status indicator */}
        <span
          className={`absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-zinc-900
                     ${isOpen ? 'bg-green-500' : 'bg-zinc-500'} transition-colors duration-300`}
        />
      </motion.button>
    </div>
  );
}

export default ProfileMenu;
