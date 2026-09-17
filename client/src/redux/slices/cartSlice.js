import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as cartService from "../../services/cartService.js";
import { logout } from "./authSlice.js";
import toast from "react-hot-toast";

export const fetchCart = createAsyncThunk("cart/fetch", async (_, { rejectWithValue }) => {
  try {
    return await cartService.fetchCart();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to load cart");
  }
});

export const addToCart = createAsyncThunk("cart/add", async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const data = await cartService.addToCart(productId, quantity);
    toast.success("Added to cart");
    return data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to add to cart");
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateCartItem = createAsyncThunk(
  "cart/update",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      return await cartService.updateCartItem(productId, quantity);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update cart");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const removeCartItem = createAsyncThunk("cart/remove", async (productId, { rejectWithValue }) => {
  try {
    const data = await cartService.removeCartItem(productId);
    toast.success("Item removed");
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const applyCoupon = createAsyncThunk("cart/applyCoupon", async (code, { rejectWithValue }) => {
  try {
    const data = await cartService.applyCoupon(code);
    toast.success("Coupon applied");
    return data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Invalid coupon");
    return rejectWithValue(err.response?.data?.message);
  }
});

const EMPTY_CART = { products: [], coupon: {} };

const cartSlice = createSlice({
  name: "cart",
  initialState: { data: EMPTY_CART, loading: false },
  reducers: {
    clearCartState: (state) => {
      state.data = EMPTY_CART;
    },
  },
  extraReducers: (builder) => {
    // Bug #9 fix: reset cart state when the user logs out
    builder.addCase(logout, (state) => {
      state.data = EMPTY_CART;
      state.loading = false;
    });

    builder.addMatcher(
      (action) => action.type.startsWith("cart/") && action.type.endsWith("/fulfilled"),
      (state, action) => {
        state.loading = false;
        state.data = action.payload;
      }
    );
    builder.addMatcher(
      (action) => action.type.startsWith("cart/") && action.type.endsWith("/pending"),
      (state) => {
        state.loading = true;
      }
    );
    builder.addMatcher(
      (action) => action.type.startsWith("cart/") && action.type.endsWith("/rejected"),
      (state) => {
        state.loading = false;
      }
    );
  },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
