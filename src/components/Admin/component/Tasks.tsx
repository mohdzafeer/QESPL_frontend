import { useState } from "react";

const Tasks = () => {

  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="flex items-start gap-6 h-full ">
      <div className="w-1/2 h-full border-2 rounded-xl p-5">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Assign New Task
          </h1>
          <p className="mt-1 text-gray-500">
            Create and assign tasks for this purchase order
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6 w-full">
          {/* Task Title */}
          <div>
            <label
              htmlFor="task-title"
              className="block text-sm font-medium text-gray-700"
            >
              Task Title
            </label>
            <input
              type="text"
              id="task-title"
              className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter task title..."
            />
          </div>

          {/* Task Type */}
          <div>
            <label
              htmlFor="task-type"
              className="block text-sm font-medium text-gray-700"
            >
              Task Type
            </label>
            <select
              id="task-type"
              className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option>Select task type</option>
              {/* Add more options here */}
            </select>
          </div>

          {/* Assign To Section */}
          <div>
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                Assign To
              </label>
              <button
                type="button"
                className="text-sm font-medium text-blue-500 hover:text-blue-600"
              >
                + Add User
              </button>
            </div>

            {/* User Assignment Block */}
            <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-md shadow-sm">
              <div className="flex items-center text-gray-700 font-medium">
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
                <span>User 1</span>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Select User Dropdown */}
                <div>
                  <label htmlFor="select-user" className="sr-only">
                    Select User
                  </label>
                  <select
                    id="select-user"
                    className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option>Select user</option>
                    {/* Add more options here */}
                  </select>
                </div>

                {/* Employee ID (Auto-filled) */}
                <div>
                  <label htmlFor="employee-id" className="sr-only">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    id="employee-id"
                    disabled
                    value="Auto-filled"
                    className="block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-sm text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter task description..."
            ></textarea>
          </div>

          {/* Create Task Button */}
          <div className="pt-4 w-full">
            <button
              type="submit"
              className="min-w-full flex justify-center items-center px-4 py-3 bg-gray-900 text-white font-medium rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
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
      <div className="w-1/2 h-full border-2 rounded-xl"></div>
      
    </div>
    
  );
};

export default Tasks;
