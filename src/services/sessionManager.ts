import {Nullable} from "../interfaces";

export const TOKEN_BASE_NAME = "chess-analysis";
export const TOKEN_NAME = "chess-analysis__token";
export const TOKEN_USER_NAME = `${TOKEN_BASE_NAME}__user`;
export const TOKEN_TEMPORARY = `temporary_token`;


export const SessionManagerService = {
    getStorage(): Storage {
        return localStorage;
    },
    getToken(): Nullable<string> {
        return SessionManagerService.getStorage().getItem(TOKEN_NAME);
    },

    setToken(token: string): void {
        SessionManagerService.getStorage().setItem(TOKEN_NAME, token);
    },
    removeToken(): void {
        SessionManagerService.getStorage().removeItem(TOKEN_NAME);
    },

    getTemporaryToken(): Nullable<string> {
        return SessionManagerService.getStorage().getItem(TOKEN_TEMPORARY);
    },

    setTemporaryToken(token: string): void {
        SessionManagerService.getStorage().setItem(TOKEN_TEMPORARY, token);
    },
    removeTemporaryToken(): void {
        SessionManagerService.getStorage().removeItem(TOKEN_TEMPORARY);
    }
};