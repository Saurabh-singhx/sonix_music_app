
import ArtistView from "@/components/admin/ArtistView";
import AdminSidebar from "../../components/admin/AdminSlidebar";
import { useState } from "react";
import SongsView from "@/components/admin/SongsView";
import AdminDashboard from "@/components/admin/AdminDashboard";
import Analytics from "@/components/admin/Analytics";
import Settings from "@/components/admin/Settings";

export const AdminHomePage = () => {

  const [currentView, setCurrentView] = useState('artists')


  const onLogout = () => {

  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (<AdminDashboard/>)
      case 'artists':
        return (
          <ArtistView/>
        );
      case 'upload':
        return <SongsView />;
      case 'tracks':
        return (
         <div></div>
        );
      case 'analytics':
        return <Analytics/>;
      case 'settings':
        return <Settings/>;
      default:
        return <AdminDashboard/>;
    }
  };

  return (
    <div className="min-h-screen w-full flex" >

      <AdminSidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={onLogout}
      />

      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-auto">
        {renderView()}
      </main>
    </div>
  );
};


