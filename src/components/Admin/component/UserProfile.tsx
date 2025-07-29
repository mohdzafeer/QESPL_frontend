import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  changePassword,
  resetPasswordChangeState,
} from "../../../store/Slice/adminSlice";
import { toast } from "react-toastify";

interface UserProfileProps {
  name?: string;
  email?: string;
  // firstLetter prop is no longer needed as it's derived internally
}

const UserProfile: React.FC<UserProfileProps> = ({
  name,
  email: propEmail,
  // firstLetter is removed from destructuring here
}) => {
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileBgColor, setProfileBgColor] = useState("bg-gray-500"); // Initialize with a default color
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth); // Access user directly from Redux
  const { passwordChangeStatus, passwordChangeMessage, error } = useSelector(
    (state: RootState) => state.adminUser
  );

  // Function to get the first letter of the username, now defined within UserProfile
  const getFirstLetter = (username: string | undefined) => {
    if (username && username.trim().length > 0) {
      return username.trim().charAt(0).toUpperCase();
    }
    return "U"; // Default to 'U' if username is empty, null, undefined, or just whitespace
  };

  const letter = getFirstLetter(user?.username); // Derive letter directly from the Redux user


  // Effect to manage and persist the profile background color for UserProfile
  useEffect(() => {
    if (user?.id) { // Ensure user.id exists before trying to store/retrieve
      const localStorageKey = `userProfileColor_ProfilePage_${user.id}`; // Use a different key to avoid conflict with Navbar
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
        // If user is not logged in or user.id is null, ensure a default color
        setProfileBgColor("bg-gray-500"); // A default color if no user ID
    }
  }, [user?.id]); // Dependency on user.id to ensure color is set per user

  useEffect(() => {
    if (passwordChangeStatus === "succeeded") {
      toast.success(passwordChangeMessage || "Password changed successfully!");
      dispatch(resetPasswordChangeState());
      setOldPassword("");
      setNewPassword("");
      setShowPasswordFields(false);
    } else if (passwordChangeStatus === "failed" && error) {
      toast.error(error);
      dispatch(resetPasswordChangeState());
    }
  }, [passwordChangeStatus, passwordChangeMessage, error, dispatch]);

  // Log for debugging
  useEffect(() => {
    console.log("UserProfile - derived letter:", letter);
    console.log("UserProfile - persistent profileBgColor:", profileBgColor);
  }, [letter, profileBgColor]);


  const handleUpdateClick = () => {
    setShowPasswordFields(true);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userEmail = user?.email || propEmail; // Still use propEmail as a fallback for display
    if (!userEmail) {
      toast.error("User email not found. Please log in again.");
      return;
    }
    await dispatch(
      changePassword({
        email: userEmail,
        oldPassword,
        newPassword,
      })
    );
  };

  return (
    <div className="w-xs lg:w-sm xl:w-sm bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8 flex flex-col items-center space-y-5">
      {/* Profile Avatar using first letter and dynamic background color */}
      <div className="relative w-fit">
        <div
          className={`w-28 h-28 rounded-full border-4 border-blue-200 shadow-md flex items-center justify-center text-white text-5xl font-bold ${profileBgColor}`}
        >
          {letter} {/* Display the internally derived 'letter' */}
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
          {user?.username || name || "User"}
        </h2>
        <p className="text-gray-500 dark:text-white text-base">
          {user?.email || propEmail || "No email provided"}
        </p>
      </div>
      {!showPasswordFields ? (
        <button
          className="mt-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg shadow hover:from-blue-700 hover:to-blue-500 transition font-semibold"
          onClick={handleUpdateClick}
        >
          Update Password
        </button>
      ) : (
        <form
          className="w-full flex flex-col items-center space-y-3"
          onSubmit={handlePasswordSubmit}
        >
          <input
            type="password"
            placeholder="Enter old password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <div className="flex w-full justify-between space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
              onClick={() => {
                setShowPasswordFields(false);
                setOldPassword("");
                setNewPassword("");
                dispatch(resetPasswordChangeState());
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              disabled={passwordChangeStatus === "loading"}
            >
              {passwordChangeStatus === "loading" ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserProfile;
