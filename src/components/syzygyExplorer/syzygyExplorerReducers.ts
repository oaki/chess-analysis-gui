import { IAction } from "../../interfaces";

export type ISyzygyMove = {
  uci: string;
  san: string;
  zeroing: boolean;
  checkmate: boolean;
  stalemate: boolean;
  variant_win: boolean;
  variant_loss: boolean;
  insufficient_material: boolean;
  wdl: number;
  dtz: number;
  dtm?: unknown;
}

export type ISyzygy = {
  checkmate: boolean;
  stalemate: boolean;
  variant_win: boolean;
  variant_loss: boolean;
  insufficient_material: boolean;
  wdl: number;
  dtz: number;
  dtm?: unknown;
  moves: ISyzygyMove[];
}

export const SET_SYZYGY_EVALUATION = "SET_SYZYGY_EVALUATION";

export function setSyzygyEvaluation(syzygy: ISyzygy | null) {
  return {
    payload: syzygy,
    type: SET_SYZYGY_EVALUATION
  };
}

export const syzygyReducer = (syzygy: ISyzygy | null = null, action: IAction<ISyzygy>) => {
  switch (action.type) {
    case SET_SYZYGY_EVALUATION:
      return action.payload;

    default:
      return syzygy;
  }
};
