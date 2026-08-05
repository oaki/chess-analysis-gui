import { setLoading } from "../../actions";
import { config } from "../../config";
import { isOpeningMoveArray } from "../../libs/typeGuards";
import { Flash } from "../../services/errorManager";


export type IOpeningMove = {
  move: string;
  weight: number;
  fen: string;
  san: string;
}


type ThunkDispatch = (action: unknown) => unknown;

export function loadOpeningPosition(fen: string) {
  return async (dispatch: ThunkDispatch) => {
    console.log("loadOpeningPosition", fen);

    dispatch(setLoading(true));

    const url = `${config.apiHost}/opening-book?fen=${fen}`;
    const headers: RequestInit = {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json"
      })
    };

    try {
      const response = await fetch(url, headers);
      if (response.ok) {
        const body: unknown = await response.json();
        console.log(body);
        const moves = isOpeningMoveArray(body) ? body : [];
        dispatch(setOpeningPosition(moves));
      } else {
        dispatch(setOpeningPosition([]));
      }

    } catch (e) {
      Flash.error({ msg: "opening book failed", identifier: "openingExplorer" });
      console.log(e);
    }

    dispatch(setLoading(false));
  };

}

export function setOpeningPosition(moves: IOpeningMove[]) {
  return {
    moves,
    type: SET_OPENING_POSITION
  };
}

export const SET_OPENING_POSITION = "SET_OPENING_POSITION";

type OpeningMovesAction = ReturnType<typeof setOpeningPosition> | { type: string };

export function openingMovesReducer(moves: IOpeningMove[] = [], action: OpeningMovesAction) {
  switch (action.type) {
    case SET_OPENING_POSITION:
      return (action as ReturnType<typeof setOpeningPosition>).moves;

    default:
      return moves;
  }
}
