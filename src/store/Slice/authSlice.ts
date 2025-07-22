/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// store/Slice/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminSigIn, adminSignup } from "../../utils/api";
import type { RootState } from "../store";


interface LoginPayload {
  email: string;
  password: string;
}

interface UserData {
  username: string;
  email: string;
  password: string;
  userType: string;
  profilePicture?: string;
}

interface AuthState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any | null;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const statusCodeMessages: { [key: number]: string } = {
  400: "Invalid email or password",
  401: "Unauthorized: Please check your credentials",
  403: "Forbidden: You do not have access",
  500: "Server error: Please try again later",
  409: "Email already exists",
};

export const register = createAsyncThunk(
  "auth/register",
  async (userData: UserData, { rejectWithValue }) => {
    try {
      const result = await adminSignup(userData);
      return result; // Adjust based on API response structure
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as any).response === "object" &&
        (error as any).response !== null &&
        "data" in (error as any).response
      ) {
        const errResponse = (error as any).response;
        const errorMessage =
          errResponse.data?.message ||
          errResponse.data?.error ||
          errResponse.data?.errors?.[0]?.msg ||
          statusCodeMessages[errResponse.status] ||
          `Request failed with status code ${errResponse.status}`;
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await adminSigIn({
        email: payload.email,
        password: payload.password,
      });
      if (!response.success) {
        return rejectWithValue(response.message || "Login failed");
      }
      localStorage.setItem("jwt", response.token);
      return response;
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof (error as any).response === "object" &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).response !== null &&
        "data" in (error as any).response
      ) {
        const errResponse = (error as any).response;
        const errorMessage =
          errResponse.data?.message ||
          errResponse.data?.error ||
          errResponse.data?.errors?.[0]?.msg ||
          statusCodeMessages[errResponse.status] ||
          `Request failed with status code ${errResponse.status}`;
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("jwt") || null,
    status: "idle",
    error: null,
  } as AuthState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("jwt");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user || null;
      })
      .addCase(register.rejected, (state, action) => {
        console.log(state, "chekc");
        state.status = "failed";
        state.error = action.payload as string;
      })
     
  },
});

export const selectLoggedInUser = (state: RootState) => state.auth.user;
export const { logout } = authSlice.actions;
export default authSlice.reducer;
