import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Router, MemoryRouter } from 'react-router-dom';
import { act, fireEvent, render } from '@testing-library/react';
import { faker } from '@faker-js/faker';

import history from '~/services/history';
import { Profile } from '~/pages/Profile';
import { updateProfileRequest } from '~/store/actions/user';
import factory from '../utils/factory';

jest.mock('react-redux');
jest.mock('~/services/history');

describe('Profile page', () => {
  it('should be able to back to previous page', async () => {
    const push = jest.spyOn(history, 'push');
    const { name, email } = await factory.attrs('User');

    useSelector.mockImplementation((cb) =>
      cb({
        user: { name, email },
      })
    );

    const { getByTestId } = render(
      <Router history={history}>
        <Profile />
      </Router>
    );

    fireEvent.click(getByTestId('back'));
    expect(push).toHaveBeenCalledWith('/');
  });

  it("should be able to update profile's email and name", async () => {
    const { name, email } = await factory.attrs('User');
    const passwords = {
      old_password: '',
      password: '',
      confirm_password: '',
    };

    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);
    useSelector.mockImplementation((cb) =>
      cb({ user: { name, email, ...passwords } })
    );

    const { getByTestId } = render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await act(async () => {
      fireEvent.submit(getByTestId('form'));
    });

    expect(dispatch).toHaveBeenCalledWith(
      updateProfileRequest({ name, email, ...passwords })
    );
  });

  it("should be able to update the profile's password", async () => {
    const { name, email, password } = await factory.attrs('User');
    const passwords = {
      old_password: faker.internet.password(),
      password,
      confirm_password: password,
    };

    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);
    useSelector.mockImplementation((cb) =>
      cb({ user: { name, email, ...passwords } })
    );

    const { getByTestId } = render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await act(async () => {
      fireEvent.submit(getByTestId('form'));
    });

    expect(dispatch).toHaveBeenCalledWith(
      updateProfileRequest({ name, email, ...passwords })
    );
  });

  it('should not be able to update the profile', async () => {
    const password = faker.internet.password(3);
    const { getByText, getByTestId, getByPlaceholderText } = render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    fireEvent.change(getByPlaceholderText('Nova senha'), {
      target: { value: password },
    });

    await act(async () => {
      fireEvent.submit(getByTestId('form'));
    });

    expect(
      getByText('A nova senha deve conter no mínimo 6 caracteres')
    ).toBeInTheDocument();
  });
});
