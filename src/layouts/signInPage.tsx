import * as React from "react";
import GoogleLogin from "react-google-login";
import config from "./../config/";
import {Redirect, Route, RouteComponentProps, RouteProps} from "react-router-dom"
import {setHistory, setUser} from "../actions";
import {connect} from 'react-redux';
import {IUser} from "../reducers";
import {SessionManagerService} from "../services/sessionManager";
import {store} from "./../store";
import {ApiManagerService} from "../services/apiManager";


interface ISignInPageProps {
    user: IUser;
    location: any;
}

class SignInPage extends React.Component<ISignInPageProps, any> {
    state = {
        redirectToReferrer: false
    };


    handleOnSuccess = async (res) => {
        const values: IUser = {
            isLoggedIn: true,
            email: res.profileObj.email,
            name: res.profileObj.name,
            img: res.profileObj.imageUrl,
            googleToken: res.tokenId,
            token: '',
            last_game_id: 0,
        };

        const apiRes = await ApiManagerService.getSignUser(values);
        console.log('jwtToken', apiRes);
        values.token = apiRes.token;


        const game = await ApiManagerService.getLastGame(apiRes.token);

        console.log('game', game);
        values.last_game_id = game.id;


        // set history
        // setHistoryMove();
        // console.log('responseGoogle', res);

        SessionManagerService.setUser(values);
        store.dispatch(setUser(values));
        store.dispatch(setHistory(JSON.parse(game.moves)));
    }

    handleOnFailure = (res) => {
        SessionManagerService.removeUser();

        setUser(SessionManagerService.getUser());

        console.log('res', res);
    }

    // shouldComponentUpdate(props, nextState) {
    //
    //     console.log('props', props);
    //     return props.location.path !== props.location.path;
    //
    // }

    render() {
        const {from} = this.props.location.state || {from: {pathname: "/"}};
        const {redirectToReferrer} = this.state;

        if (redirectToReferrer || (this.props.user.isLoggedIn && this.props.user.token && this.props.user.googleToken)) {
            console.log('Redirect!!!');
            return <Redirect to={from}/>;
        }

        const style = {
            textAlign: 'center',
            marginTop: '2rem'
        }
        return (
            <div className="page-log-in container" style={style}>
                <h2>
                    Log in
                </h2>

                <p>
                    Welcome to the 2018 edition of Chess analysis. It's a strongest chess engine on mobile. Let'a try if you can WIN.
                    Featuring a faster and smoother user interface along with a stronger state of the art artificial intelligence engine.
                </p>

                <GoogleLogin
                    clientId={config.google.clientId}
                    buttonText="Google"
                    onSuccess={this.handleOnSuccess}
                    onFailure={this.handleOnFailure}
                />
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