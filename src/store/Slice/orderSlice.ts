import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllOrders, deleteOrders } from '../../utils/api';

interface Order {
  _id: string;
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
    _id: string;
    createdAt?: string;
    updatedAt?: string;
  }>;
  estimatedDispatchDate: string;
  status: string;
  orderThrougth: string;
  department: string;
  isdeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  formGeneratedBy?: string;
  generatedBy: {
    name?: string;
    employeeId: string;
  };
  createdBy?: {
    userId?: string;
    username?: string;
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
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface DeleteOrderResponse {
  orderId: string;
}


export const fetchOrdersAsync = createAsyncThunk(
  'orders/fetchOrders',
  async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      return await fetchAllOrders(page, limit);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteOrder = createAsyncThunk<
  DeleteOrderResponse,
  string,
  { rejectValue: string }
>('orders/deleteOrder', async (orderId, { rejectWithValue }) => {
  try {
    
    const response = await deleteOrders(orderId);
    return response;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to delete order'
    );
  }
});

const initialState: OrderState = {
  orders: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    limit: 10,
  },
  status: 'idle',
  error: null,
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
      });
  },
});

export const { resetOrders } = orderSlice.actions;
export default orderSlice.reducer;