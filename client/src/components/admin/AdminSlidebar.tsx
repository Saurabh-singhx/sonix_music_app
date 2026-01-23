import { Link } from 'react-router-dom';
import { 
  Disc3, 
  Users, 
  Upload, 
  Music, 
  LayoutDashboard,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { useState } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

interface AdminSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'artists', label: 'Artists', icon: Users },
  { id: 'upload', label: 'Upload Track', icon: Upload },
  { id: 'tracks', label: 'All Tracks', icon: Music },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const AdminSidebar = ({ currentView, onViewChange, onLogout }: AdminSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "h-screen bg-card border-r border-border flex flex-col transition-all duration-300 sticky top-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-border flex items-center justify-between text-white">
        <div className={cn("flex items-center gap-2 overflow-hidden", collapsed && "justify-center")}>
          <Disc3 className="w-6 h-6 shrink-0 animate-[spin_3s_linear_infinite]" />
          {!collapsed && <span className="font-mono font-bold text-sm">SONIX ADMIN</span>}
        </div>
        <Button
          variant='ghost'
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className={cn("shrink-0 h-8 w-8", collapsed && "absolute -right-3 bg-card border border-border rounded-full")}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
              "hover:bg-accent",
              currentView === item.id 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:text-foreground",
              collapsed && "justify-center px-2"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-border space-y-1">
        <Link to="/">
          <button
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
              "text-muted-foreground hover:text-foreground hover:bg-accent",
              collapsed && "justify-center px-2"
            )}
          >
            <Music className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="font-medium">Back to Player</span>}
          </button>
        </Link>
        <button
          onClick={onLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
            "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
