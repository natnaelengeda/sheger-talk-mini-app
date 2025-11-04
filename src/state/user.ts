import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  userId: string;
  socketId: string;
  theme: string;
  language: string;
  isLoggedIn: boolean;
}

export const initialState: UserState = {
  userId: "",
  socketId: "",
  theme: "system",
  language: "en",
  isLoggedIn: false,
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserState>) => {
      state.userId = action.payload.userId;
      state.socketId = action.payload.socketId;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.userId = "";
      state.socketId = "";
      state.isLoggedIn = false;
    },
    changeTheme: (state, action: PayloadAction<{ theme: string }>) => {
      state.theme = action.payload.theme;
    },
    changeLanguage: (state, action: PayloadAction<{ language: string }>) => {
      state.language = action.payload.language;
    }
  },
});

export const { login, logout, changeTheme, changeLanguage } = userSlice.actions;
export const selectUser = (state: { user: UserState }) => state.user;
export default userSlice.reducer;
