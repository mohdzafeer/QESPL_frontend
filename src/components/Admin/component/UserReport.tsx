import React from "react";

interface UserReportProps {
  username?: string; // From API
  employeeId?: string; // From API
  email: string;
  Isverified?: boolean; // From API
  orderCount?: number; // From API
  name?: string; // From static data (fallback)
  userId?: string; // From static data (fallback)
  profilePicture?: string;
  totalPO?: number; // From static data (fallback)
  completedPO?: number;
  pendingPO?: number;
  delayedPO?: number;
  lastLogin?: string;
  role?: string;
  onClose?: () => void;
}

const UserReport: React.FC<UserReportProps> = ({
  username,
  employeeId,
  email,
  Isverified,
  orderCount,
  profilePicture, // From API
  completedPO,
  pendingPO,
  delayedPO,
  lastLogin,
  role,
  onClose,
}) => (
  <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 flex flex-col items-center space-y-6 relative">
    {onClose && (
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold z-10"
        onClick={onClose}
        aria-label="Close"
        type="button"
      >
        &times;
      </button>
    )}
    <img
      src={profilePicture || "/images/profile.png"} // Fallback image
      alt="Profile"
      className="w-24 h-24 rounded-full border-4 border-blue-200 shadow-md object-cover"
    />
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800">{username}</h2>
      <p className="text-gray-500">{email}</p>
      <p className="text-gray-400 text-sm mt-1">
        EmployeeId: <span className="font-mono">{employeeId}</span>
      </p>
      <p className="text-blue-600 text-sm mt-1 font-semibold">{role}</p>
    </div>
    <div className="w-full grid grid-cols-2 gap-4 mt-4">
      <div className="bg-blue-50 rounded-lg p-4 text-center">
        <div className="text-lg font-bold text-blue-700">{orderCount}</div>
        <div className="text-xs text-gray-500">Total PO Generated</div>
      </div>
      <div className="bg-green-50 rounded-lg p-4 text-center">
        <div className="text-lg font-bold text-green-700">{completedPO}</div>
        <div className="text-xs text-gray-500">Completed PO</div>
      </div>
      <div className="bg-yellow-50 rounded-lg p-4 text-center">
        <div className="text-lg font-bold text-yellow-700">{pendingPO}</div>
        <div className="text-xs text-gray-500">Pending PO</div>
      </div>
      <div className="bg-red-50 rounded-lg p-4 text-center">
        <div className="text-lg font-bold text-red-700">{delayedPO}</div>
        <div className="text-xs text-gray-500">Delayed PO</div>
      </div>
    </div>
    <div className="w-full mt-6">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Last Login:</span>
        <span className="font-medium">{lastLogin}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Status:</span>
        <span
          className={`font-medium ${
            Isverified ? "text-green-600" : "text-red-600"
          }`}
        >
          {Isverified ? "Verified" : "Unverified"}
        </span>
      </div>
    </div>
  </div>
);

export default UserReport;
