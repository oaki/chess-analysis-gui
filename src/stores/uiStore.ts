import { useAppStore } from "../store";
import type { ReduxStateShape } from "../reducers";

type UiSlice = Pick<
  ReduxStateShape,
  "menu" | "isFlip" | "autoplay" | "pgnDialog" | "panelTab" | "settings" | "errors"
>;

export const useUiStore = <T>(
  selector: (state: UiSlice) => T,
  equalityFn?: (a: T, b: T) => boolean
) => {
  const sliceSelector = (state: ReduxStateShape) =>
    selector({
      menu: state.menu,
      isFlip: state.isFlip,
      autoplay: state.autoplay,
      pgnDialog: state.pgnDialog,
      panelTab: state.panelTab,
      settings: state.settings,
      errors: state.errors,
    });
  return equalityFn ? useAppStore(sliceSelector, equalityFn) : useAppStore(sliceSelector);
};
