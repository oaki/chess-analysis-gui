import config from "../config";
import {IUser} from "../reducers";
import {FetchError} from "../libs/errors/fetchError";

class ApiManager {
    constructor(private apiHost: string) {

    }

    async getLastGame(token: string) {
        const fetchData = {
            headers: new Headers({
                Authorization: `Bearer ${token}`
            })
        }
        return await this.fetch('/user/history:last', fetchData);
    }

    async saveGame(moves: any, user: IUser) {
        const fetchData = {
            headers: new Headers({
                Authorization: `Bearer ${user.token}`
            }),
            method: 'PUT',
            body: JSON.stringify({moves: moves})
        };

        return await this.fetch(`/user/history/${Number(user.last_game_id)}`, fetchData);
    }

    async getSignUser(user: IUser) {

        const fetchData = {
            headers: new Headers(),
            method: 'POST',
            // mode: 'no-cors',
            body: JSON.stringify({
                jwt_token: user.googleToken,
                email: user.email
            }),
        };

        return await this.fetch('/auth/register', fetchData);
    }

    async fetch(path, data) {
        try {
            const response = await fetch(`${this.apiHost}${path}`, data);
            if (!response.ok) {
                console.log('response', response);
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