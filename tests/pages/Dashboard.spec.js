import React from 'react';
import { format } from 'date-fns';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { fireEvent, render, act, waitFor } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import { pt } from 'date-fns/locale';

import api from '~/services/api';
import { Dashboard } from '~/pages/Dashboard';
import factory from '../utils/factory';

const apiMock = new MockAdapter(api);

describe('Dashboard page', () => {
  it("should be able to go to create meetup's page", async () => {
    const meetups = await factory.attrsMany('Meetup', 3);
    apiMock.onGet(`scheduled`).reply(
      200,
      meetups.map((meetup) => ({
        ...meetup,
        date: meetup.date.toISOString(),
      }))
    );

    const router = createMemoryRouter([
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: `/create`,
        element: <div>Create</div>,
      },
    ]);
    const { getByTestId } = render(<RouterProvider router={router} />);

    await act(async () => {
      fireEvent.click(getByTestId('new'));
    });
    expect(router.state.location.pathname).toBe('/create');
  });

  it('should be able to get a meetups list', async () => {
    const meetups = await factory.attrsMany('Meetup', 3);

    apiMock.onGet(`scheduled`).reply(
      200,
      meetups.map((meetup) => ({
        ...meetup,
        date: meetup.date.toISOString(),
      }))
    );

    const router = createMemoryRouter([
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: `/create`,
        element: <div>Create</div>,
      },
    ]);

    const { getByTestId, getByTitle } = render(
      <RouterProvider router={router} />
    );

    const [{ title }] = meetups;
    await waitFor(() => getByTitle(title));

    meetups.forEach((meetup) => {
      expect(getByTitle(meetup.title)).toHaveTextContent(meetup.title);
      expect(getByTestId(`date_${meetup.id}`)).toHaveTextContent(
        format(meetup.date, "dd 'de' MMMM', às' H'h'", { locale: pt })
      );
    });
  });

  it('should be able to navigate to meetup details', async () => {
    const meetup = await factory.attrs('Meetup');

    apiMock.onGet(`scheduled`).reply(200, [meetup]);

    const router = createMemoryRouter([
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: `/meetups/${meetup.id}`,
        element: <div>Meetup</div>,
      },
      {
        path: `/create`,
        element: <div>Create</div>,
      },
    ]);
    const { getByTestId } = render(<RouterProvider router={router} />);

    await waitFor(() => getByTestId(`meetup_${meetup.id}`));

    fireEvent.click(getByTestId(`meetup_${meetup.id}`));
    expect(router.state.location.pathname).toBe(`/meetups/${meetup.id}`);
  });
});
