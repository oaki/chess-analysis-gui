import { settingsReducer, toggleShowEvaluation, TOGGLE_EVALUATION, SettingsState } from "../settingPageReducers";

describe("toggleShowEvaluation", () => {
  it("creates TOGGLE_EVALUATION action", () => {
    expect(toggleShowEvaluation()).toEqual({ type: TOGGLE_EVALUATION });
  });
});

describe("settingsReducer", () => {
  it("returns default state with showEvaluation true", () => {
    const state = settingsReducer(undefined, { type: "UNKNOWN", payload: {} as SettingsState });
    expect(state.showEvaluation).toBe(true);
  });

  it("toggles showEvaluation on TOGGLE_EVALUATION", () => {
    const initial: SettingsState = { showEvaluation: true };
    const action = toggleShowEvaluation();
    const state = settingsReducer(initial, action as ReturnType<typeof toggleShowEvaluation> & { payload: SettingsState });
    expect(state.showEvaluation).toBe(false);
  });

  it("toggles back to true", () => {
    const initial: SettingsState = { showEvaluation: false };
    const action = toggleShowEvaluation();
    const state = settingsReducer(initial, action as ReturnType<typeof toggleShowEvaluation> & { payload: SettingsState });
    expect(state.showEvaluation).toBe(true);
  });
});
