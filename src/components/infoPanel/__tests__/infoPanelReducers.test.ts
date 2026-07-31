import { panelTabReducer, setPanelTab, PanelTabType, SET_TAB } from "../infoPanelReducers";

describe("setPanelTab", () => {
  it("creates SET_TAB action", () => {
    expect(setPanelTab(PanelTabType.EVALUATION_TAB)).toEqual({
      type: SET_TAB,
      payload: PanelTabType.EVALUATION_TAB,
    });
  });
});

describe("panelTabReducer", () => {
  it("returns default INFO_TAB", () => {
    const state = panelTabReducer(undefined, { type: "UNKNOWN", payload: PanelTabType.INFO_TAB });
    expect(state).toBe(PanelTabType.INFO_TAB);
  });

  it("switches to EVALUATION_TAB", () => {
    const state = panelTabReducer(PanelTabType.INFO_TAB, setPanelTab(PanelTabType.EVALUATION_TAB));
    expect(state).toBe(PanelTabType.EVALUATION_TAB);
  });

  it("switches to BOOK_TAB", () => {
    const state = panelTabReducer(PanelTabType.INFO_TAB, setPanelTab(PanelTabType.BOOK_TAB));
    expect(state).toBe(PanelTabType.BOOK_TAB);
  });

  it("switches back to INFO_TAB", () => {
    const state = panelTabReducer(PanelTabType.EVALUATION_TAB, setPanelTab(PanelTabType.INFO_TAB));
    expect(state).toBe(PanelTabType.INFO_TAB);
  });
});
