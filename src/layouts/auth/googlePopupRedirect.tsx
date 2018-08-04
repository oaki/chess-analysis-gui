import * as React from "react";
import {Redirect, Route, RouteComponentProps, RouteProps} from "react-router-dom"
import {setUser} from "../../actions";
import {connect} from "react-redux";
import {IUser} from "../../reducers";
import {SessionManagerService} from "../../services/sessionManager";
import {store} from "../../store";
import {ApiManagerService} from "../../services/apiManager";
import {setHistory} from "../../components/history/History";
import config from "../../config/index";
import GoogleLogin from "react-google-login";
import * as $ from 'jquery';


export default class GooglePopupRedirect extends React.Component<any, any> {
    state = {
        redirectToReferrer: false
    };

    handleOnFailure = (res) => {
        SessionManagerService.removeUser();

        setUser(SessionManagerService.getUser());

        console.log("res", res);
    }

    componentDidMount(){
        const button:any = document.getElementsByClassName('tst')[0];
        // debugger;
        // $(button).click();
        const redirectUri = 'http://localhost:3000/auth/verify-google-response';
        const scope = 'https://www.googleapis.com/auth/userinfo.email';
        const responseType = 'id_token';
        const href = `https://accounts.google.com/o/oauth2/auth?redirect_uri=${redirectUri}&client_id=${config.google.clientId}&scope=${scope}&response_type=${responseType}`
        window.location.href = href;

    }

    render() {

        return (
            <div>
                You will be redirected to Google

            </div>
            );
    }
}