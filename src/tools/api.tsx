import { buildAuthRequest, buildPublicRequest } from "../services/authenticatedApi";

export function userProfileApi(token): Api {
  return buildAuthRequest(token, "/user/profile/");
}

export function userHistoryApi(token): Api {
  return buildAuthRequest(token, "/user/history:last");
}

export function authRegisterApi(googleToken:string): Api {
  return buildPublicRequest("/auth/register", {
    headers: new Headers(),
    method: "POST",
    body: JSON.stringify({
      jwt_token: googleToken
    })
  });
}

export type Api = {
    url: string;
    requestInit?: RequestInit;
}
