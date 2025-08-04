/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllOrders, deleteOrders ,createOrder, fetchLoginUser, updateOrder, deleteloginUser} from '../../utils/api';





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
  }; // Fixed typo and aligned with apiOrderData
  // department?: string; // Optional for creation
  isdeleted?: boolean; // Optional for creation
  deletedAt?: string | null; // Optional for creation
  createdAt?: string; // Optional for creation
  updatedAt?: string; // Optional for creation
  // formGeneratedBy?: string;
  generatedBy: {
    username: string; // Changed from employeeName to match interface
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
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  message: string | null;
  success: boolean | null; // Added to track success state
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


// deleteloginUser

//// create redux thunk for the orders create
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || 'Failed to create order');
    }
  }
);

///// create this funcations for the users and subdmins

// Async thunks
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
      ///// order create Extra reducers
      .addCase(createOrderAsync.pending, (state) => {
        state.status="loading";
        state.error=null
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders.push(action.payload);
      })
      .addCase(createOrderAsync.rejected, (state, action) => {
        console.log(action.payload,"slices error")
        state.status = 'failed';
        state.error = action.payload as string;
        state.message = action.payload as string; // Store the error message
        state.error = action.payload as string;
        state.success = false; // Set success to false on error
      }).
      ///// this for the user and subadmin
      addCase(fetchLoginUserAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      }).addCase(fetchLoginUserAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload.data.orders || [];
        state.pagination = action.payload.pagination || state.pagination;
      }).addCase(fetchLoginUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.success = false; // Set success to false on error
      }).
       addCase(updateOrderAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      }).
      addCase(updateOrderAsync.fulfilled, (state, action) => {
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
      }).addCase(deleteOrderAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = state.orders.filter(order => order._id !== action.payload.orderId);
        state.pagination.totalOrders -= 1;
        state.success = true;
      }).addCase(deleteOrderAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.success = false;
      });
  },
});


export const { resetOrders,clearMessages} = orderSlice.actions;
export default orderSlice.reducer;