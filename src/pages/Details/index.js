import React, { useEffect, useMemo, useState } from 'react';
import { isBefore, format, parseISO } from 'date-fns';
import api from '~/services/api';
import { Container } from './styles';

export default () => {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const { id } = match.params;
  const [meetup, setMeetup] = useState({});
  const past = useMemo(() => isBefore(meetup.date, new Date()), [meetup]);

  useEffect(() => {
    (async () => {
      const { data: m } = await api.get(`scheduled/${id}`);
      const date = parseISO(m.date);
      setMeetup({
        ...m,
        date,
        description: m.description.split(/\n/).map((text, index) => (
          <p key={String(index)} data-testid={`description_${index}`}>
            {text}
            <br />
          </p>
        )),
        formatted_date: format(date, "dd 'de' MMMM', às' H'h'", {
          locale: pt,
        }),
      });
    })();
  }, [id]);

  return (
    <Container>
    </Container>
  );
};
