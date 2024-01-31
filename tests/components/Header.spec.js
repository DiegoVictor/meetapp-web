import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { faker } from '@faker-js/faker';
import { MemoryRouter, Router } from 'react-router-dom';

import history from '~/services/history';
import { signOut } from '~/store/actions/user';
import Header from '~/components/Header';

jest.mock('react-redux');

describe('Header component', () => {
  const dispatch = jest.fn();
  useDispatch.mockReturnValue(dispatch);

  const user = {
    name: faker.person.fullName(),
  };
  useSelector.mockImplementation((cb) => cb({ user }));

  it('should be able to logout', async () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    await waitFor(() => expect(getByTestId('logout')).toBeInTheDocument());

    fireEvent.click(getByTestId('logout'));

    expect(dispatch).toHaveBeenCalledWith(signOut());
  });

  it('should be able to navigate to dashboard', async () => {
    const { getByTestId } = render(
      <Router history={history}>
        <Header />
      </Router>
    );

    await waitFor(() => expect(getByTestId('dashboard')).toBeInTheDocument());

    fireEvent.click(getByTestId('dashboard'));

    expect(history.location.pathname).toBe('/dashboard');
  });

  it('should be able to see logged in user name', async () => {
    const { getByText } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(getByText(user.name)).toBeInTheDocument();
  });
});
