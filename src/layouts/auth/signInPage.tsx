import React, {CSSProperties, memo, useCallback, useEffect, useMemo, useState} from "react";
import {connect} from "../../libs/stateCompat";
import {IUser} from "../../reducers";
import {SessionManagerService} from "../../services/sessionManager";
import {Loading} from "../../components/Loading";
import {ApiManagerService} from "../../services/apiManager";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import {useFetch} from "../../components/hooks/useFetch";
import {authRegisterApi} from "../../tools/api";
import {Flash} from "../../services/errorManager";
import type { ReduxStateShape } from "../../reducers";


type ISignInPageProps = {
    user: IUser;
    location: unknown;
    history?: { push: (path: string) => void };
}

type SignInPageProps = Record<string, never>

type AuthDebugStage =
    | "idle"
    | "google_success"
    | "temporary_requested"
    | "temporary_stored"
    | "temporary_polling"
    | "temporary_paired"
    | "auth_completed"
    | "auth_error";

type SingInPageState = {
    isLoading: boolean;
    debugStage: AuthDebugStage;
    debugMessage: string;
};
export const SignInPage = memo((_props: SignInPageProps) => {
    const [state, setState] = useState<SingInPageState>({
        isLoading: false,
        debugStage: "idle",
        debugMessage: ""
    });

    const [authRegisterResponse, doAuthRegister] = useFetch<{ token: string }>();
    const isStandalonePwa = useMemo(() => {
        if (typeof window === "undefined") {
            return false;
        }
        const hasIosStandalone = typeof (window.navigator as Navigator & { standalone?: boolean }).standalone === "boolean"
            && !!(window.navigator as Navigator & { standalone?: boolean }).standalone;
        const displayModeStandalone = typeof window.matchMedia === "function" && window.matchMedia("(display-mode: standalone)").matches;
        return hasIosStandalone || displayModeStandalone;
    }, []);

    const onFailure = useCallback((_error: unknown) => {
        Flash.error({
            msg: "Try again.",
            identifier: "googleTokenFailed"
        });
        setState((prevState) => ({
            ...prevState,
            isLoading: false,
            debugStage: "auth_error",
            debugMessage: "Auth failed. Please retry sign in."
        }));
    }, []);

    const onSuccess = useCallback((response: CredentialResponse) => {
        console.log(response);
        if (typeof response.credential === "string") {
            setState((prevState) => ({
                ...prevState,
                isLoading: true,
                debugStage: "google_success",
                debugMessage: "Google credential received, authorizing..."
            }));
            const api = authRegisterApi(response.credential);
            doAuthRegister(api.url, api.requestInit);
        } else {
            onFailure(new Error("Missing Google credential"));
        }
    }, [doAuthRegister, onFailure]);

    const beginTemporaryGoogleFlow = useCallback(async () => {
        setState((prevState) => ({
            ...prevState,
            isLoading: true,
            debugStage: "temporary_requested",
            debugMessage: "Preparing secure temporary session..."
        }));
        try {
            const response = (await ApiManagerService.getTemporaryToken()) as { token?: string };
            if (!response?.token) {
                throw new Error("Temporary token was not returned");
            }
            SessionManagerService.setTemporaryToken(response.token);
            setState((prevState) => ({
                ...prevState,
                debugStage: "temporary_stored",
                debugMessage: "Temporary session created. Redirecting to Google..."
            }));
            const encodedState = encodeURIComponent(JSON.stringify({ token: response.token }));
            window.location.href = `/auth/google-popup?state=${encodedState}`;
        } catch (error) {
            onFailure(error);
        }
    }, [onFailure]);

    useEffect(() => {
        if (authRegisterResponse.response) {
            SessionManagerService.setToken(authRegisterResponse.response.token);
            setState((prevState) => ({
                ...prevState,
                debugStage: "auth_completed",
                debugMessage: "Authorization completed. Redirecting..."
            }));
            window.location.href = "/";
        }
    }, [authRegisterResponse.response]);

    useEffect(() => {
        if (authRegisterResponse.isError) {
            Flash.error({
                msg: "Try again.",
                identifier: "googleTokenFailed"
            });
            setState((prevState) => ({
                ...prevState,
                isLoading: false,
                debugStage: "auth_error",
                debugMessage: "Authorization endpoint failed."
            }));
        }
    }, [authRegisterResponse.isError]);

    useEffect(() => {
        const temporaryToken = SessionManagerService.getTemporaryToken();
        if (!temporaryToken) {
            return;
        }
        setState((prevState) => ({
            ...prevState,
            debugStage: "temporary_polling",
            debugMessage: "Waiting for Google confirmation..."
        }));

        const timer = window.setInterval(async () => {
            try {
                const checkResponse = (await ApiManagerService.checkTemporaryToken(temporaryToken)) as { google_token?: string };
                if (!checkResponse?.google_token) {
                    return;
                }
                setState((prevState) => ({
                    ...prevState,
                    debugStage: "temporary_paired",
                    debugMessage: "Google confirmed, finalizing app authorization..."
                }));
                const authResponse = (await ApiManagerService.getUserBasedOnGoogleToken(checkResponse.google_token)) as {
                    token?: string;
                };
                if (!authResponse?.token) {
                    return;
                }
                window.clearInterval(timer);
                SessionManagerService.removeTemporaryToken();
                SessionManagerService.setToken(authResponse.token);
                setState((prevState) => ({
                    ...prevState,
                    debugStage: "auth_completed",
                    debugMessage: "Authorization completed. Redirecting..."
                }));
                window.location.href = "/";
            } catch (_error) {
                // keep polling; this endpoint is expected to fail until Google callback is paired
            }
        }, 2000);

        return () => {
            window.clearInterval(timer);
        };
    }, []);

    if (state.isLoading) {
        return (
            <Loading isLoading={state.isLoading}/>
        )
    }

    const style: CSSProperties = {
        textAlign: "center",
        marginTop: "2rem"
    };

    return (
        <>
            <div className="alert alert-warn">
                <strong>Beta version!!!</strong>
            </div>
            <div className="page-log-in container" style={style}>
                <h2>
                    Sign in
                </h2>

                <p>
                    Welcome to the 2019 edition of Chess analysis. It's a strongest chess engine on mobile. Let'a
                    try if
                    you can WIN.
                    Featuring a faster and smoother user interface along with a stronger state of the art artificial
                    intelligence engine.
                </p>

                {state.debugMessage && (
                    <div className="alert alert-info mb-sm">
                        <strong>Auth status:</strong> {state.debugMessage}
                    </div>
                )}


                {isStandalonePwa ? (
                    <button className="sing-in-with-google" onClick={beginTemporaryGoogleFlow}>
                        <img
                            className="sing-in-with-google--image"
                            src="/img/btn_google_signin_light_normal_web@2x.png"
                            alt="Sign in with Google"
                        />
                    </button>
                ) : (
                    <GoogleLogin
                        onSuccess={onSuccess}
                        onError={() => onFailure(new Error("Google sign in failed"))}
                    />
                )}

            </div>
        </>
    );
});

