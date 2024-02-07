import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { all } from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { user } from '~/store/reducers/user';
import { signed } from '~/store/reducers/signed';
import sagas from '~/store/sagas';
import persistReducer from 'redux-persist/es/persistReducer';

const reducers = persistReducer(
  {
    key: 'root',
    storage: AsyncStorage,
  },
  combineReducers({
    user,
    signed,
  })
);

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(function* saga() {
  return yield all(sagas);
});

export default store;
