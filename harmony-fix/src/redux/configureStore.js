import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { rootReducers } from './combine';

const middlewares = [thunk];

export default function configureStore(initialState) {
  const applyedMiddleware = applyMiddleware(...middlewares);

  const store = createStore(
    rootReducers,
    initialState,
    compose(
      applyedMiddleware,
      f => f
    )
  );

  return store;
}
