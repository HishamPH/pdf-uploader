import { configureStore } from "@reduxjs/toolkit";
import userAuth from "./slices/userAuth";
const store = configureStore({
  reducer: {
    user: userAuth,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: true,
});
export const dispatch = store.dispatch;

export default store;
