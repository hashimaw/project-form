import { createSlice } from '@reduxjs/toolkit';
import { ISales } from "../interfaces/sales";

const salesInitialState: ISales[]=[];

export const addSalesSlice = createSlice({
  name: 'database',
  initialState: salesInitialState,
  reducers: {
    AddSales: (state, action) => {
        if (state) {
            state.push(action.payload);
          } else {
            return [action.payload];  
          }
    },
  },
});
  

export const { AddSales } = addSalesSlice.actions;
export default addSalesSlice.reducer;

