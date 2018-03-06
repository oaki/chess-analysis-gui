import {applyMiddleware, createStore} from "redux";
// import createWorkerMiddleware from 'redux-worker-middleware';
import thunk from "redux-thunk";
import reducers from "./reducers";

export const store = createStore(
    // workerMiddleware,
    reducers,
    applyMiddleware(thunk)
);