import React from "react";
import {ApiManagerService} from "../../services/apiManager";
import {Log} from "../../libs/logger";
import * as queryString from "querystring";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import * as faAngleLeft from "@fortawesome/fontawesome-free-solid/faAngleLeft";

export function VerifyGoogleResponse(props: any) {

    const response: any = queryString.parse(window.location.hash);
    Log.info("VerifyGoogleResponse", response);

    const state = JSON.parse(response["#state"]);
    const temporaryToken = state.token;

    ApiManagerService.pairGoogleTokenAndTemporaryToken(response.id_token, temporaryToken).then((response) => {
        window.close();
    });

    const styles = {
        backgroundColor: "black",
        padding: "0 7px",
        color: "#cecece",
        display: "inline-block",
        borderRadius: "3px"
    };

    return (
        <div className="app">
            <div className="note">
                You can now go <b>back</b> to the Chess 2.0 app,
                by tapping the <span style={styles}><FontAwesomeIcon icon={faAngleLeft}/></span> Chess 2.0 from the
                top left of your phone's screen.
            </div>
        </div>
    );
}

export default VerifyGoogleResponse;