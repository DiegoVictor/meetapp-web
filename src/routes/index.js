import React from 'react';
import { useSelector } from 'react-redux';
export default () => {
  const signed = useSelector(state => state.signed);

  return (
    <Router history={history}>
    </Router>
  );
};
