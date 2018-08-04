import * as React from "react";
import {ApiManagerService} from "../../services/apiManager";
import * as jwt from "jsonwebtoken";

export function VerifyGoogleResponse(props: any) {
    console.log({props});
    const hash = window.location.hash;

    const token = hash.replace("#id_token=", "");

    ApiManagerService.getSignUser(token).then((response) => {
        const jwtValues = jwt.decode(response.token);
        jwtValues.token = response.token;
        window.opener.postMessage(jwtValues, "http://localhost:3000");

        console.log({jwtValues});
    });

    return "test";
}