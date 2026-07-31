jest.mock("../../store", () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({ errors: [] })),
    subscribe: jest.fn(() => jest.fn()),
  },
  useAppStore: jest.fn(),
}));

import { addError, addInfo, removeError, errorReducers, ErrorType, ErrorManager } from "../errorManager";
import { ADD_ERROR, REMOVE_ERROR } from "../errorManager";

describe("addError action creator", () => {
  it("creates ADD_ERROR action with ERROR type", () => {
    const action = addError({ msg: "Something failed", identifier: "err1" });
    expect(action.type).toBe(ADD_ERROR);
    expect(action.payload.type).toBe(ErrorType.ERROR);
    expect(action.payload.msg).toBe("Something failed");
    expect(action.payload.delay).toBe(3);
  });
});

describe("addInfo action creator", () => {
  it("creates ADD_ERROR action with INFO type", () => {
    const action = addInfo({ msg: "Info message", identifier: "info1" });
    expect(action.type).toBe(ADD_ERROR);
    expect(action.payload.type).toBe(ErrorType.INFO);
    expect(action.payload.msg).toBe("Info message");
  });
});

describe("removeError action creator", () => {
  it("creates REMOVE_ERROR action", () => {
    const action = removeError({ identifier: "err1" });
    expect(action).toEqual({ type: REMOVE_ERROR, payload: { identifier: "err1" } });
  });
});

describe("errorReducers", () => {
  it("returns empty array by default", () => {
    expect(errorReducers(undefined, { type: "UNKNOWN", payload: {} as never })).toEqual([]);
  });

  it("adds a new error", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const action = addError({ msg: "test", identifier: "e1" }) as any;
    const state = errorReducers([], action);
    expect(state).toHaveLength(1);
    expect(state[0].msg).toBe("test");
    expect(state[0].identifier).toBe("e1");
    expect(state[0].expireTime).toBeGreaterThan(0);
  });

  it("adds info", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const action = addInfo({ msg: "info", identifier: "i1" }) as any;
    const state = errorReducers([], action);
    expect(state[0].type).toBe(ErrorType.INFO);
  });

  it("updates existing error with same identifier", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const first = addError({ msg: "first", identifier: "e1" }) as any;
    let state = errorReducers([], first);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const second = addError({ msg: "second", identifier: "e1" }) as any;
    state = errorReducers(state, second);
    expect(state).toHaveLength(1);
    expect(state[0].msg).toBe("second");
  });
});

describe("ErrorManager.getNow", () => {
  it("returns current unix timestamp in seconds", () => {
    const now = Math.round(Date.now() / 1000);
    expect(Math.abs(ErrorManager.getNow() - now)).toBeLessThanOrEqual(1);
  });
});