type SignInPage1State = { isLoading: boolean };

class SignInPage1 extends React.Component<ISignInPageProps, SignInPage1State> {

    private timer: ReturnType<typeof setInterval> | undefined;

    constructor(props: ISignInPageProps) {
        super(props);
        this.state = {
            isLoading: true
        }

    }

    handleOpenPopup = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        this.setState({isLoading: true});

        const token = SessionManagerService.getTemporaryToken();
        window.open(`/auth/google-popup?state=${JSON.stringify({token})}`, "google-popup-window", "width=450,height=550");
    }

    private async checkTemporaryTokenOnServer() {
        try {
            const temporaryToken = SessionManagerService.getTemporaryToken();
            if (!temporaryToken) {
                return;
            }
            const res = (await ApiManagerService.checkTemporaryToken(temporaryToken)) as { google_token: string };
            console.log("google_token---------------", res.google_token);
            const resWithJwt = (await ApiManagerService.getUserBasedOnGoogleToken(res.google_token)) as {
                token: string;
            };
            if (this.timer !== undefined) {
                clearInterval(this.timer);
            }
            SessionManagerService.removeTemporaryToken();
            SessionManagerService.setToken(resWithJwt.token);
            window.location.href = "/";
        } catch (e) {
            console.log(e);
        }
    }

    render() {

        if (this.state.isLoading) {
            return (
                <Loading isLoading={this.state.isLoading}/>
            )
        }

        const style: CSSProperties = {
            textAlign: "center",
            marginTop: "2rem"
        };

        return (
            <>
                <div className="alert alert-warn">
                    <strong>Beta version!!!</strong>
                </div>
                <div className="page-log-in container" style={style}>
                    <h2>
                        Sign in
                    </h2>

                    <p>
                        Welcome to the 2019 edition of Chess analysis. It's a strongest chess engine on mobile. Let'a
                        try if
                        you can WIN.
                        Featuring a faster and smoother user interface along with a stronger state of the art artificial
                        intelligence engine.
                    </p>


                    <button className="sing-in-with-google" onClick={this.handleOpenPopup}>
                        <img
                            className="sing-in-with-google--image"
                            src="/img/btn_google_signin_light_normal_web@2x.png"
                            alt="Sign in with Google"
                        />
                    </button>
                </div>
            </>
        );
    }

    componentDidMount() {

        if (this.props.user.isLoggedIn) {
            this.props.history?.push("/");
        }

        this.setState({isLoading: false});

        // start checking each second if temporary token is valid on the server
        // if yes redirect to homepage
        if (SessionManagerService.getTemporaryToken()) {
            this.timer = setInterval(() => {
                this.checkTemporaryTokenOnServer();
            }, 2000);
        }
    }

    componentWillUnmount() {
        if (this.timer !== undefined) {
            clearInterval(this.timer);
        }
    }
}


function mapStateToProps(state: ReduxStateShape) {
    return {
        user: state.user
    }
}

export const SignInPageConnected = connect(mapStateToProps)(SignInPage);
