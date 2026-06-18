import React, { lazy, memo, Suspense } from "react";
import { store } from "./store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PrivateRoute } from "./libs/privateRoute";
import { GooglePopupRedirect } from "./layouts/auth/googlePopupRedirect";
import { ErrorController } from "./components/error/errorController";
import { SessionManagerService } from "./services/sessionManager";
import { Loading } from "./components/Loading";
import { Error } from "./components/error/error";
import styled from "@emotion/styled";
import { useSessionBootstrap } from "./hooks/useSessionBootstrap";
import { connectSocket } from "./services/sockets/actions";

type ChessAppProps = Record<string, never>;

type ChessAppState = {
  isLoaded: boolean;
  profileError: boolean;
  historyError: boolean;
};

const HistoryPage = lazy(() =>
  import("./layouts/historyPage").then((m) => ({ default: m.HistoryPage }))
);

const ChessboardPage = lazy(() =>
  import("./layouts/chessboardPage").then((m) => ({ default: m.ChessboardPage }))
);

const EnginesPageSmart = lazy(() =>
  import("./layouts/enginesPage").then((m) => ({ default: m.EnginesPage }))
);

const SettingPage = lazy(() =>
  import("./layouts/settingPage").then((m) => ({ default: m.SettingPage as React.ComponentType }))
);

const VerifyGoogleResponse = lazy(() =>
  import("./layouts/auth/verifyGoogleResponse").then((m) => ({ default: m.VerifyGoogleResponse }))
);

const SignInPage = lazy(() =>
  import("./layouts/auth/signInPage").then((m) => ({ default: m.SignInPageConnected }))
);

export const ChessApp = memo((_props: ChessAppProps) => {
    const token = SessionManagerService.getToken();
    const state: ChessAppState = useSessionBootstrap({
      token,
      dispatch: store.dispatch,
      connect: (sessionToken) => {
        store.dispatch(connectSocket(sessionToken));
      },
    });

    return (
            <BrowserRouter>
                {state.profileError && <Error msg={'Problem to load user profile'} identifier={'profileResponse'}/>}
                {state.historyError && <Error msg={'Problem to load user history'} identifier={'userHistory'}/>}

                <Loading isLoading={!state.isLoaded}/>

                {state.isLoaded && !state.profileError && !state.historyError &&
                <StyledApp>
                    <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                      <Route path="/" element={<PrivateRoute><ChessboardPage /></PrivateRoute>}/>
                      <Route path="/user/engines" element={<PrivateRoute><EnginesPageSmart /></PrivateRoute>}/>
                      <Route path="/user/history" element={<PrivateRoute><HistoryPage /></PrivateRoute>}/>
                      <Route path="/settings" element={<PrivateRoute><SettingPage /></PrivateRoute>}/>
                      <Route path="/auth/sign-in" element={<SignInPage/>}/>
                      <Route path="/auth/google-popup" element={<GooglePopupRedirect/>}/>
                      <Route path="/auth/verify-google-response" element={<VerifyGoogleResponse/>}/>
                    </Routes>
                    </Suspense>
                </StyledApp>}
            </BrowserRouter>
    )
});

const StyledApp = styled.div`
    height: 100%;
    width: 100%;
`
