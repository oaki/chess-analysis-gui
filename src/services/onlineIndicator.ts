import {IAction} from "../interfaces";
import store from "../store";

export default function onlineIndicator() {
    store.dispatch(setIsOnline(true));

    window.addEventListener("offline", () => {
        store.dispatch(setIsOnline(false))
    });

    window.addEventListener("online", () => {
        store.dispatch(setIsOnline(true))
    });
}

export interface IIsOnline {
    isOnline: boolean;
}

const IS_ONLINE = "services/onlineIndicator/is_online";

export function setIsOnline(isOnline: boolean) {
    return {
        payload: !!isOnline,
        type: IS_ONLINE
    };
}

export const isOnlineReducer = (isOnline: boolean = false, action: IAction<IIsOnline>) => {

    switch (action.type) {
        case IS_ONLINE:
            return !!action.payload;

        default:
            return isOnline;
    }
};
