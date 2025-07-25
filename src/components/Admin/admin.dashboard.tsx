/* eslint-disable @typescript-eslint/no-explicit-any */
import "./assets/css/admin.css";
import UserReport from "./component/UserReport";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { IoDocumentTextOutline } from "react-icons/io5";
import { SiTicktick } from "react-icons/si";
import { IoMdTime } from "react-icons/io";
import { motion } from "motion/react";
import { RxCross2 } from "react-icons/rx";
import { IoEyeOutline } from "react-icons/io5";
import { BsDownload } from "react-icons/bs";
import { RiDeleteBinLine } from "react-icons/ri";
import { POChart } from "./component/POGraph";
import { CgSandClock } from "react-icons/cg";
import DonutChart from "./component/PODistribution";
import PODetails from "./component/PODetails";
import {
  fetchOrdersAsync,
  resetOrders,
  deleteOrder,
} from "../../store/Slice/orderSlice";
import { handleDownload } from "./component/downlaod";
import {
  searchOrders,
  clearSearchResults,
} from "../../store/Slice/orderSearchSlice";

////// orders create funcatios
interface Order {
  _id: string; // Adjust to string | number if your API uses numeric IDs
  orderNumber?: string;
  orderId?: string;
  generatedBy?: {
    username?: string;
    user?: { username?: string };
    employeeId?: string;
  };
  formGeneratedBy?: string;
  companyName?: string;
  clientName?: string;
  createdAt?: string;
  date?: string;
  status?: string;
  isdeleted?: boolean;
}

// Custom debounce hook
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const USERS_PER_PAGE = 5;

