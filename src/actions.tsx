import {Move} from "./components/OpeningExplorer";
import {IWorkerResponse} from "./interfaces";
import config from "./config";
import {IHistoryMove} from "./components/AwesomeChessboard";
import {IUser, IWorker} from "./reducers";
import {batchActions} from 'redux-batched-actions';
import * as Chess from 'chess.js';
import {getHistoryChildren, getHistoryParents, getLastMove} from "./libs/chessboardUtils";
import {worker} from "cluster";

export const UPDATE_LOADING = 'UPDATE_LOADING';
export const SET_POSITION = 'SET_POSITION';
export const SET_OPENING_POSITION = 'SET_OPENING_POSITION';
export const SET_WORKER_LIST = 'SET_WORKER_LIST';
export const SET_ERROR = 'SET_ERROR';
export const SET_STATUS = 'SET_STATUS';
export const SET_EVALUATION = 'SET_EVALUATION';
export const SET_HISTORY_MOVE = 'SET_HISTORY_MOVE';
export const SET_HISTORY = 'SET_HISTORY';
export const SET_LAST_MOVE = 'SET_LAST_MOVE';
export const FLIP_BOARD = 'FLIP_BOARD';
export const MENU_TOGGLE_OPEN = 'MENU_TOGGLE_OPEN';
export const USER_SIGN_IN = 'USER_SIGN_IN';
export const ON_MOVE = 'ON_MOVE';

export enum IOnMove {
    BLACK,
    WHITE,
}

export function toogleOpenMenu() {
    return {
        type: MENU_TOGGLE_OPEN
    };
}

