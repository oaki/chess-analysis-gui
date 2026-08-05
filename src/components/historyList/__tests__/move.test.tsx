import React from "react";
import { render, screen } from "@testing-library/react";
import { Move, MoveNumber } from "../move";
import { NODE_MAP } from "../../moveTree/tree";
import { IHistoryMove } from "../../history/historyReducers";

jest.mock("../../moveTree/tree", () => ({
  NODE_MAP: {
    shortNotation: "sn",
    id: "id",
    fen: "f",
    variants: "v",
    moves: "m",
  },
  treeService: { getCounter: jest.fn(() => 1) },
  FIRST_ID: 0,
  NodeVariant: {},
}));

const fakeMove: IHistoryMove = {
  id: 1,
  parentId: 0,
  fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
  notation: "e4",
  shortNotation: "e4",
  [NODE_MAP.shortNotation as string]: "e4",
} as unknown as IHistoryMove;

describe("MoveNumber", () => {
  it("renders move number for even index", () => {
    render(<MoveNumber index={0} />);
    expect(screen.getByText(/1\./)).toBeTruthy();
  });

  it("returns null for odd index", () => {
    const { container } = render(<MoveNumber index={1} />);
    expect(container.querySelector(".fs-xs")).toBeNull();
  });

  it("increments counter every 2 moves", () => {
    render(<MoveNumber index={2} />);
    expect(screen.getByText(/2\./)).toBeTruthy();
  });
});

describe("Move", () => {
  it("renders move notation", () => {
    render(<Move move={fakeMove} index={0} />);
    expect(screen.getByText(/e4/)).toBeTruthy();
  });
});
