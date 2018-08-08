import {Flash} from "./errorManager";

class OnlineOfflineIndicator {
    init() {
        window.addEventListener("online", this.updateIndicator);
        window.addEventListener("offline", this.updateIndicator);
    }

    updateIndicator = () => {
        if (navigator.onLine) { // true|false
            Flash.info({msg: "You are online.", identifier: "offline", delay: 1});
        } else {
            Flash.error({msg: "There is no Internet connection.", identifier: "offline"});
        }
    }

}

export const onlineOfflineIndicatorService = new OnlineOfflineIndicator();
