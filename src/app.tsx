import React, {memo, useEffect, useState} from "react";
import {Provider} from "react-redux";
import store from "./store";
import SignInPage from "./layouts/auth/signInPage";
import {ChessboardPage} from "./layouts/chessboardPage";
import {BrowserRouter, Route} from "react-router-dom";
import {PrivateRoute} from "./libs/privateRoute";
import {EnginesPageSmart} from "./layouts/enginesPage";
import {HistoryPage} from "./layouts/historyPage";
import GooglePopupRedirect from "./layouts/auth/googlePopupRedirect";
import {VerifyGoogleResponse} from "./layouts/auth/verifyGoogleResponse";
import {ErrorController} from "./components/error/errorController";
import {SettingPage} from "./layouts/settingPage";
import {SessionManagerService} from "./services/sessionManager";
import {setUser} from "./actions";
import {IUser} from "./reducers";
import {setHistory} from "./components/history/historyReducers";
import {Loading} from "./components/Loading";
import {connectSocket} from "./services/sockets/actions";
import {useFetch} from "./components/hooks/useFetch";
import {userHistoryApi, userProfileApi} from "./tools/api";
import {Nullable} from "./interfaces";
import {Error} from "./components/error/error";
import styled from "@emotion/styled";
//
// export class App extends React.Component<{}, {}> {
//
//     state = {
//         isLoading: true
//     }
//
//
//     render() {
//
//         return (
//             <Provider store={store}>
//                 <BrowserRouter>
//                     <>
//                         <Loading isLoading={this.state.isLoading}/>
//
//                         {!this.state.isLoading &&
//                         <div className="app">
//                           <PrivateRoute exact={true} path="/" component={ChessboardPage}/>
//                           <PrivateRoute path="/user/engines" component={EnginesPageSmart}/>
//                           <PrivateRoute path="/user/history" component={HistoryPage}/>
//                           <PrivateRoute path="/settings" component={SettingPage}/>
//                           <Route path="/auth/sign-in" component={SignInPage}/>
//                           <Route path="/auth/google-popup" component={GooglePopupRedirect}/>
//                           <Route path="/auth/verify-google-response" component={VerifyGoogleResponse}/>
//
//                           <ErrorContainer/>
//                         </div>}
//                     </>
//                 </BrowserRouter>
//             </Provider>
//         )
//     }
//
//     prepareTemporaryToken() {
//         const res = ApiManagerService.getTemporaryToken();
//         res.then((body: any) => {
//             SessionManagerService.setTemporaryToken(body.token);
//             this.setState({isLoading: false});
//         }).catch(() => {
//             Flash.error({msg: "Something is wrong. Try again later.", identifier: "problemWithToken"});
//         })
//     }
//
//     componentDidMount() {
//         const token = SessionManagerService.getToken();
//
//         try {
//             if (token) {
//                 ApiManagerService.getProfile(token).then((res) => {
//                     console.log({res});
//
//                     ApiManagerService.getLastGame(token).then((game) => {
//                         console.log("ApiManagerService.getLastGam", game);
//                         store.dispatch(setHistory(game.moves));
//                         const user: IUser = res;
//                         user.isLoggedIn = true;
//                         user.lastGameId = game.id;
//                         store.dispatch(setUser(user));
//                         this.setState({isLoading: false});
//
//                         store.dispatch(setUser(user));
//                         store.dispatch(connectSocket(token));
//
//                         // SocketManagerService.setSignInToken(token);
//                         // SocketManagerService.connect();
//                         // StockfishService.init();
//                     });
//
//                 }).catch(() => {
//                     SessionManagerService.removeToken();
//                     SessionManagerService.removeTemporaryToken();
//                     throw new Error("Token is not valid");
//                 })
//             } else {
//
//                 const temporaryToken = SessionManagerService.getTemporaryToken();
//                 const pathname: string = window.location.pathname;
//                 const isVerifyPages = pathname === "/auth/verify-google-response" || pathname === "/auth/google-popup";
//
//                 if (isVerifyPages && !temporaryToken) {
//                     Flash.error({
//                         msg: "Token is missing. Close the window and try again.",
//                         identifier: "problemWithToken"
//                     });
//                     this.setState({isLoading: false});
//                     return;
//                 }
//
//                 if (!isVerifyPages) {
//                     //check if exist temporary token if yes try to load data base on temp token
//
//                     if (temporaryToken) {
//                         ApiManagerService.checkTemporaryToken(temporaryToken).then((res) => {
//                             console.log("RES1---------------------", res);
//                             if (res.google_token) {
//                                 ApiManagerService.getUserBasedOnGoogleToken(res.google_token).then((res2) => {
//                                     console.log("RES2---------------------", res2);
//                                     SessionManagerService.setToken(res2.token);
//                                     this.setState({isLoading: false});
//                                 });
//                             } else {
//                                 throw Error("Google token is missing.");
//                             }
//
//                         }).catch((error) => {
//                             SessionManagerService.removeTemporaryToken();
//                             this.prepareTemporaryToken();
//                         });
//                     } else {
//                         throw new Error("Temporary token does not exist");
//                     }
//                 } else {
//                     this.setState({isLoading: false});
//                 }
//             }
//         } catch (e) {
//             this.prepareTemporaryToken();
//         }
//
//
//     }
//
//     private g() {
//         const isIos = () => {
//             const userAgent = window.navigator.userAgent.toLowerCase();
//             return /iphone|ipad|ipod/.test(userAgent);
//         }
//         // Detects if device is in standalone mode
//         const isInStandaloneMode = () => ("standalone" in window.navigator) && ((window.navigator as any).standalone);
//
//         // Checks if should display install popup notification:
//         if (isIos() && !isInStandaloneMode()) {
//             this.setState({showInstallMessage: true});
//         }
//     }
// }


