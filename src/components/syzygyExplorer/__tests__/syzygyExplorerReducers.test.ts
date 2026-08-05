import { setSyzygyEvaluation, syzygyReducer } from "../syzygyExplorerReducers";

describe("syzygyExplorerReducers", () => {
  it("sets syzygy evaluation payload", () => {
    const payload = { wdl: 1, moves: [] } as any;
    expect(setSyzygyEvaluation(payload)).toEqual({
      type: "SET_SYZYGY_EVALUATION",
      payload,
    });
  });

  it("updates reducer state", () => {
    const state = syzygyReducer(null, setSyzygyEvaluation({ wdl: -1, moves: [] } as any) as any);
    expect(state).toEqual({ wdl: -1, moves: [] });
  });
});
