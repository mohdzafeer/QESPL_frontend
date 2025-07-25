/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/api.ts
// Custom parseJwt function to decode JWT
const parseJwt = (token: string): any => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    throw new Error("Invalid token");
  }
};

import axios from "axios";

const api = axios.create({
  // baseURL: "http://13.233.137.149:4000",
  baseURL: "http://localhost:8080/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

export const fetchAllOrders = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await api.get("/order/api/get-all-orders", {
      params: { page, limit },
      withCredentials: true,
    });
    console.log(response, "api call");
    const orders = response?.data?.data?.orders || [];
    const pagination = response?.data?.data?.pagination || {
      currentPage: 1,
      totalPages: 1,
      totalOrders: 0,
      limit: 10,
    };
    return { orders, pagination };
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

export const deleteOrders = async (orderId: string) => {
  try {
    const response = await api.delete(`/order/api/delete-order/${orderId}`, {
      withCredentials: true,
    });
    console.log(response, "api call");
    return { orderId };
  } catch (error) {
    console.error("Delete order error:", error);
    throw error;
  }
};

/// search orders by query parameter
export const searchOrderApi = async (
  query: string,
  startDate?: string,
  endDate?: string,
  status?: string
) => {
  const response = await api.get(`/order/api/search-order`, {
    withCredentials: true,
    params: {
      query,
      startDate,
      endDate,
      status,
    },
  });
  return response.data;
};

///// for the auth apis end point
/**
 * @typedef {Object} UserData
 * @property {string} username
 * @property {string} emimport { createOrder, fetchOrderById, fetchAllOrders, updateOrder, seachOrderApi, adminSignup, adminSigIn } from '../utils/api';ail
 * @property {string} password
 * @property {string} role
 */

export const adminSignup = async (UserData: {
  username: string;
  email: string;
  password: string;
  userType: string;
}) => {
  const response = await api.post("/user/api/admin-signup", UserData);
  return response.data;
};

export const adminSigIn = async (UserData: {
  email: string;
  password: string;
}) => {
  const response = await api.post("/user/api/admin-sigin", UserData, {
    withCredentials: true,
  });
  const { token } = response.data;
  if (token) {
    localStorage.setItem("jwt", token);
  }
  return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getUserWithWithOp = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const response = await api.get(
    `/user/api/admin-get-all-user?page=${page}&limit=${limit}`,
    {
      withCredentials: true,
    }
  );
  console.log("getUserWithWithOp response:", response.data);
  return response.data;
};

export const apiDeleteUser = async (userId: string) => {
  const response = await api.delete(`/user/api/admin-delete/${userId}`, {
    withCredentials: true,
  });
  return response.data;
};

export const apiSearchUser = async (query: string) => {
  const response = await api.get(`/user/api/admin-user-profie`, {
    params: { query },
    withCredentials: true,
  });
  return response.data;
};

export const adminChangePassword = async (passwordChange: {
  email: string;
  oldPassword: string;
  newPassword: string;
}) => {
  const response = await api.patch(
    `/user/api/admin-user-change-password`,
    passwordChange,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

//// craerte interface for the subAdmin Create normal users
interface SubAdminFormData {
  username: string;
  email: string;
  password: string;
  department: string;
  userType: "subadmin";
  profilePicture?: File;
  permissions?: { resource: "none" | "orders" | "repairs"; actions: string[] };
  allowedFields?: string[];
  employeeId: string;
  designation: string;
}

interface UserFormData {
  username: string;
  email: string;
  password: string;
  userType: "user";
  employeeId?: string;
  designation?: string;
  profilePicture?: File;
  permissions?: { resource: "none" | "orders" | "repairs"; actions: string[] };
  allowedFields?: string[];
}

interface PermissionData {
  userId: string;
  resource: "none" | "orders" | "repairs";
  actions: string[];
  allowedFields?: string[];
}

interface DecodedToken {
  role: string;
  [key: string]: any;
}

//// create subadmin funcation for the handles

export const createSubAdmin = async (data: SubAdminFormData) => {
  console.log(data,"hblsjcbj")
  try {
    // Retrieve and validate JWT token
    const token = localStorage.getItem("jwt");
    if (!token) {
      throw new Error("No authentication token found");
    }
    // Decode and validate token
    let decoded: DecodedToken;
    try {
      decoded = parseJwt(token); // Assume parseJwt is defined elsewhere
      const allowedRoles = ["admin"];
      if (!allowedRoles.includes(decoded.userType)) {
        throw new Error("Unauthorized: Only admin can create sub-admins");
      }
    } catch (error) {
      console.error("Token validation error:", error);
      throw new Error("Invalid token");
    }
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("department", data.department);
    formData.append("userType", data.userType);
    if (data.employeeId) formData.append("employeeId", data.employeeId);
  if (data.designation) formData.append("desgination", data.designation);
    if (data.profilePicture) {
      formData.append("profilePicture", data.profilePicture);
    }
    // Create sub-admin
    const response = await api.post(
      "/user/api/admin-create-subadmin",
      formData,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    // Assign permissions if provided
    if (data.permissions && data.permissions.resource !== "none") {
      const permissionData = {
        userId: response.data.user.id,
        resource: data.permissions.resource,
        actions: data.permissions.actions,
      };
      await api.post("/user/api/admin-assign-permission", permissionData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return response.data;
  } catch (error: any) {
    console.error("Create subadmin error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create sub-admin"
    );
  }
};

///// create user funcations for handles
export const createUser = async (data: UserFormData) => {
  const token = localStorage.getItem("jwt");
  if (!token) throw new Error("No authentication token found");

  let decoded: DecodedToken;
  try {
    decoded = parseJwt(token);
    const allowedRoles = ["admin", "subadmin"];
    if (!allowedRoles.includes(decoded.userType)) {
      throw new Error("Unauthorized: Only admin or subadmin can create users");
    }
  } catch (error) {
    console.error("Token validation error:", error);
    throw new Error("Invalid token jgghsdsadusaud");
  }
  const formData = new FormData();
  formData.append("username", data.username);
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("userType", data.userType);
  if (data.employeeId) formData.append("employeeId", data.employeeId);
  if (data.designation) formData.append("desgination", data.designation); // Match backend typo
  if (data.profilePicture)
    formData.append("profilePicture", data.profilePicture);

  try {
    const response = await api.post("/user/api/admin-create-user", formData, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    // Assign permissions if provided
    if (data.permissions && data.permissions.resource !== "none") {
      const permissionData = {
        userId: response.data.user.id,
        resource: data.permissions.resource,
        actions: data.permissions.actions,
      };
      console.log(response.data);
      await api.post("/user/api/admin-assign-permission", permissionData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return response.data;
  } catch (error: any) {
    console.error("Create subadmin error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create sub-admin"
    );
  }
};

////// create permission handles funcations

export const createPermission = async (data: PermissionData) => {
  const token = localStorage.getItem("jwt");
  if (!token) throw new Error("No authentication token found");
  let decoded: DecodedToken;
  try {
    decoded = parseJwt(token);
    const allowedRoles = ["admin", "subadmin"];
    if (!allowedRoles.includes(decoded.role)) {
      throw new Error(
        "Unauthorized: Only admin or subadmin can create permissions"
      );
    }
  } catch (error) {
    console.error("Token validation error:", error);
    throw new Error("Invalid token");
  }
  try {
    const response = await api.post("/user/api/permissions", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Create permission error:", error);
    throw error;
  }
};

export const createOrder = async (orderData: any) => {
  const response = await api.post("order/api/order-create-api", orderData);
  return response.data;
};

export const fetchRecycleBinOrdersApi = async () => {
  const response = await api.get("/order/api/user-recycle-bin-order/");
  console.log(response, "api call calling");
  return response;
};

////
export const restoreOps = async (orderIds: string[]) => {
  const response = await api.post("/order/api/restore-orders/", {
    ids: orderIds,
  });
  return response.data;
};
