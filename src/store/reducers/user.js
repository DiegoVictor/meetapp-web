import { produce } from 'immer';
import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  token: null,
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInSuccess(state, action) {
      return produce(state, (draft) => {
        draft.email = action.payload.user.email;
        draft.name = action.payload.user.name;
        draft.token = action.payload.token;
      });
    },
    updateProfileSuccess(state, action) {
      return produce(state, (draft) => {
        draft.email = action.payload.email;
        draft.name = action.payload.name;
      });
    },
    signOut(state) {
      return produce(state, (draft) => {
        draft.token = null;
        delete draft.email;
        delete draft.name;
      });
    },
  },
});

export const { signInSuccess, updateProfileSuccess, signOut } = slice.actions;
export const user = slice.reducer;
