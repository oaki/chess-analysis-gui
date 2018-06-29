import config from "../config";
import {setError, setEvaluation} from "../actions";

import * as io from "socket.io-client";
import {store} from "../store";
import {IWorkerResponse, LINE_MAP} from "../interfaces";

export default class SocketManager {
    private socket;
    private signInToken;

    constructor(private config: SocketIoConfig, private store) {
        console.log('store', store);
    }

    setSignInToken(token: string) {
        this.signInToken = token;
    }

    handleResult = (result: string) => {
        // console.log('handleResult->', result);
        const arr = JSON.parse(result);
        // for now we are expecting only one result, no more


        // ignore others @todo disable others results
        const fen = this.store.getState()['fen'];
        const results = arr.filter((data) => data.fen === fen).map((data) => this.prepareEvaluation(data));
        if (results && results.length > 0) {
            this.store.dispatch(setEvaluation(results));
        }
    }

    // handleOpeningMoves = (result: { data: IWorkerResponse, fen: string }) => {
    //     console.log('handleOpeningMoves->', result);
    //
    //     this.store.dispatch(setOpeningMoves(result.data));
    // }

    private prepareEvaluation(data: IWorkerResponse) {
        if (!data[LINE_MAP.pv]) {
            return data;
        }

        const newData = {...data};
        // const arr = newData[LINE_MAP.pv].match(/.{1,4}/g);
        // if (arr && arr.length) {
        //     newData[LINE_MAP.pv] = arr.join(' ');
        // }

        return newData;
    }

    connect() {
        console.log('this.signInToken', this.signInToken);
        this.socket = io(this.config.socketIo.host, {
            path: config.socketIo.path,
            query: {
                token: this.signInToken,
                type: 'user'
            },
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 99999
        });

        this.socket.on('connect', () => {
            console.log(`socket connected to ${this.config.socketIo.host}`);
        });

        /**
         * Interface
         */
        this.socket.on('workerEvaluation', this.handleResult);
        // this.socket.on('openingMoves', this.handleOpeningMoves);

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
