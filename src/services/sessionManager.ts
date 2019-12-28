export const TOKEN_BASE_NAME = "chess-analysis";
export const TOKEN_NAME = "chess-analysis__token";
export const TOKEN_USER_NAME = `${TOKEN_BASE_NAME}__user`;
export const TOKEN_TEMPORARY = `temporary_token`;

class SessionManager {
    private storage;

    constructor(storage = null) {
        if (storage === null) {
            this.storage = localStorage;
        }
    }

    getToken(): string {
        return this.storage.getItem(TOKEN_NAME);
    }

    setToken(token: string) {
        this.storage.setItem(TOKEN_NAME, token);
    }

    removeToken() {
        this.storage.removeItem(TOKEN_NAME);
    }

    getTemporaryToken(): string {
        return this.storage.getItem(TOKEN_TEMPORARY);

    }

    setTemporaryToken(token: string) {
        this.storage.setItem(TOKEN_TEMPORARY, token);
    }

    removeTemporaryToken() {
        this.storage.removeItem(TOKEN_TEMPORARY);
    }

}

export const SessionManagerService = new SessionManager();