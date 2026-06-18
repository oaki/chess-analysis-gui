import { config } from "../config";
import {
  buildApiUrl,
  buildAuthRequest,
  buildPublicRequest,
  executeApiRequest,
} from "./authenticatedApi";


class ApiManager {
    constructor(private apiHost: string) {

    }

    async getLastGame(token: string) {
        return await executeApiRequest(buildAuthRequest(token, "/user/history:last"));
    }

    async getGame(token: string, id: number) {
        return await executeApiRequest(buildAuthRequest(token, `/user/history/${Number(id)}`));
    }

    async addWorker(token: string, name: string, uuid: string) {
        return await executeApiRequest(buildAuthRequest(token, "/user/workers", {
            method: "POST",
            body: JSON.stringify({
                name: name,
                uuid: uuid
            })
        }));
    }

    async getProfile(token: string) {
        return await executeApiRequest(buildAuthRequest(token, "/user/profile/"));
    }

    async saveGame(moves: unknown, lastGameId: number, token: string) {
        return await executeApiRequest(buildAuthRequest(token, `/user/history/${Number(lastGameId)}`, {
            method: "PUT",
            body: JSON.stringify({moves: moves})
        }));
    }

    async importGameFromPgn(pgn: string, token: string) {
        return await executeApiRequest(buildAuthRequest(token, "/user/history/import-pgn", {
            method: "POST",
            body: JSON.stringify({pgn: pgn})
        }));
    }

    async getUserBasedOnGoogleToken(googleToken: string) {
        return executeApiRequest(buildPublicRequest("/auth/register", {
            headers: new Headers(),
            method: "POST",
            body: JSON.stringify({
                jwt_token: googleToken
            }),
        }));
    }

    async saveLog(data: unknown[]) {
        return await executeApiRequest(buildPublicRequest("/logs/save", {
            method: "POST",
            body: JSON.stringify(data)
        }));
    }

    async fetch(path: string, data: RequestInit) {
        try {
            const url: string = `${this.apiHost}${path}`;
            console.log("fetch", {url, data});
            const response = await fetch(url, data);
            console.log("response", response);
            if (!response.ok) {

                if (response.status === 403) {
                    throw await response.json();
                }

                throw new Error(response.statusText);
            }
            return await response.json();
        } catch (e) {
            console.error(e);
            throw e;
        }

    }


    async getTemporaryToken() {
        return await executeApiRequest(buildPublicRequest("/auth/temporary-session", {
            method: "GET",
        }));
    }

    async verifyTemporaryToken(token: string) {
        return await executeApiRequest(buildPublicRequest("/auth/verify-temporary-session", {
            headers: new Headers(),
            method: "POST",
            // mode: 'no-cors',
            body: JSON.stringify({
                token
            }),
        }));
    }

    async pairGoogleTokenAndTemporaryToken(googleToken: string, temporaryToken: string) {
        return await executeApiRequest(buildPublicRequest("/auth/pair-temporary-session", {
            headers: new Headers(),
            method: "POST",
            body: JSON.stringify({
                google_token: googleToken,
                temporary_token: temporaryToken
            }),
        }));
    }

    async checkTemporaryToken(temporaryToken: string) {
        return await executeApiRequest(buildPublicRequest("/auth/check-temporary-token", {
            headers: new Headers(),
            method: "POST",
            body: JSON.stringify({
                temporary_token: temporaryToken
            }),
        }));
    }

}

const apiHost: string = config.apiHost;

export const ApiManagerService = new ApiManager(apiHost);