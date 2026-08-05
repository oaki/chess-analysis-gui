import {
  flipBoardReducer,
  autoplayReducer,
  menuReducer,
  pgnDialogReducer,
  flipBoard,
  toggleAutoplay,
  toogleOpenMenu,
  openPgnDialog,
  FLIP_BOARD,
  AUTOPLAY,
  MENU_TOGGLE_OPEN,
  MENU_OPEN_PGN_DIALOG,
} from "../menuReducers";

describe("flipBoard action creator", () => {
  it("creates FLIP_BOARD action", () => {
    expect(flipBoard()).toEqual({ type: FLIP_BOARD });
  });
});

describe("flipBoardReducer", () => {
  it("returns false by default", () => {
    expect(flipBoardReducer(undefined, { type: "UNKNOWN" })).toBe(false);
  });

  it("toggles on FLIP_BOARD", () => {
    expect(flipBoardReducer(false, flipBoard())).toBe(true);
    expect(flipBoardReducer(true, flipBoard())).toBe(false);
  });
});

describe("toggleAutoplay action creator", () => {
  it("creates AUTOPLAY action with null payload", () => {
    expect(toggleAutoplay()).toEqual({ type: AUTOPLAY, payload: { isAutoplay: null } });
  });

  it("creates AUTOPLAY action with boolean payload", () => {
    expect(toggleAutoplay(true)).toEqual({ type: AUTOPLAY, payload: { isAutoplay: true } });
  });
});

describe("autoplayReducer", () => {
  it("returns false by default", () => {
    expect(autoplayReducer(undefined, { type: "UNKNOWN", payload: { isAutoplay: false } })).toBe(false);
  });

  it("toggles when payload is null", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nullToggle = toggleAutoplay(null as any) as any;
    expect(autoplayReducer(false, nullToggle)).toBe(true);
    expect(autoplayReducer(true, nullToggle)).toBe(false);
  });

  it("sets explicit value", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(autoplayReducer(false, toggleAutoplay(true) as any)).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(autoplayReducer(true, toggleAutoplay(false) as any)).toBe(false);
  });
});

describe("menuReducer", () => {
  it("returns closed menu by default", () => {
    expect(menuReducer(undefined, { type: "UNKNOWN", payload: {} })).toEqual({ isOpen: false });
  });

  it("toggles isOpen when payload.isOpen is falsy", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = menuReducer({ isOpen: false }, toogleOpenMenu(null as any) as any);
    expect(state.isOpen).toBe(true);
  });

  it("sets explicit isOpen from payload", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = menuReducer({ isOpen: false }, toogleOpenMenu(true) as any);
    expect(state.isOpen).toBe(true);
  });
});

describe("pgnDialogReducer", () => {
  it("returns false by default", () => {
    expect(pgnDialogReducer(undefined, { type: "UNKNOWN", payload: false })).toBe(false);
  });

  it("sets value from payload", () => {
    expect(pgnDialogReducer(false, openPgnDialog(true))).toBe(true);
    expect(pgnDialogReducer(true, openPgnDialog(false))).toBe(false);
  });
});
