import { io, type Socket } from "socket.io-client";
import { setEvaluation } from "../actions";
import { ISyzygy, setSyzygyEvaluation } from "../components/syzygyExplorer/syzygyExplorerReducers";
import { config } from "../config";
import { IEvaluation, IWorkerResponse, LINE_MAP } from "../interfaces";
import { Flash } from "./errorManager";
import { store } from "../store";
import { socketConnect } from "./sockets/actions";
import { NODE_MAP, treeService, type Node } from "../components/moveTree/tree";
import {
  parseWorkerEvaluation,
  shouldUseLocalEvaluation,
  withReducedNodes,
} from "./evaluationPipeline";

type StockfishEngineInterface = {
  go: (fen: string) => void;
};

export class SocketManager {
  private socket: Socket | undefined;
  private signInToken: string | undefined;
  private dispatchResults: unknown;
  private stockfishEngineInterface: StockfishEngineInterface | undefined;
  private config: SocketIoConfig;

  constructor(config: SocketIoConfig) {
    this.config = config;
    // this.initOfflineStockfish();
  }

  // private initOfflineStockfish() {
  //     if (!StockfishService.isInit()) {
  //         StockfishService.init();
  //     }
  //
  //     this.stockfishEngineInterface = StockfishService;
  //     this.stockfishEngineInterface.onResult((data, fen) => {
  //
  //         const result = parseResult(data, fen);
  //
  //         if (result) {
  //             this.handleResult(JSON.stringify(result));
  //         }
  //     })
  // }

  handleResult = (result: string) => {
    const fen = store.getState()["fen"];
    const pipelineResult = parseWorkerEvaluation(result, fen);
    if (pipelineResult && pipelineResult.results.length > 0) {

      const refs = treeService.findReferencesByFen(fen) as Node[];
      const move = refs[0];
      if (!move) {
        return;
      }
      move[NODE_MAP.evaluation] = pipelineResult.results;

      // find in history move and add this result to the move
      store.dispatch(setEvaluation(pipelineResult.results));
    }
  };

  handleSyzygyResult = (result: ISyzygy) => {
    console.log("handleSyzygyResult", result);
    store.dispatch(setSyzygyEvaluation(result));
  };

  handleOfflineWorker = (fen: string) => {
    console.log("handleOfflineWorker", fen);
    this.stockfishEngineInterface?.go(fen);
    // store.dispatch(setSyzygyEvaluation(result))
  };


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
        token: this.signInToken ?? "",
        type: "user"
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 99999
    });

    this.socket.on("connect", () => {
      store.dispatch(socketConnect());
      Flash.info({ msg: "Chess engine connected", identifier: "socket" });
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
      Flash.error({ msg: "Cloud engine disconnect", identifier: "socket" });
    });

    this.socket.on("connect_timeout", (timeout) => {
      store.dispatch(socketConnect(false));
      Flash.error({ msg: "Cloud engine connection timeout", identifier: "socket" });
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
      console.log("setNewPosition", { previousEvaluation, fen, evaluation });

      //check if current evaluation is sufficient if yes use it and sent it to redux
      // otherwise sent it to server
      // debugger;
      if (shouldUseLocalEvaluation(evaluation)) {
        store.dispatch(setEvaluation([withReducedNodes(fen, evaluation as IEvaluation)]));
      } else {
        this.emit("setNewPosition", {
          move,
          previousEvaluation,
          FEN: fen
        });
      }

    } else {
      this.stockfishEngineInterface?.go(fen);
    }

  }

  private emit(name: string, props: Record<string, unknown>) {
    if (this.socket) {
      this.socket.emit(name, props);
    } else {
      console.error("Socket is not ready");
    }
  }

}

type SocketIoConfig = {
  socketIo: {
    host: string;
    path: string;
  };
};

