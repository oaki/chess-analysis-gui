import {
  gamesDatabaseReducer,
  loadGamesFromDatabase,
  setGamesDatabase,
} from "../gamesDatabaseReducers";
import { Flash } from "../../../services/errorManager";

jest.mock("lodash/debounce", () => (fn) => fn);
jest.mock("../../../services/errorManager", () => ({
  Flash: {
    error: jest.fn(),
  },
}));

describe("gamesDatabaseReducers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sets response and loading flags in reducer", () => {
    const state = { response: null, isLoading: false };
    const next = gamesDatabaseReducer(state as any, setGamesDatabase({ id: 1 } as any) as any);
    expect(next.response).toEqual({ id: 1 });

    const loading = gamesDatabaseReducer(next as any, {
      type: "GAME_DATABASE_UPDATE_LOADING",
      payload: { isLoading: true },
    } as any);
    expect(loading.isLoading).toBe(true);
  });

  it("loads games and dispatches success action", async () => {
    const dispatch = jest.fn();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, games: [] }),
    });

    await loadGamesFromDatabase("fen")(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: "GAME_DATABASE_UPDATE_LOADING",
      payload: { isLoading: true },
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_GAMES",
      payload: { response: { id: 1, games: [] } },
    });
    expect(dispatch).toHaveBeenLastCalledWith({
      type: "GAME_DATABASE_UPDATE_LOADING",
      payload: { isLoading: false },
    });
  });

  it("handles database fetch errors", async () => {
    const dispatch = jest.fn();
    (global.fetch as jest.Mock).mockRejectedValue(new Error("boom"));

    await loadGamesFromDatabase("fen")(dispatch);
    expect(Flash.error).toHaveBeenCalled();
  });
});
