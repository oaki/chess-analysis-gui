import SocketManager from "./socketManager";
import config from "../config";
import {IAction} from "../interfaces";
import {EMIT_POSITION, IS_CONNECTED, IS_CONNECTING} from "./sockets/actions";

export const SocketManagerService = new SocketManager(config);

const defaults = {};

interface ISocket {
    isConnected: boolean;
    isConnecting: boolean;
}

export function socketReducer(state = defaults, action: IAction<ISocket>) {
    switch (action.type) {
        case IS_CONNECTING:
            return {...state, isConnecting: action.payload.isConnecting};

        case IS_CONNECTED:
            return {...state, isConnected: action.payload.isConnected};

        case EMIT_POSITION:
            return {...state, isConnected: action.payload.isConnected};


        default:
            return state;
    }
}