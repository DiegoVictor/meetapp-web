import React from 'react';
import { useDispatch } from 'react-redux';
import { MemoryRouter, Router } from 'react-router-dom';
import { fireEvent, render, act } from '@testing-library/react';

import { signInRequest } from '~/store/actions/user';
import history from '~/services/history';
import { SignIn } from '~/pages/Sign/In';
import factory from '../utils/factory';

jest.mock('react-redux');

describe('SignIn page', () => {
  it('should be able to login', async () => {
    const { email, password } = await factory.attrs('User');

    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);

    const { getByPlaceholderText, getByTestId } = render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    fireEvent.change(getByPlaceholderText('Digite seu e-mail'), {
      target: { value: email },
    });

    fireEvent.change(getByPlaceholderText('Sua senha secreta'), {
      target: { value: password },
    });

    await act(async () => {
      fireEvent.submit(getByTestId('form'));
    });

    expect(dispatch).toHaveBeenCalledWith(signInRequest(email, password));
  });

  it('should be able to click on signup link', async () => {
    const { getByText } = render(
      <Router history={history}>
        <SignIn />
      </Router>
    );

    fireEvent.click(getByText('Criar conta gratuita'));
    expect(history.location.pathname).toBe('/signup');
  });
});
