import { IHistoryMove } from "../history/historyReducers";
import { IAction } from "../../interfaces";

export const historyListReducer = (games: IHistoryGameResponse[] = [], action: IAction<IHistoryGameResponse[]>) => {
  switch (action.type) {
    case SET_HISTORY_GAME_LIST:
      return action.payload;

    default:
      return games;
  }
};

export type IHistoryGameResponse = {
  id: number;
  user_id: number;
  moves: IHistoryMove[];
  created_at: string;
  updated_at: string;
}

export const SET_HISTORY_GAME_LIST = "SET_HISTORY_GAME_LIST";

export function setHistoryGameList(games: IHistoryGameResponse[]) {
  return {
    payload: games,
    type: SET_HISTORY_GAME_LIST
  };
}