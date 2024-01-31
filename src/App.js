import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { ToastContainer } from 'react-toastify';

import { Theme } from '~/styles/theme';
import store from '~/store';
import { Navigation } from './routes';

export function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistStore(store)}>
        <Theme />
        <Navigation />
        <ToastContainer />
      </PersistGate>
    </Provider>
  );
}
