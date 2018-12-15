import {setLoading} from "../../actions";
import config from "../../config";
import {Flash} from "../../services/errorManager";


export interface IGames {
    "id": string;
    "white": string;
    "black": string;
    "whiteElo": number;
    "blackElo": number;
    "pgn": string;
    "result": string;
}

export interface IGamesList {
    "id": number;
    "fen": string;
    "data": any;
    "games": IGames[];
}

export interface IGamesDatabaseProps {
    gamesList: IGamesList,
    fen: string,
    handleMove: (move: string, fen: string) => {}
}


export function loadGames(fen: string) {
    return async (dispatch: (data: any) => {}) => {
        console.log("loadGames", fen);
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
                const moves: any = await response.json();
                console.log(moves);
                dispatch(setGamesDatabase(moves));
            } else {
                dispatch(setGamesDatabase([]));
            }

        } catch (e) {
            Flash.error({msg: "opening book failed", identifier: "openingExplorer"});
            console.log(e);
        }

        dispatch(setLoading(false));
    }

}

export function setGamesDatabase(gamesList: IGamesList[]) {
    return {
        gamesList,
        type: SET_GAMES
    };
}

export const SET_GAMES = "SET_GAMES";

export function gamesDatabaseReducer(gamesList: IGamesList[] = [], action: any) {

    switch (action.type) {
        case SET_GAMES:
            return action.gamesList;

        default:
            return gamesList;
    }
};
