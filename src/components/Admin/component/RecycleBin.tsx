import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store"; // Adjust path to your store
import {
  getRecycleBinOrders,
  restoreOrdersMultiple,
  deleteOrdersMultiple,
} from "../../../store/Slice/recycleBinSlice";
import { toast } from "react-toastify";
import { FaRegTrashAlt } from "react-icons/fa";

type Order = {
  _id: string;
  orderNumber: string;
  companyName: string;
  clientName: string;
  status: "completed" | "delayed" | "pending" | "rejected";
  createdAt: string;
  estimatedDispatchDate?: string;
  generatedBy: {
    username: string;
    employeeId: string;
  };
};

const RecycleBin: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, status, error } = useSelector(
    (state: RootState) => state.recycleBin
  );
  const [selected, setSelected] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate time remaining until estimatedDispatchDate
  const calculateTimeRemaining = (dispatchDate?: string) => {
    if (!dispatchDate) return "";
    const now = new Date();
    const dispatch = new Date(dispatchDate);
    const diffMs = dispatch.getTime() - now.getTime();
    if (diffMs <= 0) return "Overdue";
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
  };

  // Toggle individual order selection
  const toggleSelect = (orderNumber: string) => {
    setSelected((prevSelected) =>
      prevSelected.includes(orderNumber)
        ? prevSelected.filter((id) => id !== orderNumber)
        : [...prevSelected, orderNumber]
    );
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
      setSelectAll(false);
    } else {
      setSelected(orders.map((order: Order) => order.orderNumber));
      setSelectAll(true);
    }
  };

  const fetchRecycleBinOrders = () => {
    dispatch(getRecycleBinOrders({}));
  };

  const restoreSelected = () => {
    const orderIds = orders
      .filter((order: Order) => selected.includes(order.orderNumber))
      .map((order: Order) => order._id);

    if (orderIds.length > 0) {
      dispatch(restoreOrdersMultiple(orderIds))
        .unwrap()
        .then(() => {
          toast.success("PO Restored Successfully!");
          setSelected([]);
          setSelectAll(false);
          fetchRecycleBinOrders(); // ✅ Now this will run after restore completes
        })
        .catch((error: any) => {
          toast.error("Failed to restore orders");
          console.error(error);
        });
    }
  };

  const deleteSelected = () => {
    const orderIds = orders
      .filter((order: Order) => selected.includes(order.orderNumber))
      .map((order: Order) => order._id);

    if (orderIds.length > 0) {
      dispatch(deleteOrdersMultiple(orderIds))
        .unwrap()
        .then(() => {
          toast.error("PO Deleted Permanently!");
          setSelected([]);
          setSelectAll(false);
          fetchRecycleBinOrders(); // ✅ Will run after deletion completes
        })
        .catch((error: any) => {
          toast.error("Failed to delete orders");
          console.error(error);
        });
    }
  };

  useEffect(() => {
    dispatch(getRecycleBinOrders({}));
  }, [dispatch]);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmRestore, setConfirmRestore] = useState(false);

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center h-full justify-center gap-4 select-none">
        <span className="lg:text-9xl xl:text-9xl text-7xl text-gray-300">
          <FaRegTrashAlt />
        </span>
        <span className="text-gray-300 lg:text-6xl xl:text-6xl text-3xl">Nothing in Recycle Bin</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Loading and Error States */}
      {/* {status === 'loading' && <div className="text-center">Loading...</div>} */}
      {error && <div className="text-red-500 text-center">{error}</div>}
      {status === "succeeded" && orders.length === 0 && (
        <div className="text-center">No orders in recycle bin</div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center p-4 backdrop-filter backdrop-blur-md z-10">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full border-4 border-red-500">
            <h3 className="text-xl font-bold text-red-600 mb-4">
              Confirm Deletion
            </h3>
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete this PO ?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setConfirmDelete(false);
                  // setUserToDelete(null);
                }}
                className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteSelected}
                className="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmRestore && (
        <div className="fixed inset-0 flex items-center justify-center p-4 backdrop-filter backdrop-blur-md z-10">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full border-4 border-green-500">
            <h3 className="text-xl font-bold text-green-600 mb-4">
              Confirm Restore
            </h3>
            <p className="mb-4 text-gray-700">
              Are you sure you want to Restore this PO ?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setConfirmRestore(false);
                  // setUserToDelete(null);
                }}
                className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={restoreSelected}
                className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition-colors"
              >
                Confirm Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Controls */}
      {orders.length > 0 && (
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="w-4 h-4"
            />
            Select All
          </label>
          <div className="flex gap-4">
            <button
              className={`px-3 py-2 rounded-lg text-white font-semibold text-sm ${
                selected.length
                  ? "bg-blue-500 hover:bg-blue-400 active:bg-blue-600"
                  : "bg-blue-300 cursor-not-allowed"
              }`}
              disabled={!selected.length}
              // onClick={restoreSelected}
              onClick={() => setConfirmRestore(true)}
            >
              Restore Selected
            </button>
            <button
              className={`px-3 py-2 rounded-lg text-white font-semibold text-sm ${
                selected.length
                  ? "bg-red-500 hover:bg-red-400 active:bg-red-600"
                  : "bg-red-300 cursor-not-allowed"
              }`}
              disabled={!selected.length}
              // onClick={deleteSelected}
              onClick={() => setConfirmDelete(true)}
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-200 dark:bg-zinc-900">
              <th className="p-2"></th>
              <th className="p-2">PO Number</th>
              <th className="p-2">Generated By</th>
              <th className="p-2">Company</th>
              <th className="p-2">Client</th>
              <th className="p-2">Date</th>
              <th className="p-2">Status</th>
              <th className="p-2">Time Remaining</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(orders) &&
              orders.map((data: Order) => (
                <tr
                  key={data?._id} // Use _id for unique key
                  className="border-b border-gray-200 odd:bg-white dark:odd:bg-zinc-800 even:bg-gray-50 dark:even:bg-zinc-900"
                >
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(data?.orderNumber)}
                      onChange={() => toggleSelect(data?.orderNumber)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="p-2 font-bold text-blue-800 dark:text-blue-500 hover:underline">
                    {data?.orderNumber} {/* Use orderNumber */}
                  </td>
                  <td className="p-2 flex items-center gap-3">
                    <img
                      src={
                        data?.generatedBy?.username
                          ? "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                          : ""
                      }
                      alt={data?.generatedBy?.username}
                      className="w-8 h-8 rounded-full hidden lg:block"
                    />
                    <div className="flex flex-col">
                      <span>{data?.generatedBy?.username}</span>{" "}
                      {/* Use username */}
                      <span>{data?.generatedBy?.employeeId}</span>{" "}
                      {/* Use employeeId */}
                    </div>
                  </td>
                  <td className="p-2">{data?.companyName}</td>{" "}
                  {/* Use companyName */}
                  <td className="p-2">{data?.clientName}</td>{" "}
                  {/* Use clientName */}
                  <td className="p-2">
                    {formatDate(data?.createdAt)
                      ? formatDate(data?.createdAt)
                      : ""}
                  </td>{" "}
                  {/* Use createdAt */}
                  <td
                    className={`p-2 font-semibold ${
                      data?.status === "completed"
                        ? "text-green-500"
                        : data.status === "delayed"
                        ? "text-orange-500"
                        : data.status === "pending"
                        ? "text-yellow-500"
                        : data.status === "rejected"
                        ? "text-red-500"
                        : ""
                    }`}
                  >
                    {data?.status?.charAt(0)?.toUpperCase() +
                      data?.status?.slice(1)}{" "}
                    {/* Capitalize status */}
                  </td>
                  <td className="p-2">
                    {calculateTimeRemaining(data?.estimatedDispatchDate)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {Array.isArray(orders) &&
          orders.map((data: Order) => (
            <div
              key={data._id} // Use _id for unique key
              className="border border-gray-200 rounded-md shadow-sm text-sm bg-white dark:bg-zinc-900 dark:border-zinc-700"
            >
              <div className="flex items-center p-2 border-b dark:border-zinc-700">
                <input
                  type="checkbox"
                  checked={selected.includes(data.orderNumber)}
                  onChange={() => toggleSelect(data.orderNumber)}
                  className="w-4 h-4 mr-2"
                />
                <span className="font-semibold text-blue-800 dark:text-blue-500">
                  {data.orderNumber} {/* Use orderNumber */}
                </span>
              </div>
              <div className="flex p-2 border-b dark:border-zinc-700">
                <span className="w-1/3 text-gray-500 dark:text-zinc-300 text-start">
                  Generated By:
                </span>
                <div className="w-2/3 flex gap-2 items-center">
                  <img
                    src={
                      data.generatedBy?.userimage ||
                      "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                    }
                    alt={data.generatedBy?.username || "Unknown"}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex flex-col">
                    <span>{data.generatedBy?.username || "Unknown"}</span>{" "}
                    {/* Use username */}
                    <span>{data.generatedBy?.employeeId || "N/A"}</span>{" "}
                    {/* Use employeeId */}
                  </div>
                </div>
              </div>
              <div className="flex p-2 border-b dark:border-zinc-700">
                <span className="w-1/3 text-gray-500 dark:text-zinc-300 text-start">
                  Company:
                </span>
                <span className="w-2/3 text-left">{data.companyName}</span>{" "}
                {/* Use companyName */}
              </div>
              <div className="flex p-2 border-b dark:border-zinc-700">
                <span className="w-1/3 text-gray-500 dark:text-zinc-300 text-start">
                  Client:
                </span>
                <span className="w-2/3 text-left">{data.clientName}</span>{" "}
                {/* Use clientName */}
              </div>
              <div className="flex p-2 border-b dark:border-zinc-700">
                <span className="w-1/3 text-gray-500 dark:text-zinc-300 text-start">
                  Date:
                </span>
                <span className="w-2/3 text-left">
                  {formatDate(data.createdAt)}
                </span>{" "}
                {/* Use createdAt */}
              </div>
              <div className="flex p-2 border-b dark:border-zinc-700">
                <span className="w-1/3 text-gray-500 dark:text-zinc-300 text-start">
                  Status:
                </span>
                <span
                  className={`w-2/3 text-left font-semibold ${
                    data?.status === "completed"
                      ? "text-green-500"
                      : data.status === "delayed"
                      ? "text-orange-500"
                      : data.status === "pending"
                      ? "text-yellow-500"
                      : data.status === "rejected"
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  {data.status?.charAt(0)?.toUpperCase() +
                    data.status?.slice(1)}{" "}
                  {/* Capitalize status */}
                </span>
              </div>
              <div className="flex p-2">
                <span className="w-1/3 text-gray-500 dark:text-zinc-300 text-start">
                  Time:
                </span>
                <span className="w-2/3 text-left">
                  {formatTime(data.createdAt)}
                </span>{" "}
                {/* Use createdAt */}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RecycleBin;
