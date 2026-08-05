import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { SmartOpeningExplorer } from "../openingExplorer";

const dispatchMock = jest.fn();
const useSelectorMock = jest.fn();

jest.mock("../../../libs/stateCompat", () => ({
  shallowEqual: jest.fn(),
  useSelector: (selector) => useSelectorMock(selector),
}));

jest.mock("../../../store", () => ({
  __esModule: true,
  store: {
    dispatch: (...args) => dispatchMock(...args),
  },
  useAppStore: jest.fn(),
}));

jest.mock("../../history/historyReducers", () => ({
  setMove: jest.fn((payload) => ({ type: "SET_MOVE", payload })),
}));

jest.mock("../../moveTree/tree", () => ({
  treeService: {
    getCounter: jest.fn(() => 77),
  },
}));

describe("SmartOpeningExplorer", () => {
  it("dispatches setMove when explorer row is clicked", () => {
    useSelectorMock
      .mockReturnValueOnce([{ move: "e2e4", san: "e4", weight: 55 }])
      .mockReturnValueOnce("fen-1");

    render(<SmartOpeningExplorer />);
    fireEvent.click(screen.getByText("e4"));
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "SET_MOVE",
      })
    );
  });
});
