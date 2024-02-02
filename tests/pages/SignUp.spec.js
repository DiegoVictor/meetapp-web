import React from 'react';
import { useDispatch } from 'react-redux';
import { MemoryRouter, Router } from 'react-router-dom';
import { fireEvent, render, act } from '@testing-library/react';

import { signUpRequest } from '~/store/actions/user';
import history from '~/services/history';
import { SignUp } from '~/pages/Sign/Up';
import factory from '../utils/factory';

jest.mock('react-redux');

describe('SignUp page', () => {
  it('should be able to register', async () => {
    const { name, email, password } = await factory.attrs('User');

    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);

    const { getByPlaceholderText, getByTestId } = render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    fireEvent.change(getByPlaceholderText('Nome completo'), {
      target: { value: name },
    });

    fireEvent.change(getByPlaceholderText('Digite seu e-mail'), {
      target: { value: email },
    });

    fireEvent.change(getByPlaceholderText('Sua senha secreta'), {
      target: { value: password },
    });

    await act(async () => {
      fireEvent.submit(getByTestId('form'));
    });

    expect(dispatch).toHaveBeenCalledWith(signUpRequest(email, name, password));
  });

  it('should be able to click on signin link', async () => {
    const { getByText } = render(
      <Router history={history}>
        <SignUp />
      </Router>
    );

    fireEvent.click(getByText('Já tenho conta'));
    expect(history.location.pathname).toBe('/');
  });
});
