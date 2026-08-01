jest.mock("../../../store", () => ({
  store: { dispatch: jest.fn(), getState: jest.fn(() => ({})), subscribe: jest.fn(() => jest.fn()) },
  useAppStore: jest.fn((sel) => sel({ fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", lastMoveId: 0, settings: { showEvaluation: true } })),
}));

jest.mock("../../../services/errorManager", () => ({
  Flash: { info: jest.fn(), error: jest.fn() },
  errorReducers: jest.fn(() => []),
}));

jest.mock("../useStockFish", () => ({
  useStockFishWorker: jest.fn(() => null),
}));

jest.mock("../evaluation", () => ({
  Eval: () => <div data-testid="eval-panel" />,
  splitPv: (pv: string) => pv.split(" "),
}));

jest.mock("components/ui/formComponents", () => ({
  StyledBtn: ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
  StyledBtnText: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  StyledFormWrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  StyledInput: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
  StyledLabel: ({ children }: { children: React.ReactNode }) => <label>{children}</label>,
  StyledPairsWrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import React from "react";
import { render, screen } from "@testing-library/react";
import { SmartStockFish } from "../offlineStockfishEvaluation";

describe("SmartStockFish", () => {
  it("renders toggle button", () => {
    render(<SmartStockFish />);
    expect(screen.getByText(/Stockfish on phone/i)).toBeTruthy();
  });
});
