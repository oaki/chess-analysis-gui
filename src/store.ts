import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";
import {composeWithDevTools} from "redux-devtools-extension";
import {enableBatching} from "redux-batched-actions";

// import createWorkerMiddleware from 'redux-worker-middleware';


const store = createStore(
    // workerMiddleware,
    enableBatching(reducers),
    composeWithDevTools(
        applyMiddleware(thunk),
    ),
);

export default store;