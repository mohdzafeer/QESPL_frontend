/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchAllOrders,
  deleteOrders,
  createOrder,
  fetchLoginUser,
  updateOrder,
  deleteloginUser,
  getTotalPOCount, // Make sure this is imported
  getCompletedPOCount,
  getPendingPOCount,
  getDelayedPOCount,
  getRejectedPOCount
} from '../../utils/api';

export interface Order {
  _id?: string; // Optional for creation, added by backend
  orderNumber: string;
  clientName: string;
  companyName: string;
  gstNumber: string;
  contact: string;
  address: string;
  zipCode: string;
  products: Array<{
    name: string;
    price: number;
    quantity: number;
    remark?: string;
    _id?: string; // Optional for creation
    createdAt?: string;
    updatedAt?: string;
  }>;
  estimatedDispatchDate: string;
  status?: string; // Optional for creation, set by backend
  orderThrough: {
    username: string;
    employeeId: string;
  };
  isdeleted?: boolean; // Optional for creation
  deletedAt?: string | null; // Optional for creation
  createdAt?: string; // Optional for creation
  updatedAt?: string; // Optional for creation
  generatedBy: {
    username: string;
    employeeId: string;
  };
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  limit: number;
}

interface OrderState {
  orders: Order[];
  pagination: Pagination;
  totalPOCount: number | null; // <-- ADDED: New state property for total PO count
  completedPOCount: number | null; // <-- ADDED: New state property for Completed PO count
  pendingPOCount: number | null; // <-- ADDED: New state property for Completed PO count
  delayedPOCount: number | null; // <-- ADDED: New state property for Completed PO count
  rejectedPOCount: number | null; // <-- ADDED: New state property for Completed PO count
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  message: string | null;
  success: boolean | null;
}

interface DeleteOrderResponse {
  orderId: string;
}

export const fetchOrdersAsync = createAsyncThunk(
  'orders/fetchOrders',
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      return await fetchAllOrders(page, limit);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);



// ----------------------PO Count Thunks---------------------------------------
// New Async Thunk for getTotalPOCount
export const fetchTotalPOCountAsync = createAsyncThunk<
  { total_po_count: number }, // Expected return type from the API
  void, // No arguments needed for this thunk
  { rejectValue: string }
>(
  'orders/fetchTotalPOCount', // This is the action type prefix
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTotalPOCount();
      return response; // response.data will be { total_po_count: 42 }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch total PO count');
    }
  }
);



// New Async Thunk for completedPOCount
export const fetchCompletedPOCountAsync = createAsyncThunk<
  { completed_po_count: number }, // Expected return type from the API
  void, // No arguments needed for this thunk
  { rejectValue: string }
>(
  'orders/fetchCompletedPOCount', // This is the action type prefix
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCompletedPOCount();
      return response; // response.data will be { total_po_count: 42 }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch completed PO count');
    }
  }
);








// New Async Thunk for pendingPOCount
export const fetchPendingPOCountAsync = createAsyncThunk<
  { pending_po_count: number }, // Expected return type from the API
  void, // No arguments needed for this thunk
  { rejectValue: string }
>(
  'orders/fetchPendingPOCount', // This is the action type prefix
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPendingPOCount();
      return response; // response.data will be { total_po_count: 42 }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch Pending PO count');
    }
  }
);



// New Async Thunk for pendingPOCount
export const fetchDelayedPOCountAsync = createAsyncThunk<
  { delayed_po_count: number }, // Expected return type from the API
  void, // No arguments needed for this thunk
  { rejectValue: string }
>(
  'orders/fetchDelayedPOCount', // This is the action type prefix
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDelayedPOCount();
      return response; // response.data will be { total_po_count: 42 }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch Delayed PO count');
    }
  }
);



// New Async Thunk for pendingPOCount
export const fetchRejectedPOCountAsync = createAsyncThunk<
  { rejected_po_count: number }, // Expected return type from the API
  void, // No arguments needed for this thunk
  { rejectValue: string }
>(
  'orders/fetchRejectedPOCount', // This is the action type prefix
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRejectedPOCount();
      return response; // response.data will be { total_po_count: 42 }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to Rejected Delayed PO count');
    }
  }
);

// ----------------------PO Count Thunks---------------------------------------

export const deleteOrder = createAsyncThunk<
  DeleteOrderResponse,
  string,
  { rejectValue: string }
