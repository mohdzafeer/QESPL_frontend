import { useState, useLayoutEffect, useEffect, useRef } from 'react';
import {
  FaTasks,
  FaTelegramPlane,
  FaTelegram,
  FaBell,
  FaCog
} from 'react-icons/fa';
import { IoGridOutline, IoGridSharp } from 'react-icons/io5';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoIosList } from "react-icons/io";
import { IoIosListBox } from "react-icons/io";
const menuItems = [
  {
    name: 'Tasks',
    filledIcon: FaTasks,
    outlineIcon: FaTasks,
    redirectTo: '/user/dashboard/tasks',
  },
  {
    name: 'Requests',
    filledIcon: FaTelegram,
    outlineIcon: FaTelegramPlane,
    redirectTo: '/user/dashboard/requests',
  },
  {
    name: 'Dashboard',
    filledIcon: IoGridSharp,
    outlineIcon: IoGridOutline,
    redirectTo: '/user/dashboard',
  },
  {
    name: 'Notifications',
    filledIcon: FaBell,
    outlineIcon: FaBell,
    redirectTo: '/user/dashboard/notifications',
  },
  {
    name: 'My POs',
    filledIcon: IoIosListBox,
    outlineIcon: IoIosList,
    redirectTo: '/user/dashboard/mypos',
  },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  itemRefs.current = new Array(menuItems.length).fill(null);

  // Step 1: Determine active index based on current pathname
  const exactMatchIndex = menuItems.findIndex(item => location.pathname === item.redirectTo);
  const startsWithIndex = menuItems.findIndex(item => location.pathname.startsWith(item.redirectTo));
  const initialIndex = exactMatchIndex !== -1 ? exactMatchIndex : startsWithIndex;

  const [activeIndex, setActiveIndex] = useState(initialIndex === -1 ? 2 : initialIndex);
  const [circlePos, setCirclePos] = useState({ left: 0 });

  // Step 2: Update circle position
  useLayoutEffect(() => {
    const current = itemRefs.current[activeIndex];
    if (current) {
      const rect = current.getBoundingClientRect();
      setCirclePos({ left: rect.left + rect.width / 2 });
    }
  }, [activeIndex]);

  // Step 3: Sync activeIndex when route changes
  useEffect(() => {
    const exactIndex = menuItems.findIndex(item => location.pathname === item.redirectTo);
    const startsWithIndex = menuItems.findIndex(item => location.pathname.startsWith(item.redirectTo));
    const newIndex = exactIndex !== -1 ? exactIndex : startsWithIndex;

    if (newIndex !== -1 && newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  }, [location.pathname]);

  const ActiveIcon = menuItems[activeIndex].filledIcon;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 shadow-lg h-20 flex justify-around items-end z-50 pb-2 text-white">
      {/* Floating circle with active icon */}
      <div
        className="absolute bottom-[36px] w-16 h-16  bg-[var(--theme-color)] rounded-full flex items-center justify-center transition-all duration-500 ease-in-out z-10"
        style={{ left: `${circlePos.left}px`, transform: 'translateX(-50%)' }}
      >
        <ActiveIcon className="text-white text-2xl" />
      </div>

      {menuItems.map((item, index) => {
        const isActive = index === activeIndex;
        const Icon = isActive ? item.filledIcon : item.outlineIcon;

        return (
          <button
            key={item.name}
            onClick={() => {
              setActiveIndex(index);
              navigate(item.redirectTo);
            }}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className={`flex flex-col items-center justify-center relative transition-all duration-300 ${
              isActive ? 'text-transparent z-0' : 'text-sm text-gray-600 dark:text-white '
            }`}
            style={{ width: '20%' }}
          >
            <Icon className={`${isActive ? 'invisible' : 'text-[var(--theme-color)] dark:text-white text-lg'}`} />
            {!isActive && <span className="text-xs mt-1">{item.name}</span>}
          </button>
        );
      })}
    </div>
  );
}
