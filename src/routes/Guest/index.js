import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export function Guest({ children }) {
  const signed = useSelector((state) => state.signed);

  if (signed) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

Guest.propTypes = {
  children: PropTypes.element.isRequired,
};
