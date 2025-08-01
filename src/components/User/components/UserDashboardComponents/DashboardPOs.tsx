import React, { useEffect, useState } from "react";
import { BsDownload } from "react-icons/bs";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import PODetails from "../../../User/components/UserDashboardComponents/PODetails"; // Ensure this path is correct
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import { setStatusFilter } from "../../../../store/Slice/filterSlice";
import { fetchAllOrders } from "../../../../utils/api"; // Ensure this path is correct
import { handleDownload } from "../../../Admin/component/downlaod";

// --- INTERFACES: COPIED DIRECTLY FROM PODetails.tsx (po-details-updated Canvas) ---
interface Product {
  _id?: string; // Optional, some products might not have it or it's not needed for display
  name: string;
  quantity: number;
  price: number;
  remark?: string;
  createdAt?: string; // Optional
  updatedAt?: string; // Optional
}

interface GeneratedBy {
  username: string;
  employeeId: string;
  name?: string; // Some orders have 'name' directly under generatedBy
}

// interface CreatedBy {
//   userId: string;
//   username: string;
// }

interface orderThrough{
  username:string,
  employeeId:string

}


interface Order {
  _id: string;
  orderNumber: string;
  clientName: string;
  companyName: string;
  gstNumber?: string;
  contact: string; // Changed to string based on your data: "8267824537"
  address: string;
  zipCode: string; // Changed to string based on your data: "202001"
  products: Product[];
  estimatedDispatchDate?: string; // Optional
  generatedBy: GeneratedBy;
  // orderThrougth?: string; // Optional
  department?: string; // Optional
  status: string;
  isdeleted: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
  // createdBy?: CreatedBy; // Optional
  deletedAt?: string; // Optional
  formGeneratedBy?: string; // Some orders have this field
  orderThrough?:orderThrough
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  limit: number;
}

interface FetchedOrdersData {
  orders: Order[];
  pagination: Pagination;
}
// --- END INTERFACES ---

