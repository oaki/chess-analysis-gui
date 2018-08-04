import * as React from "react";
import {Redirect, Route, RouteComponentProps, RouteProps} from "react-router-dom"
import {connect} from "react-redux";
import config from "../../config/index";

export default function GooglePopupRedirect() {

    const redirectUri = `${window.location.origin}/auth/verify-google-response`;
    const scope = "https://www.googleapis.com/auth/userinfo.email";
    const responseType = "id_token";
    const href = `https://accounts.google.com/o/oauth2/auth?redirect_uri=${redirectUri}&client_id=${config.google.clientId}&scope=${scope}&response_type=${responseType}`
    window.location.href = href;
}