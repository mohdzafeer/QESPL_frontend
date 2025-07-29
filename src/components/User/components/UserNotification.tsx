import React from "react";

const UserNotification = () => {
  return (
    <div className="w-full">
      <h1 className="font-semibold lg:text-2xl xl:text-2xl text-lg mb-2">Notifications</h1>
      <div>
        <table className="w-full">
          <thead className="bg-gray-500 dark:bg-zinc-950 text-white lg:text-xl xl:text-lg text-sm">
            <tr className="h-10">
              <td className="font-semibold text-start lg:pl-5 xl:pl-5 pl-1">User</td>
              <td className="font-semibold text-start lg:pl-5 xl:pl-5 pl-1">Activity</td>
              <td className="font-semibold text-end lg:pr-5 xl:pr-5 pr-1">Time</td>
            </tr>
          </thead>
          <tbody className="w-full">
            <tr className=" w-full border-b">
              <td className="flex lg:pl-5 xl:pl-5 pl-1 gap-2 my-2">
                  <img src="/images/user-pic.png" className="lg:w-14 lg:h-14 xl:w-14 xl:h-14 h-8 w-8 lg:inline-block xl:inline-block hidden"/>
                  <div className="flex flex-col">
                    <span className="text-start lg:text-lg xl:text-lg font-semibold text-xs">Username</span>
                    <span className="text-start  lg:text-sm xl:text-sm text-xs">Employee ID</span>
                  </div>
              </td>
              <td className="text-start font-semibold text-xs">
                #43/QESPL/JUL/25 deleted
              </td>
              <td className="text-end lg:pr-5 xl:pr-5 pr-1 lg:text-lg xl:text-lg text-xs">
                9:00 AM
              </td>
            </tr>
            <tr className=" w-full border-b">
              <td className="flex lg:pl-5 xl:pl-5 pl-1 gap-2 my-2">
                  <img src="/images/user-pic.png" className="lg:w-14 lg:h-14 xl:w-14 xl:h-14 h-8 w-8 lg:inline-block xl:inline-block hidden"/>
                  <div className="flex flex-col">
                    <span className="text-start lg:text-lg xl:text-lg font-semibold text-xs">Username</span>
                    <span className="text-start  lg:text-sm xl:text-sm text-xs">Employee ID</span>
                  </div>
              </td>
              <td className="text-start font-semibold text-xs">
                #43/QESPL/JUL/25 deleted
              </td>
              <td className="text-end lg:pr-5 xl:pr-5 pr-1 lg:text-lg xl:text-lg text-xs">
                9:00 AM
              </td>
            </tr>
            <tr className=" w-full border-b">
              <td className="flex lg:pl-5 xl:pl-5 pl-1 gap-2 my-2">
                  <img src="/images/user-pic.png" className="lg:w-14 lg:h-14 xl:w-14 xl:h-14 h-8 w-8 lg:inline-block xl:inline-block hidden"/>
                  <div className="flex flex-col">
                    <span className="text-start lg:text-lg xl:text-lg font-semibold text-xs">Username</span>
                    <span className="text-start  lg:text-sm xl:text-sm text-xs">Employee ID</span>
                  </div>
              </td>
              <td className="text-start font-semibold text-xs">
                #43/QESPL/JUL/25 deleted
              </td>
              <td className="text-end lg:pr-5 xl:pr-5 pr-1 lg:text-lg xl:text-lg text-xs">
                9:00 AM
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserNotification;
