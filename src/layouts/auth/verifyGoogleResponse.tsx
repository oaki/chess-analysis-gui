import * as React from "react";
import {ApiManagerService} from "../../services/apiManager";
import * as jwt from "jsonwebtoken";
import {Log} from "../../libs/logger";

export function VerifyGoogleResponse(props: any) {
    const hash = window.location.hash;
    const token = hash.replace("#id_token=", "");
    Log.info("VerifyGoogleResponse", token);
    ApiManagerService.getSignUser(token).then((response) => {
        const jwtValues = jwt.decode(response.token);
        jwtValues.token = response.token;

        Log.info("VerifyGoogleResponse->window.opener.postMessage", jwtValues, window.location.origin);
        window.opener.postMessage(jwtValues, window.location.origin);
    });

    return "Loading ...";
}