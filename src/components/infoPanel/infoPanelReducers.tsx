import {IAction} from "../../interfaces";

export const SET_TAB = "panelTab/setTab";
export enum PanelTabType {
    INFO_TAB = "infoTab",
    EVALUATION_TAB = "evaluationTab",
    BOOK_TAB = "bookTab",
}

export const panelTabReducer = (type: PanelTabType = PanelTabType.INFO_TAB, action: IAction<PanelTabType>) => {
    switch (action.type) {
        case SET_TAB:
            return action.payload;

        default:
            return type;
    }
};

export function setPanelTab(type: PanelTabType) {
    return {
        payload: type,
        type: SET_TAB
    };
}