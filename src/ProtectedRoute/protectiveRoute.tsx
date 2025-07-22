import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { RootState, AppDispatch } from "../store/store";
import { logout } from "../store/Slice/authSlice";
import { useEffect } from "react";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    if (!storedToken) {
      console.log("ProtectedRoute - No token found, logging out");
      dispatch(logout());
    }
  }, [dispatch, user, token]);

  const storedToken = localStorage.getItem("jwt");
  if (!storedToken || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.userType)) {
    const redirectPath = user.userType === "admin" ? "/admin/dashboard" : "/user/dashboard";
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;