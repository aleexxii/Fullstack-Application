import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user : userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <TSelected = unknown>(
  selector: (state: RootState) => TSelected
) => useSelector(selector);