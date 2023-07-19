import { createStore, combineReducers, applyMiddleware } from 'redux';
import { all } from 'redux-saga/effects';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';
import { persistReducer } from 'redux-persist';

import user from '~/store/reducers/user';
import signed from '~/store/reducers/signed';
import sagas from '~/store/sagas';

const sagaMiddleware = createSagaMiddleware();
const persisted = persistReducer(
  {
    key: 'meetapp',
    storage,
    whitelist: ['signed', 'user'],
  },
  combineReducers({ user, signed })
);

const enhancer = applyMiddleware(sagaMiddleware);
const store = createStore(persisted, enhancer);

sagaMiddleware.run(function* saga() {
  return yield all(sagas);
});

export default store;
