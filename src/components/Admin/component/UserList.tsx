import React, { useEffect, useState } from "react";
import AddUserForm from "./AddUserForm";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import SubadminAddUserForm from "../../Subadmin/SubadminAddUserForm";
import { apiDeleteUser, apiSearchUser, fetchLoginUser, getAllUsers } from "../../../utils/api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

interface User {
  _id: { $oid: string };
  username: string;
  email: string; // Optional field
  userType: "user" | "subadmin";
  employeeId: string;
  profilePicture: string | null;
  designation: string;
  createdAt: { $date: string };
  updatedAt: { $date: string };
  __v: number;
}

const UserDetailsForm: React.FC = () => {
  // const users: User[] = [
  //   {
  //     _id: { $oid: "688723296d314bb00b3bb0fb" },
  //     username: "john.doe",
  //     email: "john.doe@example.com",
  //     userType: "user",
  //     employeeId: "EMP-001",
  //     profilePicture: null,
  //     designation: "Software Engineer",
  //     createdAt: { $date: "2025-07-28T07:13:45.760Z" },
  //     updatedAt: { $date: "2025-07-28T07:13:45.760Z" },
  //     __v: 0,
  //   },
  //   {
  //     _id: { $oid: "688723296d314bb00b3bb0fc" },
  //     username: "jane.smith",
  //     email: "jane.smith@example.com",
  //     userType: "subadmin",
  //     employeeId: "ADM-001",
  //     profilePicture: null,
  //     designation: "Project Manager",
  //     createdAt: { $date: "2025-07-28T07:14:00.000Z" },
  //     updatedAt: { $date: "2025-07-28T07:14:00.000Z" },
  //     __v: 0,
  //   },
  //   {
  //     _id: { $oid: "688723296d314bb00b3bb0fd" },
  //     username: "peter.jones",
  //     email: "peter.jones@example.com",
  //     userType: "user",
  //     employeeId: "EMP-002",
  //     profilePicture: null,
  //     designation: "UX Designer",
  //     createdAt: { $date: "2025-07-28T07:15:00.000Z" },
  //     updatedAt: { $date: "2025-07-28T07:15:00.000Z" },
  //     __v: 0,
  //   },
  // ];
  const dispatch=useDispatch()
  const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500"];

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async() => {
    if (userToDelete) {
      console.log(`Deleting user with ID: ${userToDelete._id}`);
      await apiDeleteUser(userToDelete._id).then(()=>console.log(`User : ${userToDelete.username} with EmployeeID : ${userToDelete.employeeId} has been deleted and cannot be undone now`))
      toast.success(`User : ${userToDelete.username} is deleted`)
      
      setShowDeleteModal(false);
      setUserToDelete(null);
      // dispatch(getAllUsers())
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  
const { user } = useSelector((state: RootState) => state.auth);
const [userData, setUserData] = useState([])
useEffect(()=>{
  try {
    const allUsers=getAllUsers();
    allUsers.then((data) => {
      // console.log(data,"zafeer..................");
      setUserData(data.data);
      console.log(data, "Fetched Users Data");
      // You can set the fetched users to state if needed
      // setUsers(data);
    }).catch((error) => {
      console.error("Error fetching users:", error);
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    
  }
},[])





  return (
    <div className="">
      {/* <AddUserForm /> */}
      {user.userType === "admin" ? (
        <AddUserForm/>
      ):(
        <SubadminAddUserForm/>
      )}
      <hr />
      <div>
        <h1 className="text-lg font-bold">User List</h1>
        <div>
          <div className="p-4  min-h-screen">
            {/* Mobile Card View (default) */}
            <div className="md:hidden space-y-4">
              {userData.map((user:any) => (
                <div
                  key={user._id}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                  <div className="text-sm text-gray-700">
                    <div className="flex border-b pb-2">
                      <span className="font-semibold text-gray-500 w-32 flex-shrink-0 text-start">
                        Username:
                      </span>
                      <span className="truncate">{user.username}</span>
                    </div>
                    <div className="flex border-b py-2">
                      <span className="font-semibold text-gray-500 w-32 flex-shrink-0 text-start">
                        Email:
                      </span>
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex border-b py-2">
                      <span className="font-semibold text-gray-500 w-32 flex-shrink-0 text-start">
                        User Type:
                      </span>
                      <span>{user.userType}</span>
                    </div>
                    <div className="flex border-b py-2">
                      <span className="font-semibold text-gray-500 w-32 flex-shrink-0 text-start">
                        Employee ID:
                      </span>
                      <span>{user.employeeId}</span>
                    </div>
                    <div className="flex pt-2">
                      <span className="font-semibold text-gray-500 w-32 flex-shrink-0 text-start">
                        Designation:
                      </span>
                      <span>{user.desgination}</span>
                    </div>
                    {/* Actions Button for Mobile View */}
                    <div className="mt-4 pt-4 border-t">
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition-colors"
                      >
                        Delete User
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto shadow-md rounded-lg">
              <table className="min-w-full bg-white dark:bg-zinc-800 table-auto">
                <thead>
                  <tr className="bg-gray-200 dark:bg-zinc-900 text-gray-600 dark:text-white uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">User</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-left">User Type</th>
                    <th className="py-3 px-6 text-left">Employee ID</th>
                    <th className="py-3 px-6 text-left">Designation</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-white text-sm font-light">
                  {userData.map((user:any) => (
                    <tr
                      key={user?._id}
                      className="border-b border-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-600"
                    >
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        <div className="flex items-center">
                          {user.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={user.username}
                              className="w-10 h-10 rounded-full object-cover mr-2"
                            />
                          ) : (
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-2 ${
                                colors[
                                  Math.floor(Math.random() * colors.length)
                                ]
                              }`}
                            >
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="font-semibold">{user.username}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-left">{user.email}</td>
                      <td className="py-3 px-6 text-left">{user.userType}</td>
                      <td className="py-3 px-6 text-left">{user.employeeId}</td>
                      <td className="py-3 px-6 text-left">
                        {user.desgination}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="bg-red-600 text-white font-bold py-1 px-3 rounded text-xs hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Confirmation Modal with Blur Background */}
            {showDeleteModal && userToDelete && (
              <div className="fixed inset-0 flex items-center justify-center p-4 backdrop-filter backdrop-blur-md">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full border-4 border-red-500">
                  <h3 className="text-xl font-bold text-red-600 mb-4">
                    Confirm Deletion
                  </h3>
                  <p className="mb-4 text-gray-700">
                    Are you sure you want to delete the user **
                    {userToDelete.username}**? This action cannot be undone.
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleCancelDelete}
                      className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      className="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition-colors"
                    >
                      Confirm Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsForm;
