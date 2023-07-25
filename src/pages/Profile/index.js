import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

};
