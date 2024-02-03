import React from 'react';
import { faker } from '@faker-js/faker';
import { act, render, fireEvent } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import MockAdapter from 'axios-mock-adapter';

import history from '~/services/history';
import { Create } from '~/pages/Create';
import api from '~/services/api';
import { upsertMeetup } from '~/store/actions/meetup';
import factory from '../utils/factory';

jest.mock('react-redux');

describe('Create page', () => {
  const apiMock = new MockAdapter(api);
  it('should be able to go back', async () => {
    const id = faker.number.int();
    const url = faker.image.url();

    apiMock.onPost('files').reply(200, { id, url });

    const { getByTestId } = render(<Create />);

    fireEvent.click(getByTestId('back'));
    expect(history.location.pathname).toBe('/');
  });

  it('should be able to upload image', async () => {
    const id = faker.number.int();
    const url = faker.image.url();
    apiMock.onPost('files').reply(200, { id, url });

    const { getByTestId, getByAltText } = render(<Create />);

    await act(async () => {
      fireEvent.change(getByTestId('file'), {
        target: { files: [new Blob(['content'])] },
      });
    });

    expect(getByAltText('Preview')).toHaveAttribute('src', url);
  });

  it('should be able to create a meetup', async () => {
    const { date, banner_id, title, description, localization, url } =
      await factory.attrs('Meetup');

    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);

    date.setMilliseconds(0);

    apiMock.onPost('files').reply(200, { id: banner_id, url });

    const { getByTestId, getByPlaceholderText } = render(<Create />);

    fireEvent.change(getByPlaceholderText('Título do Meetup'), {
      target: { value: title },
    });

    fireEvent.change(getByPlaceholderText('Descrição completa'), {
      target: { value: description },
    });

    fireEvent.change(getByPlaceholderText('Localização'), {
      target: { value: localization },
    });

    await act(async () => {
      fireEvent.change(getByPlaceholderText('Data do evento'), {
        target: { value: date },
      });
    });

    await act(async () => {
      fireEvent.change(getByTestId('file'), {
        target: { files: [new Blob(['content'])] },
      });
    });

    await act(async () => {
      fireEvent.submit(getByTestId('form'));
    });

    expect(dispatch).toHaveBeenCalledWith(
      upsertMeetup({
        title,
        description,
        localization,
        date,
        banner_id,
      })
    );
  });

  it('should not be able to create a meetup without banner', async () => {
    const { date, title, description, localization } =
      await factory.attrs('Meetup');

    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);

    date.setMilliseconds(0);

    apiMock.onPost('files').reply(200, {});

    const { getByTestId, getByPlaceholderText } = render(<Create />);

    fireEvent.change(getByPlaceholderText('Título do Meetup'), {
      target: { value: title },
    });

    fireEvent.change(getByPlaceholderText('Descrição completa'), {
      target: { value: description },
    });

    fireEvent.change(getByPlaceholderText('Localização'), {
      target: { value: localization },
    });

    await act(async () => {
      fireEvent.change(getByPlaceholderText('Data do evento'), {
        target: { value: date },
      });
    });

    await act(async () => {
      fireEvent.change(getByTestId('file'), {
        target: { files: [new Blob(['content'])] },
      });
    });

    await act(async () => {
      fireEvent.submit(getByTestId('form'));
    });

    expect(dispatch).not.toHaveBeenCalled();
  });
});
