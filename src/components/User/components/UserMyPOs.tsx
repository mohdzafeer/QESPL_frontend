import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLoginUserAsync, type Order } from '../../../store/Slice/orderSlice';
import type { RootState } from '../../../store/store';
import { formatDate } from './UserEditPO';
import { toast } from 'react-toastify';
import UserEditPO from './UserEditPO';
import { softDeleteOrder } from '../../../store/Slice/recycleBinSlice';
import { ClipLoader, MoonLoader } from 'react-spinners';

const UserMyPOs: React.FC = () => {
  const dispatch = useDispatch();
  // The state structure from orderSlice.ts has a nested `pagination` object.
  // We need to destructure the `pagination` object first, then access its properties.
  const { orders, status, error, success, pagination } = useSelector((state: RootState) => state.orders);
  const { totalPages, currentPage, limit } = pagination;
  // dispatch(resetOrders())
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleEditClick = (order: Order) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  const handleDeleteClick = (order: Order) => {
    toast.error("You don't have permission for the deletion, please contact admin.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    // The original code was commented out, so I've kept it that way for clarity.
    // setSelectedOrder(order);
    // setShowDeleteConfirmModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedOrder(null);
  };

  const handleConfirmDelete = () => {
    if (selectedOrder) {
      dispatch(softDeleteOrder(selectedOrder))
        .unwrap()
        .then(() => {
          toast.error("PO moved to Recycle Bin", {
            toastId: "po-deleted",
          });
          // After deletion, fetch the data again to reflect the change
          dispatch(fetchLoginUserAsync({ page: currentPage, limit: limit }));
        })
        .catch((err: any) => {
          toast.error(`Unexpected error: ${err}`, {
            toastId: "delete-unexpected-error",
          });
        });
      setShowDeleteConfirmModal(false);
      setSelectedOrder(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setSelectedOrder(null);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(fetchLoginUserAsync({ page, limit }));
    }
  };

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchOrdersOfLoggedInUser=async()=>{
      setLoading(true)
      try {
        await dispatch(fetchLoginUserAsync({ page: currentPage, limit: limit }));
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    fetchOrdersOfLoggedInUser()
  }, [dispatch, currentPage, limit]);

  useEffect(() => {
    console.log(selectedOrder, "selected oRder.............");
  }, [selectedOrder]);

  if(loading===true){
    return(
      <div className='h-full w-full flex items-center justify-center'>
        <MoonLoader />
      </div>
    )
  }

  return (
    <div className={`p-5 mb-20 ${showEditModal || showDeleteConfirmModal ? 'relative overflow-hidden' : ''}`}>
      {(showEditModal || showDeleteConfirmModal) && (
        <div className="fixed inset-0 backdrop-blur-sm z-40"></div>
      )}
      <h1 className="text-3xl font-bold mb-6 text-center">My Purchase Orders</h1>
      {status === 'loading' && <ClipLoader color="#40a7f1"/>}
      {status === 'succeeded' && orders.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400">No orders found.</div>
      )}
      {error && !success && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}
      <div className="overflow-x-auto">
        {/* Desktop Table */}
        <table className="min-w-full bg-white dark:bg-zinc-800 border-separate border-spacing-0 hidden md:table">
          <thead>
            <tr className="bg-gray-200 dark:bg-zinc-950 border-b border-gray-300 dark:border-zinc-700">
              <th className=" px-6 py-3 text-left text-xl font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                PO Number
              </th>
              <th className=" px-6 py-3 text-left text-xl font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Company Name
              </th>
              <th className=" px-6 py-3 text-left text-xl font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className=" px-6 py-3 text-left text-xl font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Created On
              </th>
              <th className=" px-6 py-3 text-right text-xl font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order._id}
                className={`text-start
                  ${index === orders.length - 1 ? '' : 'border-b border-gray-200 dark:border-zinc-700 '}
                  ${index % 2 === 0 ? 'bg-white dark:bg-zinc-800' : 'bg-gray-100 dark:bg-zinc-900'}
                `}
              >
                <td className="px-6 py-4 whitespace-nowrap text-lg font-semibold text-blue-700 dark:text-gray-200">
                  {order?.orderNumber || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 ">
                  {order?.companyName || '--'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs  uppercase font-bold ">
                  <span className={`uppercase
                    ${order.status === 'pending' && 'bg-yellow-100 text-yellow-500 py-1 px-2 rounded-full'}
                    ${order.status === 'completed' && 'bg-green-100 text-green-500 py-1 px-2 rounded-full'}
                    ${order.status === 'delayed' && 'bg-orange-100 text-orange-500 py-1 px-2 rounded-full'}
                    ${order.status === 'rejected' && 'bg-red-100 text-red-500 py-1 px-2 rounded-full'}
                  `}>{order?.status || 'N/A'}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 font-semibold ">
                  {order.orderDate ? formatDate(order.orderDate) : formatDate(order.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-4">
                    <FaEdit
                      className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 cursor-pointer text-lg"
                      title="Edit"
                      onClick={() => handleEditClick(order)}
                    />
                    <FaTrashAlt
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 cursor-pointer text-lg"
                      title="Delete"
                      onClick={() => { setShowDeleteConfirmModal(true), setSelectedOrder(order._id) }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Card View */}
        <div className="block md:hidden space-y-4 mb-20">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-zinc-700"
            >
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">PO Number:</span>
                <span className="text-blue-800 font-semibold dark:text-gray-200">{order.orderNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Company Name:</span>
                <span className="text-gray-800 dark:text-gray-200">{order.companyName || 'N/A'}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold  ">Status:</span>
                <span className={`text-gray-800 dark:text-gray-200 uppercase text-xs font-bold
                  ${order.status === 'pending' && 'bg-yellow-100 text-yellow-600 dark:text-yellow-600 py-1 px-2 rounded-full'}
                  ${order.status === 'completed' && 'bg-green-100 text-green-600 dark:text-green-600 py-1 px-2 rounded-full'}
                  ${order.status === 'delayed' && 'bg-orange-100 text-orange-600 dark:text-orange-600 py-1 px-2 rounded-full'}
                  ${order.status === 'rejected' && 'bg-red-100 text-red-600 py-1 dark:text-red-600 px-2 rounded-full'}
                `}>{order.status || 'N/A'}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Created On:</span>
                <span className="text-gray-800 dark:text-gray-200">{order.orderDate ? formatDate(order.orderDate) : formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-end space-x-4">
                <FaEdit
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 cursor-pointer text-lg"
                  title="Edit"
                  onClick={() => handleEditClick(order)}
                />
                <FaTrashAlt
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 cursor-pointer text-lg"
                  title="Delete"
                  onClick={() => { setShowDeleteConfirmModal(true), setSelectedOrder(order._id) }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-md text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 border rounded-md ${
                currentPage === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-zinc-700 dark:text-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-md text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {showEditModal && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-[100000] ">
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl p-6 w-11/12 max-w-4xl max-h-[80vh] overflow-y-auto mx-auto relative transform transition-all sm:my-8 sm:align-middle no-scrollbar">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Edit PO: {selectedOrder.orderNumber}
            </h2>
            <button
              onClick={handleCloseEditModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              title="Close"
            >
              <FaTimes className="text-xl" />
            </button>
            <div className="mt-4 p-4 border border-gray-300 dark:border-zinc-600 rounded-md bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-200">
              <UserEditPO order={selectedOrder} onClose={handleCloseEditModal} />
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirmModal && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-700 rounded-lg shadow-xl p-6 w-full max-w-sm mx-auto relative transform transition-all sm:my-8 sm:align-middle sm:w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Confirm Deletion</h2>
            <p className="text-gray-700 dark:text-gray-200">
              Are you sure you want to delete PO <strong>{selectedOrder.orderNumber}</strong>?
            </p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleCancelDelete}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-zinc-600 dark:hover:bg-zinc-500 dark:text-white"
              >
                No
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMyPOs;
