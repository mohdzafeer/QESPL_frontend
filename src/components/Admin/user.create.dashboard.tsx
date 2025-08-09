import "./assets/css/admin.css";
import UserReport from "./component/UserReport";
import Navbar from "./component/Navbar";
import Sidebar from "./component/sidebar";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";
import type { AppDispatch, RootState } from "../../store/store";
import {
  getUserWithWithOp,
  deleteUser,
  searchAdminUser,
} from "../../store/Slice/adminSlice";

const USERS_PER_PAGE = 5; // Set how many users per page
const FRONTEND_BASE_URL =
  import.meta.env.VITE_FRONTEND_BASE_URL ||
  "http://localhost:5173/images/profile.png";

export  const createUserDashboard = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showAlert, setShowAlert] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showReport, setShowReport] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, react-hooks/rules-of-hooks
  const [selectedUser, setSelectedUser] = useState<any>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, react-hooks/rules-of-hooks
  const [searchQuery, setSearchQuery] = useState<string>("");

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dispatch = useDispatch<AppDispatch>();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { users } = useSelector((state: RootState) => state.adminUser);
  

  // Fetch users on mount and when currentPage changes
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    dispatch(getUserWithWithOp({ page: currentPage, limit: USERS_PER_PAGE }));
  }, [dispatch, currentPage]);

  // Pagination logic
  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
  const paginatedUsers = users.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleViewReport = (user: any) => {
    setSelectedUser(user);
    setShowReport(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setShowAlert(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete));
      setShowAlert(false);
      setUserToDelete(null);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  ///// for the search functionality
  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/rules-of-hooks
  const handleSearchChange = useCallback(
    debounce((query: string) => {
      setCurrentPage(1); // Reset to first page on search
      if (query.trim() === "") {
        dispatch(getUserWithWithOp({ page: 1, limit: USERS_PER_PAGE }));
      } else {
        dispatch(searchAdminUser({ query }));
      }
    }, 500), // 500ms debounce delay
    [dispatch]
  );

  return (
    <div className="dash p-2 sm:p-4 md:p-6 m-1 sm:m-2 md:m-4 rounded bg-gray-100 min-h-[calc(100vh-64px)] w-full relative">
      {/* Overlay for blur and dark background */}
      {showAlert && (
        <div
          className="
          absolute inset-0 z-40
          bg-black/30
          backdrop-blur-sm
          transition-all duration-300
        "
        />
      )}
      <div
        id="alert-additional-content-2"
        className={`
        fixed left-1/2 top-1/2 z-50
        -translate-x-1/2 -translate-y-1/2
        p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-black dark:text-red-400 dark:border-red-800
        transition-all duration-300 ease-in-out
        w-[90vw] max-w-sm sm:max-w-md md:max-w-lg
        ${
          showAlert
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }
      `}
        role="alert"
      >
        <div className="flex items-center">
          <svg
            className="shrink-0 w-4 h-4 me-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <h3 className="text-lg font-medium">
            Are you sure you want to remove this user?
          </h3>
        </div>
        <div className="mt-2 mb-4 text-sm">
          Click on "Delete" to remove the user or "Dismiss" to close this alert.
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            className="text-white bg-red-800 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            onClick={confirmDelete}
          >
            Delete
          </button>
          <button
            type="button"
            className="text-red-800 bg-transparent border border-red-800 hover:bg-red-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center dark:hover:bg-red-600 dark:border-red-600 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800"
            onClick={() => {
              setShowAlert(false);
              setUserToDelete(null);
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
      {showReport && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold z-10"
              onClick={() => setShowReport(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <UserReport {...selectedUser} />
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <div className="bg-black p-4 rounded-lg shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff]">
          <p className="text-white">Total PO Generated</p>
          <p className="text-2xl font-bold text-white">150</p>
          <p className="text-white text-sm">+5% last month</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff]">
          <p className="text-2xl font-bold text-gray-800">90</p>
          <p className="text-gray-600">Complete PO</p>
          <p className="text-green-500 text-sm">+3% last month</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff]">
          <p className="text-gray-600">Pending PO</p>
          <p className="text-2xl font-bold text-gray-800">40</p>
          <p className="text-yellow-500 text-sm">+2% last month</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff]">
          <p className="text-gray-600">Delayed PO</p>
          <p className="text-2xl font-bold text-gray-800">20</p>
          <p className="text-red-500 text-sm">+1% last month</p>
        </div>
      </div>
      <div className="bg-white rounded-lg overflow-x-auto">
        <div className="header bg-gray-100 p-1 text-xl font-bold text-gray-800 w-full flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="bg-gray-100 p-1 text-xl font-bold text-gray-800 w-full sm:w-auto text-x3 text-left">
            User List
          </span>
          <div className="filter flex flex-col sm:flex-row items-center w-full sm:w-auto gap-2">
            <span className="search bg-white w-full sm:w-80 flex items-center justify-center rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="p-2 size-10"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                id="search"
                name="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearchChange(e.target.value);
                }}
                type="search"
                placeholder="Search Users..."
                className="w-full p-2 font-semibold text-sm"
              />
            </span>
            <button className="bg-white text-gray-800 p-2 w-10 h-10 hover:bg-black hover:text-white focus:outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                />
              </svg>
            </button>
            <button className="bg-white text-gray-800 p-2 w-10 h-10 hover:bg-black hover:text-white focus:outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-center p-2 text-gray-600">Img</th>
                <th className="text-center p-2 text-gray-600">Name</th>
                <th className="text-center p-2 text-gray-600">Email Address</th>
                <th className="text-center p-2 text-gray-600">PO Count</th>
                <th className="text-center p-2 text-gray-600">Remove User</th>
                <th className="text-center p-2 text-gray-600">View User</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr className="border-b border-gray-200" key={user._id}>
                  <td className="p-2 text-center rounded-full w-10 h-10 text-gray-800">
                    <img
                      src={
                        user.profilePicture
                          ? user.profilePicture
                          : FRONTEND_BASE_URL
                      }
                      alt={`${user.username}'s profile`}
                      className="w-8 h-8 mx-auto rounded-full object-cover"
                    />
                  </td>
                  <td className="p-2 text-center text-gray-800">
                    {user.username}
                  </td>
                  <td className="p-2 text-center text-gray-800">
                    {user.email}
                  </td>
                  <td className="p-2 text-center text-gray-800">
                    {user.orderCount}
                  </td>
                  <td className="p-2 text-center text-white">
                    <button
                      className="bg-red-500 p-2 hover:bg-red-200 hover:text-red-800 focus:outline-none w-1"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Remove
                    </button>
                  </td>
                  <td className="p-2 text-center text-gray-800">
                    <button
                      className="bg-blue-500 w-10 h-10 p-2 hover:bg-blue-700 text-white focus:outline-none w-1"
                      onClick={() => handleViewReport(user)}
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-2 py-4">
          <button
            className="px-3 py-1 rounded bg-black text-white hover:bg-gray-800 disabled:opacity-50 transition"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Previous Page"
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`px-3 py-1 rounded border transition ${
                currentPage === i + 1
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-300 hover:bg-black hover:text-white"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded bg-black text-white hover:bg-gray-800 disabled:opacity-50 transition"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next Page"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="flex-1 overflow-auto">
          <createUserDashboard />
        </div>
      </div>
    </div>
  );
};

export default App;
