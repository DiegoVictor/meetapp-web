import React from 'react';
import { useDispatch } from 'react-redux';

import Centralize from '~/components/Centralize';

export default () => {
  const dispatch = useDispatch();
  return (
    <Centralize>
    </Centralize>
  );
};
