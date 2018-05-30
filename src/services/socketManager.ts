import config from "../config";
import {setError, setEvaluation} from "../actions";

import * as io from "socket.io-client";
import {store} from "../store";
import {IWorkerResponse, LINE_MAP} from "../interfaces";

export default class SocketManager {
    private socket;
    private signInToken;

    constructor(private config: SocketIoConfig, private store) {
    }

    setSignInToken(token: string) {
        this.signInToken = token;
    }

    handleResult(result: { data: IWorkerResponse, fen: string }) {
        console.log('browser: on_result', result.data);


        // ignore others @todo disable others results
        if (this.store.getState()['fen'] === result.fen) {
            const data = this.prepareEvaluation(result.data);
            this.store.dispatch(setEvaluation(data));
        }
    }

    private prepareEvaluation(data: IWorkerResponse) {
        if (!data[LINE_MAP.pv]) {
            return data;
        }

        const newData = {...data};
        const arr = newData[LINE_MAP.pv].match(/.{1,4}/g);
        if (arr && arr.length) {
            newData[LINE_MAP.pv] = arr.join(' ');
        }

        return newData;
    }

    connect() {
        console.log('this.signInToken', this.signInToken);
        this.socket = io(this.config.socketIo.host, {
            path: config.socketIo.path,
            query: {
                token: this.signInToken,
                type: 'user'
            }
        });

        this.socket.on('connect', () => {
            console.log(`socket connected to ${this.config.socketIo.host}`);
            /**
             * Interface
             */
            this.socket.on('on_result', this.handleResult);
        });

        this.socket.on('disconnect', () => {
            store.dispatch(setError('Socket disconnect'));
            console.log(`socket disconnect`);
        });

        this.socket.on('connect_timeout', (timeout) => {
            store.dispatch(setError('Socket connection timeout'));
        });
    }

    emit(name: string, props: any) {
        if (this.socket) {
            this.socket.emit(name, props);
        }
    }


}


interface SocketIoConfig {
    socketIo: {
        host: string;
        path: string;
    }
}

export const SocketManagerService = new SocketManager(config, store);
