import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SmartHistoryList } from "../smartHistoryList";

const dispatchMock = jest.fn();
const useSelectorMock = jest.fn();
const navigateMock = jest.fn();

jest.mock("../../../layouts/historyPage", () => ({
  loadHistoryGames: jest.fn(),
}));

jest.mock("../../../store", () => ({
  __esModule: true,
  store: {
    dispatch: (...args) => dispatchMock(...args),
    getState: () => ({ user: { isLoggedIn: true } }),
  },
  useAppStore: jest.fn(),
}));

jest.mock("../../../libs/stateCompat", () => ({
  connect: () => (Component) => Component,
  useSelector: (selector) => useSelectorMock(selector),
}));

jest.mock("../../hooks/useFetch", () => ({
  useFetch: jest.fn(() => [{ response: null }, jest.fn()]),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => navigateMock,
}));

describe("SmartHistoryList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders history list and loads selected game", () => {
    useSelectorMock.mockReturnValue([
      {
        id: 1,
        updated_at: "2024-01-01",
        moves: [{ id: 1, s: "e4", notation: "e2e4", fen: "f", parentId: 0 }],
      },
    ]);

    render(
      <MemoryRouter>
        <SmartHistoryList />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("01.01.2024"));
    expect(dispatchMock).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  it("renders empty list when no history games exist", () => {
    useSelectorMock.mockReturnValue([]);
    const { container } = render(
      <MemoryRouter>
        <SmartHistoryList />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeTruthy();
  });
});
