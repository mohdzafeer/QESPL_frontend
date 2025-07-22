import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  getUserWithWithOp as fetchUserWithOp,
  apiDeleteUser,
  apiSearchUser,
  adminChangePassword,
} from "../../utils/api";

// Define interfaces
interface User {
  _id: string;
  username: string;
  employeeId: string;
  email: string;
  Isverified: boolean;
  orderCount: number;
  profilePicture?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UserState {
  users: User[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  passwordChangeStatus: "idle" | "loading" | "succeeded" | "failed";
  passwordChangeMessage: string | null;
}

interface UserResponse {
  success: boolean;
  data: User[];
  pagination: Pagination;
}

const initialState: UserState = {
  users: [],
  pagination: null,
  loading: false,
  error: null,
  passwordChangeStatus: "idle",
  passwordChangeMessage: null,
};

interface ChangePasswordResponse {
  success: boolean;  
  message: string;
}

//// create interface for the change password
interface ChangePasswordPayload {
  email: string; // Assuming email is needed for the change password operation
  oldPassword: string;
  newPassword: string;
}

// Define the async thunk
export const getUserWithWithOp = createAsyncThunk<
  UserResponse,
  { page: number; limit: number },
  { rejectValue: string }
>("auth/getUserWithWithOp", async (pagination, { rejectWithValue }) => {
  try {
    const response = await fetchUserWithOp(pagination);
    return response;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch users"
    );
  }
});

export const deleteUser = createAsyncThunk<
  UserResponse,
  string,
  { rejectValue: string }
>("auth/deleteUser", async (userId, { rejectWithValue }) => {
  try {
    const response = await apiDeleteUser(userId);
    return response;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to delete user"
    );
  }
});

///// create async thunk for change password
export const changePassword = createAsyncThunk<
  ChangePasswordResponse | undefined,
  ChangePasswordPayload,
  { rejectValue: string }
>(
  "adminUser/changePassword",
  async ({ email, oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await adminChangePassword({
        email,
        oldPassword,
        newPassword,
      });
      if (!response.success) {
        return rejectWithValue(response.message || "Failed to change password");
      }
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to change password"
      );
    }
  }
);

// Define the async thunk for searching users
// This thunk will take a query string and return the search results
export const searchAdminUser = createAsyncThunk<
  UserResponse,
  { query: string },
  { rejectValue: string }
>(
  "auth/searchAdminUser",
  async ({ query }: { query: string }, { rejectWithValue }) => {
    try {
      if (!query || query.trim() === "") {
        return rejectWithValue("Query cannot be empty");
      }
      const response = await apiSearchUser(query);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to search users"
      );
    }
  }
);

// Create the slice
export const userSlice = createSlice({
  name: "adminUser",
  initialState,
  reducers: {
    adminGetUsers: (state) => {
      state.users = [];
      state.pagination = null;
      state.loading = false;
      state.error = null;
    },
    resetUsers: (state) => {
      state.users = [];
      state.pagination = null;
      state.loading = false;
      state.error = null;
    },
    resetPasswordChangeState: (state) => {
      state.passwordChangeStatus = "idle";
      state.passwordChangeMessage = null;
      state.error = null;
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserWithWithOp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUserWithWithOp.fulfilled,
        (
          state,
          action: PayloadAction<{
            success: boolean;
            data: User[];
            pagination: Pagination;
          }>
        ) => {
          state.loading = false;
          state.users = action.payload.data;
          state.pagination = action.payload.pagination;
          state.error = null;
        }
      )
      .addCase(getUserWithWithOp.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch users";
      }) /// delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteUser.fulfilled,
        (state, action: PayloadAction<UserResponse>) => {
          state.loading = false;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          state.users = state.users.filter(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (user) => user._id !== (action.payload.data as any)._id
          );
          if (state.pagination) {
            state.pagination.total -= 1;
            state.pagination.totalPages = Math.ceil(
              state.pagination.total / state.pagination.limit
            );
          }
          state.error = null;
        }
      )
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to delete user";
      })
      .addCase(changePassword.pending, (state) => {
        state.passwordChangeStatus = "loading";
        state.passwordChangeMessage = null;
        state.error = null;
      })
      .addCase(
        changePassword.fulfilled,
        (state, action: PayloadAction<ChangePasswordResponse | undefined>) => {
          state.passwordChangeStatus = "succeeded";
          state.passwordChangeMessage = action.payload?.message || "Password changed successfully";
          state.error = null;
        }
      )
      .addCase(changePassword.rejected, (state, action) => {
        state.passwordChangeStatus = "failed";
        state.passwordChangeMessage = action.payload ? String(action.payload) : "Failed to change password";
        state.error = action.payload ? String(action.payload) : "Failed to change password";
      })

      //// for search user  profile
      .addCase(searchAdminUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        searchAdminUser.fulfilled,
        (state, action: PayloadAction<UserResponse>) => {
          state.loading = false;
          state.users = action.payload.data;
          state.pagination = action.payload.pagination;
          state.error = null;
        }
      )
      .addCase(searchAdminUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to search users";
      });
  },
});

export const { adminGetUsers ,resetUsers, resetPasswordChangeState} = userSlice.actions;
export default userSlice.reducer;
