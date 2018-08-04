import {combineReducers} from "redux";

import {
    IOnMove,
    ON_MOVE,
    SET_ERROR,
    SET_EVALUATION,
    SET_LAST_MOVE,
    SET_OPENING_POSITION,
    SET_POSITION,
    SET_STATUS,
    SET_WORKER_LIST,
    UPDATE_LOADING,
    USER_SIGN_IN
} from "./actions";
import {historyListReducer} from "./components/historyList/historyList";
import {Move} from "./components/OpeningExplorer";
import {syzygyReducer} from "./components/syzygyExplorer";
import {IAction, IWorkerResponse} from "./interfaces";
import {SessionManagerService} from "./services/sessionManager";
import {promotionDialogReducer} from "./components/chessboard/promotingDialog";
import {historyReducer} from "./components/history/History";
import {autoplayReducer, flipBoardReducer, menuReducer} from "./components/Menu";

export const loadingReducer = (isLoading: boolean = false, action: any) => {
    switch (action.type) {
        case UPDATE_LOADING:
            return action.isLoading;

        default:
            return isLoading;
    }
};

export const positionReducer = (fen: string = "", action: any) => {
    switch (action.type) {
        case SET_POSITION:
            return action.fen;

        default:
            return fen;
    }
};

export const errorReducer = (msg: string = "", action: any) => {
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

export const statusReducer = (status: string = "", action: any) => {
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


export const lastMoveReducer = (state: number = -1, action: any) => {
    switch (action.type) {
        case SET_LAST_MOVE:
            return action.id;

        default:
            return state;
    }
};

export interface IUser {
    isLoggedIn: boolean;
    email: string;
    name: string;
    img: string;
    token: string;
    last_game_id: number;
}

export const userReducer = (user: IUser = SessionManagerService.getUser(), action: IAction<IUser>) => {
    switch (action.type) {
        case USER_SIGN_IN:
            console.log("old state", user, "new state", action.payload);
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

export const workerReducer = (workerList: IWorker[] = [], action: IAction<IWorker[]>) => {
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
    workers: workerReducer,
    onMove: onMoveReducer,
    historyList: historyListReducer,
    syzygy: syzygyReducer,
    promotionDialog: promotionDialogReducer,
    autoplay: autoplayReducer,
});

export function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}