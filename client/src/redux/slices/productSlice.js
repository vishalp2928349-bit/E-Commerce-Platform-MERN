import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as productService from "../../services/productService.js";

export const fetchProducts = createAsyncThunk("products/fetchAll", async (params, { rejectWithValue }) => {
  try {
    return await productService.fetchProducts(params);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to load products");
  }
});

export const fetchProductById = createAsyncThunk("products/fetchOne", async (id, { rejectWithValue }) => {
  try {
    return await productService.fetchProductById(id);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to load product");
  }
});

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    total: 0,
    page: 1,
    pages: 1,
    current: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.current = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
