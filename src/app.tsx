import React, { lazy, memo, Suspense, useEffect, useState } from "react";
import {Provider} from "react-redux";
import store from "./store";
import SignInPage from "./layouts/auth/signInPage";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import {PrivateRoute} from "./libs/privateRoute";
import GooglePopupRedirect from "./layouts/auth/googlePopupRedirect";
import {ErrorController} from "./components/error/errorController";
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

const HistoryPage = (
  lazy(() => import("./layouts/historyPage"))
);

const ChessboardPage = (
  lazy(() => import("./layouts/chessboardPage"))
);

const EnginesPageSmart = (
  lazy(() => import("./layouts/enginesPage"))
);

const SettingPage = (
  lazy(() => import("./layouts/settingPage"))
);

const VerifyGoogleResponse = (
  lazy(() => import("./layouts/auth/verifyGoogleResponse"))
);

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
                    <Suspense fallback={<div>Loading...</div>}>
                    <Switch>
                      <PrivateRoute exact={true} path="/" component={ChessboardPage}/>
                      <PrivateRoute path="/user/engines" component={EnginesPageSmart}/>
                      <PrivateRoute path="/user/history" component={HistoryPage}/>
                      <PrivateRoute path="/settings" component={SettingPage}/>
                      <Route path="/auth/sign-in" component={SignInPage}/>
                      <Route path="/auth/google-popup" component={GooglePopupRedirect}/>
                      <Route path="/auth/verify-google-response" component={VerifyGoogleResponse}/>
                    </Switch>
                    </Suspense>
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

