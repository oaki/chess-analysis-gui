import * as React from "react";
import {Redirect, Route, RouteComponentProps, RouteProps} from "react-router-dom"
import {connect} from "react-redux";
import {IUser} from "../../reducers";
import {ApiManagerService} from "../../services/apiManager";
import store from "../../store";
import {setUser} from "../../actions";
import {setHistory} from "../../components/history/historyReducers";
import {SessionManagerService} from "../../services/sessionManager";
import {Log} from "../../libs/logger";

interface ISignInPageProps {
    user: IUser;
    location: any;
}

class SignInPage extends React.Component<ISignInPageProps, any> {

    handleOnSuccess = async (data: Partial<IUser>) => {
        const values: IUser = {
            isLoggedIn: true,
            email: data.email || "",
            name: data.name || "",
            img: data.img || "",
            token: data.token || "",
            last_game_id: 0,
        };

        const game = await ApiManagerService.getLastGame(values.token);
        values.last_game_id = game.id;

        SessionManagerService.setUser(values);
        store.dispatch(setUser(values));
        store.dispatch(setHistory(game.moves));

        if (this.props.user.isLoggedIn && this.props.user.token) {

            console.log("Redirect!!!");
            return location.href = "/";
        }
    }

    handleOpenPopup = () => {
        let popup: any = {};
        Log.info("handleOpenPopup");

        const messageListener = (e) => {
            Log.info("handleOpenPopup->messageListener", e.data);
            if (e.data && e.data.user_id) {
                this.handleOnSuccess(e.data);
                popup.close();
                window.removeEventListener("message", messageListener);
            }
        };

        window.addEventListener("message", messageListener);
        popup = window.open("/auth/google-popup", "google-popup-window", "width=450,height=450");
    }

    render() {

        const style = {
            textAlign: "center",
            marginTop: "2rem"
        };

        return (
            <div className="page-log-in container" style={style}>
                <h2>
                    Log in
                </h2>

                <p>
                    Welcome to the 2018 edition of Chess analysis. It's a strongest chess engine on mobile. Let'a try if
                    you can WIN.
                    Featuring a faster and smoother user interface along with a stronger state of the art artificial
                    intelligence engine.
                </p>

                <button type="button" className="btn" onClick={this.handleOpenPopup}>Google Sign In</button>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(SignInPage);