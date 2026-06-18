import React from "react";
import { ApiManagerService } from "../../services/apiManager";
import { Log } from "../../libs/logger";
import { ChevronLeft } from "@emotion-icons/material";

type ParsedHash = Record<string, string | undefined>;

export function VerifyGoogleResponse(_props: Record<string, never>) {

  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const response: ParsedHash = Object.fromEntries(hashParams.entries());
  Log.info("VerifyGoogleResponse", response);
  const stateRaw = response["state"];
  const idTokenRaw = response.id_token;
  if (typeof stateRaw === "string" && typeof idTokenRaw === "string") {
    const state = JSON.parse(stateRaw) as { token?: string };
    if (state.token) {
      ApiManagerService.pairGoogleTokenAndTemporaryToken(idTokenRaw, state.token).then(() => {
        if (window.opener) {
          window.close();
          return;
        }
        window.location.href = "/auth/sign-in";
      });
    }
  }

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
        by tapping the <span style={styles}><ChevronLeft /></span> Chess 2.0 from the
        top left of your phone's screen.
      </div>
    </div>
  );
}
