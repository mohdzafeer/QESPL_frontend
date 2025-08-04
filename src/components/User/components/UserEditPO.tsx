import React, { useState } from "react";
import { MdPrint } from "react-icons/md";
import { useDispatch } from "react-redux";
import { updateOrderAsync } from "../../../store/Slice/orderSlice";
import { toast } from "react-toastify";


interface UserEditPOProps {
  order: Order | null;
  onClose: () => void;
}

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "N/A";
  }
};

const UserEditPO: React.FC<UserEditPOProps> = ({ order, onClose }) => {
  console.log(order, "shariq khan check details....")
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    clientName: order?.clientName || "",
    companyName: order?.companyName || "",
    address: order?.address || "",
    zipCode: order?.zipCode || "",
    contact: order?.contact || "",
    gstNumber: order?.gstNumber || "",
    estimatedDispatchDate: order?.estimatedDispatchDate || "",
    status: order?.status || "pending",
    products: order?.products || [],
    generatedBy: {
      username: order?.generatedBy?.username || "",
      employeeId: order?.generatedBy?.employeeId || "",
      userId: order?.generatedBy?.userId || "",
    },
    orderThrough: {
      username: order?.orderThrough?.username || "",
      employeeId: order?.orderThrough?.employeeId || "",
    },
  });
  console.log(formData, "check")

  const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  const match = name.match(/^(\w+)\[(\d+)\]\.(\w+)$/); // e.g., products[0].name

  if (match) {
    const [, arrayName, index, field] = match;
    const idx = parseInt(index, 10);

    setFormData((prev) => {
      const updatedArray = [...(prev[arrayName] || [])];
      updatedArray[idx] = {
        ...updatedArray[idx],
        [field]: value,
      };

      return {
        ...prev,
        [arrayName]: updatedArray,
      };
    });
  } else {
    // fallback to object or root-level update
    const keys = name.split(".");
    if (keys.length === 2) {
      const [parent, child] = keys;
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }
};


  const handleProductChange = (e, index) => {
    const { name, value } = e.target;
    const updatedProducts = [...formData.products];
    const field = name.split('.').pop(); // "name" from "products[0].name"
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      products: updatedProducts,
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order?._id) {
      toast.error("Invalid order selected", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    try {
      await dispatch(updateOrderAsync({ orderId: order._id, payload: formData }))
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error || "Failed to update order", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (!order) {
    return <div className="p-4 text-center">No order selected</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="lg:w-4xl xl:w-4xl w-sm lg:max-h-[600px] xl:max-h-[600px] max-h-[700px] overflow-y-auto overflow-x-hidden no-scrollbar rounded-xl bg-white py-5 px-10 flex flex-col dark:text-white dark:bg-zinc-900"
    >
      <div className="flex justify-center flex-col xl:flex-row lg:flex-row md:flex-row">
        <span className="lg:text-start xl:text-start md:text-start text-center min-w-fit lg:text-xl xl:text-2xl text-2xl font-bold mt-5">
          Purchase Order
        </span>
        <div className="text-end flex flex-col w-full mt-5">
          <span className="text-xs font-semibold">PO Number</span>
          <span className="text-blue-600 underline text-lg font-semibold font-mono">
            {order.orderNumber || "N/A"}
          </span>
          <span className="text-xs font-semibold mt-2">
            Order Date: <span className="font-bold">{formatDate(order.createdAt)}</span>
          </span>
          <span className="text-xs font-semibold">
            Estimated Dispatch Date:
            <input
              type="date"
              name="estimatedDispatchDate"
              value={formData.estimatedDispatchDate}
              onChange={handleInputChange}
              className="font-bold max-w-fit text-end border rounded px-2 py-1 dark:bg-zinc-800 dark:text-white"
            />
          </span>
          <span className="text-xs my-2">
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className={`font-semibold rounded-full px-2 py-1 text-xs text-white ${formData.status === "completed"
                  ? "bg-green-500"
                  : formData.status === "pending"
                    ? "bg-yellow-500"
                    : formData.status === "delayed"
                      ? "bg-orange-500"
                      : formData.status === "rejected"
                        ? "bg-red-500"
                        : "bg-gray-500"
                }`}
            >
              <option value="pending">PENDING</option>
              <option value="completed">COMPLETED</option>
              <option value="delayed">DELAYED</option>
              <option value="rejected">REJECTED</option>
            </select>
          </span>
        </div>
      </div>

      <div className="flex justify-between mt-1 gap-4 flex-col lg:flex-row xl:flex-row">
        <div className="flex flex-col text-sm text-start dark:bg-zinc-900 px-2 py-4 lg:pr-60 xl:pr-60">
          <span className="font-mono font-semibold min-w-full text-lg">Generated By</span>
          <img
            src="/images/user-pic.png"
            className="w-10 bg-gray-100 dark:bg-zinc-900 rounded-full"
            alt="Generated By"
          />
          <span className="flex w-full">
            <span className="min-w-fit">Employee Name: </span>
            <span className="font-semibold">{order.generatedBy?.username || "N/A"}</span>
          </span>
          <span>
            Employee Id:{" "}
            <span className="font-semibold text-blue-500 underline">
              {order.generatedBy?.employeeId || "N/A"}
            </span>
          </span>
          <span>Designation: <span className="font-semibold">N/A</span></span>
        </div>

        <div className="flex flex-col text-sm text-start dark:bg-zinc-900 px-2 py-4">
          <span className="font-mono font-semibold text-lg min-w-sm">Order Through</span>
          <img
            src="/images/user-pic.png"
            className="w-10 bg-gray-100 dark:bg-zinc-900 rounded-full"
            alt="Order Through"
          />
          <span>
            Employee Name: <span className="font-semibold">{order.orderThrough?.username || "N/A"}</span>
          </span>
          <span>
            Employee Id:{" "}
            <span className="font-semibold text-blue-500 underline">
              {order.orderThrough?.employeeId || "N/A"}
            </span>
          </span>
          <span>Designation: <span className="font-semibold">N/A</span></span>
        </div>
      </div>

      <div className="bg-gray-100 dark:bg-zinc-900 text-start px-2 py-4 text-sm">
        <span className="font-mono font-semibold text-lg text-start">Company Details</span>
        <div className="flex justify-between flex-col lg:flex-row xl:flex-row overflow-x-auto">
          <div className="flex flex-col text-start">
            <span>
              Client Name:
              <input
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                className="font-semibold border rounded px-2 py-1 dark:bg-zinc-800 dark:text-white"
              />
            </span>
            <span>
              Company Name:
              <input
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="font-semibold border rounded px-2 py-1 dark:bg-zinc-800 dark:text-white"
              />
            </span>
          </div>
          <div className="flex flex-col text-start min-w-sm">
            <span className="max-w-sm">
              Address:
              <input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="font-semibold border rounded px-2 py-1 break-words dark:bg-zinc-800 dark:text-white"
              />
            </span>
            <span>
              Zipcode:
              <input
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="font-semibold border rounded px-2 py-1 dark:bg-zinc-800 dark:text-white"
              />
            </span>
            <span>
              Contact No.:
              <input
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                className="font-semibold border rounded px-2 py-1 dark:bg-zinc-800 dark:text-white"
              />
            </span>
            <span>
              GST No.:
              <input
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleInputChange}
                className="font-semibold border rounded px-2 py-1 dark:bg-zinc-800 dark:text-white"
              />
            </span>
          </div>
        </div>
      </div>

      <table className="table-auto w-full text-left border-collapse text-sm">
        <thead className="bg-gray-100 dark:bg-zinc-950">
          <tr>
            <th className="px-4 py-2 border">Product Name</th>
            <th className="px-4 py-2 border">Price</th>
            <th className="px-4 py-2 border">Qty</th>
            <th className="px-4 py-2 border">Remark</th>
          </tr>
        </thead>
        <tbody>
          {order.products && order.products.length > 0 ? (
            order.products.map((product, index) => (
              <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-zinc-950">
                <td className="px-4 py-2 border">
                  <input
                    name={`products[${index}].name`}
                    value={formData.products[index]?.name || ""}
                    onChange={(e) => handleProductChange(e, index)} />
                </td>
                <td className="px-4 py-2 border">₹{product.price?.toLocaleString("en-IN") || "0"}/-</td>
                <td className="px-4 py-2 border"><input
                    name={`products[${index}].quantity`}
                    value={formData.products[index]?.quantity || ""}
                    onChange={(e) => handleProductChange(e, index)} /></td>
                <td className="px-4 py-2 border"><input
                    name={`products[${index}].remark`}
                    value={formData.products[index]?.remark || ""}
                    onChange={(e) => handleProductChange(e, index)} /></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-4 py-2 border text-center">No products available</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-center items-center">
        <button
          type="button"
          className="px-3 py-2 bg-blue-500 mt-5 rounded-lg text-white text-sm max-w-fit flex items-center gap-4 font-semibold cursor-pointer hover:bg-blue-300 duration-300 active:bg-blue-600"
        >
          Print <MdPrint />
        </button>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-zinc-600 dark:hover:bg-zinc-500 dark:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default UserEditPO;
