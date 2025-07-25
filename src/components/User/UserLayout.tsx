import { Outlet } from 'react-router-dom';

// import Sidebar from './sidebar';
import { useEffect, useState } from 'react';
// import Navbar from '../Admin/component/Navbar';
import UserSidebar from './UserSidebar';
import UserNavbar from './components/UserNavbar';
import { useSelector } from 'react-redux';

const UserLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

const theme = useSelector((state:any) => state.theme.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-zinc-700">
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
