import * as React from "react";
import {Provider} from "react-redux";
import store from "./store";
import SignInPage from "./layouts/auth/signInPage";
import {ChessboardPage} from "./layouts/chessboardPage";
import {BrowserRouter, Link, Redirect, Route, withRouter} from "react-router-dom";
import {PrivateRoute} from "./libs/privateRoute";
import {EnginesPageSmart} from "./layouts/enginesPage";
import {HistoryPage} from "./layouts/historyPage";
import GooglePopupRedirect from "./layouts/auth/googlePopupRedirect";
import {VerifyGoogleResponse} from "./layouts/auth/verifyGoogleResponse";
import {ErrorContainer} from "./components/error/errorContainer";
import {SettingPage} from "./layouts/settingPage";
import {SessionManagerService} from "./services/sessionManager";
import {setUser} from "./actions";
import {ApiManagerService} from "./services/apiManager";
import {IUser} from "./reducers";
import {Flash} from "./services/errorManager";
import {SocketManagerService} from "./services/socketService";
import {setHistory} from "./components/history/historyReducers";
import {Loading} from "./components/Loading";
import {StockfishService} from "./services/stocfishService";
import {onlineIndicatorService} from "./services/onlineIndicator";


export class App extends React.Component<{}, {}> {

    state = {
        isLoading: true
    }


    render() {

        return (
            <Provider store={store}>
                <BrowserRouter>
                    <div>
                        <Loading isLoading={this.state.isLoading}/>

                        {!this.state.isLoading &&
                        <div className="app">
                            <PrivateRoute exact={true} path="/" component={ChessboardPage}/>
                            <PrivateRoute path="/user/engines" component={EnginesPageSmart}/>
                            <PrivateRoute path="/user/history" component={HistoryPage}/>
                            <PrivateRoute path="/settings" component={SettingPage}/>
                            <Route path="/auth/sign-in" component={SignInPage}/>
                            <Route path="/auth/google-popup" component={GooglePopupRedirect}/>
                            <Route path="/auth/verify-google-response" component={VerifyGoogleResponse}/>

                            <ErrorContainer/>
                        </div>}
                    </div>
                </BrowserRouter>
            </Provider>
        )
    }

    prepareTemporaryToken() {
        const res = ApiManagerService.getTemporaryToken();
        res.then((body: any) => {
            SessionManagerService.setTemporaryToken(body.token);
            this.setState({isLoading: false});
        }).catch(() => {
            Flash.error({msg: "Something is wrong. Try again later.", identifier: "problemWithToken"});
        })
    }

    componentDidMount() {
        const token = SessionManagerService.getToken();

        onlineIndicatorService.init();

        try {
            if (token) {
                ApiManagerService.getProfile(token).then((res) => {
                    console.log({res});

                    ApiManagerService.getLastGame(token).then((game) => {
                        store.dispatch(setHistory(game.moves));
                        const user: IUser = res;
                        user.isLoggedIn = true;
                        user.lastGameId = game.id;
                        store.dispatch(setUser(user));
                        this.setState({isLoading: false});
                        SocketManagerService.setSignInToken(token);
                        SocketManagerService.connect();
                        // StockfishService.init();
                    });

                }).catch(() => {
                    SessionManagerService.removeToken();
                    SessionManagerService.removeTemporaryToken();
                    throw new Error("Token is not valid");
                })
            } else {

                const temporaryToken: string = SessionManagerService.getTemporaryToken();
                const pathname: string = window.location.pathname;
                const isVerifyPages = pathname === "/auth/verify-google-response" || pathname === "/auth/google-popup";

                if (isVerifyPages && !temporaryToken) {
                    Flash.error({
                        msg: "Token is missing. Close the window and try again.",
                        identifier: "problemWithToken"
                    });
                    this.setState({isLoading: false});
                    return;
                }

                if (!isVerifyPages) {
                    //check if exist temporary token if yes try to load data base on temp token

                    if (temporaryToken) {
                        ApiManagerService.checkTemporaryToken(temporaryToken).then((res) => {
                            SessionManagerService.setToken(res.token);
                            this.setState({isLoading: false});
                        }).catch((error) => {
                            SessionManagerService.removeTemporaryToken();
                            this.prepareTemporaryToken();
                        });
                    } else {
                        throw new Error("Temporary token does not exist");
                    }
                } else {
                    this.setState({isLoading: false});
                }
            }
        } catch (e) {
            this.prepareTemporaryToken();
        }


    }

    private g() {
        const isIos = () => {
            const userAgent = window.navigator.userAgent.toLowerCase();
            return /iphone|ipad|ipod/.test(userAgent);
        }
        // Detects if device is in standalone mode
        const isInStandaloneMode = () => ("standalone" in window.navigator) && ((window.navigator as any).standalone);

        // Checks if should display install popup notification:
        if (isIos() && !isInStandaloneMode()) {
            this.setState({showInstallMessage: true});
        }
    }
}


export default App;
