import React from 'react';
import { useDispatch } from 'react-redux';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import MockAdapter from 'axios-mock-adapter';

import { Edit } from '~/pages/Edit';
import history from '~/services/history';
import api from '~/services/api';
import { upsertMeetup } from '~/store/actions/meetup';
import factory from '../utils/factory';

jest.mock('react-redux');
jest.mock('~/services/history');

const id = faker.number.int();
const mockedUseRouteMatch = () => ({
  params: { id },
});
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useRouteMatch: () => mockedUseRouteMatch(),
}));

describe('Edit page', () => {
  const apiMock = new MockAdapter(api);

  it('should be able to back to previous page', async () => {
    const goBack = jest.spyOn(history, 'goBack');
    const meetup = await factory.attrs('Meetup');

    apiMock
      .onGet(`scheduled/${id}`)
      .reply(200, meetup)
      .onPost('files')
      .reply(200, {
        id: faker.number.int(),
        url: meetup.banner.url,
      });

    const { getByTestId } = render(<Edit />);

    await waitFor(() => expect(getByTestId('back')).toBeInTheDocument());
    fireEvent.click(getByTestId('back'));

    expect(goBack).toHaveBeenCalled();
  });

  it('should be able to update a meetup', async () => {
    const { date, banner, description, title, localization, url } =
      await factory.attrs('Meetup', { id });

    let getByPlaceholderText;
    let getByTestId;

    date.setMilliseconds(0);

    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);

    apiMock
      .onGet(`scheduled/${id}`)
      .reply(200, {
        id,
        title,
        localization,
        url,
        date: faker.date.past().toISOString(),
        banner,
        description: '',
      })
      .onPost('files')
      .reply(200, {
        id: faker.number.int(),
        url: banner.url,
      });

    await act(async () => {
      const component = render(<Edit />);
      getByPlaceholderText = component.getByPlaceholderText;
      getByTestId = component.getByTestId;
    });

    fireEvent.change(getByPlaceholderText('Descrição completa'), {
      target: { value: description },
    });

    fireEvent.change(getByPlaceholderText('Data do evento'), {
      target: { value: date },
    });

    await act(async () => {
      fireEvent.submit(getByTestId('form'));
    });

    expect(dispatch).toHaveBeenLastCalledWith(
      upsertMeetup({
        title,
        localization,
        url,
        date,
        description,
        banner: '',
        id,
      })
    );
  });

  it('should not be able to update a meetup with invalid data', async () => {
    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);

    apiMock.onGet(`scheduled/${id}`).reply(200, {});

    const { getByText, getByTestId } = render(<Edit />);

    await act(async () => {
      fireEvent.submit(getByTestId('form'));
    });

    expect(dispatch).not.toHaveBeenLastCalledWith();
    expect(getByText('O campo descrição é obrigatório')).toBeInTheDocument();
    expect(getByText('O campo localização é obrigatório')).toBeInTheDocument();
    expect(getByText('O campo título é obrigatório')).toBeInTheDocument();
  });

  it('should be able to upload a image', async () => {
    let getByTestId;
    let getByAltText;

    const meetup = await factory.attrs('Meetup', { id });

    apiMock
      .onGet(`scheduled/${id}`)
      .reply(200, meetup)
      .onPost('files')
      .reply(200, {
        id: faker.number.int(),
        url: meetup.banner.url,
      });

    await act(async () => {
      const component = render(<Edit />);
      getByTestId = component.getByTestId;
      getByAltText = component.getByAltText;
    });

    await act(async () => {
      fireEvent.change(getByTestId('file'), {
        target: { files: [new Blob(['content'])] },
      });
    });

    expect(getByAltText('Preview')).toHaveAttribute('src', meetup.banner.url);
  });
});
