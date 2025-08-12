import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../../store/store";
import {
  clearMessages,
  createOrderAsync,
  fetchLastPONumberAsync,
  fetchOrdersAsync,
  fetchPendingPOCountAsync,
  fetchTotalPOCountAsync,
} from "../../../../store/Slice/orderSlice";
import { toast } from "react-toastify";
import { motion } from "motion/react";

type UserCreatePOFormProps = {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  onOrderCreated: () => void;
};

type Product = {
  id: number;
  name: string;
  quantity: number;
  price: number;
  remark: string;
};

type OrderFormData = {
  orderNumber: string;
  fullOrderNumber: string;
  orderDate: string;
  invoiceNumber: string;
  clientName: string;
  companyName: string;
  gstNumber: string;
  address: string;
  zipCode: string;
  orderThrough: {
    username: string;
    employeeId: string;
  };
  contactNumber: string;
  products: Product[];
  generatedBy: {
    username: string;
    employeeId: string;
  };
  estimatedDispatchDate?: string;
};

const UserCreatePOForm: React.FC<UserCreatePOFormProps> = ({
  setShowForm,
  onOrderCreated,
}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { status, error, message } = useSelector(
    (state: RootState) => state.orders
  );

  const lastPONumber = useSelector(
    (state: RootState) => state.orders.lastPONumber
  );
  const newPONumber =
    lastPONumber && !isNaN(parseInt(lastPONumber.split("/")[0]))
      ? parseInt(lastPONumber.split("/")[0]) + 1
      : 1;

  useEffect(() => {
    dispatch(fetchLastPONumberAsync());
  }, [dispatch]);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getMonthAbbreviation = (date: Date) => {
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    return months[date.getMonth()];
  };

  const [formData, setFormData] = useState<OrderFormData>({
    orderNumber: "",
    fullOrderNumber: "",
    orderDate: getTodayDate(),
    invoiceNumber: "",
    clientName: "",
    companyName: "",
    gstNumber: "",
    address: "",
    zipCode: "",
    orderThrough: { username: "", employeeId: "" },
    generatedBy: {
      username: user?.username || "",
      employeeId: user?.employeeId || "Not Available",
    },
    contactNumber: "",
    products: [{ id: 1, name: "", quantity: 1, price: 0, remark: "" }],
    estimatedDispatchDate: "",
  });

  // Set default order number when lastPONumber is fetched
  useEffect(() => {
    if (lastPONumber) {
      const today = new Date();
      const currentMonthAbbr = getMonthAbbreviation(today);
      const currentYearShort = today.getFullYear() % 100;
      setFormData((prev) => ({
        ...prev,
        orderNumber: String(newPONumber),
        fullOrderNumber: `${newPONumber}/QESPL/${currentMonthAbbr}/${currentYearShort}`,
      }));
    }
  }, [lastPONumber]);

  // Update fullOrderNumber whenever orderNumber changes
  useEffect(() => {
    if (formData.orderNumber) {
      const today = new Date();
      const currentMonthAbbr = getMonthAbbreviation(today);
      const currentYearShort = today.getFullYear() % 100;
      setFormData((prev) => ({
        ...prev,
        fullOrderNumber: `${prev.orderNumber}/QESPL/${currentMonthAbbr}/${currentYearShort}`,
      }));
    }
  }, [formData.orderNumber]);

  useEffect(() => {
    if (status === "succeeded" && message) {
      toast.success(message, { toastId: "create-success" });
      dispatch(clearMessages());
      setShowForm(false);
    } else if (status === "failed" && error) {
      toast.error(error, { toastId: "create-error" });
      dispatch(clearMessages());
    }
  }, [status, message, error, dispatch, setShowForm]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name.includes("orderThrough.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        orderThrough: { ...prev.orderThrough, [field]: value },
      }));
    } else if (name.includes("generatedBy.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        generatedBy: { ...prev.generatedBy, [field]: value },
      }));
    } else if (name === "orderNumber") {
      if (/^\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleProductChange = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((product) =>
        product.id === id
          ? {
            ...product,
            [name]:
              name === "quantity" || name === "price"
                ? Number(value)
                : value,
          }
          : product
      ),
    }));
  };

  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        { id: prev.products.length + 1, name: "", quantity: 1, price: 0, remark: "" },
      ],
    }));
  };

  const removeProduct = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((product) => product.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    const sequentialOrderNum = parseInt(formData.orderNumber, 10);
    if (isNaN(sequentialOrderNum) || sequentialOrderNum <= 0) {
      toast.error("Please enter a valid Order Number.");
      setLoading(false);
      return;
    }

    const apiOrderData = {
      clientName: formData.clientName,
      companyName: formData.companyName,
      gstNumber: formData.gstNumber,
      contact: formData.contactNumber,
      address: formData.address,
      zipCode: formData.zipCode,
      products: formData.products,
      estimatedDispatchDate: formData.estimatedDispatchDate || "",
      generatedBy: formData.generatedBy,
      orderThrough: formData.orderThrough,
      orderNumber: formData.fullOrderNumber,
      orderDate: formData.orderDate,
      invoiceNumber: formData.invoiceNumber,
      status: "pending",
      department: "default",
      isdeleted: false,
      deletedAt: null,
    };

    try {
      await dispatch(createOrderAsync(apiOrderData)).unwrap();
      onOrderCreated();
      dispatch(fetchTotalPOCountAsync());
      dispatch(fetchPendingPOCountAsync());
      setShowForm(false);
      toast.success("Order created successfully!");
    } catch {
      setLoading(false);
    }
  };

  if (!user) return <div>Please log in to access this form.</div>;

  console.log(user.employeeId, "User data in UserCreatePOForm");
  const handleClose = () => {
    setShowForm(false);
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center pt-20">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.3 } }}
        className="bg-white dark:bg-zinc-800 xl:w-8/12 w-11/12 lg:w-8/12 max-h-11/12 rounded-lg p-5 my-10 no-scrollbar overflow-y-scroll border border-black"
      >
        <div className="flex justify-between items-center w-full ">
          <h1 className="text-black text-center w-full dark:text-white font-bold  lg:text-lg xl:text-lg text-sm mb-5 uppercase">
            Create Purchasing Order
          </h1>
          <button
            className="text-gray-700 dark:text-white text-4xl px-3 py-2 rounded-lg cursor-pointer"
            onClick={handleClose}
          >
            &times;
          </button>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Section 1 : PO Details*/}
          <section className="flex flex-col gap-2 lg:text-lg xl:text-lg text-sm">
            <h1 className="text-start font-bold text-xl text-blue-500 mb-4 uppercase">
              PO DETAILS
            </h1>
            <div className="border-2 rounded-lg p-5 shadow-lg">
              {/* Order Number Input (User enters only the sequential part) */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="orderNumber"
                  id="order_number"
                  className="block pt-5 px-0 w-full lg:text-lg xl:text-lg text-sm text-[#0A2975] font-bold bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 focus:outline-none focus:border-[#0A2975] peer"
                  placeholder=" "
                  required
                  value={formData.orderNumber}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="order_number"
                  className="absolute lg:lg:text-lg xl:text-lg text-sm text-black dark:text-gray-400 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975]"
                >
                  Order Number (Sequential Part)
                  <span className="text-red-500 m-2">*</span>
                </label>
              </div>

              <div className="flex flex-col items-start">
                {formData.fullOrderNumber && (
                  <div className="mb-2 -mt-3 text-sm text-[#0A2975] font-semibold">
                    Full Order Number:{" "}
                    <span className="font-semibold">{formData.fullOrderNumber}</span>
                  </div>
                )}

                {lastPONumber && (
                  <div className="mb-5 text-xs text-gray-600">
                    Last PO Number: <span className="font-medium">{lastPONumber}</span>
                  </div>
                )}
              </div>

              {/* Order Date Input */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="date"
                  name="orderDate"
                  id="order_date"
                  className="block pt-5 px-0 w-fit lg:text-lg xl:text-lg text-sm text-[#0A2975] font-bold bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder="Order Date"
                  required
                  value={formData.orderDate}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="order_date"
                  className="absolute lg:text-lg xl:text-lg text-sm text-black dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white font-semibold "
                >
                  Order Date <span className="text-red-500 m-2">*</span>
                </label>
              </div>

              {/* Invoice No. Input */}
              {/* <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="invoiceNumber"
                  id="invoice_number"
                  className="block pt-5 px-0 w-full lg:text-lg xl:text-lg text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  // required
                  value={formData.invoiceNumber}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="invoice_number"
                  className="absolute lg:text-lg xl:text-lg text-sm text-black dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
                >
                  Invoice Number (Optional)
                </label>
              </div> */}
            </div>
          </section>

          {/* Section 2 : Order Through Details */}
          <section className="flex flex-col gap-2 lg:text-lg xl:text-lg text-sm">
            <h1 className="text-start font-bold text-xl text-blue-500 mb-4 uppercase">
              Order Through
            </h1>
            <div className="border-2 rounded-lg p-5 shadow-lg">
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="orderThrough.username"
                  id="order_through_username"
                  className="block pt-5 px-0 w-full lg:text-lg xl:text-lg text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  required
                  value={formData.orderThrough.username}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="order_through_username"
                  className="absolute lg:text-lg xl:text-lg text-sm text-black dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
                >
                  Name{" "}
                  <span className="text-red-500 m-2">*</span>
                </label>
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="orderThrough.employeeId"
                  id="order_through_employee_id"
                  className="block pt-5 px-0 w-full lg:text-lg xl:text-lg text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  // required
                  value={formData.orderThrough.employeeId}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="order_through_employee_id"
                  className="absolute lg:text-lg xl:text-lg text-sm text-black dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
                >
                  Order Through Employee ID (Optional)
                </label>
              </div>
            </div>
          </section>

          {/* Section 3 : Company Details */}
          <section className="flex flex-col gap-2 lg:text-lg xl:text-lg text-sm">
            <h1 className="text-start font-bold text-xl text-blue-500 mb-4 uppercase">
              Company Details
            </h1>
            <div className="border-2 rounded-lg p-5 shadow-lg">
              {/* Client Name Input */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="clientName"
                  id="Client_Name"
                  className="block pt-5 px-0 w-full lg:text-lg xl:text-lg text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  required
                  value={formData.clientName}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="Client_Name"
                  className="absolute lg:text-lg xl:text-lg text-sm text-black dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
                >
                  Client Name <span className="text-red-500 m-2">*</span>
                </label>
              </div>

              {/* Company Name Input */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="companyName"
                  id="Company_Name"
                  className="block pt-5 px-0 w-full lg:text-lg xl:text-lg text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  // required
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="Company_Name"
                  className="absolute lg:text-lg xl:text-lg text-sm text-black dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
                >
                  Company Name (Optional)
                </label>
              </div>
              {/* GST Number Input */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="gstNumber"
                  id="GST_Number"
                  className="block pt-5 px-0 w-full lg:text-lg xl:text-lg text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  // required
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="GST_Number"
                  className="absolute lg:text-lg xl:text-lg text-sm text-black dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
                >
                  GST Number (Optional)
                </label>
              </div>
              {/* Address Input */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="address"
                  id="Address"
                  className="block pt-5 px-0 w-full lg:text-lg xl:text-lg text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  // required
                  value={formData.address}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="Address"
                  className="absolute lg:text-lg xl:text-lg text-sm text-black dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
                >
                  Address (Optional)
                </label>
              </div>
              {/* Zipcode Input */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="zipCode"
                  id="ZIP_Code"
                  className="block pt-5 px-0 w-full lg:text-lg xl:text-lg text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  // required
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="ZIP_Code"
                  className="absolute lg:text-lg xl:text-lg text-sm text-black dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
                >
                  ZIP Code (Optional)
                </label>
              </div>
              {/* Contact Number Input */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="contactNumber"
                  id="Contact_Number"
                  className="block pt-5 px-0 w-full lg:text-lg xl:text-lg text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  // required
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="Contact_Number"
                  className="absolute lg:text-lg xl:text-lg text-sm text-black dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
                >
                  Contact Number (Optional)
                </label>
              </div>
            </div>
          </section>

          {/* Product Details Section */}
          <section className="flex flex-col gap-4 lg:text-lg xl:text-lg text-sm">
            <h1 className="text-start font-bold text-xl text-blue-500 mb-4 uppercase">
              Product Details
            </h1>

            {formData.products.map((product, index) => (
              <div
                key={product.id}
                className="border-b pb-4 relative border-2 rounded-lg p-5 shadow-lg"
              >
                {/* Product Name Input */}
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    list={`product-options-${index}`}
                    name="name"
                    id={`Product_Name_${index}`}
                    className="block pt-5 px-0 w-full lg:text-lg xl:text-lg text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                    placeholder=" "
                    required
                    value={product.name}
                    onChange={(e) => handleProductChange(product.id, e)}
                  />
                  <label
                    htmlFor={`Product_Name_${index}`}
                    className="absolute lg:text-lg xl:text-lg text-sm text-black dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
                  >
                    Product Name <span className="text-red-500 m-2">*</span>
                  </label>

                  {/* Dropdown options for Product Name */}
                  <datalist id={`product-options-${index}`}>
                    <option value="Weather Station" />
                    <option value="AQMS" />
                    <option value="Water Analyzer" />
                    <option value="Flowmeter" />
                    <option value="Piezometer" />
                    <option value="RTU" />
                    <option value="Stack" />
                    <option value="CEMS" />
                    <option value="SPM Analyzer" />
                    <option value="Noise Monitoring System" />
                    <option value="Tribo Electric SPM" />
                  </datalist>
                </div>

                {/* Quantity & Price Inputs */}
                <div className="relative z-0 w-full mb-5 flex justify-between gap-4">
                  <div className="relative w-1/5">
                    <input
                      type="number"
                      name="quantity"
                      id={`Product_Quantity_${index}`}
                      className="block pt-5 px-0 w-full lg:text-lg xl:text-lg text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                      placeholder=" "
                      required
                      value={product.quantity.toString()} // Convert number to string for input value
                      onChange={(e) => handleProductChange(product.id, e)}
                    />
                    <label
                      htmlFor={`Product_Quantity_${index}`}
                      className="absolute lg:text-lg xl:text-lg text-sm text-black dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
                    >
                      Qty
                    </label>
                  </div>

                  <div className="relative w-3/5">
                    <input
                      type="number"
                      name="price"
                      id={`Product_Price_${index}`}
                      className="block pt-5 px-0 w-full lg:text-lg xl:text-lg text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                      placeholder=" "
                      required
                      value={product.price.toString()} // Convert number to string for input value
                      onChange={(e) => handleProductChange(product.id, e)}
                    />
                    <label
                      htmlFor={`Product_Price_${index}`}
                      className="absolute lg:text-lg xl:text-lg text-sm text-black dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
                    >
                      Price
                    </label>
                  </div>
                </div>

                {/* Remark Input */}
                <div className="relative z-0 w-full mb-5 group">
                  <textarea
                    // type="text"
                    name="remark"
                    id={`Remark_${index}`}
                    className="block pt-5 px-0 w-full lg:text-lg xl:text-lg text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                    placeholder=" "
                    // required
                    value={product.remark}
                    onChange={(e) => handleProductChange(product.id, e)}
                  />
                  <label
                    htmlFor={`Remark_${index}`}
                    className="absolute lg:text-lg xl:text-lg text-sm text-black dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
                  >
                    Remark (Optional)
                  </label>
                </div>

                {/* Dispatch Date Input */}

                {/* Delete Button */}
                {formData.products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProduct(product.id)}
                    className="absolute top-0 right-0 text-red-600 hover:text-red-700 text-xl hover:bg-red-200 p-2 duration-300 cursor-pointer mr-5"
                  >
                    <MdDeleteOutline />
                  </button>
                )}
              </div>
            ))}
            <div className="relative z-0 w-full mb-5 group ">
              <input
                type="date"
                name="estimatedDispatchDate"
                id={"estimatedDispatchDate"}
                className="block pt-5 px-0 w-fit= lg:text-lg xl:text-lg text-sm text-blue-800 font-bold bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer "
                required
                value={formData.estimatedDispatchDate}
                onChange={handleInputChange}
              />
              <label
                htmlFor={"estimatedDispatchDate"}
                className="absolute lg:text-lg xl:text-lg text-sm text-black dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
              >
                Estimated Dispatch Date{" "}
                <span className="text-red-500 m-2">*</span>
              </label>
            </div>
            {/* Add Product Button */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={addProduct}
                className="text-end max-w-fit bg-gray-200 text-black px-4 py-2 lg:text-lg xl:text-lg text-sm rounded-md hover:bg-gray-300 cursor-pointer transition duration-300"
              >
                + Add Product
              </button>

              {loading === false ? (
                <div className="justify-end flex gap-4">
                  <button
                    type="submit"
                    className="text-end max-w-fit bg-[#0A2975] text-white px-3 py-1 font-semibold lg:text-xl xl:text-xl text-sm rounded-md hover:bg-[#092060] transition duration-300 cursor-pointer"
                  >
                    Submit
                  </button>
                  <button
                    // type="submit"
                    onClick={handleClose}
                    className="text-end max-w-fit bg-red-400 text-white px-3 py-1 font-semibold lg:text-xl xl:text-xl text-sm rounded-md hover:bg-red-500 transition duration-300 cursor-pointer"
                  >
                    Cancel
                  </button>

                </div>
              ) : (
                <button
                  // type="submit"
                  className="text-end max-w-fit bg-gray-400 text-white px-2 py-1 font-semibold lg:text-xl xl:text-xl text-sm rounded-md cursor-not-allowed"
                >
                  Submiting...
                </button>
              )}
            </div>
          </section>
        </form>
      </motion.div>
    </div>
  );
};

export default UserCreatePOForm;
