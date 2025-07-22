// src/page/UserDashboard.tsx
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { logout, resetAuth } from "../store/Slice/authSlice"; // Adjust path
import type { AppDispatch } from "../store/store";
import { logout } from "../store/Slice/authSlice";

const UserDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div>
      <h1>User Dashboard</h1>
      <p>Welcome, User!</p>
      <button
        onClick={handleLogout}
        className="p-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default UserDashboard;