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

  // Modified logic: If the user's role is not in the allowedRoles array,
  // they are redirected to the login page.
  if (!allowedRoles.includes(user.userType)) {
    console.log(`User type '${user.userType}' not in allowed roles: [${allowedRoles.join(", ")}]`);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;