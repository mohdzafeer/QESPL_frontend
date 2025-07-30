import React, { useState, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import { logout } from "../../../store/Slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../../store/store";
import Notification from "../../Admin/component/Notification";
import UserProfile from "../../Admin/component/UserProfile";
import { setTheme } from "../../../store/Slice/themeSlice";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type NavbarProps = {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
};

const UserNavbar: React.FC<NavbarProps> = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );
  console.log(notifications, "notifications shariq khan");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const notificationCount = notifications.length;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
    // Clear the stored color on logout for both Navbar and Profile
    localStorage.removeItem(`userProfileColor_Navbar_${user?.id}`);
    localStorage.removeItem(`userProfileColor_ProfilePage_${user?.id}`);
  };

  const theme = useSelector((state: RootState) => state.theme.theme);
  const [darkModeIcon, setDarkModeIcon] = useState(theme === "dark");
  const [profileBgColor, setProfileBgColor] = useState("bg-gray-500");

  useEffect(() => {
    setDarkModeIcon(theme === "dark");
  }, [theme]);

  // Effect to manage and persist the profile background color
  useEffect(() => {
    if (user?.id) {
      const localStorageKey = `userProfileColor_Navbar_${user.id}`;
      const storedColor = localStorage.getItem(localStorageKey);
      if (storedColor) {
        setProfileBgColor(storedColor);
      } else {
        const colors = [
          "bg-red-500",
          "bg-blue-500",
          "bg-green-500",
          "bg-yellow-500",
          "bg-purple-500",
          "bg-pink-500",
          "bg-indigo-500",
          "bg-teal-500",
        ]; // Added more colors for variety
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        setProfileBgColor(randomColor);
        localStorage.setItem(localStorageKey, randomColor);
      }
    } else {
      setProfileBgColor("bg-gray-500");
    }
  }, [user?.id]); // Recalculate or retrieve only when user ID changes

  const toggleDarkMode = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    dispatch(setTheme(newTheme));
  };

  const getFirstLetter = (username: string | undefined) => {
    if (username && username.trim().length > 0) {
      return username.trim().charAt(0).toUpperCase();
    }
    return "U"; // Default to 'U' if username is empty, null, undefined, or just whitespace
  };

  const letter = getFirstLetter(user?.username);

  return (
    <>
      <nav className="bg-white dark:bg-zinc-950 px-2 sm:px-4 py-2 flex flex-wrap items-center shadow-[5px_5px_15px_#d1d9e6_dark:shadow-black,-5px_-5px_15px_#ffffff] mb-4 z-[50]">
        {/* Logo - Moved to the left */}
        <div className="flex-shrink-0 flex items-center">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="w-28 sm:w-40 h-auto dark:invert cursor-pointer"
            onClick={() => navigate("/user/dashboard")}
          />
        </div>

        {/* Spacer to push right section to the right */}
        <div className="flex-1 flex justify-center sm:justify-end order-2 sm:order-none"></div>

        {/* Right section */}
        <div className="flex items-center gap-2 order-3 ml-auto relative">
          {/* Dark Mode Button */}
          <button
            type="button"
            className="relative rounded-full bg-white p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-light-wheat focus:outline-none mr-1 sm:mr-4 transition-transform duration-300 ease-in-out"
            onClick={toggleDarkMode}
          >
            <span className="sr-only">Toggle dark mode</span>
            {darkModeIcon ? (
              // Sun icon for light mode
              <svg
                className="h-7 w-7 sm:h-8 sm:w-8 text-yellow-500 transition-transform duration-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 00-.707-.293H15a1 1 0 000-2h-.05A1 1 0 0013.757 3.636l-.707.707a1 1 0 001.414 1.414l.707-.707zM10 18a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zM5.05 4.95L4.343 4.243a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414zm-.707 10.607l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1z" />
              </svg>
            ) : (
              // Moon icon for dark mode
              <svg
                className="h-7 w-7 sm:h-8 sm:w-8 text-gray-800 transition-transform duration-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          {/* Bell Icon with Notification Dropdown */}
          <div className="relative">
            <button
              type="button"
              className="relative rounded-full bg-white p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-light-wheat focus:outline-none mr-1 sm:mr-4"
              onClick={() => setShowNotifications((prev) => !prev)}
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="h-7 w-7 sm:h-8 sm:w-8" />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {notificationCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <Notification onClose={() => setShowNotifications(false)} />
            )}
          </div>
          {/* User Menu */}
          <Menu as="div" className="relative">
            <MenuButton className="flex items-center focus:outline-none">
              <div
                // Changed sm:w-13 to sm:w-12 for a perfect circle
                // Reverted to using Tailwind class directly for background color
                className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center text-white text-lg font-semibold mr-2 ${profileBgColor}`}
              >
                {letter}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-gray-800 text-base sm:text-lg font-semibold dark:text-white">
                  {user?.username || "Unknown"}
                </div>
                <div className="flex items-center text-gray-600 text-xs sm:text-sm dark:text-gray-300">
                  <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                  {user?.userType || "Unknown"}
                </div>
              </div>
            </MenuButton>
            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-44 sm:w-48 origin-top-right rounded-md bg-white dark:bg-zinc-800 py-1 shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] dark:shadow-black ring-1 ring-gray-200 dark:ring-gray-800 transition focus:outline-none data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
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
                      active ? "bg-gray-100 dark:bg-zinc-800" : "",
                      "block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-red-600 hover:text-white"
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
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold z-10"
              onClick={() => setShowProfile(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <UserProfile /> {/* UserProfile now handles its own user data */}
          </div>
        </div>
      )}
    </>
  );
};

export default UserNavbar;
