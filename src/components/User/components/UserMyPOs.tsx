import React from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const UserMyPOs = () => {
  const poData = [
    { id: 'PO001' },
    { id: 'PO002' },
    { id: 'PO003' },
    { id: 'PO004' }, // Added more data to better demonstrate alternating rows
    { id: 'PO005' },
  ];

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-6">MY POs</h1>

      <div className="overflow-x-auto">
        {/* Table will take full width of its container */}
        <table className="min-w-full bg-white dark:bg-zinc-800 border-separate border-spacing-0">
          <thead>
            {/* Header with specified background colors for light and dark mode */}
            <tr className="bg-gray-200 dark:bg-zinc-950 border-b border-gray-300 dark:border-zinc-700">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">PO Number</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {poData.map((po, index) => (
              <tr
                key={po.id}
                // Alternating row colors for light and dark mode
                className={`text-start
                  ${index === poData.length - 1 ? '' : 'border-b border-gray-200 dark:border-zinc-700 '}
                  ${index % 2 === 0
                    ? 'bg-white dark:bg-zinc-800' // Even rows (0, 2, 4...)
                    : 'bg-gray-100 dark:bg-zinc-900' // Odd rows (1, 3, 5...)
                  }
                `}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{po.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-4">
                    <FaEdit className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 cursor-pointer text-lg" title="Edit" />
                    <FaTrashAlt className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 cursor-pointer text-lg" title="Delete" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserMyPOs;