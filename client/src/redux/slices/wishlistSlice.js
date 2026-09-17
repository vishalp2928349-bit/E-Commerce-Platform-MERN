import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as wishlistService from "../../services/wishlistService.js";
import { logout } from "./authSlice.js";
import toast from "react-hot-toast";

export const fetchWishlist = createAsyncThunk("wishlist/fetch", async (_, { rejectWithValue }) => {
  try {
    return await wishlistService.fetchWishlist();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const addToWishlist = createAsyncThunk("wishlist/add", async (productId, { rejectWithValue }) => {
  try {
    const data = await wishlistService.addToWishlist(productId);
    toast.success("Added to wishlist");
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const removeFromWishlist = createAsyncThunk("wishlist/remove", async (productId, { rejectWithValue }) => {
  try {
    const data = await wishlistService.removeFromWishlist(productId);
    toast.success("Removed from wishlist");
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const EMPTY_WISHLIST = { products: [] };

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { data: EMPTY_WISHLIST, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    // Bug #9 fix: reset wishlist state when the user logs out
    builder.addCase(logout, (state) => {
      state.data = EMPTY_WISHLIST;
      state.loading = false;
    });

    builder.addMatcher(
      (action) => action.type.startsWith("wishlist/") && action.type.endsWith("/fulfilled"),
      (state, action) => {
        state.loading = false;
        state.data = action.payload;
      }
    );
    builder.addMatcher(
      (action) => action.type.startsWith("wishlist/") && action.type.endsWith("/pending"),
      (state) => {
        state.loading = true;
      }
    );
    builder.addMatcher(
      (action) => action.type.startsWith("wishlist/") && action.type.endsWith("/rejected"),
      (state) => {
        state.loading = false;
      }
    );
  },
});

export default wishlistSlice.reducer;
