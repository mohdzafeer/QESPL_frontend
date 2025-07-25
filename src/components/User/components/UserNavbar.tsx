import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
// import UserProfile from "./UserProfile";
// import Notification from "./Notification";
import { logout } from "../../../store/Slice/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import Notification from "../../Admin/component/Notification";
import UserProfile from "../../Admin/component/UserProfile";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type NavbarProps = {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
};

const UserNavbar: React.FC<NavbarProps> = ({ isSidebarOpen }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Example notifications
  const notifications = [
    { id: 1, message: "New PO #123 created.", time: "2 min ago" },
    { id: 2, message: "PO #122 marked as completed.", time: "10 min ago" },
    { id: 3, message: "PO #121 delayed.", time: "1 hour ago" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <>
      <nav className="bg-white dark:bg-zinc-900 dark:text-white px-2 sm:px-4 py-2 flex flex-wrap items-center shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] mb-4 z-[50] dark:shadow-black">
        {/* Sidebar toggle - always left on desktop, top on mobile */}
        {/* <div className="flex-shrink-0 flex items-center">
          <button
            onClick={toggleSidebar}
            className="bg-white p-2 rounded-full hover:bg-gray-100 focus:outline-none"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isSidebarOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16m-7 6h7"
                }
              />
            </svg>
          </button>
        </div> */}
        {/* Logo */}
        <div className="flex-1 flex justify-center order-2 sm:order-none">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="w-28 sm:w-40 h-auto dark:invert ml-14"
          />
        </div>
        {/* Right section */}
        <div className="flex items-center gap-2 order-3 ml-auto relative">
          {/* Bell Icon with Notification Dropdown */}
          
          {/* User Menu */}
          <Menu as="div" className="relative">
            <MenuButton className="flex items-center focus:outline-none">
              <img
                alt=""
                src="/images/user-pic.png"
                className="h-10 w-10 sm:h-12 sm:w-13 rounded-full mr-2 object-cover dark:bg-white"
              />
              <div className="hidden sm:block text-left">
                <div className="text-gray-800 dark:text-white text-base sm:text-lg font-semibold">
                  {user.username}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-200 text-xs sm:text-sm">
                  <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                  {user.userType}
                </div>
              </div>
            </MenuButton>
            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-44 sm:w-48 origin-top-right rounded-md bg-white dark:bg-zinc-950 py-1 shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] dark:shadow-black ring-1 ring-gray-200 dark:ring-gray-600 transition focus:outline-none data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
              <MenuItem>
                {({ active }) => (
                  <a
                    type="button"
                    href="#"
                    onClick={() => setShowProfile(true)}
                    className={classNames(
                      active ? "bg-gray-100 dark:bg-zinc-900" : "",
                      "block w-full px-4 py-2 text-sm text-gray-700 dark:text-white"
                    )}
                  >
                    View Profile
                  </a>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <a
                    href="#"
                    type="button"
                    onClick={handleLogout}
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm text-gray- hover:bg-red-600 hover:text-white"
                    )}
                  >
                    Sign out
                  </a>
                )}
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </nav>
      {/* UserProfile Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="relative">
            <button
              className="absolute top-2 right-2 text-gray-500 dark:text-white hover:text-gray-800 text-2xl font-bold z-10"
              onClick={() => setShowProfile(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <UserProfile
              name="Mohd Sufian"
              email="sufian@gmail.com"
              imageUrl="/images/user-pic.png"
              // onUpdatePassword={() => alert('Update password clicked!')}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default UserNavbar;
