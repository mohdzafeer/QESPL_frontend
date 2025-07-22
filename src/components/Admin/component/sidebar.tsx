// import React, { useState } from "react";
// import "../../../App.css";
// import { useNavigate, useLocation } from "react-router-dom";
// import { IoGridOutline } from "react-icons/io5";
// import { FaTasks } from "react-icons/fa";
// import { VscGraphLine } from "react-icons/vsc";
// import { FaRegUser } from "react-icons/fa6";
// import { MdOutlineSettings } from "react-icons/md";
// import { MdOutlineMessage } from "react-icons/md";
// import { GoDotFill } from "react-icons/go";
// import { FaUserLarge } from "react-icons/fa6";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../store/store";
// import { selectLoggedInUser } from "../../../store/Slice/authSlice";
// type SidebarProps = {
//   isOpen: boolean;
// };

// // const { user} = useSelector((state: RootState) => state.auth);
// // const {user} = useSelector((state: RootState) => state.auth);
// // const user=useSelector(selectLoggedInUser)

// const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [counter, setCounter] = useState(7);

//   const menuItems = [
//     {
//       name: "Dashboard",
//       icon: <IoGridOutline />,
//       redirectTo: "/admin/dashboard",
//     },
//     { name: "Tasks", icon: <FaTasks />, redirectTo: "/admin/dashboard/tasks" },
//     {
//       name: "Activity",
//       icon: <VscGraphLine />,
//       redirectTo: "/admin/dashboard/activity",
//     },
//     {
//       name: "Users",
//       icon: <FaRegUser />,
//       redirectTo: "/admin/dashboard/users",
//     },
//     {
//       name: "Messages",
//       icon: <MdOutlineMessage />,
//       redirectTo: "/admin/dashboard/messages",
//     },
//     {
//       name: "Settings",
//       icon: <MdOutlineSettings />,
//       redirectTo: "/admin/dashboard/settings",
//     },
//   ];

//   return (
//     <div
//       className={`bg-[#0A2975] max-h-screen  text-white transition-all duration-300 sm:duration-300 flex flex-col justify-between ${
//         isOpen ? "lg:w-64 xl:w-64 md:w-64 w-screen p-6 " : "w-0 p-0 overflow-hidden"
//       } shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] rounded-tr-lg`}
//     >
//       <div>
//         {isOpen && (
//           <ul className="space-y-4">
//             {menuItems.map((item) => {
//               const isActive = location.pathname === item.redirectTo;

//               return (
//                 <li
//                   key={item.name}
//                   onClick={() => navigate(item.redirectTo)}
//                   className={`p-2 duration-200 rounded-lg cursor-pointer flex items-center ${
//                     isActive
//                       ? "bg-blue-900 text-yellow-300 font-semibold border-l-4 border-yellow-400 pl-2"
//                       : "hover:bg-blue-950 text-white"
//                   }`}
//                 >
//                   <span className="mr-2">{item.icon}</span>
//                   <div className="flex items-center gap-4">
//                     <span>{item.name}</span>
//                     <div className="">
//                       {item.name === "Messages" && counter > 0 ? (
//                         <span className="text-white bg-red-500 px-2.5 py-1 rounded-full text-center font-semibold text-sm">
//                           {counter}
//                         </span>
//                       ) : (
//                         ""
//                       )}
//                     </div>
//                   </div>
//                 </li>
//               );
//             })}
//           </ul>
//         )}
//       </div>
//       <div className="w-full shadow-lg rounded-xl  flex p-3 gap-2 cursor-pointer bg-amber-100 text-black duration-300">
//         <img
//           src="/images/user-pic.png"
//           alt="user"
//           className="w-[50px] rounded-full bg-white"
//         />
//         <div className="flex flex-col">
//           <span className="text-lg font-semibold text-start">
//             {useSelector(selectLoggedInUser).username}
//           </span>
//           <span className="text-sm w-fit text-start ">
//             {useSelector(selectLoggedInUser).userType.toUpperCase()}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;






