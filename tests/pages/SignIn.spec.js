import React from 'react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { fireEvent, render, act } from '@testing-library/react';

import { signInRequest } from '~/store/actions/user';
import { SignIn } from '~/pages/Sign/In';
import factory from '../utils/factory';

const mockUseDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockUseDispatch(),
}));

describe('SignIn page', () => {
  it('should be able to login', async () => {
    const { email, password } = await factory.attrs('User');

    const dispatch = jest.fn();
    mockUseDispatch.mockReturnValue(dispatch);

    const router = createMemoryRouter([
      {
        path: '/',
        element: <SignIn />,
      },
    ]);
    const { getByPlaceholderText, getByTestId } = render(
      <RouterProvider router={router} />
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
    const router = createMemoryRouter([
      {
        path: '/',
        element: <SignIn />,
      },
      {
        path: '/signup',
        element: <div>SignUp</div>,
      },
    ]);
    const { getByText } = render(<RouterProvider router={router} />);

    fireEvent.click(getByText('Criar conta gratuita'));
    expect(router.state.location.pathname).toBe('/signup');
  });
});
