import * as React from "react";
import {SessionManagerService} from "../services/sessionManager";
import store from "../store";
import {setUser} from "../actions";
import {ApiManagerService} from "../services/apiManager";
import {SocketManagerService} from "../services/socketService";
import {ConnectionError} from "../libs/errors/connectionError";
import {setHistory} from "./history/historyReducers";
import {Log} from "../libs/logger";
import {onlineOfflineIndicatorService} from "../services/onlineOfflineIndicator";

export default class BootstrapData extends React.Component<any, any> {
    state = {
        isLoaded: false,
    }

    render() {
        return this.props.children;
    }

    initSockets(token: string) {

        Log.info("initSockets", token);
        Log.error("initSockets", token);
        SocketManagerService.setSignInToken(token);
        SocketManagerService.connect();
    }

    async loadApp() {

        onlineOfflineIndicatorService.init();

        const user: any = SessionManagerService.getUser();

        try {
            if (!user || user.token === "") {
                const res = await ApiManagerService.getSignUser(user);
                console.log("ApiManagerService.getSignUser(user);", res);
                user.token = res.token;
            }
        } catch (err) {
            if (err && err.statusCode === 403) {
                SessionManagerService.removeUser();
            }
            location.href = "/auth/sign-in";
            throw err;
        }


        try {

            if (!user.last_game_id) {
                const lastGame = await ApiManagerService.getLastGame(user.token);

                if (!lastGame) {
                    throw new ConnectionError("Can not load games");
                }

                user.last_game_id = lastGame.id;
                store.dispatch(setHistory(lastGame.moves));
            } else if (Object.keys(store.getState()["history"]).length === 0) {
                const game = await ApiManagerService.getGame(user.token, user.last_game_id);
                store.dispatch(setHistory(game.moves));
            }

            this.initSockets(user.token);

            SessionManagerService.setUser(user);
            store.dispatch(setUser(user));


        } catch (err) {
            console.log(err, err instanceof Error);
            let msg = "We can not load application but we are working on it.";
            if (err instanceof Error) {

                msg = err.message;
            }
            this.setState({
                errorMsg: msg
            })
        }


    }

    componentDidMount() {
        // check if you are logged in

        this.loadApp();
    }
}