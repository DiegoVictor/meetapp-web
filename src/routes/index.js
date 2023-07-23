import React from 'react';
import { Redirect, Router, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';

import SignIn from '~/pages/Sign/In';
import history from '~/services/history';
import Header from '~/components/Header';
import Route from './Route';
import { Container } from '~/styles/theme';

export default () => {
  const signed = useSelector(state => state.signed);

  return (
    <Router history={history}>
      <Container>
        {signed && <Header />}
        <Route
          path="/"
          exact
          component={() => {
            if (signed) {
              return <Redirect to="/dashboard" />;
            }
            return <SignIn />;
          }}
        />
        <Route path="/signup" component={SignUp} exact />
      </Container>
    </Router>
  );
};
