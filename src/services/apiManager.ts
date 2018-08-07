import config from "../config";
import {IUser} from "../reducers";

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

    async saveGame(moves: any, user: IUser) {
        const fetchData = {
            headers: new Headers({
                Authorization: `Bearer ${user.token}`
            }),
            method: "PUT",
            body: JSON.stringify({moves: moves})
        };

        return await this.fetch(`/user/history/${Number(user.last_game_id)}`, fetchData);
    }

    async getSignUser(token: string) {

        const fetchData = {
            headers: new Headers(),
            method: "POST",
            // mode: 'no-cors',
            body: JSON.stringify({
                jwt_token: token
            }),
        };

        return await this.fetch("/auth/register", fetchData);
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

}

const apiHost: string = config.apiHost;

export const ApiManagerService = new ApiManager(apiHost);