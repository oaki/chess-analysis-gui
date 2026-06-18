import { IAction } from "../interfaces";

export type SettingsState = {
  showEvaluation: boolean;
};

export const TOGGLE_EVALUATION = "settings/showEvaluation";

export function toggleShowEvaluation() {
  return {
    type: TOGGLE_EVALUATION
  };
}

export const settingsReducer = (
  settings: SettingsState = {
    showEvaluation: true
  },
  action: IAction<SettingsState>
) => {
  switch (action.type) {
    case TOGGLE_EVALUATION:
      console.log("actionactionaction", action);
      return { ...settings, showEvaluation: !settings.showEvaluation };

    default:
      return settings;
  }
};
