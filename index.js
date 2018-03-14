import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import reducer from './reducer';
import AppContainer from './app-container.js';
import { startTimer } from './actions';

const reducers = combineReducers({
  app: reducer
});

const store = createStore(
  reducers,
  applyMiddleware(thunk)
);

render(
  <Provider store={store}>
    <AppContainer />
  </Provider >,
  document.body.appendChild(document.createElement('div'))
);

store.dispatch(startTimer());
