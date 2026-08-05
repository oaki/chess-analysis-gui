jest.mock("../components/historyList/historyListReducers", () => ({
  historyListReducer: (state = []) => state,
}));
jest.mock("../components/openingExplorer/openingExplorerReducers", () => ({
  openingMovesReducer: (state = []) => state,
}));
jest.mock("../components/syzygyExplorer/syzygyExplorerReducers", () => ({
  syzygyReducer: (state = null) => state,
}));
jest.mock("../components/history/historyReducers", () => ({
  historyReducer: (state = []) => state,
}));
jest.mock("../components/menu/menuReducers", () => ({
  autoplayReducer: (state = false) => state,
  flipBoardReducer: (state = false) => state,
  menuReducer: (state = {}) => state,
  pgnDialogReducer: (state = false) => state,
}));
jest.mock("../components/chessboard/promotingDialogReducers", () => ({
  promotionDialogReducer: (state = null) => state,
}));
jest.mock("../services/errorManager", () => ({
  errorReducers: (state = []) => state,
}));
jest.mock("../layouts/settingPageReducers", () => ({
  settingsReducer: (state = {}) => state,
}));
jest.mock("../components/infoPanel/infoPanelReducers", () => ({
  panelTabReducer: (state = "evaluation") => state,
}));
jest.mock("../services/socketService", () => ({
  socketReducer: (state = {}) => state,
}));
jest.mock("../components/gamesDatabaseExplorer/gamesDatabaseReducers", () => ({
  gamesDatabaseReducer: (state = { response: null, isLoading: false }) => state,
}));

import {
  applyReducerMap,
  deepCopy,
  evaluationReducer,
  loadingReducer,
  onMoveReducer,
  positionReducer,
  statusReducer,
  userReducer,
  workerReducer,
} from "../reducers";
import { IOnMove } from "../actions";

describe("reducers", () => {
  it("updates scalar reducers from known action types", () => {
    expect(loadingReducer(false, { type: "UPDATE_LOADING", isLoading: true })).toBe(true);
    expect(positionReducer("a", { type: "SET_POSITION", fen: "b" })).toBe("b");
    expect(statusReducer("old", { type: "SET_STATUS", status: "new" })).toBe("new");
    expect(evaluationReducer([], { type: "SET_EVALUATION", evaluation: [1, 2] as any })).toEqual([
      1,
      2,
    ]);
  });

  it("updates object/array reducers", () => {
    expect(userReducer({ isLoggedIn: false }, { type: "USER_SIGN_IN", payload: { name: "N" } as any })).toEqual({
      isLoggedIn: false,
      name: "N",
    });
    expect(workerReducer([], { type: "SET_WORKER_LIST", payload: [{ id: 1 }] as any })).toEqual([
      { id: 1 },
    ]);
    expect(onMoveReducer(IOnMove.WHITE, { type: "ON_MOVE", payload: IOnMove.BLACK })).toBe(
      IOnMove.BLACK
    );
  });

  it("applies reducer map over full state", () => {
    const prevState: any = {
      loading: false,
      user: { isLoggedIn: false },
      fen: "x",
      evaluation: [],
      openingMoves: [],
      errors: [],
      history: [],
      status: "",
      isFlip: false,
      lastMoveId: 0,
      lastMove: { from: "", to: "" },
      menu: {},
      workers: [],
      onMove: IOnMove.WHITE,
      historyList: [],
      syzygy: null,
      promotionDialog: null,
      autoplay: false,
      isOnline: false,
      settings: {},
      pgnDialog: false,
      panelTab: "evaluation",
      socket: {},
      gameDatabase: { response: null, isLoading: false },
    };
    const next = applyReducerMap(prevState, { type: "UPDATE_LOADING", isLoading: true });
    expect(next.loading).toBe(true);
    expect(next.fen).toBe("x");
  });

  it("deep copies plain object data", () => {
    const original = { a: 1, nested: { b: 2 } };
    const copied = deepCopy(original);
    copied.nested.b = 99;
    expect(original.nested.b).toBe(2);
  });

  it("returns default state when action type is unknown", () => {
    expect(loadingReducer(true, { type: "UNKNOWN_ACTION" })).toBe(true);
    expect(positionReducer("fen-x", { type: "UNKNOWN_ACTION" })).toBe("fen-x");
    expect(statusReducer("check", { type: "UNKNOWN_ACTION" })).toBe("check");
  });

  it("loadingReducer defaults to false", () => {
    expect(loadingReducer(undefined, { type: "INIT" })).toBe(false);
  });

  it("statusReducer defaults to empty string", () => {
    expect(statusReducer(undefined, { type: "INIT" })).toBe("");
  });

  it("evaluationReducer defaults to empty array", () => {
    expect(evaluationReducer(undefined, { type: "INIT" })).toEqual([]);
  });

  it("userReducer merges partial update into existing state", () => {
    const existing = { isLoggedIn: true, email: "a@b.com" };
    const result = userReducer(existing as any, {
      type: "USER_SIGN_IN",
      payload: { name: "Alice" } as any,
    });
    expect(result.isLoggedIn).toBe(true);
    expect((result as any).email).toBe("a@b.com");
    expect((result as any).name).toBe("Alice");
  });

  it("workerReducer replaces entire list", () => {
    const initial = [{ id: 1 }, { id: 2 }];
    const newList = [{ id: 3 }];
    const result = workerReducer(initial as any, {
      type: "SET_WORKER_LIST",
      payload: newList as any,
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(3);
  });

  it("deepCopy handles arrays", () => {
    const arr = [1, 2, { x: 3 }];
    const copied = deepCopy(arr) as typeof arr;
    (copied[2] as { x: number }).x = 99;
    expect((arr[2] as { x: number }).x).toBe(3);
  });
});
