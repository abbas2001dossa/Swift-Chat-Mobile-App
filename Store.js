import { configureStore } from '@reduxjs/toolkit';
import UserSlice from './Redux/UserSlice';

export const Store = configureStore({
  reducer: {
    user : UserSlice
 },
})