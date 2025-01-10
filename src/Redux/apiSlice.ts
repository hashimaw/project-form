import { createSlice } from '@reduxjs/toolkit';


const apiLink: string = 'https://product-form-fa29a-default-rtdb.firebaseio.com/';

export const apiLinkSlice = createSlice({
  name: 'apilink',
  initialState: apiLink,
  reducers: {
  },
});
  
export default apiLinkSlice.reducer;

