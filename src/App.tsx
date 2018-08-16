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

export class App extends React.Component<{}, {}> {

    render() {
        return (

            <Provider store={store}>
                <BrowserRouter>
                    <div className="app">
                        <PrivateRoute exact={true} path="/" component={ChessboardPage}/>
                        <PrivateRoute path="/user/engines" component={EnginesPageSmart}/>
                        <PrivateRoute path="/user/history" component={HistoryPage}/>
                        <PrivateRoute path="/settings" component={SettingPage}/>

                        <Route path="/auth/sign-in" component={SignInPage}/>
                        <Route path="/auth/google-popup" component={GooglePopupRedirect}/>
                        <Route path="/auth/verify-google-response" component={VerifyGoogleResponse}/>

                        <ErrorContainer/>
                    </div>
                </BrowserRouter>
            </Provider>

        )
    }
}


export default App;
