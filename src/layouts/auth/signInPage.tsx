import * as React from "react";
import {CSSProperties} from "react";
import {connect} from "react-redux";
import {IUser} from "../../reducers";
import {SessionManagerService} from "../../services/sessionManager";
import {Loading} from "../../components/Loading";
import {ApiManagerService} from "../../services/apiManager";

interface ISignInPageProps {
    user: IUser;
    location: any;
}

class SignInPage extends React.Component<ISignInPageProps, any> {

    private timer;

    constructor(props: ISignInPageProps) {
        super(props);
        this.state = {
            isLoading: true
        }

    }

    handleOpenPopup = (e) => {
        e.preventDefault();
        this.setState({isLoading: true});

        const token = SessionManagerService.getTemporaryToken();
        window.open(`/auth/google-popup?state=${JSON.stringify({token})}`, "google-popup-window", "width=450,height=550");
    }

    private async checkTemporaryTokenOnServer() {
        try {
            const res = await ApiManagerService.checkTemporaryToken(SessionManagerService.getTemporaryToken());
            console.log("google_token---------------", res.google_token);
            const resWithJwt = await ApiManagerService.getUserBasedOnGoogleToken(res.google_token);
            clearInterval(this.timer);
            SessionManagerService.removeTemporaryToken();
            SessionManagerService.setToken(resWithJwt.token);
            // location.href = "/";
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
            <div className="page-log-in container" style={style}>
                <h2>
                    Sign in
                </h2>

                <p>
                    Welcome to the 2018 edition of Chess analysis. It's a strongest chess engine on mobile. Let'a try if
                    you can WIN.
                    Featuring a faster and smoother user interface along with a stronger state of the art artificial
                    intelligence engine.
                </p>


                <a href="#" className="sing-in-with-google" onClick={this.handleOpenPopup}>
                    <img
                        className="sing-in-with-google--image"
                        src="/img/btn_google_signin_light_normal_web@2x.png"
                        alt="Sign in with Google"
                    />
                </a>
            </div>
        );
    }

    componentDidMount() {

        if (this.props.user.isLoggedIn) {
            (this.props as any).history.push("/");
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
        clearInterval(this.timer);
    }
}


function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(SignInPage);