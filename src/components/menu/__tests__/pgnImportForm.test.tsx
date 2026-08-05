import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { PgnImportForm } from "../pgnImportForm";
import { ApiManagerService } from "../../../services/apiManager";
import { SessionManagerService } from "../../../services/sessionManager";

const dispatchMock = jest.fn();

jest.mock("../../../store", () => ({
  __esModule: true,
  store: {
    dispatch: (...args) => dispatchMock(...args),
  },
  useAppStore: jest.fn(),
}));

jest.mock("../../../services/apiManager", () => ({
  ApiManagerService: {
    importGameFromPgn: jest.fn(),
  },
}));

jest.mock("../../../services/sessionManager", () => ({
  SessionManagerService: {
    getToken: jest.fn(),
  },
}));

describe("PgnImportForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows error when token is missing", async () => {
    (SessionManagerService.getToken as jest.Mock).mockReturnValue(null);

    render(<PgnImportForm />);
    fireEvent.change(screen.getByPlaceholderText("e.g. 1. e4 e5 2. Nf3..."), {
      target: { value: "1. e4 e5" },
    });
    fireEvent.click(screen.getByText("Import"));

    await waitFor(() =>
      expect(screen.getByText("Import failed. Token is not valid.")).toBeInTheDocument()
    );
  });

  it("imports pgn and dispatches reset flow", async () => {
    (SessionManagerService.getToken as jest.Mock).mockReturnValue("token");
    (ApiManagerService.importGameFromPgn as jest.Mock).mockResolvedValue({
      moves: JSON.stringify([{ id: 1 }]),
    });

    render(<PgnImportForm />);
    fireEvent.change(screen.getByPlaceholderText("e.g. 1. e4 e5 2. Nf3..."), {
      target: { value: "1. e4 e5 2. Nf3 Nc6" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Import" }).closest("form")!);

    await waitFor(() => {
      expect(ApiManagerService.importGameFromPgn).toHaveBeenCalledWith(
        "1. e4 e5 2. Nf3 Nc6",
        "token"
      );
      expect(dispatchMock).toHaveBeenCalled();
    });
  });
});
