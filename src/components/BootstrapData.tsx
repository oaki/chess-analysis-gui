import * as React from "react";
import {SessionManagerService} from "../services/sessionManager";
import {store} from "../store";
import {setHistory, setUser} from "../actions";
import {ApiManagerService} from "../services/apiManager";
import {SocketManagerService} from "../services/socketManager";
import {ConnectionError} from "../libs/errors/connectionError";

export default class BootstrapData extends React.Component<any, any> {
    state = {
        isLoaded: false,
        errorMsg: "",
        progressBarWidth: 10
    }

    renderAlert() {
        return (
            <div className="alert alert-warning" role="alert" key="alert">
                <strong>Error!</strong> {this.state.errorMsg}
            </div>
        )
    }

    renderProgress() {
        return (
            <div className="c-progress-bar" key="progress">
                <div className="progress-bar" style={{width: `${this.state.progressBarWidth}%`}}/>
            </div>
        )
    }

    render() {
        const components: any = [];

        if (this.state.errorMsg) {
            components.push(
                this.renderAlert()
            )
        }

        components.push(
            this.renderProgress()
        )

        components.push(this.props.children);

        return components;
    }

    initSockets(token: string) {
        SocketManagerService.setSignInToken(token);
        SocketManagerService.connect();
    }

    async loadApp() {

        const user: any = SessionManagerService.getUser();

        console.log("SessionManagerService.getUser()", user);

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
                store.dispatch(setHistory(JSON.parse(lastGame.moves)));
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

        this.setState({
            progressBarWidth: this.state.progressBarWidth + 30
        })
    }
}