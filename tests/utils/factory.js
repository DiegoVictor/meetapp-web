import factory from 'factory-girl';
import { faker } from '@faker-js/faker';

factory.define(
  'User',
  {},
  {
    id: faker.number.int,
    name: faker.person.fullName,
    email: faker.internet.email,
    password: faker.internet.password,
  }
);

factory.define(
  'Meetup',
  {},
  {
    id: faker.number.int,
    title: faker.lorem.words,
    description: faker.lorem.paragraph,
    localization: faker.location.streetAddress,
    date: faker.date.future,
    banner_id: faker.number.int,
    url: faker.image.url,
    banner: {
      url: faker.image.url,
    },
  }
);

export default factory;
