import React from 'react';

interface NotificationItem {
  id: string | number;
  user?: string;
  imageUrl?: string;
  time: string;
  message: string;
}

interface NotificationProps {
  notifications: NotificationItem[];
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ notifications, onClose }) => (
  <div className="absolute right-2 sm:right-4 mt-2 sm:mt-4 w-80 sm:w-96 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-50 border border-gray-200">
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
      <span className="font-semibold text-gray-800 text-lg sm:text-xl">Notifications</span>
    </div>
    <ul className="max-h-80 sm:max-h-96 overflow-y-auto divide-y divide-gray-200">
      <li className="flex items-center gap-3 px-4 py-4">
        <img
          src="/images/profile.png"
          alt="Akif"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-light-wheat"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-800 text-sm sm:text-base">Akif</span>
            <span className="text-xs sm:text-sm text-gray-500">2 min ago</span>
          </div>
          <div className="text-gray-700 text-sm sm:text-base mt-1 line-clamp-2">New PO #123 created.</div>
        </div>
      </li>
      <li className="flex items-center gap-3 px-4 py-4">
        <img
          src="/images/profile.png"
          alt="Rehan"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-light-wheat"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-800 text-sm sm:text-base">Rehan</span>
            <span className="text-xs sm:text-sm text-gray-500">10 min ago</span>
          </div>
          <div className="text-gray-700 text-sm sm:text-base mt-1 line-clamp-2">PO #122 created.</div>
        </div>
      </li>
      <li className="flex items-center gap-3 px-4 py-4">
        <img
          src="/images/profile.png"
          alt="Sharik"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-light-wheat"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-800 text-sm sm:text-base">Sharik</span>
            <span className="text-xs sm:text-sm text-gray-500">1 hour ago</span>
          </div>
          <div className="text-gray-700 text-sm sm:text-base mt-1 line-clamp-2">PO #121 created.</div>
        </div>
      </li>
    </ul>
    <div className="px-4 py-3 border-t border-gray-200 text-center">
      <button
        className="text-blue-600 hover:text-blue-800 text-sm sm:text-base font-medium underline-offset-2 hover:underline transition-colors"
        onClick={onClose}
      >
        View all notifications
      </button>
    </div>
  </div>
);

export default Notification;