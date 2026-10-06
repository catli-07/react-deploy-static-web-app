import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import employeeReducer from './employeedetails/employeeDetails';

const rootReducer = combineReducers({ employee: employeeReducer });

export const store = createStore(rootReducer, applyMiddleware(thunk));