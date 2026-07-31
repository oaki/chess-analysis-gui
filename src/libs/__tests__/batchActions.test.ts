import { batchActions } from "../batchActions";

describe("batchActions", () => {
  it("wraps actions in BATCH_ACTIONS", () => {
    const actions = [{ type: "A" }, { type: "B" }];
    expect(batchActions(actions)).toEqual({ type: "BATCH_ACTIONS", payload: actions });
  });

  it("works with empty array", () => {
    expect(batchActions([])).toEqual({ type: "BATCH_ACTIONS", payload: [] });
  });
});
