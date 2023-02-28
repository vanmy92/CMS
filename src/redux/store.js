import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice'
import productReducer from './productSlice'
import billReducer from "./billSlice";


export const store = configureStore({
    reducer: {
        user:userReducer,
        product:productReducer,
        bill:billReducer
    },
  });