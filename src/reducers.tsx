import {combineReducers} from 'redux';

import {
    ADD_MOVE_TO_HISTORY, REMOVE_LAST_MOVE_FROM_HISTORY, SET_ERROR, SET_MOVE, SET_OPENING_POSITION, SET_POSITION,
    SET_STATUS,
    UPDATE_LOADING
} from "./actions";
import {Move} from "./OpeningExplorer";
import {IHistoryMove} from "./Chessboard";

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

export const errorReducer = (msg: string = '', action: any) => {
    switch (action.type) {
        case SET_ERROR:
            return action.msg;

        default:
            return msg;
    }
};

export const openingMovesReducer = (moves: Move[] = [], action: any) => {

    switch (action.type) {
        case SET_OPENING_POSITION:
            return action.moves;

        default:
            return moves;
    }
};
export const lastMoveReducer = (move: string = '', action: any) => {
    switch (action.type) {
        case SET_MOVE:
            return action.move;

        default:
            return move;
    }
};
export const statusReducer = (status: string = '', action: any) => {
    switch (action.type) {
        case SET_STATUS:
            return action.status;

        default:
            return status;
    }
};

export const historyReducer = (state: IHistoryMove[] = [], action: any) => {
    let history: IHistoryMove[];
    switch (action.type) {
        case ADD_MOVE_TO_HISTORY:
            history = deepCopy(state);
            history.push(action.fen);
            return history;

        case REMOVE_LAST_MOVE_FROM_HISTORY:
            history = deepCopy(state);
            history.pop();
            return history;

        default:
            return state;
    }
};

export default combineReducers({
    loading: loadingReducer,
    fen: positionReducer,
    lastMove: lastMoveReducer,
    openingMoves: openingMovesReducer,
    error: errorReducer,
    history: historyReducer,
    status: statusReducer,
});

export function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}