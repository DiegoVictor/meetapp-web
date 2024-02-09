import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { act, fireEvent, render } from '@testing-library/react';
import { faker } from '@faker-js/faker';

import { Profile } from '~/pages/Profile';
import { updateProfileRequest } from '~/store/actions/user';
import factory from '../utils/factory';

const mockUseDispatch = jest.fn();
const mockUseSelector = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockUseDispatch(),
  useSelector: (cb) => mockUseSelector(cb),
}));

const mockUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: (path) => mockUseNavigate(path),
}));

describe('Profile page', () => {
  it('should be able to back to previous page', async () => {
    const { name, email } = await factory.attrs('User');

    mockUseSelector.mockImplementation((cb) =>
      cb({
        user: { name, email },
      })
    );

    const navigate = jest.fn();
    mockUseNavigate.mockReturnValueOnce(navigate);
    const router = createMemoryRouter([
      {
        path: '/',
        element: <Profile />,
      },
    ]);
    const { getByTestId } = render(<RouterProvider router={router} />);

    fireEvent.click(getByTestId('back'));
    expect(navigate).toHaveBeenCalledWith('/');
  });

  it("should be able to update profile's email and name", async () => {
    const { name, email } = await factory.attrs('User');
    const passwords = {
      old_password: '',
      password: '',
      confirm_password: '',
    };

    const dispatch = jest.fn();
    mockUseDispatch.mockReturnValue(dispatch);

    mockUseSelector.mockImplementation((cb) =>
      cb({ user: { name, email, ...passwords } })
    );

    const router = createMemoryRouter([
      {
        path: '/',
        element: <Profile />,
      },
    ]);
    const { getByTestId } = render(<RouterProvider router={router} />);

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
    mockUseDispatch.mockReturnValue(dispatch);

    mockUseSelector.mockImplementation((cb) =>
      cb({ user: { name, email, ...passwords } })
    );

    const router = createMemoryRouter([
      {
        path: '/',
        element: <Profile />,
      },
    ]);
    const { getByTestId } = render(<RouterProvider router={router} />);

    await act(async () => {
      fireEvent.submit(getByTestId('form'));
    });

    expect(dispatch).toHaveBeenCalledWith(
      updateProfileRequest({ name, email, ...passwords })
    );
  });

  it('should not be able to update the profile', async () => {
    const password = faker.internet.password(3);

    const router = createMemoryRouter([
      {
        path: '/',
        element: <Profile />,
      },
    ]);
    const { getByText, getByTestId, getByPlaceholderText } = render(
      <RouterProvider router={router} />
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
