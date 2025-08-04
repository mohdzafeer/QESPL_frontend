import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { MdDeleteOutline } from "react-icons/md";
import { getAllUsers } from "../../../utils/api";
import api from "../../../utils/api"; // Assuming your api utility is at this path

const Tasks = () => {
  const [userData, setUserData] = useState<any[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [selectedPO, setSelectedPO] = useState<any>(null);
  const [tasksByPO, setTasksByPO] = useState<any>({});

  const [isFourthComponentOpen, setIsFourthComponentOpen] = useState(false);

  // State for the "Assign New Task" form
  const [taskData, setTaskData] = useState<any>({
    title: "",
    type: "",
    assignedUsers: [{ id: uuidv4(), userId: "", employeeId: "" }],
    description: "",
  });

  // Fetch all users
  useEffect(() => {
    try {
      const allUsers = getAllUsers();
      allUsers
        .then((data: any) => {
          setUserData(data.data);
          console.log(data, "Fetched Users Data");
        })
        .catch((error: any) => {
          console.error("Error fetching users:", error);
        });
    } catch (error: any) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  // Fetch all purchase orders
  useEffect(() => {
    const fetchAllPurchaseOrders = async () => {
      try {
        const response: any = await api.get("/order/api/get-all-orders", {
          withCredentials: true,
        });
        const orders = response?.data?.data?.orders || [];
        setPurchaseOrders(orders);
        console.log("Fetched All Orders:", orders);
        // Automatically select the first PO if available (consider only pending/delayed if filtering on initial load)
        const initialFilteredOrders = orders.filter((po: any) => po.status === "pending" || po.status === "delayed");
        if (initialFilteredOrders.length > 0) {
          setSelectedPO(initialFilteredOrders[0]);
        } else if (orders.length > 0) { // Fallback to any PO if no pending/delayed found
          setSelectedPO(orders[0]);
        }
      } catch (error: any) {
        console.error("Error fetching all orders:", error);
      }
    };
    fetchAllPurchaseOrders();
  }, []);

  // Handler for general task input fields (title, type, description)
  const handleTaskInputChange = (e: any) => {
    const { id, value } = e.target;
    setTaskData((prevData: any) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handler for inputs within the assignedUsers array
  const handleAssignedUserChange = (userId: string, e: any) => {
    const { name, value } = e.target;
    setTaskData((prevData: any) => ({
      ...prevData,
      assignedUsers: prevData.assignedUsers.map((user: any) => {
        if (user.id === userId) {
          if (name === "userId") {
            const selectedUser = userData.find((u: any) => u._id === value);
            return {
              ...user,
              [name]: value,
              employeeId: selectedUser ? selectedUser.employeeId : "",
            };
          }
          return { ...user, [name]: value };
        }
        return user;
      }),
    }));
  };

  // Function to add a new user assignment block
  const addAssignedUser = () => {
    setTaskData((prevData: any) => ({
      ...prevData,
      assignedUsers: [
        ...prevData.assignedUsers,
        { id: uuidv4(), userId: "", employeeId: "" },
      ],
    }));
  };

  // Function to remove a user assignment block
  const removeAssignedUser = (idToRemove: string) => {
    setTaskData((prevData: any) => ({
      ...prevData,
      assignedUsers: prevData.assignedUsers.filter(
        (user: any) => user.id !== idToRemove
      ),
    }));
  };

  // Handler for form submission
  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!selectedPO) {
      // Removed alert here for smoother UX
      return;
    }

    const newTask = {
      id: uuidv4(),
      poId: selectedPO._id,
      title: taskData.title,
      type: taskData.type,
      assignedUsers: taskData.assignedUsers.map((user: any) => {
        const fullUser = userData.find((u: any) => u._id === user.userId);
        return {
          id: user.id,
          userId: user.userId,
          username: fullUser ? fullUser.username : "Unknown User",
          employeeId: fullUser ? fullUser.employeeId : "",
        };
      }),
      description: taskData.description,
      createdAt: new Date().toISOString(),
      status: "pending",
      completed: false,
    };

    setTasksByPO((prevTasksByPO: any) => ({
      ...prevTasksByPO,
      [selectedPO._id]: [...(prevTasksByPO[selectedPO._id] || []), newTask],
    }));

    console.log("New Task Added:", newTask);
    // Removed alert here for smoother UX

    // Reset the form fields
    setTaskData({
      title: "",
      type: "",
      assignedUsers: [{ id: uuidv4(), userId: "", employeeId: "" }],
      description: "",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500 text-white";
      case "completed":
        return "bg-green-500 text-white";
      case "delayed":
        return "bg-orange-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  // Handler to set the selected PO
  const handlePOSelect = (po: any) => {
    setSelectedPO(po);
    setIsFourthComponentOpen(false); // Hide the sidebar when a PO is selected
  };

  // Handler to mark a task as completed
  const handleMarkAsCompleted = (taskId: string) => {
    if (!selectedPO) return;

    setTasksByPO((prevTasksByPO: any) => {
      const currentTasks = prevTasksByPO[selectedPO._id] || [];
      const updatedTasks = currentTasks.map((task: any) =>
        task.id === taskId
          ? { ...task, completed: !task.completed, status: task.completed ? "pending" : "completed" }
          : task
      );
      return {
        ...prevTasksByPO,
        [selectedPO._id]: updatedTasks,
      };
    });
  };

  // Filtered POs for the sidebar (Component 4)
  const filteredPurchaseOrders = purchaseOrders.filter(
    (po: any) => po.status === "pending" || po.status === "delayed"
  );

  // Get tasks for the currently selected PO
  const currentPOTasks = selectedPO ? tasksByPO[selectedPO._id] || [] : [];

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
        <div className="w-full lg:w-1/2 h-auto border border-gray-200 dark:border-zinc-700 rounded-xl p-6 bg-white dark:bg-zinc-900 shadow-lg overflow-y-auto custom-scrollbar">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Assign New Task
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Create and assign tasks for this purchase order.
            </p>
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
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Task Type
              </label>
              <input
                list="taskTypes"
                id="type"
                name="type"
                className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-zinc-700 dark:border-zinc-600 dark:text-white dark:focus:border-blue-400"
                value={taskData.type}
                onChange={handleTaskInputChange}
                required
                placeholder="Select or type a task type"
              />
              <datalist id="taskTypes">
                <option value="Installation"></option>
                <option value="Maintenance"></option>
                <option value="Calibration"></option>
                <option value="Repair"></option>
                <option value="Inspection"></option>
              </datalist>
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

              {/* User Assignment Blocks - dynamically rendered */}
              {taskData.assignedUsers.map((user: any, index: number) => (
                <div
                  key={user.id}
                  className="mt-2 p-4 bg-gray-100 border border-gray-200 rounded-lg shadow-sm dark:bg-zinc-800 dark:border-zinc-700 relative"
                >
                  <div className="flex items-center text-gray-700 font-medium dark:text-gray-200 mb-3">
                    {/* User Icon */}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Select User Dropdown */}
                    <div>
                      <label htmlFor={`userId-${user.id}`} className="sr-only">
                        Select User
                      </label>
                      <select
                        id={`userId-${user.id}`}
                        name="userId"
                        className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:border-blue-400"
                        value={user.userId}
                        onChange={(e) => handleAssignedUserChange(user.id, e)}
                        required
                      >
                        <option value="">Select user</option>
                        {userData.map((dUser: any) => (
                          <option key={dUser._id} value={dUser._id}>
                            {dUser.username}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Employee ID (Auto-filled) */}
                    <div>
                      <label
                        htmlFor={`employeeId-${user.employeeId}`}
                        className="sr-only"
                      >
                        Employee ID
                      </label>
                      <input
                        type="text"
                        id={`employeeId-${user.employeeId}`}
                        name="employeeId"
                        disabled
                        value={user.employeeId || "Auto-filled"}
                        className="block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-sm text-gray-500 cursor-not-allowed dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-400"
                      />
                    </div>
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
              ></textarea>
            </div>

            {/* Create Task Button */}
            <div className="pt-4 w-full">
              <button
                type="submit"
                className="min-w-full flex justify-center items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-600 transition-colors duration-200"
              >
                {/* Plus Icon */}
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
              {selectedPO ? `PO #${selectedPO.orderNumber}` : "Selected PO"}
            </span>
          </h2>
          {currentPOTasks.length > 0 ? (
            <div className="space-y-4">
              {currentPOTasks.map((task: any) => (
                <div
                  key={task.id}
                  className={`bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 flex flex-col ${
                    task.completed
                      ? "opacity-70 border-green-400 dark:border-green-600"
                      : ""
                  }`}
                >
                  {/* Task Header: Title (left) & Status (right) */}
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

                  {/* Type (left) & Created Date (right) */}
                  <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 mb-3">
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-700 dark:text-gray-200 mr-1">
                        Type:
                      </span>{" "}
                      {task.type}
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-700 dark:text-gray-200 mr-1">
                        Created:
                      </span>{" "}
                      {new Date(task.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {/* Assigned To Section - Aligned Left */}
                  <div className="mb-3 text-left">
                    <span className="font-semibold text-gray-700 dark:text-gray-200 block mb-1">
                      Assigned To:
                    </span>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 ml-4">
                      {task.assignedUsers.map((user: any) => (
                        <li key={user.id}>
                          {user.username}{" "}
                          {user.employeeId && `(Emp ID: ${user.employeeId})`}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Description Section - Aligned Left */}
                  <div className="mb-4 text-left">
                    <span className="font-semibold text-gray-700 dark:text-gray-200 block mb-1">
                      Description:
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {task.description}
                    </p>
                  </div>

                  {/* Mark as Completed Checkbox */}
                  <div className="flex items-center justify-end pt-2 border-t border-gray-200 dark:border-zinc-700">
                    <input
                      id={`completed-${task.id}`}
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleMarkAsCompleted(task.id)}
                      className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400 rounded focus:ring-blue-500 dark:focus:ring-blue-400 cursor-pointer"
                    />
                    <label
                      htmlFor={`completed-${task.id}`}
                      className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      Mark as Completed
                    </label>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 py-10">
              {selectedPO
                ? "No tasks assigned to this PO yet."
                : "Select a Purchase Order to view its tasks."}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar (Component 4) */}
      <div
        className={`fixed top-48 right-0 h-9/12 w-full max-w-sm rounded-xl bg-gray-200 dark:bg-zinc-900 shadow-xl border border-gray-200 dark:border-zinc-700 z-50 transform transition-transform duration-300 ease-in-out
          ${
            isFourthComponentOpen ? "translate-x-0" : "translate-x-[calc(100%)]"
          }
          lg:max-w-md xl:max-w-lg`}
      >
        {/* Content of the Fourth Component */}
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
                  className={`flex justify-between items-center bg-gray-50 dark:bg-zinc-800 p-3 rounded-lg w-full border border-gray-200 dark:border-zinc-700 shadow-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors duration-200 ${
                    selectedPO && selectedPO._id === po._id
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