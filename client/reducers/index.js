import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';

// Import custom components
import authReducer from './authReducer';
import crudReducer from './crudReducer';

const appReducer = (history) => combineReducers({
    router: connectRouter(history),
    crud: crudReducer,
    auth: authReducer,
});

const rootReducer = (state, action) => {

    if (action === 'LOG_OUT_SUCCESS') {
        state = undefined;
    }

    return appReducer(state, action);
};

export default rootReducer;