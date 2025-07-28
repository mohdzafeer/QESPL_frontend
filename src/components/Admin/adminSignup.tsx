import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register as registerUser, logout } from "../../store/Slice/authSlice";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store/store";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../validationComponent/validationSchema"; // Adjust the import path
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  userType: string;
  employeeId:string;
}

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(registerSchema) as any,
    // resolver: yupResolver(registerSche
    mode: "onChange", // Validate on every change
    defaultValues: { userType: "admin" }, // Set default userType
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(logout()); // Reset on mount
    return () => {
      dispatch(logout()); // Reset on unmount
    };
  }, [dispatch]);

  useEffect(() => {
    console.log("Auth State:", { status, error, user });
    if (status === "succeeded" && user) {
      console.log("Registration successful, user:", user);
      navigate("/login");
    } else if (status === "failed" && error) {
      console.log(error, "show this");
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      // Reset auth state after displaying the toast
      setTimeout(() => {
        dispatch(logout());
      }, 6000);
    }
  }, [status, error, user, dispatch, navigate]);

  const onSubmit = (data: RegisterFormData) => {
    dispatch(registerUser(data));
  };

  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="min-h-screen bg-white flex items-center justify-center lg:px-48 lg:py-10 md:px-20 px-10 pt-16">
      <div className="wrapper flex flex-col md:flex-row items-center justify-between lg:h-[800px] md:h-[800px] h-fit  bg-white custom-shadow w-full overflow-hidden rounded-xl">
        <div className="flex flex-col items-center justify-center min-h-[50vh] md:min-h-screen bg-white w-full md:w-1/2 py-6 px-4">
          <h1 className="text-2xl font-bold absolute top-0 left-0 p-4">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-24 h-auto mb-2 md:w-30"
            />
          </h1>
          <h2 className="text-3xl md:text-5xl w-full font-semibold tracking-tight text-black mb-5 text-start md:text-left">
            Sign up
          </h2>
          <div className="w-full mb-5">
            <p className="text-sm text-start">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="font-semibold cursor-pointer hover:underline"
              >
                Sign In
              </span>
            </p>
          </div>
          <form
            onSubmit={handleSubmit(
              onSubmit as unknown as Parameters<typeof handleSubmit>[0]
            )}
            className="w-full max-w-sm"
          >
            <input type="hidden" {...register("userType")} />
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter Username"
                className="w-full p-3 border outline-none rounded-xl text-base "
                {...register("username")}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 border rounded-xl  text-base "
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter your Employee Id"
                className="w-full p-3 border rounded-xl  text-base "
                {...register("employeeId")}
              />
              {errors.employeeId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.employeeId?.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <div className="flex items-center border rounded-xl">
                <input
                  type={showPassword ? 'text':'password'}
                  placeholder="Enter your password"
                  className="w-full p-3 outline-none rounded text-base "
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-gray-700 text-lg   duration-200 p-2 border-none"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="min-w-full p-3 mt-5 bg-[var(--theme-color)] text-white rounded text-base font-medium hover:bg-blue-800 transition-colors cursor-pointer "
              // disabled={status === "loading" || !isValid}
            >
              {status === "loading" ? "Signing Up..." : "Sign-Up"}
            </button>
          </form>
          {/* <div>
            <p className="text-sm mt-10">
              Existing User? Login{" "}
              <span
                onClick={() => navigate("/login")}
                className="font-semibold cursor-pointer hover:underline"
              >
                here
              </span>
            </p>
          </div> */}
        </div>
        <div className="sider lg:inline-flex md:inline-flex hidden flex-col items-center justify-center min-h-[50vh] md:min-h-screen bg-gray-100 w-full md:w-1/2 py-6 px-4">
          <div className="img w-full max-w-md text-center">
            <img
              src="/images/img1.png"
              alt="Illustration"
              className="mx-auto mb-4 w-full h-auto max-w-[300px] md:max-w-[400px]"
            />
            <h3 className="text-3xl md:text-3xl font-semibold tracking-tight text-black mb-4">
              Sign up for managing users
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              Sign up to manage our company purchase orders efficiently. Gain
              access to powerful tools for tracking, organizing, and
              streamlining all your procurement processes in one place.
            </p>
          </div>
          <p className="text-sm text-gray-600 md:bottom-5 md:right-0">
            © 2025 Powered By QESPL
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
