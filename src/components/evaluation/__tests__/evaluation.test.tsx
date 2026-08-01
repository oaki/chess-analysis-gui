jest.mock("../../../store", () => ({
  store: { dispatch: jest.fn(), getState: jest.fn(() => ({})), subscribe: jest.fn(() => jest.fn()) },
  useAppStore: jest.fn((sel) => sel({ evaluation: [], fen: "", settings: { showEvaluation: true } })),
}));

jest.mock("../../../services/errorManager", () => ({
  Flash: { info: jest.fn(), error: jest.fn() },
  errorReducers: jest.fn(() => []),
}));

import React from "react";
import { render, screen } from "@testing-library/react";
import { EvalHeader, getScore, getNodes, getTime, splitPv } from "../evaluation";
import { LINE_MAP } from "../../../interfaces";

const makeEval = (overrides = {}) => ({
  [LINE_MAP.score]: "0.5",
  [LINE_MAP.depth]: 18,
  [LINE_MAP.pv]: "e2e4 e7e5 g1f3",
  [LINE_MAP.nodes]: 1234567,
  [LINE_MAP.time]: "3000",
  [LINE_MAP.tbhits]: "0",
  [LINE_MAP.multipv]: "1",
  [LINE_MAP.mate]: false,
  ...overrides,
});

describe("splitPv", () => {
  it("splits UCI move string by space", () => {
    expect(splitPv("e2e4 e7e5 g1f3")).toEqual(["e2e4", "e7e5", "g1f3"]);
  });

  it("returns empty array for non-string input", () => {
    expect(splitPv(null as unknown as string)).toEqual([]);
  });

  it("returns single element array for one move", () => {
    expect(splitPv("e2e4")).toEqual(["e2e4"]);
  });
});

describe("getScore", () => {
  it("returns numeric score when no mate", () => {
    expect(getScore(makeEval({ [LINE_MAP.score]: "1.25", [LINE_MAP.mate]: false }))).toBe(1.25);
  });

  it("returns mate string when mate is set", () => {
    expect(getScore(makeEval({ [LINE_MAP.mate]: 3 }))).toBe("#3");
  });
});

describe("getNodes", () => {
  it("formats nodes in millions", () => {
    expect(String(getNodes(makeEval({ [LINE_MAP.nodes]: 5000000 })))).toContain("M");
  });

  it("formats nodes in thousands", () => {
    expect(String(getNodes(makeEval({ [LINE_MAP.nodes]: 5000 })))).toContain("K");
  });

  it("returns 0 when nodes is undefined", () => {
    expect(getNodes(makeEval({ [LINE_MAP.nodes]: undefined }))).toBe(0);
  });
});

describe("getTime", () => {
  it("formats time in seconds", () => {
    expect(getTime(makeEval({ [LINE_MAP.time]: "3000" }))).toBe("3s");
  });

  it("returns 0 when time is missing", () => {
    expect(getTime(makeEval({ [LINE_MAP.time]: undefined }))).toBe(0);
  });
});

describe("EvalHeader", () => {
  it("renders without crashing", () => {
    render(<EvalHeader name="Stockfish" evaluation={makeEval()} />);
    expect(screen.getByText("Stockfish")).toBeTruthy();
  });

  it("shows nodes and time", () => {
    render(<EvalHeader name="Engine" evaluation={makeEval()} />);
    expect(screen.getByText(/Nodes:/)).toBeTruthy();
    expect(screen.getByText(/Time:/)).toBeTruthy();
  });
});
