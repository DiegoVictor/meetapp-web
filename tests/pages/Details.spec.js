import React from 'react';
import { format } from 'date-fns';
import { useDispatch } from 'react-redux';
import { MemoryRouter, Router } from 'react-router-dom';
import { fireEvent, render, act, waitFor } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import MockAdapter from 'axios-mock-adapter';
import { pt } from 'date-fns/locale';

import { cancelMeetup } from '~/store/actions/meetup';
import api from '~/services/api';
import { Details } from '~/pages/Details';
import history from '~/services/history';
import factory from '../utils/factory';

jest.mock('react-redux');

const id = faker.number.int();
const mockedUseRouteMatch = () => ({
  params: { id },
});
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useRouteMatch: () => mockedUseRouteMatch(),
}));

describe('Detail page', () => {
  const apiMock = new MockAdapter(api);

  it('should be able to go to edit meetup page', async () => {
    const meetup = await factory.attrs('Meetup');
    apiMock.onGet(`scheduled/${id}`).reply(200, meetup);

    const { getByText } = render(
      <Router history={history}>
        <Details />
      </Router>
    );

    await waitFor(() => expect(getByText('Editar')).toBeInTheDocument());

    fireEvent.click(getByText('Editar'));

    expect(history.location.pathname).toBe(`/meetups/${id}/edit`);
  });

  it('should be able to delete a meetup', async () => {
    const dispatch = jest.fn();
    const meetup = await factory.attrs('Meetup');

    apiMock.onGet(`scheduled/${id}`).reply(200, meetup);
    useDispatch.mockReturnValue(dispatch);

    const { getByText } = render(
      <MemoryRouter>
        <Details />
      </MemoryRouter>
    );

    await waitFor(() => expect(getByText('Cancelar')).toBeInTheDocument());

    fireEvent.click(getByText('Cancelar'));

    expect(dispatch).toHaveBeenCalledWith(cancelMeetup(id));
  });

  it('should be able to see meetup data', async () => {
    let getByAltText;
    let getByTestId;

    const meetup = await factory.attrs('Meetup');
    apiMock.onGet(`scheduled/${id}`).reply(200, meetup);

    await act(async () => {
      const component = render(
        <Router history={history}>
          <Details />
        </Router>
      );
      getByAltText = component.getByAltText;
      getByTestId = component.getByTestId;
    });

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
