jest.mock("../../store", () => ({
  store: { dispatch: jest.fn(), getState: jest.fn(() => ({})), subscribe: jest.fn(() => jest.fn()) },
  useAppStore: jest.fn((sel) => sel({ historyList: [], loading: false, user: null })),
}));

jest.mock("../../services/errorManager", () => ({
  Flash: { info: jest.fn(), error: jest.fn() },
  errorReducers: jest.fn(() => []),
}));

jest.mock("../../services/sessionManager", () => ({
  SessionManagerService: { getToken: jest.fn(() => null) },
}));

jest.mock("../../components/historyList/smartHistoryList", () => ({
  SmartHistoryList: () => <div data-testid="history-list" />,
}));

jest.mock("../../components/menu/menu", () => ({
  MenuWithRouter: () => <div data-testid="menu" />,
}));

jest.mock("../../components/Header", () => ({
  Header: ({ title }: { title: string }) => <div>{title}</div>,
}));

import React from "react";
import { render, screen } from "@testing-library/react";
import { HistoryPage, loadHistoryGames } from "../historyPage";

describe("HistoryPage", () => {
  it("renders without crashing", () => {
    render(<HistoryPage />);
    expect(screen.getByTestId("history-list")).toBeTruthy();
  });

  it("renders menu", () => {
    render(<HistoryPage />);
    expect(screen.getByTestId("menu")).toBeTruthy();
  });
});

describe("loadHistoryGames", () => {
  it("returns early when no token", async () => {
    const { SessionManagerService } = require("../../services/sessionManager");
    SessionManagerService.getToken.mockReturnValue(null);
    await expect(loadHistoryGames()).resolves.toBeUndefined();
  });
});