export const ChessApp = memo((props: ChessAppProps) => {
    const [state, setState] = useState<ChessAppState>({
        isLoaded: false,
        user: null
    });

    const token = SessionManagerService.getToken();
    const [profileResponse, doFetchProfile] = useFetch<IUser>();
    const [{response, isError}, doFetchUserHistory] = useFetch<any>();

    useEffect(() => {
        if (token && !profileResponse.response) {
            const api = userProfileApi(token);
            doFetchProfile(api.url, api.requestInit);
        }
    }, [doFetchProfile, token]);

    useEffect(() => {
        if (profileResponse.response) {
            setState((prevState) => ({...prevState, user: profileResponse.response}));
        }
    }, [profileResponse.response]);

    useEffect(() => {
        if (token && state.user && !response) {
            const api = userHistoryApi(token);
            doFetchUserHistory(api.url, api.requestInit);
        }
    }, [doFetchUserHistory, token, state.user]);

    useEffect(() => {
        if (response && token && !state.isLoaded) {
            const game = response;
            store.dispatch(setHistory(game.moves));
            const userExtended = {
                ...state.user,
                isLoggedIn: true,
                lastGameId: game.id
            };

            store.dispatch(setUser(userExtended));
            store.dispatch(connectSocket(token));
            setState((prevState) => ({...prevState, isLoaded: true}));
        }
    }, [response]);

    useEffect(()=>{
        if(!token){
            setState((prevState) => ({...prevState, isLoaded: true}));
        }
    }, [token]);

    console.log('state.isLoaded', state.isLoaded);
    return (
        <Provider store={store}>
            <BrowserRouter>
                {profileResponse.isError && <Error msg={'Problem to load user profile'} identifier={'profileResponse'}/>}
                {isError && <Error msg={'Problem to load user history'} identifier={'userHistory'}/>}

                <Loading isLoading={!state.isLoaded}/>

                {state.isLoaded && !profileResponse.isError && !isError &&
                <StyledApp>
                  <PrivateRoute exact={true} path="/" component={ChessboardPage}/>
                  <PrivateRoute path="/user/engines" component={EnginesPageSmart}/>
                  <PrivateRoute path="/user/history" component={HistoryPage}/>
                  <PrivateRoute path="/settings" component={SettingPage}/>
                  <Route path="/auth/sign-in" component={SignInPage}/>
                  <Route path="/auth/google-popup" component={GooglePopupRedirect}/>
                  <Route path="/auth/verify-google-response" component={VerifyGoogleResponse}/>

                  <ErrorController/>
                </StyledApp>}
            </BrowserRouter>
        </Provider>
    )
});

const StyledApp = styled.div`
    height: 100%;
    width: 100%;
`

interface ChessAppProps {

}

interface ChessAppState {
    isLoaded: boolean;
    user: Nullable<IUser>;
}

