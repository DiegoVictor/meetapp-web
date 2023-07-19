import React from 'react';
import { useSelector } from 'react-redux';
import { Route as ReactRoute, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const Route = ({ privated, component: Component, ...props }) => {
  const signed = useSelector(state => state.signed);

  return (
    <ReactRoute
      {...props}
      render={({ location, match }) => {
        if (privated && !signed) {
          return (
            <Redirect
              to={{
                state: { from: location },
                pathname: '/',
              }}
            />
          );
        }
        return <Component match={match} />;
      }}
    />
  );
};

Route.propTypes = {
  privated: PropTypes.bool,
  component: PropTypes.func.isRequired,
};

Route.defaultProps = {
  privated: false,
};

export default Route;
