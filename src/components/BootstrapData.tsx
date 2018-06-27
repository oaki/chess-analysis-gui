import * as React from "react";
import {SessionManagerService} from "../services/sessionManager";
import {store} from "../store";
import {setHistory, setUser} from "../actions";
import {ApiManagerService} from "../services/apiManager";
import SocketManager, {SocketManagerService} from "../services/socketManager";
import config from "../config";
import {ConnectionError} from "../libs/errors/connectionError";

export default class BootstrapData extends React.Component<any, any> {
    state = {
        isLoaded: false,
        errorMsg: '',
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

        const user = SessionManagerService.getUser();
        let token = '';
        try {
            const res = await ApiManagerService.getSignUser(user);
            token = res.token;
        } catch (err) {
            if (err && err.statusCode === 403) {
                SessionManagerService.removeUser();
            }
            location.href = '/auth/sign-in';
            throw err;
        }


        try {

            const lastGame = await ApiManagerService.getLastGame(token);

            if (!lastGame) {
                throw new ConnectionError('Can not load games');
            }

            user.token = token;
            user.last_game_id = lastGame.id;

            this.initSockets(token);

            SessionManagerService.setUser(user);
            store.dispatch(setUser(user));
            store.dispatch(setHistory(JSON.parse(lastGame.moves)));

        } catch (err) {
            console.log(err, err instanceof Error);
            let msg = 'We can not load application but we are working on it.';
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