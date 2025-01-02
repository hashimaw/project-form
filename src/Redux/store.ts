// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import addSalesSlice from './addSalesSlice';
import AddMerchant from './addMarchantSlice';
export const store = configureStore({
  reducer: {
    database: addSalesSlice,
    merchant: AddMerchant,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;