/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchAllOrders,
  deleteOrders,
  createOrder,
  fetchLoginUser,
  updateOrder,
  deleteloginUser,
  getTotalPOCount,
  getCompletedPOCount,
  getPendingPOCount,
  getDelayedPOCount,
  getRejectedPOCount,
  getLastPONumber
} from '../../utils/api';

export interface Order {
  _id?: string;
  orderdate:string;
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
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
  }>;
  estimatedDispatchDate: string;
  status?: string;
  orderThrough: {
    username: string;
    employeeId: string;
  };
  isdeleted?: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
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
  totalPOCount: number | null;
  completedPOCount: number | null;
  pendingPOCount: number | null;
  delayedPOCount: number | null;
  rejectedPOCount: number | null;
  lastPONumber: string | null;
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
export const fetchTotalPOCountAsync = createAsyncThunk<
  { total_po_count: number },
  void,
  { rejectValue: string }
>(
  'orders/fetchTotalPOCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTotalPOCount();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch total PO count');
    }
  }
);

export const fetchCompletedPOCountAsync = createAsyncThunk<
  { completed_po_count: number },
  void,
  { rejectValue: string }
>(
  'orders/fetchCompletedPOCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCompletedPOCount();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch completed PO count');
    }
  }
);

export const fetchPendingPOCountAsync = createAsyncThunk<
  { pending_po_count: number },
  void,
  { rejectValue: string }
>(
  'orders/fetchPendingPOCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPendingPOCount();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch Pending PO count');
    }
  }
);

export const fetchDelayedPOCountAsync = createAsyncThunk<
  { delayed_po_count: number },
  void,
  { rejectValue: string }
>(
  'orders/fetchDelayedPOCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDelayedPOCount();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch Delayed PO count');
    }
  }
);

export const fetchRejectedPOCountAsync = createAsyncThunk<
  { rejected_po_count: number },
  void,
  { rejectValue: string }
>(
  'orders/fetchRejectedPOCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRejectedPOCount();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to Rejected Delayed PO count');
    }
  }
);
export const fetchLastPONumberAsync = createAsyncThunk<
  { last_po_created: string },
  void,
  { rejectValue: any }
>(
  'orders/fetchLastPONumber',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getLastPONumber();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch last PO numbert');
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
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await fetchLoginUser(page, limit);
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
  totalPOCount: null,
  completedPOCount:null,
  pendingPOCount:null,
  delayedPOCount:null,
  rejectedPOCount:null,
  lastPONumber:null,
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
        state.orders = action.payload.data.orders;
        // Correctly update the pagination state from the backend response
        state.pagination.totalOrders = action.payload.data.totalOrders;
        state.pagination.totalPages = action.payload.data.totalPages;
        state.pagination.currentPage = action.payload.data.currentPage;
        state.pagination.limit = action.payload.data.limit;
        state.success = true;
      })
      .addCase(fetchLoginUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.success = false;
        // Reset pagination on failure
        state.orders = [];
        state.pagination = { currentPage: 1, totalPages: 1, totalOrders: 0, limit: 10 };
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
      .addCase(fetchTotalPOCountAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTotalPOCountAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.totalPOCount = action.payload.total_po_count;
      })
      .addCase(fetchTotalPOCountAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.totalPOCount = null;
      })
      .addCase(fetchCompletedPOCountAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCompletedPOCountAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.completedPOCount = action.payload.completed_po_count;
      })
      .addCase(fetchCompletedPOCountAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.completedPOCount = null;
      })
      .addCase(fetchPendingPOCountAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPendingPOCountAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pendingPOCount = action.payload.pending_po_count;
      })
      .addCase(fetchPendingPOCountAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.pendingPOCount = null;
      })
      .addCase(fetchDelayedPOCountAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDelayedPOCountAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.delayedPOCount = action.payload.delayed_po_count;
      })
      .addCase(fetchDelayedPOCountAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.delayedPOCount = null;
      })
      .addCase(fetchRejectedPOCountAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRejectedPOCountAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rejectedPOCount = action.payload.rejected_po_count;
      })
      .addCase(fetchRejectedPOCountAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.lastPONumber = null;
      })
      .addCase(fetchLastPONumberAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchLastPONumberAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lastPONumber = action.payload.last_po_created;
      })
      .addCase(fetchLastPONumberAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.lastPONumber = null;
      });
  },
});

export const { resetOrders, clearMessages } = orderSlice.actions;
export default orderSlice.reducer;
