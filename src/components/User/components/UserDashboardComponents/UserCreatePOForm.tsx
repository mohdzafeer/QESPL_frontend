/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../../store/store";
import { createOrderAsync} from "../../../../store/Slice/orderSlice";

import { toast } from "react-toastify";


type UserCreatePOFormProps = {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
};
type Product = {
  id: number;
  name: string;
  quantity: number;
  price: number;
  remark: string;
  
};


type OrderFormData = {
  orderNumber: string; // This will now store only the sequential number
  fullOrderNumber: string; // This will store the generated full format
  orderDate: string;
  invoiceNumber: string;
  // employeeName: string;
  // employeeId: string;
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
  estimatedDispatchDate?: string; // Optional, can be added later
};


const UserCreatePOForm: React.FC<UserCreatePOFormProps> = ({ setShowForm }) => {
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { status, error } = useSelector((state: RootState) => state.orders);
  console.log(user, "User data in UserCreatePOForm ejhwfgwefigwiefgiewfg");

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Function to get month abbreviation (e.g., JAN, FEB)
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
    orderNumber: "", // User inputs this sequential number
    fullOrderNumber: "", // This will be generated
    orderDate: getTodayDate(), // Set default to today's date
    invoiceNumber: "",
    // employeeName: user.username || "",
    // employeeId: user?.employeeId || "Not Available", // Autofill with logged-in user's ID
    clientName: "",
    companyName: "",
    gstNumber: "",
    address: "",
    zipCode: "",
    orderThrough: { username: "", employeeId: "" },
    generatedBy: {
      username: user.username,
      employeeId: user.employeeId || "Not Available", // Use actual employeeId from user if available
    },
    contactNumber: "",
    products: [
      { id: 1, name: "", quantity: 1, price: 0, remark: "" },
    ],
    estimatedDispatchDate: "", // Optional, can be added later
  });

  // Update formData when user changes (for async Redux updates)
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        employeeName: user.username,
        employeeId: user.employeeId,
      }));
    }
    // console.log(formData,"zafeeeeeeeeeeerrrrrrr")
  }, [user]);

  // Effect for generating and managing the orderNumber prefix (QESPL/MMM/YY) and incrementing counter
  useEffect(() => {
    const today = new Date();
    const currentMonthAbbr = getMonthAbbreviation(today);
    const currentYearShort = today.getFullYear() % 100; // Last two digits of the year

    const storedOrderCountData = localStorage.getItem("orderCountData");
    let lastRecordedMonth = "";
    let lastRecordedYear = "";
    let nextSequentialNumber = 1;

    if (storedOrderCountData) {
      const parsedData = JSON.parse(storedOrderCountData);
      lastRecordedMonth = parsedData.month;
      lastRecordedYear = parsedData.year;
      nextSequentialNumber = parsedData.count; // This is the count *after* the last successful order
    }

    // Check if month or year has changed to reset the counter
    if (
      lastRecordedMonth !== currentMonthAbbr ||
      lastRecordedYear !== String(currentYearShort)
    ) {
      nextSequentialNumber = 1; // Reset to 1 for the new month/year
    }

    setFormData((prev) => ({
      ...prev,
      // Initialize the orderNumber input field with the next sequential number if it's the first load
      orderNumber: prev.orderNumber || String(nextSequentialNumber),
      fullOrderNumber: `${
        prev.orderNumber || nextSequentialNumber
      }/QESPL/${currentMonthAbbr}/${currentYearShort}`,
    }));

    // Store the count and current month/year for the next order
    localStorage.setItem(
      "orderCountData",
      JSON.stringify({
        count: nextSequentialNumber, // Store the count that was just used for the *next* order
        month: currentMonthAbbr,
        year: String(currentYearShort),
      })
    );
  }, []); // Run once on component mount

  // Effect to update fullOrderNumber when orderNumber (sequential part) changes
  useEffect(() => {
    const today = new Date();
    const currentMonthAbbr = getMonthAbbreviation(today);
    const currentYearShort = today.getFullYear() % 100;
    setFormData((prev) => ({
      ...prev,
      fullOrderNumber: `${prev.orderNumber}/QESPL/${currentMonthAbbr}/${currentYearShort}`,
    }));
  }, [formData.orderNumber]); // Recalculate fullOrderNumber when the sequential part changes

  useEffect(() => {
    if (status === "succeeded") {
      // setShowForm(false); // Close form on success
      // After successful submission, increment the stored counter for the *next* order
      
      const today = new Date();
      const currentMonthAbbr = getMonthAbbreviation(today);
      const currentYearShort = today.getFullYear() % 100;

      const storedOrderCountData = localStorage.getItem("orderCountData");
      let nextSequentialNumber = 1;

      if (storedOrderCountData) {
        const parsedData = JSON.parse(storedOrderCountData);
        if (
          parsedData.month === currentMonthAbbr &&
          parsedData.year === String(currentYearShort)
        ) {
          nextSequentialNumber = parsedData.count; // Get the last count
        }
      }

      localStorage.setItem(
        "orderCountData",
        JSON.stringify({
          count: nextSequentialNumber + 1, // Increment for the next order
          month: currentMonthAbbr,
          year: String(currentYearShort),
        })
      );
    } else if (status === "failed" && error) {
      console.log(error, "Error creating order:");
      toast.error("Order creation failed. This order number might already exist. Please try again with a different Order Number.");
     
    
    } 
  }, [ ]);

  // Handles input changes for top-level form fields
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
      // <--- Added this block for generatedBy
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        generatedBy: { ...prev.generatedBy, [field]: value },
      }));
    } else if (name === "orderNumber") {
      // Only allow numbers for orderNumber input
      if (/^\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handles input changes specifically for product fields
  const handleProductChange = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((product) => {
        if (product.id === id) {
          if (name === "quantity" || name === "price") {
            return { ...product, [name]: Number(value) };
          }
          return { ...product, [name]: value };
        }
        return product;
      }),
    }));
  };

  // Adds a new product row to the form
  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          id: prev.products.length + 1,
          name: "",
          quantity: 0,
          price: 0,
          remark: "",
          // dispatchDate: "",
        },
      ],
    }));
  };

  // Removes a product row from the form
  const removeProduct = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((product) => product.id !== id),
    }));
  };

  // Closes the form by updating the parent component's state
  const handleClose = () => {
    setShowForm(false);
  };

  // Handles the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    // Ensure orderNumber is a valid number before submission
    const sequentialOrderNum = parseInt(formData.orderNumber, 10);
    if (isNaN(sequentialOrderNum) || sequentialOrderNum <= 0) {
      toast.error("Please enter a valid Order Number (sequential part).");
      return;
    }

    const apiOrderData = {
      
      clientName: formData.clientName,
      companyName: formData.companyName,
      gstNumber: formData.gstNumber,
      contact: formData.contactNumber,
      address: formData.address,
      zipCode: formData.zipCode,
      products: formData.products.map((product) => ({
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        remark: product.remark,
      })),
      estimatedDispatchDate: formData.estimatedDispatchDate || "",
      generatedBy: {
        username: formData.generatedBy.username,
        employeeId: formData.generatedBy.employeeId,
      },
      orderThrough: {
        username: formData.orderThrough.username,
        employeeId: formData.orderThrough.employeeId,
      },
      orderNumber: formData.fullOrderNumber, // Use the generated full order number here
      orderDate: formData.orderDate,
      invoiceNumber: formData.invoiceNumber,
      status: "pending",
      department: "default",
      isdeleted: false,
      deletedAt: null,
    };

    try {
      
      await dispatch(createOrderAsync(apiOrderData));
      setShowForm(false)
      
      setLoading(false);
      window.location.reload(); // Reload the page to reflect changes
      // The increment of localStorage is now handled in the success useEffect
    } catch (err) {
      toast.error("Failed to create order. Please try again.");
      setLoading(false)
    }
  };

  // If user is not logged in, show a loading state or redirect
  if (!user) {
    return <div>Please log in to access this form.</div>;
  }

  console.log(user.employeeId, "User data in UserCreatePOForm");
  

  return (
    <div className="w-screen h-screen flex justify-center items-center pt-20">
      <div className="bg-white dark:bg-zinc-900 w-11/12 max-h-10/12 rounded-lg p-5 my-10 no-scrollbar overflow-y-scroll">
        <div className="flex justify-between items-center w-full ">
          <h1 className="text-[#0A2975] dark:text-white font-bold text-xl+ mb-5 uppercase">
            Create PO
          </h1>
          <button
            className="text-gray-700 dark:text-white text-2xl px-3 py-2 rounded-lg cursor-pointer"
            onClick={handleClose}
          >
            &times;
          </button>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Section 1 : PO Details*/}
          <section className="flex flex-col gap-2 text-sm">
            <h1 className="text-start font-semibold text-sm mb-4 uppercase">
              PO DETAILS
            </h1>
            <div>
              {/* Order Number Input (User enters only the sequential part) */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text" // Changed to text to allow empty initially, but validation ensures numbers
                  name="orderNumber"
                  id="order_number"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#0A2975] focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  required
                  value={formData.orderNumber}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="order_number"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-[#0A2975]"
                >
                  Order Number (Sequential Part)
                </label>
              </div>
              {/* Display Full Order Number Label */}
              {formData.fullOrderNumber && (
                <div className="mb-5 -mt-3 text-xs text-start text-gray-700">
                  Order Number is:{" "}
                  <span className="font-semibold text-[#0A2975]">
                    {formData.fullOrderNumber}
                  </span>
                </div>
              )}

              {/* Order Date Input */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="date"
                  name="orderDate"
                  id="order_date"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#0A2975] focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder="Order Date"
                  required
                  value={formData.orderDate}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="order_date"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-[#0A2975]"
                >
                  Order Date
                </label>
              </div>

              {/* Invoice No. Input */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="invoiceNumber"
                  id="invoice_number"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#0A2975] focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  // required
                  value={formData.invoiceNumber}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="invoice_number"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-[#0A2975]"
                >
                  Invoice Number
                </label>
              </div>
            </div>
          </section>

          {/* Section 2 : Order Through Details */}
          <section className="flex flex-col gap-2 text-sm">
            <h1 className="text-start font-semibold text-sm mb-4 uppercase">
              Order Through
            </h1>
            <div>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="orderThrough.username"
                  id="order_through_username"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#0A2975] focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  required
                  value={formData.orderThrough.username}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="order_through_username"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-[#0A2975]"
                >
                  Order Through Username
                </label>
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="orderThrough.employeeId"
                  id="order_through_employee_id"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#0A2975] focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  // required
                  value={formData.orderThrough.employeeId}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="order_through_employee_id"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-[#0A2975]"
                >
                  Order Through Employee ID
                </label>
              </div>
              {/* <h1 className="text-start font-semibold text-sm mb-4 uppercase">
                {" "}
                generated by
              </h1>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="generatedBy.username"
                  id="employee_name"
                  className="block py-2.5 px-0 w-full cursor-not-allowed text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#0A2975] focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  required
                  value={formData.generatedBy.username}
                  onChange={handleInputChange}
                  readOnly
                />
                <label
                  htmlFor="employee_name"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-[#0A2975]"
                >
                  Employee Name
                </label>
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="generatedBy.employeeId"
                  id="employee_id"
                  className="block py-2.5 cursor-not-allowed px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#0A2975] focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  required
                  value={formData.generatedBy.employeeId}
                  onChange={handleInputChange}
                  readOnly
                />
                <label
                  htmlFor="employee_id"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-[#0A2975]"
                >
                  Employee ID
                </label>
              </div> */}
            </div>
          </section>

          {/* Section 3 : Company Details */}
          <section className="flex flex-col gap-2 text-sm">
            <h1 className="text-start font-semibold text-sm mb-4 uppercase">
              Company Details
            </h1>
            <div>
              {/* Client Name Input */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="clientName"
                  id="Client_Name"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#0A2975] focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  required
                  value={formData.clientName}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="Client_Name"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-[#0A2975]"
                >
                  Client Name
                </label>
              </div>

              {/* Company Name Input */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="companyName"
                  id="Company_Name"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#0A2975] focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  // required
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="Company_Name"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-[#0A2975]"
                >
                  Company Name
                </label>
              </div>
              {/* GST Number Input */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="gstNumber"
                  id="GST_Number"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#0A2975] focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  // required
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="GST_Number"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-[#0A2975]"
                >
                  GST Number
                </label>
              </div>
              {/* Address Input */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="address"
                  id="Address"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#0A2975] focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  // required
                  value={formData.address}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="Address"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-[#0A2975]"
                >
                  Address
                </label>
              </div>
              {/* Zipcode Input */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="zipCode"
                  id="ZIP_Code"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#0A2975] focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  // required
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="ZIP_Code"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-[#0A2975]"
                >
                  ZIP Code
                </label>
              </div>
              {/* Contact Number Input */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="contactNumber"
                  id="Contact_Number"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#0A2975] focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  // required
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="Contact_Number"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-[#0A2975]"
                >
                  Contact Number
                </label>
              </div>
            </div>
          </section>

          {/* Product Details Section */}
          <section className="flex flex-col gap-4 text-sm">
            <h1 className="text-start font-semibold text-sm mb-4 uppercase">
              Product Details
            </h1>

            {formData.products.map((product, index) => (
              <div key={product.id} className="border-b pb-4 relative">
                {/* Product Name Input */}
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    list={`product-options-${index}`}
                    name="name"
                    id={`Product_Name_${index}`}
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#0A2975] focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                    placeholder=" "
                    required
                    value={product.name}
                    onChange={(e) => handleProductChange(product.id, e)}
                  />
                  <label
                    htmlFor={`Product_Name_${index}`}
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-[#0A2975]"
                  >
                    Product Name
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
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#0A2975] focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                      placeholder=" "
                      required
                      value={product.quantity.toString()} // Convert number to string for input value
                      onChange={(e) => handleProductChange(product.id, e)}
                      
                    />
                    <label
                      htmlFor={`Product_Quantity_${index}`}
                      className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-[#0A2975]"
                    >
                      Qty
                    </label>
                  </div>

                  <div className="relative w-3/5">
                    <input
                      type="number"
                      name="price"
                      id={`Product_Price_${index}`}
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#0A2975] focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                      placeholder=" "
                      required
                      value={product.price.toString()} // Convert number to string for input value
                      onChange={(e) => handleProductChange(product.id, e)}
                    />
                    <label
                      htmlFor={`Product_Price_${index}`}
                      className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-[#0A2975]"
                    >
                      Price
                    </label>
                  </div>
                </div>

                {/* Remark Input */}
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="remark"
                    id={`Remark_${index}`}
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#0A2975] focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                    placeholder=" "
                    // required
                    value={product.remark}
                    onChange={(e) => handleProductChange(product.id, e)}
                  />
                  <label
                    htmlFor={`Remark_${index}`}
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-[#0A2975]"
                  >
                    Remark
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
            <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="date"
                    name="dispatchDate"
                    id={'estimatedDispatchDate'}
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#0A2975] focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                    required
                    value={formData.estimatedDispatchDate}
                    onChange={handleInputChange}
                  />
                  <label
                    htmlFor={'estimatedDispatchDate'}
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-[#0A2975]"
                  >
                    Dispatch Date
                  </label>
                </div>
            {/* Add Product Button */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={addProduct}
                className="text-end max-w-fit bg-gray-200 text-black px-4 py-2 text-sm rounded-md hover:bg-gray-300 cursor-pointer transition duration-300"
              >
                + Add Product
              </button>
              
              {loading===false ? (
                <button
                type="submit"
                className="text-end max-w-fit bg-[#0A2975] text-white px-2 py-1 font-semibold text-xl rounded-md hover:bg-[#092060] transition duration-300 cursor-pointer"
              >
                Submit
              </button>
              ):(
                <button
                // type="submit"
                className="text-end max-w-fit bg-gray-400 text-white px-2 py-1 font-semibold text-xl rounded-md cursor-not-allowed"
              >
                Submiting...
              </button>
              )}
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};

export default UserCreatePOForm;
