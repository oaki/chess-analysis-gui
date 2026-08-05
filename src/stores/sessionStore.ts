import { useAppStore } from "../store";
import type { ReduxStateShape } from "../reducers";

type SessionSlice = Pick<ReduxStateShape, "user" | "loading" | "historyList">;

export const useSessionStore = <T>(
  selector: (state: SessionSlice) => T,
  equalityFn?: (a: T, b: T) => boolean
) => {
  const sliceSelector = (state: ReduxStateShape) =>
    selector({
      user: state.user,
      loading: state.loading,
      historyList: state.historyList,
    });
  return equalityFn ? useAppStore(sliceSelector, equalityFn) : useAppStore(sliceSelector);
};
