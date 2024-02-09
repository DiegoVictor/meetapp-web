import React from 'react';
import { format } from 'date-fns';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import MockAdapter from 'axios-mock-adapter';
import { pt } from 'date-fns/locale';

import { cancelMeetup } from '~/store/actions/meetup';
import api from '~/services/api';
import { Details } from '~/pages/Details';
import factory from '../utils/factory';

const mockUseDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockUseDispatch(),
}));

const id = faker.number.int();
const mockUseMatch = () => ({
  params: { id },
});
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useMatch: () => mockUseMatch(),
}));

const apiMock = new MockAdapter(api);

describe('Detail page', () => {
  it('should be able to go to edit meetup page', async () => {
    const meetup = await factory.attrs('Meetup');
    apiMock.onGet(`scheduled/${id}`).reply(200, meetup);

    const router = createMemoryRouter([
      {
        path: '/',
        element: <Details />,
      },
      {
        path: `/meetups/${id}/edit`,
        element: <div>Meetup</div>,
      },
      {
        path: `/dashboard`,
        element: <div>Dashboard</div>,
      },
    ]);
    const { getByText } = render(<RouterProvider router={router} />);

    await waitFor(() => getByText('Editar'));

    fireEvent.click(getByText('Editar'));

    expect(router.state.location.pathname).toBe(`/meetups/${id}/edit`);
  });

  it('should be able to delete a meetup', async () => {
    const dispatch = jest.fn();
    const meetup = await factory.attrs('Meetup');

    apiMock.onGet(`scheduled/${id}`).reply(200, meetup);
    mockUseDispatch.mockReturnValue(dispatch);

    const router = createMemoryRouter([
      {
        path: '/',
        element: <Details />,
      },
      {
        path: `/meetups/${id}/edit`,
        element: <div>Meetup</div>,
      },
      {
        path: `/dashboard`,
        element: <div>Dashboard</div>,
      },
    ]);
    const { getByText } = render(<RouterProvider router={router} />);

    await waitFor(() => getByText('Cancelar'));

    fireEvent.click(getByText('Cancelar'));

    expect(dispatch).toHaveBeenCalledWith(cancelMeetup(id));
  });

  it('should be able to see meetup data', async () => {
    const meetup = await factory.attrs('Meetup');
    apiMock.onGet(`scheduled/${id}`).reply(200, meetup);

    const router = createMemoryRouter([
      {
        path: '/',
        element: <Details />,
      },
      {
        path: `/meetups/${id}/edit`,
        element: <div>Meetup</div>,
      },
      {
        path: `/dashboard`,
        element: <div>Dashboard</div>,
      },
    ]);
    const { getByAltText, getByTestId } = render(
      <RouterProvider router={router} />
    );

    await waitFor(() => getByAltText(meetup.title));

    expect(getByAltText(meetup.title)).toHaveAttribute(
      'src',
      meetup.banner.url
    );

    meetup.description.split('\n').forEach((text, index) => {
      expect(getByTestId(`description_${index}`)).toHaveTextContent(
        text.trim()
      );
    });

    expect(getByTestId('date')).toHaveTextContent(
      format(meetup.date, "dd 'de' MMMM', às' H'h'", {
        locale: pt,
      })
    );

    expect(getByTestId('localization')).toHaveTextContent(meetup.localization);
  });
});
