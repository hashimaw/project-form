// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import addSalesSlice from './addSalesSlice';
import AddMerchant from './addMarchantSlice';
import apiLinkSlice from './apiSlice';
export const store = configureStore({
  reducer: {
    database: addSalesSlice,
    merchant: AddMerchant,
    apiLink: apiLinkSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;