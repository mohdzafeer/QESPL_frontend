import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { searchOrderApi } from '../../utils/api.js'; // Adjust the import path

// Define the Order type
interface Order {
  _id: string;
  clientName: string;
  companyName: string;
  products: { name: string; price?: number; quantity?: number; _id?: string }[];
  generatedBy: {
    name?: string; // For previous document
    employeeId?: string;
    user?: { username: string }; // For new API response
  };
  orderNumber: string;
  status: string;
  createdAt: string;
  isdeleted?: boolean;
}

// Async thunk for searching orders
export const searchOrders = createAsyncThunk<
  Order[],
  { query: string; startDate?: string; endDate?: string; status?: string },
  { rejectValue: string }
>(
  'orderSearch/searchOrders',
  async ({ query, startDate, endDate, status }, { rejectWithValue }) => {
    console.log(query,"check values on redux slices")
    try {
      const response = await searchOrderApi(query, startDate, endDate, status);
      return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching orders');
    }
  }
);

// Initial state
interface OrderSearchState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  query: string;
}

const initialState: OrderSearchState = {
  orders: [],
  loading: false,
  error: null,
  query: '',
};

// Create the slice
const orderSearchSlice = createSlice({
  name: 'orderSearch',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      console.log("check values on the redux actions paylaod load",action.payload)
      state.query = action.payload;
    },
    clearSearchResults: (state) => {
      state.orders = [];
      state.query = '';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        console.log("check data on the extra reducers actions",action.payload)
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(searchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      });
  },
});

// Export actions
export const { setSearchQuery, clearSearchResults } = orderSearchSlice.actions;
export default orderSearchSlice.reducer;