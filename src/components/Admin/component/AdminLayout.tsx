import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './sidebar';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      // Set a breakpoint for mobile vs. desktop (e.g., 768px)
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    // Set initial state based on current window width
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}/>
        <div className="flex-1 overflow-auto p-4 no-scrollbar">
          <Outlet/>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