>('orders/deleteOrder', async (orderId, { rejectWithValue }) => {
  try {
    const response = await deleteOrders(orderId);
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to delete order'
    );
  }
});

export const createOrderAsync = createAsyncThunk<
  Order, // Return type
  Order, // Argument type
  { rejectValue: string }
>(
  'orders/createOrder',
  async (orderData: Order, { rejectWithValue }) => {
    try {
      const response = await createOrder(orderData);
      return response as Order;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || 'Failed to create order');
    }
  }
);

export const fetchLoginUserAsync = createAsyncThunk(
  'orders/fetchLoginUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchLoginUser();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateOrderAsync = createAsyncThunk(
  'orders/updateOrder',
  async (orderData: { orderId: string; payload: Partial<Order> }, { rejectWithValue }) => {
    try {
      const response = await updateOrder(orderData.orderId, orderData.payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteOrderAsync = createAsyncThunk(
  'orders/deleteloginUser',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await deleteloginUser(orderId);
      return { orderId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState: OrderState = {
  orders: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    limit: 10,
  },
  totalPOCount: null, // <-- ADDED: Initialize new state property
  completedPOCount:null,
  pendingPOCount:null,
  delayedPOCount:null,
  rejectedPOCount:null,
  status: 'idle',
  error: null,
  message: null,
  success: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrders: (state) => {
      state.orders = [];
      state.pagination = { currentPage: 1, totalPages: 1, totalOrders: 0, limit: 10 };
      // state.totalPOCount = null; // <-- ADDED: Reset total PO count as well
      state.status = 'idle';
      state.error = null;
      state.message = null;
      state.success = null;
    },
    clearMessages: (state) => {
      state.error = null;
      state.message = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrdersAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload.orders || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchOrdersAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(deleteOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload.orderId
        );
        state.pagination.totalOrders -= 1;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createOrderAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders.push(action.payload);
      })
      .addCase(createOrderAsync.rejected, (state, action) => {
        console.log(action.payload, "slices error");
        state.status = 'failed';
        state.error = action.payload as string;
        state.message = action.payload as string;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(fetchLoginUserAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchLoginUserAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload.data.orders || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchLoginUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(updateOrderAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateOrderAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedOrder = action.payload;
        const index = state.orders.findIndex(order => order._id === updatedOrder._id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
        state.success = true;
      })
      .addCase(updateOrderAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(deleteOrderAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteOrderAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = state.orders.filter(order => order._id !== action.payload.orderId);
        state.pagination.totalOrders -= 1;
        state.success = true;
      })
      .addCase(deleteOrderAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.success = false;
      })


      
      // <-- ADDED: New extra reducers for fetchTotalPOCountAsync
      .addCase(fetchTotalPOCountAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTotalPOCountAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.totalPOCount = action.payload.total_po_count; // Update the new state property
      })
      .addCase(fetchTotalPOCountAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.totalPOCount = null; // Clear the count on failure
      })


      // <-- ADDED: New extra reducers for fetchCompletedPOCountAsync
      .addCase(fetchCompletedPOCountAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCompletedPOCountAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.completedPOCount = action.payload.completed_po_count; // Update the new state property
      })
      .addCase(fetchCompletedPOCountAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.completedPOCount = null; // Clear the count on failure
      })
      
      
      // <-- ADDED: New extra reducers for fetchPendingPOCountAsync
      .addCase(fetchPendingPOCountAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPendingPOCountAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pendingPOCount = action.payload.pending_po_count; // Update the new state property
      })
      .addCase(fetchPendingPOCountAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.pendingPOCount = null; // Clear the count on failure
      })
      
      
      
      // <-- ADDED: New extra reducers for fetchDelayedPOCountAsync
      .addCase(fetchDelayedPOCountAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDelayedPOCountAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.delayedPOCount = action.payload.delayed_po_count; // Update the new state property
      })
      .addCase(fetchDelayedPOCountAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.delayedPOCount = null; // Clear the count on failure
      })



      // <-- ADDED: New extra reducers for fetchRejectedPOCountAsync
      .addCase(fetchRejectedPOCountAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRejectedPOCountAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rejectedPOCount = action.payload.rejected_po_count; // Update the new state property
      })
      .addCase(fetchRejectedPOCountAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.rejectedPOCount = null; // Clear the count on failure
      })
      ;
  },
});

export const { resetOrders, clearMessages } = orderSlice.actions;
export default orderSlice.reducer;
