import React from "react";
import { render, screen } from "@testing-library/react";
import { SmartPanel } from "../Panel";
import { useSelector } from "../../libs/stateCompat";
import { PanelTabType } from "../infoPanel/infoPanelReducers";

jest.mock("../../libs/stateCompat", () => ({
  shallowEqual: jest.fn((a, b) => a === b),
  useSelector: jest.fn(),
}));

jest.mock("../history/history", () => ({
  History: () => <div data-testid="history-panel" />,
}));

jest.mock("../evaluation/evaluation", () => ({
  SmartEvaluation: () => <div data-testid="cloud-eval" />,
}));

jest.mock("../evaluation/workerEvaluation", () => ({
  WorkerEvaluation: () => <div data-testid="worker-eval" />,
}));

jest.mock("../evaluation/offlineStockfishEvaluation", () => ({
  SmartStockFish: () => <div data-testid="stockfish" />,
}));

jest.mock("../openingExplorer/openingExplorer", () => ({
  SmartOpeningExplorer: () => <div data-testid="opening-explorer" />,
}));

jest.mock("../gamesDatabaseExplorer/gamesDatabaseExplorer", () => ({
  SmartGamesDatabaseExplorer: () => <div data-testid="games-db" />,
}));

jest.mock("../syzygyExplorer/syzygyExplorer", () => ({
  SyzygyExplorerSmart: () => <div data-testid="syzygy" />,
}));

describe("SmartPanel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows history when INFO_TAB is active", () => {
    (useSelector as jest.Mock).mockImplementation((fn: (s: { panelTab: PanelTabType }) => unknown) =>
      fn({ panelTab: PanelTabType.INFO_TAB })
    );

    render(<SmartPanel />);
    expect(screen.getByTestId("history-panel")).toBeInTheDocument();
  });

  it("shows explorers when BOOK_TAB is active", () => {
    (useSelector as jest.Mock).mockImplementation((fn: (s: { panelTab: PanelTabType }) => unknown) =>
      fn({ panelTab: PanelTabType.BOOK_TAB })
    );

    render(<SmartPanel />);
    expect(screen.getByTestId("opening-explorer")).toBeInTheDocument();
    expect(screen.getByTestId("games-db")).toBeInTheDocument();
    expect(screen.getByTestId("syzygy")).toBeInTheDocument();
  });
});
