import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import MockAdapter from 'axios-mock-adapter';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { Edit } from '~/pages/Edit';
import api from '~/services/api';
import { upsertMeetup } from '~/store/actions/meetup';
import factory from '../utils/factory';

const mockUseDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockUseDispatch(),
}));

const id = faker.number.int();
const mockedUseMatch = () => ({
  params: { id },
});
const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate(),
  useMatch: () => mockedUseMatch(),
}));

const apiMock = new MockAdapter(api);

describe('Edit page', () => {
  it('should be able to back to previous page', async () => {
    const meetup = await factory.attrs('Meetup');

    apiMock
      .onGet(`scheduled/${id}`)
      .reply(200, meetup)
      .onPost('files')
      .reply(200, {
        id: faker.number.int(),
        url: meetup.banner.url,
      });

    const navigate = jest.fn();
    mockUseNavigate.mockReturnValueOnce(navigate);

    const router = createMemoryRouter([
      {
        path: '/',
        element: <Edit />,
      },
    ]);
    const { getByTestId } = render(<RouterProvider router={router} />);

    await waitFor(() => getByTestId('back'));
    fireEvent.click(getByTestId('back'));

    expect(navigate).toHaveBeenCalled();
  });

  it('should be able to update a meetup', async () => {
    const { date, banner, description, title, localization, url } =
      await factory.attrs('Meetup', { id });

    date.setMilliseconds(0);

    const dispatch = jest.fn();
    mockUseDispatch.mockReturnValue(dispatch);

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

    const router = createMemoryRouter([
      {
        path: '/',
        element: <Edit />,
      },
    ]);
    const { getByPlaceholderText, getByTestId } = render(
      <RouterProvider router={router} />
    );

    const input = getByPlaceholderText('Descrição completa');
    await waitFor(() => input.value === description);

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
    mockUseDispatch.mockReturnValue(dispatch);

    apiMock.onGet(`scheduled/${id}`).reply(200, {});

    const router = createMemoryRouter([
      {
        path: '/',
        element: <Edit />,
      },
    ]);
    const { getByText, getByTestId } = render(
      <RouterProvider router={router} />
    );

    await act(async () => {
      fireEvent.submit(getByTestId('form'));
    });

    expect(dispatch).not.toHaveBeenLastCalledWith();
    expect(getByText('O campo descrição é obrigatório')).toBeInTheDocument();
    expect(getByText('O campo localização é obrigatório')).toBeInTheDocument();
    expect(getByText('O campo título é obrigatório')).toBeInTheDocument();
  });

  it('should be able to upload a image', async () => {
    const meetup = await factory.attrs('Meetup', { id });

    apiMock
      .onGet(`scheduled/${id}`)
      .reply(200, meetup)
      .onPost('files')
      .reply(200, {
        id: faker.number.int(),
        url: meetup.banner.url,
      });

    const router = createMemoryRouter([
      {
        path: '/',
        element: <Edit />,
      },
    ]);
    const { getByTestId, getByAltText } = render(
      <RouterProvider router={router} />
    );

    await act(async () => {
      fireEvent.change(getByTestId('file'), {
        target: { files: [new Blob(['content'])] },
      });
    });

    expect(getByAltText('Preview')).toHaveAttribute('src', meetup.banner.url);
  });
});