const DashboardPOs = () => {
  const dispatch = useDispatch();
  const statusFilter = useSelector(
    (state: RootState) => state.filter.statusFilter
  );

  const [ordersData, setOrdersData] = useState<FetchedOrdersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dateErrors, setDateErrors] = useState({ fromDate: "", toDate: "" });

  const [showPODetails, setShowPODetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // State to hold the order for PODetails modal

  const rowsPerPage = 10; 
  const [currentPage, setCurrentPage] = useState(1); 

  // Fetch orders when component mounts or currentPage changes
  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);
        const result = await fetchAllOrders(currentPage, rowsPerPage); 
        setOrdersData(result);
      } catch (err: any) {
        console.error("Error fetching orders in DashboardPOs:", err);
        setError(err.message || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, [currentPage]); 

  
  // Update Redux filter state and reset pagination
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setStatusFilter(e.target.value));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Filter orders based on statusFilter and search query (frontend filtering)
  const filteredOrders = ordersData?.orders?.filter((order) => {
    const matchesStatus = statusFilter === "all" || 
                          order.status?.toLowerCase().trim() === statusFilter.toLowerCase().trim();
    
    const matchesSearch = searchQuery.toLowerCase().trim() === "" ||
                          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                          order.clientName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                          order.companyName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                          order.generatedBy.username?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                          order.generatedBy.name?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                          order.generatedBy.employeeId.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                          order.products.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase().trim()));

    // Date filtering (optional, implement if needed, currently filtering on frontend)
    const orderDate = new Date(order.createdAt);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    const matchesDate = (!from || orderDate >= from) && (!to || orderDate <= to);

    return matchesStatus && matchesSearch && matchesDate;
  }) || []; 

  // Pagination logic for filtered data (frontend pagination)
  const totalFilteredPages = Math.ceil(filteredOrders.length / rowsPerPage);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalFilteredPages) {
      setCurrentPage(page);
    }
  };

  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

  const validateDates = (field: "fromDate" | "toDate", value: string) => {
    const dateValue = new Date(value);
    const todayDate = new Date(today);
    
    if (dateValue > todayDate) {
      setDateErrors((prev) => ({
        ...prev,
        [field]: "Date cannot be in the future.",
      }));
    } else {
      setDateErrors((prev) => ({ ...prev, [field]: "" }));
    }

    if (fromDate && toDate) {
      if (new Date(fromDate) > new Date(toDate)) {
        setDateErrors((prev) => ({
          ...prev,
          fromDate: "From Date cannot be after To Date.",
          toDate: "To Date cannot be before From Date.",
        }));
      } else {
        setDateErrors((prev) => ({ ...prev, fromDate: "", toDate: "" }));
      }
    }
  };

  // Function to handle opening PO details modal
  const handleViewPODetails = (order: Order) => {
    // --- START DEBUG LOGS ---
    console.log("handleViewPODetails called with order:", order);
    setSelectedOrder(order as Order | null); // Explicitly cast to Order | null
    console.log("selectedOrder after setting:", order); // Log the value that was just set
    // --- END DEBUG LOGS ---
    setShowPODetails(true);
  };

  if (loading) {
    return <div className="p-5 text-center text-gray-600 dark:text-gray-300">Loading purchase orders...</div>;
  }

  if (error) {
    return (
      <div className="p-5 text-center text-red-600">
        Error loading orders: {error}
        <p className="text-sm text-gray-500 mt-2">Please try logging in again or check your network connection.</p>
      </div>
    );
  }

  return (
    <div className="border-2 border-gray-300 rounded-lg p-5 mt-10 overflow-x-auto lg:text-lg md:text-sm text-xs mb-20">
      <div className="flex justify-between i lg:flex-row xl:flex-row flex-col items-start mb-4">
        <div>
          <p className="font-semibold lg:text-lg xl:text-xl text-sm text-gray-800 dark:text-white">
            Recent Purchase Orders
          </p>
        </div>
        <div className="flex items-end gap-4 xl:flex-row lg:flex-row flex-col xl:text-sm lg:text-sm text-xs mt-2">
          <span className="search border-2 bg-white dark:bg-zinc-800 w-full flex items-center justify-center rounded-lg">
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
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              type="search"
              placeholder="Search Orders..."
              className="w-full p-2 font-semibold lg:text-sm text-xs"
            />
          </span>

          <div className="flex flex-row md:flex-row gap-4 w-full">
            {/* From Date */}
            <div className="flex flex-col w-full md:w-1/2 ">
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
                onChange={(e) => {
                  setFromDate(e.target.value);
                  validateDates("fromDate", e.target.value);
                }}
                className={`p-2 border bg-white dark:bg-zinc-800 ${
                  dateErrors.fromDate ? "border-red-500" : "border-gray-300 dark:border-zinc-600"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                max={today}
              />
              {dateErrors.fromDate && (
                <span className="text-xs text-red-500 mt-1">
                  {dateErrors.fromDate}
                </span>
              )}
            </div>

            {/* To Date */}
            <div className="flex flex-col w-full md:w-1/2">
              <label
                htmlFor="to-date"
                className="text-xs text-gray-700 dark:text-white font-medium mb-1"
              >
                To Date
              </label>
              <input
                type="date"
                id="to-date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  validateDates("toDate", e.target.value);
                }}
                className={`p-2 border bg-white dark:bg-zinc-800 ${
                  dateErrors.toDate ? "border-red-500" : "border-gray-300 dark:border-zinc-600"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                max={today}
              />
              {dateErrors.toDate && (
                <span className="text-xs text-red-500 mt-1">
                  {dateErrors.toDate}
                </span>
              )}
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md text-gray-700 bg-white dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A2975]"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="delayed">Delayed</option>
            <option value="rejected">Rejected</option>
            {/* <option value="orders">Orders</option>  */}
          </select>
        </div>
      </div>
      <div className="w-full">
        {/* 🔢 Table */}
        <>
          {/* Desktop View: Standard Table */}
          <div className="hidden lg:block">
            <table className="w-full text-xs mb-4">
              <thead>
                <tr className="bg-gray-200 dark:bg-zinc-950 text-xs">
                  <th className="p-2 text-xl text-start">PO Number</th>
                  <th className="p-2 text-xl text-start">Generated By</th>
                  <th className="p-2 text-xl">Company</th>
                  <th className="p-2 text-xl">Client</th>
                  <th className="p-2 text-xl">Date</th>
                  <th className="p-2 text-xl">Status</th>
                  <th className="p-2 text-xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((data) => (
                    <tr
                      key={data._id} 
                      className="border-b border-gray-200 dark:border-zinc-600 odd:bg-white dark:odd:bg-zinc-800 even:bg-gray-50 even:dark:bg-zinc-900"
                    >
                      <td className="text-start">
                        <span className="p-2 text-blue-800 font-bold hover:underline">
                          {data.orderNumber}
                        </span>
                      </td>
                      <td className="p-2 flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="text-start">{data.generatedBy?.username || data.generatedBy?.name || 'N/A'}</span>
                          <span className="text-start">{data.generatedBy?.employeeId || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="lg:p-2 p-1">{data.companyName}</td>
                      <td className="lg:p-2 p-1">{data.clientName}</td>
                      <td className="lg:p-2 p-1">
                        {data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'N/A'}
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
                        {data.status ? data.status.charAt(0).toUpperCase() + data.status.slice(1) : 'N/A'}
                      </td>
                      <td className="lg:p-2 p-1 lg:gap-3 gap-1 lg:text-3xl text-lg flex justify-center items-center pr-5">
                        <IoEyeOutline
                          onClick={() => handleViewPODetails(data)} 
                          className="hover:bg-blue-800 p-1 rounded-sm hover:text-white duration-200 cursor-pointer"
                        />
                        <BsDownload onClick={()=>handleDownload(data)} className="hover:bg-blue-800 p-1 rounded-sm hover:text-white duration-200 cursor-pointer" />
                        {/* <RiDeleteBinLine className="text-red-500 hover:bg-blue-800 p-1 rounded-sm duration-200 cursor-pointer" /> */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-4 text-gray-500">
                      No orders found for the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View: Stacked Table */}
          <div className="lg:hidden space-y-4">
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((data) => (
                <div
                  key={data._id} 
                  className="border border-gray-300 rounded-md text-xs"
                >
                  <div className="flex border-b p-2">
                    <span className="w-1/3 font-semibold text-gray-600 dark:text-gray-300 text-start">
                      PO Number:
                    </span>
                    <span className="w-2/3 text-blue-800 dark:text-blue-500 font-bold text-left">
                      {data.orderNumber}
                    </span>
                  </div>

                  <div className="flex border-b p-2 items-center gap-2">
                    <span className="w-1/3 font-semibold text-gray-600 dark:text-gray-300 text-start">
                      Generated By:
                    </span>
                    <div className="w-2/3 flex gap-2 items-center text-left">
                      <div className="text-left">
                        <p>{data.generatedBy?.username  || 'N/A'}</p>
                        <p className="text-gray-500 dark:text-gray-300">{data.generatedBy?.employeeId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex border-b p-2">
                    <span className="w-1/3 font-semibold text-gray-600 dark:text-gray-300 text-start">
                      Company:
                    </span>
                    <span className="w-2/3 text-left">{data.companyName}</span>
                  </div>

                  <div className="flex border-b p-2">
                    <span className="w-1/3 font-semibold text-gray-600 dark:text-gray-300 text-start">
                      Client:
                    </span>
                    <span className="w-2/3 text-left">{data.clientName}</span>
                  </div>

                  <div className="flex border-b p-2">
                    <span className="w-1/3 font-semibold text-gray-600 dark:text-gray-300 text-start">
                      Date:
                    </span>
                    <span className="w-2/3 text-left">
                      {data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>

                  <div className="flex border-b p-2">
                    <span className="w-1/3 font-semibold text-gray-600 dark:text-gray-300 text-start">
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
                      {data.status ? data.status.charAt(0).toUpperCase() + data.status.slice(1) : 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-end gap-4 p-2 text-lg">
                    <IoEyeOutline
                      onClick={() => handleViewPODetails(data)} 
                      className="hover:bg-blue-800 p-1 rounded-sm hover:text-white duration-200 cursor-pointer"
                    />
                    <BsDownload onClick={()=>handleDownload(data)}  className="hover:bg-blue-800 p-1 rounded-sm hover:text-white duration-200 cursor-pointer" />
                    {/* <RiDeleteBinLine className="text-red-500 hover:bg-blue-800 p-1 rounded-sm duration-200 cursor-pointer" /> */}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4 text-gray-500">
                No orders found for the current filters.
              </div>
            )}
          </div>
        </>

        {/* ⏮️ Pagination */}
        {totalFilteredPages > 1 && ( 
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded bg-gray-200 dark:bg-zinc-900 text-sm hover:bg-blue-200 disabled:opacity-50"
            >
              ←
            </button>

            {[...Array(totalFilteredPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => changePage(i + 1)}
                className={`px-3 py-1 rounded-full text-sm ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white font-semibold"
                    : "bg-gray-100 dark:bg-[var(--theme-color)] hover:bg-blue-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalFilteredPages}
              className="px-2 py-1 rounded bg-gray-200 dark:bg-zinc-900 text-sm hover:bg-blue-200 disabled:opacity-50"
            >
              →
            </button>
          </div>
        )}
      </div>

      {/* PODetails Modal */}
      {showPODetails && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold z-10"
              onClick={() => setShowPODetails(false)}
              aria-label="Close"
            >
              &times;
            </button>
            {/* Pass selectedOrder to PODetails component */}
            <PODetails orderData={selectedOrder} onClose={() => setShowPODetails(false)} /> 
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPOs;
