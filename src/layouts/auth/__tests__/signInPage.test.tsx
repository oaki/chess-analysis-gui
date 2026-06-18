import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SignInPage } from "../signInPage";
import { useFetch } from "../../../components/hooks/useFetch";
import { SessionManagerService } from "../../../services/sessionManager";

jest.mock("../../../libs/stateCompat", () => ({
  connect: () => (Component) => Component,
}));

jest.mock("@react-oauth/google", () => ({
  GoogleLogin: ({ onSuccess, onError }) => (
    <div>
      <button onClick={() => onSuccess({ credential: "token-id" })}>
        google-success
      </button>
      <button onClick={() => onError(new Error("fail"))}>google-fail</button>
    </div>
  ),
}));

jest.mock("../../../components/hooks/useFetch", () => ({
  useFetch: jest.fn(),
}));

jest.mock("../../../services/sessionManager", () => ({
  SessionManagerService: {
    setToken: jest.fn(),
    getTemporaryToken: jest.fn(() => null),
    setTemporaryToken: jest.fn(),
    removeTemporaryToken: jest.fn(),
  },
}));

jest.mock("../../../services/errorManager", () => ({
  Flash: {
    error: jest.fn(),
  },
}));

describe("SignInPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    });
  });

  it("triggers auth register on google success", async () => {
    const doFetch = jest.fn();
    (useFetch as jest.Mock).mockReturnValue([{ isError: false, response: null }, doFetch]);

    render(<SignInPage />);

    fireEvent.click(screen.getByText("google-success"));

    expect(doFetch).toHaveBeenCalledTimes(1);
  });

  it("stores session token and redirects on auth response", async () => {
    (useFetch as jest.Mock).mockReturnValue([
      {
        isError: false,
        response: { token: "jwt-1" },
      },
      jest.fn(),
    ]);

    render(<SignInPage />);

    await waitFor(() => {
      expect(SessionManagerService.setToken).toHaveBeenCalledWith("jwt-1");
      expect(window.location.href).toBe("/");
    });
  });
});
