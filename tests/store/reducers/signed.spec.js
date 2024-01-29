import { faker } from '@faker-js/faker';

import reducer, { initialState } from '~/store/reducers/signed';
import { signInSuccess, signOut } from '~/store/actions/user';
import factory from '../../utils/factory';

describe('Signed reducer', () => {
  it('DEFAULT', () => {
    const state = reducer(undefined, {});
    expect(state).toBe(initialState);
  });

  it('SIGN_IN_SUCCESS', async () => {
    const { name, email } = await factory.attrs('User');
    const state = reducer(
      initialState,
      signInSuccess(faker.string.alphanumeric(16), { name, email })
    );

    expect(state).toBe(true);
  });

  it('SIGN_OUT', () => {
    const state = reducer(true, signOut());
    expect(state).toBe(false);
  });
});
