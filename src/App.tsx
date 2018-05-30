// import * as React from 'react';
import {Provider} from 'react-redux';
// import {Pannel} from "./Pannel";
import {store} from "./store";
// import {SmartChessboard} from './Chessboard';
// import {GoogleLogin} from 'react-google-login';
// import {Router, Route, Switch} from 'react-router'
// import {BrowserRouter} from 'react-router-dom'
//
// import * as $ from 'jquery';
// import {connect} from 'react-redux';
//
// const win: any = window;
// win.$ = $;


import {SocketIoProvider} from "./SocketIoProvider";
import * as faRetweet from "@fortawesome/fontawesome-free-solid/faRetweet";
import * as faAngleDoubleLeft from "@fortawesome/fontawesome-free-solid/faAngleDoubleLeft";
import * as faAngleDoubleRight from "@fortawesome/fontawesome-free-solid/faAngleDoubleRight";
import {Menu} from "./components/Menu";
import {History} from "./components/History";
import {AwesomeChessboard, SmartAwesomeChessboard} from "./components/AwesomeChessboard";
import SignInPage from "./layouts/signInPage";
import {ChessboardPage} from "./layouts/chessboard";
// import {PrivateRoute} from "./libs/privateRoute";
//
// const Public = () => <h3>Public</h3>;
// const Protected = () => <h3>Protected</h3>;


// class App extends React.Component<any, any> {
//
//     render() {
//
//         return (
//             <Provider store={store}>
//                 <BrowserRouter>
//                     <div className="app">
//
//
//
//                         <Route path="/public" component={Public} />
//
//                         <PrivateRoute path="/" component={ChessboardPage}/>
//
//                         <Route path="/auth/sign-in" component={SignInPage}/>
//
//                     </div>
//                 </BrowserRouter>
//             </Provider>
//         );
//     }
// }


import * as React from "react";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from "react-router-dom";
import {PrivateRoute} from "./libs/privateRoute";
import {HomePage} from "./layouts/homePage";


export class App extends React.Component<any, any> {

    render() {
        return (

            <Provider store={store}>
                <Router>
                    <div className="app">
                        <PrivateRoute path="/play" component={ChessboardPage}/>
                        <Route path="/auth/sign-in" component={SignInPage}/>
                        <Route exact={true} path="/" component={HomePage}/>
                    </div>
                </Router>
            </Provider>

        )
    }
}


export default App;
