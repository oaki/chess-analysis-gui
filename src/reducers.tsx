import {combineReducers} from 'redux';

import {SET_POSITION, UPDATE_LOADING} from "./actions";

export const loadingReducer = (isLoading: boolean = false, action: any) => {
    switch (action.type) {
        case UPDATE_LOADING:
            return action.isLoading;

        default:
            return isLoading;
    }
};

export const positionReducer = (fen: string = '', action: any) => {
    switch (action.type) {
        case SET_POSITION:
            return action.fen;

        default:
            return fen;
    }
};

export default combineReducers({
    loading: loadingReducer,
    position: positionReducer,
})