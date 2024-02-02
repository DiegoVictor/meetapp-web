import React from 'react';
import { format } from 'date-fns';
import { MemoryRouter, Router } from 'react-router-dom';
import { fireEvent, render, act } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import { pt } from 'date-fns/locale';

import api from '~/services/api';
import history from '~/services/history';
import { Dashboard } from '~/pages/Dashboard';
import factory from '../utils/factory';

describe('Dashboard page', () => {
  const apiMock = new MockAdapter(api);

  it("should be able to go to create meetup's page", async () => {
    const meetups = await factory.attrsMany('Meetup', 3);
    apiMock.onGet(`scheduled`).reply(
      200,
      meetups.map((meetup) => ({
        ...meetup,
        date: meetup.date.toISOString(),
      }))
    );

    const { getByTestId } = render(
      <Router history={history}>
        <Dashboard />
      </Router>
    );

    await act(async () => {
      fireEvent.click(getByTestId('new'));
    });
    expect(history.location.pathname).toBe('/create');
  });

  it('should be able to get a meetups list', async () => {
    let getByTestId;
    let getByTitle;

    const meetups = await factory.attrsMany('Meetup', 3);

    apiMock.onGet(`scheduled`).reply(
      200,
      meetups.map((meetup) => ({
        ...meetup,
        date: meetup.date.toISOString(),
      }))
    );

    await act(async () => {
      const component = render(
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      );
      getByTestId = component.getByTestId;
      getByTitle = component.getByTitle;
    });

    meetups.forEach((meetup) => {
      expect(getByTitle(meetup.title)).toHaveTextContent(meetup.title);
      expect(getByTestId(`date_${meetup.id}`)).toHaveTextContent(
        format(meetup.date, "dd 'de' MMMM', às' H'h'", { locale: pt })
      );
    });
  });

  it('should be able to navigate to meetup details', async () => {
    let getByTestId;
    const meetup = await factory.attrs('Meetup');

    apiMock.onGet(`scheduled`).reply(200, [meetup]);

    await act(async () => {
      const component = render(
        <Router history={history}>
          <Dashboard />
        </Router>
      );
      getByTestId = component.getByTestId;
    });

    fireEvent.click(getByTestId(`meetup_${meetup.id}`));
    expect(history.location.pathname).toBe(`/meetups/${meetup.id}`);
  });
});
