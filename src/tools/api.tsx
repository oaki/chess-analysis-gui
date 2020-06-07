import {ApiManagerService} from "../services/apiManager";
import {SessionManagerService} from "../services/sessionManager";
import config from "../config";

export function userProfileApi(token): Api {
    return {
        ...getAuthoritationHeaders(token),
        url: `${config.apiHost}/user/profile/`
    }
}

export function userHistoryApi(token): Api {
    return {
        ...getAuthoritationHeaders(token),
        url: `${config.apiHost}/user/history:last`
    }
}

export function authRegisterApi(googleToken:string): Api {
    return {
        requestInit: {
            headers: new Headers(),
            method: "POST",
            body: JSON.stringify({
                jwt_token: googleToken
            })
        },
        url: `${config.apiHost}/auth/register`
    }
}

function getAuthoritationHeaders(token): { requestInit: RequestInit } {
    return {
        requestInit: {
            headers: new Headers({
                Authorization: `Bearer ${token}`
            })
        }
    }
}

export interface Api {
    url: string;
    requestInit?: RequestInit;
}
