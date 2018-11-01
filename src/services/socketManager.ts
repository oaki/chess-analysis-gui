import * as io from "socket.io-client";
import {setEvaluation} from "../actions";
import {ISyzygy, setSyzygyEvaluation} from "../components/syzygyExplorer/syzygyExplorerReducers";
import config from "../config";
import {IWorkerResponse, LINE_MAP} from "../interfaces";
import {Flash} from "./errorManager";
import {StockfishService} from "./stocfishService";
import {parseResult} from "../libs/parseStockfishResults";

const throttle = require("lodash/throttle");

export default class SocketManager {
    private socket;
    private store;
    private signInToken;
    private dispatchResults;
    private stockfishEngineInterface;

    constructor(private config: SocketIoConfig, store) {
        this.store = store;

        this.dispatchResults = throttle((results) => {
            this.store.dispatch(setEvaluation(results));
        }, 1000);

        if (!StockfishService.isInit()) {
            StockfishService.init();
        }

        this.stockfishEngineInterface = StockfishService;

        this.stockfishEngineInterface.onResult((data, fen) => {

            const result = parseResult(data, fen);

            if (result) {
                this.handleResult(JSON.stringify(result));
            }

        })

    }

    handleResult = (result: string) => {

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

    handleOfflineWorker = (fen: string) => {
        console.log("handleOfflineWorker", fen);
        this.stockfishEngineInterface.go(fen);
        // this.store.dispatch(setSyzygyEvaluation(result))
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

            Flash.info({msg: "Chess engine connected", identifier: "socket"});
            console.log(`socket connected to ${this.config.socketIo.host}`);
        });

        /**
         * Interface
         */
        this.socket.on("workerEvaluation", this.handleResult);
        this.socket.on("syzygyEvaluation", this.handleSyzygyResult);
        this.socket.on("noWorkerAvailable", this.handleOfflineWorker);
        // this.socket.on('openingMoves', this.handleOpeningMoves);

        this.socket.on("disconnect", () => {
            Flash.error({msg: "Chess engine disconnect", identifier: "socket"});
        });

        this.socket.on("connect_timeout", (timeout) => {
            Flash.error({msg: "Chess engine connection timeout", identifier: "socket"});
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

        return {...data};
    }

}


interface SocketIoConfig {
    socketIo: {
        host: string;
        path: string;
    }
}


