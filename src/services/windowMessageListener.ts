import {IUser} from "../reducers";
import {Log} from "../libs/logger";

class WindowMessageListener {

    private popup;

    constructor() {

    }

    init() {
        console.log('init->event->message');
        window.removeEventListener("message", this.messageListener);
        window.addEventListener("message", this.messageListener);
    }

    messageListener = (e) => {
        debugger;
        console.log('Treee',  e);
        Log.info("handleOpenPopup->messageListener", e.data);
        if (e.data && e.data.user_id) {
            this.handleOnSuccess(e.data);
            if (this.popup) {
                this.popup.close()
            }

            // window.removeEventListener("message", this.messageListener);
        }
    };

    handleOnSuccess = async (data: Partial<IUser>) => {
        // const values: IUser = {
        //     isLoggedIn: true,
        //     email: data.email || "",
        //     name: data.name || "",
        //     img: data.img || "",
        //     last_game_id: 0,
        // };
        //
        // const game = await ApiManagerService.getLastGame(values.token);
        // values.last_game_id = game.id;
        //
        // SessionManagerService.setUser(values);
        // store.dispatch(setUser(values));
        // store.dispatch(setHistory(game.moves));
        //
        // if (values.isLoggedIn && values.token) {
        //     Log.info("handleOnSuccess->redirect", values);
        //     return location.href = "/";
        // }
    }
}

export const windowMessageListenerService = new WindowMessageListener();