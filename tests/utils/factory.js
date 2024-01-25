import factory from 'factory-girl';
import { faker } from '@faker-js/faker';

factory.define(
  'User',
  {},
  {
    id: faker.datatype.number,
    name: faker.name.findName,
    email: faker.internet.email,
    password: faker.internet.password,
  }
);

factory.define(
  'Meetup',
  {},
  {
    id: faker.datatype.number,
    title: faker.lorem.words,
    description: faker.lorem.paragraph,
    localization: faker.address.streetAddress,
    date: faker.date.future,
    banner_id: faker.datatype.number,
    url: faker.image.imageUrl,
    banner: {
      url: faker.image.imageUrl,
    },
  }
);

export default factory;
