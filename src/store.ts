import {applyMiddleware, createStore} from "redux";
// import createWorkerMiddleware from 'redux-worker-middleware';
import thunk from "redux-thunk";
import reducers from "./reducers";
import {composeWithDevTools} from 'redux-devtools-extension';


export const store = createStore(
    // workerMiddleware,
    reducers,
    composeWithDevTools(
        applyMiddleware(thunk)),
);