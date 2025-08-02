import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { MdDeleteOutline } from 'react-icons/md';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'; // Import arrow icons

// Dummy user data for the "Assign To" dropdown
const dummyUsers = [
  { id: 'emp001', name: 'Alice Smith' },
  { id: 'emp002', name: 'Bob Johnson' },
  { id: 'emp003', name: 'Charlie Brown' },
  { id: 'emp004', name: 'Diana Prince' },
  { id: 'emp005', name: 'Clark Kent' },
];

const dummyPOs = [
  { orderNumber: 'PO-001', status: 'pending' },
  { orderNumber: 'PO-002', status: 'delayed' },
  { orderNumber: 'PO-003', status: 'completed' },
  { orderNumber: 'PO-004', status: 'pending' },
  { orderNumber: 'PO-005', status: 'rejected' },
];

const Tasks = () => {
  const [isFourthComponentOpen, setIsFourthComponentOpen] = useState(false); // State for the new fourth component (sidebar)

  // State for the "Assign New Task" form
  const [taskData, setTaskData] = useState({
    title: '',
    type: '',
    assignedUsers: [{ id: uuidv4(), userId: '', employeeId: '' }], // Initial user block
    description: '',
  });

  // Handler for general task input fields (title, type, description)
  const handleTaskInputChange = (e) => {
    const { id, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [id]: value, // Directly use id as the key
    }));
  };

  // Handler for inputs within the assignedUsers array
  const handleAssignedUserChange = (userId, e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      assignedUsers: prevData.assignedUsers.map((user) => {
        if (user.id === userId) {
          // If the 'userId' (select) changes, also update the employeeId
          if (name === 'userId') {
            const selectedUser = dummyUsers.find(u => u.id === value);
            return {
              ...user,
              [name]: value,
              employeeId: selectedUser ? selectedUser.id : '' // Auto-fill employee ID
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
    setTaskData((prevData) => ({
      ...prevData,
      assignedUsers: [...prevData.assignedUsers, { id: uuidv4(), userId: '', employeeId: '' }],
    }));
  };

  // Function to remove a user assignment block
  const removeAssignedUser = (idToRemove) => {
    setTaskData((prevData) => ({
      ...prevData,
      assignedUsers: prevData.assignedUsers.filter((user) => user.id !== idToRemove),
    }));
  };

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Task Data Submitted:', taskData);
    // In a real application, you would send this data to your backend
    alert('Task data logged to console! (This is a placeholder alert)');
  };

  const getStatusColor = (status:any) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'completed':
        return 'bg-green-500 text-white';
      case 'delayed':
        return 'bg-orange-500 text-white';
      case 'rejected':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col gap-6 h-screen p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-950 dark:to-zinc-850 relative overflow-hidden">
      {/* PO Summary Card (Component 1) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-md">
        <div className="flex flex-col items-start gap-1">
          <span className="font-bold text-xl text-gray-800 dark:text-white">PO #1234</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">12 Aug 2025</span>
        </div>
        <span className="uppercase font-semibold bg-yellow-500 text-white px-3 py-1 rounded-full text-xs mt-3 md:mt-0 shadow-sm">
          Pending
        </span>
      </div>

      {/* Main Content Area: Assign Task Form (Component 2) + Fixed Task List Placeholder (Component 3) */}
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
              <select
                id="type"
                className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-zinc-700 dark:border-zinc-600 dark:text-white dark:focus:border-blue-400"
                value={taskData.type}
                onChange={handleTaskInputChange}
                required
              >
                <option value="">Select task type</option>
                <option value="Installation">Installation</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Calibration">Calibration</option>
                <option value="Repair">Repair</option>
                <option value="Inspection">Inspection</option>
              </select>
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
              {taskData.assignedUsers.map((user, index) => (
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
                    {taskData.assignedUsers.length > 1 && ( // Only show remove if more than one user
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
                        className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-850 dark:border-zinc-600 dark:text-white dark:focus:border-blue-400"
                        value={user.userId}
                        onChange={(e) => handleAssignedUserChange(user.id, e)}
                        required
                      >
                        <option value="">Select user</option>
                        {dummyUsers.map((dUser) => (
                          <option key={dUser.id} value={dUser.id}>
                            {dUser.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Employee ID (Auto-filled) */}
                    <div>
                      <label htmlFor={`employeeId-${user.id}`} className="sr-only">
                        Employee ID
                      </label>
                      <input
                        type="text"
                        id={`employeeId-${user.id}`}
                        name="employeeId"
                        disabled
                        value={user.employeeId || 'Auto-filled'}
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

        {/* Fixed Task List Placeholder (Component 3) */}
        <div className="w-full lg:w-1/2 h-auto border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900 shadow-lg p-6 flex items-center justify-center text-gray-500 dark:text-gray-400 text-lg">
          {/* This area will eventually display a list of tasks */}
          Task List will go here (Component 3)
        </div>
      </div>

      {/* --- */}

      

      <div
        className={`fixed top-5 right-0 h-[calc(100%-2.5rem)] w-full max-w-sm rounded-xl bg-white dark:bg-zinc-900 shadow-xl border border-gray-200 dark:border-zinc-700 z-50 transform transition-transform duration-300 ease-in-out
          ${isFourthComponentOpen ? 'translate-x-0' : 'translate-x-[calc(100%-4rem)]'}
          lg:max-w-md xl:max-w-lg`} 
      >
        {/* Toggle Button for the Fourth Component */}
        <button
          onClick={() => setIsFourthComponentOpen(!isFourthComponentOpen)}
          className="absolute -left-12 top-0 mt-4 p-3 rounded-l-lg shadow-lg z-50 transform -translate-y-1/2
                     bg-white text-gray-600 dark:bg-zinc-900 dark:text-gray-300
                     hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200 border border-r-0 border-gray-200 dark:border-zinc-700"
          aria-label={isFourthComponentOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isFourthComponentOpen ? <IoIosArrowForward className="h-6 w-6" /> : <IoIosArrowBack className="h-6 w-6" />}
        </button>

        {/* Content of the Fourth Component */}
        <div className="h-full p-6 flex flex-col"> {/* Removed bg-gray-100 here to match parent bg */}
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Purchase Orders
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            These are POs of your department
          </p>
          <div className="flex-grow flex flex-col gap-3 overflow-y-auto custom-scrollbar">
            {dummyPOs.length > 0 ? (
              dummyPOs.map((po) => (
                <div key={po.orderNumber} className="flex justify-between items-center bg-gray-50 dark:bg-zinc-800 p-3 rounded-lg w-full border border-gray-200 dark:border-zinc-700 shadow-sm">
                  <span className="font-semibold text-gray-800 dark:text-gray-100">{po.orderNumber}</span>
                  <span className={`px-2 py-1 rounded-full text-xs uppercase font-medium ${getStatusColor(po.status)}`}>
                    {po.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                You do not have any POs assigned to you.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;