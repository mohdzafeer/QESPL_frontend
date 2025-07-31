import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom";

import LoginForm from "../components/Admin/adminSignIn";
import RegisterForm from "../components/Admin/adminSignup";
import ProtectedRoute from "../ProtectedRoute/protectiveRoute";
import AdminDashboard from "../components/Admin/admin.dashboard";
import UserList from "../components/Admin/component/UserList";
import Tasks from "../components/Admin/component/Tasks";
import Activity from "../components/Admin/component/Activity";
import Settings from "../components/Admin/component/Settings";
import AdminLayout from "../components/Admin/component/AdminLayout";
import Messages from "../components/Admin/component/Messages";
import RecycleBin from "../components/Admin/component/RecycleBin";
import UserLayout from "../components/User/UserLayout";
import UserDashboard from "../components/User/components/UserDashboard";
import UserTask from "../components/User/components/UserTask";
import UserMessage from "../components/User/components/UserMessage";
// import UserSettings from "../components/User/components/UserSettings";
import UserNotification from "../components/User/components/UserNotification";
import UserMyPOs from "../components/User/components/UserMyPOs";

export const AppRoutes: React.FC = () => {


  console.log("Rendering AppRoutes");
  return (
    <BrowserRouter>
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register_66890483088780765823" element={<RegisterForm />} />

          <Route element={<ProtectedRoute allowedRoles={["admin","subadmin"]} />}>
            <Route path="/admin/dashboard" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="activity" element={<Activity />} />
              <Route path="users" element={<UserList />} />
              <Route path="messages" element={<Messages />} />
              <Route path="settings" element={<Settings />} />
              <Route path="recycle-bin" element={<RecycleBin />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin","user"]} />}>
            <Route path="/user/dashboard" element={<UserLayout/>}>
              <Route index element={<UserDashboard />} />
              <Route path="tasks" element={<UserTask />} /> 
              <Route path="requests" element={<UserMessage />} />
              <Route path="notifications" element={<UserNotification />} />
              <Route path="mypos" element={<UserMyPOs />} />
              {/* <Route path="users" element={<UserUsersList />} /> */}
            </Route>
          </Route>



          <Route path="/logout" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};