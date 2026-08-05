jest.mock("../../../actions", () => ({
  REMOVE_GAME_FROM_HISTORY: "REMOVE_GAME_FROM_HISTORY",
  SET_HISTORY: "SET_HISTORY",
  SET_HISTORY_MOVE: "SET_HISTORY_MOVE",
  SET_LAST_MOVE: "SET_LAST_MOVE",
  SET_LAST_MOVE_ID: "SET_LAST_MOVE_ID",
  setEvaluation: (payload) => ({ type: "SET_EVALUATION", evaluation: payload }),
  setPosition: (fen) => ({ type: "SET_POSITION", fen }),
}));
jest.mock("../../../store", () => ({
  __esModule: true,
  store: {
    getState: jest.fn(() => ({ lastMoveId: 0 })),
    dispatch: jest.fn(),
  },
  useAppStore: jest.fn(),
}));
jest.mock("../../chessboard/promotingDialog", () => ({
  isPromoting: jest.fn(() => false),
}));
jest.mock("../../openingExplorer/openingExplorerReducers", () => ({
  loadOpeningPosition: jest.fn(() => ({ type: "LOAD_OPENING" })),
  setOpeningPosition: jest.fn(() => ({ type: "SET_OPENING_POSITION", moves: [] })),
}));
jest.mock("../../../libs/batchActions", () => ({
  batchActions: (payload) => ({ type: "BATCH_ACTIONS", payload }),
}));
jest.mock("../../syzygyExplorer/syzygyExplorerReducers", () => ({
  setSyzygyEvaluation: jest.fn(() => ({ type: "SET_SYZYGY_EVALUATION", payload: null })),
}));
jest.mock("../../chessboard/promotingDialogReducers", () => ({
  setPromotionDialog: jest.fn((payload) => ({ type: "SET_PROMOTION_DIALOG", payload })),
}));
jest.mock("../../../services/sockets/actions", () => ({
  emitPosition: jest.fn(() => ({ type: "NEW_FEN" })),
}));
jest.mock("../../gamesDatabaseExplorer/gamesDatabaseReducers", () => ({
  loadGamesFromDatabase: jest.fn(() => ({ type: "LOAD_GAMES" })),
}));

import {
  findBestEvaluation,
  lastMove,
  lastMoveId,
  setHistory,
  setHistoryMove,
} from "../historyReducers";
import { LINE_MAP } from "../../../interfaces";

jest.mock("../../moveTree/tree", () => ({
  NODE_MAP: {
    id: "id",
    fen: "f",
    move: "m",
    shortNotation: "s",
    variants: "vs",
  },
  treeService: {
    add: jest.fn(),
    toJson: jest.fn(() => []),
    setNodes: jest.fn(),
  },
}));

describe("historyReducers helpers", () => {
  it("finds best evaluation by node count", () => {
    const best = findBestEvaluation([
      { [LINE_MAP.nodes]: 10, score: "1.0" } as any,
      { [LINE_MAP.nodes]: 50, score: "2.0" } as any,
    ]);
    expect(best).toEqual({ [LINE_MAP.nodes]: 50, score: "2.0" });
  });

  it("creates history-related actions", () => {
    expect(lastMoveId(10)).toEqual({ type: "SET_LAST_MOVE_ID", id: 10 });
    expect(lastMove("e2", "e4")).toEqual({
      type: "SET_LAST_MOVE",
      payload: { from: "e2", to: "e4" },
    });
    expect(setHistory([{ id: 1 }] as import("../../moveTree/tree").Node[])).toEqual({
      type: "SET_HISTORY",
      payload: [{ id: 1 }],
    });
  });

  it("creates setHistoryMove action", () => {
    const action = setHistoryMove({
      id: 3,
      parentId: 2,
      fen: "fen-3",
      notation: "e2e4",
      shortNotation: "e4",
    });
    expect(action.type).toBe("SET_HISTORY_MOVE");
    expect(action.payload.id).toBe(3);
  });
});
