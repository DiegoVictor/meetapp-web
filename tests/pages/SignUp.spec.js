import React from 'react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { fireEvent, render, act } from '@testing-library/react';

import { signUpRequest } from '~/store/actions/user';
import { SignUp } from '~/pages/Sign/Up';
import factory from '../utils/factory';

const mockUseDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockUseDispatch(),
}));

describe('SignUp page', () => {
  it('should be able to register', async () => {
    const { name, email, password } = await factory.attrs('User');

    const dispatch = jest.fn();
    mockUseDispatch.mockReturnValue(dispatch);

    const router = createMemoryRouter([
      {
        path: '/',
        element: <SignUp />,
      },
    ]);
    const { getByPlaceholderText, getByTestId } = render(
      <RouterProvider router={router} />
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
    const router = createMemoryRouter([
      {
        path: '/',
        element: <SignUp />,
      },
    ]);

    const { getByText } = render(<RouterProvider router={router} />);

    fireEvent.click(getByText('Já tenho conta'));
    expect(router.state.location.pathname).toBe('/');
  });
});
