import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { signOut } from '~/store/reducers/user';
import { Header } from '~/components/Header';

const mockUseDispatch = jest.fn();
const mockUseSelector = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockUseDispatch(),
  useSelector: (cb) => mockUseSelector(cb),
}));

const dispatch = jest.fn();
mockUseDispatch.mockReturnValue(dispatch);

const user = {
  name: faker.person.fullName(),
};
mockUseSelector.mockImplementation((cb) => cb({ user, signed: true }));

describe('Header component', () => {
  it('should be able to logout', async () => {
    const router = createMemoryRouter([
      {
        path: '/',
        element: <Header />,
      },
      {
        path: '/dashboard',
        element: <div>Dashboard</div>,
      },
      {
        path: '/profile',
        element: <div>Profile</div>,
      },
    ]);
    const { getByTestId } = render(<RouterProvider router={router} />);

    await waitFor(() => getByTestId('logout'));

    fireEvent.click(getByTestId('logout'));

    expect(dispatch).toHaveBeenCalledWith(signOut());
  });

  it('should be able to navigate to dashboard', async () => {
    const router = createMemoryRouter([
      {
        path: '/',
        element: <Header />,
      },
      {
        path: '/dashboard',
        element: <div>Dashboard</div>,
      },
      {
        path: '/profile',
        element: <div>Profile</div>,
      },
    ]);
    const { getByTestId } = render(<RouterProvider router={router} />);

    await waitFor(() => expect(getByTestId('dashboard')).toBeInTheDocument());

    fireEvent.click(getByTestId('dashboard'));

    expect(router.state.location.pathname).toBe('/dashboard');
  });

  it('should be able to see logged in user name', async () => {
    const router = createMemoryRouter([
      {
        path: '/',
        element: <Header />,
      },
      {
        path: '/dashboard',
        element: <div>Dashboard</div>,
      },
      {
        path: '/profile',
        element: <div>Profile</div>,
      },
    ]);
    const { getByText } = render(<RouterProvider router={router} />);

    expect(getByText(user.name)).toBeInTheDocument();
  });
});
