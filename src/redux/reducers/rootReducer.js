import { combineReducers } from 'redux';
import userReducer from './userReducer';
import darkModeReducer from './darkModeReducer';

const rootReducer = combineReducers({
    user: userReducer,
    darkMode: darkModeReducer,
});

export default rootReducer;
