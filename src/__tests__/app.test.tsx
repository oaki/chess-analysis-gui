import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { ChessApp } from "../app";
import { useSessionBootstrap } from "../hooks/useSessionBootstrap";

jest.mock("../hooks/useSessionBootstrap", () => ({
  useSessionBootstrap: jest.fn(),
}));

jest.mock("../services/sessionManager", () => ({
  SessionManagerService: {
    getToken: jest.fn(() => "token"),
  },
}));

jest.mock("../store", () => ({
  __esModule: true,
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({ user: { isLoggedIn: false } })),
  },
  useAppStore: jest.fn(),
}));

jest.mock("../libs/privateRoute", () => ({
  PrivateRoute: ({ children }: { children: React.ReactNode }) => <div data-testid="private-route">{children}</div>,
}));

jest.mock("../services/sockets/actions", () => ({
  connectSocket: jest.fn(() => ({ type: "CONNECT_SOCKET" })),
}));

describe("ChessApp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loader when bootstrap is not loaded", () => {
    (useSessionBootstrap as jest.Mock).mockReturnValue({
      isLoaded: false,
      profileError: false,
      historyError: false,
    });

    const { container } = render(<ChessApp />);
    expect(container.querySelector(".full-loading")).toBeInTheDocument();
  });

  it("renders profile error when bootstrap profile fails", () => {
    (useSessionBootstrap as jest.Mock).mockReturnValue({
      isLoaded: true,
      profileError: true,
      historyError: false,
    });

    render(<ChessApp />);
    expect(screen.getByText("Problem to load user profile")).toBeInTheDocument();
  });

  it("renders routes section when bootstrap succeeds", async () => {
    (useSessionBootstrap as jest.Mock).mockReturnValue({
      isLoaded: true,
      profileError: false,
      historyError: false,
    });

    const { container } = render(<ChessApp />);
    // Full-loading spinner should be gone; app wrapper should be present
    await waitFor(() => {
      expect(container.querySelector(".full-loading")).not.toBeInTheDocument();
    });
    // The StyledApp wrapper is rendered (routes section is active)
    expect(container.querySelector("div")).toBeTruthy();
  });

  it("renders history error when bootstrap history fails", () => {
    (useSessionBootstrap as jest.Mock).mockReturnValue({
      isLoaded: true,
      profileError: false,
      historyError: true,
    });

    render(<ChessApp />);
    expect(screen.getByText("Problem to load user history")).toBeInTheDocument();
  });
});
