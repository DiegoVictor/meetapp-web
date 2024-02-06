import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export function Privated({ children }) {
  const signed = useSelector((state) => state.signed);

  if (!signed) {
    return <Navigate to="/" />;
  }

  return children;
}

Privated.propTypes = {
  children: PropTypes.element.isRequired,
};