const DashBoard = () => {
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "completed" | "delayed" | "rejected"
  >("all");
  const [timeFilter, setTimeFilter] = useState<"weekly" | "monthly" | "yearly">(
    "monthly"
  );
  const dispatch = useDispatch<AppDispatch>();
  const { orders } = useSelector((state: RootState) => state.orders);
  const {
    orders: searchResults,
    loading: searchLoading,
    error: searchError,
    query: searchQuery,
  } = useSelector((state: RootState) => state.orderSearch);
  const [showAlert, setShowAlert] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [errors, setErrors] = useState({ fromDate: "", toDate: "" });
  const today = new Date().toISOString().split("T")[0];
  const [currentPage, setCurrentPage] = useState(1);
  const [showPODetails, setShowPODetails] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Debounce the search query with 500ms delay
  const debouncedSearchQuery = useDebounce(localSearchQuery, 500);

  useEffect(() => {
    dispatch(fetchOrdersAsync({ page: currentPage, limit: USERS_PER_PAGE }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    return () => {
      dispatch(resetOrders());
      dispatch(clearSearchResults());
    };
  }, [dispatch]);

  // Calculate counts for dashboard cards
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

  // Trigger search when debounced query or filters change
  useEffect(() => {
    if (debouncedSearchQuery || fromDate || toDate || statusFilter !== "all") {
      dispatch(
        searchOrders({
          query: debouncedSearchQuery,
          startDate: fromDate || undefined,
          endDate: toDate || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
        })
      );
    } else {
      dispatch(clearSearchResults());
    }
  }, [dispatch, debouncedSearchQuery, fromDate, toDate, statusFilter]);

  const filteredOrders = useMemo(() => {
    if (
      statusFilter === "all" &&
      !debouncedSearchQuery.trim() &&
      !fromDate &&
      !toDate
    ) {
      return orders.filter((order) => !order.isdeleted);
    }
    return searchResults && Array.isArray(searchResults.data)
      ? searchResults.data.filter(
          (order: { isdeleted: any }) => !order.isdeleted
        )
      : [];
  }, [
    orders,
    searchResults,
    statusFilter,
    debouncedSearchQuery,
    fromDate,
    toDate,
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as
      | "all"
      | "pending"
      | "completed"
      | "delayed"
      | "rejected";
    setStatusFilter(selected);
  };

  const handleDateChange = (field: "fromDate" | "toDate", value: string) => {
    if (field === "fromDate") {
      setFromDate(value);
    } else {
      setToDate(value);
    }
    validateDates(field, value);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      dispatch(deleteOrder(userToDelete));
      setShowAlert(false);
      setUserToDelete(null);
    }
  };

  const validateDates = (field: "fromDate" | "toDate", value: string) => {
    const isFutureDate = new Date(value) > new Date(today);
    const isEndDateBeforeStartDate =
      field === "toDate" && fromDate && new Date(value) < new Date(fromDate);
    setErrors((prev) => ({
      ...prev,
      [field]: isFutureDate
        ? "Date cannot be in the future."
        : isEndDateBeforeStartDate
        ? "End date cannot be before start date."
        : "",
    }));
  };

  const totalPages = Math.ceil(filteredOrders.length / USERS_PER_PAGE);
  const paginatedData = filteredOrders.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleViewDetails = (order: any) => {
    setSelectedUser(order);
    setShowPODetails(true);
  };

  return (
    <>
      <div className="flex flex-col  overflow-x-hidden ">
        {" "}
        {/* Changed scrollbar-hide to overflow-hidden here */}
        <div className="flex flex-1">
          <div className="flex-1 bg-gray-100 dark:bg-zinc-700  overflow-x-hidden ">
            {" "}
            {/* Added overflow-x-hidden here */}
            <div className="p-2 sm:p-4 md:p-6 lg:p-4 xl:p-6 m-1 sm:m-2 md:m-4 rounded dark:text-white h-fit w-auto relative">
              {" "}
              {/* Removed max-w-screen and scrollbar-hide */}
              {showAlert && (
                <div className="absolute inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300" />
              )}
              <div
                id="alert-additional-content-2"
                className={`fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-black dark:text-red-400 dark:border-red-800 transition-all duration-300 ease-in-out w-[90vw] max-w-sm sm:max-w-md md:max-w-lg
              ${
                showAlert
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
                role="alert"
              >
                <div className="flex items-center">
                  <svg
                    className="shrink-0 w-4 h-4 me-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                  </svg>
                  <span className="sr-only">Info</span>
                  <h3 className="text-lg font-medium">
                    Are you sure you want to remove this user?
                  </h3>
                </div>
                <div className="mt-2 mb-4 text-sm">
                  Click on "Delete" to remove the user or "Dismiss" to close
                  this alert.
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    className="text-white bg-red-800 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                    onClick={confirmDelete}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="text-red-800 bg-transparent border border-red-800 hover:bg-red-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center dark:hover:bg-red-600 dark:border-red-600 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800"
                    onClick={() => {
                      setShowAlert(false);
                      setUserToDelete(null);
                    }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
              {showReport && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                  <div className="relative">
                    <button
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold z-10"
                      onClick={() => setShowReport(false)}
                      aria-label="Close"
                    >
                      ×
                    </button>
                    {/* Assuming UserReport is a component that takes props.
                        You might need to adjust props if it expects different ones. */}
                    {/* @ts-ignore */}
                    <UserReport {...selectedUser} />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 mb-6 text-sm">
                <motion.div
                  initial={{ y: 0 }}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                  className={`${
                    statusFilter === "all"
                      ? "bg-[var(--theme-color)] text-white"
                      : "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                  } p-4 rounded-lg shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] dark:shadow-none flex justify-between cursor-pointer font-semibold w-full`}
                  onClick={() => setStatusFilter("all")}
                >
                  <div className="flex flex-col items-start gap-3">
                    <p className="text-inherit">Total POs</p>
                    <p className="text-3xl font-bold">{counts.total}</p>
                  </div>
                  <div className="w-16 flex justify-center">
                    <IoDocumentTextOutline className="text-white text-5xl w-fit bg-blue-900 rounded-lg p-2" />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ y: 0 }}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                  className={`${
                    statusFilter === "completed"
                      ? "bg-[var(--theme-color)] text-white"
                      : "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                  } p-4 rounded-lg shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] dark:shadow-none flex justify-between cursor-pointer font-semibold`}
                  onClick={() => setStatusFilter("completed")}
                >
                  <div className="flex flex-col items-start gap-3">
                    <p className="text-inherit">Completed POs</p>
                    <p
                      className={`text-3xl font-bold ${
                        statusFilter === "completed"
                          ? "text-white"
                          : "text-green-500"
                      }`}
                    >
                      {counts.completed}
                    </p>
                  </div>
                  <div className="w-16 flex justify-center">
                    <SiTicktick className="text-green-500 text-5xl w-fit bg-gray-200 dark:bg-zinc-700 rounded-lg p-2" />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ y: 0 }}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                  className={`${
                    statusFilter === "pending"
                      ? "bg-[var(--theme-color)] text-white"
                      : "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                  } p-4 rounded-lg shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] dark:shadow-none flex justify-between cursor-pointer font-semibold`}
                  onClick={() => setStatusFilter("pending")}
                >
                  <div className="flex flex-col items-start gap-3">
                    <p className="text-inherit">Pending POs</p>
                    <p
                      className={`text-3xl font-bold ${
                        statusFilter === "pending"
                          ? "text-white"
                          : "text-yellow-400"
                      }`}
                    >
                      {counts.pending}
                    </p>
                  </div>
                  <div className="w-16 flex justify-center">
                    <IoMdTime className="text-yellow-400 text-5xl w-fit bg-gray-200 dark:bg-zinc-700 rounded-lg p-2" />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ y: 0 }}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                  className={`${
                    statusFilter === "delayed"
                      ? "bg-[var(--theme-color)] text-white"
                      : "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                  } p-4 rounded-lg shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] dark:shadow-none flex justify-between cursor-pointer font-semibold`}
                  onClick={() => setStatusFilter("delayed")}
                >
                  <div className="flex flex-col items-start gap-3">
                    <p className="text-inherit">Delayed POs</p>
                    <p
                      className={`text-3xl font-bold ${
                        statusFilter === "delayed"
                          ? "text-white"
                          : "text-orange-500"
                      }`}
                    >
                      {counts.delayed}
                    </p>
                  </div>
                  <div className="w-16 flex justify-center">
                    <CgSandClock className="text-orange-500 text-5xl w-fit bg-gray-200 dark:bg-zinc-700 rounded-lg p-2" />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ y: 0 }}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                  className={`${
                    statusFilter === "rejected"
                      ? "bg-[var(--theme-color)] text-white"
                      : "bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                  } p-4 rounded-lg shadow-[5px_5px_15px_#d1d9e6,-5px_-5px_15px_#ffffff] dark:shadow-none flex justify-between cursor-pointer font-semibold`}
                  onClick={() => setStatusFilter("rejected")}
                >
                  <div className="flex flex-col items-start gap-3">
                    <p className="text-inherit">Rejected POs</p>
                    <p
                      className={`text-3xl font-bold ${
                        statusFilter === "rejected"
                          ? "text-white"
                          : "text-red-500"
                      }`}
                    >
                      {counts.rejected}
                    </p>
                  </div>
                  <div className="w-16 flex justify-center">
                    <RxCross2 className="text-red-500 text-5xl w-fit bg-gray-200 dark:bg-zinc-700 rounded-lg p-2" />
                  </div>
                </motion.div>
              </div>

              <div className="flex flex-col gap-4 p-0 sm:p-2 md:p-4 lg:p-0">
                {" "}
                {/* Adjusted padding */}
                {statusFilter === "all" && (
                  <>
                    <div className="flex justify-between lg:flex-row flex-col gap-2">
                      <motion.div
                        initial={{ y: 0 }}
                        whileHover={{ y: -5, transition: { duration: 0.3 } }}
                        className="xl:w-1/2 lg:w-1/2 w-full gap-3 border-2 border-gray-300 rounded-lg p-5 max-w-full overflow-hidden dark:border-zinc-600 dark:bg-zinc-800"
                      >
                        <div className="flex gap-4 justify-between flex-wrap">
                          {" "}
                          {/* Added flex-wrap */}
                          <div>
                            <span className="font-semibold text-xs md:text-sm lg:text-sm xl:text-sm">
                              POs Status over time
                            </span>
                          </div>
                          <div className="flex gap-2 flex-wrap justify-end">
                            {" "}
                            {/* Added flex-wrap and justify-end */}
                            <button
                              className={`py-2 px-3 rounded-lg text-sm font-semibold ${
                                timeFilter === "weekly"
                                  ? "bg-[var(--theme-color)] text-white"
                                  : "bg-gray-200 text-[var(--theme-color)] hover:bg-gray-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
                              }`}
                              onClick={() => setTimeFilter("weekly")}
                            >
                              Weekly
                            </button>
                            <button
                              className={`py-2 px-3 rounded-lg text-sm font-semibold ${
                                timeFilter === "monthly"
                                  ? "bg-[var(--theme-color)] text-white"
                                  : "bg-gray-200 text-[var(--theme-color)] hover:bg-gray-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
                              }`}
                              onClick={() => setTimeFilter("monthly")}
                            >
                              Monthly
                            </button>
                            <button
                              className={`py-2 px-3 rounded-lg text-sm font-semibold ${
                                timeFilter === "yearly"
                                  ? "bg-[var(--theme-color)] text-white"
                                  : "bg-gray-200 text-[var(--theme-color)] hover:bg-gray-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
                              }`}
                              onClick={() => setTimeFilter("yearly")}
                            >
                              Yearly
                            </button>
                          </div>
                        </div>
                        {/* Assuming POChart is defined elsewhere and responsive */}
                        {/* @ts-ignore */}
                        <POChart
                          className="w-full h-64"
                          type="bar"
                          orders={filteredOrders}
                          timeFilter={timeFilter}
                          statusFilter={statusFilter}
                          startDate={fromDate}
                          endDate={toDate}
                          query={debouncedSearchQuery}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ y: 0 }}
                        whileHover={{ y: -5, transition: { duration: 0.3 } }}
                        className="xl:w-1/2 lg:w-1/2 w-full border-2 border-gray-300 rounded-lg p-5 overflow-hidden dark:border-zinc-600 dark:bg-zinc-800"
                      >
                        <span className="font-semibold mb-4 block text-xs lg:text-sm md:text-sm xl:text-sm">
                          PO Status Distribution
                        </span>
                        {/* Assuming DonutChart is defined elsewhere and responsive */}
                        {/* @ts-ignore */}
                        <DonutChart
                          className="w-full h-64"
                          orders={filteredOrders}
                          statusFilter={statusFilter}
                          startDate={fromDate}
                          endDate={toDate}
                          query={debouncedSearchQuery}
                        />
                      </motion.div>
                    </div>
                  </>
                )}

                <div className="border-2 border-gray-300 rounded-lg p-2 sm:p-4 mt-10 mb-5 overflow-x-auto dark:border-zinc-600 dark:bg-zinc-800">
                  {" "}
                  {/* Adjusted padding, kept overflow-x-auto for table */}
                  <div className="flex justify-between lg:flex-row xl:flex-row flex-col text-sm items-start mb-4">
                    <div>
                      <p className="font-semibold lg:text-lg xl:text-xl text-sm text-gray-600 dark:text-gray-100">
                        Recent Purchase Orders
                      </p>
                    </div>
                    <div className="flex items-end gap-4 xl:flex-row lg:flex-row flex-col xl:text-sm lg:text-sm text-xs mt-2 w-full lg:w-auto">
                      {" "}
                      {/* Added w-full lg:w-auto */}
                      <span className="search border-2 bg-white dark:bg-zinc-600 w-full flex items-center justify-center rounded-lg relative">
                        {" "}
                        {/* Added relative */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="p-2 size-10"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <input
                          id="search"
                          name="search"
                          value={localSearchQuery}
                          onChange={(e) => setLocalSearchQuery(e.target.value)}
                          type="search"
                          placeholder="Search Users..."
                          className="w-full p-2 font-semibold lg:text-sm text-xs bg-transparent focus:outline-none dark:text-white"
                        />
                        {searchLoading && (
                          <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <svg
                              className="animate-spin h-5 w-5 text-gray-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          </div>
                        )}
                      </span>

                      <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="flex flex-col w-full md:w-1/2">
                          <label
                            htmlFor="from-date"
                            className="text-xs text-gray-700 dark:text-white font-medium mb-1"
                          >
                            From Date
                          </label>
                          <input
                            type="date"
                            id="from-date"
                            value={fromDate}
                            onChange={(e) =>
                              handleDateChange("fromDate", e.target.value)
                            }
                            className={`p-2 border bg-white dark:bg-zinc-600 dark:text-white ${
                              errors.fromDate
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            max={today}
                          />
                          {errors.fromDate && (
                            <span className="text-xs text-red-500 mt-1">
                              {errors.fromDate}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col w-full md:w-1/2">
                          <label
                            htmlFor="to-date"
                            className="text-xs text-gray-700 dark:text-white font-medium mb-1"
                          >
                            End Date
                          </label>
                          <input
                            type="date"
                            id="to-date"
                            value={toDate}
                            onChange={(e) =>
                              handleDateChange("toDate", e.target.value)
                            }
                            className={`p-2 border bg-white dark:bg-zinc-600 dark:text-white ${
                              errors.toDate
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          />
                          {errors.toDate && (
                            <span className="text-xs text-red-500 mt-1">
                              {errors.toDate}
                            </span>
                          )}
                        </div>
                      </div>
                      <select
                        value={statusFilter}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-700 bg-white dark:bg-zinc-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--theme-color)]"
                      >
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="delayed">Delayed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                  {searchError && (
                    <div className="text-red-500 text-sm mb-4">
                      {searchError}
                    </div>
                  )}
                  <div className="w-full">
                    {/* Desktop and Tablet View (lg and up) */}
                    <table className="w-full text-xs mb-4 hidden lg:table">
                      <thead>
                        <tr className="bg-gray-200 dark:bg-zinc-950 text-xs">
                          <th className="p-2">PO Number</th>
                          <th className="p-2 text-start">Generated By</th>
                          <th className="p-2">Company</th>
                          <th className="p-2">Client</th>
                          <th className="p-2">Date</th>
                          <th className="p-2">Status</th>
                          <th className="p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedData.length > 0 ? (
                          paginatedData.map((data: Order) => (
                            <tr
                              key={data._id}
                              className="border-b border-gray-200 odd:bg-white dark:odd:bg-zinc-800 even:bg-gray-50 dark:even:bg-zinc-900"
                            >
                              <td>
                                <span className="p-2 text-blue-800 font-bold hover:underline">
                                  {data.orderNumber || data.orderId || "N/A"}
                                </span>
                              </td>
                              <td className="p-2 flex items-center gap-3">
                                <img
                                  src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                                  alt={
                                    data.generatedBy?.username ||
                                    data.formGeneratedBy ||
                                    data.generatedBy?.user?.username ||
                                    "Unknown"
                                  }
                                  className="w-8 h-8 rounded-full lg:inline-block hidden"
                                />
                                <div className="flex flex-col">
                                  <span>
                                    {data.generatedBy?.username ||
                                      data.formGeneratedBy ||
                                      data.generatedBy?.user?.username ||
                                      "Unknown"}
                                  </span>
                                  <span>
                                    {data.generatedBy?.employeeId || "N/A"}
                                  </span>
                                </div>
                              </td>
                              <td className="lg:p-2 p-1">
                                {data.companyName || "N/A"}
                              </td>
                              <td className="lg:p-2 p-1">
                                {data.clientName || "N/A"}
                              </td>
                              <td className="lg:p-2 p-1">
                                {new Date(
                                  data.createdAt || data.date || ""
                                ).toLocaleDateString() || "N/A"}
                              </td>
                              <td
                                className={`lg:p-2 p-1 ${
                                  data.status === "completed"
                                    ? "text-green-500"
                                    : data.status === "delayed"
                                    ? "text-orange-500"
                                    : data.status === "pending"
                                    ? "text-yellow-500"
                                    : "text-red-500"
                                }`}
                              >
                                {data.status
                                  ? data.status.charAt(0).toUpperCase() +
                                    data.status.slice(1)
                                  : "N/A"}
                              </td>
                              <td className="lg:p-2 p-1 lg:gap-3 gap-1 lg:text-3xl text-lg flex justify-center items-center pr-5">
                                <IoEyeOutline
                                  onClick={() => handleViewDetails(data)}
                                  className="hover:bg-blue-800 p-1 rounded-sm hover:text-white duration-200 cursor-pointer"
                                />
                                <BsDownload
                                  onClick={() => handleDownload(data)}
                                  className="hover:bg-blue-800 p-1 rounded-sm hover:text-white duration-200 cursor-pointer"
                                />
                                <RiDeleteBinLine
                                  onClick={() => {
                                    setUserToDelete(data._id);
                                    setShowAlert(true);
                                  }}
                                  className="text-red-500 hover:bg-blue-800 p-1 rounded-sm duration-200 cursor-pointer"
                                />
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="p-4 text-center">
                              {searchLoading ? "Loading..." : "No orders found"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    {/* Mobile View (hidden on lg and up) */}
                    <div className="lg:hidden space-y-4">
                      {paginatedData.length > 0 ? (
                        paginatedData.map((data: Order) => (
                          <div
                            key={data._id}
                            className="border border-gray-300 rounded-md text-xs dark:border-zinc-700 dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
                          >
                            <div className="flex border-b p-2 dark:border-zinc-700">
                              <span className="w-1/3 font-semibold text-gray-600 dark:text-gray-400 text-start">
                                PO Number:
                              </span>
                              <span className="w-2/3 text-blue-800 font-bold text-left">
                                {data.orderNumber || data.orderId || "N/A"}
                              </span>
                            </div>

                            <div className="flex border-b p-2 items-center gap-2 dark:border-zinc-700">
                              <span className="w-1/3 font-semibold text-gray-600 dark:text-gray-400 text-start">
                                Generated By:
                              </span>
                              <div className="w-2/3 flex flex-col text-left">
                                <p>
                                  {data.generatedBy?.username ||
                                    data.formGeneratedBy ||
                                    data.generatedBy?.user?.username ||
                                    "Unknown"}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400">
                                  {data.generatedBy?.employeeId || "N/A"}
                                </p>
                              </div>
                            </div>

                            <div className="flex border-b p-2 dark:border-zinc-700">
                              <span className="w-1/3 font-semibold text-gray-600 dark:text-gray-400 text-start">
                                Company:
                              </span>
                              <span className="w-2/3 text-left">
                                {data.companyName || "N/A"}
                              </span>
                            </div>

                            <div className="flex border-b p-2 dark:border-zinc-700">
                              <span className="w-1/3 font-semibold text-gray-600 dark:text-gray-400 text-start">
                                Client:
                              </span>
                              <span className="w-2/3 text-left">
                                {data.clientName || "N/A"}
                              </span>
                            </div>

                            <div className="flex border-b p-2 dark:border-zinc-700">
                              <span className="w-1/3 font-semibold text-gray-600 dark:text-gray-400 text-start">
                                Date:
                              </span>
                              <span className="w-2/3 text-left">
                                {new Date(
                                  data.createdAt || data.date || ""
                                ).toLocaleDateString() || "N/A"}
                              </span>
                            </div>

                            <div className="flex border-b p-2 dark:border-zinc-700">
                              <span className="w-1/3 font-semibold text-gray-600 dark:text-gray-400 text-start">
                                Status:
                              </span>
                              <span
                                className={`w-2/3 font-semibold text-left ${
                                  data.status === "completed"
                                    ? "text-green-500"
                                    : data.status === "delayed"
                                    ? "text-orange-500"
                                    : data.status === "pending"
                                    ? "text-yellow-500"
                                    : "text-red-500"
                                }`}
                              >
                                {data.status
                                  ? data.status.charAt(0).toUpperCase() +
                                    data.status.slice(1)
                                  : "N/A"}
                              </span>
                            </div>

                            <div className="flex justify-end gap-4 p-2 text-lg">
                              <IoEyeOutline
                                onClick={() => handleViewDetails(data)}
                                className="hover:bg-blue-800 p-1 rounded-sm hover:text-white duration-200 cursor-pointer"
                              />
                              <BsDownload
                                onClick={() => handleDownload(data)}
                                className="hover:bg-blue-800 p-1 rounded-sm hover:text-white duration-200 cursor-pointer"
                              />
                              <RiDeleteBinLine
                                onClick={() => {
                                  setUserToDelete(data._id);
                                  setShowAlert(true);
                                }}
                                className="text-red-500 hover:bg-blue-800 p-1 rounded-sm duration-200 cursor-pointer"
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                          {searchLoading
                            ? "Loading..."
                            : "No orders found for the current filters."}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center items-center gap-2 mt-4">
                      <button
                        onClick={() => changePage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-2 py-1 rounded bg-gray-200 dark:bg-zinc-950 text-xs hover:bg-blue-200 disabled:opacity-50 dark:hover:bg-zinc-700"
                      >
                        ←
                      </button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => changePage(i + 1)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            currentPage === i + 1
                              ? "bg-[var(--theme-color)] text-white font-semibold"
                              : "bg-gray-100 dark:bg-zinc-500 text-black dark:text-white hover:bg-blue-100 dark:hover:bg-zinc-400"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => changePage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-2 py-1 rounded bg-gray-200 dark:bg-zinc-950 text-xs hover:bg-blue-200 disabled:opacity-50 dark:hover:bg-zinc-700"
                      >
                        →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showPODetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold z-10"
                onClick={() => setShowPODetails(false)}
                aria-label="Close"
              >
                ×
              </button>
              {/* Assuming PODetails component exists and takes an 'order' prop */}
              {/* @ts-ignore */}
              <PODetails order={selectedUser} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DashBoard;
