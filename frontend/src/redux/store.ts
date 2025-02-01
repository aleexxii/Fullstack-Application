import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import adminSlice  from "./slices/adminSlice";
import profileReducer from './slices/profileSlice'


const rootReducer = combineReducers({
    auth : authReducer,
    profile : profileReducer,
    admin : adminSlice
})


export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
