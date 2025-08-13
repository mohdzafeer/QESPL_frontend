import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store/store";
import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { login, logout } from "../../store/Slice/authSlice";
import { schema } from "../validationComponent/validationSchema"; // Adjust the import path
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  // const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    mode: "onChange", // Validate on every change
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (status === "succeeded" && user) {
      if (user.userType === "admin") {
        // console.log("LoginForm - Redirecting to /admin/dashboard"); // Debug
        navigate("/admin/dashboard");
      } else if (user.userType === "user") {
        // console.log("LoginForm - Redirecting to /user/dashboard"); // Debug
        navigate("/user/dashboard");
      } else if(user.userType === "subadmin") {
        // console.log("LoginForm - Redirecting to /superadmin/dashboard"); // Debug
        navigate("/subadmin/dashboard");
      }
    } else if (status === "failed" && error) {
      const toastOptions = {
        position: "top-right" as const,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      };
      if (error.includes("Invalid email")) {
        toast.error(error, { ...toastOptions, theme: "colored" });
      } else {
        toast.error(error, toastOptions);
      }
      setTimeout(() => {
        dispatch(logout());
      }, 6000);
    }
  }, [status, error, navigate]);

  // useEffect(() => {
  //   dispatch(logout()); // Reset auth state on mount
  // }, [dispatch]);

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    console.log("LoginForm - Form submitted with data:", data); // Debug
    dispatch(login({ email: data.email, password: data.password }));
  };

  const [showPassword, setShowPassword] = useState(false);
  

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-800 flex flex-col lg:flex-row items-center justify-center lg:py-10 lg:px-56 px-10 pt-16">
      <div className="wrapper flex flex-col md:flex-row items-center justify-center bg-gray-100 dark:bg-zinc-900 w-full xl:h-[600px] lg:h-[600px] md:h-[800px] overflow-hidden rounded-2xl custom-shadow">
        <div className="sider lg:inline-flex md:inline-flex flex-col items-center justify-center lg:min-h-[50vh]  hidden  w-full md:w-1/2 py-6 px-4">
          <div className="img w-full max-w-md text-center">
            <img
              src="/images/img2.png"
              alt="Illustration"
              className="mx-auto mb-4 w-full h-auto max-w-[300px] md:max-w-[400px]"
            />
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-black dark:text-white mb-4">
              Sign in for managing users
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
              Sign in to manage our company purchase orders efficiently. Gain
              access to powerful tools for tracking, organizing, and
              streamlining all your procurement processes in one place.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[50vh] md:min-h-screen bg-white dark:bg-zinc-700 w-full md:w-1/2 py-6 px-4">
          <h1 className="text-2xl font-bold absolute top-0 left-0 p-4">
            <img
              src="/images/logo.ico"
              alt="Logo"
              className="w-24 h-auto mb-2 md:w-30 dark:invert"
            />
          </h1>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-black dark:text-white mb-5 text-center w-full ml-5 ">
            Sign in
          </h2>
          <form
            onSubmit={handleSubmit(
              onSubmit as unknown as Parameters<typeof handleSubmit>[0]
            )}
            className="w-full max-w-sm"
          >
            <div className="mb-4">
              <span className="hidden items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset">
                Invalid Email
              </span>
              <input
                type="text"
                placeholder="Enter your email"
                className="w-full p-3 border-2 border-gray-300 rounded-xl text-base focus:outline-none  "
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 dark:text-yellow-400 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <div className="flex border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-black">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full p-3  text-base focus:outline-none "
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-gray-700 dark:text-white text-lg   duration-200 p-2 border-none"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {/* {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )} */}
            </div>
            {error && <p className="text-red-500 dark:text-yellow-400 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className={`min-w-full p-3 bg-[var(--theme-color)]  text-white  text-base font-medium ${status!=='loading' && "hover:bg-blue-800  cursor-pointer"} transition-colors  ${
                status == "loading" &&
                " cursor-not-allowed bg-gray-400"
              }`}
              // disabled={status === "loading" || !isValid}
            >
              {status === "loading" ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-200 absolute bottom-5 right-5">
          © 2025 Powered By QESPL
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
