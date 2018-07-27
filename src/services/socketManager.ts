import * as io from "socket.io-client";
import {setError, setEvaluation} from "../actions";
import {ISyzygy, setSyzygyEvaluation} from "../components/syzygyExplorer";
import config from "../config";
import {IWorkerResponse, LINE_MAP} from "../interfaces";
import {store} from "../store";

const throttle = require("lodash/throttle");
const debounce = require("lodash/debounce");

export default class SocketManager {
    private socket;
    private signInToken;
    private dispatchResults;

    constructor(private config: SocketIoConfig, private store) {
        console.log("store", store);
        this.dispatchResults = throttle((results) => {
            this.store.dispatch(setEvaluation(results));
        }, 1000)
    }

    handleResult = (result: string) => {
        console.log("handleResult->", result);
        const arr = JSON.parse(result);
        // for now we are expecting only one result, no more


        // ignore others @todo disable others results
        const fen = this.store.getState()["fen"];
        const results = arr.filter((data) => data.fen === fen).map((data) => this.prepareEvaluation(data));
        if (results && results.length > 0) {
            this.dispatchResults(results);
        }
    }

    handleSyzygyResult = (result: ISyzygy) => {
        console.log("handleSyzygyResult", result);
        this.store.dispatch(setSyzygyEvaluation(result))
    }


    setSignInToken(token: string) {
        this.signInToken = token;
    }

    // handleOpeningMoves = (result: { data: IWorkerResponse, fen: string }) => {
    //     console.log('handleOpeningMoves->', result);
    //
    //     this.store.dispatch(setOpeningMoves(result.data));
    // }

    connect() {
        this.socket = io(this.config.socketIo.host, {
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

        this.socket.on("connect", () => {
            console.log(`socket connected to ${this.config.socketIo.host}`);
        });

        /**
         * Interface
         */
        this.socket.on("workerEvaluation", this.handleResult);
        this.socket.on("syzygyEvaluation", this.handleSyzygyResult);
        // this.socket.on('openingMoves', this.handleOpeningMoves);

        this.socket.on("disconnect", () => {
            store.dispatch(setError("Socket disconnect"));
            console.log(`socket disconnect`);
        });

        this.socket.on("connect_timeout", (timeout) => {
            store.dispatch(setError("Socket connection timeout"));
        });
    }

    emit(name: string, props: any) {
        if (this.socket) {
            this.socket.emit(name, props);
        }
    }

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


}


interface SocketIoConfig {
    socketIo: {
        host: string;
        path: string;
    }
}

export const SocketManagerService = new SocketManager(config, store);
