import * as yup from "yup";

//// login form validation funcation using yup
export const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

//// registration form validations funcations  using yup

export const registerSchema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
      "Password must contain at least one letter and one number"
    ),
});


//// user validation form

export const useValidationForm = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Minimum 8 characters")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "At least one special character"),
  employeeId: yup.string().optional(),
  userType: yup
    .string()
    .oneOf(["user", "subadmin"], "Invalid user type")
    .required("User type is required"),
  designation: yup.string().when("userType", {
    is: "user", // Simplified condition (no function needed for simple equality)
    then: (schema) => schema.required("Designation is required for user"),
    otherwise: (schema) => schema.optional(),
  }),
});


