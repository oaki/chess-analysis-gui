import {
  setEvaluation,
  setLoading,
  setPosition,
  setStatus,
  setUser,
  setWhoIsOnMove,
  IOnMove,
  loadEngines,
} from "../actions";
import { SessionManagerService } from "../services/sessionManager";
import { Flash } from "../services/errorManager";

jest.mock("../services/sessionManager", () => ({
  SessionManagerService: {
    getToken: jest.fn(() => "token-1"),
  },
}));

jest.mock("../services/errorManager", () => ({
  Flash: {
    error: jest.fn(),
  },
}));

describe("actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates simple action payloads", () => {
    expect(setLoading(true)).toEqual({ type: "UPDATE_LOADING", isLoading: true });
    expect(setPosition("fen")).toEqual({ type: "SET_POSITION", fen: "fen" });
    expect(setStatus("ready")).toEqual({ type: "SET_STATUS", status: "ready" });
    expect(setWhoIsOnMove(IOnMove.BLACK)).toEqual({
      type: "ON_MOVE",
      payload: IOnMove.BLACK,
    });
    expect(setEvaluation([{ score: "1.0" } as any])).toEqual({
      type: "SET_EVALUATION",
      evaluation: [{ score: "1.0" }],
    });
    expect(setUser({ isLoggedIn: true, name: "P" })).toEqual({
      type: "USER_SIGN_IN",
      payload: { isLoggedIn: true, name: "P" },
    });
  });

  it("loadEngines dispatches loading and worker list on success", async () => {
    const dispatch = jest.fn();
    const getState = jest.fn(() => ({}));
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [{ id: 1, uuid: "w-1" }],
    });

    await loadEngines()(dispatch, getState);

    expect(SessionManagerService.getToken).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({ type: "UPDATE_LOADING", isLoading: true });
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_WORKER_LIST",
      payload: [{ id: 1, uuid: "w-1" }],
    });
    expect(dispatch).toHaveBeenLastCalledWith({ type: "UPDATE_LOADING", isLoading: false });
  });

  it("loadEngines handles failing response", async () => {
    const dispatch = jest.fn();
    const getState = jest.fn(() => ({}));
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      statusText: "Forbidden",
    });

    await loadEngines()(dispatch, getState);

    expect(Flash.error).toHaveBeenCalled();
    expect(dispatch).toHaveBeenLastCalledWith({ type: "UPDATE_LOADING", isLoading: false });
  });
});
