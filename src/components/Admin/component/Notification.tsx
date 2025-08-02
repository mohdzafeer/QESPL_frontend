

// frontend/src/components/Admin/component/Notification.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState, type AppDispatch } from '../../../store/store';
import { removeNotification, toggleShowAll } from '../../../store/Slice/NotificationSlice';
// import { removeNotification } from '../../../store/Slice/notificationSlice';


interface NotificationItem {
  id: string | number;
  user?: string;
  imageUrl?: string;
  time: string;
  message: string;
}


interface NotificationProps {
  onClose: () => void;
}


const Notification: React.FC<NotificationProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>(); // Use typed AppDispatch
   const { notifications, showAll } = useSelector((state: RootState) => state.notifications);


  const displayedNotifications = showAll ? notifications : notifications.slice(0, 5);
  const notificationCount = showAll ? notifications.length : 5;


  return (
    <div className="absolute right-2 sm:right-4 mt-2 sm:mt-4 lg:w-80 xl:w-80 w-xs bg-white dark:bg-zinc-900 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-50 border border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800 dark:text-white text-lg sm:text-xl">Notifications</span>
          {notificationCount > 0 && (
            <span className="bg-blue-600 text-white text-xs font-semibold rounded-full px-2 py-1">
              {notificationCount}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 dark:text-white hover:text-gray-700 text-sm"
        >
          Close
        </button>
      </div>
      <ul className="max-h-80 sm:max-h-96 overflow-y-auto divide-y divide-gray-200">
        {notifications.length === 0 ? (
          <li className="px-4 py-4 text-gray-500 dark:text-white text-sm sm:text-base">No notifications</li>
        ) : (
          displayedNotifications.map((notification: NotificationItem) => (
            <li key={notification.id} className="flex items-center gap-3 px-4 py-4 hover:bg-gray-50 dark:hover:bg-zinc-700">
              <img
                src={notification.imageUrl || '/images/profile.png'}
                alt={notification.user || 'User'}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-light-wheat"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">
                    {/* {notification.user || 'Unknown'} */}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-white">
                    {new Date(notification.time).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-gray-700 dark:text-white text-sm sm:text-base mt-1 line-clamp-2 text-start">
                  {notification.message}
                </div>
                <button
                  onClick={() => dispatch(removeNotification(notification.id))}
                  className="text-red-600 hover:text-red-800 text-xs mt-1 text-end  min-w-full"
                >
                  Dismiss
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
      {notificationCount > 4 && (
        <div className="px-4 py-3 border-t border-gray-200 text-center">
          <button
            className="text-blue-600 hover:text-blue-800 text-sm sm:text-base font-medium underline-offset-2 hover:underline transition-colors"
            onClick={() => dispatch(toggleShowAll())}
          >
            {showAll ? 'Show less' : 'View all notifications'}
          </button>
        </div>
      )}
    </div>
 
  );
};


export default Notification;

