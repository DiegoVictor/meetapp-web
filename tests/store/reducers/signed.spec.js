import { signed as reducer, initialState } from '~/store/reducers/signed';
import { signInSuccess, signOut } from '~/store/reducers/user';

describe('Signed reducer', () => {
  it('signInSuccess', async () => {
    const state = reducer(initialState, signInSuccess());

    expect(state).toBe(true);
  });

  it('signOut', () => {
    const state = reducer(true, signOut());
    expect(state).toBe(false);
  });
});
