// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { FiEye } from "react-icons/fi";
// import { FiEyeOff } from "react-icons/fi";
// import { useValidationForm } from "../../validationComponent/validationSchema";
// import { useDispatch, useSelector } from "react-redux";
// import type { AppDispatch, RootState } from "../../store/store";
// import { createSubAdminUser, createNormalUser, createUserPermission, resetUserState } from "../../../store/Slice/subadminSlice";
// import { createUser } from "../../../utils/api";


// const UserDetailsForm: React.FC = () => {
//   const dispatch = useDispatch();
//   const [showPassword, setShowPassword] = useState(false);
//   const [userType, setUserType] = useState<"user" | "subadmin">("subadmin");
//   const [imagePreview, setImagePreview] = useState<string | null>(
//     "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
//   );
//   const [resource, setResource] = useState<"none" | "orders" | "repairs">("none");
//   const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
//   const [permissions, setPermissions] = useState({
//     readOnly: true,
//     create: false,
//     edit: false,
//     delete: false,
//   });
//   const [profileFile, setProfileFile] = useState<File | undefined>(undefined);
//   const { loading, error, success, user } = useSelector((state: RootState) => state.user);
//   const auth = useSelector((state: RootState) => state.auth);
//   const adminUsers = useSelector((state: RootState) => state.adminUser);


//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm({ resolver: yupResolver(useValidationForm) });


//   useEffect(() => {
//     if (!auth.isAuthenticated || !["admin", "subadmin"].includes(auth.user?.role || "")) {
//       console.error("Unauthorized access to UserDetailsForm");
//     }
//   }, [auth]);

//   //// create 
//  useEffect(() => {
//     if (success && user) {
//       if (resource !== "none") {
//         const permissionData = {
//           userId: user.id,
//           resource,
//           actions: Object.entries(permissions)
//             .filter(([_, value]) => value)
//             .map(([key]) => key),
//         };
//         dispatch(createUserPermission(permissionData));
//       }
//       reset();
//       setUserType("subadmin");
//       setSelectedDepartments([]);
//       setResource("none");
//       setPermissions({ readOnly: true, create: false, edit: false, delete: false });
//       setProfileFile(undefined);
//       setImagePreview("https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png");
//       setTimeout(() => dispatch(resetUserState()), 3000);
//     }
//   }, [success, user, dispatch, reset]);

  


//   const onSubmit = async (data: any) => {
//     const formData = {
//       username: data.username,
//       email: data.email,
//       password: data.password,
//       department: selectedDepartments.join(","), // Combine selected departments
//       userType: userType,
//     };
//     console.log(formData,"dhfohdfo")
//     await dispatch(createUser(formData));
//   };


//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setImagePreview(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

 
//   const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selected = e.target.value as "none" | "orders" | "repairs";
//     console.log(selected, "resourese")
//     setResource(selected);
//     if (selected === "none") {
//       setPermissions({ readOnly: true, create: false, edit: false, delete: false });
//     }
//   };

//   const handleChangeUserType = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selected = e.target.value as "user" | "subadmin";
//     console.log(selected,"check selectores")
//     setUserType(selected);
//     setSelectedDepartments([]);
//   };



//   const handleDepartmentChange = (department: string) => {
//     setSelectedDepartments((prev) =>
//       prev.includes(department) ? prev.filter((d) => d !== department) : [...prev, department]
//     );
//   };

//   const handlePermissionChange = (permission: keyof typeof permissions) => {
//     setPermissions((prev) => ({ ...prev, [permission]: !prev[permission] }));
//   };



//   // const handleChangeUserType = (e: React.ChangeEvent<HTMLSelectElement>) => {
//   //   const selected = e.target.value;
//   //   switch (selected) {
//   //     case "user":
//   //       setUserType("user");
//   //       break;
//   //     case "subadmin":
//   //       setUserType("subadmin");
//   //       break;
//   //     default:
//   //       setUserType("user");
//   //   }
//   // };

