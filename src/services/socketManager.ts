import io from "socket.io-client";
import {setEvaluation} from "../actions";
import {ISyzygy, setSyzygyEvaluation} from "../components/syzygyExplorer/syzygyExplorerReducers";
import config from "../config";
import {IEvaluation, IWorkerResponse, LINE_MAP} from "../interfaces";
import {Flash} from "./errorManager";
import {StockfishService} from "./stockfishService";
import {parseResult} from "../libs/parseStockfishResults";
import store from "../store";
import {socketConnect} from "./sockets/actions";
import {NODE_MAP, treeService} from "../components/moveTree/tree";

export default class SocketManager {
    private socket;
    private signInToken;
    private dispatchResults;
    private stockfishEngineInterface;
    private config: SocketIoConfig;

    constructor(config: SocketIoConfig) {
        this.config = config;
        this.initOfflineStockfish();
    }

    private initOfflineStockfish() {
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
        const fen = store.getState()["fen"];
        const results = arr.filter((data) => data.fen === fen).map((data) => this.prepareEvaluation(data));
        if (results && results.length > 0) {

            const refs = treeService.findReferencesByFen(fen);
            const move: any = refs[0];
            move[NODE_MAP.evaluation] = results;

            // find in history move and add this result to the move
            store.dispatch(setEvaluation(results));
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
            store.dispatch(socketConnect());
            Flash.info({msg: "Chess engine connected", identifier: "socket"});
        });

        /**
         * Interface
         */
        this.socket.on("workerEvaluation", this.handleResult);
        this.socket.on("syzygyEvaluation", this.handleSyzygyResult);
        this.socket.on("noWorkerAvailable", this.handleOfflineWorker);
        // this.socket.on('openingMoves', this.handleOpeningMoves);

        this.socket.on("disconnect", () => {
            store.dispatch(socketConnect(false));
            Flash.error({msg: "Cloud engine disconnect", identifier: "socket"});
        });

        this.socket.on("connect_timeout", (timeout) => {
            store.dispatch(socketConnect(false));
            Flash.error({msg: "Cloud engine connection timeout", identifier: "socket"});
        });
    }

    public setNewPosition(
        fen: string,
        move: string,
        checkIsOnline: boolean,
        previousEvaluation: IEvaluation | null,
        evaluation: IEvaluation | null
    ) {
        if (checkIsOnline) {
            console.log("setNewPosition", {previousEvaluation, fen, evaluation});

            //check if current evaluation is sufficient if yes use it and sent it to redux
            // otherwise sent it to server
            // debugger;
            if (evaluation) {
                const nodes: number = evaluation[LINE_MAP.nodes] || 0;
                const score: number = parseInt(evaluation[LINE_MAP.score]) || 0;
                const nodesConst = 50 * 1000 * 1000;
                if (nodes > nodesConst && score > 3.5 && evaluation[LINE_MAP.pv].length > 8) {
                    store.dispatch(setEvaluation([{
                        fen,
                        ...evaluation,
                        [LINE_MAP.nodes]: nodes - nodesConst
                    }]));
                }
            } else {
                this.emit("setNewPosition", {
                    move,
                    previousEvaluation,
                    FEN: fen
                });
            }

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


