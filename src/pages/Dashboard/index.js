import React, { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import api from '~/services/api';
import { Container, Header } from './styles';

export default () => {
  const [meetups, setMeetups] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await api.get('scheduled');
      setMeetups(
        response.data.map(meetup => ({
          ...meetup,
          formatted_date: format(
            parseISO(meetup.date),
            "dd 'de' MMMM', às' H'h'",
            { locale: pt }
          ),
        }))
      );
    })();
  }, []);

  return (
    <Container>
    </Container>
  );
};
