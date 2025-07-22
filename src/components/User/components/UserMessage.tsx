import React from "react";
import { TiArrowSortedDown } from "react-icons/ti";


const UserMessage = () => {
  return (
    <div className="w-full lg:w-2/3 xl:w-2/3 mx-auto flex flex-col gap-6">
      <h1 className="text-lg lg:text-2xl xl:text-3xl font-semibold text-start mb-5 px-3">
        Requests
      </h1>

      {/* Sending Request */}
      <div className="w-full flex flex-col items-start gap-3">
        <select className="w-full bg-gray-200 py-3 px-2 font-semibold outline-none rounded-lg">
          <option value="" selected disabled>
            Select a Request
          </option>
          <option value="read">Read</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
        </select>
        <textarea
          className="bg-gray-200 w-full px-2 py-1 rounded-lg h-40 border border-gray-300"
          placeholder="Enter your message..."
        />
        <div className="flex justify-end w-full">
          <button className="text-xl px-4 py-2 bg-[#0A2975] text-white hover:bg-blue-400 duration-300 cursor-pointer">
            Send Request
          </button>
        </div>
      </div>

      {/* Requests Status (Requests data should be maped here and return this component )*/}
      <div className="w-full">
        <div className="flex justify-between items-center bg-gray-200 py-4 px-2">
          <div className="flex gap-2 items-center">
            <img className="w-12 h-12" src="/images/user-pic.png" alt="user pic" />
            <div className="flex flex-col items-start">
              <span className="text-xs font-light">Request No : #1223</span>
              <span className="text-blue-900 text-lg font-bold">Mohd Sufiyan</span>
              <span>Message from admin</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between h-full">
            <span>12/07/2025</span>
            <span><TiArrowSortedDown/></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMessage;
