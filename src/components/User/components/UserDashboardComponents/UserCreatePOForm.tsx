import React, { useState, useEffect } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { createOrder } from "../../../../utils/api";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";

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

type orderThrough = {
  username: string;
  employeeId: string;
};

type generatedBy = {
  username: string;
  employeeId: string;
};

type OrderFormData = {
  orderNumber: string; // This will store only the numeric part
  orderDate: string;
  invoiceNumber: string;
  clientName: string;
  companyName: string;
  gstNumber: string;
  address: string;
  zipCode: string;
  contactNumber: string;
  products: Product[];
  estimatedDispatchDate: string;
  orderThrough: orderThrough;
  generatedBy: generatedBy;
};

const UserCreatePOForm: React.FC<UserCreatePOFormProps> = ({ setShowForm }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  // Helper function to get today's date in YYYY-MM-DD format for input[type="date"]
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // State for form data
  const [formData, setFormData] = useState<OrderFormData>({
    orderNumber: "", // Stores only the number entered by the user
    orderDate: getTodayDate(), // Set default to today's date
    invoiceNumber: "",
    clientName: "",
    companyName: "",
    gstNumber: "",
    address: "",
    zipCode: "",
    contactNumber: "",
    products: [{ id: 1, name: "", quantity: 0, price: 0, remark: "" }],
    estimatedDispatchDate: "",
    orderThrough: { username: "", employeeId: "" },
    generatedBy: {
      username: user.username,
      employeeId: user.employeeId || "default", // Use actual employeeId from user if available
    },
  });

  // State for loading indicator
  const [loading, setLoading] = useState(false);

  // State to hold the dynamic PO suffix (e.g., /QESPL/JUL/25)
  const [poSuffix, setPoSuffix] = useState('');

  // Calculate the dynamic suffix once on component mount
  useEffect(() => {
    const now = new Date();
    const currentYearShort = now.getFullYear().toString().slice(-2);
    // Use 'en-IN' locale to ensure correct month abbreviation for India, although 'en-US' is generally fine for 'short' month.
    const currentMonthAbbr = now.toLocaleString('en-IN', { month: 'short' }).toUpperCase();
    setPoSuffix(`/QESPL/${currentMonthAbbr}/${currentYearShort}`);
  }, []);

  // Update generatedBy user details if the `user` object changes (e.g., after initial load)
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      generatedBy: {
        ...prev.generatedBy,
        username: user.username,
        employeeId: user.employeeId || "default",
      },
    }));
  }, [user]);

  // Handle input changes for general form fields
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Special handling for orderNumber to allow only numeric input
    if (name === "orderNumber") {
      const numericValue = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      return; // Exit early as orderNumber is handled
    }

    if (name.includes(".")) {
      const [parentKey, childKey] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parentKey]: {
          ...(prev as any)[parentKey],
          [childKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle changes for product fields
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
            // Convert to number for quantity and price
            return { ...product, [name]: Number(value) };
          }
          return { ...product, [name]: value };
        }
        return product;
      }),
    }));
  };

  // Add a new product row
  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          id: prev.products.length > 0 ? Math.max(...prev.products.map(p => p.id)) + 1 : 1, // Ensure unique IDs
          name: "",
          quantity: 0,
          price: 0,
          remark: "",
        },
      ],
    }));
  };

  // Remove a product row
  const removeProduct = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((product) => product.id !== id),
    }));
  };

  // Close the form
  const handleClose = () => {
    setShowForm(false);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Construct the full order number for API submission
    const fullOrderNumber = formData.orderNumber + poSuffix;

    const apiOrderData = {
      orderNumber: fullOrderNumber, // Send the full formatted PO number to the API
      orderDate: formData.orderDate,
      invoiceNumber: formData.invoiceNumber,
      clientName: formData.clientName,
      companyName: formData.companyName,
      gstNumber: formData.gstNumber,
      address: formData.address,
      zipCode: formData.zipCode,
      contact: formData.contactNumber, // Check if this should be `contactNumber` or `contact` on backend
      products: formData.products.map((product) => ({
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        remark: product.remark,
      })),
      estimatedDispatchDate: formData.estimatedDispatchDate,
      orderThrough: {
        username: formData.orderThrough.username,
        employeeId: formData.orderThrough.employeeId,
      },
      generatedBy: {
        username: user.username,
        employeeId: user.employeeId || "default", // Ensure employeeId is captured
      },
      orderThrougth: "Online", // Typo in original code: 'orderThrougth' -> confirm with backend if this should be 'orderThrough'
      department: "sales",
    };

    console.log("Submitting Order Data:", apiOrderData);

    try {
      setLoading(true);
      const response = await createOrder(apiOrderData);
      console.log("Order created successfully:", response);
      alert("Order created successfully!");
      setShowForm(false);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center pt-20">
      <div className="bg-white dark:bg-zinc-900 w-11/12 max-h-10/12 rounded-lg p-5 my-10 no-scrollbar overflow-y-scroll">
        <div className="flex justify-between items-center w-full ">
          <h1 className="text-[#0A2975] dark:text-white font-bold text-lg mb-5 uppercase">
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
          {/* Section 1 : PO Details */}
          <section className="flex flex-col gap-2 text-sm">
            <h1 className="text-start font-semibold text-sm mb-4 uppercase">
              PO DETAILS
            </h1>
            <div>
              {/* Order Number Input */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="orderNumber"
                  id="order_number"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" " // Keep placeholder empty for floating label effect
                  required
                  value={formData.orderNumber} // Input value remains just the number
                  onChange={handleInputChange}
                  autoComplete="off" // Prevent browser auto-fill
                />
                {/* Faded suffix display */}
                <span
                  className={`absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform top-0 left-0 origin-[0] pointer-events-none
                    ${formData.orderNumber ? 'peer-focus:-translate-y-4 peer-focus:scale-75' : 'peer-placeholder-shown:translate-y-2.5 peer-placeholder-shown:scale-100'}
                    peer-focus:text-[#0A2975] peer-focus:dark:text-white
                    ${formData.orderNumber ? 'block' : ''}
                    `}
                  style={{
                    // Position the suffix right after the typed number
                    // Adjust '7' based on average character width for 'text-sm'
                    left: `${formData.orderNumber.length * 7}px`,
                    opacity: formData.orderNumber ? 0.6 : 0.8, // Fade slightly more when user types
                    transition: 'opacity 0.2s ease-in-out',
                  }}
                >
                  Order Number{formData.orderNumber ? '' : poSuffix}  
                </span>

              </div>

              {/* Display full PO number for confirmation */}
              {formData.orderNumber && (
                <p className="text-xs text-gray-600 dark:text-gray-400 -mt-3 mb-5 text-start">
                  Full PO will be: <strong>{formData.orderNumber}{poSuffix}</strong>
                </p>
              )}

              {/* Order Date Input */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="date"
                  name="orderDate"
                  id="order_date"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder="Order Date"
                  required
                  value={formData.orderDate} // Bound to state
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="order_date"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
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
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  required 
                  value={formData.invoiceNumber}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="invoice_number"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
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
              {/* Employee Name Input */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="orderThrough.username"
                  id="Employee_Name"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  required
                  value={formData.orderThrough.username}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="Employee_Name"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
                >
                  Employee Name
                </label>
              </div>

              {/* Employee ID Input */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="orderThrough.employeeId"
                  id="Employee_ID"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  required
                  value={formData.orderThrough.employeeId}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="Employee_ID"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
                >
                  Employee ID
                </label>
              </div>
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
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  required
                  value={formData.clientName}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="Client_Name"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
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
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  required
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="Company_Name"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
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
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  required
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="GST_Number"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
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
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="Address"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
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
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  required
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="ZIP_Code"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
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
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                  placeholder=" "
                  required
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="Contact_Number"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
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
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                    placeholder=" "
                    required
                    value={product.name}
                    onChange={(e) => handleProductChange(product.id, e)}
                  />
                  <label
                    htmlFor={`Product_Name_${index}`}
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
                  >
                    Product Name
                  </label>

                  {/* Dropdown options for Product Name */}
                  <datalist id={`product-options-${index}`}>
                    <option value="Weather Station" />
                    <option value="AQMS" />
                    <option value="Water Analyzer" />
                    <option value="Flowmeter" />
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
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                      placeholder=" "
                      required
                      value={product.quantity.toString()}
                      onChange={(e) => handleProductChange(product.id, e)}
                    />
                    <label
                      htmlFor={`Product_Quantity_${index}`}
                      className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
                    >
                      Qty
                    </label>
                  </div>

                  <div className="relative w-3/5">
                    <input
                      type="number"
                      name="price"
                      id={`Product_Price_${index}`}
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                      placeholder=" "
                      required
                      value={product.price.toString()}
                      onChange={(e) => handleProductChange(product.id, e)}
                    />
                    <label
                      htmlFor={`Product_Price_${index}`}
                      className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
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
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                    placeholder=" "
                    required
                    value={product.remark}
                    onChange={(e) => handleProductChange(product.id, e)}
                  />
                  <label
                    htmlFor={`Remark_${index}`}
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
                  >
                    Remark
                  </label>
                </div>

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
                name="estimatedDispatchDate"
                id="dispatch_date"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-[#0A2975] peer"
                placeholder="Order Date"
                required
                value={formData.estimatedDispatchDate}
                onChange={handleInputChange}
              />
              <label
                htmlFor="dispatch_date"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform scale-75 top-0 left-0 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2.5 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#0A2975] peer-focus:dark:text-white"
              >
                Estimated Dispatch Date
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
              <button
                type="submit"
                className={`text-end max-w-fit bg-[#0A2975] dark:bg-blue-500 text-white px-2 py-1 font-semibold text-xl rounded-md ${
                  !loading && "hover:bg-[#092060] dark:hover:bg-blue-600"
                } transition duration-300 ${
                  !loading && "cursor-pointer"
                } ${loading && "bg-gray-400 cursor-not-allowed hover:bg-gray-600"} `}
              >
                {loading ? "Submitting..." : " Submit"}
              </button>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};

export default UserCreatePOForm;