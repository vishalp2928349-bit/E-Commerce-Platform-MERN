import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../../services/authService.js";
import toast from "react-hot-toast";

const storedUser = JSON.parse(localStorage.getItem("mern_user"));

export const registerUser = createAsyncThunk("auth/register", async (data, { rejectWithValue }) => {
  try {
    return await authService.register(data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Registration failed");
  }
});

export const loginUser = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
  try {
    return await authService.login(data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

export const updateUserProfile = createAsyncThunk("auth/updateProfile", async (data, { rejectWithValue }) => {
  try {
    return await authService.updateProfile(data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Update failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser || null,
    loading: false,
    error: null,
  },
  reducers: {
    // Bug #9 fix: logout action is exported so cartSlice and wishlistSlice
    // can react to it via extraReducers and reset their own state.
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("mern_user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("mern_user", JSON.stringify(state.user));
        toast.success("Profile updated");
      })
      .addMatcher(
        (action) => [registerUser.pending.type, loginUser.pending.type].includes(action.type),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => [registerUser.fulfilled.type, loginUser.fulfilled.type].includes(action.type),
        (state, action) => {
          state.loading = false;
          state.user = action.payload;
          localStorage.setItem("mern_user", JSON.stringify(action.payload));
          toast.success("Welcome, " + action.payload.name + "!");
        }
      )
      .addMatcher(
        (action) => [registerUser.rejected.type, loginUser.rejected.type].includes(action.type),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
          toast.error(action.payload);
        }
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
