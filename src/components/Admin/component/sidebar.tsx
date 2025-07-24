import React, { useEffect, useState } from "react";
import "../../../App.css";
import { useNavigate, useLocation } from "react-router-dom";
import { IoGridOutline } from "react-icons/io5";
import { FaTasks } from "react-icons/fa";
import { VscGraphLine } from "react-icons/vsc";
import { FaRegUser } from "react-icons/fa6";
import { MdOutlineSettings } from "react-icons/md";
import { MdOutlineMessage } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import { FaUserLarge } from "react-icons/fa6";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { selectLoggedInUser } from "../../../store/Slice/authSlice";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void; // Add setIsOpen prop
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const theme = useSelector((state: any) => state.theme.theme);
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve user information directly from Redux
  const user = useSelector(selectLoggedInUser);

  const [counter, setCounter] = useState(7);
  const [isSmallScreen, setIsSmallScreen] = useState(false); // New state to track screen size

  // Effect to apply dark mode class
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Effect to detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      // Define your breakpoint. Tailwind's 'md' is typically 768px, 'lg' is 1024px.
      // Let's use 1024px as the breakpoint for "small screen" where sidebar should close.
      // Adjust this value based on your specific TailwindCSS breakpoints if needed.
      setIsSmallScreen(window.innerWidth < 1024);
    };

    // Set initial screen size
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Clean up event listener on component unmount
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  const menuItems = [
    {
      name: "Dashboard",
      id: 1,
      icon: <IoGridOutline />,
      redirectTo: "/admin/dashboard",
    },
    { name: "Tasks", id: 2, icon: <FaTasks />, redirectTo: "/admin/dashboard/tasks" },
    {
      name: "Activity",
      id: 3,
      icon: <VscGraphLine />,
      redirectTo: "/admin/dashboard/activity",
    },
    {
      name: "Users",
      id: 4,
      icon: <FaRegUser />,
      redirectTo: "/admin/dashboard/users",
    },
    {
      name: "Messages",
      id: 5,
      icon: <MdOutlineMessage />,
      redirectTo: "/admin/dashboard/messages",
    },
    {
      name: "Settings",
      id: 6,
      icon: <MdOutlineSettings />,
      redirectTo: "/admin/dashboard/settings",
    },
    {
      name: "Recycle Bin",
      id: 7,
      icon: <MdDeleteOutline />,
      redirectTo: "/admin/dashboard/recycle-bin",
    },
  ];

  const handleMenuItemClick = (redirectTo: string) => {
    navigate(redirectTo);
    // If on a small screen, close the sidebar
    if (isSmallScreen) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className={`bg-white max-h-screen dark:bg-zinc-800 dark:text-white  text-white transition-all duration-300 sm:duration-300 flex flex-col justify-between ${
        isOpen
          ? "lg:w-64 xl:w-64 md:w-64 w-screen p-6 pr-0 "
          : "w-0 p-0 overflow-hidden"
      } `}
    >
      <div>
        {isOpen && (
          <ul className="space-y-4">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.redirectTo;

              return (
                <li
                  key={item.id}
                  onClick={() => handleMenuItemClick(item.redirectTo)} // Use the new handler
                  className={`p-3 duration-200 cursor-pointer flex items-center dark:text-white ${
                    isActive
                      ? "bg-gray-100 dark:bg-zinc-700 dark:text-white text-blue-900 rounded-l-full font-semibold border-l-4 border-blue-900 dark:border-black pl-2"
                      : "hover:bg-blue-950 dark:hover:bg-black hover:text-white text-black rounded-l-full"
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  <div className="flex items-center gap-4">
                    <span>{item.name}</span>
                    <div className="">
                      {item.name === "Messages" && counter > 0 ? (
                        <span className="text-white bg-red-500 px-2.5 py-1 rounded-full text-center font-semibold text-sm">
                          {counter}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="w-11/12 shadow-lg rounded-xl  flex p-3 gap-2 cursor-pointer bg-amber-100 dark:bg-zinc-900 dark:text-zinc-300   text-black duration-300">
        <img
          src="/images/user-pic.png"
          alt="user"
          className="w-[50px] rounded-full bg-white"
        />
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-start">
            {useSelector(selectLoggedInUser).username}
          </span>
          <span className="text-sm w-fit text-start ">
            {useSelector(selectLoggedInUser).userType.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;