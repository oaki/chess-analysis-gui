jest.mock("../../../services/apiManager", () => ({
  ApiManagerService: {
    pairGoogleTokenAndTemporaryToken: jest.fn().mockResolvedValue({}),
  },
}));

jest.mock("../../../libs/logger", () => ({
  Log: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
  logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn() },
}));

import React from "react";
import { render, screen } from "@testing-library/react";
import { VerifyGoogleResponse } from "../verifyGoogleResponse";

describe("VerifyGoogleResponse", () => {
  beforeEach(() => {
    Object.defineProperty(window, "location", {
      value: { ...window.location, hash: "", href: "" },
      writable: true,
    });
  });

  it("renders the back instruction", () => {
    render(<VerifyGoogleResponse />);
    expect(screen.getByText(/back/i)).toBeTruthy();
  });

  it("renders the app container", () => {
    const { container } = render(<VerifyGoogleResponse />);
    expect(container.querySelector(".app")).toBeTruthy();
  });
});
