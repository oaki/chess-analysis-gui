import {setLoading} from "../../actions";
import config from "../../config";
import {Flash} from "../../services/errorManager";
import {IAction} from "../../interfaces";


export interface IGames {
    id: string;
    white: string;
    black: string;
    whiteElo: number;
    blackElo: number;
    pgn: string;
    result: string;
    fewNextMove: string[];
}

export interface IGameDatabase {
    id: number;
    fen: string;
    data: any;
    games: IGames[];
}

export interface IGamesDatabaseProps {
    gameDatabase: IGameDatabase,
    fen: string,
    handleMove: (move: string, fen: string) => {}
}


export function loadGamesFromDatabase(fen: string) {
    return async (dispatch: (data: any) => {}) => {

        dispatch(setLoading(true));

        const url = `${config.apiHost}/games-database?fen=${fen}`;
        const headers: RequestInit = {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json"
            })
        };

        try {
            const response = await fetch(url, headers);
            if (response.ok) {
                const gameList: IGameDatabase = await response.json();

                if (gameList) {
                    dispatch(setGamesDatabase(gameList));
                }

            } else {
                dispatch(setGamesDatabase(null));
            }

        } catch (e) {
            Flash.error({msg: "games-database failed", identifier: "gamesDatabase"});
            console.log(e);
        }

        dispatch(setLoading(false));
    }

}

export function setGamesDatabase(gameDatabase: IGameDatabase | null) {
    return {
        payload: {
            gameDatabase: gameDatabase
        },
        type: SET_GAMES
    };
}

export const SET_GAMES = "SET_GAMES";

export interface IGamesDatabaseAction {
    gameDatabase: IGameDatabase;
}

export function gamesDatabaseReducer(gameDatabase: IGameDatabase | null = null, action: IAction<IGamesDatabaseAction>) {

    switch (action.type) {
        case SET_GAMES:
            return action.payload.gameDatabase;

        default:
            return gameDatabase;
    }
};
