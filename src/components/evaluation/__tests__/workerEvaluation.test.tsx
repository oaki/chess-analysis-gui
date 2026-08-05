jest.mock("../../../store", () => ({
  store: { dispatch: jest.fn(), getState: jest.fn(() => ({})), subscribe: jest.fn(() => jest.fn()) },
  useAppStore: jest.fn((sel) => sel({ workers: [] })),
}));

jest.mock("../../../services/errorManager", () => ({
  Flash: { info: jest.fn(), error: jest.fn() },
  errorReducers: jest.fn(() => []),
}));

import React from "react";
import { render, screen } from "@testing-library/react";
import { WorkerEvaluation } from "../workerEvaluation";

describe("WorkerEvaluation", () => {
  it("renders without crashing", () => {
    render(<WorkerEvaluation />);
    expect(screen.getByText("WorkerEvaluation")).toBeTruthy();
  });
});
