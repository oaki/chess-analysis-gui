import config from "../config";


class ApiManager {
    constructor(private apiHost: string) {

    }

    async getLastGame(token: string) {
        const fetchData = {
            headers: new Headers({
                Authorization: `Bearer ${token}`
            })
        };

        return await this.fetch("/user/history:last", fetchData);
    }

    async getGame(token, id: number) {
        const fetchData = {
            headers: new Headers({
                Authorization: `Bearer ${token}`
            })
        };
        return await this.fetch(`/user/history/${Number(id)}`, fetchData);
    }

    async addWorker(token, name: string, uuid: string) {
        const url = `${config.apiHost}/user/workers`;

        const fetchData: RequestInit = {
            method: "POST",
            headers: new Headers({
                "Authorization": `Bearer ${token}`
            }),
            body: JSON.stringify({
                name: name,
                uuid: uuid
            })
        };
        return await this.fetch(url, fetchData);
    }

    async getProfile(token) {
        const fetchData = {
            headers: new Headers({
                Authorization: `Bearer ${token}`
            })
        };
        return await this.fetch(`/user/profile/`, fetchData);
    }

    async saveGame(moves: any, lastGameId: number, token: string) {
        const fetchData = {
            headers: new Headers({
                Authorization: `Bearer ${token}`
            }),
            method: "PUT",
            body: JSON.stringify({moves: moves})
        };

        return await this.fetch(`/user/history/${Number(lastGameId)}`, fetchData);
    }

    async importGameFromPgn(pgn: string, token: string) {
        const fetchData = {
            headers: new Headers({
                Authorization: `Bearer ${token}`
            }),
            method: "POST",
            body: JSON.stringify({pgn: pgn})
        };

        return await this.fetch(`/user/history/import-pgn`, fetchData);
    }

    async getUserBasedOnGoogleToken(googleToken: string) {

        const fetchData = {
            headers: new Headers(),
            method: "POST",
            body: JSON.stringify({
                jwt_token: googleToken
            }),
        };

        return this.fetch("/auth/register", fetchData);
    }

    async saveLog(data: any[]) {
        const fetchData = {
            method: "POST",
            body: JSON.stringify(data)
        };

        return await this.fetch(`/logs/save`, fetchData);
    }

    async fetch(path, data) {
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

        const fetchData = {
            method: "GET",
        };

        return await this.fetch("/auth/temporary-session", fetchData);
    }

    async verifyTemporaryToken(token) {

        const fetchData = {
            headers: new Headers(),
            method: "POST",
            // mode: 'no-cors',
            body: JSON.stringify({
                token
            }),
        };

        return await this.fetch("/auth/verify-temporary-session", fetchData);
    }

    async pairGoogleTokenAndTemporaryToken(googleToken, temporaryToken) {

        const fetchData = {
            headers: new Headers(),
            method: "POST",
            body: JSON.stringify({
                google_token: googleToken,
                temporary_token: temporaryToken
            }),
        };

        return await this.fetch("/auth/pair-temporary-session", fetchData);
    }

    async checkTemporaryToken(temporaryToken) {

        const fetchData = {
            headers: new Headers(),
            method: "POST",
            body: JSON.stringify({
                temporary_token: temporaryToken
            }),
        };

        return await this.fetch("/auth/check-temporary-token", fetchData);
    }

}

const apiHost: string = config.apiHost;

export const ApiManagerService = new ApiManager(apiHost);