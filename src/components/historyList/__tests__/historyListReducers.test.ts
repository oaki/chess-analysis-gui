import { historyListReducer, setHistoryGameList } from "../historyListReducers";

describe("historyListReducers", () => {
  it("sets history game list", () => {
    const payload = [{ id: 1 }, { id: 2 }] as import("../historyListReducers").IHistoryGameResponse[];
    const action = setHistoryGameList(payload);
    expect(action).toEqual({ type: "SET_HISTORY_GAME_LIST", payload });
    expect(historyListReducer([], action)).toEqual(payload);
  });
});
