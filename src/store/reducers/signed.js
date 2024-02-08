import { createSlice } from '@reduxjs/toolkit';

export const initialState = false;

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInSuccess() {
      return true;
    },
    signOut() {
      return false;
    },
  },
});

export const { signInSuccess, signOut } = slice.actions;
export const signed = slice.reducer;
