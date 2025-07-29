import React from "react";
import { MdPrint } from "react-icons/md";
import { handleDownload } from "../../../Admin/component/downlaod";

// --- INTERFACES: COPIED DIRECTLY FROM DashboardPOs.tsx for consistency ---
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

interface OrderThrough{
  username:string,
  employeeId:string
}


interface Order {
  _id: string;
  orderNumber: string;
  clientName: string;
  companyName: string;
  gstNumber?: string;
  contact: string; // Ensure this is string
  address: string;
  zipCode: string; // Ensure this is string
  products: Product[];
  estimatedDispatchDate?: string; // Optional
  generatedBy: GeneratedBy;
  // orderThrougth?: string; // Optional
  // department?: string; // Optional
  status: string;
  isdeleted: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
  // createdBy?: CreatedBy; // Optional
  deletedAt?: string; // Optional
  // formGeneratedBy?: string; // Some orders have this field
  orderThrough:OrderThrough
}
// --- END INTERFACES ---

// Define props for PODetails component
interface PODetailsProps {
  orderData: Order; // The specific order object to display
  onClose: () => void; // Function to close the modal
}

const PODetails: React.FC<PODetailsProps> = ({ orderData, onClose }) => {
  // If no orderData is provided, render a fallback message or loading state
  if (!orderData) {
    return (
      <div className="bg-white p-5 rounded-lg shadow-lg text-center">
        <p>No order data available.</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">Close</button>
      </div>
    );
  }

  // Helper function to format dates from ISO string to locale date string
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      // Ensure date parsing is robust, especially for different date formats
      const date = new Date(dateString);
      if (isNaN(date.getTime())) { // Check for invalid date
        return 'Invalid Date';
      }
      return date.toLocaleDateString(); // Formats date based on user's locale
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return 'Invalid Date';
    }
  };

  // Helper to get generatedBy name (handles both 'user.username' and 'name' properties)
  // const getGeneratedByName = (generatedBy: GeneratedBy) => {
  //   return generatedBy?.username || generatedBy.name || 'N/A';
  // };

  return (
    <div className="lg:w-4xl xl:w-4xl w-sm lg:max-h-[600px] xl:max-h-[700px] max-h-[700px] overflow-y-auto overflow-x-hidden no-scrollbar rounded-xl bg-white dark:bg-zinc-900 dark:text-white py-5 px-10 flex flex-col">
      {/* Close button for the modal */}
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold z-10"
        onClick={onClose} // Use the onClose prop to close the modal
        aria-label="Close"
      >
        &times;
      </button>

      {/* PO Details Header Section */}
      <div className="flex justify-center flex-col xl:flex-row lg:flex-row md:flex-row ">
        <span className="lg:text-start xl:text-start md:text-start text-center min-w-fit lg:text-xl xl:text-2xl text-2xl font-bold mt-5">
          Purchase Order
        </span>
        <div className="text-end flex flex-col w-full mt-5">
          <span className="text-xs font-semibold">PO Number</span>
          <span className="text-blue-600 underline text-lg font-semibold font-mono">
            #{orderData.orderNumber} {/* Display dynamic PO Number */}
          </span>
          <span className="text-xs font-semibold mt-2">
            Order Date : <span className="font-bold">{formatDate(orderData.createdAt)}</span> {/* Display dynamic Order Date */}
          </span>
          <span className="text-xs font-semibold">
            Estimated Dispatch Date :{" "}
            <span className="font-bold">{formatDate(orderData.estimatedDispatchDate)}</span> {/* Display dynamic Estimated Dispatch Date */}
          </span>
          <span className="text-xs my-2">
            <span
              className={`font-semibold rounded-full px-2 py-1 text-xs text-white ${
                orderData.status === "completed"
                  ? "bg-green-500"
                  : orderData.status === "pending"
                  ? "bg-yellow-500"
                  : orderData.status === "delayed"
                  ? "bg-orange-500"
                  : orderData.status === "rejected"
                  ? "bg-red-500"
                  : "bg-gray-500" // Default color for unknown status
              }`}
            >
              {orderData.status?.toUpperCase() || 'N/A'} {/* Display dynamic Status, uppercase */}
            </span>
          </span>
        </div>
      </div>

      {/* Generated by and Order through Sections */}
      <div className="flex justify-between mt-1 gap-4 flex-col lg:flex-row xl:flex-row ">
        {/* Generated By Details */}
        <div className="flex flex-col text-sm text-start px-2 py-4 lg:pr-20 xl:pr-20 ">
          <span className="font-mono font-semibold w-full text-lg">Generated By</span>
          <img
            src="/images/user-pic.png" // Static image, replace with dynamic if available in orderData
            className="w-10 bg-gray-100 rounded-full"
            alt="Generated By User Profile"
          />
          <span>
            Employee Name : <span className="font-semibold">{orderData.generatedBy?.username}</span> {/* Dynamic Employee Name */}
          </span>
          <span>
            Employee Id :{" "}
            <span className="font-semibold text-blue-500 underline">
              {orderData.generatedBy.employeeId ? orderData.generatedBy.employeeId : '_'} {/* Dynamic Employee ID */}
            </span>
          </span>
          {/* Assuming 'Designation' is not directly in your Order model for generatedBy */}
          {/* If it is, uncomment and link to orderData.generatedBy.designation */}
          {/* <span>
            Designation : <span className="font-semibold">designation12345</span>
          </span> */}
        </div>

        {/* Order through Details (using createdBy data from your backend response) */}
        <div className="flex flex-col text-sm text-start px-2 py-4">
          <span className="font-mono font-semibold text-lg min-w-sm">
            Order through
          </span>
          <img
            src="/images/user-pic.png" // Static image, replace with dynamic if available
            className="w-10 bg-gray-100 rounded-full"
            alt="Order Through User Profile"
          />
          {orderData.orderThrough ? (
            <>
              <span>
                Employee Name : <span className="font-semibold">{orderData.orderThrough.username}</span>
              </span>
              <span>
                Employee Id :{" "}
                <span className="font-semibold text-blue-500 underline">
                  {orderData.orderThrough.employeeId ? orderData.orderThrough.employeeId : '_'} {/* Dynamic Employee ID */}
                </span>
              </span>
              {/* Assuming 'Designation' is not directly in your Order model for createdBy */}
              {/* <span>
                Designation : <span className="font-semibold">designation123</span>
              </span> */}
            </>
          ) : (
            <span>N/A (Created By data missing)</span>
          )}
        </div>
      </div>

      {/* Company Details Section */}
      <div className="bg-gray-100 dark:bg-zinc-800 text-start px-2 py-4 text-sm mt-4 rounded-lg">
        <span className="font-mono font-semibold text-lg text-start">
          Company Details
        </span>
        <div className="flex justify-between flex-col lg:flex-row xl:flex-row overflow-x-auto">
          <div className="flex flex-col text-start">
            <span>
              Client Name : <span className="font-semibold">{orderData.clientName}</span> {/* Dynamic Client Name */}
            </span>
            <span>
              Company Name :{" "}
              <span className="font-semibold ">
                {orderData.companyName ? orderData.companyName : '_'} {/* Dynamic Company Name */}
              </span>
            </span>
            <span className="max-w-sm flex gap-2">
              <div className="min-w-fit">Address : </div>
              <span className="font-semibold break-words">{orderData.address ? orderData.address : '_'}</span> {/* Dynamic Address */}
            </span>
          </div>

          <div className="flex flex-col text-start min-w-sm ">
            <span>
              Zipcode : <span className="font-semibold">{orderData.zipCode ? orderData.zipCode : '_'}</span> {/* Dynamic Zipcode */}
            </span>
            <span>
              Contact No. : <span className="font-semibold">{orderData.contact ? orderData.contact : '_'}</span> {/* Dynamic Contact No. */}
            </span>
            <span>
              GST No. :{" "}
              <span className="font-semibold text-blue-500 underline">
                {orderData.gstNumber || '_'} {/* Dynamic GST No. */}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Product Info Table */}
      <table className="table-auto w-full text-left border-collapse text-sm mt-4">
        <thead className="bg-gray-100 dark:bg-zinc-900 dark:text-white">
          <tr>
            <th className="px-4 py-2 border">Product Name</th>
            <th className="px-4 py-2 border">Price</th>
            <th className="px-4 py-2 border">Qty</th>
            <th className="px-4 py-2 border">Remark</th>
          </tr>
        </thead>
        <tbody>
          {orderData.products && orderData.products.length > 0 ? (
            orderData.products.map((product) => (
              <tr key={product._id || product.name} className="hover:bg-gray-50 dark:hover:bg-zinc-800 ">
                <td className="px-4 py-2 border">{product.name}</td>
                <td className="px-4 py-2 border">₹{product.price?.toLocaleString()}/-</td> {/* Format price with locale string */}
                <td className="px-4 py-2 border">{product.quantity}</td>
                <td className="px-4 py-2 border">
                  {product.remark || 'N/A'} {/* Display dynamic Remark */}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-4 py-2 border text-center text-gray-500">No products listed.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Print Button */}
      <div className="flex justify-center items-center mt-4">
        <button onClick={()=>handleDownload(orderData)} className="px-3 py-2 bg-blue-500 rounded-lg text-white text-sm max-w-fit flex items-center gap-4 font-semibold cursor-pointer hover:bg-blue-300 duration-300 active:bg-blue-600">
          Print <MdPrint />
        </button>
      </div>
    </div>
  );
};

export default PODetails;
