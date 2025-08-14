/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../../store/store";
import {
  taskCreate,
  resetask,
  updateTaskStatus,
  selectTasks,
  fetchTaskByTaskId,
} from "../../../store/Slice/taskSlice";
import { fetchOrdersAsync } from "../../../store/Slice/orderSlice";
import { getAllUsers } from "../../../utils/api";
import { type TaskCratePayload } from "../../../utils/api";
import { toast } from "react-toastify";

const Tasks = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((state: RootState) =>
    selectTasks(state)
  );
  const [userData, setUserData] = useState<any[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [selectedPO, setSelectedPO] = useState<any>(null);
  const [isFourthComponentOpen, setIsFourthComponentOpen] = useState(false);
  const [currentPage] = useState(1);
  const USERS_PER_PAGE = 10;
  const [taskData, setTaskData] = useState({
    title: "",
    taskType: "",
    taskDeadline: "",
    description: "",
    assignedUsers: [{ id: Date.now().toString(), primaryUserId: "", secondaryUserId: "", username: "", employeeId: "" }],
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers()
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  // Fetch all purchase orders
  useEffect(() => {
    dispatch(fetchOrdersAsync({ page: currentPage, limit: USERS_PER_PAGE }));
  }, [dispatch, currentPage]);

  // Set purchase orders from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dispatch(fetchOrdersAsync({ page: currentPage, limit: USERS_PER_PAGE })).unwrap();
        const { orders } = result
        setPurchaseOrders(orders);
        const pendingOrDelayedPO = orders.find(
          (po: any) => po.status === 'pending' || po.status === 'delayed'
        );
        setSelectedPO(pendingOrDelayedPO || orders[0] || null); // Select first pending/delayed, or first order, or null
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setPurchaseOrders([]);
        setSelectedPO(null);
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    if (!selectedPO) return
    if (selectedPO) {
      dispatch(fetchTaskByTaskId(selectedPO._id));
    }
  }, [dispatch, selectedPO]);

  // Handle error notifications
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetask());
    }
  }, [error, dispatch]);

  // Handler for general task input fields
  const handleTaskInputChange = (e: any) => {
    const { id, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };


  const handleAssignedUserChange = (id: string, field: string, e: any) => {
    const { value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      assignedUsers: prevData.assignedUsers.map((user) => {
        if (user.id === id) {
          const selectedUser = userData.find((dUser) => dUser._id === value);
          if (field === "primaryUserId") {
            return {
              ...user,
              primaryUserId: value,
              secondaryUserId: value, // Auto-fill secondaryUserId
              username: selectedUser ? selectedUser.username : "",
              employeeId: selectedUser ? selectedUser.employeeId : "",
            };
          } else if (field === "secondaryUserId") {
            return {
              ...user,
              primaryUserId: value, // Auto-fill primaryUserId
              secondaryUserId: value,
              username: selectedUser ? selectedUser.username : "",
              employeeId: selectedUser ? selectedUser.employeeId : "",
            };
          }
        }
        return user;
      }),
    }));
  };

  // Add a new user assignment block
  const addAssignedUser = () => {
    setTaskData((prevData) => ({
      ...prevData,
      assignedUsers: [
        ...prevData.assignedUsers,
        {
          id: Date.now().toString(),
          primaryUserId: "",
          secondaryUserId: "",
          username: "",
          employeeId: ""
        }
      ],
    }));
  };

  // Remove a user assignment block
  const removeAssignedUser = (idToRemove: string) => {
    setTaskData((prevData) => ({
      ...prevData,
      assignedUsers: prevData.assignedUsers.filter(
        (user) => user.id !== idToRemove
      ),
    }));
  };

  // Handler for form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!selectedPO) {
      setFormError("Please select a purchase order");
      return;
    }

    const payload: TaskCratePayload = {
      poId: selectedPO?._id || "",
      title: taskData.title,
      description: taskData.description,
      taskType: taskData.taskType,
      taskDeadline: taskData.taskDeadline || undefined,
      assignedUsers: taskData.assignedUsers
        .map((user) => {
          const selectedUser = userData.find((dUser) => dUser._id === user.primaryUserId);
          return selectedUser
            ? { _id: selectedUser._id, username: selectedUser.username, }
            : null;
        })
        .filter((userObj) => userObj !== null) as { _id: string; username: string; email: string }[]
    };

    try {
      await dispatch(taskCreate(payload)).unwrap();
      toast.success("Task created successfully");
      setTaskData({
        title: "",
        taskType: "",
        taskDeadline: "",
        description: "",
        assignedUsers: [{ id: Date.now().toString(), primaryUserId: "", secondaryUserId: "", username: "", employeeId: "" }],
      });
      setFormError(null);
      if (selectedPO) {
        console.log(selectedPO, "check user po Ids...")
        dispatch(fetchTaskByTaskId(selectedPO._id)); // Refresh the task list after creation
      }
    } catch (error) {
      setFormError("Failed to create task");
    }
  };
  // Handler to mark a task as completed
  const handleMarkAsCompleted = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus !== "completed"; // true if marking as completed, false otherwise
    try {
      await dispatch(updateTaskStatus({ taskId, status: newStatus })).unwrap();
      toast.success("Task status updated");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to update task status");
    }
  };

  // Get status color
  const getStatusColor = (status: string | undefined) => {
    const effectiveStatus = status || "pending";
    switch (effectiveStatus) {
      case "pending":
        return "bg-yellow-500 text-white";
      case "completed":
        return "bg-green-500 text-white";
      case "canceled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  // Handler to set the selected PO
  const handlePOSelect = (po: any) => {
    setSelectedPO(po);
    setIsFourthComponentOpen(false);
  };

  // Filtered POs for the sidebar
  const filteredPurchaseOrders = purchaseOrders.filter(
    (po: any) => po.status === "pending" || po.status === "delayed"
  );

  return (
    <div className="flex flex-col gap-6 min-h-screen p-4 md:p-8 relative overflow-hidden">
      {/* PO Summary Card (Component 1) */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsFourthComponentOpen(!isFourthComponentOpen)}
          className="bg-black text-white px-2 py-1 rounded-lg text-lg font-semibold hover:bg-gray-800 duration-300 cursor-pointer"
        >
          {isFourthComponentOpen ? <span>Close POs</span> : <span>View POs</span>}
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-md">
        <div className="flex flex-col items-start gap-1">
          <span className="font-bold text-xl text-gray-800 dark:text-white">
            {selectedPO ? `PO #${selectedPO.orderNumber}` : "Select a PO"}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {selectedPO
              ? new Date(selectedPO.createdAt.split('T')[0]).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
              : "No PO selected"}
          </span>
        </div>
        {selectedPO && (
          <span
            className={`uppercase font-semibold px-3 py-1 rounded-full text-xs mt-3 md:mt-0 shadow-sm ${getStatusColor(
              selectedPO.status
            )}`}
          >
            {selectedPO.status}
          </span>
        )}
      </div>

      {/* Main Content Area: Assign Task Form (Component 2) + Task List (Component 3) */}
      <div className="flex flex-col xl:flex-row lg:flex-row gap-6 h-full relative z-10">
        {/* Assign New Task Form (Component 2) */}
        <div className="w-full lg:w-1/2 h-auto border border-gray-200 dark:border-zinc-700 rounded-xl p-6 bg-white max-h-fit dark:bg-zinc-900 shadow-lg overflow-y-auto custom-scrollbar">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Assign New Task
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Create and assign tasks for this purchase order.
            </p>
            {formError && (
              <p className="text-red-500 text-sm mt-2">{formError}</p>
            )}
          </div>

          {/* Form */}
          <form className="space-y-6 w-full" onSubmit={handleSubmit}>
            {/* Task Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Task Title
              </label>
              <input
                type="text"
                id="title"
                className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-zinc-700 dark:border-zinc-600 dark:text-white dark:focus:border-blue-400"
                placeholder="Enter task title..."
                value={taskData.title}
                onChange={handleTaskInputChange}
                required
              />
            </div>

            {/* Task Type */}
            <div>
              <label
                htmlFor="taskType"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Task Type
              </label>
              <select
                id="taskType"
                name="taskType"
                className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-zinc-700 dark:border-zinc-600 dark:text-white dark:focus:border-blue-400"
                value={taskData.taskType}
                onChange={handleTaskInputChange}
                required
              >
                <option value="">Select task type</option>
                <option value="installation">Installation</option>
                <option value="maintenance">Maintenance</option>
                <option value="calibration">Calibration</option>
                <option value="repair">Repair</option>
                <option value="inspection">Inspection</option>
              </select>
            </div>

            {/* Task Deadline */}
            <div>
              <label
                htmlFor="taskDeadline"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Task Deadline (Optional)
              </label>
              <input
                type="date"
                id="taskDeadline"
                className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-zinc-700 dark:border-zinc-600 dark:text-white dark:focus:border-blue-400"
                value={taskData.taskDeadline}
                onChange={handleTaskInputChange}
              />
            </div>

            {/* Assign To Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Assign To
                </label>
                <button
                  type="button"
                  onClick={addAssignedUser}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  + Add User
                </button>
              </div>

              {taskData.assignedUsers.map((user: any, index: number) => (
                <div
                  key={user.id}
                  className="mt-2 p-4 bg-gray-100 border border-gray-200 rounded-lg shadow-sm dark:bg-zinc-800 dark:border-zinc-700 relative"
                >
                  <div className="flex items-center text-gray-700 font-medium dark:text-gray-200 mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>Assigned User {index + 1}</span>
                    {taskData.assignedUsers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAssignedUser(user.id)}
                        className="ml-auto text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Remove user"
                      >
                        <MdDeleteOutline className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <div className="flex gap-5">
                    <select
                      id={`primaryUserId-${user.id}`}
                      name="username"
                      className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:border-blue-400"
                      value={user.primaryUserId || ""}
                      onChange={(e) => handleAssignedUserChange(user.id, "primaryUserId", e)}
                    >
                      <option value="">Select user (by username)</option>
                      {userData.map((dUser: any) => (
                        <option key={dUser._id} value={dUser._id}>
                          {dUser.username}
                        </option>
                      ))}
                    </select>

                    <select
                      id={`secondaryUserId-${user.id}`}
                      name="secondaryUserId"
                      className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:border-blue-400"
                      value={user.secondaryUserId || ""}
                      onChange={(e) => handleAssignedUserChange(user.id, "secondaryUserId", e)}
                    >
                      <option value="">Select user (by employee ID)</option>
                      {userData.map((dUser: any) => (
                        <option key={dUser._id} value={dUser._id}>
                          {dUser.employeeId}
                        </option>
                      ))}
                    </select>

                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-zinc-700 dark:border-zinc-600 dark:text-white dark:focus:border-blue-400"
                placeholder="Enter task description..."
                value={taskData.description}
                onChange={handleTaskInputChange}
                required
              ></textarea>
            </div>

            {/* Create Task Button */}
            <div className="pt-4 w-full">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center px-6 py-3 font-semibold rounded-md shadow-md transition-colors duration-200 ${loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                  }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Task
              </button>
            </div>
          </form>
        </div>

        {/* Task List (Component 3) */}

        <div className="w-full lg:w-1/2 h-auto border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900 shadow-lg p-6 overflow-y-auto no-scrollbar">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">

            Tasks for{" "}
            <span className="text-blue-600 dark:text-blue-400">
              {selectedPO ? (selectedPO._id === 'all' ? 'All Purchase Orders' : `PO #${selectedPO.orderNumber}`) : "Selected PO"}
            </span>
            {/* <span className="text-blue-600 dark:text-blue-400">
              {selectedPO ? `PO #${selectedPO.orderNumber}` : "Selected PO"}
            </span> */}
          </h2>
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 py-10">
              Loading tasks...
            </div>
          ) : tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map((task: any) => (
                <div
                  key={task._id}
                  className={`bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 flex flex-col ${task.status === "completed"
                      ? "opacity-70 border-green-400 dark:border-green-600"
                      : ""
                    }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mr-4">
                      {task.title}
                    </h3>
                    <span
                      className={`font-semibold capitalize px-2 py-0.5 rounded-full text-xs flex-shrink-0 ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 mb-3">
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-700 dark:text-gray-200 mr-1">
                        Type:
                      </span>{" "}
                      {task.taskType}
                    </div>
                    {selectedPO?._id === 'all' && task.poId?.orderNumber && (
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-700 dark:text-gray-200 mr-1">
                          PO #:
                        </span>{" "}
                        {task.poId.orderNumber}
                      </div>
                    )}
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-700 dark:text-gray-200 mr-1">
                        Created:
                      </span>{" "}
                      {task.createdAt
                        ? new Date(task.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        : "N/A"}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 mb-3">
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-700 dark:text-gray-200 mr-1">
                        Deadline:
                      </span>{" "}
                      {task.taskDeadline
                        ? new Date(task.taskDeadline).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        : "No deadline"}
                    </div>
                  </div>

                  <div className="mb-3 text-left">
                    <span className="font-semibold text-gray-700 dark:text-gray-200 block mb-1">
                      Assigned To:
                    </span>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 ml-4">
                      {task.assignedUsers?.length > 0 ? (
                        task.assignedUsers.map((user: any) => (
                          <li key={user._id}>
                            {user.username}
                          </li>
                        ))
                      ) : (
                        <li>No users assigned</li>
                      )}
                    </ul>
                  </div>

                  <div className="mb-4 text-left">
                    <span className="font-semibold text-gray-700 dark:text-gray-200 block mb-1">
                      Description:
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {task.description || "No description provided"}
                    </p>
                  </div>

                  <div className="flex items-center justify-end pt-2 border-t border-gray-200 dark:border-zinc-700">
                    <input
                      id={`completed-${task._id}`}
                      type="checkbox"
                      checked={task.status === "completed"}
                      onChange={() => handleMarkAsCompleted(task._id, task.status)}
                      className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400 rounded focus:ring-blue-500 dark:focus:ring-blue-400 cursor-pointer"
                      disabled={loading}
                    />
                    <label
                      htmlFor={`completed-${task._id}`}
                      className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      Mark as {task.status === "completed" ? "Pending" : "Completed"}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 py-10">
              {selectedPO
                ? selectedPO._id === "all"
                  ? "No tasks assigned yet."
                  : "No tasks assigned to this PO yet."
                : "Select a Purchase Order to view its tasks."}
            </div>
          )}

        </div>
      </div>

      {/* Sidebar (Component 4) */}
      <div
        className={`fixed top-48 right-0 h-9/12 w-full max-w-sm rounded-xl bg-gray-200 dark:bg-zinc-900 shadow-xl border border-gray-200 dark:border-zinc-700 z-50 transform transition-transform duration-300 ease-in-out
          ${isFourthComponentOpen ? "translate-x-0" : "translate-x-[calc(100%)]"} lg:max-w-md xl:max-w-lg`}
      >
        <div className="h-full p-6 flex flex-col">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Purchase Orders
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            These are POs of your department
          </p>
          <div className="flex-grow flex flex-col gap-3 overflow-y-auto no-scrollbar">
            {filteredPurchaseOrders.length > 0 ? (
              filteredPurchaseOrders.map((po: any) => (
                <div
                  key={po._id}
                  className={`flex justify-between items-center bg-gray-50 dark:bg-zinc-800 p-3 rounded-lg w-full border border-gray-200 dark:border-zinc-700 shadow-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors duration-200 ${selectedPO && selectedPO._id === po._id
                      ? "ring-2 ring-blue-500 dark:ring-blue-400"
                      : ""
                    }`}
                  onClick={() => handlePOSelect(po)}
                >
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    {po.orderNumber}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs uppercase font-medium ${getStatusColor(
                      po.status
                    )}`}
                  >
                    {po.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                You do not have any pending or delayed POs.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;