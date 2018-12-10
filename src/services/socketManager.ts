import * as io from "socket.io-client";
import {setEvaluation} from "../actions";
import {ISyzygy, setSyzygyEvaluation} from "../components/syzygyExplorer/syzygyExplorerReducers";
import config from "../config";
import {IWorkerResponse, LINE_MAP} from "../interfaces";
import {Flash} from "./errorManager";
import {StockfishService} from "./stocfishService";
import {parseResult} from "../libs/parseStockfishResults";
import store from "../store";

const throttle = require("lodash/throttle");

export default class SocketManager {
    private socket;
    private signInToken;
    private dispatchResults;
    private stockfishEngineInterface;

    constructor(private config: SocketIoConfig) {

        this.dispatchResults = throttle((results) => {
            store.dispatch(setEvaluation(results));
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
        console.log({arr});
        // ignore others @todo disable others results
        const fen = store.getState()["fen"];
        const results = arr.filter((data) => data.fen === fen).map((data) => this.prepareEvaluation(data));
        if (results && results.length > 0) {
            this.dispatchResults(results);
        }
    }

    handleSyzygyResult = (result: ISyzygy) => {
        console.log("handleSyzygyResult", result);
        store.dispatch(setSyzygyEvaluation(result))
    }

    handleOfflineWorker = (fen: string) => {
        console.log("handleOfflineWorker", fen);
        this.stockfishEngineInterface.go(fen);
        // store.dispatch(setSyzygyEvaluation(result))
    }


    setSignInToken(token: string) {
        this.signInToken = token;
    }

    // handleOpeningMoves = (result: { data: IWorkerResponse, fen: string }) => {
    //     console.log('handleOpeningMoves->', result);
    //
    //     store.dispatch(setOpeningMoves(result.data));
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
            Flash.error({msg: "Cloud engine disconnect", identifier: "socket"});
        });

        this.socket.on("connect_timeout", (timeout) => {
            Flash.error({msg: "Cloud engine connection timeout", identifier: "socket"});
        });
    }

    public setNewPosition(fen: string, isOnline: boolean) {
        if (isOnline) {
            this.emit("setNewPosition", {
                FEN: fen
            })
        } else {
            this.stockfishEngineInterface.go(fen);
        }

    }

    private emit(name: string, props: any) {
        if (this.socket) {
            this.socket.emit(name, props);
        } else {
            console.error("Socket is not ready");
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


