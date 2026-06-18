import { useAppStore } from "../store";
import type { ReduxStateShape } from "../reducers";

type AnalysisSlice = Pick<
  ReduxStateShape,
  "evaluation" | "openingMoves" | "syzygy" | "gameDatabase" | "socket" | "workers" | "isOnline"
>;

export const useAnalysisStore = <T>(
  selector: (state: AnalysisSlice) => T,
  equalityFn?: (a: T, b: T) => boolean
) => {
  const sliceSelector = (state: ReduxStateShape) =>
    selector({
      evaluation: state.evaluation,
      openingMoves: state.openingMoves,
      syzygy: state.syzygy,
      gameDatabase: state.gameDatabase,
      socket: state.socket,
      workers: state.workers,
      isOnline: state.isOnline,
    });
  return equalityFn ? useAppStore(sliceSelector, equalityFn) : useAppStore(sliceSelector);
};
