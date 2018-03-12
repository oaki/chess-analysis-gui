import {Move} from "./OpeningExplorer";
import {find as findInBook} from "./services/offlineBook";
import {Evaluation} from "./SocketIoProvider";
import {IWorkerResponse} from "./interfaces";
import config from "./config";

export const UPDATE_LOADING = 'UPDATE_LOADING';
export const SET_POSITION = 'SET_POSITION';
export const SET_OPENING_POSITION = 'SET_OPENING_POSITION';
export const SET_ERROR = 'SET_ERROR';
export const ADD_MOVE_TO_HISTORY = 'ADD_MOVE_TO_HISTORY';
export const REMOVE_LAST_MOVE_FROM_HISTORY = 'REMOVE_LAST_MOVE_FROM_HISTORY';
export const SET_MOVE = 'SET_MOVE';
export const SET_STATUS = 'SET_STATUS';
export const LOAD_OPENING_BOOK = 'LOAD_OPENING_BOOK';
export const SET_EVALUATION = 'SET_EVALUATION';
export const SET_HISTORY = 'SET_HISTORY';
export const FLIP_BOARD = 'FLIP_BOARD';
export const HISTORY_UNDO = 'HISTORY_UNDO';
export const HISTORY_REDO = 'HISTORY_REDO';
export const MENU_TOGGLE_OPEN = 'MENU_TOGGLE_OPEN';


export function toogleOpenMenu() {
    return {
        type: MENU_TOGGLE_OPEN
    };
}
export function setLoading(isLoading: boolean) {
    return {
        isLoading,
        type: UPDATE_LOADING
    };
}

export function setPosition(fen: string) {
    return {
        fen,
        type: SET_POSITION
    };
}

export function setEvaluation(evaluation: IWorkerResponse) {
    return {
        evaluation,
        type: SET_EVALUATION
    };
}

export function setHistory(history: string[]) {
    return {
        history,
        type: SET_HISTORY
    };
}

export function setOpeningPosition(moves: Move[]) {
    return {
        moves,
        type: SET_OPENING_POSITION
    };
}

export function addMoveToHistory(fen: string) {
    return {
        fen,
        type: ADD_MOVE_TO_HISTORY
    };
}

export function removeLastMoveFromHistory() {
    return {
        type: REMOVE_LAST_MOVE_FROM_HISTORY
    };
}

export function setMove(move: string) {
    return {
        move,
        type: SET_MOVE
    };
}

export function flipBoard() {
    return {
        type: FLIP_BOARD
    };
}

export function historyUndo(hash: number) {
    return {
        hash,
        type: HISTORY_UNDO
    };
}

export function historyRedo(hash: number) {
    return {
        hash,
        type: HISTORY_REDO
    };
}

export function setError(msg: string) {
    return {
        msg,
        type: SET_ERROR
    };
}

export function setStatus(status: string) {
    return {
        status,
        type: SET_STATUS
    };
}

export function loadOpeningBook() {
    return async (dispatch: (data: any) => {}, getState: any) => {
        dispatch(setLoading(true));


        dispatch(setLoading(false));
    }
}

export function loadEvaluation(fen: string) {
    return async (dispatch: (data: any) => {}, getState: any) => {
        dispatch(setLoading(true));


        dispatch(setLoading(false));
    }
}


export function loadOpeningPosition(fen: string) {
    return async (dispatch: (data: any) => {}) => {
        dispatch(setLoading(true));

        // const t = await findInBook(fen);
        // console.log('TTTT', t);


        const url = `${config.apiHost}/opening-book?fen=${fen}`;
        const headers: RequestInit = {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        };

        try {
            const response = await fetch(url, headers);
            if (response.ok) {
                const moves: any = await response.json();
                console.log(moves);
                dispatch(setOpeningPosition(moves));
            } else {
                dispatch(setOpeningPosition([]));
            }

        } catch (e) {
            dispatch(setError('opening book failed'));
            console.log(e);
        }

        dispatch(setLoading(false));
    }

}