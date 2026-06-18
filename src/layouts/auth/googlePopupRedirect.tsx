import { config } from "../../config";
import {Log} from "../../libs/logger";

export function GooglePopupRedirect() {

    const redirectUri = `${window.location.origin}/auth/verify-google-response`;
    const scope = "https://www.googleapis.com/auth/userinfo.email";
    const responseType = "id_token";

    const parsed = Object.fromEntries(new URLSearchParams(window.location.search));
    console.log({parsed});

    const href = `https://accounts.google.com/o/oauth2/auth?state=${parsed.state}&redirect_uri=${redirectUri}&client_id=${config.google.clientId}&scope=${scope}&response_type=${responseType}`

    Log.info("redirect to google", href);

    window.location.href = href;
    return null;
}