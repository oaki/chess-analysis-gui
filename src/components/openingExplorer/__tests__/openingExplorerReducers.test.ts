import {
  loadOpeningPosition,
  openingMovesReducer,
  setOpeningPosition,
} from "../openingExplorerReducers";
import { Flash } from "../../../services/errorManager";

jest.mock("../../../services/errorManager", () => ({
  Flash: {
    error: jest.fn(),
  },
}));

describe("openingExplorerReducers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates and reduces opening position action", () => {
    const moves = [{ move: "e2e4", fen: "f", san: "e4", weight: 10 }];
    const action = setOpeningPosition(moves);
    expect(action.type).toBe("SET_OPENING_POSITION");
    expect(openingMovesReducer([], action)).toEqual(moves);
  });

  it("loads opening moves on successful fetch", async () => {
    const dispatch = jest.fn();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [{ move: "e2e4", fen: "fen-1", san: "e4", weight: 10 }],
    });

    await loadOpeningPosition("fen-1")(dispatch);

    expect(dispatch).toHaveBeenCalledWith({ type: "UPDATE_LOADING", isLoading: true });
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_OPENING_POSITION",
      moves: [{ move: "e2e4", fen: "fen-1", san: "e4", weight: 10 }],
    });
    expect(dispatch).toHaveBeenLastCalledWith({ type: "UPDATE_LOADING", isLoading: false });
  });

  it("handles failed fetch response", async () => {
    const dispatch = jest.fn();
    (global.fetch as jest.Mock).mockRejectedValue(new Error("network"));

    await loadOpeningPosition("fen-1")(dispatch);

    expect(Flash.error).toHaveBeenCalled();
    expect(dispatch).toHaveBeenLastCalledWith({ type: "UPDATE_LOADING", isLoading: false });
  });
});
