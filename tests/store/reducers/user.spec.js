import { faker } from '@faker-js/faker';

import {
  initialState,
  user as reducer,
  signInSuccess,
  signOut,
  updateProfileSuccess,
} from '~/store/reducers/user';
import factory from '../../utils/factory';

describe('User reducer', () => {
  it('signInSuccess', async () => {
    const { name, email } = await factory.attrs('User');
    const token = faker.string.alphanumeric(16);

    const state = reducer(
      initialState,
      signInSuccess({ token, user: { name, email } })
    );

    expect(state).toStrictEqual({ token, name, email });
  });

  it('updateProfileSuccess', async () => {
    const { name, email } = await factory.attrs('User');
    const state = reducer(initialState, updateProfileSuccess({ name, email }));

    expect(state).toStrictEqual({ token: null, name, email });
  });

  it('signOut', () => {
    const state = reducer(initialState, signOut());
    expect(state).toStrictEqual(initialState);
  });
});
