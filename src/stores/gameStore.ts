import { useAppStore } from "../store";
import type { ReduxStateShape } from "../reducers";

type GameSlice = Pick<
  ReduxStateShape,
  "fen" | "history" | "status" | "lastMoveId" | "lastMove" | "onMove" | "promotionDialog"
>;

export const useGameStore = <T>(
  selector: (state: GameSlice) => T,
  equalityFn?: (a: T, b: T) => boolean
) => {
  const sliceSelector = (state: ReduxStateShape) =>
    selector({
      fen: state.fen,
      history: state.history,
      status: state.status,
      lastMoveId: state.lastMoveId,
      lastMove: state.lastMove,
      onMove: state.onMove,
      promotionDialog: state.promotionDialog,
    });
  return equalityFn ? useAppStore(sliceSelector, equalityFn) : useAppStore(sliceSelector);
};
