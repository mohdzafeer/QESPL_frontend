import { Outlet } from 'react-router-dom';

// import Sidebar from './sidebar';
import { useState } from 'react';
// import Navbar from '../Admin/component/Navbar';
import UserSidebar from './UserSidebar';
import UserNavbar from './components/UserNavbar';

const UserLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <UserNavbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex flex-1 overflow-hidden">
        <UserSidebar isOpen={isSidebarOpen} />
        <div className="flex-1 overflow-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
