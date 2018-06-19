import * as React from "react";
import {Provider} from 'react-redux';
import {store} from "./store";
import SignInPage from "./layouts/signInPage";
import {ChessboardPage} from "./layouts/chessboard";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from "react-router-dom";
import {PrivateRoute} from "./libs/privateRoute";
import {HomePage} from "./layouts/homePage";
import {EnginesPageSmart} from "./layouts/enginesPage";

export class App extends React.Component<{}, {}> {

    render() {
        return (

            <Provider store={store}>
                <Router>
                    <div className="app">
                        <PrivateRoute path="/play" component={ChessboardPage}/>
                        <PrivateRoute path="/user/engines" component={EnginesPageSmart}/>

                        <Route path="/auth/sign-in" component={SignInPage}/>
                        <Route exact={true} path="/" component={HomePage}/>
                    </div>
                </Router>
            </Provider>

        )
    }
}


export default App;
