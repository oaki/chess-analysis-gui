import {SocketManagerService} from "../socketService";

export const EMIT_POSITION = "sockets/sendPosition";

export const IS_CONNECTED = "IS_CONNECTED";
export const IS_CONNECTING = "IS_CONNECTING";
export const NEW_FEN = "NEW_FEN";

export function emitPosition(fen: string) {
    SocketManagerService.setNewPosition(fen, true);
    return {
        type: NEW_FEN,
        payload: {
            fen
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