/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FiEye, FiEyeOff } from "react-icons/fi";
// import { useValidationForm } from "../../validationComponent/validationSchema";
import { useDispatch, useSelector } from "react-redux";
import { useValidationForm } from "../validationComponent/validationSchema";
import { createNormalUser,  resetUserState } from "../../store/Slice/subadminSlice";
import type { AppDispatch, RootState } from "../../store/store";
// import type { AppDispatch ,RootState} from "../../../store/store";
// import { createSubAdminUser, createNormalUser, resetUserState } from "../../../store/Slice/subadminSlice";

interface FormData {
  username: string;
  email: string;
  password: string;
  employeeId?: string;
  designation?: string;
}

const SubadminAddUserForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<"user" | "subadmin">("user");
  const [imagePreview, setImagePreview] = useState<string>(
    "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
  );
  const [resource, setResource] = useState<"none" | "orders" | "repairs">("none");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [permissions, setPermissions] = useState({
    readOnly: true,
    create: false,
    update: false,
    delete: false,
  });
  const [profileFile, setProfileFile] = useState<File | undefined>(undefined);

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success } = useSelector((state: RootState) => state.user);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(useValidationForm),
    context: { userType },
    defaultValues: { userType: "user" },
  });

  useEffect(() => {
    if (success) {
      reset();
      setUserType("user");
      setSelectedDepartment("");
      setResource("none");
      setPermissions({ readOnly: true, create: false, update: false, delete: false });
      setProfileFile(undefined);
      setImagePreview("https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png");
      setTimeout(() => dispatch(resetUserState()), 3000);
    }
  }, [success, dispatch, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const formData = {
        username: data.username,
        email: data.email,
        password: data.password,
        userType:"user",
        profilePicture: profileFile,
        employeeId: data.employeeId,
        designation: data.designation,
        department: selectedDepartment,
        ...(resource !== "none" && {
          permissions: {
            resource,
            actions: Object.entries(permissions)
              .filter(([_, value]) => value)
              .map(([key]) => key),
          },
        }),
      };
      if (userType === "user") {
        await dispatch(createNormalUser(formData)).unwrap();
      } else {
        // await dispatch(createNormalUser(formData)).unwrap();
      }
    } catch (err: any) {
      console.error("Form submission error:", err.message);
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
      setPermissions({ readOnly: true, create: false, update: false, delete: false });
    }
  };

  const handleChangeUserType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as "user" | "subadmin";
    setUserType(selected);
    setSelectedDepartment("");
  };

  const handleDepartmentChange = (departmentId: string) => {
    setSelectedDepartment(departmentId);
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
      className="max-w-screen px-1 py-4  rounded-lg space-y-4 lg:mb-10 mb-1"
      onSubmit={handleSubmit(onSubmit)}
    > 
      <h1 className="text-2xl font-bold uppercase text-gray-800 dark:text-white mb-4">Create New User</h1>
      <div className="w-full">
        <div className="grid lg:grid-cols-2 grid-cols-1 max-w-screen gap-8">
          <div className="lg:text-xl text-sm flex flex-col gap-6 justify-start shadow-lg bg-white dark:bg-zinc-800 lg:px-20 px-2 lg:py-10 py-2 rounded-xl">
            <h2 className="text-2xl font-semibold text-start">User Details</h2>
            <div className="flex justify-between">
              <div className="relative w-24 h-24 border-2 border-gray-400 rounded-full">
                <img
                  src={imagePreview}
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
              {/* <div className="flex justify-start items-center gap-4 text-sm">
                <p className="w-fit font-semibold lg:text-lg text-sm">User Type:</p>
                <select
                  value={userType}
                  onChange={handleChangeUserType}
                  className="w-fit px-5 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-white bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#0A2975]"
                >
                  <option value="user">User</option>
                  <option value="subadmin">Sub Admin</option>
                </select>
              </div> */}
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
            <div className="w-full font-semibold text-gray-600 dark:text-white">
              

              {/* These fields are now always visible */}
              <div className=" dark:text-white">
                <input
                  type="text"
                  placeholder="Employee ID"
                  {...register("employeeId")}
                  className="w-full border rounded px-4 py-2 border-gray-400"
                />
                <p className="text-red-500 text-sm">{errors.employeeId?.message}</p>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Designation"
                  {...register("designation")}
                  className="w-full border rounded px-4 py-2 mt-5 border-gray-400"
                />
                <p className="text-red-500 text-sm">{errors.designation?.message}</p>
              </div>

              <div className="mt-5">
                <p className="w-fit font-semibold lg:text-lg text-sm mb-2">Department:</p>
                {departments.map((department) => (
                  <div className="flex gap-2 items-center" key={department.id}>
                    <input
                      id={department.id}
                      type="radio"
                      name="department"
                      value={department.id}
                      checked={selectedDepartment === department.id}
                      onChange={() => handleDepartmentChange(department.id)}
                      className="w-4 h-4"
                    />
                    <label
                      htmlFor={department.id}
                      className="text-lg font-semibold text-gray-500"
                    >
                      {department.label}
                    </label>
                  </div>
                ))}
                {selectedDepartment === "" && (
                  <p className="text-red-500 text-sm">A department is required</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col h-full gap-6 justify-start items-start">
            <div className="flex flex-col gap-2 items-start bg-white dark:bg-zinc-800 lg:px-20 px-2 lg:py-10 py-4 rounded-xl shadow-xl min-w-full max-h-fit">
              <h2 className="text-2xl font-semibold text-start mb-5">Permissions of Actions</h2>
              <select
                value={resource}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md text-gray-700 dark:text-white bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#0A2975]"
              >
                <option value="none">None</option>
                <option value="orders">Orders</option>
                <option value="repairs">Repairs</option>
              </select>
              {resource !== "none" && (
                <div className="flex flex-col gap-4 text-gray-500 dark:text-white">
                  <div className="flex gap-2 items-center w-[250px]">
                    <input
                      type="checkbox"
                      id="readOnly"
                      checked={permissions.readOnly}
                      onChange={() => handlePermissionChange("readOnly")}
                    />
                    <label className="text-lg font-semibold text-gray-500 dark:text-white" htmlFor="readOnly">
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
                      Create
                    </label>
                  </div>
                  <div className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      id="update"
                      checked={permissions.update}
                      onChange={() => handlePermissionChange("update")}
                    />
                    <label htmlFor="update" className="text-lg font-semibold">
                      Update
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
                      Delete
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
        disabled={loading || selectedDepartment === ""}
        className="w-fit lg:px-16 px-6 bg-[#0A2975] text-white py-2 rounded hover:bg-blue-900 active:bg-blue-950 duration-200 cursor-pointer font-bold mt-10 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create User"}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {success && <p className="text-green-500 text-sm mt-2">User created successfully!</p>}
    </form>
  );
};

export default SubadminAddUserForm;