import {combineReducers} from 'redux';

import {
    ADD_MOVE_TO_HISTORY, FLIP_BOARD, HISTORY_REDO, HISTORY_UNDO, MENU_TOGGLE_OPEN, REMOVE_LAST_MOVE_FROM_HISTORY,
    SET_ERROR,
    SET_EVALUATION,
    SET_HISTORY, SET_MOVE,
    SET_OPENING_POSITION,
    SET_POSITION,
    SET_STATUS,
    UPDATE_LOADING
} from "./actions";
import {Move} from "./OpeningExplorer";
import {IHistoryMove} from "./Chessboard";
import {Evaluation} from "./SocketIoProvider";
import {IWorkerResponse, LINE_MAP} from "./interfaces";

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

// const defaultEvaluation: IWorkerResponse = {
//     [LINE_MAP.score]: '',
//     [LINE_MAP.depth]: 0,
//     [LINE_MAP.pv]: '',
//     [LINE_MAP.nodes]: 0,
//     [LINE_MAP.time]: '',
//     [LINE_MAP.multipv]: '',
//     [LINE_MAP.nps]: '',
//     [LINE_MAP.tbhits]: '',
//     [LINE_MAP.import]: '',
// };
export const evaluationReducer = (evaluation: IWorkerResponse | Move[] = [], action: any): IWorkerResponse | Move[] => {
        switch (action.type) {
            case SET_EVALUATION:
                return action.evaluation;

            default:
                return evaluation;
        }
    }
;
/*

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
*/


export const historyReducer = (state: string[] = [], action: any) => {
    switch (action.type) {
        case SET_HISTORY:
            return action.history;

        default:
            return state;
    }
};
export const flipBoardReducer = (isFlip: boolean = false, action: any) => {
    switch (action.type) {
        case FLIP_BOARD:
            return !isFlip;

        default:
            return isFlip;
    }
};

export const historyUndoReducer = (hash: number = 0, action: any) => {
    switch (action.type) {
        case HISTORY_UNDO:
            return action.hash;

        default:
            return hash;
    }
};

export const historyRedoReducer = (hash: number = 0, action: any) => {
    switch (action.type) {
        case HISTORY_REDO:
            return action.hash;

        default:
            return hash;
    }
};

interface Menu {
    isSubMenuOpen: boolean;
}

export const menuReducer = (menu: Menu = {isSubMenuOpen: false}, action: any) => {
    switch (action.type) {
        case MENU_TOGGLE_OPEN:
            const m = {...menu};
            m.isSubMenuOpen = !m.isSubMenuOpen;
            return m;

        default:
            return menu;
    }
};

export default combineReducers({
    loading: loadingReducer,
    fen: positionReducer,
    evaluation: evaluationReducer,
    lastMove: lastMoveReducer,
    openingMoves: openingMovesReducer,
    error: errorReducer,
    history: historyReducer,
    status: statusReducer,
    isFlip: flipBoardReducer,
    historyUndo: historyUndoReducer,
    historyRedo: historyRedoReducer,
    menu: menuReducer,
});

export function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}