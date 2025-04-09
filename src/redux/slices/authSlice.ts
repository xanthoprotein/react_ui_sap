import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { login as loginApi } from "../../utils/api";
import { syncChats } from "./chatSlice";
import { NavigateFunction } from "react-router-dom";

interface AuthState {
  isAuthenticated: boolean;
  role: string;
  token: string | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
  userId: any;
}

const initialState: AuthState = {
  isAuthenticated: localStorage.getItem("authToken") ? true : false,
  role: localStorage.getItem("userRole") || "",
  token: localStorage.getItem("authToken") || null,
  userId: localStorage.getItem("userId") || null,
  status: "idle",
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      return await loginApi(email);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const logoutUser =
  (navigate: NavigateFunction) => async (dispatch: any) => {
    try {
      dispatch(syncChats());
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.role = "";
      state.token = null;

      state.userId = null;

      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (
          state,
          action: PayloadAction<{ role: string; token: string; userId: any }>
        ) => {
          state.status = "idle";
          state.isAuthenticated = true;
          state.role = action.payload.role;
          state.token = action.payload.token;
          state.userId = action.payload.userId;

          localStorage.setItem("authToken", action.payload.token);
          localStorage.setItem("userRole", action.payload.role);
          localStorage.setItem("userId", action.payload.userId);
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
