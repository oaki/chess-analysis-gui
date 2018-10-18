import * as React from "react";
import {Redirect, Route, RouteComponentProps, RouteProps} from "react-router-dom"
import {connect} from "react-redux";
import config from "../../config/index";
import {Log} from "../../libs/logger";

const queryString = require("query-string");

export default function GooglePopupRedirect() {

    const redirectUri = `${window.location.origin}/auth/verify-google-response`;
    const scope = "https://www.googleapis.com/auth/userinfo.email";
    const responseType = "id_token";

    const parsed = queryString.parse(location.search);
    console.log({parsed});

    const href = `https://accounts.google.com/o/oauth2/auth?state=${parsed.state}&redirect_uri=${redirectUri}&client_id=${config.google.clientId}&scope=${scope}&response_type=${responseType}`

    Log.info("redirect to google", href);

    window.location.href = href;
    return null;
}