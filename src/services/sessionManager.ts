import {IUser} from "../reducers";

export const TOKEN_BASE_NAME = 'chess-analysis__token';
export const TOKEN_USER_NAME = `${TOKEN_BASE_NAME}__user`;

class SessionManager {
    getUser(): IUser {
        const value = sessionStorage.getItem(TOKEN_USER_NAME);
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
        sessionStorage.setItem(TOKEN_USER_NAME, JSON.stringify(user));
    }

    removeUser() {
        sessionStorage.removeItem(TOKEN_USER_NAME);
    }
}

export const SessionManagerService = new SessionManager();