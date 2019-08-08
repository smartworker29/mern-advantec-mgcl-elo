import {applyMiddleware, compose, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {routerMiddleware} from 'connected-react-router';
import logger from 'redux-logger';

import createRootReducer from '../reducers';
import history from '../utils/history';

export {history};

const middlewares = [thunkMiddleware, logger, routerMiddleware(history)];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(createRootReducer(history),
    {},
    composeEnhancers(
        applyMiddleware(...middlewares)
    )
);

export default store;