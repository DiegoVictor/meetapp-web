import { faker } from '@faker-js/faker';
import MockAdapter from 'axios-mock-adapter';
import { runSaga } from 'redux-saga';
import { toast } from 'react-toastify';

import api from '~/services/api';
import { signIn, signUp, updateUser, setToken } from '~/store/sagas/user';
import history from '~/services/history';
import factory from '../../utils/factory';
import {
  signInRequest,
  signInSuccess,
  signUpRequest,
  updateProfileRequest,
  updateProfileSuccess,
} from '~/store/actions/user';

jest.mock('react-toastify');
jest.mock('~/services/history');

describe('User saga', () => {
  const apiMock = new MockAdapter(api);

  beforeEach(() => {
    if (typeof api.defaults.headers.Authorization === 'string') {
      delete api.defaults.headers.Authorization;
    }
  });

  it('should be able to login', async () => {
    const token = faker.random.alphaNumeric(32);
    const dispatch = jest.fn();
    const user = await factory.attrs('User');

    apiMock.onPost('sessions').reply(200, { token, user });

    await runSaga(
      { dispatch },
      signIn,
      signInRequest(user.email, user.password)
    ).toPromise();

    expect(api.defaults.headers.Authorization).toBe(`Bearer ${token}`);
    expect(dispatch).toHaveBeenCalledWith(signInSuccess(token, user));
  });

  it('should not be able to login', async () => {
    const dispatch = jest.fn();
    const error = jest.spyOn(toast, 'error');
    const { email, password } = await factory.attrs('User');

    apiMock.onPost('sessions').reply(400, { message: 'User not found' });

    await runSaga(
      { dispatch },
      signIn,
      signInRequest(email, password)
    ).toPromise();

    expect(error).toHaveBeenCalledWith(
      'Ops! Alguma coisa deu errado, tente novamente!'
    );
  });

  it('should be able to signup', async () => {
    const push = jest.spyOn(history, 'push');
    const { name, email, password } = await factory.attrs('User');

    apiMock.onPost('users').reply(200);
    await runSaga({}, signUp, signUpRequest(email, name, password)).toPromise();
    expect(push).toHaveBeenCalledWith('/');
  });

  it('should not be able to signup', async () => {
    const error = jest.spyOn(toast, 'error');
    const { name, email, password } = await factory.attrs('User');

    apiMock.onPost('users').reply(400);
    await runSaga({}, signUp, signUpRequest(email, name, password)).toPromise();
    expect(error).toHaveBeenCalledWith(
      'Ops! Alguma coisa deu errado, tente novamente!'
    );
  });

  it('should be able to update user email and name', async () => {
    const success = jest.spyOn(toast, 'success');
    const dispatch = jest.fn();
    const { email, name } = await factory.attrs('User');

    apiMock.onPut('users').reply(200, { email, name });
    await runSaga(
      { dispatch },
      updateUser,
      updateProfileRequest({ email, name })
    ).toPromise();

    expect(success).toHaveBeenCalledWith('Perfil atualizado com sucesso!');
    expect(dispatch).toHaveBeenCalledWith(
      updateProfileSuccess({ email, name })
    );
  });

  it('should be able to update user password', async () => {
    const dispatch = jest.fn();
    const success = jest.spyOn(toast, 'success');
    const password = faker.internet.password();
    const { email, name } = await factory.attrs('User');

    apiMock.onPut('users').reply(200, { email, name });
    await runSaga(
      { dispatch },
      updateUser,
      updateProfileRequest({
        email,
        name,
        old_password: faker.internet.password(),
        password,
        confirm_password: password,
      })
    ).toPromise();

    expect(success).toHaveBeenCalledWith('Perfil atualizado com sucesso!');
    expect(dispatch).toHaveBeenCalledWith(
      updateProfileSuccess({ email, name })
    );
  });

  it('should not be able to update user', async () => {
    const error = jest.spyOn(toast, 'error');
    const { email, name } = await factory.attrs('User');

    apiMock.onPut('users').reply(400, { message: 'Password does not match' });
    await runSaga(
      {},
      updateUser,
      updateProfileRequest({ email, name })
    ).toPromise();

    expect(error).toHaveBeenCalledWith(
      'Ops! Alguma coisa deu errado, tente novamente!'
    );
  });

  it('should be able to store the token', async () => {
    const token = faker.random.alphaNumeric(32);

    setToken({ payload: { user: { token } } });
    expect(api.defaults.headers.Authorization).toBe(`Bearer ${token}`);
  });

  it('should not be able to store the token', async () => {
    setToken({});
    expect(api.defaults.headers.Authorization).toBeUndefined();
  });
});
