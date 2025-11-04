import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// States
import userReducer from "@/state/user";

const userPersistConfig = {
  key: "user",
  storage,
};

const userPersistReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: userPersistReducer,
    // sidebar: sidebarReducer,
  },
  middleware: (getDefaultMiddlware) =>
    getDefaultMiddlware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;