export function setWhoIsOnMove(onMove: IOnMove) {
    return {
        payload: onMove,
        type: ON_MOVE
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

export function setEvaluation(evaluation: IWorkerResponse[]) {
    return {
        evaluation,
        type: SET_EVALUATION
    };
}

export function setHistoryMove(payload: IHistoryMove) {
    return {
        payload,
        type: SET_HISTORY_MOVE
    };
}

export function setHistory(payload: any) {
    return {
        payload,
        type: SET_HISTORY
    };
}

export function lastMoveId(uuid: string) {
    return {
        uuid,
        type: SET_LAST_MOVE
    };
}

export function setOpeningPosition(moves: Move[]) {
    return {
        moves,
        type: SET_OPENING_POSITION
    };
}

export function setWorkerList(workerList: any[]) {
    return {
        payload: workerList,
        type: SET_WORKER_LIST
    };
}



export function setMove(from: string, to: string, uuid: string) {

    const chess = new Chess();
    const moves: IHistoryMove[] = getHistoryParents(getLastMove());
    moves.reverse();
    for (let move of moves) {
        chess.move({from: move.notation.substring(0, 2), to: move.notation.substring(2, 4)});
    }

    const lastMove: any = chess.move({from: from, to: to});
    const fen: string = chess.fen();
    const parentId = getLastMove();
    const child = getHistoryChildren(parentId);

    //check if move exist in children
    // if yes just move there and do not add new move
    const childMove = child.find((move) => move.fen === fen);
    if (childMove) {
        return batchActions([
            lastMoveId(childMove.uuid),
            setPosition(childMove.fen),
            setEvaluation([]),
            setOpeningPosition([])
        ]);
    }

    return batchActions([
        lastMoveId(uuid),
        setPosition(fen),
        setOpeningPosition([]),
        setEvaluation([]),
        setHistoryMove({
            parentId: getLastMove(),
            uuid,
            fen,
            notation: `${from}${to}`,
            shortNotation: `${lastMove.san}`,
        }),


    ]);
}

export function flipBoard() {
    return {
        type: FLIP_BOARD
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

export function setUser(user: IUser) {
    return {
        payload: user,
        type: USER_SIGN_IN
    };
}

export function loadOpeningBook() {
    return async (dispatch: (data: any) => {}, getState: any) => {
        dispatch(setLoading(true));


        dispatch(setLoading(false));
    }
}

export function loadOpeningPosition(fen: string) {
    return async (dispatch: (data: any) => {}) => {
        console.log('loadOpeningPosition', fen);
        dispatch(setLoading(true));

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


export function loadEngines() {
    return async (dispatch: (data: any) => {}, getState: any) => {
        console.log('data', getState());
        const token = getState()['user']['token'];
        dispatch(setLoading(true));

        const url = `${config.apiHost}/user/workers?offset=${Number(0)}&limit=${Number(10)}`;
        const headers: RequestInit = {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }),
        };

        try {
            const response = await fetch(url, headers);
            if (!response.ok) {
                throw new Error('Loading failed');
            }

            const workerList: any = await response.json();
            console.log(workerList);
            dispatch(setWorkerList(workerList));

            if (workerList.length > 0) {
                dispatch(checkWorkers(workerList));
            }


        } catch (e) {
            dispatch(setError('opening book failed'));
            dispatch(setLoading(false));
            console.log(e);
        }

        dispatch(setLoading(false));
    }

}

export function checkWorkers(workerList: IWorker[]) {
    return async (dispatch: (data: any) => {}, getState: any) => {
        dispatch(setLoading(true));


        const token = getState()['user']['token'];
        const params = workerList.map((worker: IWorker) => worker.uuid).map((uuid: string) => `uuids=${uuid}`).join('&');

        const url = `${config.apiHost}/user/workers/ready?${params}`;
        const options: RequestInit = {
            method: 'GET',
            headers: new Headers({
                'Authorization': `Bearer ${token}`,
            })
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error('Loading failed');
            }

            const json: any = await response.json();
            console.log(json);


        } catch (e) {
            dispatch(setError('Fetch error'));
            dispatch(setLoading(false));
            console.log(e);
        }

        dispatch(setLoading(false));
    }
}

export function addWorker(props: any) {
    return async (dispatch: (data: any) => {}, getState: any) => {

        const token = getState()['user']['token'];
        dispatch(setLoading(true));

        const url = `${config.apiHost}/user/workers`;
        const formData = new FormData();
        formData.append('name', props.name);
        formData.append('uuid', props.uuid);

        const options: RequestInit = {
            method: 'POST',
            headers: new Headers({
                'Authorization': `Bearer ${token}`,
            }),
            body: formData
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error('Loading failed');
            }

            const json: any = await response.json();
            console.log(json);
            dispatch(loadEngines());

        } catch (e) {
            dispatch(setError('Update error'));
            dispatch(setLoading(false));
            console.log(e);
        }

        dispatch(setLoading(false));
    }

}

export function deleteWorker(props: any) {
    return async (dispatch: (data: any) => {}, getState: any) => {

        const token = getState()['user']['token'];
        dispatch(setLoading(true));

        const url = `${config.apiHost}/user/workers/${Number(props.id)}`;
        const headers: RequestInit = {
            method: 'DELETE',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        };

        try {
            const response = await fetch(url, headers);
            if (!response.ok) {
                throw new Error('Loading failed');
            }

            const json: any = await response.json();
            console.log(json);
            dispatch(loadEngines());

        } catch (e) {
            dispatch(setError('opening book failed'));
            dispatch(setLoading(false));
            console.log(e);
        }

        dispatch(setLoading(false));
    }

}


export function addNewGame(callback) {
    return async (dispatch: (data: any) => {}, getState: any) => {

        const user = getState()['user'];
        const token = user.token;
        dispatch(setLoading(true));

        const url = `${config.apiHost}/user/history`;
        const headers: RequestInit = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
        };

        try {
            const response = await fetch(url, headers);
            if (!response.ok) {
                throw new Error('Loading failed');
            }

            const game: any = await response.json();

            dispatch(setUser({...user, last_game_id: game.id}));
            callback();

        } catch (e) {
            dispatch(setError('Adding a new game failed.'));
            dispatch(setLoading(false));
            console.log(e);
        }

        dispatch(setLoading(false));
    }

}