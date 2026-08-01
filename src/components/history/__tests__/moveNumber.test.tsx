import React from "react";
import { render, screen } from "@testing-library/react";
import { MoveNumber } from "../moveNumber";

const BLACK_FEN = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1";
const WHITE_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

describe("MoveNumber", () => {
  it("renders move number for black to move", () => {
    render(<MoveNumber fen={BLACK_FEN} counter={2} />);
    expect(screen.getByText("1.")).toBeTruthy();
  });

  it("returns null when white to move", () => {
    const { container } = render(<MoveNumber fen={WHITE_FEN} counter={1} />);
    expect(container.firstChild).toBeNull();
  });

  it("shows the full-move number from FEN", () => {
    // FEN with move 5, black to move
    const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 5";
    render(<MoveNumber fen={fen} counter={10} />);
    expect(screen.getByText("5.")).toBeTruthy();
  });
});
