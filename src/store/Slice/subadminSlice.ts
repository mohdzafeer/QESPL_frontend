




import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { createSubAdmin, createUser, createPermission } from "../../utils/api";

// Define interfaces
interface SubAdminFormData {
  username: string;
  email: string;
  password: string;
  department: string;
  userType: "subadmin";
  profilePicture?: File;
  permissions?: { resource: "none" | "orders" | "repairs"; actions: string[] };
  allowedFields?: string[];
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

interface User {
  id: string;
  username: string;
  email: string;
  userType: string;
  department?: string;
  employeeId?: string;
  designation?: string;
  profilePicture?: string;
}

interface UserState {
  loading: boolean;
  error: string | null;
  success: boolean;
  user: User | null;
}

const initialState: UserState = {
  loading: false,
  error: null,
  success: false,
  user: null,
};

// Thunks
export const createSubAdminUser = createAsyncThunk<
  User,
  SubAdminFormData,
  { rejectValue: string }
>("user/createSubAdminUser", async (data, { rejectWithValue }) => {
  try {
    const response = await createSubAdmin(data);
    return response.user;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create subadmin";
    return rejectWithValue(message);
  }
});

export const createNormalUser = createAsyncThunk<
  User,
  UserFormData,
  { rejectValue: string }
>("user/createNormalUser", async (data, { rejectWithValue }) => {
  try {
    const response = await createUser(data);
    return response.user;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create user";
    return rejectWithValue(message);
  }
});

export const createUserPermission = createAsyncThunk<
  void,
  PermissionData,
  { rejectValue: string }
>("user/createUserPermission", async (data, { rejectWithValue }) => {
  try {
    await createPermission(data);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create permission";
    return rejectWithValue(message);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSubAdminUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        createSubAdminUser.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.success = true;
          state.user = action.payload;
        }
      )
      .addCase(
        createSubAdminUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Unknown error";
        }
      )
      .addCase(createNormalUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        createNormalUser.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.success = true;
          state.user = action.payload;
        }
      )
      .addCase(
        createNormalUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Unknown error";
        }
      )
      .addCase(
        createUserPermission.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload || "Unknown error";
        }
      );
  },
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;



