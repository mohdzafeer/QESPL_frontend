import { motion } from "motion/react";
import React, { useEffect, useMemo, useState } from "react";
import { CgSandClock } from "react-icons/cg";
import { IoMdTime } from "react-icons/io";
import { IoDocumentTextOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { SiTicktick } from "react-icons/si";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import type { RootState } from "../../../../store/store"; // adjust the import path as needed
import { setStatusFilter } from "../../../../store/Slice/filterSlice"; // adjust the import path as needed
 // adjust the import path as needed

const DashboardCards = () => {

// const [statusFilter, setStatusFilter] = useState<
//     "all" | "pending" | "completed" | "delayed" | "rejected"
//   >("all");

const dispatch=useDispatch()
const { orders } = useSelector((state: RootState) => state.orders);
const counts = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter(
        (order) => order.status === "pending" && !order.isdeleted
      ).length,
      completed: orders.filter(
        (order) => order.status === "completed" && !order.isdeleted
      ).length,
      delayed: orders.filter(
        (order) => order.status === "delayed" && !order.isdeleted
      ).length,
      rejected: orders.filter(
        (order) => order.status === "rejected" && !order.isdeleted
      ).length,
      deleted: orders.filter((order) => order.isdeleted).length,
    }),
    [orders]
  );


const statusFilter = useSelector(
    (state: RootState) => state.filter.statusFilter
  );

  const handleClick = (status:String) => {
    dispatch(setStatusFilter(status));
  };

    useEffect(()=>{
     console.log(statusFilter)   
    },[statusFilter])

  return (
    <div>
      {/* PO Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 mb-6 text-sm">
        <motion.div
          initial={{
            y: 0,
          }}
          whileHover={{
            y: -5,
            transition: { duration: 0.3 },
          }}
          className={`${
            statusFilter == "all" ? "bg-[#0A2975]" : "bg-white"
          } p-4 rounded-lg shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] flex justify-between cursor-pointer font-semibold`}
          onClick={() => handleClick("all")}
        >
          <div className="flex flex-col text-white items-start gap-3">
            <p
              className={`${
                statusFilter == "all" ? "text-white" : "text-[#0A2975]"
              }`}
            >
              Total POs
            </p>
            <p
              className={`${
                statusFilter == "all" ? "text-white" : "text-[#0A2975]"
              } text-3xl font-bold`}
            >
              {/* {counts.total} */}
              N/A
              
            </p>
            {/* <p
                      className={`${
                        statusFilter == "all" ? "text-white" : "text-[#0A2975]"
                      } text-sm`}
                    >
                      <span className="font-bold ">+12.5%</span> from last month
                    </p> */}
          </div>
          <div className="w-16 flex justify-center ">
            <IoDocumentTextOutline className="text-white text-5xl w-fit bg-blue-900 rounded-lg p-2" />
          </div>
        </motion.div>
        <motion.div
          initial={{
            y: 0,
          }}
          whileHover={{
            y: -5,
            transition: { duration: 0.3 },
          }}
          className={`${
            statusFilter == "completed" ? "bg-[#0A2975]" : "bg-white"
          } p-4 rounded-lg shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] flex justify-between cursor-pointer font-semibold`}
          onClick={() => handleClick("completed")}
        >
          <div className="flex flex-col text-black items-start gap-3">
            <p
              className={`${
                statusFilter == "completed" ? "text-white" : "text-[#0A2975]"
              }`}
            >
              Completed POs
            </p>
            <p
              className={`text-green-500 ${
                statusFilter == "completed" ? "" : "text-[#0A2975]"
              } text-3xl font-bold`}
            >
              {/* {counts.completed} */}
              N/A
              
            </p>
            {/* <p className="text-green-500 text-sm">
                      <span className="font-bold  ">+3%</span> from last month
                    </p> */}
          </div>
          <div className="w-16 flex justify-center ">
            <SiTicktick className="text-black text-5xl w-fit bg-gray-200 rounded-lg p-2" />
          </div>
        </motion.div>
        <motion.div
          initial={{
            y: 0,
          }}
          whileHover={{
            y: -5,
            transition: { duration: 0.3 },
          }}
          className={`${
            statusFilter == "pending" ? "bg-[#0A2975]" : "bg-white"
          } p-4 rounded-lg shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] flex justify-between cursor-pointer font-semibold`}
          onClick={() => {
            handleClick("pending");
          }}
        >
          <div className="flex flex-col text-black items-start gap-3">
            <p
              className={`${
                statusFilter == "pending" ? "text-white" : "text-[#0A2975]"
              }`}
            >
              Pending POs
            </p>
            <p
              className={`text-yellow-400 ${
                statusFilter == "pending" ? "" : "text-[#0A2975]"
              } text-3xl font-bold`}
            >
              {/* {counts.pending} */}
              N/A
              
            </p>
            {/* <p className="text-yellow-400 text-sm">
                      <span className="font-bold  ">+2%</span> from last month
                    </p> */}
          </div>
          <div className="w-16 flex justify-center ">
            <IoMdTime className="text-black text-5xl w-fit bg-gray-200 rounded-lg p-2" />
          </div>
        </motion.div>
        <motion.div
          initial={{
            y: 0,
          }}
          whileHover={{
            y: -5,
            transition: { duration: 0.3 },
          }}
          className={`${
            statusFilter == "delayed" ? "bg-[#0A2975] " : "bg-white"
          } p-4 rounded-lg shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] flex justify-between cursor-pointer font-semibold`}
          onClick={() => handleClick("delayed")}
        >
          <div className="flex flex-col text-black items-start gap-3">
            <p
              className={`${
                statusFilter == "delayed" ? "text-white" : "text-[#0A2975]"
              }`}
            >
              Delayed POs
            </p>
            <p
              className={`text-orange-500 ${
                statusFilter == "delayed" ? "" : "text-[#0A2975]"
              } text-3xl font-bold`}
            >
              {/* {counts.delayed} */}
              N/A
              
            </p>
            {/* <p className="font-bold text-2xl">20</p> */}
            {/* <p className="text-orange-400 text-sm">
                      <span className="font-bold  ">+2%</span> from last month
                    </p> */}
          </div>
          <div className="w-16 flex justify-center ">
            <CgSandClock className="text-black text-5xl w-fit bg-gray-200 rounded-lg p-2" />
          </div>
        </motion.div>
        <motion.div
          initial={{
            y: 0,
          }}
          whileHover={{
            y: -5,
            transition: { duration: 0.3 },
          }}
          className={`${
            statusFilter == "rejected" ? "bg-[#0A2975] " : "bg-white"
          } p-4 rounded-lg shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] flex justify-between cursor-pointer font-semibold`}
          onClick={() => handleClick("rejected")}
        >
          <div className="flex flex-col text-black items-start gap-3">
            <p
              className={` ${
                statusFilter == "rejected" ? "text-white" : "text-[#0A2975]"
              }`}
            >
              Rejected POs
            </p>
            <p
              className={`text-red-500 ${
                statusFilter == "rejected" ? "" : "text-[#0A2975]"
              } text-3xl font-bold`}
            >
              {/* {counts.rejected} */}
              N/A
              
            </p>
            {/* <p className="font-bold text-2xl">20</p> */}
            {/* <p className="text-red-600 text-sm">
                      <span className="font-bold  ">+2%</span> from last month
                    </p> */}
          </div>
          <div className="w-16 flex justify-center ">
            <RxCross2 className="text-black text-5xl w-fit bg-gray-200 rounded-lg p-2" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardCards;
