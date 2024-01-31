import { produce } from 'immer';

export const initialState = {
  token: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case '@user/SIGN_IN_SUCCESS':
      return produce(state, (draft) => {
        draft.email = action.payload.user.email;
        draft.name = action.payload.user.name;
        draft.token = action.payload.token;
      });

    case '@user/UPDATE_PROFILE_SUCCESS':
      return produce(state, (draft) => {
        draft.email = action.payload.email;
        draft.name = action.payload.name;
      });

    case '@user/SIGN_OUT':
      return initialState;

    default:
      return state;
  }
};
