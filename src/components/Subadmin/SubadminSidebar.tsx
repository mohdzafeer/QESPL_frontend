import React, { useEffect, useState } from "react";
import "../../App.css";
import { useNavigate, useLocation } from "react-router-dom";
import { IoGridOutline } from "react-icons/io5";
import { FaTasks } from "react-icons/fa";
// import { VscGraphLine } from "react-icons/vsc";
import { FaRegUser } from "react-icons/fa6";
import { MdOutlineSettings } from "react-icons/md";
import { MdOutlineMessage } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import { selectLoggedInUser } from "../../store/Slice/authSlice";
import { IoIosList } from "react-icons/io";
import { AiOutlineFileDone } from "react-icons/ai";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const subadminSidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const theme = useSelector((state: any) => state.theme.theme);
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector(selectLoggedInUser);

  const [counter, setCounter] = useState(7);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

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
      setIsSmallScreen(window.innerWidth < 1024);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const menuItems = [
    {
      name: "Dashboard",
      id: 1,
      icon: <IoGridOutline />,
      redirectTo: "/subadmin/dashboard",
    },
    { name: "Tasks", id: 2, icon: <FaTasks />, redirectTo: "/subadmin/dashboard/tasks" },
    // {
    //   name: "Activity",
    //   id: 3,
    //   icon: <VscGraphLine />,
    //   redirectTo: "/subadmin/dashboard/activity",
    // },
    {
      name: "Users",
      id: 4,
      icon: <FaRegUser />,
      redirectTo: "/subadmin/dashboard/users",
    },
    {
      name: "Messages",
      id: 5,
      icon: <MdOutlineMessage />,
      redirectTo: "/subadmin/dashboard/messages",
    },
    {
      name: "MY POs",
      id: 6,
      icon: <IoIosList />,
      redirectTo: "/subadmin/dashboard/mypos",
    },
    {
      name: "Approvals",
      id: 7,
      icon: <AiOutlineFileDone />,
      redirectTo: "/subadmin/dashboard/approve-pos",
    },
    {
      name: "Settings",
      id: 8,
      icon: <MdOutlineSettings />,
      redirectTo: "/subadmin/dashboard/settings",
    },
    {
      name: "Recycle Bin",
      id: 9,
      icon: <MdDeleteOutline />,
      redirectTo: "/subadmin/dashboard/recycle-bin",
    },
  ];

  const handleMenuItemClick = (redirectTo: string) => {
    navigate(redirectTo);
    if (isSmallScreen) {
      setIsOpen(false);
    }
  };

  // Get the first letter of the username
  const usernameInitial = user?.username ? user.username.charAt(0).toUpperCase() : '';

  return (
    <div
      className={`bg-white max-h-screen dark:bg-zinc-800 dark:text-white text-white transition-all duration-300 sm:duration-300 flex flex-col justify-between ${
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
                  onClick={() => handleMenuItemClick(item.redirectTo)}
                  className={`p-3 duration-200 cursor-pointer flex items-center dark:text-white font-semibold ${
                    isActive
                      ? "bg-gray-100 dark:bg-zinc-700 dark:text-white text-[var(--theme-color)] rounded-l-full font-semibold border-l-4 border-[var(--theme-color)] dark:border-black pl-2"
                      : "hover:bg-[var(--theme-color)] dark:hover:bg-black hover:text-gray-300 text-black rounded-l-full"
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
      <div className="w-11/12 rounded-xl flex p-3 gap-2 bg-gray-200 dark:bg-zinc-900 dark:text-zinc-300 text-black duration-300">
        {/* Replaced img with div for username initial */}
        {user?.profilePic ? ( // Check if a profile picture exists in the user object
          <img
            src={user.profilePic}
            alt={user.username || 'User'}
            className="w-[50px] h-[50px] rounded-full object-cover bg-white" // Added h-[50px] for consistent sizing
          />
        ) : (
          <div
            className="w-[50px] h-[50px] rounded-full flex items-center justify-center font-bold text-lg text-gray-800" // Increased text size, changed text color
            style={{ backgroundColor: 'white' }} // Explicitly set background to white
          >
            {usernameInitial}
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-start">
            {user?.username} {/* Use optional chaining for safety */}
          </span>
          <span className="text-sm w-fit text-start ">
            {user?.userType?.toUpperCase()} {/* Use optional chaining for safety */}
          </span>
        </div>
      </div>
    </div>
  );
};

export default subadminSidebar;