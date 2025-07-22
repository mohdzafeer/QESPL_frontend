// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { createOrder } from '../../utils/api';

// export const createNewOrder = createAsyncThunk(
//   'orderCreate/createNewOrder',
//   async (orderData, { rejectWithValue }) => {
//     try {
//       return await createOrder(orderData);
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const orderCreateSlice = createSlice({
//   name: 'orderCreate',
//   initialState: {
//     order: null,
//     status: 'idle',
//     error: null,
//   },
//   reducers: {
//     resetOrderCreate: (state) => {
//       state.order = null;
//       state.status = 'idle';
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createNewOrder.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(createNewOrder.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.order = action.payload.data || null;
//       })
//       .addCase(createNewOrder.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//       });
//   },
// });

// export const { resetOrderCreate } = orderCreateSlice.actions;
// export default orderCreateSlice.reducer;