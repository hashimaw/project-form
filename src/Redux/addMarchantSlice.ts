import { createSlice } from '@reduxjs/toolkit';
import { IMerchant } from '../interfaces/marchant';


const marchantInitialState: IMerchant[]=[];

export const addMerchantSlice = createSlice({
    name: 'merchant',
    initialState: marchantInitialState,
    reducers: {
      AddMerchant: (state, action) => {
          if (state) {
              state.push(action.payload);
            } else {
              return [action.payload];  
            }
      },
    },
  });
  

export const { AddMerchant } = addMerchantSlice.actions;
export default addMerchantSlice.reducer;
