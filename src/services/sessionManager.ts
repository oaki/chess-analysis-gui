import {IUser} from "../reducers";

export const TOKEN_BASE_NAME = 'chess-analysis__token';
export const TOKEN_USER_NAME = `${TOKEN_BASE_NAME}__user`;

class SessionManager {
    private storage;

    constructor(storage = null){
        if(storage === null){
            this.storage = localStorage;
        }
    }

    getUser(): IUser {
        const value = this.storage.getItem(TOKEN_USER_NAME);
        if (!value) {
            return {
                name: '',
                email: '',
                isLoggedIn: false,
                img: '',
                token: '',
                googleToken: '',
                last_game_id: 0,
            };
        }

        return JSON.parse(value);
    }

    setUser(user: IUser) {
        this.storage.setItem(TOKEN_USER_NAME, JSON.stringify(user));
    }

    removeUser() {
        this.storage.removeItem(TOKEN_USER_NAME);
    }
}

export const SessionManagerService = new SessionManager();