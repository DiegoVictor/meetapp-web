import { faker } from '@faker-js/faker';

import reducer, { initialState } from '~/store/reducers/user';
import {
  signInSuccess,
  updateProfileSuccess,
  signOut,
} from '~/store/actions/user';
import factory from '../../utils/factory';

describe('User reducer', () => {
  it('DEFAULT', () => {
    const state = reducer(undefined, {});
    expect(state).toStrictEqual(initialState);
  });

  it('SIGN_IN_SUCCESS', async () => {
    const { name, email } = await factory.attrs('User');
    const token = faker.string.alphanumeric(16);

    const state = reducer(initialState, signInSuccess(token, { name, email }));

    expect(state).toStrictEqual({ token, name, email });
  });

  it('UPDATE_PROFILE_SUCCESS', async () => {
    const { name, email } = await factory.attrs('User');
    const state = reducer(initialState, updateProfileSuccess({ name, email }));

    expect(state).toStrictEqual({ token: null, name, email });
  });

  it('SIGN_OUT', () => {
    const state = reducer(true, signOut());
    expect(state).toStrictEqual(initialState);
  });
});
