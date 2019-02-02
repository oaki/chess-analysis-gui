import {combineReducers} from "redux";

import {
    IOnMove,
    ON_MOVE,
    SET_EVALUATION,
    SET_LAST_MOVE,
    SET_LAST_MOVE_ID,
    SET_POSITION,
    SET_STATUS,
    SET_WORKER_LIST,
    UPDATE_LOADING,
    USER_SIGN_IN
} from "./actions";
import {historyListReducer} from "./components/historyList/historyListReducers";
import {IOpeningMove, openingMovesReducer} from "./components/openingExplorer/openingExplorerReducers";
import {syzygyReducer} from "./components/syzygyExplorer/syzygyExplorerReducers";
import {IAction, IWorkerResponse} from "./interfaces";

import {historyReducer} from "./components/history/historyReducers";
import {autoplayReducer, flipBoardReducer, menuReducer, pgnDialogReducer} from "./components/menu/menuReducers";
import {promotionDialogReducer} from "./components/chessboard/promotingDialogReducers";
import {errorReducers} from "./services/errorManager";
import {isOnlineReducer} from "./services/onlineIndicator";
import {settingsReducer} from "./layouts/settingPage";
import {panelTabReducer} from "./components/infoPanel/infoPanelReducers";
import {socketReducer} from "./services/socketService";
import {gamesDatabaseReducer} from "./components/gamesDatabaseExplorer/gamesDatabaseReducers";

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
export const evaluationReducer = (evaluation: IWorkerResponse | IOpeningMove[] = [], action: any): IWorkerResponse | IOpeningMove[] => {
        switch (action.type) {
            case SET_EVALUATION:
                return action.evaluation;

            default:
                return evaluation;
        }
    }
;


export const lastMoveIdReducer = (state: number = -1, action: any) => {
    switch (action.type) {
        case SET_LAST_MOVE_ID:
            return action.id;

        default:
            return state;
    }
};


export const lastMoveReducer = (state: ILastMove = {from: "", to: ""}, action: IAction<ILastMove>) => {
    switch (action.type) {
        case SET_LAST_MOVE:
            return action.payload;

        default:
            return state;
    }
};

export interface ILastMove {
    from: string,
    to: string
}
export interface IUser {
    isLoggedIn: boolean;
    email?: string;
    name?: string;
    img?: string;
    lastGameId?: number;
}

export const userReducer = (user: IUser = {isLoggedIn: false}, action: IAction<IUser>) => {
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
    errors: errorReducers,
    history: historyReducer,
    status: statusReducer,
    isFlip: flipBoardReducer,
    lastMoveId: lastMoveIdReducer,
    lastMove: lastMoveReducer,
    menu: menuReducer,
    workers: workerReducer,
    onMove: onMoveReducer,
    historyList: historyListReducer,
    syzygy: syzygyReducer,
    promotionDialog: promotionDialogReducer,
    autoplay: autoplayReducer,
    isOnline: isOnlineReducer,
    settings: settingsReducer,
    pgnDialog: pgnDialogReducer,
    panelTab: panelTabReducer,
    socket: socketReducer,
    gameDatabase: gamesDatabaseReducer
});

export function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}