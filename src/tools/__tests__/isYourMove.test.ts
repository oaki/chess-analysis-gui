jest.mock("../../services/errorManager", () => ({
  Flash: { info: jest.fn(), error: jest.fn() },
  ErrorManager: class { handler = jest.fn(); },
  addError: jest.fn(),
  addInfo: jest.fn(),
  removeError: jest.fn(),
  errorReducers: jest.fn(() => []),
  ErrorType: { INFO: "info", ERROR: "error" },
  ADD_ERROR: "ADD_ERROR",
  REMOVE_ERROR: "REMOVE_ERROR",
}));

jest.mock("../../store", () => ({
  store: { dispatch: jest.fn(), getState: jest.fn(() => ({})), subscribe: jest.fn(() => jest.fn()) },
  useAppStore: jest.fn(),
}));

import { isYourMove } from "../isYourMove";
import { IOnMove } from "../../actions";

describe("isYourMove", () => {
  it("returns true when white to move and board not flipped", () => {
    expect(isYourMove(IOnMove.WHITE, false)).toBe(true);
  });

  it("returns false when white to move and board is flipped", () => {
    expect(isYourMove(IOnMove.WHITE, true)).toBe(false);
  });

  it("returns false when black to move and board not flipped", () => {
    expect(isYourMove(IOnMove.BLACK, false)).toBe(false);
  });

  it("returns true when black to move and board is flipped", () => {
    expect(isYourMove(IOnMove.BLACK, true)).toBe(true);
  });
});
