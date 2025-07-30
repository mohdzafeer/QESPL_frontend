import React, { useState } from 'react';
import { FaEdit, FaTrashAlt, FaTimes } from 'react-icons/fa'; // Added FaTimes for close icon
import UserEditPO from './UserEditPO'; // Assuming this is the component for editing POs


const UserMyPOs = () => {
  const poData = [
    { id: 'PO001' },
    { id: 'PO002' },
    { id: 'PO003' },
    { id: 'PO004' },
    { id: 'PO005' },
  ];

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedPoId, setSelectedPoId] = useState(null); // To store which PO is being edited/deleted

  const handleEditClick = (poId) => {
    setSelectedPoId(poId);
    setShowEditModal(true);
  };

  const handleDeleteClick = (poId) => {
    setSelectedPoId(poId);
    setShowDeleteConfirmModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedPoId(null);
  };

  const handleConfirmDelete = () => {
    console.log(`Deleting PO: ${selectedPoId}`);
    // In a real application, you would put your delete logic here
    // e.g., make an API call to delete the PO.
    setShowDeleteConfirmModal(false);
    setSelectedPoId(null);
    // You might want to re-fetch or update your poData here after deletion
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setSelectedPoId(null);
  };

  return (
    <div className={`p-5 ${showEditModal || showDeleteConfirmModal ? 'relative overflow-hidden' : ''}`}>
      {/* Overlay for blurring effect */}
      {(showEditModal || showDeleteConfirmModal) && (
        <div className="fixed inset-0 backdrop-blur-sm z-40"></div>
      )}

      <h1 className="text-3xl font-bold mb-6">MY POs</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-zinc-800 border-separate border-spacing-0">
          <thead>
            <tr className="bg-gray-200 dark:bg-zinc-950 border-b border-gray-300 dark:border-zinc-700">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">PO Number</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {poData.map((po, index) => (
              <tr
                key={po.id}
                className={`text-start
                  ${index === poData.length - 1 ? '' : 'border-b border-gray-200 dark:border-zinc-700 '}
                  ${index % 2 === 0
                    ? 'bg-white dark:bg-zinc-800'
                    : 'bg-gray-100 dark:bg-zinc-900'
                  }
                `}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{po.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-4">
                    <FaEdit
                      className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 cursor-pointer text-lg"
                      title="Edit"
                      onClick={() => handleEditClick(po.id)}
                    />
                    <FaTrashAlt
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 cursor-pointer text-lg"
                      title="Delete"
                      onClick={() => handleDeleteClick(po.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Pop-up Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[100000] ">
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl p-6 max-w-fit mx-auto relative transform transition-all sm:my-8 sm:align-middle sm:w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Edit PO: {selectedPoId}</h2>
            <button
              onClick={handleCloseEditModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              title="Close"
            >
              <FaTimes className="text-xl" />
            </button>
            {/* Your edit form/content will go here */}
            <div className="mt-4 p-4 border border-gray-300 dark:border-zinc-600 rounded-md bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-200">
              
              {/* Old PO Details */}
              < UserEditPO  />

            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseEditModal}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Pop-up Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-700 rounded-lg shadow-xl p-6 w-full max-w-sm mx-auto relative transform transition-all sm:my-8 sm:align-middle sm:w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Confirm Deletion</h2>
            <p className="text-gray-700 dark:text-gray-200">Are you sure you want to delete PO **{selectedPoId}**?</p>
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