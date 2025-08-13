import { motion } from "motion/react";
import React, { useEffect, useMemo, useState } from "react";
import { CgSandClock } from "react-icons/cg";
import { IoMdTime } from "react-icons/io";
import { IoDocumentTextOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { SiTicktick } from "react-icons/si";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../../store/store"; // adjust the import path as needed
import { setStatusFilter } from "../../../../store/Slice/filterSlice"; // adjust the import path as needed
import {
  fetchCompletedPOCountAsync,
  fetchDelayedPOCountAsync,
  fetchPendingPOCountAsync,
  fetchRejectedPOCountAsync,
  fetchTotalPOCountAsync
} from "../../../../store/Slice/orderSlice";
import { BeatLoader, ClipLoader, FadeLoader } from "react-spinners";

const DashboardCards = () => {
  const dispatch = useDispatch<AppDispatch>(); // Add AppDispatch type for better type inference

  const statusFilter = useSelector(
    (state: RootState) => state.filter.statusFilter
  );

  const handleClick = (status: String) => {
    dispatch(setStatusFilter(status));
  };

  useEffect(() => {
    console.log("Current Status Filter:", statusFilter);
  }, [statusFilter]);

  // --- CORRECTED useSelector calls ---
  const totalPOCount = useSelector((state: RootState) => state.orders.totalPOCount);
  const completedPOCount = useSelector((state: RootState) => state.orders.completedPOCount);
  const pendingPOCount = useSelector((state: RootState) => state.orders.pendingPOCount); // Corrected
  const delayedPOCount = useSelector((state: RootState) => state.orders.delayedPOCount); // Corrected
  const rejectedPOCount = useSelector((state: RootState) => state.orders.rejectedPOCount); // Corrected
  // --- END CORRECTED useSelector calls ---

  // It's good practice to also select status and error for UI feedback
  const status = useSelector((state: RootState) => state.orders.status);
  const error = useSelector((state: RootState) => state.orders.error);


  useEffect(() => {
    // Dispatch all the thunks when the component mounts
    // Consider adding checks to prevent re-fetching if data is already present and not stale
    // For example: if (totalPOCount === null && status !== 'loading') { dispatch(fetchTotalPOCountAsync()); }
    dispatch(fetchTotalPOCountAsync());
    dispatch(fetchCompletedPOCountAsync());
    dispatch(fetchPendingPOCountAsync());
    dispatch(fetchDelayedPOCountAsync());
    dispatch(fetchRejectedPOCountAsync());
  }, [dispatch]); // Dependency array ensures it runs once on mount

  // Log all values for debugging
  console.log("Total PO:", totalPOCount);
  console.log("Completed PO:", completedPOCount);
  console.log("Pending PO:", pendingPOCount);
  console.log("Delayed PO:", delayedPOCount);
  console.log("Rejected PO:", rejectedPOCount);
  console.log("Redux Status:", status);
  console.log("Redux Error:", error);


  // You might want to add loading and error states to your UI
  // if (status === 'loading') {
  //   return <div className="text-center py-4 text-blue-600"><BeatLoader /></div>;
  // }

  if (error) {
    return <div className="text-center py-4 text-red-600">Error: {error}</div>;
  }

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
            statusFilter == "all"
              ? "bg-[var(--theme-color)]"
              : "bg-white dark:bg-zinc-950"
          } p-4 rounded-lg shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] dark:shadow-none flex justify-between cursor-pointer font-semibold`}
          onClick={() => handleClick("all")}
        >
          <div className="flex flex-col text-white items-start gap-3">
            <p
              className={`${
                statusFilter == "all"
                  ? "text-white dark:text-white"
                  : "text-[var(--theme-color)] dark:text-white"
              }`}
            >
              Total POs
            </p>
            <p
              className={`${
                statusFilter == "all"
                  ? "text-white dark:text-white"
                  : "text-[var(--theme-color)] dark:text-white"
              } text-3xl font-bold`}
            >
              {status==="loading" ? <ClipLoader color="#40a7f1" /> : totalPOCount !== null ? totalPOCount : 'N/A'}
            </p>
          </div>
          <div className="w-16 flex justify-center ">
            <IoDocumentTextOutline className="text-[var(--theme-color)] text-5xl w-fit bg-blue-100 dark:bg-zinc-700 rounded-lg p-2" />
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
            statusFilter == "completed"
              ? "bg-[var(--theme-color)]"
              : "bg-white dark:bg-zinc-950"
          } p-4 rounded-lg shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] dark:shadow-none flex justify-between cursor-pointer font-semibold`}
          onClick={() => handleClick("completed")}
        >
          <div className="flex flex-col text-black items-start gap-3">
            <p
              className={`${
                statusFilter == "completed"
                  ? "text-white "
                  : "text-[var(--theme-color)] dark:text-white"
              }`}
            >
              Completed POs
            </p>
            <p
              className={`text-green-500 ${
                statusFilter == "completed" ? "" : "text-[var(--theme-color)] "
              } text-3xl font-bold`}
            >
              {status ==="loading" ? <ClipLoader color="#40a7f1"/> :completedPOCount !== null ? completedPOCount : 'N/A'}
            </p>
          </div>
          <div className="w-16 flex justify-center ">
            <SiTicktick className="text-green-600 text-5xl w-fit bg-green-100 rounded-lg p-2" />
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
            statusFilter == "pending"
              ? "bg-[var(--theme-color)]"
              : "bg-white dark:bg-zinc-950"
          } p-4 rounded-lg shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] dark:shadow-none flex justify-between cursor-pointer font-semibold`}
          onClick={() => {
            handleClick("pending");
          }}
        >
          <div className="flex flex-col text-black items-start gap-3">
            <p
              className={`${
                statusFilter == "pending"
                  ? "text-white"
                  : "text-[var(--theme-color)] dark:text-white"
              }`}
            >
              Pending POs
            </p>
            <p
              className={`text-yellow-400 ${
                statusFilter == "pending" ? "" : "text-[var(--theme-color)] "
              } text-3xl font-bold`}
            >
              {status==="loading" ?<ClipLoader color="#40a7f1"/> :pendingPOCount !== null && delayedPOCount!==null ? delayedPOCount+pendingPOCount : pendingPOCount === null && delayedPOCount!==null ? delayedPOCount : pendingPOCount!==null && delayedPOCount===null ? pendingPOCount   :'N/A'}
            </p>
          </div>
          <div className="w-16 flex justify-center ">
            <IoMdTime className="text-yellow-600 text-5xl w-fit bg-yellow-100 rounded-lg p-2" />
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
            statusFilter == "delayed"
              ? "bg-[var(--theme-color)] "
              : "bg-white dark:bg-zinc-950"
          } p-4 rounded-lg shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] dark:shadow-none flex justify-between cursor-pointer font-semibold`}
          onClick={() => handleClick("delayed")}
        >
          <div className="flex flex-col text-black items-start gap-3">
            <p
              className={`${
                statusFilter == "delayed"
                  ? "text-white"
                  : "text-[var(--theme-color)] dark:text-white"
              }`}
            >
              Delayed POs
            </p>
            <p
              className={`text-orange-500 ${
                statusFilter == "delayed" ? "" : "text-[var(--theme-color)] "
              } text-3xl font-bold`}
            >
              {status==="loading" ? <ClipLoader color="#40a7f1"/> :delayedPOCount !== null ? delayedPOCount : 'N/A'}
            </p>
          </div>
          <div className="w-16 flex justify-center ">
            <CgSandClock className="text-orange-600 text-5xl w-fit bg-orange-100 rounded-lg p-2" />
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
            statusFilter == "rejected"
              ? "bg-[var(--theme-color)] "
              : "bg-white dark:bg-zinc-950"
          } p-4 rounded-lg shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] dark:shadow-none flex justify-between cursor-pointer font-semibold`}
          onClick={() => handleClick("rejected")}
        >
          <div className="flex flex-col text-black items-start gap-3">
            <p
              className={` ${
                statusFilter == "rejected"
                  ? "text-white"
                  : "text-[var(--theme-color)] dark:text-white"
              }`}
            >
              Rejected POs
            </p>
            <p
              className={`text-red-500 ${
                statusFilter == "rejected" ? "" : "text-[var(--theme-color)] "
              } text-3xl font-bold`}
            >
              {status==="loading" ? <ClipLoader color="#40a7f1" /> : rejectedPOCount !== null ? rejectedPOCount : 'N/A'}
            </p>
          </div>
          <div className="w-16 flex justify-center ">
            <RxCross2 className="text-red-600 text-5xl w-fit bg-red-100 rounded-lg p-2" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardCards;