//   const allowedFields = [
//     {
//       id: "clientName",
//       label: "Client Name",
//     },
//     {
//       id: "companyName",
//       label: "Company Name",
//     },
//     {
//       id: "gstNumber",
//       label: "GST Number",
//     },
//     {
//       id: "contactNumber",
//       label: "Contact Number",
//     },
//     {
//       id: "address",
//       label: "Address",
//     },
//     {
//       id: "zipcode",
//       label: "Zipcode",
//     },
//     {
//       id: "estimatedDispatchDate",
//       label: "Estimated Dispatch Date*",
//     },
   
//   ];

//   const departments = [
//     {
//       id: "marketing",
//       label: "Marketing",
//     },
//     {
//       id: "accounts",
//       label: "Accounts",
//     },
//     {
//       id: "production",
//       label: "Production",
//     },
//     {
//       id: "r&d",
//       label: "Research and Development (R&D)",
//     },
//   ];

//   return (
//     <form
//       className="max-w-screen  px-1 py-4  bg-gray-100  rounded-lg space-y-4 lg:mb-10 mb-1 "
//       onSubmit={handleSubmit(onSubmit)}
//     >
//       <div className="w-full">
//         <div className="grid lg:grid-cols-2 grid-cols-1 max-w-screen gap-8 ">
//           {/* User Details */}
//           <div className="lg:text-xl text-sm flex flex-col gap-6 justify-start shadow-lg bg-white lg:px-20 px-2 lg:py-10 py-2 rounded-xl">
//             <h2 className="text-2xl font-semibold text-start">User Details</h2>

//             {/* Profile Image */}
//             <div className="flex justify-start">
//               <div className="relative w-24 h-24 border-2 border-gray-400 rounded-full">
//                 <img
//                   src={imagePreview || "/default-user.png"}
//                   alt="Profile"
//                   className="w-full h-full rounded-full object-cover border"
//                 />
//                 <label
//                   htmlFor="profileImage"
//                   className="absolute bottom-0 left-0 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center cursor-pointer text-sm font-bold"
//                 >
//                   +
//                 </label>
//                 <input
//                   id="profileImage"
//                   type="file"
//                   accept="image/*"
//                   {...register("profileImage")}
//                   onChange={handleImageUpload}
//                   className="hidden"
//                 />
//               </div>
//             </div>

//             <div>
//               <input
//                 type="text"
//                 placeholder="username"
//                 {...register("username")}
//                 className="w-full border rounded px-4 py-2  border-gray-400"
//               />
//               <p className="text-red-500 text-sm">{errors.username?.message}</p>
//             </div>

//             <div>
//               <input
//                 type="email"
//                 placeholder="Email"
//                 {...register("email")}
//                 className="w-full border rounded px-4 py-2 border-gray-400"
//               />
//               <p className="text-red-500 text-sm">{errors.email?.message}</p>
//             </div>

//             <div>
//               <div className="flex items-center space-x-2 border rounded border-gray-400">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Password"
//                   {...register("password")}
//                   className="w-full outline-none rounded px-4 py-2 "
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword((prev) => !prev)}
//                   className="text-gray-700 text-lg   duration-200 p-2 border-none"
//                 >
//                   {showPassword ? <FiEyeOff /> : <FiEye />}
//                 </button>
//               </div>
//               <p className="text-red-500 text-sm">{errors.password?.message}</p>
//             </div>
//             <div>
//               <input
//                 type="text"
//                 placeholder="Employee ID"
//                 {...register("employeeId")}
//                 className="w-full border rounded px-4 py-2 border-gray-400"
//               />
//               <p className="text-red-500 text-sm">
//                 {errors.employeeId?.message}
//               </p>
//             </div>

//             {/* User Type */}
//             <div className=" w-full  font-semibold text-gray-600">
//               <div className="flex justify-start items-center gap-4 text-sm">
//                 <p className=" w-fit font-semibold lg:text-lg text-sm">
//                   User Type :
//                 </p>
//                 <select
//                   value={userType}
//                   required
//                   onChange={handleChangeUserType}
//                   className="w-fit px-5 py-2 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0A2975]"
//                 >
//                   {/* <option value="all">All Status</option> */}
//                   <option selected value="user">
//                     User
//                   </option>
//                   <option value="subadmin">Sub Admin</option>
//                 </select>
//               </div>

