// recycleBinSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchRecycleBinOrdersApi,
  restoreOps,
  deleteOrdersMultiple1,
  deleteOrders,
} from "../../utils/api"; // Adjust path to your API file
import { set } from "lodash";
import { toast } from "react-toastify";


// Define the shape of the state
interface RecycleBinState {
  orders: DeletedData[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  message?: string | null; // Optional message for success or error feedback
}


// Define the shape of the DeletedData (mapped from API response)
interface DeletedData {
  PO_Number: string; // Maps to orderNumber
  id: string; // Maps to generatedBy.employeeId
  name: string; // Maps to generatedBy.user.username
  image: string; // Default or from API if available
  company: string; // Maps to companyName
  Client: string; // Maps to clientName
  Date: string; // Maps to createdAt or estimatedDispatchDate
  Status: "completed" | "delayed" | "pending" | "rejected"; // Maps to status
}


// Initial state
const initialState: RecycleBinState = {
  orders: [], // Always initialize as an array
  status: "idle",
  error: null,
};


// Transform API data to DeletedData format
// eslint-disable-next-line @typescript-eslint/no-explicit-any


// Async thunk for fetching recycle bin orders


export const softDeleteOrder = createAsyncThunk(
  "recycleBin/softDeleteOrder",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await deleteOrders(orderId);
      if (response.success) {
        return { orderId, message: response.message };
      }
      return rejectWithValue(response.message || "Failed to soft delete order");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to soft delete order"
      );
    }
  }
);






export const getRecycleBinOrders = createAsyncThunk(
  "recycleBin/getRecycleBinOrders",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (orderData: any, { rejectWithValue }) => {
    try {
      const response = await fetchRecycleBinOrdersApi();
      if (response && Array.isArray(response.data.data)) {
        return response.data.data; // Return the array of orders
      }
      return rejectWithValue("API response is invalid or missing data");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch recycle bin orders"
      );
    }
  }
);


// Async thunk for restoring orders
export const restoreOrdersMultiple = createAsyncThunk(
  "recycleBin/restoreOrdersMultiple",
  async (orderIds: string[], { rejectWithValue }) => {
    try {
      const response = await restoreOps(orderIds);
      if (response.success) {
        toast.success("Restoring PO......");
        setTimeout(()=>{
        window.location.reload();
      },3000)
        return { orderIds, message: response.message };
      }
      
      return rejectWithValue(response.message || "Failed to restore orders");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to restore orders"
      );
    }
  }
);


// Async thunk for deleting multiple orders
export const deleteOrdersMultiple = createAsyncThunk(
  "recycleBin/deleteOrdersMultiple",
  async (orderIds: string[], { rejectWithValue }) => {
    try {
      const response = await deleteOrdersMultiple1(orderIds);
      if (response.success) {
        return { orderIds, message: response.message };
      }
      return rejectWithValue(response.message || "Failed to delete orders");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete orders"
      );
    }
  }
);


// Define the initial state for the slice
// This state will be used to manage the recycle bin orders




// Create the slice
const recycleBinSlice = createSlice({
  name: "recycleBin",
  initialState,
  reducers: {
    resetRecycleBinState: (state) => {
      state.orders = [];
      state.status = "idle";
      state.error = null;
      state.message = null; // Reset message if it exists
    },
    resetRecycleBinStatus: (state) => {
      // Only reset status, error, and message, not orders
      state.status = "idle";
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle getRecycleBinOrders
      .addCase(getRecycleBinOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getRecycleBinOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
        // state.orders = action.payload;
      })
      .addCase(getRecycleBinOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.orders = []; // Ensure orders is an array on error
      })
      .addCase(restoreOrdersMultiple.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(restoreOrdersMultiple.fulfilled, (state, action) => {
        state.orders = [...state.orders, ...action.payload.orderIds];
        state.status = "succeeded";
      })
      .addCase(restoreOrdersMultiple.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        console.error("Restore orders failed:", action.payload);
      })
      /// create extra reducer for multiple and single delete
      .addCase(deleteOrdersMultiple.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteOrdersMultiple.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (order) => !action.payload.orderIds.includes(order.PO_Number)
        );
        state.status = "succeeded";
      })
      .addCase(deleteOrdersMultiple.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        console.error("Delete orders failed:", action.payload);
      })
      ////// soft delete order
      .addCase(softDeleteOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;


      }).addCase(softDeleteOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = state.orders.filter(
          (order) => order.PO_Number !== action.payload.orderId
        );
      })
      .addCase(softDeleteOrder.rejected, (state, action) => {
        console.error("Soft delete order failed:", action.payload);
        state.status = "failed";
        state.error = action.payload as string;
        state.message = action.payload as string;
      })
  },
});


// Export actions and reducer
export const { resetRecycleBinState,resetRecycleBinStatus } = recycleBinSlice.actions;
export default recycleBinSlice.reducer;