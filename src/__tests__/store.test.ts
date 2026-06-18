import { store, useAppStore } from "../store";

describe("store", () => {
  beforeEach(() => {
    useAppStore.setState((state) => state, true);
  });

  it("dispatches plain actions", () => {
    store.dispatch({ type: "SET_STATUS", status: "ok" });
    expect(store.getState().status).toBe("ok");
  });

  it("dispatches thunk actions", () => {
    const thunk = jest.fn((dispatch) => {
      dispatch({ type: "SET_STATUS", status: "from-thunk" });
    });
    store.dispatch(thunk);
    expect(thunk).toHaveBeenCalled();
    expect(store.getState().status).toBe("from-thunk");
  });

  it("dispatches batched actions", () => {
    store.dispatch({
      type: "BATCH_ACTIONS",
      payload: [
        { type: "SET_STATUS", status: "a" },
        { type: "SET_POSITION", fen: "fen-1" },
      ],
    });
    expect(store.getState().status).toBe("a");
    expect(store.getState().fen).toBe("fen-1");
  });

  it("notifies subscribers and supports unsubscribe", () => {
    const listener = jest.fn();
    const unsubscribe = store.subscribe(listener);
    store.dispatch({ type: "SET_STATUS", status: "notify" });
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    store.dispatch({ type: "SET_STATUS", status: "again" });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("does not mutate previous state on dispatch", () => {
    store.dispatch({ type: "SET_STATUS", status: "initial" });
    const before = store.getState();
    store.dispatch({ type: "SET_STATUS", status: "after" });
    expect(before.status).toBe("initial");
    expect(store.getState().status).toBe("after");
  });

  it("handles multiple subscribers independently", () => {
    const a = jest.fn();
    const b = jest.fn();
    const unA = store.subscribe(a);
    const unB = store.subscribe(b);
    store.dispatch({ type: "SET_STATUS", status: "multi" });
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
    unA();
    store.dispatch({ type: "SET_STATUS", status: "again" });
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(2);
    unB();
  });

  it("ignores unknown action types without throwing", () => {
    expect(() => {
      store.dispatch({ type: "COMPLETELY_UNKNOWN_ACTION_TYPE" });
    }).not.toThrow();
  });

  it("thunk receives getState returning current state", () => {
    store.dispatch({ type: "SET_STATUS", status: "before-thunk" });
    const thunk = jest.fn((dispatch, getState) => {
      expect(getState().status).toBe("before-thunk");
    });
    store.dispatch(thunk);
    expect(thunk).toHaveBeenCalled();
  });

  it("batched actions with empty payload does nothing", () => {
    store.dispatch({ type: "SET_STATUS", status: "before-batch" });
    store.dispatch({ type: "BATCH_ACTIONS", payload: [] });
    expect(store.getState().status).toBe("before-batch");
  });
});
