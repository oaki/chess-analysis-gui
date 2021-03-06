import io from "socket.io-client";
import config from "../config";
import store from "../store";
import {Nullable} from "../interfaces";

export const messageTypes = {
    workerEvaluation: "workerEvaluation",
    syzygyEvaluation: "syzygyEvaluation",
    noWorkerAvailable: "noWorkerAvailable",
    openingMoves: "openingMoves",
}


export class SocketReduxMiddleware {
    private signInToken: string = '';
    private socket: Nullable<SocketIOClient.Socket> = null;

    constructor() {

    }

    setSignInToken(token: string) {
        this.signInToken = token;
    }

    register() {

        this.socket = io(config.socketIo.host, {
            path: config.socketIo.path,
            query: {
                token: this.signInToken,
                type: "user"
            },
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 99999
        });

        if(this.socket) {
            Object.keys(messageTypes)
                .forEach(type => this.socket && this.socket.on(type, (payload) =>
                        store.dispatch({type, payload})
                    )
                );
        }
    }

    emit(type, payload) {
        this.socket && this.socket.emit(type, payload)
    };
}

export const SocketReduxService = new SocketReduxMiddleware();