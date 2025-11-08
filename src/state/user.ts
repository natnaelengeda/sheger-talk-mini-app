import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  userId: string;
  socketId: string;
  first_name: string;
  last_name: string;
  username: string;
  photo_url: string;
  telegram_id: string;
  is_telegram_registered: boolean;
  theme: string;
  language: string;
  isLoggedIn: boolean;
}

export const initialState: UserState = {
  userId: "",
  socketId: "",
  theme: "system",
  language: "en",
  first_name: "",
  last_name: "",
  username: "",
  photo_url: "",
  telegram_id: "",
  is_telegram_registered: false,
  isLoggedIn: false,
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{
      userId: string;
      socketId: string;
    }>) => {
      state.userId = action.payload.userId;
      state.socketId = action.payload.socketId;
      state.isLoggedIn = true;
    },
    login_telegram(state, action: PayloadAction<{ 
      telegram_id: string,
      first_name: string,
      last_name: string,
      username: string,
      photo_url: string,
    }>) {
      state.telegram_id = action.payload.telegram_id;
      state.first_name = action.payload.first_name;
      state.last_name = action.payload.last_name;
      state.username = action.payload.username;
      state.photo_url = action.payload.photo_url;
      state.is_telegram_registered = true;
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

export const { login, login_telegram,logout, changeTheme, changeLanguage } = userSlice.actions;
export const selectUser = (state: { user: UserState }) => state.user;
export default userSlice.reducer;
