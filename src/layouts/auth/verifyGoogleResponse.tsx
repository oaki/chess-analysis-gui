import * as React from "react";
import {ApiManagerService} from "../../services/apiManager";
import {Log} from "../../libs/logger";
import * as queryString from "querystring";

export function VerifyGoogleResponse(props: any) {

    const response: any = queryString.parse(window.location.hash);
    Log.info("VerifyGoogleResponse", response);

    const state = JSON.parse(response["#state"]);
    const temporaryToken = state.token;

    ApiManagerService.pairGoogleTokenAndTemporaryToken(response.id_token, temporaryToken).then((response) => {


        // const jwtValues = jwt.decode(response.token);
        // jwtValues.token = response.token;
        //
        // Log.info("VerifyGoogleResponse->window.opener.postMessage", jwtValues, window.location.origin);
        // Log.info("window.opener", window.opener);
        // window.opener.postMessage({reload: true}, window.location.origin);
        // (window.parent as any).refresh();
        debugger;
        window.close();
    });

    return "Loading ...";
}