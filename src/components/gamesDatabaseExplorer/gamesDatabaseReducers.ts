import { GAME_DATABASE_UPDATE_LOADING, gameDatabaseSetLoading } from "../../actions";
import { config } from "../../config";
import { Flash } from "../../services/errorManager";
import { GameDatabase, IAction } from "../../interfaces";

import debounce from "lodash/debounce";

export type IGames = {
  id: string;
  white: string;
  black: string;
  whiteElo: number;
  blackElo: number;
  pgn: string;
  result: string;
  fewNextMove: string[];
}

export type IGameDatabase = {
  id: number;
  fen: string;
  data: unknown;
  games: IGames[];
}

export type IGamesDatabaseProps = {
  response: IGameDatabase;
  fen: string;
  isLoading: boolean;
  handleMove: (move: string, fen: string) => void;
}


type ThunkDispatch = (action: unknown) => unknown;

const loadGamesFromDatabaseDebounce = debounce(async (dispatch: ThunkDispatch, fen: string) => {

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
    Flash.error({ msg: "games-database failed", identifier: "gamesDatabase" });
    console.log(e);
  }

  dispatch(gameDatabaseSetLoading(false));
}, 1000);

export function loadGamesFromDatabase(fen: string) {
  return async (dispatch: ThunkDispatch) => {
    console.log("try to load");
    dispatch(gameDatabaseSetLoading(true));
    return loadGamesFromDatabaseDebounce(dispatch, fen);
  };

}

export function setGamesDatabase(response: IGameDatabase | null) {
  return {
    payload: {
      response: response
    },
    type: SET_GAMES
  };
}

export const SET_GAMES = "SET_GAMES";

export type IGamesDatabaseAction = {
  response: IGameDatabase;
  isLoading: IGameDatabase;
}

export function gamesDatabaseReducer(state: GameDatabase = {
  response: null,
  isLoading: false
}, action: IAction<IGamesDatabaseAction>) {

  switch (action.type) {
    case SET_GAMES:
      return { ...state, response: action.payload.response };

    case GAME_DATABASE_UPDATE_LOADING:
      return { ...state, isLoading: action.payload.isLoading };

    default:
      return state;
  }
};