import React, { useEffect, useState } from "react";
import "../../../App.css";
import { useNavigate, useLocation } from "react-router-dom";
import { IoGridOutline } from "react-icons/io5";
import { FaTasks } from "react-icons/fa";
import { VscGraphLine } from "react-icons/vsc";
import { FaRegUser } from "react-icons/fa6";
import { MdOutlineSettings } from "react-icons/md";
import { MdOutlineMessage } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import { FaUserLarge } from "react-icons/fa6";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { selectLoggedInUser } from "../../../store/Slice/authSlice";
type SidebarProps = {
  isOpen: boolean;
};

// const { user} = useSelector((state: RootState) => state.auth);
// const {user} = useSelector((state: RootState) => state.auth);
// const user=useSelector(selectLoggedInUser)

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {

  const theme = useSelector((state:any) => state.theme.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);


  const navigate = useNavigate();
  const location = useLocation();

  const [counter, setCounter] = useState(7);

  const menuItems = [
    {
      name: "Dashboard",
      id:1,
      icon: <IoGridOutline />,
      redirectTo: "/admin/dashboard",
    },
    { name: "Tasks",
      id:2, 
      icon: <FaTasks />, 
      redirectTo: "/admin/dashboard/tasks" 
    },
    {
      name: "Activity",
      id:3,
      icon: <VscGraphLine />,
      redirectTo: "/admin/dashboard/activity",
    },
    {
      name: "Users",
      id:4,
      icon: <FaRegUser />,
      redirectTo: "/admin/dashboard/users",
    },
    {
      name: "Messages",
      id:5,
      icon: <MdOutlineMessage />,
      redirectTo: "/admin/dashboard/messages",
    },
    {
      name: "Settings",
      id:6,
      icon: <MdOutlineSettings />,
      redirectTo: "/admin/dashboard/settings",
    },
    {
      name: "Recycle Bin",
      id:7,
      icon: <MdDeleteOutline />,
      redirectTo: "/admin/dashboard/recycle-bin",
    },
  ];

  return (
    <div
      className={`bg-white max-h-screen dark:bg-zinc-800 dark:text-white  text-white transition-all duration-300 sm:duration-300 flex flex-col justify-between ${
        isOpen
          ? "lg:w-64 xl:w-64 md:w-64 w-screen p-6 pr-0 "
          : "w-0 p-0 overflow-hidden"
      } `}
    >
      <div>
        {isOpen && (
          <ul className="space-y-4">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.redirectTo;

              return (
                <li
                  key={item.id}
                  onClick={() => navigate(item.redirectTo)}
                  className={`p-3 duration-200 cursor-pointer flex items-center dark:text-white ${
                    isActive
                      ? "bg-gray-100 dark:bg-zinc-700 dark:text-white text-blue-900 rounded-l-full font-semibold border-l-4 border-blue-900 dark:border-black pl-2"
                      : "hover:bg-blue-950 dark:hover:bg-black hover:text-white text-black rounded-l-full"
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  <div className="flex items-center gap-4">
                    <span>{item.name}</span>
                    <div className="">
                      {item.name === "Messages" && counter > 0 ? (
                        <span className="text-white bg-red-500 px-2.5 py-1 rounded-full text-center font-semibold text-sm">
                          {counter}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="w-11/12 shadow-lg rounded-xl  flex p-3 gap-2 cursor-pointer bg-amber-100 dark:bg-zinc-900 dark:text-zinc-300   text-black duration-300">
        <img
          src="/images/user-pic.png"
          alt="user"
          className="w-[50px] rounded-full bg-white"
        />
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-start">
            {useSelector(selectLoggedInUser).username}
          </span>
          <span className="text-sm w-fit text-start ">
            {useSelector(selectLoggedInUser).userType.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );

};

export default Sidebar;
