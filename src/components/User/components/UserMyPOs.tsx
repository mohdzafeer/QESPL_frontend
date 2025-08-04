import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLoginUserAsync, deleteOrderAsync, type Order } from '../../../store/Slice/orderSlice';
import type { RootState } from '../../../store/store';
import { formatDate } from './UserEditPO';
import { toast } from 'react-toastify';
import UserEditPO from './UserEditPO';

const UserMyPOs: React.FC = () => {
  const dispatch = useDispatch();
  const { orders, status, error, success } = useSelector((state: RootState) => state.orders);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    dispatch(fetchLoginUserAsync());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success("Operation completed successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [success, error]);

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
    // setSelectedOrder(order);
    // setShowDeleteConfirmModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedOrder(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedOrder) {
      await dispatch(deleteOrderAsync(selectedOrder._id));
      setShowDeleteConfirmModal(false);
      setSelectedOrder(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setSelectedOrder(null);
  };

  return (
    <div className={`p-5 ${showEditModal || showDeleteConfirmModal ? 'relative overflow-hidden' : ''}`}>
      {(showEditModal || showDeleteConfirmModal) && (
        <div className="fixed inset-0 backdrop-blur-sm z-40"></div>
      )}
      <h1 className="text-3xl font-bold mb-6">My Purchase Orders</h1>
      {status === 'loading' && <div className="text-center">Loading...</div>}
      {error && !success && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-zinc-800 border-separate border-spacing-0">
          <thead>
            <tr className="bg-gray-200 dark:bg-zinc-950 border-b border-gray-300 dark:border-zinc-700">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">PO Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Company Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                  {order.orderNumber || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                  {order.companyName || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                  {order.status || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                  {formatDate(order.createdAt)}
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
                      onClick={() => handleDeleteClick(order)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditModal && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-[100000]">
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl p-6 max-w-fit mx-auto relative transform transition-all sm:my-8 sm:align-middle sm:w-full">
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