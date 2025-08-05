import React, { useState, useEffect } from "react";
import { MdPrint } from "react-icons/md";
import { useDispatch } from "react-redux";
import { updateOrderAsync } from "../../../store/Slice/orderSlice";
import { toast } from "react-toastify";

interface Product {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    remark?: string;
}

interface User {
    username: string;
    employeeId: string;
    userId?: string;
}

interface Order {
    _id: string;
    orderNumber: string;
    createdAt: string;
    clientName: string;
    companyName: string;
    address: string;
    zipCode: string;
    contact: string;
    gstNumber: string;
    estimatedDispatchDate: string;
    status: "pending" | "completed" | "delayed" | "rejected";
    products: Product[];
    generatedBy: User;
    orderThrough: User;
}

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

    useEffect(() => {
        if (order) {
            setFormData({
                clientName: order.clientName || "",
                companyName: order.companyName || "",
                address: order.address || "",
                zipCode: order.zipCode || "",
                contact: order.contact || "",
                gstNumber: order.gstNumber || "",
                estimatedDispatchDate: order.estimatedDispatchDate || "",
                status: order.status || "pending",
                products: order.products || [],
                generatedBy: {
                    username: order.generatedBy?.username || "",
                    employeeId: order.generatedBy?.employeeId || "",
                    userId: order.generatedBy?.userId || "",
                },
                orderThrough: {
                    username: order.orderThrough?.username || "",
                    employeeId: order.orderThrough?.employeeId || "",
                },
            });
        }
    }, [order]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        // Check if the input is for a product
        if (name.startsWith("products")) {
            const [, index, field] = name.match(/\[(\d+)\]\.(.*)/) || [];
            if (index && field) {
                setFormData((prev) => {
                    const updatedProducts = [...prev.products];
                    updatedProducts[Number(index)] = {
                        ...updatedProducts[Number(index)],
                        [field]: field === "price" || field === "quantity" ? parseFloat(value) || 0 : value,
                    };
                    return {
                        ...prev,
                        products: updatedProducts,
                    };
                });
            }
        } else {
            // Handle non-product inputs
            setFormData((prev) => {
                const keys = name.split(".");
                if (keys.length === 2) {
                    const [parent, child] = keys;
                    return {
                        ...prev,
                        [parent]: {
                            ...(prev as any)[parent],
                            [child]: value,
                        },
                    };
                }
                return {
                    ...prev,
                    [name]: value,
                };
            });
        }
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
            await dispatch(updateOrderAsync({ orderId: order._id, payload: formData }) as any);
            onClose();
            toast.success("Order updated successfully!")
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
            className="w-full lg:max-w-4xl max-h-full overflow-y-auto no-scrollbar rounded-xl bg-white p-4 lg:p-10 flex flex-col dark:text-white dark:bg-zinc-900 mx-auto"
        >
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <span className="text-xl lg:text-2xl font-bold text-center md:text-left mb-4 md:mb-0">
                    Purchase Order
                </span>
                <div className="text-right flex flex-col w-full md:w-auto">
                    {/* The PO Number and Order Date are now static text */}
                    <span className="text-xs font-semibold">PO Number</span>
                    <span className="text-blue-600 underline text-lg font-semibold font-mono mb-2">
                        {order.orderNumber || "N/A"}
                    </span>
                    <span className="text-xs font-semibold">
                        Order Date: <span className="font-bold">{formatDate(order.createdAt)}</span>
                    </span>
                    <span className="text-xs font-semibold mt-2">
                        Estimated Dispatch Date: <span>{formData.estimatedDispatchDate.split('T')[0]}</span>
                        <input
                            type="date"
                            name="estimatedDispatchDate"
                            value={formData.estimatedDispatchDate}
                            onChange={handleInputChange}
                            className="font-bold max-w-fit text-end border rounded px-2 py-1 dark:bg-zinc-800 dark:text-white mt-1"
                        />
                    </span>
                    <span className="text-xs my-2">
                        <span
                            // name="status"
                            // value={formData.status}
                            // onChange={handleInputChange}
                            className={`font-semibold rounded-full px-2 py-1 text-xs text-white uppercase ${formData.status === "completed"
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
                            {formData.status}
                        </span>
                    </span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between mt-4 gap-4">
                <div className="flex flex-col text-sm text-left px-2 py-4 border rounded-md dark:bg-zinc-800 lg:w-1/2">
                    <span className="font-mono font-semibold text-lg mb-2">Generated By</span>
                    <img
                        src="/images/user-pic.png"
                        className="w-10 bg-gray-100 dark:bg-zinc-900 rounded-full mb-2"
                        alt="Generated By"
                    />
                    <span className="mb-1">
                        Employee Name: <span className="font-semibold">{formData.generatedBy?.username || "N/A"}</span>
                    </span>
                    <span className="mb-1">
                        Employee Id:{" "}
                        <span className="font-semibold text-blue-500 underline">
                            {formData.generatedBy?.employeeId || "N/A"}
                        </span>
                    </span>
                    <span>Designation: <span className="font-semibold">N/A</span></span>
                </div>

                <div className="flex flex-col text-sm text-left px-2 py-4 border rounded-md dark:bg-zinc-800 lg:w-1/2">
                    <span className="font-mono font-semibold text-lg mb-2">Order Through</span>
                    <img
                        src="/images/user-pic.png"
                        className="w-10 bg-gray-100 dark:bg-zinc-900 rounded-full mb-2"
                        alt="Order Through"
                    />
                    <span className="mb-1">
                        Employee Name: <span className="font-semibold">{formData.orderThrough?.username || "N/A"}</span>
                    </span>
                    <span className="mb-1">
                        Employee Id:{" "}
                        <span className="font-semibold text-blue-500 underline">
                            {formData.orderThrough?.employeeId || "N/A"}
                        </span>
                    </span>
                    <span>Designation: <span className="font-semibold">N/A</span></span>
                </div>
            </div>

            <div className="bg-gray-100 dark:bg-zinc-800 text-left px-2 py-4 text-sm mt-6 rounded-md">
                <span className="font-mono font-semibold text-lg mb-4 block">Company Details</span>
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="flex flex-col w-full lg:w-1/2">
                        <label className="flex flex-col mb-2">
                            Client Name:
                            <input
                                name="clientName"
                                value={formData.clientName}
                                onChange={handleInputChange}
                                className="font-semibold border rounded px-2 py-1 dark:bg-zinc-800 dark:text-white mt-1 w-full"
                            />
                        </label>
                        <label className="flex flex-col mb-2">
                            Company Name:
                            <input
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleInputChange}
                                className="font-semibold border rounded px-2 py-1 dark:bg-zinc-800 dark:text-white mt-1 w-full"
                            />
                        </label>
                        <label className="flex flex-col mb-2">
                            Address:
                            <input
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="font-semibold border rounded px-2 py-1 break-words dark:bg-zinc-800 dark:text-white mt-1 w-full"
                            />
                        </label>
                    </div>
                    <div className="flex flex-col w-full lg:w-1/2">
                        <label className="flex flex-col mb-2">
                            Zipcode:
                            <input
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                                className="font-semibold border rounded px-2 py-1 dark:bg-zinc-800 dark:text-white mt-1 w-full"
                            />
                        </label>
                        <label className="flex flex-col mb-2">
                            Contact No.:
                            <input
                                name="contact"
                                value={formData.contact}
                                onChange={handleInputChange}
                                className="font-semibold border rounded px-2 py-1 dark:bg-zinc-800 dark:text-white mt-1 w-full"
                            />
                        </label>
                        <label className="flex flex-col mb-2">
                            GST No.:
                            <input
                                name="gstNumber"
                                value={formData.gstNumber}
                                onChange={handleInputChange}
                                className="font-semibold border rounded px-2 py-1 dark:bg-zinc-800 dark:text-white mt-1 w-full"
                            />
                        </label>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto w-full mt-6">
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
                        {formData.products && formData.products.length > 0 ? (
                            formData.products.map((product, index) => (
                                <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-zinc-950">
                                    <td className="px-4 py-2 border">
                                        <textarea
                                            name={`products[${index}].name`}
                                            value={product.name || ""}
                                            onChange={handleInputChange}
                                            className="w-full bg-transparent dark:text-white"
                                        />
                                    </td>
                                    <td className="px-4 py-2 border">
                                        <input
                                            type="number"
                                            name={`products[${index}].price`}
                                            value={product.price || 0}
                                            onChange={handleInputChange}
                                            className="w-full bg-transparent dark:text-white"
                                        />
                                    </td>
                                    <td className="px-4 py-2 border">
                                        <input
                                            type="number"
                                            name={`products[${index}].quantity`}
                                            value={product.quantity || ""}
                                            onChange={handleInputChange}
                                            className="w-full bg-transparent dark:text-white"
                                        />
                                    </td>
                                    <td className="px-4 py-2 border">
                                        <textarea
                                            name={`products[${index}].remark`}
                                            value={product.remark || ""}
                                            onChange={handleInputChange}
                                            className="w-full bg-transparent dark:text-white"
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-4 py-2 border text-center">
                                    No products available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
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