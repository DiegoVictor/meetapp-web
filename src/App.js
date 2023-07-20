import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { ToastContainer } from 'react-toastify';

import Routes from './routes';
import { Theme } from '~/styles/theme';
import store from '~/store';

export default () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistStore(store)}>
        <Theme />
        <Routes />
        <ToastContainer />
      </PersistGate>
    </Provider>
  );
};
