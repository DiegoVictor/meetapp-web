import React, { useEffect, useMemo, useState } from 'react';

export default () => {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const { id } = match.params;
  const [meetup, setMeetup] = useState({});
  const past = useMemo(() => isBefore(meetup.date, new Date()), [meetup]);
};
