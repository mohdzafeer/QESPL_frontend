import React, { useState } from "react";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti"; // Import TiArrowSortedUp

const UserMessage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="w-full lg:w-2/3 xl:w-2/3 mx-auto flex flex-col gap-6">
      <h1 className="text-lg lg:text-2xl xl:w-3xl font-semibold text-start mb-5 px-3">
        Requests
      </h1>

      {/* Sending Request */}
      <div className="w-full flex flex-col items-start gap-3">
        <select className="w-full bg-gray-200 dark:bg-zinc-900 py-3 px-2 font-semibold outline-none rounded-lg">
          <option value="" selected disabled>
            Select a Request
          </option>
          <option value="read">Read</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
        </select>
        <textarea
          className="bg-gray-200 dark:bg-zinc-800 w-full px-2 py-1 rounded-lg h-40 border border-gray-300"
          placeholder="Enter your message..."
        />
        <div className="flex justify-end w-full">
          <button className="text-xl px-4 py-2 bg-[var(--theme-color)] text-white hover:bg-blue-900 duration-300 cursor-pointer rounded-md">
            Send Request
          </button>
        </div>
      </div>
    <h2 className="text-start font-bold">Messages From Admin</h2>
      {/* Requests Status (Requests data should be mapped here and return this component )*/}
      <div className="w-full">
        <div className="flex justify-between items-center bg-gray-200 dark:bg-zinc-800 py-4 px-2 cursor-pointer" onClick={toggleDrawer}>
          <div className="flex gap-2 items-center">
            <img className="w-12 h-12" src="/images/user-pic.png" alt="user pic" />
            <div className="flex flex-col items-start">
              <span className="text-xs font-light">Request No : #1223</span>
              <span className="text-blue-900 dark:text-blue-500 text-lg font-bold">Mohd Sufiyan</span>
              <span>Message from admin</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between h-full">
            <span>12/07/2025</span>
            <span className="text-2xl">
              {isDrawerOpen ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
            </span>
          </div>
        </div>

        {/* Message Drawer */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isDrawerOpen ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white dark:bg-zinc-800 p-4 border-t border-gray-300 text-start mb-10">
            This is the message content from the admin. It will appear when the drawer is open.
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMessage;