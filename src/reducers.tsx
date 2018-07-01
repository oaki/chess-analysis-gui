import {combineReducers} from 'redux';

import {
    FLIP_BOARD,
    IOnMove,
    MENU_TOGGLE_OPEN,
    ON_MOVE,
    SET_ERROR,
    SET_EVALUATION,
    SET_HISTORY,
    SET_HISTORY_MOVE,
    SET_LAST_MOVE,
    SET_OPENING_POSITION,
    SET_POSITION,
    SET_STATUS,
    SET_WORKER_LIST,
    UPDATE_LOADING,
    USER_SIGN_IN
} from "./actions";
import {IHistoryMove} from "./components/AwesomeChessboard";
import {historyListReducer} from "./components/historyList/historyList";
import {Move} from "./components/OpeningExplorer";
import {syzygyReducer} from "./components/syzygyExplorer";
import {IAction, IWorkerResponse} from "./interfaces";
import {SessionManagerService} from "./services/sessionManager";

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

interface IHistoryMoveCollection {
    [key: string]: IHistoryMove;
}


export const historyReducer = (state: IHistoryMoveCollection = {}, action: IAction<IHistoryMove | any>) => {
    switch (action.type) {
        case SET_HISTORY_MOVE:
            console.log('state', state);
            console.log('action', action);

            const newState = {...state};
            newState[action.payload.uuid] = action.payload;
            return newState;

        case SET_HISTORY:
            return action.payload;

        default:
            return state;
    }
};

export const lastMoveReducer = (state: string = '', action: any) => {
    switch (action.type) {
        case SET_LAST_MOVE:
            console.log('state', state);
            console.log('action', action);


            return action.uuid;

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

export interface IUser {
    isLoggedIn: boolean;
    email: string;
    name: string;
    img: string;
    googleToken: string;
    token: string;
    last_game_id: number;
}

export const userReducer = (user: IUser = SessionManagerService.getUser(), action: IAction<IUser>) => {
    switch (action.type) {
        case USER_SIGN_IN:
            console.log('old state', user, 'new state', action.payload);
            return {...user, ...action.payload};

        default:
            return user;
    }
};

export interface IWorker {
    name: string;
    uuid: string;
    user_id: number;
    id: number;
    ready: boolean;
}

export const workesReducer = (workerList: IWorker[] = [], action: IAction<IWorker[]>) => {
    switch (action.type) {
        case SET_WORKER_LIST:
            return [...action.payload];

        default:
            return workerList;
    }
};

export const onMoveReducer = (onMove: IOnMove = IOnMove.WHITE, action: IAction<IOnMove>) => {
    switch (action.type) {
        case ON_MOVE:
            return action.payload;

        default:
            return onMove;
    }
};


export default combineReducers({
    loading: loadingReducer,
    user: userReducer,
    fen: positionReducer,
    evaluation: evaluationReducer,
    openingMoves: openingMovesReducer,
    error: errorReducer,
    history: historyReducer,
    status: statusReducer,
    isFlip: flipBoardReducer,
    lastMoveId: lastMoveReducer,
    menu: menuReducer,
    workers: workesReducer,
    onMove: onMoveReducer,
    historyList: historyListReducer,
    syzygy: syzygyReducer,
});

export function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}