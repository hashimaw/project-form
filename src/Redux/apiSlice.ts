import { createSlice } from '@reduxjs/toolkit';


const apiLink: string = 'https://project-form-yj95.onrender.com/';

export const apiLinkSlice = createSlice({
  name: 'apilink',
  initialState: apiLink,
  reducers: {},
});
  
export default apiLinkSlice.reducer;

