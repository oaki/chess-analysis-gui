import * as io from "socket.io-client";
import config from "../config";
import store from "../store";

// this.socket.on("workerEvaluation", this.handleResult);
// this.socket.on("syzygyEvaluation", this.handleSyzygyResult);
// this.socket.on("noWorkerAvailable", this.handleOfflineWorker);
// // this.socket.on('openingMoves', this.handleOpeningMoves);
//
// this.socket.on("disconnect", () => {
//     Flash.error({msg: "Cloud engine disconnect", identifier: "socket"});
// });
//
// this.socket.on("connect_timeout", (timeout) => {
//     Flash.error({msg: "Cloud engine connection timeout", identifier: "socket"});
// });

export const messageTypes = {
    workerEvaluation: "workerEvaluation",
    syzygyEvaluation: "syzygyEvaluation",
    noWorkerAvailable: "noWorkerAvailable",
    openingMoves: "openingMoves",
}


export class SocketReduxMiddleware {
    private signInToken: string;
    private socket: SocketIOClient.Socket;

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

        Object.keys(messageTypes)
            .forEach(type => this.socket.on(type, (payload) =>
                    store.dispatch({type, payload})
                )
            );
    }

    emit(type, payload) {
        this.socket.emit(type, payload)
    };
}

export const SocketReduxService = new SocketReduxMiddleware();