import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as orderService from "../../services/orderService.js";

export const fetchOrders = createAsyncThunk("orders/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await orderService.fetchOrders();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createOrder = createAsyncThunk("orders/create", async (data, { rejectWithValue }) => {
  try {
    return await orderService.createOrder(data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const orderSlice = createSlice({
  name: "orders",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export default orderSlice.reducer;