//               {userType === "subadmin" ? (
//                 <div className="mt-5">
//                   {departments.map((department) => {
//                     return (
//                       <div className="flex gap-2 items-center">
//                         <input required id={department.id} type="checkbox" />
//                         <label
//                           htmlFor={department.id}
//                           className="text-lg font-semibold text-gray-500"
//                         >
//                           {department.label}
//                         </label>
//                       </div>
//                     );
//                   })}
//                 </div>
//               ) : userType === "user" ? (
//                 <div className="mt-5">
//                   <div className=" flex gap-3 items-center">
//                     <label className="lg:text-lg text-sm font-semibold">
//                       Designation :
//                     </label>
//                     <div>
//                       <input
//                         type="text"
//                         placeholder="Designation"
//                         // {...register("designation")}
//                         required
//                         className="w-fit border rounded px-4 py-2  border-gray-400 lg:text-lg text-sm"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 ""
//               )}
//             </div>
//           </div>

//           <div className=" flex flex-col h-full gap-6 justify-start items-start  ">
//             {/* Permissions of Actions */}
//             <div className="flex flex-col gap-2 items-start bg-white lg:px-20 px-2 lg:py-10 py-4 rounded-xl shadow-xl min-w-full max-h-fit">
//               <h2 className="text-2xl font-semibold text-start mb-5">
//                 Permissions of Actions
//               </h2>

//               <select
//                 value={resource}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0A2975]"
//               >
//                 {/* <option value="all">All Status</option> */}
//                 <option value="none">None</option>
//                 <option value="orders">Orders</option>
//                 <option value="repairs">Repairs</option>
//                 {/* <option value="pending">Pending</option>
//                       <option value="delayed">Delayed</option>
//                       <option value="rejected">Rejected</option> */}
//               </select>

//               {resource === "orders" && (
//                 <div className="flex flex-col gap-4 text-gray-500">
//                   <div className="flex  gap-2 items-center w-[250px]">
//                     <input type="checkbox" id="readOnly" defaultChecked  />
//                     <label
//                       className="text-lg font-semibold text-gray-500 "
//                       htmlFor="readOnly"
//                     >
//                       Read Only
//                     </label>
//                   </div>
//                   <div className="flex gap-2 items-center">
//                     <input id="create" type="checkbox" />
//                     <label htmlFor="create" className="text-lg font-semibold">
//                       Create POs
//                     </label>
//                   </div>
//                   <div className="flex gap-2 items-center">
//                     <input id="edit" type="checkbox" />
//                     <label htmlFor="edit" className="text-lg font-semibold">
//                       Update POs
//                     </label>
//                   </div>
//                   <div className="flex gap-2 items-center">
//                     <input id="delete" type="checkbox" />
//                     <label htmlFor="delete" className="text-lg font-semibold">
//                       Delete POs
//                     </label>
//                   </div>
//                 </div>
//               )}
//             </div>
//             {/* <div className="h-0.5 w-full bg-gray-200 " /> */}
//             {/* Allowed Fields */}
//             {/* <div className="flex flex-col gap-4 items-start bg-white lg:px-20 px-2 lg:py-10 py-4 rounded-xl shadow-xl min-w-full ">
//               <h2 className="text-2xl font-semibold text-start  ">
//                 Allowed Fields
//               </h2>

//               <div className="flex flex-col lg:flex-row lg:flex-wrap gap-4 w-full">
//                 {allowedFields.map((field) => {
//                   return (
//                     <div className="flex gap-2 items-center w-[250px]">
//                       <input type="checkbox" id={field.id} />
//                       <label
//                         className="text-lg font-semibold text-gray-500 "
//                         htmlFor={field.id}
//                       >
//                         {field.label}
//                       </label>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div> */}
//           </div>
//         </div>
//       </div>
//       <button
//         type="submit"
//         className=" w-fit lg:px-16 px-6  bg-[#0A2975] text-white py-2 rounded hover:bg-blue-900 active:bg-blue-950 duration-200 cursor-pointer font-bold mt-10"
//       >
//         Create User
//       </button>
//     </form>
//   );
// };

// export default UserDetailsForm;



/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useValidationForm } from "../../validationComponent/validationSchema";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { createSubAdminUser, createNormalUser, createUserPermission, resetUserState } from "../../../store/Slice/subadminSlice";

const UserDetailsForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<"user" | "subadmin">("subadmin");
  const [imagePreview, setImagePreview] = useState<string | null>(
    "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
  );
  const [resource, setResource] = useState<"none" | "orders" | "repairs">("none");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [permissions, setPermissions] = useState({
    readOnly: true,
    create: false,
    edit: false,
    delete: false,
  });
  const [profileFile, setProfileFile] = useState<File | undefined>(undefined);

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success, user } = useSelector((state: RootState) => state.user);
  const auth = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(useValidationForm) });

  useEffect(() => {
    if (!auth.isAuthenticated || !["admin", "subadmin"].includes(auth.user?.role || "")) {
      console.error("Unauthorized access to UserDetailsForm");
    }
  }, [auth]);

  useEffect(() => {
    if (success && user) {
      if (resource !== "none") {
        const permissionData = {
          userId: user.id,
          resource,
          actions: Object.entries(permissions)
            .filter(([_, value]) => value)
            .map(([key]) => key),
        };
        dispatch(createUserPermission(permissionData));
      }
      reset();
      setUserType("subadmin");
      setSelectedDepartments([]);
      setResource("none");
      setPermissions({ readOnly: true, create: false, edit: false, delete: false });
      setProfileFile(undefined);
      setImagePreview("https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png");
      setTimeout(() => dispatch(resetUserState()), 3000);
    }
  }, [success, user, dispatch, reset]);

  const onSubmit = async (data: any) => {
    const permissionActions = Object.entries(permissions)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    if (userType === "subadmin") {
      const formData: SubAdminFormData = {
        username: data.username,
        email: data.email,
        password: data.password,
        department: selectedDepartments.join(","),
        userType: "subadmin",
        profilePicture: profileFile,
        permissions: resource !== "none" ? { resource, actions: permissionActions } : undefined,
      };
      await dispatch(createSubAdminUser(formData));
    } else {
      const formData: UserFormData = {
        username: data.username,
        email: data.email,
        password: data.password,
        userType: "user",
        employeeId: data.employeeId,
        designation: data.designation,
        profilePicture: profileFile,
        permissions: resource !== "none" ? { resource, actions: permissionActions } : undefined,
      };
      await dispatch(createNormalUser(formData));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as "none" | "orders" | "repairs";
    setResource(selected);
    if (selected === "none") {
      setPermissions({ readOnly: true, create: false, edit: false, delete: false });
    }
  };

  const handleChangeUserType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as "user" | "subadmin";
    setUserType(selected);
    setSelectedDepartments([]);
  };

  const handleDepartmentChange = (department: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(department) ? prev.filter((d) => d !== department) : [...prev, department]
    );
  };

  const handlePermissionChange = (permission: keyof typeof permissions) => {
    setPermissions((prev) => ({ ...prev, [permission]: !prev[permission] }));
  };

  const departments = [
    { id: "sales", label: "Sales" },
    { id: "production", label: "Production" },
    { id: "Accounts", label: "Accounts" },
    { id: "R&D", label: "Research and Development (R&D)" },
  ];

  return (
    <form
      className="max-w-screen px-1 py-4  dark:text-black rounded-lg space-y-4 lg:mb-10 mb-1"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full">
        <div className="grid lg:grid-cols-2 grid-cols-1 max-w-screen gap-8">
          <div className="lg:text-xl text-sm flex flex-col gap-6 justify-start shadow-lg bg-white lg:px-20 px-2 lg:py-10 py-2 rounded-xl">
            <h2 className="text-2xl font-semibold text-start">User Details</h2>
            <div className="flex justify-start">
              <div className="relative w-24 h-24 border-2 border-gray-400 rounded-full">
                <img
                  src={imagePreview || "/default-user.png"}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border"
                />
                <label
                  htmlFor="profileImage"
                  className="absolute bottom-0 left-0 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center cursor-pointer text-sm font-bold"
                >
                  +
                </label>
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
            <div>
              <input
                type="text"
                placeholder="Username"
                {...register("username")}
                className="w-full border rounded px-4 py-2 border-gray-400"
              />
              <p className="text-red-500 text-sm">{errors.username?.message}</p>
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                className="w-full border rounded px-4 py-2 border-gray-400"
              />
              <p className="text-red-500 text-sm">{errors.email?.message}</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 border rounded border-gray-400">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password")}
                  className="w-full outline-none rounded px-4 py-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-gray-700 text-lg duration-200 p-2 border-none"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              <p className="text-red-500 text-sm">{errors.password?.message}</p>
            </div>
            <div>
              <input
                type="text"
                placeholder="Employee ID"
                {...register("employeeId")}
                className="w-full border rounded px-4 py-2 border-gray-400"
              />
              <p className="text-red-500 text-sm">{errors.employeeId?.message}</p>
            </div>
            <div className="w-full font-semibold text-gray-600">
              <div className="flex justify-start items-center gap-4 text-sm">
                <p className="w-fit font-semibold lg:text-lg text-sm">User Type:</p>
                <select
                  value={userType}
                  required
                  onChange={handleChangeUserType}
                  className="w-fit px-5 py-2 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0A2975]"
                >
                  <option value="user">User</option>
                  <option value="subadmin">Sub Admin</option>
                </select>
              </div>
              {userType === "subadmin" ? (
                <div className="mt-5">
                  {departments.map((department) => (
                    <div className="flex gap-2 items-center" key={department.id}>
                      <input
                        id={department.id}
                        type="checkbox"
                        checked={selectedDepartments.includes(department.id)}
                        onChange={() => handleDepartmentChange(department.id)}
                      />
                      <label
                        htmlFor={department.id}
                        className="text-lg font-semibold text-gray-500"
                      >
                        {department.label}
                      </label>
                    </div>
                  ))}
                  {selectedDepartments.length === 0 && (
                    <p className="text-red-500 text-sm">At least one department is required</p>
                  )}
                </div>
              ) : (
                <div className="mt-5">
                  <div className="flex gap-3 items-center">
                    <label className="lg:text-lg text-sm font-semibold">Designation:</label>
                    <div>
                      <input
                        type="text"
                        placeholder="Designation"
                        {...register("designation")}
                        className="w-fit border rounded px-4 py-2 border-gray-400 lg:text-lg text-sm"
                      />
                      <p className="text-red-500 text-sm">{errors.designation?.message}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col h-full gap-6 justify-start items-start">
            <div className="flex flex-col gap-2 items-start bg-white lg:px-20 px-2 lg:py-10 py-4 rounded-xl shadow-xl min-w-full max-h-fit">
              <h2 className="text-2xl font-semibold text-start mb-5">Permissions of Actions</h2>
              <select
                value={resource}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0A2975]"
              >
                <option value="none">None</option>
                <option value="orders">Orders</option>
                <option value="repairs">Repairs</option>
              </select>
              {resource === "orders" && (
                <div className="flex flex-col gap-4 text-gray-500">
                  <div className="flex gap-2 items-center w-[250px]">
                    <input
                      type="checkbox"
                      id="readOnly"
                      checked={permissions.readOnly}
                      onChange={() => handlePermissionChange("readOnly")}
                    />
                    <label className="text-lg font-semibold text-gray-500" htmlFor="readOnly">
                      Read Only
                    </label>
                  </div>
                  <div className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      id="create"
                      checked={permissions.create}
                      onChange={() => handlePermissionChange("create")}
                    />
                    <label htmlFor="create" className="text-lg font-semibold">
                      Create POs
                    </label>
                  </div>
                  <div className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      id="edit"
                      checked={permissions.edit}
                      onChange={() => handlePermissionChange("edit")}
                    />
                    <label htmlFor="edit" className="text-lg font-semibold">
                      Update POs
                    </label>
                  </div>
                  <div className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      id="delete"
                      checked={permissions.delete}
                      onChange={() => handlePermissionChange("delete")}
                    />
                    <label htmlFor="delete" className="text-lg font-semibold">
                      Delete POs
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading || (userType === "subadmin" && selectedDepartments.length === 0) }
        className="w-fit lg:px-16 px-6 bg-[#0A2975] text-white py-2 rounded hover:bg-blue-900 active:bg-blue-950 duration-200 cursor-pointer font-bold mt-10 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create User"}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {success && <p className="text-green-500 text-sm mt-2">User created successfully!</p>}
    </form>
  );
};

export default UserDetailsForm;
