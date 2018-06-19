import {applyMiddleware, createStore} from "redux";
// import createWorkerMiddleware from 'redux-worker-middleware';

import thunk from "redux-thunk";
import reducers from "./reducers";
import {composeWithDevTools} from 'redux-devtools-extension';
import {enableBatching} from 'redux-batched-actions';


export const store = createStore(
    // workerMiddleware,
    enableBatching(reducers),
    composeWithDevTools(
        applyMiddleware(thunk)
    ),
);