import {Flash} from "./errorManager";
import {IAction} from "../interfaces";
import store from "../store";

class OnlineIndicator {
    init() {
        store.dispatch(setIsOnline(!!navigator.onLine));
        window.addEventListener("onLine", this.updateIndicator);
    }

    updateIndicator = () => {
        store.dispatch(setIsOnline(!!navigator.onLine));

        if (navigator.onLine) { // true|false

            Flash.info({msg: "You are online.", identifier: "offline", delay: 1});
        } else {
            Flash.error({msg: "There is no Internet connection.", identifier: "offline"});
        }
    }

}


export interface IIsOnline {
    isOnline: boolean;
}

const IS_ONLINE = "services/onlineIndicator/is_online";

export function setIsOnline(isOnline: boolean) {
    console.log("setIsOnline", isOnline);
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


export const onlineIndicatorService = new OnlineIndicator();
