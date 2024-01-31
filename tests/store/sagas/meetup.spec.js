import { runSaga } from 'redux-saga';
import { faker } from '@faker-js/faker';
import MockAdapter from 'axios-mock-adapter';
import { toast } from 'react-toastify';

import { cancelMeetup, upsertMeetup } from '~/store/sagas/meetup';
import api from '~/services/api';
import history from '~/services/history';
import * as Actions from '~/store/actions/meetup';
import factory from '../../utils/factory';

jest.mock('react-toastify');

describe('Meetup saga', () => {
  const apiMock = new MockAdapter(api);

  it('should be able to cancel a meetup', async () => {
    const id = faker.number.int();
    const push = jest.spyOn(history, 'push');

    apiMock.onDelete(`meetups/${id}`).reply(200, { id });
    await runSaga({}, cancelMeetup, Actions.cancelMeetup(id)).toPromise();

    expect(push).toHaveBeenCalledWith('/dashboard');
  });

  it('should not be able cancel a meetup', async () => {
    const id = faker.number.int();
    const error = jest.spyOn(toast, 'error');

    apiMock.onDelete(`meetups/${id}`).reply(401, {
      message: "You can't remove past meetups",
    });
    await runSaga({}, cancelMeetup, Actions.cancelMeetup(id)).toPromise();

    expect(error).toHaveBeenCalledWith(
      'Ops! Alguma coisa deu errado, tente novamente!'
    );
  });

  it('should be able to update a meetup', async () => {
    const id = faker.number.int();
    const success = jest.spyOn(toast, 'success');
    const meetup = await factory.attrs('Meetup', { id });

    apiMock.onPut(`meetups/${id}`).reply(200);
    await runSaga({}, upsertMeetup, Actions.upsertMeetup(meetup)).toPromise();

    expect(success).toHaveBeenCalledWith('Meetup atualizado com sucesso!');
  });

  it('should be able to create a meetup', async () => {
    const id = faker.number.int();
    const push = jest.spyOn(history, 'push');
    const meetup = await factory.attrs('Meetup', { id });

    delete meetup.id;

    apiMock.onPost(`meetups`).reply(200, { id });
    await runSaga({}, upsertMeetup, Actions.upsertMeetup(meetup)).toPromise();

    expect(push).toHaveBeenCalledWith(`/meetups/${id}`);
  });

  it('should be able to create a meetup', async () => {
    const error = jest.spyOn(toast, 'error');
    const meetup = await factory.attrs('Meetup');

    apiMock.onPost(`meetups`).reply(400, { message: 'Meetup does not exists' });

    await runSaga({}, upsertMeetup, Actions.upsertMeetup(meetup)).toPromise();

    expect(error).toHaveBeenCalledWith(
      'Ops! Alguma coisa deu errado, tente novamente!'
    );
  });

  it('should not be able to update a meetup', async () => {
    const id = faker.number.int();
    const error = jest.spyOn(toast, 'error');
    const meetup = await factory.attrs('Meetup', { id });

    apiMock
      .onPut(`meetups/${id}`)
      .reply(400, { message: 'Meetup does not exists' });

    await runSaga({}, upsertMeetup, Actions.upsertMeetup(meetup)).toPromise();

    expect(error).toHaveBeenCalledWith(
      'Ops! Alguma coisa deu errado, tente novamente!'
    );
  });
});
