import {SocketManagerService} from "../socketService";
import {IEvaluation} from "../../interfaces";

export const EMIT_POSITION = "sockets/sendPosition";

export const IS_CONNECTED = "IS_CONNECTED";
export const IS_CONNECTING = "IS_CONNECTING";
export const NEW_FEN = "NEW_FEN";

export function emitPosition(
    fen: string,
    move: string,
    previousEvaluation: IEvaluation | null,
    evaluation: IEvaluation | null = null
) {
    SocketManagerService.setNewPosition(fen, move, true, previousEvaluation, evaluation);
    return {
        type: NEW_FEN,
        payload: {
            fen,
            move,
            previousEvaluation,
            evaluation
        }
    }
}

export function socketConnect(isConnected: boolean = true) {
    return {
        type: IS_CONNECTED,
        payload: {
            isConnected
        }
    }
}


export function connectSocket(token: string) {
    SocketManagerService.setSignInToken(token);
    SocketManagerService.connect();
    return {
        type: IS_CONNECTING,
        payload: {
            isConnecting: true,
        }
    }
}