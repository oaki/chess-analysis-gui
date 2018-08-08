import {IWorkerResponse} from "./interfaces";
import config from "./config";
import {IUser, IWorker} from "./reducers";
import {SessionManagerService} from "./services/sessionManager";
import {Flash} from "./services/errorManager";

export const UPDATE_LOADING = "UPDATE_LOADING";
export const SET_POSITION = "SET_POSITION";

export const SET_WORKER_LIST = "SET_WORKER_LIST";

export const SET_STATUS = "SET_STATUS";
export const SET_EVALUATION = "SET_EVALUATION";
export const SET_HISTORY_MOVE = "SET_HISTORY_MOVE";
export const SET_HISTORY = "SET_HISTORY";
export const SET_LAST_MOVE = "SET_LAST_MOVE";
export const USER_SIGN_IN = "USER_SIGN_IN";
export const SET_PROMOTION_DIALOG = "SET_PROMOTION_DIALOG";
export const ON_MOVE = "ON_MOVE";

export enum IOnMove {
    BLACK,
    WHITE,
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


export function setWorkerList(workerList: any[]) {
    return {
        payload: workerList,
        type: SET_WORKER_LIST
    };
}


export interface ISetMoveProps {
    from: string;
    to: string;
    id: number;
    promotion?: string;
    fen: string;
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


export function loadEngines() {
    return async (dispatch: (data: any) => {}, getState: any) => {
        console.log("data", getState());
        const token = getState()["user"]["token"];
        dispatch(setLoading(true));

        const url = `${config.apiHost}/user/workers?offset=${Number(0)}&limit=${Number(10)}`;
        const headers: RequestInit = {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }),
        };

        try {
            const response = await fetch(url, headers);
            if (!response.ok) {
                throw new Error("Loading failed");
            }

            const workerList: any = await response.json();
            console.log(workerList);
            dispatch(setWorkerList(workerList));

            if (workerList.length > 0) {
                dispatch(checkWorkers(workerList));
            }


        } catch (e) {
            Flash.error({msg: "opening book failed", identifier: "loadEngines"});
            dispatch(setLoading(false));
            console.log(e);
        }

        dispatch(setLoading(false));
    }

}

export function checkWorkers(workerList: IWorker[]) {
    return async (dispatch: (data: any) => {}, getState: any) => {
        dispatch(setLoading(true));


        const token = getState()["user"]["token"];
        const params = workerList.map((worker: IWorker) => worker.uuid).map((uuid: string) => `uuids=${uuid}`).join("&");

        const url = `${config.apiHost}/user/workers/ready?${params}`;
        const options: RequestInit = {
            method: "GET",
            headers: new Headers({
                "Authorization": `Bearer ${token}`,
            })
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error("Loading failed");
            }

            const json: any = await response.json();
            console.log(json);


        } catch (e) {
            Flash.error({msg: "Fetch error", identifier: "workers"});

            dispatch(setLoading(false));
            console.log(e);
        }

        dispatch(setLoading(false));
    }
}

export function addWorker(props: any) {
    return async (dispatch: (data: any) => {}, getState: any) => {

        const token = getState()["user"]["token"];
        dispatch(setLoading(true));

        const url = `${config.apiHost}/user/workers`;
        const formData = new FormData();
        formData.append("name", props.name);
        formData.append("uuid", props.uuid);

        const options: RequestInit = {
            method: "POST",
            headers: new Headers({
                "Authorization": `Bearer ${token}`,
            }),
            body: formData
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error("Loading failed");
            }

            const json: any = await response.json();
            console.log(json);
            dispatch(loadEngines());

        } catch (e) {

            Flash.error({msg: "Update error", identifier: "worker"});
            dispatch(setLoading(false));
            console.log(e);
        }

        dispatch(setLoading(false));
    }

}

export function deleteWorker(props: any) {
    return async (dispatch: (data: any) => {}, getState: any) => {

        const token = getState()["user"]["token"];
        dispatch(setLoading(true));

        const url = `${config.apiHost}/user/workers/${Number(props.id)}`;
        const headers: RequestInit = {
            method: "DELETE",
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            })
        };

        try {
            const response = await fetch(url, headers);
            if (!response.ok) {
                throw new Error("Loading failed");
            }

            const json: any = await response.json();
            console.log(json);
            dispatch(loadEngines());

        } catch (e) {
            Flash.error({msg: "opening book failed", identifier: "worker"});
            dispatch(setLoading(false));
            console.log(e);
        }

        dispatch(setLoading(false));
    }

}


export function addNewGame(callback) {
    return async (dispatch: (data: any) => {}, getState: any) => {

        const user = getState()["user"];
        const token = user.token;
        dispatch(setLoading(true));

        const url = `${config.apiHost}/user/history`;
        const headers: RequestInit = {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            })
        };

        try {
            const response = await fetch(url, headers);
            if (!response.ok) {
                throw new Error("Loading failed");
            }

            const game: any = await response.json();

            const newUser = {...user, last_game_id: game.id};
            SessionManagerService.setUser(newUser);
            dispatch(setUser({...user, last_game_id: game.id}));
            callback(game.id);

        } catch (e) {
            Flash.error({msg: "Adding a new game failed.", identifier: "game"});
            dispatch(setLoading(false));
            console.log(e);
        }

        dispatch(setLoading(false));
    }

}